import { Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException) {
    const status = exception.getStatus();
    const message = exception.message;

    console.log('🚨 🚨 🚨 ERROR 🚨 🚨 🚨');
    console.log('error:', message);
    console.log('status:', status);
    console.log('=============');
  }
}
