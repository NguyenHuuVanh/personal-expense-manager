import { Controller, Get, Query, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChartsService } from './charts.service';

type SubPeriod = 'day' | 'week' | 'month' | 'quarter';

@ApiTags('Charts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('charts')
export class ChartsController {
  constructor(private chartsService: ChartsService) {}

  @Get('income-expense')
  @ApiOperation({ summary: 'Aggregated income vs expense over a date range' })
  async getIncomeExpense(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('subPeriod') subPeriod: SubPeriod = 'day',
  ) {
    if (!startDate || !endDate) {
      throw new BadRequestException('startDate and endDate are required');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const data = await this.chartsService.getIncomeExpense(
      req.user.userId,
      start,
      end,
      subPeriod,
    );

    return { data };
  }
}
