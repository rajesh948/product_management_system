import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { HttpException } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const errorMessage =
      exception instanceof HttpException ? exception.getResponse() : 500;

    // if (status === HttpStatus.UNAUTHORIZED)
    //     return response.status(status).render('views/401');
    // if (status === HttpStatus.NOT_FOUND)
    //     return response.status(status).render('views/404');
    // if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
    //     if (process.env.NODE_ENV === 'production') {
    //       console.error(error.stack);
    //       return response.status(status).render('views/500');
    //     }
    //     else {
    //       let message = error.stack;
    //       return response.status(status).send(message);
    //     }
    // }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: errorMessage,
    });
  }
}
