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

    const htmlContent = `
  <p>Hello <b>${firstName} ${lastName}</b>,</p>
  <p>We are pleased to inform you that you may now proceed with your <b>New Business Application.</b></p>
  <p>Please click the link below to continue with your application process:</p>
  <a href="${process.env.VITE_API_BASE}/newApplicationPage/${user.id}"
     style="display:inline-block; padding:10px 16px; background-color:#144C22; color:white; 
            text-decoration:none; border-radius:4px; font-weight:bold;">
    View Application
  </a>
  <p>Should you have any questions or require further assistance, please do not hesitate to contact us.</p>
  <br/><br/>
  <p>Kind regards,<br/><b>Business Portal Team</b></p>
`;
    sendEmail(email, "Business Application", htmlContent);
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ error: "Server error during registration." });
  }
});

router.post("/register-renew", async (req, res) => {
  try {
    const {
      BIN,
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
      BIN,
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

    console.log("✅ User inserted:", user.id, user.BIN);

    // Send success response immediately
    res.status(200).json({
      message: "User registered successfully",
      user,
    });

    // Send confirmation email asynchronously
    const htmlContent = `
  <p>Hello <b>${firstName} ${lastName}</b>,</p>
  <p>We are pleased to inform you that you may now proceed with your <b>Business Renewal Application.</b></p>
  <p>Please click the link below to continue with your application process:</p>
  <a href="${process.env.VITE_API_BASE}/renewPage/${user.id}/${user.BIN}"
     style="display:inline-block; padding:10px 16px; background-color:#144C22; color:white; 
            text-decoration:none; border-radius:4px; font-weight:bold;">
    View Application
  </a>
  <p>Should you have any questions or require further assistance, please do not hesitate to contact us.</p>
  <br/><br/>
  <p>Kind regards,<br/><b>Business Portal Team</b></p>
`;

    sendEmail(email, "Renew Business Application", htmlContent);
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ error: "Server error during registration." });
  }
});

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
