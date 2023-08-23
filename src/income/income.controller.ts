import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { IncomeService } from './income.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { IUserPayload } from 'src/user/interfaces/user';
import { FindIncomeDto } from './dto/find-income.dto';

@Controller('income')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Post()
  create(
    @Body() createIncomeDto: CreateIncomeDto,
    @CurrentUser() user: IUserPayload,
  ) {
    return this.incomeService.create(createIncomeDto, user.id);
  }

  @Get()
  findAll(
    @Body() findIncomeDto: FindIncomeDto,
    @CurrentUser() user: IUserPayload,
  ) {
    return this.incomeService.findAll(
      user.id,
      findIncomeDto.startDate,
      findIncomeDto.endDate,
      findIncomeDto.accountId,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: IUserPayload) {
    return this.incomeService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIncomeDto: UpdateIncomeDto,
    @CurrentUser() user: IUserPayload,
  ) {
    return this.incomeService.update(id, updateIncomeDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: IUserPayload) {
    return this.incomeService.remove(id, user.id);
  }
}
