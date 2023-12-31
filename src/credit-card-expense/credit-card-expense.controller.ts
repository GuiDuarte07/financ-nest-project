import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreditCardExpenseService } from './credit-card-expense.service';
import { CreateCreditCardExpenseDto } from './dto/create-credit-card-expense.dto';
import { UpdateCreditCardExpenseDto } from './dto/update-credit-card-expense.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { IUserPayload } from 'src/user/interfaces/user';
import { FindCreditCardExpenseDTO } from './dto/find-credit-card-expense.dto';
import { CreditCardPaymentDTO } from './dto/credit-card-payment.dto';
import { EarlyPaymentDiscountDto } from './dto/early-payment-discount-credit-card.dto';

@Controller('credit-card-expense')
export class CreditCardExpenseController {
  constructor(
    private readonly creditCardExpenseService: CreditCardExpenseService,
  ) {}

  @Post()
  create(
    @Body() createCreditCardExpenseDto: CreateCreditCardExpenseDto,
    @CurrentUser() user: IUserPayload,
  ) {
    return this.creditCardExpenseService.create(
      createCreditCardExpenseDto,
      user.id,
    );
  }

  @Get('generator')
  findAllGenerator(@CurrentUser() user: IUserPayload) {
    return this.creditCardExpenseService.findAllGenerator(user.id);
  }

  @Get('/generator/:id')
  findGenerator(@Param('id') id: string, @CurrentUser() user: IUserPayload) {
    return this.creditCardExpenseService.findGenerator(id, user.id);
  }

  @Post('/invoicePayment')
  creditCardInvoicePayment(
    @Body() creditCardPaymentDTO: CreditCardPaymentDTO,
    @CurrentUser() user: IUserPayload,
  ) {
    return this.creditCardExpenseService.monthPaymentInvoice(
      creditCardPaymentDTO.monthYear,
      user.id,
      creditCardPaymentDTO.creditCardId,
    );
  }

  @Post('/monthPayment')
  creditCardMonthPayment(
    @Body() creditCardPaymentDTO: CreditCardPaymentDTO,
    @CurrentUser() user: IUserPayload,
  ) {
    return this.creditCardExpenseService.monthPaymentInvoice(
      creditCardPaymentDTO.monthYear,
      user.id,
      creditCardPaymentDTO.creditCardId,
    );
  }

  @Post('/earlyPayment')
  adiamentoParcelas(
    @Param('id') userId: string,
    @Body() earlyPaymentDiscountDto: EarlyPaymentDiscountDto,
  ) {
    return this.creditCardExpenseService.earlyPaymentInstallments(
      earlyPaymentDiscountDto,
      userId,
    );
  }

  @Get()
  findAll(
    @Body() findCreditCardExpenseDTO: FindCreditCardExpenseDTO,
    @CurrentUser() user: IUserPayload,
  ) {
    return this.creditCardExpenseService.findAll(
      user.id,
      findCreditCardExpenseDTO.startDate,
      findCreditCardExpenseDTO.endDate,
      findCreditCardExpenseDTO.creditCardId,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: IUserPayload) {
    return this.creditCardExpenseService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCreditCardExpenseDto: UpdateCreditCardExpenseDto,
    @CurrentUser() user: IUserPayload,
  ) {
    return this.creditCardExpenseService.update(
      id,
      updateCreditCardExpenseDto,
      user.id,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: IUserPayload) {
    return this.creditCardExpenseService.remove(id, user.id);
  }
}
