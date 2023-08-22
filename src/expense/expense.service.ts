import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExpenseService {
  constructor(private readonly prisma: PrismaService) {}

  create(createExpenseDto: CreateExpenseDto, userId: string) {
    return this.prisma.expense.create({
      data: { ...createExpenseDto, userId, categoryId: 'need to Do' },
    });
  }

  findAll(userId: string, startDate?: Date, endDate?: Date) {
    if (!startDate) {
      const currentDate = new Date();
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
    }
    if (!endDate) {
      endDate = new Date();
    }

    return this.prisma.expense.findMany({
      where: {
        purchaseDate: {
          gte: startDate,
          lte: endDate,
        },
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
