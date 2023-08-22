import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { IUserPayload } from 'src/user/interfaces/user';
import { FindExpenseDto } from './dto/find-expense.dto';

@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  create(
    @Body() createExpenseDto: CreateExpenseDto,
    @CurrentUser() user: IUserPayload,
  ) {
    return this.expenseService.create(createExpenseDto, user.id);
  }

  @Get()
  findAll(
    @Body() findExpenseDto: FindExpenseDto,
    @CurrentUser() user: IUserPayload,
  ) {
    return this.expenseService.findAll(
      user.id,
      findExpenseDto.startDate,
      findExpenseDto.endDate,
      findExpenseDto.accountId,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: IUserPayload) {
    return this.expenseService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @CurrentUser() user: IUserPayload,
  ) {
    return this.expenseService.update(id, updateExpenseDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: IUserPayload) {
    return this.expenseService.remove(id, user.id);
  }
}
