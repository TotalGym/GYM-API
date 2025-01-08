const nodemailer = require("nodemailer");  //todo : Implement this  ↓↓↓ 
require("dotenv").config();

const sendEmail = async ({ to, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      host:process.env.EMAIL_SERVICE,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: message,
    });

    console.log("Message sent: %s", info.messageId);

  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

module.exports = sendEmail;