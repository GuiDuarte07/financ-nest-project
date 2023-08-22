import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { ExpeInco } from '../enums/ExpoInco';

export class CreateCategoryDto {
  @MinLength(5)
  @MaxLength(50)
  @IsString()
  name: string;

  icon?: string; //Precisa ser implementado posteriomente

  color?: string; //Precisa ser implementado posteriomente

  @IsEnum(ExpeInco)
  type: string;
}
