const express = require("express");
const multer = require("multer");
const moment = require("moment");
const Backroom = require("../db/model/backroomLocal");
const BusinessTax = require("../db/model/businessTax");
const AppStatus = require("../db/model/applicantStatusDB");
const TreasurersOffice = require("../db/model/treasurersOfficeDB");

const router = express.Router();

// Multer setup - store files in memory
const upload = multer({ storage: multer.memoryStorage() });

// -----------------------------
// Move applicant from Backroom to BusinessTax (pending)
router.post("/businessTax/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const applicant = await Backroom.findByPk(id);
    if (!applicant)
      return res.status(404).json({ error: "Applicant not found" });

    const applicantData = applicant.toJSON();
    applicantData.BUSINESSTAX = "pending";
    applicantData.BUSINESSTAXtimeStamp = moment().format("DD/MM/YYYY HH:mm:ss");

    const created = await BusinessTax.create(applicantData);

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

// -----------------------------
// Approve applicant in BusinessTax and move to Treasurer's Office with file
router.post(
  "/business/approve/:id",
  upload.single("businessTaxComputation"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const file = req.file;

      const applicant = await BusinessTax.findByPk(id);
      if (!applicant)
        return res
          .status(404)
          .json({ error: "Applicant not found in BusinessTax" });

      const applicantBackroom = await Backroom.findByPk(id);
      if (!applicantBackroom)
        return res
          .status(404)
          .json({ error: "Applicant not found in Backroom" });

      const applicantStatus = await AppStatus.findByPk(id);
      if (!applicantStatus)
        return res.status(404).json({ error: "Applicant status not found" });

      const timestamp = moment().format("DD/MM/YYYY HH:mm:ss");

      // Update statuses
      await applicantBackroom.update({
        BUSINESSTAX: "Approved",
        BUSINESSTAXtimeStamp: timestamp,
        ...(file && {
          businesstaxComputation: file.buffer,
          businesstaxComputation_filename: file.originalname,
          businesstaxComputation_mimetype: file.mimetype,
          businesstaxComputation_size: file.size,
        }),
      });
      await applicant.update({
        BUSINESSTAX: "Approved",
        BUSINESSTAXtimeStamp: timestamp,
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
      });

      // Move to Treasurer's Office
      const applicantData = applicant.toJSON();
      if (file) {
        await applicant.update({
          businesstaxComputation: file.buffer,
          businesstaxComputation_filename: file.originalname,
          businesstaxComputation_mimetype: file.mimetype,
          businesstaxComputation_size: file.size,
        });
      }
      applicantData.BUSINESSTAX = "Approved";
      applicantData.BUSINESSTAXtimeStamp = timestamp;

      const created = await TreasurersOffice.create(applicantData);

      res.status(201).json({
        message:
          "Applicant approved, file uploaded, and moved to Treasurer's Office",
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
