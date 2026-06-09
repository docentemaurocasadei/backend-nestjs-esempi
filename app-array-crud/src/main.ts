import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(
    {origin: 'http://localhost:5500',}
  );
  const config = new DocumentBuilder()
    .setTitle('Posts API')
    .setDescription('API for managing posts')
    .addBearerAuth()
    .addApiKey(
    {
      type: 'apiKey',
      name: 'authorization',
      in: 'header',
    },
    'custom-auth',
  )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
