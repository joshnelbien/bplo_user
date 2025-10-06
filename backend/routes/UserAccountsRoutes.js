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
      application_type: "New",
    });

    // ✅ send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "New Business Application",
      html: `
        <p>Hello <b>${firstName} ${lastName}</b>,</p>
        <p>You can now proceed to your New Business application</p>
        <p>Just Click the link below and Proceed to New Business Application</p>
        <a href="http:localhost:5173/newApplicationPage/${user.id}">
          View Application
        </a>
        <br/><br/>
        <p>Best regards,<br/>Business Portal</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
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
