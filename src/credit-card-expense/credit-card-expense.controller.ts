import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreditCardExpenseService } from './credit-card-expense.service';
import { CreateCreditCardExpenseDto } from './dto/create-credit-card-expense.dto';
import { UpdateCreditCardExpenseDto } from './dto/update-credit-card-expense.dto';

@Controller('credit-card-expense')
export class CreditCardExpenseController {
  constructor(private readonly creditCardExpenseService: CreditCardExpenseService) {}

  @Post()
  create(@Body() createCreditCardExpenseDto: CreateCreditCardExpenseDto) {
    return this.creditCardExpenseService.create(createCreditCardExpenseDto);
  }

  @Get()
  findAll() {
    return this.creditCardExpenseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.creditCardExpenseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCreditCardExpenseDto: UpdateCreditCardExpenseDto) {
    return this.creditCardExpenseService.update(+id, updateCreditCardExpenseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.creditCardExpenseService.remove(+id);
  }
}
