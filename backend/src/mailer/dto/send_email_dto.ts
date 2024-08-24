import { Address } from "nodemailer/lib/mailer";

export type SendEmailDto = {
    recipient: Address;
    subject: string;
    html: string;
    placeholders?: Record<string, string>;
};