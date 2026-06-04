import { Module } from '@nestjs/common';
import { LocationsQbService } from './locationsQb.service';
import { LocationsQbController } from './locationsQb.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location])],
  controllers: [LocationsQbController],
  providers: [LocationsQbService],
})
export class LocationsQbModule {}
