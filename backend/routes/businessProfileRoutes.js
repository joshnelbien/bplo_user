const express = require("express");
const router = express.Router();
const moment = require("moment");
const BusinessProfile = require("../db/model/businessProfileDB");
const { Parser } = require("json2csv");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

const ENCRYPTION_KEY = crypto
  .createHash("sha256")
  .update(String("my-secret-key")) // 🔑 replace with strong secret key
  .digest("base64")
  .substr(0, 32);
const IV = crypto.randomBytes(16);

function encryptData(buffer) {
  if (!buffer) return null;
  try {
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(ENCRYPTION_KEY),
      IV
    );
    let encrypted = cipher.update(buffer.toString("base64"), "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
  } catch (err) {
    console.error("Encryption error:", err);
    return null;
  }
}

router.get("/businessProfiles", async (req, res) => {
  try {
    const files = await BusinessProfile.findAll({});
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

router.get("/businessProfiles/export", async (req, res) => {
  try {
    const files = await BusinessProfile.findAll({});
    if (!files.length) {
      return res.status(404).json({ message: "No records found" });
    }

    const jsonData = files.map((file) => {
      const obj = file.toJSON();
      const blobFields = [
        "tIGEfiles",
        "proofOfReg",
        "proofOfRightToUseLoc",
        "locationPlan",
        "brgyClearance",
        "marketClearance",
        "occupancyPermit",
        "cedula",
        "photoOfBusinessEstInt",
        "photoOfBusinessEstExt",
        "choCert",
        "cenroCert",
        "zoningCert",
        "businesstaxComputation",
      ];
      blobFields.forEach((field) => {
        if (obj[field]) obj[field] = "binary data";
      });
      return obj;
    });

    // Convert to CSV
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(jsonData);
    const filename = `businessProfiles_${moment().format("YYYY-MM-DD")}.csv`;

    // ✅ Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "amandyjoshnel@gmail.com",
      subject: "Business Profiles CSV Export",
      text: "Attached is the latest Business Profiles export.",
      attachments: [{ filename, content: csv }],
    });

    console.log("✅ Email sent successfully");

    // ✅ Send response with CSV + confirmation
    res.json({
      success: true,
      message: "CSV exported and email sent successfully",
      csv, // include CSV so frontend can still download
      filename,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to export CSV and send email" });
  }
});

module.exports = router;
