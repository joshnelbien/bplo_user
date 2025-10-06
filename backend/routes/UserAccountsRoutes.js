const express = require("express");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const UserAccounts = require("../db/model/userAccounts");
const { sendTestEmail } = require("../routes/test");
const router = express.Router();

// ✅ setup nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // or use "smtp" if you have another provider
  auth: {
    user: process.env.EMAIL_USER, // your Gmail or SMTP email
    pass: process.env.EMAIL_PASS, // your Gmail App Password
  },
});

router.post("/register", async (req, res) => {
  console.log("📩 Received test request for email");

  try {
    const emailSent = await sendTestEmail("pilaresjoshuel@gmail.com");

    if (!emailSent) {
      return res.status(500).json({ error: "❌ Failed to send test email" });
    }

    return res.status(200).json({ message: "✅ Test email sent successfully" });
  } catch (error) {
    console.error("❌ Email send error:", error);
    return res.status(500).json({ error: "❌ Server error during email test" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserAccounts.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// /me
router.get("/:id", async (req, res) => {
  try {
    const user = await UserAccounts.findByPk(req.params.id, {
      attributes: ["id", "lastname", "firstname", "email", "mobile"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
