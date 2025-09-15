const express = require("express");
const Backroom = require("../db/model/backroomLocal");
const BusinessTax = require("../db/model/businessTax");
const router = express.Router();
const moment = require("moment");
const AppStatus = require("../db/model/applicantStatusDB");
const TreasurersOffice = require("../db/model/treasurersOfficeDB");

router.post("/businessTax/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Get applicant from Files table
    const applicant = await Backroom.findByPk(id);
    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    // 2. Convert to plain object
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

//approved to business tax pass to treasurer's office
router.post("/business/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Get applicant from BusinessTax table
    const applicant = await BusinessTax.findByPk(id);
    if (!applicant) {
      return res
        .status(404)
        .json({ error: "Applicant not found in BusinessTax" });
    }

    // 2. Get applicant from Backroom
    const applicantbackroom = await Backroom.findByPk(id);
    if (!applicantbackroom) {
      return res.status(404).json({ error: "Applicant not found in Backroom" });
    }

    // 3. Get applicant status
    const applicantStatus = await AppStatus.findByPk(id);
    if (!applicantStatus) {
      return res.status(404).json({ error: "Applicant status not found" });
    }

    // 4. Update statuses
    const timestamp = moment().format("DD/MM/YYYY HH:mm:ss");

    await applicantbackroom.update({
      BUSINESSTAX: "Approved",
      BUSINESSTAXtimeStamp: timestamp,
    });

    await applicant.update({
      BUSINESSTAX: "Approved",
      BUSINESSTAXtimeStamp: timestamp,
    });

    await applicantStatus.update({
      BUSINESSTAX: "Approved",
      BUSINESSTAXtimeStamp: timestamp,
    });

    // 5. Move applicant to Treasurer’s Office
    const applicantData = applicant.toJSON();
    applicantData.BUSINESSTAX = "Approved";
    applicantData.BUSINESSTAXtimeStamp = timestamp;

    const created = await TreasurersOffice.create(applicantData);

    res.status(201).json({
      message: "Applicant approved and moved to Treasurer's Office",
      created,
    });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ error: "Failed to approve applicant" });
  }
});

router.get("/businessTax", async (req, res) => {
  try {
    const files = await BusinessTax.findAll();
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
