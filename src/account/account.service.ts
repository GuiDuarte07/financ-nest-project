import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAccountDto: CreateAccountDto, userId: string) {
    return this.prisma.account.create({
      data: { ...createAccountDto, userId },
      select: {
        balance: true,
        id: true,
        bank: true,
        color: true,
        description: true,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.account.findMany({
      where: { userId },
      select: {
        balance: true,
        id: true,
        bank: true,
        color: true,
        description: true,
      },
    });
  }

  findOne(id: string, userId: string) {
    return this.prisma.account.findUnique({
      where: { userId, id },
      select: {
        balance: true,
        id: true,
        bank: true,
        color: true,
        description: true,
      },
    });
  }

  update(id: string, updateAccountDto: UpdateAccountDto, userId: string) {
    return this.prisma.account.update({
      data: { ...updateAccountDto, userId },
      where: { userId, id },
      select: {
        balance: true,
        id: true,
        bank: true,
        color: true,
        description: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.prisma.account.delete({
      where: { userId, id },
    });

    return;
  }
}
