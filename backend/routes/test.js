// 📁 backend/utils/mailer.js
const nodemailer = require("nodemailer");
require("dotenv").config({ path: __dirname + "/../.env" });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendTestEmail(to) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Registration Test Email",
    text: "✅ If you received this, the registration email function works!",
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Test email sent:", info.response);
    return true;
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    return false;
  }
}

module.exports = { sendTestEmail };
