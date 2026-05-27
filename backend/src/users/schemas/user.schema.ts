import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  avatar?: string;

  @Prop({ type: Object, default: () => ({}) })
  settings: {
    lowBalanceThreshold?: number;
    currency?: string;
    theme?: 'light' | 'dark' | 'system';
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
