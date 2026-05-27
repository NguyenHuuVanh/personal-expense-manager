import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WalletSnapshotsService } from './wallet-snapshots.service';

@ApiTags('Wallet Snapshots')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallets/snapshots')
export class WalletSnapshotsController {
  constructor(private walletSnapshotsService: WalletSnapshotsService) {}

  @Get()
  @ApiOperation({ summary: 'Get monthly snapshots for all user wallets' })
  getSnapshots(@Request() req, @Query('monthKey') monthKey?: string) {
    const key = monthKey || this.walletSnapshotsService.getCurrentMonthKey();
    return this.walletSnapshotsService.getMonthlySnapshotsForUser(req.user.userId, key);
  }
}
