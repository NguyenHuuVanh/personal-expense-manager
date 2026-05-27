import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wallet } from './schemas/wallet.schema';
import { CreateWalletDto } from './dto/create-wallet.dto';

@Injectable()
export class WalletsService {
  constructor(@InjectModel(Wallet.name) private walletModel: Model<Wallet>) {}

  async create(userId: string, createWalletDto: CreateWalletDto): Promise<Wallet> {
    const userObjectId = new Types.ObjectId(userId);
    const walletCount = await this.walletModel.countDocuments({ userId: userObjectId }).exec();
    if (walletCount >= 10) {
      throw new BadRequestException('Đã đạt giới hạn 10 ví');
    }

    if (createWalletDto.isPrimary) {
      await this.walletModel.updateMany({ userId: userObjectId }, { isPrimary: false }).exec();
    }

    const isFirstWallet = walletCount === 0;
    const wallet = new this.walletModel({
      ...createWalletDto,
      userId: userObjectId,
      isPrimary: createWalletDto.isPrimary || isFirstWallet,
    });
    return wallet.save();
  }

  async findAllByUser(userId: string): Promise<Wallet[]> {
    return this.walletModel.find({ userId: new Types.ObjectId(userId) }).sort({ isPrimary: -1, createdAt: 1 }).exec();
  }

  async findById(id: string, userId: string): Promise<Wallet> {
    const wallet = await this.walletModel.findOne({ _id: id, userId: new Types.ObjectId(userId) }).exec();
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  async update(id: string, userId: string, updateDto: Partial<CreateWalletDto>): Promise<Wallet> {
    const userObjectId = new Types.ObjectId(userId);
    if (updateDto.isPrimary) {
      await this.walletModel.updateMany({ userId: userObjectId }, { isPrimary: false }).exec();
    }

    const wallet = await this.walletModel
      .findOneAndUpdate({ _id: id, userId: userObjectId }, updateDto, { new: true })
      .exec();
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  async delete(id: string, userId: string): Promise<void> {
    const wallet = await this.walletModel.findOne({ _id: id, userId: new Types.ObjectId(userId) }).exec();
    if (!wallet) throw new NotFoundException('Wallet not found');
    if (wallet.isPrimary) {
      throw new BadRequestException('Không thể xóa ví chính');
    }
    await this.walletModel.deleteOne({ _id: id, userId: new Types.ObjectId(userId) }).exec();
  }

  async updateBalance(id: string, amount: number): Promise<Wallet> {
    const wallet = await this.walletModel
      .findByIdAndUpdate(id, { $inc: { balance: amount } }, { new: true })
      .exec();
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  async getTotalBalance(userId: string): Promise<number> {
    const result = await this.walletModel.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$balance' } } },
    ]);
    return result[0]?.total || 0;
  }
}
