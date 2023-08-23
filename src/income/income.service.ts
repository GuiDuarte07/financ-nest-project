import { Injectable } from '@nestjs/common';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { PrismaService } from 'src/prisma/prisma.service';

const select = {
  accountId: true,
  categoryId: true,
  description: true,
  value: true,
  id: true,
  receivedAt: true,
  recorrenceId: true,
  justForRecord: true,
};

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
      select,
    });
  }

  findAll(
    userId: string,
    startDate?: Date,
    endDate?: Date,
    accountId?: string,
  ) {
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
      select,
    });
  }

  findOne(id: string, userId: string) {
    return this.prisma.income.findUniqueOrThrow({ where: { id, userId } });
  }

  update(id: string, updateIncomeDto: UpdateIncomeDto, userId: string) {
    return this.prisma.income.update({
      data: { ...updateIncomeDto },
      where: { id, userId },
      select,
    });
  }

  async remove(id: string, userId: string) {
    await this.prisma.income.delete({ where: { id, userId } });
  }
}
