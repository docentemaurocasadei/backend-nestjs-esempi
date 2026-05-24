import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder } from 'node_modules/@nestjs/swagger/dist/document-builder';
import { SwaggerModule } from 'node_modules/@nestjs/swagger/dist/swagger-module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('DB Connection Config Module')
    .setDescription('API for managing database connection configurations')
    .setVersion('1.0')
    .addTag('db-config')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors({
    origin: ['http://localhost:5500', 'http://localhost:5173'],
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
