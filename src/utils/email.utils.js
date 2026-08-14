import { google } from 'googleapis';
import ejs from 'ejs';
import dotenv from 'dotenv';
dotenv.config();

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI // redirect URI used during token generation
);

oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

// Gmail API requires the raw email as a base64url-encoded RFC 2822 message
const buildRawMessage = ({ to, subject, html, text }) => {
    const messageParts = [
        `From: ${process.env.GMAIL_SENDER_EMAIL}`,
        `To: ${to}`,
        `Subject: ${subject}`,
        'MIME-Version: 1.0',
        `Content-Type: ${html ? 'text/html' : 'text/plain'}; charset=UTF-8`,
        '',
        html || text,
    ];
    const message = messageParts.join('\n');

    return Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};

export const sendEmail = async (to, subject, text) => {
    try {
        const raw = buildRawMessage({ to, subject, text });
        const result = await gmail.users.messages.send({
            userId: 'me',
            requestBody: { raw },
        });
        return result.data;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

export const sendTemplateEmail = async (to, subject, templateName, data) => {
    try {
        const templatePath = path.join(__dirname, `../view/${templateName}.ejs`);
        const html = await ejs.renderFile(templatePath, data);

        const raw = buildRawMessage({ to, subject, html });
        const result = await gmail.users.messages.send({
            userId: 'me',
            requestBody: { raw },
        });
        return result.data;
    } catch (error) {
        console.error(`Error sending email template ${templateName}:`, error);
    }
};