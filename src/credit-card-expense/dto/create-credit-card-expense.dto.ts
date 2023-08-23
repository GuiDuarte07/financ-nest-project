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
  value: number;

  @IsInt()
  @Max(25)
  installment: number; //parcelas

  @IsOptional()
  @IsDateString()
  purchaseDate?: Date;

  @IsOptional()
  @IsDateString()
  invoiceDate?: Date;

  @IsUUID()
  creditCardId: string;
}
