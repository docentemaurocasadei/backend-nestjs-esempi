import { Injectable } from '@nestjs/common';

@Injectable()
export class SendEmailService {
    sendEmail(to: string, subject: string, body: string): void {
        // Simulazione dell'invio di un'email
        console.log(`Email inviata a: ${to}`);
        console.log(`Oggetto: ${subject}`);
        console.log(`Corpo: ${body}`);
    }   
}
