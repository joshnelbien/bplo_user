const express = require("express");
const bcrypt = require("bcryptjs");
const UserAccounts = require("../db/model/userAccounts");
const sgMail = require("@sendgrid/mail");

const router = express.Router();

/* ---------------------------------------------------
 ✅ SendGrid setup
--------------------------------------------------- */
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(to, subject, html) {
  const msg = {
    to,
    from: process.env.SENDGRID_FROM, // MUST be a verified sender
    subject,
    html,
  };

  try {
    const [response] = await sgMail.send(msg); // Get SendGrid response
    console.log(`📧 Email request sent to SendGrid for ${to}`);
    console.log(`Status Code: ${response.statusCode}`);
    console.log("Headers:", response.headers);
  } catch (err) {
    console.error("❌ SendGrid email error (non-blocking):", err);
  }
}

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

    // Validate required fields
    if (!lastName || !firstName || !email || !mobileNo) {
      return res
        .status(400)
        .json({ error: "All required fields must be filled." });
    }

    // Insert user into DB
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
      DataPrivacy: "True",
    });

    console.log("✅ User inserted:", user.id);

    // Send success response immediately
    res.status(200).json({
      message: "User registered successfully",
      user,
    });

    // Send confirmation email asynchronously
    const htmlContent = `
      <p>Hello <b>${firstName} ${lastName}</b>,</p>
      <p>You can now proceed to your New Business application.</p>
      <p>Click the link below to continue:</p>
      <a href="${process.env.VITE_API_BASE}/newApplicationPage/${user.id}">
        View Application
      </a>
      <br/><br/>
      <p>Best regards,<br/>Business Portal</p>
    `;
    sendEmail(email, "New Business Application", htmlContent);
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ error: "Server error during registration." });
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
