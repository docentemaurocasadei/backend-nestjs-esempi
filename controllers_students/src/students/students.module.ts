import { Module } from '@nestjs/common';
import { StudentController } from './students.controller';
import { StudentsService } from './students.service';
import { SendEmailModule } from 'src/send-email/send-email.module';

@Module({
    imports: [SendEmailModule],
    controllers: [StudentController],
    providers: [StudentsService],
})
export class StudentsModule {}
