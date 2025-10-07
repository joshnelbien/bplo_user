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
    const { businessDetails } = req.body; // ✅ receive from frontend

    // 📝 Log the incoming businessDetails to verify payload
    console.log("📥 Incoming businessDetails:", businessDetails);

    const applicant = await File.findByPk(id);
    if (!applicant)
      return res.status(404).json({ error: "Applicant not found" });

    const applicantStatus = await AppStatus.findByPk(id);
    if (!applicantStatus)
      return res.status(404).json({ error: "Applicant status not found" });

    // Convert applicant to JSON for Examiners insertion
    const applicantData = applicant.toJSON();

    applicantData.BPLO = "Approved";
    applicantData.BPLOtimeStamp = moment().format("DD/MM/YYYY HH:mm:ss");

    // ✅ Add FSIC fields here (if multiple lines, stringify them)
    if (businessDetails && businessDetails.length > 0) {
      applicantData.natureCode = businessDetails
        .map((b) => b.nature_code)
        .join(", ");
      applicantData.businessNature = businessDetails
        .map((b) => b.business_nature)
        .join(", ");
      applicantData.lineCode = businessDetails
        .map((b) => b.line_code)
        .join(", ");
    }

    // ✅ Insert into Examiners table
    const created = await Examiners.create(applicantData);

    // ✅ Update File & Status tables
    await applicant.update({
      BPLO: "Approved",
      BPLOtimeStamp: applicantData.BPLOtimeStamp,
      status: "Approved",
      natureCode: applicantData.natureCode,
      businessNature: applicantData.businessNature,
      lineCode: applicantData.lineCode,
    });

    await applicantStatus.update({
      BPLO: "Approved",
      BPLOtimeStamp: applicantData.BPLOtimeStamp,
    });

    res.status(201).json({
      message: "✅ Applicant approved and FSIC details saved",
      created,
    });
  } catch (err) {
    console.error("❌ Approve error:", err);
    res.status(500).json({ error: "Failed to approve applicant" });
  }
});

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

    const applicantFile = await File.findByPk(id);
    if (!applicant)
      return res.status(404).json({ error: "Applicant not found" });

    // ✅ Get last BIN from Backroom
    const lastBackroom = await Backroom.findOne({
      order: [["createdAt", "DESC"]],
      attributes: ["BIN"],
    });

    let newSequence = 403424; // default start
    let newSuffix = 400; // default start

    if (lastBackroom && lastBackroom.BIN) {
      const [seq, year, suffix] = lastBackroom.BIN.split("-");
      newSequence = parseInt(seq, 10) + 1;
      newSuffix = parseInt(suffix, 10) + 1;
    }

    const year = new Date().getFullYear();
    const BIN = `${newSequence.toString().padStart(7, "0")}-${year}-${newSuffix
      .toString()
      .padStart(7, "0")}`;

    // ✅ Apply updates
    applicantData.Examiners = "Approved";
    applicantData.ExaminerstimeStamp = timestamp;
    applicantData.status = "Approved";
    applicantData.BIN = BIN;

    const created = await Backroom.create(applicantData);

    await applicantFile.update({
      Examiners: "Approved",
      ExaminerstimeStamp: timestamp,
      BIN,
    });

    await applicant.update({
      Examiners: "Approved",
      ExaminerstimeStamp: timestamp,
      status: "Approved",
      BIN,
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
