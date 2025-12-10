const express = require("express");
const bcrypt = require("bcryptjs");
const UserAccounts = require("../db/model/userAccounts");
const sgMail = require("@sendgrid/mail");
const BusinessProfile = require("../db/model/businessProfileDB");
const router = express.Router();
const sendBusinessProfileCSV = require("./sendBusinessProfileCSV");
const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();

/* ---------------------------------------------------
 ✅ SendGrid setup
--------------------------------------------------- */

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY; // optional
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY; // required

async function sendEmailJS(templateParams) {
  try {
    await axios.post("https://api.emailjs.com/api/v1.0/email/send", {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY, // optional
      accessToken: EMAILJS_PRIVATE_KEY, // required
      template_params: templateParams,
    });
    console.log(`✅ Email sent`);
  } catch (err) {
    console.error("❌ EmailJS error:", err.response?.data || err.message);
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

    // EmailJS template parameters
    const templateParams = {
      to_name: `${firstName} ${lastName}`,
      to_email: email,
      type: "New",
      application_link: `${process.env.VITE_API_BASE}/newApplicationPage/${user.id}`,
    };

    // Send email asynchronously
    sendEmailJS(templateParams);
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ error: "Server error during registration." });
  }
});

router.post("/register-renew", async (req, res) => {
  try {
    const {
      bin,
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
      bin,
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
      application_type: "Renew",
      DataPrivacy: "True",
    });

    console.log("✅ User inserted:", user.id, user.bin);

    // Send success response immediately
    res.status(200).json({
      message: "User registered successfully",
      user,
    });

    const templateParams = {
      to_name: `${firstName} ${lastName}`,
      to_email: email,
      type: "Renew",
      application_link: `${process.env.VITE_API_BASE}/renewPage/${user.id}/${user.bin}`,
    };

    sendEmailJS(templateParams);
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ error: "Server error during registration." });
  }
});

router.post("/businessProfiles/export-email", async (req, res) => {
  const result = await sendBusinessProfileCSV();

  if (result.success) {
    return res.json({
      success: true,
      message: "CSV emailed successfully.",
      filename: result.filename,
      csv: result.csv,
    });
  }

  return res.status(500).json({ error: "Failed to send email." });
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
