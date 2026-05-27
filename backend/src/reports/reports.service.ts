import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction } from '../transactions/schemas/transaction.schema';

@Injectable()
export class ReportsService {
  constructor(@InjectModel(Transaction.name) private transactionModel: Model<Transaction>) {}

  async getMonthlySummary(userId: string, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const result = await this.transactionModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const income = result.find((r) => r._id === 'income')?.total || 0;
    const expense = result.find((r) => r._id === 'expense')?.total || 0;

    return { income, expense, balance: income - expense, month, year };
  }

  async getByCategory(userId: string, month: number, year: number, type: 'income' | 'expense' = 'expense') {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    return this.transactionModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate },
          type,
        },
      },
      {
        $group: {
          _id: '$categoryId',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      { $sort: { total: -1 } },
    ]);
  }

  async getDailyTrend(userId: string, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    return this.transactionModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: '$date' },
          totalExpense: {
            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] },
          },
          totalIncome: {
            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  async getOverview(userId: string, startDate: Date, endDate: Date) {
    const userObjectId = new Types.ObjectId(userId);
    
    const [currentSummary, prevSummary] = await Promise.all([
      this.transactionModel.aggregate([
        { $match: { userId: userObjectId, date: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: '$type', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      this.getPreviousPeriodSummary(userId, startDate, endDate),
    ]);

    let totalIncome = 0, incomeCount = 0, totalExpense = 0, expenseCount = 0;
    let prevIncome = 0, prevExpense = 0;

    currentSummary.forEach((s) => {
      if (s._id === 'income') { totalIncome = s.total; incomeCount = s.count; }
      else { totalExpense = s.total; expenseCount = s.count; }
    });

    prevSummary.forEach((s) => {
      if (s._id === 'income') prevIncome = s.total;
      else prevExpense = s.total;
    });

    const netBalance = totalIncome - totalExpense;
    const incomeTrend = prevIncome > 0 ? ((totalIncome - prevIncome) / prevIncome) * 100 : (totalIncome > 0 ? 100 : 0);
    const expenseTrend = prevExpense > 0 ? ((totalExpense - prevExpense) / prevExpense) * 100 : (expenseCount > 0 ? 100 : 0);

    return {
      totalIncome,
      totalExpense,
      incomeCount,
      expenseCount,
      netBalance,
      incomeTrend: Math.round(incomeTrend * 10) / 10,
      expenseTrend: Math.round(expenseTrend * 10) / 10,
    };
  }

  private async getPreviousPeriodSummary(userId: string, startDate: Date, endDate: Date) {
    const periodLength = endDate.getTime() - startDate.getTime();
    const prevStart = new Date(startDate.getTime() - periodLength);
    const prevEnd = new Date(startDate.getTime() - 1);

    return this.transactionModel.aggregate([
      { $match: { userId: new Types.ObjectId(userId), date: { $gte: prevStart, $lte: prevEnd } } },
      { $group: { _id: '$type', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);
  }
}
