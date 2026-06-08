import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsQbModule } from './locations/locationsQb.module';
import { ProvincesModule } from './provinces/provinces.module';
import * as dotenv from 'dotenv';
import { LocationsReModule } from './locations/locationsRe.module';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
    }),
    LocationsQbModule,
    LocationsReModule,
    ProvincesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
