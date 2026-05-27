import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Goal extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  targetAmount: number;

  @Prop({ default: 0 })
  currentAmount: number;

  @Prop({ required: true })
  deadline: Date;

  @Prop({ default: 'piggy-bank' })
  icon: string;

  @Prop({ default: '#827BF2' })
  color: string;

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop()
  completedAt?: Date;
}

export const GoalSchema = SchemaFactory.createForClass(Goal);
