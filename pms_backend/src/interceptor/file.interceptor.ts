import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Observable } from 'rxjs';

@Injectable()
export class CustomFileInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    console.log('CustomFileInterCeptor::::', request);
    console.log('CustomFileInterCeptor Image:::::::::::', request.files);
    console.log('CustomFileInterCeptor Image:::::::::::', request.body);

    if (request.files && request.files.file) {
      FileInterceptor('image', {
        storage: diskStorage({
          destination: './src/upload',
          filename(req, file, callback) {
            callback(
              null,
              `${
                Math.random().toString(23).slice(2) +
                '-product-' +
                file.mimetype.replace('/', '.')
              }`,
            );
          },
        }),
      });
    }

    return next.handle();
  }
}
