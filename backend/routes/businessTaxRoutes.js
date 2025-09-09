const express = require("express");
const Backroom = require("../db/model/backroomLocal");
const BusinessTax = require("../db/model/businessTax");
const router = express.Router();
const moment = require("moment");

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

    applicantData.BusinessTax = "Approved";
    applicantData.BusinessTaxtimeStamp = moment().format("DD/MM/YYYY HH:mm:ss");

    const created = await BusinessTax.create(applicantData);

    await applicant.update({
      BusinessTax: "Approved",
      BusinessTaxtimeStamp: applicantData.BusinessTaxtimeStamp,
      status: "Approved",
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

module.exports = router;
