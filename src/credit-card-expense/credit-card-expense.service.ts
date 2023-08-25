import { Injectable, ConflictException } from '@nestjs/common';
import { addMonths, startOfDay } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCreditCardExpenseDto } from './dto/create-credit-card-expense.dto';
import { UpdateCreditCardExpenseDto } from './dto/update-credit-card-expense.dto';
import { EarlyPaymentDiscountDto } from './dto/early-payment-discount-credit-card.dto';

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

    const currentDate = startOfDay(new Date());

    invoiceDate =
      invoiceDate ??
      startOfDay(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          creditCard.closeDay,
        ),
      );

    const generator = await this.prisma.creditCardExpenseGenerator.create({
      data: {
        ...createCreditCardExpenseDto,
        userId,
        paymentEndDate: addMonths(startOfDay(new Date()), installment),
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

  findAllGenerator(userId: string) {
    return this.prisma.creditCardExpenseGenerator.findMany({
      where: { userId },
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

  updatepaymentInvoice(paidOut: boolean, id: string, userId: string) {
    return this.prisma.creditCardExpense.update({
      where: { id, userId },
      data: { paidOut },
    });
  }

  async monthPaymentInvoice(
    monthYear: string /*ex: 08/2023*/,
    userId: string,
    creditCardId?: string,
  ) {
    /* 
      Se creditCardId for fornecido, a lógica será obter o dia de fechamento desse cartão, que será igual a
      data da fatura do expense (invoiceDay) 
    */
    if (creditCardId) {
      const creditCard = await this.prisma.creditCard.findFirstOrThrow({
        where: { id: creditCardId },
        select: {
          closeDay: true,
        },
      });

      const currentDate = startOfDay(new Date());
      const invoiceDate = startOfDay(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          creditCard.closeDay,
        ),
      );

      return this.prisma.creditCardExpense.updateMany({
        where: {
          creditCardId,
          userId,
          invoiceDate,
        },
        data: {
          paidOut: true,
        },
      });
    }

    /*
      Se não veio creditCardId, então pega o dia inicial e final do mês fornecido e procura os expenses que o invoiceDay está nesse range.
    */
    const [monthStr, yearStr] = monthYear.split('/');
    const [month, year] = [parseInt(monthStr) - 1, parseInt(yearStr)];

    const from = startOfDay(new Date(year, month, 1));
    const to = startOfDay(new Date(year, month + 1, 0));

    return this.prisma.creditCardExpense.updateMany({
      where: {
        invoiceDate: {
          gte: from,
          lte: to,
        },
      },
      data: {
        paidOut: true,
      },
    });
  }

  async earlyPaymentInstallments(
    earlyPaymentDiscountDto: EarlyPaymentDiscountDto,
    userId: string,
  ) {
    const { creditCardExpenseGeneratorId, totalDiscount } =
      earlyPaymentDiscountDto;

    const generator =
      await this.prisma.creditCardExpenseGenerator.findFirstOrThrow({
        where: { id: creditCardExpenseGeneratorId, userId },
      });

    if (
      generator.resolved ||
      generator.earlyPaymentDiscount ||
      generator.paymentEndDate < new Date()
    ) {
      throw new ConflictException('Generator already anticipated.');
    }

    const installmentsToUpdate = await this.prisma.creditCardExpense.findMany({
      where: {
        creditCardExpenseGeneratorId,
        userId,
        paidOut: false,
      },
    });

    const updatedInstallments = await Promise.all(
      installmentsToUpdate.map(async (installment) => {
        const updatedValue =
          installment.value - totalDiscount / installmentsToUpdate.length;

        return this.prisma.creditCardExpense.update({
          where: { id: installment.id },
          data: { value: updatedValue, anticipated: true, paidOut: true },
        });
      }),
    );

    // Criar novas parcelas adiadas com desconto
    const newGenerator = await this.prisma.creditCardExpenseGenerator.update({
      data: {
        totalValue: generator.totalValue - totalDiscount,
        earlyPaymentDiscount: totalDiscount,
        name: generator.name + ` (Adiado)`,
        paymentEndDate: new Date(), // Defina a nova data de pagamento aqui
        resolved: true,
      },
      where: {
        id: creditCardExpenseGeneratorId,
        userId,
      },
    });

    return {
      newGenerator,
      updatedInstallments,
    };
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
