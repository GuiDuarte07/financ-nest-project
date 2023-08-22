import {
  IsDateString,
  IsNumber,
  IsOptional,
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

  @IsDateString()
  @IsOptional()
  purchaseDate?: Date;

  @IsUUID()
  accountId: string;

  @IsUUID()
  categoryId: string;

  @IsUUID()
  @IsOptional()
  recorrenceId: string;
}
