import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  console.log("sendEmail");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.EMAIL_PWD,
    },
  });

  const info = await transporter.sendMail({
    from: `Mahmoud Azamtta <${process.env.SENDER_EMAIL}`,
    to,
    subject,
    html,
  });

  return info;
};

export default sendEmail;
