const express = require("express");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport"); // Add SendGrid transport
const UserAccounts = require("../db/model/userAccounts");

const router = express.Router();

/* ---------------------------------------------------
 ✅ Nodemailer Transporter (SendGrid)
--------------------------------------------------- */
const transporter = nodemailer.createTransport(
  sgTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

// Test SendGrid connection on server start
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SendGrid connection failed at startup:", error);
  } else {
    console.log("✅ SendGrid is ready to send emails");
  }
});

/* ---------------------------------------------------
 📌 REGISTER — Create user and send confirmation email
--------------------------------------------------- */
router.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      extName,
      sex,
      email,
      mobileNo,
      BusinessType,
      dscRegNo,
      businessName,
      tinNo,
      TradeName,
      telNo,
    } = req.body;

    // ✅ Required fields validation
    if (!lastName || !firstName || !email || !mobileNo) {
      return res
        .status(400)
        .json({ error: "All required fields must be filled." });
    }

    // ✅ Insert new user into DB
    const user = await UserAccounts.create({
      firstName,
      middleName: middleName || null,
      lastName,
      extName: extName || null,
      sex,
      email,
      tel: telNo || null,
      mobile: mobileNo,
      business_type: BusinessType || null,
      dsc_reg_no: dscRegNo || null,
      business_name: businessName || null,
      tin_no: tinNo || null,
      trade_name: TradeName || null,
      application_type: "New",
    });

    console.log("✅ User inserted:", user.id);

    // ✅ Send success response to client first
    res.status(200).json({
      message: "User registered successfully",
      user,
    });

    // 📧 Prepare email
    const mailOptions = {
      from: process.env.SENDGRID_FROM,
      to: email,
      subject: "New Business Application",
      html: `
        <p>Hello <b>${firstName} ${lastName}</b>,</p>
        <p>You can now proceed to your New Business application.</p>
        <p>Just click the link below to continue:</p>
        <a href="${process.env.VITE_API_BASE}/newApplicationPage/${user.id}">
          View Application
        </a>
        <br/><br/>
        <p>Best regards,<br/>Business Portal</p>
      `,
    };

    // 📤 Send email asynchronously
    transporter
      .sendMail(mailOptions)
      .then(() => console.log(`📧 Email sent successfully to ${email}`))
      .catch((err) => console.error("❌ Email send error:", err));
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ error: "Server error during registration." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await UserAccounts.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "User not found." });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password." });
    }

    // ✅ Successful login
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        firstname: user.firstName,
        lastname: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: "Server error during login." });
  }
});

/* ---------------------------------------------------
 👤 GET USER PROFILE — /:id
--------------------------------------------------- */
router.get("/:id", async (req, res) => {
  try {
    const user = await UserAccounts.findByPk(req.params.id, {
      attributes: ["id", "lastname", "firstname", "email", "mobile"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ Get user error:", error);
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
