import { IsEnum, IsNumber, IsString } from 'class-validator';
import { AccountTypes } from '../enums/AccountType';

export class CreateAccountDto {
  @IsNumber()
  balance: number;

  @IsString()
  description: string;

  @IsString()
  bank: string;

  color?: string;

  @IsEnum(AccountTypes)
  type: string;
}
