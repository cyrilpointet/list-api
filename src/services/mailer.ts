import * as nodemailer from "nodemailer";

export const mailer = {
  async sendMail(to: string, text: string, subject?: string) {
    const testMailer = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 1025,
    });
    return await testMailer.sendMail({
      from: process.env.MAIL_HOST,
      to,
      text,
      subject: subject || "",
    });
  },
};
