import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidateInputPipe } from './pipes/global-validate-input.pipe';
const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.useStaticAssets('./src/upload');
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidateInputPipe());
  await app.listen(port, () => {
    console.log('server run on port :', port);
  });
}
bootstrap();
