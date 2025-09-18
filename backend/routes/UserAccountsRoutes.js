const express = require("express");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const UserAccounts = require("../db/model/userAccounts");

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
  try {
    const {
      firstName,
      middleName,
      lastName,
      extName,
      sex,
      email, // frontend field
      mobileNo, // frontend field
      BusinessType,
      dscRegNo,
      businessName,
      tinNo,
      TradeName,
      telNo,
    } = req.body;

    // validate required fields
    if (!lastName || !firstName || !email || !mobileNo) {
      return res
        .status(400)
        .json({ error: "All required fields must be filled" });
    }

    // check if email already exists
    const existingUser = await UserAccounts.findOne({
      where: { email: email },
    });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // create user
    const user = await UserAccounts.create({
      firstName,
      middleName: middleName || null,
      lastName,
      extName: extName || null,
      sex,
      email: email,
      tel: telNo || null,
      mobile: mobileNo,
      business_type: BusinessType || null,
      dsc_reg_no: dscRegNo || null,
      business_name: businessName || null,
      tin_no: tinNo || null,
      trade_name: TradeName || null,
    });

    // ✅ send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Business Application Registered",
      html: `
        <p>Hello <b>${firstName} ${lastName}</b>,</p>
        <p>Thank you for registering your business application.</p>
        <p>You can view your application details by clicking the link below:</p>
        <a href="http://localhost:5173/homePage/${user.id}">
          View Application
        </a>
        <br/><br/>
        <p>Best regards,<br/>Business Portal</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "User registered successfully, email sent",
      user,
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ error: "Server error" });
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
