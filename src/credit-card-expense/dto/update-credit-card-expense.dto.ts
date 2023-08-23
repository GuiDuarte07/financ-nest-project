import { PartialType } from '@nestjs/mapped-types';
import { CreateCreditCardExpenseDto } from './create-credit-card-expense.dto';

export class UpdateCreditCardExpenseDto extends PartialType(
  CreateCreditCardExpenseDto,
) {}
