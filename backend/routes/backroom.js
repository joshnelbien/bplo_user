const express = require("express");
const multer = require("multer");
const Backroom = require("../db/model/backroomLocal");
const Files = require("../db/model/files");
const router = express.Router();

// Multer in-memory storage
const upload = multer({ storage: multer.memoryStorage() });


// Upload files + text fields
router.post(
  "/backroom",
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
      const backroomData = {};

      // Save each uploaded file’s info
      if (backroom) {
        Object.keys(backroom).forEach((key) => {
          const f = backroom[key][0];
          backroomData[key] = f.buffer;
          backroomData[`${key}_filename`] = f.originalname;
          backroomData[`${key}_mimetype`] = f.mimetype;
          backroomData[`${key}_size`] = f.size;
        });
      }

      // Merge text fields + file data
      const payload = {
        ...body,
        ...backroomData,
      };

      const created = await Backroom.create(payload);
      res.status(201).json(created);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

// approve applicant -> move from Files to Backroom
router.post("/backroom/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Get applicant from Files table
    const applicant = await Files.findByPk(id);
    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    // 2. Insert into Backroom
    const backroomData = applicant.toJSON();
    delete backroomData.id; // let Backroom have its own UUID

    const created = await Backroom.create(backroomData);

    // 3. Remove from Files (move instead of copy)
    await applicant.destroy();

    res.status(201).json({ message: "Applicant approved and moved to Backroom", created });
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
