import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Wallet extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({ default: 0 })
  balance: number;

  @Prop({ default: 'VND' })
  currency: string;

  @Prop()
  cardNumber?: string;

  @Prop()
  bankCode?: string;

  @Prop()
  accountNumber?: string;

  @Prop()
  accountHolder?: string;

  @Prop({ default: false })
  isPrimary: boolean;

  @Prop({ default: '#827BF2' })
  color: string;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
