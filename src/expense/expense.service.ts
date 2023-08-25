import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { PrismaService } from 'src/prisma/prisma.service';

const select = {
  accountId: true,
  categoryId: true,
  description: true,
  id: true,
  value: true,
  justForRecord: true,
  recorrenceId: true,
  purchaseDate: true,
};

@Injectable()
export class ExpenseService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(
    userId: string,
    startDate?: Date,
    endDate?: Date,
    accountId?: string,
  ) {
    /* if (!startDate) {
      const currentDate = new Date();
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
    }
    if (!endDate) {
      endDate = new Date();
    } */

    return this.prisma.expense.findMany({
      where: {
        // startDate e endDate: retorna tudo nesse range
        ...(startDate &&
          endDate && {
            purchaseDate: {
              gte: startDate,
              lte: endDate,
            },
          }),

        // Apenas startDate: retorna tudo dessa data até agora
        ...(startDate &&
          !endDate && {
            purchaseDate: {
              gte: startDate,
            },
          }),

        // Apenas endDate: retorna tudo até essa data
        ...(!startDate &&
          endDate && {
            purchaseDate: {
              lte: endDate,
            },
          }),
        // Se nem startDate e endDate, retorna tudo
        ...(accountId && { accountId }),
        userId,
      },
    });
  }

  findOne(id: string, userId: string) {
    return this.prisma.expense.findUniqueOrThrow({ where: { id, userId } });
  }

  async create(createExpenseDto: CreateExpenseDto, userId: string) {
    const expense = await this.prisma.expense.create({
      data: {
        ...createExpenseDto,
        purchaseDate: createExpenseDto.purchaseDate ?? new Date(),
        userId,
      },
      select,
    });

    if (!createExpenseDto.justForRecord) {
      await this.prisma.account.update({
        where: { id: createExpenseDto.accountId, userId },
        data: {
          balance: {
            decrement: createExpenseDto.value,
          },
        },
      });
    }

    return expense;
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto, userId: string) {
    const { value, accountId } = updateExpenseDto;

    const oldExpense = await this.prisma.expense.findFirstOrThrow({
      where: { id, userId },
      select: { value: true, accountId: true },
    });

    const expenseDifference = oldExpense.value - value;

    const [updatedExpense] = await this.prisma.$transaction([
      this.prisma.expense.update({
        data: { ...updateExpenseDto },
        where: { id, userId },
        select,
      }),
      this.prisma.account.update({
        where: { id: accountId || oldExpense.accountId },
        data: {
          balance: {
            increment:
              accountId && accountId !== oldExpense.accountId
                ? -value
                : expenseDifference,
          },
        },
      }),
      accountId &&
        accountId !== oldExpense.accountId &&
        this.prisma.account.update({
          where: { id: oldExpense.accountId, userId },
          data: {
            balance: {
              decrement: value,
            },
          },
        }),
    ]);

    return updatedExpense;
  }

  async remove(id: string, userId: string) {
    const deletedExpense = await this.prisma.expense.delete({
      where: { id, userId },
    });

    await this.prisma.account.update({
      where: { id: deletedExpense.accountId, userId },
      data: {
        balance: {
          increment: deletedExpense.value,
        },
      },
    });
  }
}
