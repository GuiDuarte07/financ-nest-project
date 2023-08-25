import {
  IsBoolean,
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

  @IsUUID()
  accountId: string;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsUUID()
  recorrenceId: string;

  @IsOptional()
  @IsBoolean()
  justForRecord?: boolean;

  @IsOptional()
  @IsDateString()
  purchaseDate?: Date;
}
