import nodemailer from 'nodemailer'


export const sendEmailService = async ({ to = "", subject = "", message = "" }) => {


  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.USER_SEND_EMAIL_SERVICE,
      pass: process.env.PASSWORD_SEND_EMAIL_SERVICE
    },
    service: "gmail"
  });


  const info = await transporter.sendMail({
    from: "ormeedo@gmail.com",
    to,
    subject,
    text: message
  })

  return info
}