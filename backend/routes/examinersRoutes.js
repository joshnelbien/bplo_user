const express = require("express");
const multer = require("multer");
const Examiners = require("../db/model/examiners");
const File = require("../db/model/files");
const Backroom = require("../db/model/backroomLocal");
const router = express.Router();
const moment = require("moment");
const AppStatus = require("../db/model/applicantStatusDB");

// Multer in-memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Initialize BIN counters
let sequenceStart = 403424; // first 7-digit sequence
let suffixStart = 400; // last 6-digit sequence

function generateBIN() {
  const year = new Date().getFullYear();
  const bin = `${sequenceStart
    .toString()
    .padStart(7, "0")}-${year}-${suffixStart.toString().padStart(7, "0")}`;
  sequenceStart++;
  suffixStart++;
  return bin;
}

// Upload files + text fields
router.post(
  "/examiners",
  upload.fields([
    { name: "proofOfReg" },
    { name: "proofOfRightToUseLoc" },
    { name: "locationPlan" },
    { name: "brgyClearance" },
    { name: "marketClearance" },
    { name: "occupancyPermit" },
    { name: "cedula" },
    { name: "photoOfBusinessEstInt" },
    { name: "photoOfBusinessEstExt" },
    { name: "tIGEfiles" },
  ]),
  async (req, res) => {
    try {
      const files = req.files;
      const body = req.body;
      const fileData = {};

      // Save each uploaded file’s info
      if (files) {
        Object.keys(files).forEach((key) => {
          const f = files[key][0];
          fileData[key] = f.buffer;
          fileData[`${key}_filename`] = f.originalname;
          fileData[`${key}_mimetype`] = f.mimetype;
          fileData[`${key}_size`] = f.size;
        });
      }

      // Merge text fields + file data
      const payload = {
        ...body,
        ...fileData,
      };

      const created = await Examiners.create(payload);
      res.status(201).json(created);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

// Approve from Files -> Examiners
router.post("/bplo/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const applicant = await File.findByPk(id);
    if (!applicant)
      return res.status(404).json({ error: "Applicant not found" });

    const applicantStatus = await AppStatus.findByPk(id);
    if (!applicantStatus)
      return res.status(404).json({ error: "Applicant not found" });

    const applicantData = applicant.toJSON();

    applicantData.BPLO = "Approved";
    applicantData.BPLOtimeStamp = moment().format("DD/MM/YYYY HH:mm:ss");

    const created = await Examiners.create(applicantData);

    await applicant.update({
      BPLO: "Approved",
      BPLOtimeStamp: applicantData.BPLOtimeStamp,
      status: "Approved",
    });

    await applicantStatus.update({
      BPLO: "Approved",
      BPLOtimeStamp: applicantData.BPLOtimeStamp,
    });

    res.status(201).json({
      message: "Applicant approved, archived in Files, and moved to Examiners",
      created,
    });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ error: "Failed to approve applicant" });
  }
});

// Approve from Examiners -> Backroom
router.post("/examiners/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const applicant = await Examiners.findByPk(id);
    if (!applicant)
      return res.status(404).json({ error: "Applicant not found" });

    const applicantStatus = await AppStatus.findByPk(id);
    if (!applicantStatus)
      return res.status(404).json({ error: "Applicant not found" });

    const applicantData = applicant.toJSON();

    const timestamp = moment().format("DD/MM/YYYY HH:mm:ss");
    const BIN = generateBIN(); // sequential BIN

    applicantData.Examiners = "Approved";
    applicantData.ExaminerstimeStamp = timestamp;
    applicantData.status = "Approved";
    applicantData.BIN = BIN;

    const created = await Backroom.create(applicantData);

    await applicant.update({
      Examiners: "Approved",
      ExaminerstimeStamp: timestamp,
      status: "Approved",
      BIN: BIN,
    });

    await applicantStatus.update({
      Examiners: "Approved",
      ExaminerstimeStamp: timestamp,
    });

    res.status(201).json({
      message: "Applicant approved and moved to Backroom",
      created,
    });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ error: "Failed to approve applicant" });
  }
});

// List all examiner records
router.get("/examiners", async (req, res) => {
  try {
    const files = await Examiners.findAll();
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

// List files of a specific user by userId
router.get("/examiners/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const files = await Examiners.findAll({
      attributes: ["status"],
      where: { userId: id },
      order: [["createdAt", "DESC"]],
    });
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

// Preview file
router.get("/examiners/:id/:key", async (req, res) => {
  try {
    const { id, key } = req.params;
    const file = await Examiners.findByPk(id);
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
router.get("/examiners/:id/:key/download", async (req, res) => {
  try {
    const { id, key } = req.params;
    const file = await Examiners.findByPk(id);
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
