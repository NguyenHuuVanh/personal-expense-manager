import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction } from './schemas/transaction.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { QueryTransactionDto } from './dto/query-transaction.dto';
import { WalletsService } from '../wallets/wallets.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    private walletsService: WalletsService,
  ) {}

  async create(userId: string, createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const transaction = new this.transactionModel({
      userId: new Types.ObjectId(userId),
      walletId: new Types.ObjectId(createTransactionDto.walletId),
      categoryId: new Types.ObjectId(createTransactionDto.categoryId),
      type: createTransactionDto.type,
      amount: createTransactionDto.amount,
      description: createTransactionDto.description,
      date: new Date(createTransactionDto.date),
      note: createTransactionDto.note,
      tags: createTransactionDto.tags,
      currency: createTransactionDto.currency || 'VND',
    });
    
    const savedTransaction = await (await transaction.save()).populate('categoryId');

    // Update wallet balance
    const balanceChange = createTransactionDto.type === 'income' 
      ? createTransactionDto.amount 
      : -createTransactionDto.amount;
    await this.walletsService.updateBalance(createTransactionDto.walletId, balanceChange);

    return savedTransaction;
  }

  async findAll(userId: string, query: QueryTransactionDto) {
    const { walletId, categoryId, type, startDate, endDate, page = 1, limit = 20 } = query;
    const filter: any = { userId: new Types.ObjectId(userId) };

    if (walletId) filter.walletId = new Types.ObjectId(walletId);
    if (categoryId) filter.categoryId = new Types.ObjectId(categoryId);
    if (type) filter.type = type;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      this.transactionModel
        .find(filter)
        .populate('walletId', 'name color')
        .populate('categoryId', 'name icon color')
        .sort({ date: -1 })
        .skip(skip)
        .limit(Number(limit))
        .exec(),
      this.transactionModel.countDocuments(filter).exec(),
    ]);

    return { data, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) };
  }

  async findOne(id: string, userId: string): Promise<Transaction> {
    const transaction = await this.transactionModel
      .findOne({ _id: id, userId: new Types.ObjectId(userId) })
      .populate('walletId', 'name color')
      .populate('categoryId', 'name icon color')
      .exec();
    if (!transaction) throw new NotFoundException('Transaction not found');
    return transaction;
  }

  async update(id: string, userId: string, updateDto: Partial<CreateTransactionDto>): Promise<Transaction> {
    const transaction = await this.transactionModel
      .findOne({ _id: id, userId: new Types.ObjectId(userId) })
      .populate('walletId', 'name color')
      .populate('categoryId', 'name icon color')
      .exec();
    
    if (!transaction) throw new NotFoundException('Transaction not found');

    // Revert old balance change
    const oldChange = transaction.type === 'income' ? transaction.amount : -transaction.amount;
    await this.walletsService.updateBalance((transaction.walletId as any)._id.toString(), -oldChange);

    // Apply update
    if (updateDto.date) updateDto.date = new Date(updateDto.date) as any;
    Object.assign(transaction, updateDto);
    const updatedTransaction = await (await transaction.save()).populate('categoryId');

    // Apply new balance change
    const newType = updateDto.type || transaction.type;
    const newAmount = updateDto.amount || transaction.amount;
    const newChange = newType === 'income' ? newAmount : -newAmount;
    const walletId = updateDto.walletId || (transaction.walletId as any)._id.toString();
    await this.walletsService.updateBalance(walletId, newChange);

    return updatedTransaction;
  }

  async delete(id: string, userId: string): Promise<void> {
    const transaction = await this.transactionModel.findOne({ _id: id, userId: new Types.ObjectId(userId) }).exec();
    if (!transaction) throw new NotFoundException('Transaction not found');

    // Revert balance change
    const balanceChange = transaction.type === 'income' 
      ? -transaction.amount 
      : transaction.amount;
    await this.walletsService.updateBalance(transaction.walletId.toString(), balanceChange);

    await this.transactionModel.deleteOne({ _id: id, userId: new Types.ObjectId(userId) }).exec();
  }

  async deleteMany(ids: string[], userId: string): Promise<number> {
    const objectIds = ids.map(id => new Types.ObjectId(id));
    const transactions = await this.transactionModel.find({
      _id: { $in: objectIds },
      userId: new Types.ObjectId(userId),
    });

    // Revert all balance changes
    for (const t of transactions) {
      const balanceChange = t.type === 'income' ? -t.amount : t.amount;
      await this.walletsService.updateBalance(t.walletId.toString(), balanceChange);
    }

    const result = await this.transactionModel.deleteMany({
      _id: { $in: objectIds },
      userId: new Types.ObjectId(userId),
    });

    return result.deletedCount || 0;
  }
}
