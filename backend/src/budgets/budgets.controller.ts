import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';

@ApiTags('Budgets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('budgets')
export class BudgetsController {
  constructor(private budgetsService: BudgetsService) {}

  @Post()
  @ApiOperation({ summary: 'Create or update a budget' })
  create(@Request() req, @Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetsService.create(req.user.userId, createBudgetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all budgets or filter by month/year' })
  findAll(@Request() req, @Query('month') month?: number, @Query('year') year?: number) {
    if (month && year) {
      return this.budgetsService.findByMonth(req.user.userId, month, year);
    }
    return this.budgetsService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single budget' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.budgetsService.findById(id, req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a budget' })
  update(@Request() req, @Param('id') id: string, @Body() updateDto: Partial<CreateBudgetDto>) {
    return this.budgetsService.update(id, req.user.userId, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a budget' })
  delete(@Request() req, @Param('id') id: string) {
    return this.budgetsService.delete(id, req.user.userId);
  }
}
