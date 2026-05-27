import { Controller, Post, Get, Put, Body, UseGuards, Request, UnauthorizedException, ConflictException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const token = this.authService.generateToken(user._id.toString(), user.email);
    return { user: { id: user._id, name: user.name, email: user.email }, token };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.authService.generateToken(user._id.toString(), user.email);
    return { user: { id: user._id, name: user.name, email: user.email }, token };
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: (user as any).avatar,
      settings: (user as any).settings,
    };
  }

  @Put('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update current user profile' })
  async updateProfile(@Request() req, @Body() body: { name?: string; email?: string; currentPassword?: string; newPassword?: string; settings?: any }) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (body.name) (user as any).name = body.name;
    if (body.email) (user as any).email = body.email.toLowerCase();
    if (body.settings) (user as any).settings = { ...(user as any).settings, ...body.settings };

    if (body.newPassword) {
      if (!body.currentPassword) {
        throw new UnauthorizedException('Current password required');
      }
      const isValid = await bcrypt.compare(body.currentPassword, user.password);
      if (!isValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }
      (user as any).password = await bcrypt.hash(body.newPassword, 10);
    }

    await user.save();

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: (user as any).avatar,
      settings: (user as any).settings,
    };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Request() req) {
    const refreshToken = req.body?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token required');
    }

    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      const token = this.authService.generateToken(user._id.toString(), user.email);
      return { token };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Logout user' })
  logout() {
    return { message: 'Logged out successfully' };
  }
}
