import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { DbService } from 'src/db/db.service';

@Module({
  imports: [],  
  controllers: [LeadsController],
  providers: [LeadsService, DbService],
})
export class LeadsModule {}
