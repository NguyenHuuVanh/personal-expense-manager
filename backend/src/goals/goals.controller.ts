import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GoalsService } from './goals.service';
import { CreateGoalDto, UpdateGoalDto } from './dto/create-goal.dto';

@ApiTags('Goals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('goals')
export class GoalsController {
  constructor(private goalsService: GoalsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new goal' })
  create(@Request() req, @Body() createGoalDto: CreateGoalDto) {
    return this.goalsService.create(req.user.userId, createGoalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all goals for current user' })
  findAll(@Request() req, @Query('filter') filter?: 'all' | 'active' | 'completed') {
    return this.goalsService.findAllByUser(req.user.userId, filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single goal' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.goalsService.findById(id, req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a goal' })
  update(@Request() req, @Param('id') id: string, @Body() updateDto: UpdateGoalDto) {
    return this.goalsService.update(id, req.user.userId, updateDto);
  }

  @Post(':id/contribute')
  @ApiOperation({ summary: 'Add contribution to a goal' })
  addContribution(@Request() req, @Param('id') id: string, @Body('amount') amount: number) {
    return this.goalsService.addContribution(id, req.user.userId, amount);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a goal' })
  delete(@Request() req, @Param('id') id: string) {
    return this.goalsService.delete(id, req.user.userId);
  }
}
