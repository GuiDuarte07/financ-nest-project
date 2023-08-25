import { IsOptional, IsUUID, Matches } from 'class-validator';

export class CreditCardPaymentDTO {
  @Matches(/^(0[1-9]|1[0-2])\/\d{4}$/, {
    message: 'Invalid monthYear format. Use MM/YYYY.',
  })
  monthYear: string; /*ex: 08/2023*/

  @IsOptional()
  @IsUUID()
  creditCardId?: string;
}
