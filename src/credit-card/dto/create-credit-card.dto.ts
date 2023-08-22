import { IsEnum, IsInt, IsString, IsUUID, Max, Min } from 'class-validator';
import { CreditTypes } from '../enums/CreditTypes';

export class CreateCreditCardDto {
  @IsInt()
  limit: number;

  @IsString()
  description: string;

  @IsString()
  cardBrand: string;

  @IsUUID()
  accountId: string;

  @IsEnum(CreditTypes)
  type: string; //CreditTypes

  @IsInt()
  @Min(1)
  @Max(31)
  closeDay: number; //Dia de fechamento da fatura

  @IsInt()
  @Min(1)
  @Max(31)
  expirationDay: number; // Dia de vencimento da fatura
}
