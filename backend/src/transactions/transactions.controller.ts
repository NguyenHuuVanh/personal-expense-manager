import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { QueryTransactionDto } from './dto/query-transaction.dto';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  create(@Request() req, @Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(req.user.userId, createTransactionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions with filters and pagination' })
  findAll(@Request() req, @Query() query: QueryTransactionDto) {
    return this.transactionsService.findAll(req.user.userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single transaction' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.transactionsService.findOne(id, req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a transaction' })
  update(@Request() req, @Param('id') id: string, @Body() updateDto: Partial<CreateTransactionDto>) {
    return this.transactionsService.update(id, req.user.userId, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a transaction' })
  delete(@Request() req, @Param('id') id: string) {
    return this.transactionsService.delete(id, req.user.userId);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete multiple transactions' })
  deleteMany(@Request() req, @Body('ids') ids: string[]) {
    return this.transactionsService.deleteMany(ids, req.user.userId);
  }
}
