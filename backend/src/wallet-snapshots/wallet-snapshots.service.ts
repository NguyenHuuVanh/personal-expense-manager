import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WalletMonthlySnapshot } from './schemas/wallet-monthly-snapshot.schema';
import { Transaction } from '../transactions/schemas/transaction.schema';
import { Wallet } from '../wallets/schemas/wallet.schema';

const VN_TIMEZONE_OFFSET_MINUTES = 7 * 60;

@Injectable()
export class WalletSnapshotsService {
  constructor(
    @InjectModel(WalletMonthlySnapshot.name) private snapshotModel: Model<WalletMonthlySnapshot>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(Wallet.name) private walletModel: Model<Wallet>,
  ) {}

  getCurrentMonthKey(now: Date = new Date()): string {
    const vnTime = new Date(now.getTime() + VN_TIMEZONE_OFFSET_MINUTES * 60 * 1000);
    const year = vnTime.getUTCFullYear();
    const month = String(vnTime.getUTCMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  getMonthDateRangeUTC(monthKey: string): { start: Date; end: Date } {
    const [year, month] = monthKey.split('-').map(Number);
    const startVN = Date.UTC(year, month - 1, 1, 0, 0, 0, 0);
    const start = new Date(startVN - VN_TIMEZONE_OFFSET_MINUTES * 60 * 1000);
    const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const endVN = Date.UTC(year, month - 1, lastDay, 23, 59, 59, 999);
    const end = new Date(endVN - VN_TIMEZONE_OFFSET_MINUTES * 60 * 1000);
    return { start, end };
  }

  getPreviousMonthKey(monthKey: string): string {
    const [year, month] = monthKey.split('-').map(Number);
    if (month === 1) {
      return `${year - 1}-12`;
    }
    return `${year}-${String(month - 1).padStart(2, '0')}`;
  }

  async getStartBalanceForMonth(wallet: any, monthKey: string): Promise<number> {
    const prevMonthKey = this.getPreviousMonthKey(monthKey);
    const prevSnapshot = await this.snapshotModel.findOne({
      walletId: wallet._id,
      monthKey: prevMonthKey,
    }).lean();

    if (prevSnapshot) {
      return prevSnapshot.endBalance;
    }

    const { start: currentMonthStart } = this.getMonthDateRangeUTC(monthKey);
    const result = await this.transactionModel.aggregate([
      { $match: { walletId: wallet._id, date: { $gte: currentMonthStart } } },
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ]);

    let incomeAfter = 0;
    let expenseAfter = 0;
    result.forEach((row) => {
      if (row._id === 'income') incomeAfter = row.total;
      else if (row._id === 'expense') expenseAfter = row.total;
    });

    return wallet.balance - incomeAfter + expenseAfter;
  }

  async computeWalletSnapshot(wallet: any, monthKey: string): Promise<any> {
    const { start, end } = this.getMonthDateRangeUTC(monthKey);
    const currentMonthKey = this.getCurrentMonthKey();
    const isCurrentMonth = monthKey === currentMonthKey;

    const startBalance = await this.getStartBalanceForMonth(wallet, monthKey);

    const result = await this.transactionModel.aggregate([
      { $match: { walletId: wallet._id, date: { $gte: start, $lte: end } } },
      { $group: { _id: '$type', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;
    let transactionCount = 0;
    result.forEach((row) => {
      transactionCount += row.count;
      if (row._id === 'income') totalIncome = row.total;
      else if (row._id === 'expense') totalExpense = row.total;
    });

    const endBalance = startBalance + totalIncome - totalExpense;

    const snapshot = await this.snapshotModel.findOneAndUpdate(
      { walletId: wallet._id, monthKey },
      {
        $set: {
          walletId: wallet._id,
          monthKey,
          startBalance,
          totalIncome,
          totalExpense,
          endBalance,
          transactionCount,
          currency: wallet.currency,
          isCurrentMonth,
          computedAt: new Date(),
        },
      },
      { upsert: true, new: true, lean: true },
    );

    return snapshot;
  }

  async getMonthlySnapshotsForUser(userId: string, monthKey: string): Promise<any[]> {
    const wallets = await this.walletModel.find({ userId: new Types.ObjectId(userId) }).lean();

    const snapshots = await Promise.all(
      wallets.map(async (wallet) => {
        const snapshot = await this.computeWalletSnapshot(wallet, monthKey);
        return { snapshot, wallet };
      }),
    );

    return snapshots;
  }
}
