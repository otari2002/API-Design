import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import { SendEmailDto } from './dto/send_email_dto';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class MailerService {
    constructor(
        private readonly configService: ConfigService
    ) {}
    mailTransport(){
        const transporter = createTransport({
            host: this.configService.get<string>('MAIL_HOST'),
            port: this.configService.get<number>('MAIL_PORT)'),
            secure: false,
            auth: {
                user: this.configService.get<string>('MAIL_USER'),
                pass: this.configService.get<string>('MAIL_PASS'),
            }
        });
        return transporter;
    }

    template(template: string, placeholders: Record<string, string>){
        let html = template;
        for(const key in placeholders){
            html = html.replace(new RegExp(`{{${key}}}`, 'g'), placeholders[key]);
        }
        return html;
    }

    async sendMail(dto: SendEmailDto){
        const { recipient, subject, placeholders } = dto;
        const html = this.template(dto.html, placeholders);
        const transport = this.mailTransport();
        const mailData: Mail.Options = {
            from: {
                name: this.configService.get<string>('APP_NAME'),
                address: this.configService.get<string>('DEFAULT_MAIL_FROM'),
            },
            to: recipient,
            subject,
            html
        };
        try{
            await transport.sendMail(mailData);
            return { message: 'Mail sent successfully' };
        }catch(error){
            return { error, message: 'Failed to send mail' };
        }
    }
}
