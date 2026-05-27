import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';

@ApiTags('Wallets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallets')
export class WalletsController {
  constructor(private walletsService: WalletsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new wallet' })
  create(@Request() req, @Body() createWalletDto: CreateWalletDto) {
    return this.walletsService.create(req.user.userId, createWalletDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all wallets for current user' })
  findAll(@Request() req) {
    return this.walletsService.findAllByUser(req.user.userId);
  }

  @Get('balance')
  @ApiOperation({ summary: 'Get total balance across all wallets' })
  getTotalBalance(@Request() req) {
    return this.walletsService.getTotalBalance(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single wallet' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.walletsService.findById(id, req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a wallet' })
  update(@Request() req, @Param('id') id: string, @Body() updateDto: Partial<CreateWalletDto>) {
    return this.walletsService.update(id, req.user.userId, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a wallet' })
  delete(@Request() req, @Param('id') id: string) {
    return this.walletsService.delete(id, req.user.userId);
  }
}
