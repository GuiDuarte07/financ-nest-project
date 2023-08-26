import { PartialType } from '@nestjs/mapped-types';
import { CreateCreditCardExpenseDto } from './create-credit-card-expense.dto';
/* import { IsDateString, IsOptional } from 'class-validator';
 */
export class UpdateCreditCardExpenseDto extends PartialType(
  CreateCreditCardExpenseDto,
) {
  /* @IsOptional()
  @IsDateString()
  invoiceDate?: Date; */
}
