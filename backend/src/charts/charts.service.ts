import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction } from '../transactions/schemas/transaction.schema';

type SubPeriod = 'day' | 'week' | 'month' | 'quarter';

export interface ChartDataItem {
  date: string;
  income: number;
  expense: number;
}

@Injectable()
export class ChartsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  async getIncomeExpense(
    userId: string,
    startDate: Date,
    endDate: Date,
    subPeriod: SubPeriod,
  ): Promise<ChartDataItem[]> {
    const userObjectId = new Types.ObjectId(userId);
    const groupExpr = this.buildGroupExpression(subPeriod);

    const result = await this.transactionModel.aggregate([
      {
        $match: {
          userId: userObjectId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: groupExpr,
          income: {
            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] },
          },
          expense: {
            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] },
          },
          minDate: { $min: '$date' },
        },
      },
      { $sort: { minDate: 1 } },
    ]);

    return result.map((r) => ({
      date: r.minDate.toISOString(),
      income: r.income || 0,
      expense: r.expense || 0,
    }));
  }

  private buildGroupExpression(subPeriod: SubPeriod) {
    if (subPeriod === 'day') {
      return {
        year: { $year: '$date' },
        month: { $month: '$date' },
        day: { $dayOfMonth: '$date' },
      };
    }
    if (subPeriod === 'week') {
      return {
        year: { $year: '$date' },
        week: { $isoWeek: '$date' },
      };
    }
    if (subPeriod === 'month') {
      return {
        year: { $year: '$date' },
        month: { $month: '$date' },
      };
    }
    // quarter
    return {
      year: { $year: '$date' },
      quarter: {
        $ceil: { $divide: [{ $month: '$date' }, 3] },
      },
    };
  }
}
