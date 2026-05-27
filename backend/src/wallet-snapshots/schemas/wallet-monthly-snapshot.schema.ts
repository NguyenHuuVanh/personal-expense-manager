import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class WalletMonthlySnapshot extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Wallet', required: true })
  walletId: Types.ObjectId;

  @Prop({ required: true })
  monthKey: string;

  @Prop({ required: true })
  startBalance: number;

  @Prop({ default: 0 })
  totalIncome: number;

  @Prop({ default: 0 })
  totalExpense: number;

  @Prop({ required: true })
  endBalance: number;

  @Prop({ default: 0 })
  transactionCount: number;

  @Prop({ default: 'VND' })
  currency: string;

  @Prop({ default: false })
  isCurrentMonth: boolean;

  @Prop({ default: Date.now })
  computedAt: Date;
}

export const WalletMonthlySnapshotSchema = SchemaFactory.createForClass(WalletMonthlySnapshot);
