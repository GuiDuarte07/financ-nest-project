import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateIncomeDto {
  @MaxLength(120)
  @MinLength(5)
  @IsString()
  description: string;

  @IsNumber()
  value: number;

  @IsDateString()
  @IsOptional()
  receivedAt?: Date;

  @IsUUID()
  accountId: string;

  @IsUUID()
  categoryId: string;

  @IsUUID()
  @IsOptional()
  recorrenceId: string;
}
