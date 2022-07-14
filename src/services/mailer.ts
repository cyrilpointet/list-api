import * as nodemailer from "nodemailer";

export const mailer = {
  async sendMail(to: string, text: string, subject?: string) {
    console.log(process.env.MAIL_HOST, process.env.MAIL_HOST);
    const testMailer = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 1025,
    });
    return await testMailer.sendMail({
      from: process.env.MAIL_FROM,
      to,
      text,
      subject: subject || "",
    });
  },
};
