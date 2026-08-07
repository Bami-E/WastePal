import nodemailer from 'nodemailer';
import ejs from 'ejs';
import dotenv from 'dotenv';
dotenv.config();

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Now __dirname works

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    };
    await transporter.sendMail(mailOptions);
};

export const sendTemplateEmail = async (to, subject, templateName, data) => {
    try {
        const templatePath = path.join(__dirname, `../view/${templateName}.ejs`);
        const html = await ejs.renderFile(templatePath, data);
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html
        };
        
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(`Error sending email template ${templateName}:`, error);
    }
};

