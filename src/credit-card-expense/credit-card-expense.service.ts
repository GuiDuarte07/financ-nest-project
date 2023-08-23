import { Injectable } from '@nestjs/common';
import { addMonths } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCreditCardExpenseDto } from './dto/create-credit-card-expense.dto';
import { UpdateCreditCardExpenseDto } from './dto/update-credit-card-expense.dto';

@Injectable()
export class CreditCardExpenseService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createCreditCardExpenseDto: CreateCreditCardExpenseDto,
    userId: string,
  ) {
    /* 
      Para correções futuras, o invoiceDate (inicio da fatura) pode ser iniciar 1 dia depois
      do fim do vencimento, para ser padronizado, uma vez que o valor sempre cai nesse dia
    */
    let { invoiceDate } = createCreditCardExpenseDto;
    const { creditCardId, installment } = createCreditCardExpenseDto;

    const creditCard = await this.prisma.creditCard.findUniqueOrThrow({
      where: { id: creditCardId, userId },
    });

    const currentDate = new Date();

    invoiceDate =
      invoiceDate ??
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        creditCard.closeDay,
      );

    const generator = await this.prisma.creditCardExpenseGenerator.create({
      data: {
        ...createCreditCardExpenseDto,
        userId,
        paymentEndDate: addMonths(new Date(), installment),
      },
    });

    const creditCardInstallments = await this.generateInstallmentByGenerator(
      { ...createCreditCardExpenseDto, invoiceDate },
      generator.id,
      userId,
    );

    return { details: generator, values: creditCardInstallments };
  }

  findAll(
    userId: string,
    startDate?: Date,
    endDate?: Date,
    creditCardId?: string,
    creditCardExpenseGeneratorId?: string,
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
        ...(creditCardExpenseGeneratorId && { creditCardExpenseGeneratorId }),
        userId,
      },
    });
  }

  findOne(id: string, userId: string) {
    return this.prisma.creditCardExpense.findFirstOrThrow({
      where: { id, userId },
    });
  }

  findGenerator(creditCardExpenseGeneratorId: string, userId: string) {
    return this.prisma.creditCardExpenseGenerator.findFirstOrThrow({
      where: { id: creditCardExpenseGeneratorId, userId },
    });
  }

  async update(
    creditCardExpenseGeneratorId: string,
    updateCreditCardExpenseDto: UpdateCreditCardExpenseDto,
    userId: string,
  ) {
    const newGenerator = await this.prisma.creditCardExpenseGenerator.update({
      data: { ...updateCreditCardExpenseDto },
      where: { id: creditCardExpenseGeneratorId, userId },
    });

    const installmentExpenses = await this.prisma.creditCardExpense.findMany({
      where: { creditCardExpenseGeneratorId, userId },
    });

    const paidOudAmount = installmentExpenses.reduce((count, expense) => {
      if (expense.paidOut === true) {
        return count + 1;
      }
      return count;
    }, 0);

    this.prisma.creditCardExpense.deleteMany({
      where: { creditCardExpenseGeneratorId, userId },
    });

    const creditCardInstallments = await this.generateInstallmentByGenerator(
      {
        creditCardId: newGenerator.creditCardId,
        installment: newGenerator.installment,
        name: newGenerator.name,
        totalValue: newGenerator.totalValue,
        invoiceDate: newGenerator.invoiceDate,
        justForRecord: newGenerator.justForRecord,
      },
      creditCardExpenseGeneratorId,
      userId,
      paidOudAmount,
    );

    return { details: newGenerator, values: creditCardInstallments };
  }

  async remove(id: string, userId: string) {
    await this.prisma.creditCardExpense.deleteMany({
      where: { creditCardExpenseGeneratorId: id, userId },
    });

    return this.prisma.creditCardExpenseGenerator.delete({
      where: { id, userId },
    });
  }

  private generateInstallmentByGenerator(
    {
      installment,
      totalValue,
      name,
      invoiceDate,
      justForRecord,
    }: CreateCreditCardExpenseDto,
    creditCardExpenseGeneratorId: string,
    userId: string,
    numberOfInstallmentsPaid?: number,
  ) {
    const creditCardQuerys = [];

    for (let i = 0; i < installment; i++) {
      creditCardQuerys[i] = this.prisma.creditCardExpense.create({
        data: {
          name: name + ` ${i + 1}/${installment}`,
          value: totalValue / installment,
          creditCardExpenseGeneratorId,
          invoiceDate: addMonths(invoiceDate, i),
          justForRecord,
          userId,
          paidOut: numberOfInstallmentsPaid >= i + 1 ? true : false,
        },
      });
    }

    return this.prisma.$transaction(creditCardQuerys);
  }
}
