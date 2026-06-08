import { Module } from '@nestjs/common';
import { LocationsReService } from './locationsRe.service';
import { LocationsReController } from './locationsRe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location])],
  controllers: [LocationsReController],
  providers: [LocationsReService],
})
export class LocationsReModule {}
