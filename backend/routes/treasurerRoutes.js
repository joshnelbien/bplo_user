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

    // 6️⃣ Compute payment breakdown and due dates
    const businessTaxTotal = parseFloat(applicantData.businessTaxTotal || 0);
    const mode = applicantData.Modeofpayment?.toLowerCase() || "annual";

    let breakdown = [];
    let dueDates = [];

    // Get current date and start month (used for adjustments if business starts midyear)
    const businessStartMonth =
      moment(applicantData.businessStartDate || new Date()).month() + 1;

    if (mode === "quarterly") {
      breakdown = Array(4).fill((businessTaxTotal / 4).toFixed(2));
      dueDates = ["January 20", "April 20", "July 20", "October 20"];

      // ⏰ Adjust for mid-year business start (e.g., July start)
      if (businessStartMonth >= 7) {
        breakdown = breakdown.slice(2); // keep only Q3 and Q4
        dueDates = dueDates.slice(2);
      }
    } else if (mode === "semi-annual") {
      breakdown = Array(2).fill((businessTaxTotal / 2).toFixed(2));
      dueDates = ["January 20", "July 20"];

      // If started in July or later → only 2nd semester
      if (businessStartMonth >= 7) {
        breakdown = breakdown.slice(1);
        dueDates = dueDates.slice(1);
      }
    } else {
      breakdown = [businessTaxTotal.toFixed(2)];
      dueDates = ["January 20"];
    }

    // Convert to string for DB storage
    const amountDueStr = breakdown.map((v) => `"${v}"`).join(",");
    const emptyPlaceholders = Array(breakdown.length).fill('""').join(",");
    const dueDateStr = dueDates.map((v) => `"${v}"`).join(",");

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
      due_date: dueDateStr,
    });

    // 5️⃣ Update applicant + file
    await forRelease.update({
      passtoTreasurer: "Done",
      permitRelease: "Yes",
      TREASURER: "Approved",
      TREASURERtimeStamp: applicantData.TREASURERtimeStamp,
      amount_due: amountDueStr,
      amount_paid: emptyPlaceholders,
      due_date: dueDateStr,
    });

    await applicant.update({
      TREASURER: "Approved",
      TREASURERtimeStamp: applicantData.TREASURERtimeStamp,
      passtoTreasurer: "Done",
      amount_due: amountDueStr,
      amount_paid: emptyPlaceholders,
      due_date: dueDateStr,
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

router.put("/treasurer-payments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      amount_paid,
      index,
      payment_mode,
      paymentDate,
      draweeBank,
      checkNumber,
      checkDate,
    } = req.body;

    console.log("Received payment update:", req.body);

    // Find applicant and file
    const applicant = await TreasurersOffice.findByPk(id);
    const fileApplicant = await File.findByPk(id);

    if (!applicant || !fileApplicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    // Helper: parse JSON arrays from DB, or initialize empty
    const parseArray = (field) => {
      if (!field) return [];
      try {
        return JSON.parse(field);
      } catch (err) {
        // fallback if DB has old CSV string
        return field.replace(/["']/g, "").split(",");
      }
    };

    let oldPaid = parseArray(applicant.amount_paid);
    let oldMode = parseArray(applicant.payment_mode);
    let oldPaymentDate = parseArray(applicant.payment_date);
    let oldDrawee = parseArray(applicant.drawee_bank);
    let oldCheckNum = parseArray(applicant.check_number);
    let oldCheckDate = parseArray(applicant.check_date);

    // Ensure arrays have at least 10 slots (or max installments)
    const ensureLength = (arr, length = 4) => {
      while (arr.length < length) arr.push("");
      return arr;
    };

    oldPaid = ensureLength(oldPaid);
    oldMode = ensureLength(oldMode);
    oldPaymentDate = ensureLength(oldPaymentDate);
    oldDrawee = ensureLength(oldDrawee);
    oldCheckNum = ensureLength(oldCheckNum);
    oldCheckDate = ensureLength(oldCheckDate);

    // Determine which index to update
    const i = index !== null && index !== undefined ? Number(index) : 0;

    // Update specific installment
    oldPaid[i] = amount_paid || "";
    oldMode[i] = payment_mode || "";
    oldPaymentDate[i] = paymentDate || "";
    oldDrawee[i] = draweeBank || "";
    oldCheckNum[i] = checkNumber || "";
    oldCheckDate[i] = checkDate || "";

    console.log("Updated arrays:", {
      oldPaid,
      oldMode,
      oldPaymentDate,
      oldDrawee,
      oldCheckNum,
      oldCheckDate,
    });

    const updatedFields = {
      amount_paid: JSON.stringify(oldPaid),
      payment_mode: JSON.stringify(oldMode),
      payment_date: JSON.stringify(oldPaymentDate),
      drawee_bank: JSON.stringify(oldDrawee),
      check_number: JSON.stringify(oldCheckNum),
      check_date: JSON.stringify(oldCheckDate),
    };

    console.log("Final fields to save:", updatedFields);

    // Update both tables
    await applicant.update({ updatedFields, TREASURER: "Approved" });
    await fileApplicant.update(updatedFields);

    res.json({ success: true, updated: updatedFields });
  } catch (error) {
    console.error("Payment update error:", error);
    res.status(500).json({ error: "Internal server error" });
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
