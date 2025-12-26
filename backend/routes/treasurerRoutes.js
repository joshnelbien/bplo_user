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
const { Op, Sequelize } = require("sequelize");

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
      bin: applicantData.bin || "",
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

    const applicant = await TreasurersOffice.findByPk(id);
    const fileApplicant = await File.findByPk(id);

    if (!applicant || !fileApplicant) {
      return res.status(404).json({ error: "Record not found" });
    }

    // ============================
    // AUTO-INCREMENT PLATE NUMBER
    // ============================
    let nextPlate = applicant.plate_no;

    if (!nextPlate) {
      const lastRecord = await TreasurersOffice.findOne({
        where: {
          plate_no: { [Op.ne]: null },
          id: { [Op.ne]: id },
        },
        order: [[Sequelize.literal(`CAST("plate_no" AS INTEGER)`), "DESC"]],
        attributes: ["plate_no"],
      });

      const lastPlate = lastRecord?.plate_no || "0";
      nextPlate = String(parseInt(lastPlate, 10) + 1).padStart(5, "0");
    }

    // ============================
    // PAYMENT LOGIC
    // ============================
    const isRenew = applicant.application?.toLowerCase() === "renew";
    const isNew = applicant.application?.toLowerCase() === "new";

    const parseArray = (v) =>
      v
        ? v
            .replace(/["']/g, "")
            .split(",")
            .map((x) => x.trim())
        : [];

    const toCSV = (arr) => arr.map((v) => `"${v}"`).join(",");

    let updatedFields = {};

    if (
      isNew ||
      (isRenew && applicant.Modeofpayment?.toLowerCase() === "annual")
    ) {
      updatedFields = {
        amount_paid: `"${amount_paid}"`,
        payment_mode: `"${payment_mode}"`,
        payment_date: `"${paymentDate}"`,
        drawee_bank: `"${draweeBank}"`,
        check_number: `"${checkNumber}"`,
        check_date: `"${checkDate}"`,
        amount_due: `"${applicant.businessTaxTotal}"`,
        due_date: `""`,
      };
    } else {
      let oldPaid = parseArray(applicant.amount_paid);
      let oldMode = parseArray(applicant.payment_mode);
      let oldPaymentDate = parseArray(applicant.payment_date);
      let oldDrawee = parseArray(applicant.drawee_bank);
      let oldCheckNum = parseArray(applicant.check_number);
      let oldCheckDate = parseArray(applicant.check_date);
      let oldDueDates = parseArray(applicant.due_date);
      let oldAmountDue = parseArray(applicant.amount_due);

      const total = parseFloat(applicant.businessTaxTotal || 0);
      const mode = applicant.Modeofpayment?.toLowerCase();

      let slots = 1;
      let perSlot = total;
      let dueDates = [""];

      if (mode === "quarterly") {
        slots = 4;
        perSlot = total / 4;
        dueDates = ["Jan 20", "Apr 20", "Jul 20", "Oct 20"];
      } else if (mode === "semi-annual") {
        slots = 2;
        perSlot = total / 2;
        dueDates = ["Jan 20", "Jun 20"];
      }

      const normalize = (arr) => {
        while (arr.length < slots) arr.push("");
        return arr.slice(0, slots);
      };

      oldPaid = normalize(oldPaid);
      oldMode = normalize(oldMode);
      oldPaymentDate = normalize(oldPaymentDate);
      oldDrawee = normalize(oldDrawee);
      oldCheckNum = normalize(oldCheckNum);
      oldCheckDate = normalize(oldCheckDate);
      oldDueDates = normalize(oldDueDates);
      oldAmountDue = normalize(oldAmountDue);

      for (let i = 0; i < slots; i++) {
        if (!oldDueDates[i]) oldDueDates[i] = dueDates[i];
        if (!oldAmountDue[i]) oldAmountDue[i] = perSlot.toFixed(2);
      }

      const i = Number(index || 0);

      oldPaid[i] = amount_paid;
      oldMode[i] = payment_mode;
      oldPaymentDate[i] = paymentDate;
      oldDrawee[i] = draweeBank;
      oldCheckNum[i] = checkNumber;
      oldCheckDate[i] = checkDate;

      updatedFields = {
        amount_paid: toCSV(oldPaid),
        payment_mode: toCSV(oldMode),
        payment_date: toCSV(oldPaymentDate),
        drawee_bank: toCSV(oldDrawee),
        check_number: toCSV(oldCheckNum),
        check_date: toCSV(oldCheckDate),
        amount_due: toCSV(oldAmountDue),
        due_date: toCSV(oldDueDates),
      };
    }

    const sharedUpdate = {
      ...updatedFields,
      plate_no: nextPlate,
      TREASURER: "Approved",
      passtoTreasurer: "Done",
      permitRelease: "Yes",
    };

    await applicant.update(sharedUpdate);
    await fileApplicant.update(sharedUpdate);

    res.json({
      success: true,
      plate_no: nextPlate,
    });
  } catch (err) {
    console.error("Payment update error:", err);
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
    const { id, field } = req.query;

    // ===============================
    // 1️⃣ DOWNLOAD / VIEW FILE
    // ===============================
    if (id && field) {
      const allowedFields = [
        "tIGEfiles",
        "proofOfReg",
        "RecentBusinessPermit",
        "proofOfRightToUseLoc",
        "locationPlan",
        "brgyClearance",
        "marketClearance",
        "occupancyPermit",
        "cedula",
        "photoOfBusinessEstInt",
        "photoOfBusinessEstExt",
        "cswmoCert",
        "choCert",
        "cenroCert",
        "zoningCert",
        "businesstaxComputation",
        "businessPermit",
      ];

      if (!allowedFields.includes(field)) {
        return res.status(400).json({ message: "Invalid file field" });
      }

      const record = await TreasurersOffice.findByPk(id, {
        attributes: [field, `${field}_filename`, `${field}_mimetype`],
      });

      if (!record || !record[field]) {
        return res.sendStatus(404);
      }

      res.setHeader(
        "Content-Type",
        record[`${field}_mimetype`] || "application/octet-stream"
      );
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${record[`${field}_filename`] || field}"`
      );

      return res.send(record[field]);
    }

    const files = await TreasurersOffice.findAll({
      attributes: {
        exclude: [
          "tIGEfiles",
          "proofOfReg",
          "RecentBusinessPermit",
          "proofOfRightToUseLoc",
          "locationPlan",
          "brgyClearance",
          "marketClearance",
          "occupancyPermit",
          "cedula",
          "photoOfBusinessEstInt",
          "photoOfBusinessEstExt",
          "cswmoCert",
          "choCert",
          "cenroCert",
          "zoningCert",
          "businesstaxComputation",
          "businessPermit",
        ],
      },
    });

    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

router.get("/treasurer/:id/file/:field", async (req, res) => {
  try {
    const { id, field } = req.params;
    const download = req.query.download === "true";

    const fileFields = [
      "proofOfReg",
      "RecentBusinessPermit",
      "tIGEfiles",
      "locationPlan",
      "brgyClearance",
      "marketClearance",
      "occupancyPermit",
      "cedula",
      "photoOfBusinessEstInt",
      "photoOfBusinessEstExt",
      "cswmoCert",
      "choCert",
      "cenroCert",
      "zoningCert",
      "businesstaxComputation",
      "businessPermit",
      "proofOfRightToUseLoc",
    ];

    if (!fileFields.includes(field)) {
      return res.status(400).json({ message: "Invalid file field" });
    }

    const record = await TreasurersOffice.findOne({
      where: { id },
      attributes: [
        field,
        `${field}_filename`,
        `${field}_mimetype`,
        `${field}_size`,
      ],
    });

    if (!record || !record[field]) {
      return res.status(404).json({ message: "File not found" });
    }

    res.setHeader("Content-Type", record[`${field}_mimetype`]);
    res.setHeader(
      "Content-Disposition",
      download
        ? `attachment; filename="${record[`${field}_filename`]}"`
        : `inline; filename="${record[`${field}_filename`]}"`
    );

    res.send(record[field]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/treasurer/:id/:key", async (req, res) => {
  try {
    const { id, key } = req.params;
    const file = await TreasurersOffice.findByPk(id);
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
