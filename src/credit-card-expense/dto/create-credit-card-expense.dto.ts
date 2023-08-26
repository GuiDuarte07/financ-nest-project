import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateCreditCardExpenseDto {
  @MaxLength(120)
  @IsString()
  name: string;

  @IsOptional()
  justForRecord?: boolean;

  @IsNumber()
  @IsPositive()
  totalValue: number;

  @IsInt()
  @IsPositive()
  @Max(25)
  installment: number; //parcelas

  @IsOptional()
  @IsDateString()
  purchaseDate?: Date;

  @IsUUID()
  creditCardId: string;
}
