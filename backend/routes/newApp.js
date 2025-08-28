const express = require("express");
const multer = require("multer");
const File = require("../db/model/files");

const router = express.Router();

// Multer in-memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Upload files + text fields
router.post(
  "/files",
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
      const body = req.body; // <- text inputs are here
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

      const created = await File.create(payload);
      res.status(201).json(created);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

// List files

router.get("/files", async (req, res) => {
  try {
    const files = await File.findAll({ order: [["createdAt", "DESC"]] });
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

router.get("/files/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const files = await File.findAll({
      attributes: ["status"], // ✅ only fetch status + trackerId
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
router.get("/files/:id/:key", async (req, res) => {
  const { id, key } = req.params;
  const file = await File.findByPk(id);
  if (!file) return res.status(404).send("Not found");

  if (!file[key]) return res.status(404).send("File not found");
  res.setHeader("Content-Type", file[`${key}_mimetype`]);
  res.setHeader(
    "Content-Disposition",
    `inline; filename="${file[`${key}_filename`]}"`
  );
  res.send(file[key]);
});

// Download file
router.get("/files/:id/:key/download", async (req, res) => {
  const { id, key } = req.params;
  const file = await File.findByPk(id);
  if (!file) return res.status(404).send("Not found");

  if (!file[key]) return res.status(404).send("File not found");
  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${file[`${key}_filename`]}"`
  );
  res.send(file[key]);
});

module.exports = router;
