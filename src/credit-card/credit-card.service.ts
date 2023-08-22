import { Injectable } from '@nestjs/common';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card.dto';
import { PrismaService } from 'src/prisma/prisma.service';

const select = {
  id: true,
  limit: true,
  type: true,
  closeDay: true,
  expirationDay: true,
  cardBrand: true,
  description: true,
  accountId: true,
};
@Injectable()
export class CreditCardService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCreditCardDto: CreateCreditCardDto, userId: string) {
    return this.prisma.creditCard.create({
      data: { ...createCreditCardDto, userId },
      select,
    });
  }

  findAll(userId: string) {
    return this.prisma.creditCard.findMany({ where: { userId }, select });
  }

  findOne(id: string, userId: string) {
    return this.prisma.creditCard.findUniqueOrThrow({
      where: { id, userId },
      select,
    });
  }

  update(id: string, updateCreditCardDto: UpdateCreditCardDto, userId) {
    return this.prisma.creditCard.update({
      data: updateCreditCardDto,
      where: { id, userId },
      select,
    });
  }

  async remove(id: string, userId: string) {
    await this.prisma.creditCard.delete({ where: { id, userId }, select });
    return;
  }
}
