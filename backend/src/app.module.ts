import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CategoriesModule } from './categories/categories.module';
import { BudgetsModule } from './budgets/budgets.module';
import { ReportsModule } from './reports/reports.module';
import { WalletsModule } from './wallets/wallets.module';
import { GoalsModule } from './goals/goals.module';
import { WalletSnapshotsModule } from './wallet-snapshots/wallet-snapshots.module';
import { ChartsModule } from './charts/charts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/expense_manager'),
    AuthModule,
    UsersModule,
    TransactionsModule,
    CategoriesModule,
    BudgetsModule,
    ReportsModule,
    WalletsModule,
    GoalsModule,
    WalletSnapshotsModule,
    ChartsModule,
  ],
})
export class AppModule {}
