import { IsUUID, IsNumber } from 'class-validator';

export class EarlyPaymentDiscountDto {
  @IsUUID()
  creditCardExpenseGeneratorId: string;

  @IsNumber()
  totalDiscount: number;
}
