const express = require("express");
const multer = require("multer");
const Backroom = require("../db/model/backroomLocal");
const File = require("../db/model/files");
const router = express.Router();
const moment = require("moment");

// Multer in-memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Upload files + text fields
router.post("/backroom/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Get applicant from Files table
    const applicant = await File.findByPk(id);
    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    // 2. Insert into Backroom with timestamp
    const backroomData = applicant.toJSON();

    backroomData.BPLO = "Approved";
    backroomData.BPLOtimeStamp = moment().format("DD/MM/YYYY HH:mm:ss");

    const created = await Backroom.create(backroomData);

    // 3. Remove from Files (move instead of copy)
    await applicant.destroy();

    res
      .status(201)
      .json({ message: "Applicant approved and moved to Backroom", created });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ error: "Failed to approve applicant" });
  }
});
// List file

router.post("/obo/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const applicant = await Backroom.findByPk(id);
    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    // ✅ Destructure fields from request body
    const { BSAP, SR, Mechanical, Electrical, Signage, Electronics } = req.body;

    // ✅ Update fields
    applicant.OBO = "Approved";
    applicant.OBOtimeStamp = moment().format("DD/MM/YYYY HH:mm:ss");

    if (BSAP) applicant.BSAP = BSAP;
    if (SR) applicant.SR = SR;
    if (Mechanical) applicant.Mechanical = Mechanical;
    if (Electrical) applicant.Electrical = Electrical;
    if (Signage) applicant.Signage = Signage;
    if (Electronics) applicant.Electronics = Electronics;

    await applicant.save();

    res.json({ message: "Applicant approved", applicant });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ error: "Failed to approve applicant" });
  }
});

router.post(
  "/zoning/approve/:id",
  upload.single("zoningCert"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { zoningFee } = req.body; // ✅ grab zoningFee from formData

      const applicant = await Backroom.findByPk(id);
      if (!applicant) {
        return res.status(404).json({ error: "Applicant not found" });
      }

      applicant.ZONING = "Approved";
      applicant.ZONINGtimeStamp = moment().format("DD/MM/YYYY HH:mm:ss");

      applicant.zoningFee = zoningFee;

      if (req.file) {
        applicant.zoningCert = req.file.buffer; // store raw binary
        applicant.zoningCert_filename = req.file.originalname;
        applicant.zoningCert_mimetype = req.file.mimetype;
        applicant.zoningCert_size = req.file.size;
      }

      await applicant.save();

      res.json({ message: "Applicant approved", applicant });
    } catch (err) {
      console.error("Approve error:", err);
      res.status(500).json({ error: "Failed to approve applicant" });
    }
  }
);

router.post("/cho/approve/:id", upload.single("choCert"), async (req, res) => {
  try {
    const { id } = req.params;
    const { choFee } = req.body; // ✅ grab choFee from formData

    const applicant = await Backroom.findByPk(id);
    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    // ✅ Save CHO approval
    applicant.CHO = "Approved";
    applicant.CHOtimeStamp = moment().format("DD/MM/YYYY HH:mm:ss");

    // ✅ Save CHO fee
    applicant.choFee = choFee; // <-- must exist in your DB model

    // ✅ If file uploaded, save it in DB
    if (req.file) {
      applicant.choCert = req.file.buffer; // store raw binary
      applicant.choCert_filename = req.file.originalname;
      applicant.choCert_mimetype = req.file.mimetype;
      applicant.choCert_size = req.file.size;
    }

    await applicant.save();

    res.json({ message: "Applicant approved", applicant });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ error: "Failed to approve applicant" });
  }
});

router.post("/cenro/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const applicant = await Backroom.findByPk(id);
    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    // ✅ Update CENRO to Approved
    applicant.CENRO = "Approved";
    applicant.CENROtimeStamp = moment().format("DD/MM/YYYY HH:mm:ss");
    await applicant.save();

    // ✅ (Optional) If you really want to destroy it after approval
    // await applicant.destroy();

    res.json({ message: "Applicant approved", applicant });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ error: "Failed to approve applicant" });
  }
});

router.post("/csmwo/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const applicant = await Backroom.findByPk(id);
    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    // ✅ Update  to Approved
    applicant.CSMWO = "Approved";
    applicant.CSMWOtimeStamp = moment().format("DD/MM/YYYY HH:mm:ss");
    await applicant.save();

    // ✅ (Optional) If you really want to destroy it after approval
    // await applicant.destroy();

    res.json({ message: "Applicant approved", applicant });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ error: "Failed to approve applicant" });
  }
});

// List files
router.get("/backrooms", async (req, res) => {
  try {
    const backrooms = await Backroom.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(backrooms);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

router.get("/backrooms/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const backrooms = await Backroom.findAll({
      where: { userId: id }, // ✅ filter by userId
      order: [["createdAt", "DESC"]],
    });
    res.json(backrooms);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

// Preview file
router.get("/backroom/:id/:key", async (req, res) => {
  const { id, key } = req.params;
  const backroom = await Backroom.findByPk(id);
  if (!backroom) return res.status(404).send("Not found");

  if (!backroom[key]) return res.status(404).send("File not found");
  res.setHeader("Content-Type", backroom[`${key}_mimetype`]);
  res.setHeader(
    "Content-Disposition",
    `inline; filename="${backroom[`${key}_filename`]}"`
  );
  res.send(backroom[key]);
});

// Download file
router.get("/backroom/:id/:key/download", async (req, res) => {
  const { id, key } = req.params;
  const backroom = await Backroom.findByPk(id);
  if (!backroom) return res.status(404).send("Not found");

  if (!backroom[key]) return res.status(404).send("File not found");
  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${backroom[`${key}_filename`]}"`
  );
  res.send(backroom[key]);
});

module.exports = router;
