import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Goal } from './schemas/goal.schema';
import { CreateGoalDto, UpdateGoalDto } from './dto/create-goal.dto';

@Injectable()
export class GoalsService {
  constructor(@InjectModel(Goal.name) private goalModel: Model<Goal>) {}

  async create(userId: string, createGoalDto: CreateGoalDto): Promise<Goal> {
    const deadline = new Date(createGoalDto.deadline);
    if (deadline <= new Date()) {
      throw new BadRequestException('Deadline must be in the future');
    }

    const goal = new this.goalModel({
      name: createGoalDto.name,
      targetAmount: createGoalDto.targetAmount,
      deadline,
      icon: createGoalDto.icon || 'piggy-bank',
      color: createGoalDto.color || '#827BF2',
      userId: new Types.ObjectId(userId),
      currentAmount: 0,
    });
    return goal.save();
  }

  async findAllByUser(userId: string, filter?: 'all' | 'active' | 'completed'): Promise<Goal[]> {
    const query: any = { userId: new Types.ObjectId(userId) };
    
    if (filter === 'active') {
      query.isCompleted = false;
    } else if (filter === 'completed') {
      query.isCompleted = true;
    }

    return this.goalModel.find(query).sort({ deadline: 1 }).exec();
  }

  async findById(id: string, userId: string): Promise<Goal> {
    const goal = await this.goalModel.findOne({ _id: id, userId: new Types.ObjectId(userId) }).exec();
    if (!goal) throw new NotFoundException('Goal not found');
    return goal;
  }

  async update(id: string, userId: string, updateDto: UpdateGoalDto): Promise<Goal> {
    if (updateDto.deadline && new Date(updateDto.deadline) <= new Date()) {
      throw new BadRequestException('Deadline must be in the future');
    }

    const updateData: any = { ...updateDto };
    if (updateDto.isCompleted === true && !updateData.completedAt) {
      updateData.completedAt = new Date();
    }

    const goal = await this.goalModel
      .findOneAndUpdate({ _id: id, userId: new Types.ObjectId(userId) }, updateData, { new: true })
      .exec();
    if (!goal) throw new NotFoundException('Goal not found');
    return goal;
  }

  async addContribution(id: string, userId: string, amount: number): Promise<Goal> {
    const goal = await this.findById(id, userId);
    
    if (goal.isCompleted) {
      throw new BadRequestException('Goal is already completed');
    }

    const newAmount = goal.currentAmount + amount;
    const isCompleted = newAmount >= goal.targetAmount;

    goal.currentAmount = newAmount;
    if (isCompleted && !goal.isCompleted) {
      goal.isCompleted = true;
      goal.completedAt = new Date();
    }

    return goal.save();
  }

  async delete(id: string, userId: string): Promise<void> {
    const result = await this.goalModel.deleteOne({ _id: id, userId: new Types.ObjectId(userId) }).exec();
    if (result.deletedCount === 0) throw new NotFoundException('Goal not found');
  }
}
