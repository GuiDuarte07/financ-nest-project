import { Injectable } from '@nestjs/common';
import { addMonths } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCreditCardExpenseDto } from './dto/create-credit-card-expense.dto';
import { UpdateCreditCardExpenseDto } from './dto/update-credit-card-expense.dto';

@Injectable()
export class CreditCardExpenseService {
  constructor(private readonly prisma: PrismaService) {}
  create(
    createCreditCardExpenseDto: CreateCreditCardExpenseDto,
    userId: string,
  ) {
    /* 
      Para correções futuras, o invoiceDate (inicio da fatura) pode ser iniciar 1 dia depois
      do fim do vencimento, para ser padronizado, uma vez que o valor sempre cai nesse dia
    */
    return this.prisma.creditCardExpense.create({
      data: {
        ...createCreditCardExpenseDto,
        userId,
        paymentEndDate: addMonths(
          new Date(),
          createCreditCardExpenseDto.installment,
        ),
      },
    });
  }

  findAll(
    userId: string,
    startDate?: Date,
    endDate?: Date,
    creditCardId?: string,
  ) {
    return this.prisma.creditCardExpense.findMany({
      where: {
        // startDate e endDate: retorna tudo nesse range
        ...(startDate &&
          endDate && {
            invoiceDate: {
              gte: startDate,
              lte: endDate,
            },
          }),

        // Apenas startDate: retorna tudo dessa data até agora
        ...(startDate &&
          !endDate && {
            invoiceDate: {
              gte: startDate,
            },
          }),

        // Apenas endDate: retorna tudo até essa data
        ...(!startDate &&
          endDate && {
            invoiceDate: {
              lte: endDate,
            },
          }),
        // Se nem startDate e endDate, retorna tudo
        ...(creditCardId && { creditCardId }),
        userId,
      },
    });
  }

  findOne(id: string, userId: string) {
    return this.prisma.creditCardExpense.findFirstOrThrow({
      where: { id, userId },
    });
  }

  update(
    id: string,
    updateCreditCardExpenseDto: UpdateCreditCardExpenseDto,
    userId: string,
  ) {
    return this.prisma.creditCardExpense.update({
      data: { ...updateCreditCardExpenseDto },
      where: { id, userId },
    });
  }

  remove(id: string, userId: string) {
    return this.prisma.creditCardExpense.delete({ where: { id, userId } });
  }
}
