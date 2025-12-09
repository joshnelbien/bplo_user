const express = require("express");
const router = express.Router();
const moment = require("moment");
const { Op } = require("sequelize");
const BusinessProfile = require("../db/model/businessProfileDB");
const ExistingBusinessProfile = require("../db/model/BusinessProfileExisting");
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
    const { search } = req.query;

    let files;

    if (search) {
      files = await BusinessProfile.findAll({
        where: {
          businessName: {
            [Op.like]: `%${search}%`,
          },
        },
      });
    } else {
      files = await BusinessProfile.findAll();
    }

    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

router.get("/exixting-businessProfiles", async (req, res) => {
  try {
    const { search } = req.query;

    let files;

    if (search) {
      files = await ExistingBusinessProfile.findAll({
        where: {
          businessName: {
            [Op.like]: `%${search}%`,
          },
        },
      });
    } else {
      files = await ExistingBusinessProfile.findAll();
    }

    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

router.get("/:id/:bin", async (req, res) => {
  try {
    const { bin } = req.params; // ✅ Only use BIN, ignore ID

    console.log("🔍 Fetching business by BIN:", bin);

    const user = await ExistingBusinessProfile.findOne({
      where: { bin },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("🔥 Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/businessProfiles/export", async (req, res) => {
  try {
    const files = await BusinessProfile.findAll();
    if (!files.length) {
      return res.status(404).send("No records found");
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

    const parser = new Parser();
    const csv = parser.parse(jsonData);
    const filename = `businessProfiles_${moment().format("YYYY-MM-DD")}.csv`;

    // Send CSV as file
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to export CSV");
  }
});

router.post("/businesses", async (req, res) => {
  try {
    const newBusiness = await BusinessProfile.create(req.body);
    res.status(201).json(newBusiness);
  } catch (err) {
    console.error("🔥 Error creating business profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/approved-counts", async (req, res) => {
  try {
    // Count all records in the File table
    const totalApps = await BusinessProfile.count();

    // Return as JSON
    res.json({ totalApplications: totalApps });
  } catch (err) {
    console.error(err);
    res.status(500).json({ totalApplications: 0 });
  }
});

module.exports = router;
