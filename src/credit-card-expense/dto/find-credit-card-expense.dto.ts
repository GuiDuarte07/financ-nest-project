import { IsBoolean, IsDateString, IsOptional, IsUUID } from 'class-validator';

export class FindCreditCardExpenseDTO {
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @IsUUID()
  @IsOptional()
  creditCardId?: string;

  @IsBoolean()
  @IsOptional()
  justForRecord?: boolean;

  @IsUUID()
  @IsOptional()
  creditCardExpenseGeneratorId?: string;
}
