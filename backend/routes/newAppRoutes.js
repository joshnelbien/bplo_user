const express = require("express");
const multer = require("multer");
const File = require("../db/model/files");
const AppStatus = require("../db/model/applicantStatusDB");
const UserAccounts = require("../db/model/userAccounts");
const { where } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const { sequelize } = require("../db/sequelize");

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
    const t = await sequelize.transaction();
    try {
      const files = req.files;
      const body = req.body;

      const sharedId = uuidv4();
      const { userId } = body; // ✅ extract userId

      const fileData = {};
      if (files) {
        Object.keys(files).forEach((key) => {
          const f = files[key][0];
          fileData[key] = f.buffer;
          fileData[`${key}_filename`] = f.originalname;
          fileData[`${key}_mimetype`] = f.mimetype;
          fileData[`${key}_size`] = f.size;
        });
      }

      const createdFile = await File.create(
        {
          id: sharedId,
          userId, // ✅ save userId in File
          ...body,
          ...fileData,
        },
        { transaction: t }
      );

      const createdStatus = await AppStatus.create(
        {
          id: sharedId,
          userId, // ✅ also save userId in AppStatus
        },
        { transaction: t }
      );

      await t.commit();

      res.status(201).json({
        file: createdFile,
        status: createdStatus,
        sharedId,
      });
    } catch (err) {
      await t.rollback();
      console.error("Upload failed:", err);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);

// List files

router.get("/files", async (req, res) => {
  try {
    const files = await File.findAll();
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

// ✅ Corrected route
router.put("/appDone/:id", async (req, res) => {
  try {
    const { id } = req.params; // get the id from the URL

    const file = await File.findByPk(id);
    if (!file) return res.status(404).send("File not found");

    await file.update({ permitRelease: "Done" });

    res.status(200).send("Permit marked as released");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
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

router.get("/:id", async (req, res) => {
  try {
    const user = await UserAccounts.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/files/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const file = await File.findByPk(id);
    if (!file) return res.status(404).json({ error: "Applicant not found" });

    await file.update(updates); // update only provided fields
    res.status(200).json(file);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});

module.exports = router;
