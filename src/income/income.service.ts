import { Injectable } from '@nestjs/common';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class IncomeService {
  constructor(private readonly prisma: PrismaService) {}

  create(createIncomeDto: CreateIncomeDto, userId: string) {
    return this.prisma.income.create({
      data: {
        ...createIncomeDto,
        receivedAt: createIncomeDto.receivedAt ?? new Date(),
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

    return this.prisma.income.findMany({
      where: {
        // startDate e endDate: retorna tudo nesse range
        ...(startDate &&
          endDate && {
            receivedAt: {
              gte: startDate,
              lte: endDate,
            },
          }),

        // Apenas startDate: retorna tudo dessa data até agora
        ...(startDate &&
          !endDate && {
            receivedAt: {
              gte: startDate,
            },
          }),

        // Apenas endDate: retorna tudo até essa data
        ...(!startDate &&
          endDate && {
            receivedAt: {
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
    return this.prisma.income.findUniqueOrThrow({ where: { id, userId } });
  }

  update(id: string, updateIncomeDto: UpdateIncomeDto, userId: string) {
    return this.prisma.income.update({
      data: { ...updateIncomeDto },
      where: { id, userId },
    });
  }

  remove(id: string, userId: string) {
    return this.prisma.income.delete({ where: { id, userId } });
  }
}
