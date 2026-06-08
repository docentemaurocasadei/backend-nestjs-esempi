import { Body, Controller, Get, Post, Put, Delete, Param, ParseIntPipe, Query, UseInterceptors } from '@nestjs/common';
import { StudentsService } from './students.service';
import { Student } from './students.service';
import { CreateStudentDto } from './dto/create-students.dto';
import { UpdateStudentDto } from './dto/update-students.dto';
import { CheckTimerInterceptor } from 'src/check-timer/check-timer.interceptor';

@Controller('students')
@UseInterceptors(CheckTimerInterceptor)
export class StudentController{
    constructor(private readonly studentsService: StudentsService) {}

    @Get()
    getAllStudents(): Student[] {
        return this.studentsService.getAllStudents();
    }   
    @Get('search')
    searchStudents(@Query('name') name: string, @Query('surname') surname: string): Student[] {
        return this.studentsService.searchStudents(name, surname);
    }
    @Get(':id')
    getStudentById(@Param('id', ParseIntPipe) id: number): Student | null {
        return this.studentsService.getStudent(id);
    }
    @Post()
    createStudent(@Body() body: CreateStudentDto): Student | null {
        return this.studentsService.create(body);
    }
    @Put(':id')
    updateStudent(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateStudentDto): Student | null {
        return this.studentsService.update(id, body);
    }
    @Delete(':id')
    deleteStudent(@Param('id', ParseIntPipe) id: number): boolean {
        return this.studentsService.delete(id);
    }

}