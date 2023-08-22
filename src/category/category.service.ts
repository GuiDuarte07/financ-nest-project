import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

const select = {
  id: true,
  name: true,
  type: true,
};

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto, userId: string) {
    return this.prisma.category.create({
      data: { ...createCategoryDto, userId },
      select,
    });
  }

  findAll(userId: string) {
    return this.prisma.category.findMany({ where: { userId }, select });
  }

  findOne(id: string, userId: string) {
    return this.prisma.category.findFirstOrThrow({
      where: { id, userId },
      select,
    });
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto, userId: string) {
    return this.prisma.category.update({
      data: updateCategoryDto,
      where: { id, userId },
      select,
    });
  }

  async remove(id: string, userId: string) {
    await this.prisma.category.delete({ where: { id, userId } });
  }
}
