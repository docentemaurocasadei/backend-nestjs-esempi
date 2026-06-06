import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-students.dto';
import { UpdateStudentDto } from './dto/update-students.dto';
import { SendEmailService } from 'src/send-email/send-email.service';

export interface Student {
    id: number;
    name: string;
    surname: string;
}
@Injectable()
export class StudentsService {
    constructor(
        private readonly sendEmailService: SendEmailService
    ) {}

    private students: Student[] = [
        { id: 1, name: 'John', surname: 'Doe' },
        { id: 2, name: 'Jane', surname: 'Smith' },
        { id: 3, name: 'Alice', surname: 'Johnson' },
    ];
    getStudent(id: number): Student | null {
        console.log(`Getting student with id: ${id}`);
        return this.students.find(student => student.id === id) || null;
    }
    getAllStudents(): Student[] {
        return this.students;
    }
    create(student: CreateStudentDto) : Student {
        const st:Student={
            id: this.students.length +1,
            name: student.name,
            surname:student.surname    
        }
        this.students.push(st);
        this.sendEmailService.sendEmail(
            'example@example.com',
            'New Student Created',
            `A new student has been created: ${st.name} ${st.surname}`
        );
        return st;
    }
    update(id:number, student: UpdateStudentDto): Student | null{
        const st: Student | undefined = this.students.find(
            (student) => student.id === id
        )
        if (!st) {
            return null;
        }   
        Object.assign(st, student);
        return st;

        }
    delete(id:number): boolean {
        const index = this.students.findIndex(student => student.id === id);
        if (index === -1) {
            return false;
        }
        this.students.splice(index, 1);
        return true;
    }

    searchStudents(name:string, surname:string){
    return this.students.filter(
        (student) => (!name || student.name.toLowerCase() === name.toLowerCase()) && (!surname || student.surname.toLowerCase() === surname.toLowerCase())
    );
}
}
