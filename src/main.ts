import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const url =  process.env.FRONT_URL


const port = process.env.PORT
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin:url,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials:true
  });
  await app.listen(port);
}
bootstrap();
