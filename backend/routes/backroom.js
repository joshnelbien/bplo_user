const express = require("express");
const multer = require("multer");
const Backroom = require("../db/model/backroomLocal");
const File = require("../db/model/files");
const router = express.Router();

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

    // 2. Insert into Backroom
    const backroomData = applicant.toJSON();

    const created = await Backroom.create(backroomData);

    // 3. Remove from Files (move instead of copy)
    await applicant.destroy();

    res.status(201).json({ message: "Applicant approved and moved to Backroom", created });
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

    // ✅ Update OBO to Approved
    applicant.OBO = "Approved";
    await applicant.save();

    // ✅ (Optional) If you really want to destroy it after approval
    // await applicant.destroy();

    res.json({ message: "Applicant approved", applicant });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ error: "Failed to approve applicant" });
  }
});


router.post("/zoning/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const applicant = await Backroom.findByPk(id);
    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    // ✅ Update zoning to Approved
    applicant.ZONING = "Approved";
    await applicant.save();

    // ✅ (Optional) If you really want to destroy it after approval
    // await applicant.destroy();

    res.json({ message: "Applicant approved", applicant });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ error: "Failed to approve applicant" });
  }
});

router.post("/cho/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const applicant = await Backroom.findByPk(id);
    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    // ✅ Update cho to Approved
    applicant.CHO = "Approved";
    await applicant.save();

    // ✅ (Optional) If you really want to destroy it after approval
    // await applicant.destroy();

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
    await applicant.save();

    // ✅ (Optional) If you really want to destroy it after approval
    // await applicant.destroy();

    res.json({ message: "Applicant approved", applicant });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ error: "Failed to approve applicant" });
  }
});

router.post("/cmswo/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const applicant = await Backroom.findByPk(id);
    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    // ✅ Update  to Approved
    applicant.CMSWO = "Approved";
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
    const backrooms = await Backroom.findAll({ order: [["createdAt", "DESC"]] });
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
