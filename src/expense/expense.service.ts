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

  findAll() {
    return `This action returns all expense`;
  }

  findOne(id: number) {
    return `This action returns a #${id} expense`;
  }

  update(id: number, updateExpenseDto: UpdateExpenseDto) {
    return `This action updates a #${id} ${updateExpenseDto} expense`;
  }

  remove(id: number) {
    return `This action removes a #${id} expense`;
  }
}
