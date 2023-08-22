import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Response } from 'express';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Ocorreu um erro ao processar sua solicitação.';

    switch (exception.code) {
      case 'P2002':
        status = HttpStatus.BAD_REQUEST;
        message = 'Já existe um registro com esse valor único.';
        break;
      case 'P2025':
        status = HttpStatus.BAD_REQUEST;
        message = 'Identificador enviado não existe';
        break;
      // Adicione mais casos para outros códigos de erro do Prisma
    }

    console.log(exception.code);

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
