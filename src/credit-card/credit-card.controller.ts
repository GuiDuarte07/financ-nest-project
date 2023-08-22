import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreditCardService } from './credit-card.service';
import { CreateCreditCardDto } from './dto/create-credit-card.dto';
import { UpdateCreditCardDto } from './dto/update-credit-card.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { IUserPayload } from 'src/user/interfaces/user';

@Controller('credit-card')
export class CreditCardController {
  constructor(private readonly creditCardService: CreditCardService) {}

  @Post()
  create(
    @Body() createCreditCardDto: CreateCreditCardDto,
    @CurrentUser() user: IUserPayload,
  ) {
    return this.creditCardService.create(createCreditCardDto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: IUserPayload) {
    return this.creditCardService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: IUserPayload) {
    return this.creditCardService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCreditCardDto: UpdateCreditCardDto,
    @CurrentUser() user: IUserPayload,
  ) {
    return this.creditCardService.update(id, updateCreditCardDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: IUserPayload) {
    return this.creditCardService.remove(id, user.id);
  }
}
