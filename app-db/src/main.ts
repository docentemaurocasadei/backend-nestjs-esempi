import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('Starting app-db...');
  console.log(`Listening on port ${process.env.APP_PORT ?? 3000}...`);
  const config = new DocumentBuilder()
    .setTitle('Leads API')
    .setDescription('API per gestione leads')
    .setVersion('1.0')
    .addTag('leads')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.enableCors({
    origin: 'http://localhost:' + (process.env.FRONTEND_PORT ?? 3000),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: 'Content-Type, Accept',
  })

  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
