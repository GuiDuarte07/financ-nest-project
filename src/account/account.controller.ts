import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { IUserPayload } from 'src/user/interfaces/user';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  create(
    @Body() createAccountDto: CreateAccountDto,
    @CurrentUser() user: IUserPayload,
  ) {
    console.log(user);
    return this.accountService.create(createAccountDto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: IUserPayload) {
    return this.accountService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: IUserPayload) {
    return this.accountService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
    @CurrentUser() user: IUserPayload,
  ) {
    return this.accountService.update(id, updateAccountDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: IUserPayload) {
    return this.accountService.remove(id, user.id);
  }
}
