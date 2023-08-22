import {
  IsDate,
  IsNumber,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateExpenseDto {
  @MaxLength(120)
  @MinLength(5)
  @IsString()
  description: string;

  @IsNumber()
  value: number;

  @IsDate()
  purchaseDate?: Date;

  @IsUUID()
  accountId: string;
}
