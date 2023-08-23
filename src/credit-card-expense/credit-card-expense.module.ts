import { Module } from '@nestjs/common';
import { CreditCardExpenseService } from './credit-card-expense.service';
import { CreditCardExpenseController } from './credit-card-expense.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [],
  controllers: [CreditCardExpenseController],
  providers: [CreditCardExpenseService, PrismaService],
})
export class CreditCardExpenseModule {}
