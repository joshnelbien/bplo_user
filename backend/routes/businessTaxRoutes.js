const express = require("express");
const multer = require("multer");
const moment = require("moment");
const Backroom = require("../db/model/backroomLocal");
const BusinessTax = require("../db/model/businessTax");
const AppStatus = require("../db/model/applicantStatusDB");
const TreasurersOffice = require("../db/model/treasurersOfficeDB");
const Examiners = require("../db/model/examiners");
const File = require("../db/model/files");
const router = express.Router();

// Multer setup - store files in memory
const upload = multer({ storage: multer.memoryStorage() });

// -----------------------------
// Move applicant from Backroom to BusinessTax (pending)
router.post("/businessTax/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const applicant = await File.findByPk(id);
    const examinersApplicant = await File.findByPk(id);
    if (!applicant)
      return res.status(404).json({ error: "Applicant not found" });

    const applicantData = applicant.toJSON();

    applicantData.BUSINESSTAX = "pending";
    applicantData.BUSINESSTAXtimeStamp = moment().format("DD/MM/YYYY HH:mm:ss");

    const created = await BusinessTax.create(applicantData);
    await examinersApplicant.update({
      passtoBusinessTax: "Yes",
    });
    res.status(201).json({
      message:
        "Applicant approved, archived in Backroom, and moved to BusinessTax",
      created,
    });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ error: "Failed to approve applicant" });
  }
});

router.post(
  "/business/approve/:id",
  upload.single("businessTaxComputation"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const file = req.file;
      const { businessTaxTotal } = req.body;
      const allFees = { ...req.body };
      console.log("All fees from request body:", allFees);

      const applicant = await BusinessTax.findByPk(id);
      if (!applicant)
        return res
          .status(404)
          .json({ error: "Applicant not found in BusinessTax" });

      const applicantbusinessTax = await File.findByPk(id);
      if (!applicantbusinessTax)
        return res
          .status(404)
          .json({ error: "Applicant not found in BusinessTax Files" });

      const applicantBackroom = await File.findByPk(id);
      if (!applicantBackroom)
        return res
          .status(404)
          .json({ error: "Applicant not found in Backroom" });

      const applicantStatus = await AppStatus.findByPk(id);
      if (!applicantStatus)
        return res.status(404).json({ error: "Applicant status not found" });

      const applicantExaminers = await AppStatus.findByPk(id);
      if (!applicantExaminers)
        return res.status(404).json({ error: "Applicant examiners not found" });

      const backroom = await Backroom.findByPk(id);
      if (!backroom)
        return res.status(404).json({ error: "Applicant examiners not found" });

      const timestamp = moment().format("DD/MM/YYYY HH:mm:ss");

      await backroom.update({
        ...allFees,
        ...(file && {
          businesstaxComputation: file.buffer,
          businesstaxComputation_filename: file.originalname,
          businesstaxComputation_mimetype: file.mimetype,
          businesstaxComputation_size: file.size,
        }),
      });

      // ✅ Add businessTaxTotal to all relevant updates
      await applicantbusinessTax.update({
        passtoBusinessTax: "Done",
        passtoTreasurer: "Yes",
        BUSINESSTAXtimeStamp: timestamp,
        businessTaxTotal: businessTaxTotal || 0, // ✅ Insert total here
        ...allFees,
        ...(file && {
          businesstaxComputation: file.buffer,
          businesstaxComputation_filename: file.originalname,
          businesstaxComputation_mimetype: file.mimetype,
          businesstaxComputation_size: file.size,
        }),
      });

      await applicantBackroom.update({
        BUSINESSTAX: "Approved",
        BUSINESSTAXtimeStamp: timestamp,
        businessTaxTotal: businessTaxTotal || 0,
        ...allFees,
        ...(file && {
          businesstaxComputation: file.buffer,
          businesstaxComputation_filename: file.originalname,
          businesstaxComputation_mimetype: file.mimetype,
          businesstaxComputation_size: file.size,
        }),
      });

      await applicant.update({
        businessTaxTotal: businessTaxTotal || 0,
        BUSINESSTAX: "Approved",

        BUSINESSTAXtimeStamp: timestamp,
        businessTaxTotal: businessTaxTotal || 0,
        ...allFees,
        ...(file && {
          businesstaxComputation: file.buffer,
          businesstaxComputation_filename: file.originalname,
          businesstaxComputation_mimetype: file.mimetype,
          businesstaxComputation_size: file.size,
        }),
      });

      await applicantStatus.update({
        BUSINESSTAX: "Approved",
        BUSINESSTAXtimeStamp: timestamp,
        businessTaxTotal: businessTaxTotal || 0,
      });

      await applicantExaminers.update({
        BUSINESSTAX: "Approved",
        BUSINESSTAXtimeStamp: timestamp,
        businessTaxTotal: businessTaxTotal || 0,
      });

      // Move to Treasurer's Office
      const applicantData = applicant.toJSON();
      if (file) {
        applicantData.businesstaxComputation = file.buffer;
        applicantData.businesstaxComputation_filename = file.originalname;
        applicantData.businesstaxComputation_mimetype = file.mimetype;
        applicantData.businesstaxComputation_size = file.size;
      }

      applicantData.BUSINESSTAX = "Approved";
      applicantData.BUSINESSTAXtimeStamp = timestamp;
      applicantData.businessTaxTotal = businessTaxTotal || 0;

      const created = await TreasurersOffice.create(applicantData);

      res.status(201).json({
        message:
          "Applicant approved, file uploaded, total recorded, and moved to Treasurer's Office",
        created,
      });
    } catch (err) {
      console.error("Approve error:", err);
      res.status(500).json({ error: "Failed to approve applicant" });
    }
  }
);

// -----------------------------
// Get all BusinessTax applicants
router.get("/businessTax", async (req, res) => {
  try {
    const files = await BusinessTax.findAll();
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

// -----------------------------
// View uploaded file (specific column: businesstaxComputaion)
router.get("/businessTax/:id/file", async (req, res) => {
  try {
    const { id } = req.params;
    const record = await BusinessTax.findByPk(id);
    if (!record) return res.status(404).send("Record not found");
    if (!record.businesstaxComputaion_data)
      return res.status(404).send("File not found");

    res.setHeader("Content-Type", record.businesstaxComputaion_mimetype);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${record.businesstaxComputaion_filename}"`
    );
    res.send(record.businesstaxComputaion_data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving file");
  }
});

router.get("/businessTax/:id/file/download", async (req, res) => {
  try {
    const { id } = req.params;
    const record = await BusinessTax.findByPk(id);
    if (!record) return res.status(404).send("Record not found");
    if (!record.businesstaxComputaion_data)
      return res.status(404).send("File not found");

    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${record.businesstaxComputaion_filename}"`
    );
    res.send(record.businesstaxComputaion_data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error downloading file");
  }
});

module.exports = router;
