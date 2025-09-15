const express = require("express");
const multer = require("multer");
const moment = require("moment");
const Backroom = require("../db/model/backroomLocal");
const BusinessTax = require("../db/model/businessTax");
const AppStatus = require("../db/model/applicantStatusDB");
const TreasurersOffice = require("../db/model/treasurersOfficeDB");

const router = express.Router();

// ✅ Multer setup
const storage = multer.memoryStorage(); // store uploaded files in memory
const upload = multer({ storage }); // define upload variable

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
        "Applicant approved, archived in Files, and moved to businessTax",
      created,
    });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ error: "Failed to approve applicant" });
  }
});

// Approve applicant in BusinessTax and move to Treasurer's Office (with optional file upload)
router.post(
  "/business/approve/:id",
  upload.single("businessTaxCompute"), // ✅ handle uploaded file
  async (req, res) => {
    try {
      const { id } = req.params;
      const file = req.file;

      const applicant = await BusinessTax.findByPk(id);
      if (!applicant)
        return res
          .status(404)
          .json({ error: "Applicant not found in BusinessTax" });

      const applicantbackroom = await Backroom.findByPk(id);
      if (!applicantbackroom)
        return res
          .status(404)
          .json({ error: "Applicant not found in Backroom" });

      const applicantStatus = await AppStatus.findByPk(id);
      if (!applicantStatus)
        return res.status(404).json({ error: "Applicant status not found" });

      const timestamp = moment().format("DD/MM/YYYY HH:mm:ss");

      // Update statuses
      await applicantbackroom.update({
        BUSINESSTAX: "Approved",
        BUSINESSTAXtimeStamp: timestamp,
      });

      await applicant.update({
        BUSINESSTAX: "Approved",
        BUSINESSTAXtimeStamp: timestamp,
        ...(file && {
          businesstaxComputaion_filename: file.originalname,
          businesstaxComputaion_mimetype: file.mimetype,
          businesstaxComputaion_size: file.size,
          businesstaxComputaion_data: file.buffer,
        }),
      });

      await applicantStatus.update({
        BUSINESSTAX: "Approved",
        BUSINESSTAXtimeStamp: timestamp,
      });

      // Move to Treasurer's Office
      const applicantData = applicant.toJSON();
      applicantData.BUSINESSTAX = "Approved";
      applicantData.BUSINESSTAXtimeStamp = timestamp;

      if (file) {
        applicantData.businesstaxComputaion_filename = file.originalname;
        applicantData.businesstaxComputaion_mimetype = file.mimetype;
        applicantData.businesstaxComputaion_size = file.size;
        applicantData.businesstaxComputaion_data = file.buffer;
      }

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

// View uploaded file
router.get("/businessTax/:id/:key", async (req, res) => {
  try {
    const { id, key } = req.params;
    const file = await BusinessTax.findByPk(id); // ✅ fixed capitalization
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

// Download uploaded file
router.get("/businessTax/:id/:key/download", async (req, res) => {
  try {
    const { id, key } = req.params;
    const file = await BusinessTax.findByPk(id); // ✅ fixed capitalization
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
