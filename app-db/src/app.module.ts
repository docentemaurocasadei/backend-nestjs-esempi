import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeadsModule } from './leads/leads.module';
import { DbService } from './db/db.service';

@Module({
  imports: [LeadsModule],
  controllers: [AppController],
  providers: [AppService, DbService],
})
export class AppModule {}
