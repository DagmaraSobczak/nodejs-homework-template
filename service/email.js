const nodemailer = require("nodemailer");

require("dotenv").config();

const config = {
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false,
  auth: {
    user: "apikey",
    pass: process.env.API_KEY,
  },
};

const send = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport(config);
  const emailOptions = {
    from: "daga.sobczak@gmail.com",
    to: "daga.sobczak@gmail.com",
    subject: subject,
    text: text,
  };
  transporter
    .sendMail(emailOptions)
    .then((info) => console.log(info))
    .catch((err) => console.log(err));
};

module.exports = {
  send,
};
