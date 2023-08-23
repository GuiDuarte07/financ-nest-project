import { IsBoolean, IsDateString, IsOptional, IsUUID } from 'class-validator';

export class FindIncomeDto {
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @IsUUID()
  @IsOptional()
  accountId?: string;

  @IsBoolean()
  @IsOptional()
  justForRecord?: boolean;
}
