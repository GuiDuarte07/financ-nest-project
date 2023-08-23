import { Module } from '@nestjs/common';
import { CreditCardExpenseService } from './credit-card-expense.service';
import { CreditCardExpenseController } from './credit-card-expense.controller';

@Module({
  controllers: [CreditCardExpenseController],
  providers: [CreditCardExpenseService],
})
export class CreditCardExpenseModule {}
