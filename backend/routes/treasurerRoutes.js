const express = require("express");
const Backroom = require("../db/model/backroomLocal");
const BusinessTax = require("../db/model/businessTax");
const router = express.Router();
const moment = require("moment");
const AppStatus = require("../db/model/applicantStatusDB");
const TreasurersOffice = require("../db/model/treasurersOfficeDB");
const BusinessProfile = require("../db/model/businessProfileDB");
const File = require("../db/model/files");
const ClientPayments = require("../db/model/paymentsDB");

router.post("/businessTax/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const applicant = await Backroom.findByPk(id);
    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    // 2. Convert to plain object
    const applicantData = applicant.toJSON();

    applicantData.BusinessTax = "pending";
    applicantData.BusinessTaxtimeStamp = moment().format("DD/MM/YYYY HH:mm:ss");

    const created = await BusinessTax.create(applicantData);

    res.status(201).json({
      message:
        "Applicant approved, archived in Files, and moved to businessTax",
      created,
    });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ error: "Failed to approve applicant" });
  }
});

router.post("/treasurerOffice/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Get applicant from TreasurersOffice table
    const applicant = await TreasurersOffice.findByPk(id);
    if (!applicant) {
      return res.status(404).json({ error: "Treasurer applicant not found" });
    }

    // 2️⃣ Get matching record from Files table
    const forRelease = await File.findByPk(id);
    if (!forRelease) {
      return res
        .status(404)
        .json({ error: "Applicant not found in Files table" });
    }

    // 3️⃣ Prepare applicant data
    const applicantData = applicant.toJSON();
    applicantData.TREASURER = "Approved";
    applicantData.TREASURERtimeStamp = moment().format("DD/MM/YYYY HH:mm:ss");

    // 4️⃣ Move to BusinessProfile
    const created = await BusinessProfile.create(applicantData);

    // 5️⃣ Update applicant + file
    await forRelease.update({
      passtoTreasurer: "Done",
      permitRelease: "Yes",
      TREASURER: "Approved",
      TREASURERtimeStamp: applicantData.TREASURERtimeStamp,
    });

    await applicant.update({
      TREASURER: "Approved",
      TREASURERtimeStamp: applicantData.TREASURERtimeStamp,
    });

    // 6️⃣ Compute payment breakdown
    const businessTaxTotal = parseFloat(applicantData.businessTaxTotal || 0);
    const mode = applicantData.Modeofpayment?.toLowerCase() || "annual";

    let breakdown = [];
    if (mode === "quarterly") {
      breakdown = Array(4).fill((businessTaxTotal / 4).toFixed(2));
    } else if (mode === "semi-annual") {
      breakdown = Array(2).fill((businessTaxTotal / 2).toFixed(2));
    } else {
      breakdown = [businessTaxTotal.toFixed(2)];
    }

    const amountDueStr = breakdown.map((v) => `"${v}"`).join(",");
    const emptyPlaceholders = Array(breakdown.length).fill('""').join(",");

    // 7️⃣ Insert into ClientPayments
    const paymentRecord = await ClientPayments.create({
      BIN: applicantData.BIN || "",
      BusinessType: applicantData.BusinessType || "",
      dscRegNo: applicantData.dscRegNo || "",
      businessName: applicantData.businessName || "",
      tinNo: applicantData.tinNo || "",
      TradeName: applicantData.TradeName || "",
      firstName: applicantData.firstName || "",
      middleName: applicantData.middleName || "",
      lastName: applicantData.lastName || "",
      amount_due: amountDueStr,
      amount_paid: emptyPlaceholders,
      due_date: emptyPlaceholders,
    });

    // 8️⃣ Final response
    res.status(201).json({
      message:
        "Applicant approved, archived in Files, added to Business Profile, and payment breakdowns created.",
      businessProfile: created,
      paymentRecord,
    });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ error: "Failed to approve applicant" });
  }
});

router.post("/business/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Get applicant from Files table
    const applicant = await BusinessTax.findByPk(id);
    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    const applicantStatus = await AppStatus.findByPk(id);
    if (!applicantStatus) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    // 2. Convert to plain object
    const applicantData = applicant.toJSON();

    applicantData.BusinessTax = "pending";
    applicantData.BusinessTaxtimeStamp = moment().format("DD/MM/YYYY HH:mm:ss");

    const created = await TreasurersOffice.create(applicantData);

    await applicantStatus.update({
      BUSINESSTAX: "Approved",
      BUSINESSTAXtimeStamp: applicantData.BusinessTaxtimeStamp,
    });

    res.status(201).json({
      message:
        "Applicant approved, archived in Files, and moved to businessTax",
      created,
    });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ error: "Failed to approve applicant" });
  }
});

router.get("/treasurer", async (req, res) => {
  try {
    const files = await TreasurersOffice.findAll({
      order: [["BUSINESSTAXtimeStamp", "ASC"]], // oldest first, newest last
    });
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

router.get("/businessTax/:id/:key", async (req, res) => {
  try {
    const { id, key } = req.params;
    const file = await businessTax.findByPk(id);
    if (!file) return res.status(404).send("Not found");

    if (!file[key]) return res.status(404).send("File not found");
    res.setHeader("Content-Type", file[`${key}_mimetype`]);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${file[`${key}_filename`]}"`
    );
    res.send(file[key]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving file");
  }
});

// Download file
router.get("/businessTax/:id/:key/download", async (req, res) => {
  try {
    const { id, key } = req.params;
    const file = await businessTax.findByPk(id);
    if (!file) return res.status(404).send("Not found");

    if (!file[key]) return res.status(404).send("File not found");
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file[`${key}_filename`]}"`
    );
    res.send(file[key]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error downloading file");
  }
});

module.exports = router;
