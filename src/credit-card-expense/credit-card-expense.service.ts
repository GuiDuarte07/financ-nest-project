import { Injectable } from '@nestjs/common';
import { CreateCreditCardExpenseDto } from './dto/create-credit-card-expense.dto';
import { UpdateCreditCardExpenseDto } from './dto/update-credit-card-expense.dto';

@Injectable()
export class CreditCardExpenseService {
  create(createCreditCardExpenseDto: CreateCreditCardExpenseDto) {
    return 'This action adds a new creditCardExpense';
  }

  findAll() {
    return `This action returns all creditCardExpense`;
  }

  findOne(id: number) {
    return `This action returns a #${id} creditCardExpense`;
  }

  update(id: number, updateCreditCardExpenseDto: UpdateCreditCardExpenseDto) {
    return `This action updates a #${id} creditCardExpense`;
  }

  remove(id: number) {
    return `This action removes a #${id} creditCardExpense`;
  }
}
