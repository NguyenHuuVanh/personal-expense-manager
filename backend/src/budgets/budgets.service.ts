import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Budget } from './schemas/budget.schema';
import { CreateBudgetDto } from './dto/create-budget.dto';

@Injectable()
export class BudgetsService {
  constructor(@InjectModel(Budget.name) private budgetModel: Model<Budget>) {}

  async create(userId: string, createBudgetDto: CreateBudgetDto): Promise<Budget> {
    const budget = await this.budgetModel.findOneAndUpdate(
      {
        userId: new Types.ObjectId(userId),
        period: createBudgetDto.period || 'monthly',
        categoryId: createBudgetDto.categoryId ? new Types.ObjectId(createBudgetDto.categoryId) : null,
      },
      {
        userId: new Types.ObjectId(userId),
        categoryId: createBudgetDto.categoryId ? new Types.ObjectId(createBudgetDto.categoryId) : undefined,
        budgetAmount: createBudgetDto.budgetAmount,
        period: createBudgetDto.period || 'monthly',
        startDate: new Date(createBudgetDto.startDate),
        endDate: new Date(createBudgetDto.endDate),
        isActive: createBudgetDto.isActive !== false,
      },
      { upsert: true, new: true },
    );
    return budget;
  }

  async findAll(userId: string): Promise<Budget[]> {
    return this.budgetModel.find({ userId: new Types.ObjectId(userId) }).populate('categoryId').exec();
  }

  async findByMonth(userId: string, month: number, year: number): Promise<Budget[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    return this.budgetModel.find({
      userId: new Types.ObjectId(userId),
      startDate: { $lte: endDate },
      endDate: { $gte: startDate },
    }).populate('categoryId').exec();
  }

  async findById(id: string, userId: string): Promise<Budget> {
    const budget = await this.budgetModel.findOne({ _id: id, userId: new Types.ObjectId(userId) }).populate('categoryId').exec();
    if (!budget) throw new NotFoundException('Budget not found');
    return budget;
  }

  async update(id: string, userId: string, updateDto: Partial<CreateBudgetDto>): Promise<Budget> {
    const budget = await this.budgetModel
      .findOneAndUpdate(
        { _id: id, userId: new Types.ObjectId(userId) },
        {
          ...updateDto,
          categoryId: updateDto.categoryId ? new Types.ObjectId(updateDto.categoryId) : undefined,
          startDate: updateDto.startDate ? new Date(updateDto.startDate) : undefined,
          endDate: updateDto.endDate ? new Date(updateDto.endDate) : undefined,
        },
        { new: true },
      )
      .populate('categoryId')
      .exec();
    if (!budget) throw new NotFoundException('Budget not found');
    return budget;
  }

  async delete(id: string, userId: string): Promise<void> {
    const result = await this.budgetModel.deleteOne({ _id: id, userId: new Types.ObjectId(userId) }).exec();
    if (result.deletedCount === 0) throw new NotFoundException('Budget not found');
  }
}
