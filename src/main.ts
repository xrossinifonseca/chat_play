import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const url =  process.env.FRONT_URL

const port = process.env.PORT
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin:url
  });
  await app.listen(port);
}
bootstrap();
