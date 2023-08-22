import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExpenseService {
  constructor(private readonly prisma: PrismaService) {}

  create(createExpenseDto: CreateExpenseDto, userId: string) {
    return this.prisma.expense.create({
      data: {
        ...createExpenseDto,
        purchaseDate: createExpenseDto.purchaseDate ?? new Date(),
        userId,
      },
    });
  }

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

  update(id: string, updateExpenseDto: UpdateExpenseDto, userId: string) {
    return this.prisma.expense.update({
      data: { ...updateExpenseDto, userId },
      where: { id, userId },
    });
  }

  remove(id: string, userId: string) {
    return this.prisma.expense.delete({ where: { id, userId } });
  }
}
