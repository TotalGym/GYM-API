const nodemailer = require("nodemailer");  //todo : Implement this  ↓↓↓ 

const sendEmail = async ({ to, subject, message }) => {
  const transporter = nodemailer.createTransport({
    service: "",
    auth: {
      user: "",
      pass: "",
    },
  });

  const info = await transporter.sendMail({
    from: "",
    to,
    subject,
    message,
  });

  console.log("Message sent: %s", info.messageId)
};

module.exports = sendEmail;
