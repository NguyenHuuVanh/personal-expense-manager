import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletSnapshotsService } from './wallet-snapshots.service';
import { WalletSnapshotsController } from './wallet-snapshots.controller';
import { WalletMonthlySnapshot, WalletMonthlySnapshotSchema } from './schemas/wallet-monthly-snapshot.schema';
import { Transaction, TransactionSchema } from '../transactions/schemas/transaction.schema';
import { Wallet, WalletSchema } from '../wallets/schemas/wallet.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WalletMonthlySnapshot.name, schema: WalletMonthlySnapshotSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: Wallet.name, schema: WalletSchema },
    ]),
  ],
  controllers: [WalletSnapshotsController],
  providers: [WalletSnapshotsService],
})
export class WalletSnapshotsModule {}
