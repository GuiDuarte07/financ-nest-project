import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello :D This is a Nest aplication made by me, Guilherme Duarte.\nWelcome!';
  }
}
