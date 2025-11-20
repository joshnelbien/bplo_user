const express = require("express");
const bcrypt = require("bcryptjs");
const UserAccounts = require("../db/model/userAccounts");
const sgMail = require("@sendgrid/mail");
const BusinessProfile = require("../db/model/businessProfileDB");
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

    // Send confirmation email asynchronously
    const htmlContent = `
  <p>Hello <b>${firstName} ${lastName}</b>,</p>
  <p>We are pleased to inform you that you may now proceed with your <b>Business Renewal Application.</b></p>
  <p>Please click the link below to continue with your application process:</p>
  <a href="${process.env.VITE_API_BASE}/renewPage/${user.id}/${user.bin}"
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

router.post("/businessProfiles/export-email", async (req, res) => {
  try {
    // Hardcoded recipient
    const recipientEmail = "pilaresjoshuel@gmail.com";

    if (!process.env.SENDGRID_FROM) {
      return res.status(500).json({ error: "SendGrid sender email not set" });
    }

    // Get all applicants updated today
    const today = new Date().toISOString().slice(0, 10);
    const allProfiles = await BusinessProfile.findAll();

    const todaysProfiles = allProfiles.filter((p) => {
      const updatedDate = new Date(p.updatedAt).toISOString().slice(0, 10);
      return updatedDate === today;
    });

    if (todaysProfiles.length === 0)
      return res.status(404).json({ message: "No transactions for today." });

    // Exclude BLOB fields dynamically
    const sample = todaysProfiles[0].toJSON();
    const keys = Object.keys(sample).filter(
      (key) => !(sample[key] instanceof Buffer) // exclude all BLOB fields
    );

    // Build CSV
    const csvRows = [];
    csvRows.push(keys.join(",")); // header
    todaysProfiles.forEach((profile) => {
      const obj = profile.toJSON();
      const values = keys.map((key) => {
        const val = obj[key] ?? "";
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(","));
    });

    const csv = csvRows.join("\n");
    const filename = `businessProfiles_${today}.csv`;

    // Send email with CSV
    const msg = {
      to: recipientEmail,
      from: { email: process.env.SENDGRID_FROM, name: "Business Portal" },
      subject: `Business Profiles CSV Export (${today})`,
      text: "Attached is the latest Business Profiles CSV export for today.",
      attachments: [
        {
          content: Buffer.from(csv).toString("base64"),
          filename,
          type: "text/csv",
          disposition: "attachment",
        },
      ],
    };

    await sgMail.send(msg);

    console.log(`✅ CSV sent to ${recipientEmail}`);
    res.json({
      success: true,
      message: `CSV emailed successfully to ${recipientEmail}`,
      filename,
      csv,
    });
  } catch (error) {
    console.error("Error sending CSV email:", error.response?.body || error);
    res.status(500).json({ error: "Failed to send CSV email" });
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
