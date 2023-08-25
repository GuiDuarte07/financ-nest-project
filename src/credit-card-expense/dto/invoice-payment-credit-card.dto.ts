import { IsBoolean } from 'class-validator';

export class CreditCardInvoicePaymentDTO {
  @IsBoolean()
  paidOut: boolean;
}
