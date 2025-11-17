const express = require("express");
const multer = require("multer");
const File = require("../db/model/files");
const AppStatus = require("../db/model/applicantStatusDB");
const UserAccounts = require("../db/model/userAccounts");
const BusinessProfile = require("../db/model/businessProfileDB");
const Backroom = require("../db/model/backroomLocal");
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

router.post(
  "/files-renewal",
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
    { name: "RecentBusinessPermit" },
  ]),
  async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { files, body } = req;
      const sharedId = uuidv4();

      // ✅ Ensure `userId` exists
      if (!body.userId) {
        return res.status(400).json({ error: "Missing userId in form data." });
      }

      const userId = body.userId;

      // ✅ Extract file info into fileData object
      const fileData = {};
      if (files && Object.keys(files).length > 0) {
        Object.entries(files).forEach(([key, fileArray]) => {
          const file = fileArray[0];
          fileData[key] = file.buffer;
          fileData[`${key}_filename`] = file.originalname;
          fileData[`${key}_mimetype`] = file.mimetype;
          fileData[`${key}_size`] = file.size;
        });
      }

      // ✅ Create File record
      const createdFile = await File.create(
        {
          id: sharedId,
          userId,
          ...body, // includes all form fields (business info, etc.)
          ...fileData, // includes uploaded file binary + metadata
          applicationType: "Renewal",
          submittedAt: new Date(),
        },
        { transaction: t }
      );

      // ✅ Create corresponding AppStatus record
      const createdStatus = await AppStatus.create(
        {
          id: sharedId,
          userId,
          status: "Submitted",
          remarks: "Renewal Application Submitted",
          updatedAt: new Date(),
        },
        { transaction: t }
      );

      // ✅ Commit the transaction
      await t.commit();

      return res.status(201).json({
        success: true,
        message: "Renewal application submitted successfully!",
        file: createdFile,
        status: createdStatus,
        sharedId,
      });
    } catch (err) {
      console.error("❌ Upload failed:", err);
      await t.rollback();
      return res.status(500).json({
        success: false,
        error: "Internal server error during upload.",
      });
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
router.put(
  "/appDone/:id",
  upload.single("businessPermit"), // <-- matches the FormData key
  async (req, res) => {
    try {
      const { id } = req.params;

      // Find the record in File table
      const file = await File.findByPk(id);
      if (!file) return res.status(404).send("File not found");
      const backroom = await Backroom.findByPk(id);
      if (!backroom) return res.status(404).send("File not found");

      // Update permitRelease in File table

      // Prepare file data if uploaded
      const { originalname, mimetype, size, buffer } = req.file || {};

      await backroom.update({
        permitRelease: "Done",
        businessPermit: buffer || null,
        businessPermit_filename: originalname || null,
        businessPermit_mimetype: mimetype || null,
        businessPermit_size: size || null,
      });
      await file.update({
        permitRelease: "Done",
        businessPermit: buffer || null,
        businessPermit_filename: originalname || null,
        businessPermit_mimetype: mimetype || null,
        businessPermit_size: size || null,
      });

      // Create a copy in BusinessProfile
      const created = await BusinessProfile.create({
        ...file.toJSON(),
        permitRelease: "Done",
        businessPermit: buffer || null,
        businessPermit_filename: originalname || null,
        businessPermit_mimetype: mimetype || null,
        businessPermit_size: size || null,
      });

      res.status(200).json({
        message:
          "Applicant approved, archived in Files, uploaded file saved, and added to Business Profile.",
        businessProfile: created,
      });
    } catch (err) {
      console.error("❌ Error in /appDone route:", err);
      res.status(500).send("Server error");
    }
  }
);

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
