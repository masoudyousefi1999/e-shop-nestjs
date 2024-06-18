import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from "cookie-parser"
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors : {
      origin : "*"
    }
  });
  app.useGlobalPipes(new ValidationPipe({whitelist : true, forbidNonWhitelisted : true}))
  app.use(cookieParser())
  app.useStaticAssets("./")
  // app.use()
  await app.listen(5000);
}
bootstrap();
