import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('monthly')
  @ApiOperation({ summary: 'Get monthly summary (total income, expense, balance)' })
  getMonthlySummary(@Request() req, @Query('month') month: number, @Query('year') year: number) {
    return this.reportsService.getMonthlySummary(req.user.userId, month, year);
  }

  @Get('by-category')
  @ApiOperation({ summary: 'Get expenses grouped by category' })
  getByCategory(@Request() req, @Query('month') month: number, @Query('year') year: number) {
    return this.reportsService.getByCategory(req.user.userId, month, year);
  }

  @Get('daily')
  @ApiOperation({ summary: 'Get daily expenses for a month' })
  getDailyTrend(@Request() req, @Query('month') month: number, @Query('year') year: number) {
    return this.reportsService.getDailyTrend(req.user.userId, month, year);
  }

  @Get('overview')
  @ApiOperation({ summary: 'Get overview summary (income, expense, trend) within a date range' })
  getOverview(
    @Request() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    return this.reportsService.getOverview(req.user.userId, start, end);
  }
}
