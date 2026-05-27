import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChartsService } from './charts.service';
import { ChartsController } from './charts.controller';
import { Transaction, TransactionSchema } from '../transactions/schemas/transaction.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }])],
  controllers: [ChartsController],
  providers: [ChartsService],
})
export class ChartsModule {}
