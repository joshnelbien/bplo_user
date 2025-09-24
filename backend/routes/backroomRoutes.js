const express = require("express");
const multer = require("multer");
const Backroom = require("../db/model/backroomLocal");
const File = require("../db/model/files");
const AppStatus = require("../db/model/applicantStatusDB");
const router = express.Router();
const moment = require("moment");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/backroom/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const applicant = await File.findByPk(id);
    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    const backroomData = applicant.toJSON();

    backroomData.BPLO = "Approved";
    backroomData.BPLOtimeStamp = moment().format("DD/MM/YYYY HH:mm:ss");

    const created = await Backroom.create(backroomData);

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

// ✅ OBO APPROVE
router.post("/obo/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { BSAP, SR, Mechanical, Electrical, Signage, Electronics } = req.body;

    // fetch all 3 records
    const applicant = await File.findByPk(id);
    if (!applicant)
      return res.status(404).json({ error: "Applicant not found" });

    const applicantStatus = await AppStatus.findByPk(id);
    if (!applicantStatus)
      return res.status(404).json({ error: "Applicant status not found" });

    const backroom = await Backroom.findByPk(id);
    if (!backroom)
      return res.status(404).json({ error: "Backroom record not found" });

    const timeStamp = moment().format("DD/MM/YYYY HH:mm:ss");

    // ✅ Update Examiners
    await applicant.update({
      OBO: "Approved",
      OBOtimeStamp: timeStamp,
      ...(BSAP && { BSAP }),
      ...(SR && { SR }),
      ...(Mechanical && { Mechanical }),
      ...(Electrical && { Electrical }),
      ...(Signage && { Signage }),
      ...(Electronics && { Electronics }),
    });

    // ✅ Update AppStatus
    await applicantStatus.update({
      OBO: "Approved",
      OBOtimeStamp: timeStamp,
    });

    // ✅ Update Backroom
    await backroom.update({
      OBO: "Approved",
      OBOtimeStamp: timeStamp,
    });

    res.json({
      message: "Applicant approved",
      examiner: applicant,
      status: applicantStatus,
      backroom,
    });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ error: "Failed to approve applicant" });
  }
});

// ✅ OBO DECLINE
router.post("/obo/decline/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // fetch all 3 records
    const applicant = await File.findByPk(id);
    if (!applicant)
      return res.status(404).json({ error: "Applicant not found" });

    const applicantStatus = await AppStatus.findByPk(id);
    if (!applicantStatus)
      return res.status(404).json({ error: "Applicant status not found" });

    const backroom = await Backroom.findByPk(id);
    if (!backroom)
      return res.status(404).json({ error: "Backroom record not found" });

    const timeStamp = moment().format("DD/MM/YYYY HH:mm:ss");
    const declineReason = reason || "No reason provided";

    // ✅ Update File
    await applicant.update({
      OBO: "Declined",
      OBOdecline: declineReason,
      OBOtimeStamp: timeStamp,
    });

    // ✅ Update AppStatus
    await applicantStatus.update({
      OBO: "Declined",
      OBOdecline: declineReason,
      OBOtimeStamp: timeStamp,
    });

    // ✅ Update Backroom
    await backroom.update({
      OBO: "Declined",
      OBOdecline: declineReason,
      OBOtimeStamp: timeStamp,
    });

    res.json({
      message: "Applicant declined",
      examiner: applicant,
      status: applicantStatus,
      backroom,
    });
  } catch (err) {
    console.error("Decline error:", err);
    res.status(500).json({ error: "Failed to decline applicant" });
  }
});

router.post(
  "/zoning/approve/:id",
  upload.single("zoningCert"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { zoningFee } = req.body;

      const applicant = await File.findByPk(id);
      if (!applicant) {
        return res.status(404).json({ error: "Applicant not found" });
      }

      const applicantStatus = await AppStatus.findByPk(id);
      if (!applicantStatus) {
        return res.status(404).json({ error: "Applicant status not found" });
      }

      const backroomApplicant = await Backroom.findByPk(id);
      if (!backroomApplicant) {
        return res.status(404).json({ error: "Backroom record not found" });
      }

      const approveTime = moment().format("DD/MM/YYYY HH:mm:ss");

      // File
      applicant.ZONING = "Approved";
      applicant.ZONINGtimeStamp = approveTime;
      applicant.zoningFee = zoningFee;

      if (req.file) {
        applicant.zoningCert = req.file.buffer;
        applicant.zoningCert_filename = req.file.originalname;
        applicant.zoningCert_mimetype = req.file.mimetype;
        applicant.zoningCert_size = req.file.size;
      }

      await applicant.save();

      // AppStatus
      await applicantStatus.update({
        ZONING: "Approved",
        ZONINGtimeStamp: approveTime,
        ZONINGdecline: "",
      });

      // Backroom
      await Backroom.update(
        {
          ZONING: "Approved",
          ZONINGtimeStamp: approveTime,
          ZONINGdecline: "",
          zoningCert: req.file ? req.file.buffer : null,
          zoningCert_filename: req.file ? req.file.originalname : null,
          zoningCert_mimetype: req.file ? req.file.mimetype : null,
          zoningCert_size: req.file ? req.file.size : null,
        },
        { where: { id } }
      );

      res.json({ message: "Applicant approved", applicant });
    } catch (err) {
      console.error("Approve error:", err);
      res.status(500).json({ error: "Failed to approve applicant" });
    }
  }
);

router.post("/zoning/decline/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const applicant = await File.findByPk(id);
    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    const applicantStatus = await AppStatus.findByPk(id);
    if (!applicantStatus) {
      return res.status(404).json({ error: "Applicant status not found" });
    }

    const backroomApplicant = await Backroom.findByPk(id);
    if (!backroomApplicant) {
      return res.status(404).json({ error: "Backroom record not found" });
    }

    const declineTime = moment().format("DD/MM/YYYY HH:mm:ss");

    // File
    applicant.ZONING = "Declined";
    applicant.ZONINGtimeStamp = declineTime;
    applicant.ZONINGdecline = reason;
    await applicant.save();

    // AppStatus
    await applicantStatus.update({
      ZONING: "Declined",
      ZONINGtimeStamp: declineTime,
      ZONINGdecline: reason,
    });

    // Backroom
    await Backroom.update(
      {
        ZONING: "Declined",
        ZONINGtimeStamp: declineTime,
        ZONINGdecline: reason,
        zoningCert: null,
        zoningCert_filename: null,
        zoningCert_mimetype: null,
        zoningCert_size: null,
      },
      { where: { id } }
    );

    res.json({
      message: "Applicant declined successfully",
      applicant,
    });
  } catch (err) {
    console.error("Decline error:", err);
    res.status(500).json({ error: "Failed to decline applicant" });
  }
});

router.post("/cho/approve/:id", upload.single("choCert"), async (req, res) => {
  try {
    const { id } = req.params;
    const { choFee } = req.body;

    const applicant = await File.findByPk(id);
    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    const applicantStatus = await AppStatus.findByPk(id);
    if (!applicantStatus) {
      return res.status(404).json({ error: "Applicant status not found" });
    }

    const backroomApplicant = await Backroom.findByPk(id);
    if (!backroomApplicant) {
      return res.status(404).json({ error: "Backroom record not found" });
    }

    const approveTime = moment().format("DD/MM/YYYY HH:mm:ss");

    // File
    applicant.CHO = "Approved";
    applicant.CHOtimeStamp = approveTime;
    applicant.choFee = choFee;

    if (req.file) {
      applicant.choCert = req.file.buffer;
      applicant.choCert_filename = req.file.originalname;
      applicant.choCert_mimetype = req.file.mimetype;
      applicant.choCert_size = req.file.size;
    }
    await applicant.save();

    // AppStatus
    await applicantStatus.update({
      CHO: "Approved",
      CHOtimeStamp: approveTime,
      CHOdecline: "",
    });

    // Backroom
    await Backroom.update(
      {
        CHO: "Approved",
        CHOtimeStamp: approveTime,
        CHOdecline: "",
        choCert: req.file ? req.file.buffer : null,
        choCert_filename: req.file ? req.file.originalname : null,
        choCert_mimetype: req.file ? req.file.mimetype : null,
        choCert_size: req.file ? req.file.size : null,
      },
      { where: { id } }
    );

    res.json({ message: "Applicant approved", applicant });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ error: "Failed to approve applicant" });
  }
});

router.post("/cho/decline/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const applicant = await File.findByPk(id);
    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    const applicantStatus = await AppStatus.findByPk(id);
    if (!applicantStatus) {
      return res.status(404).json({ error: "Applicant status not found" });
    }

    const backroomApplicant = await Backroom.findByPk(id);
    if (!backroomApplicant) {
      return res.status(404).json({ error: "Backroom record not found" });
    }

    const declineTime = moment().format("DD/MM/YYYY HH:mm:ss");

    // File
    applicant.CHO = "Declined";
    applicant.CHOtimeStamp = declineTime;
    applicant.CHOdecline = reason;
    await applicant.save();

    // AppStatus
    await applicantStatus.update({
      CHO: "Declined",
      CHOtimeStamp: declineTime,
      CHOdecline: reason,
    });

    // Backroom
    await Backroom.update(
      {
        CHO: "Declined",
        CHOtimeStamp: declineTime,
        CHOdecline: reason,
        choCert: null,
        choCert_filename: null,
        choCert_mimetype: null,
        choCert_size: null,
      },
      { where: { id } }
    );

    res.json({
      message: "Applicant declined",
      applicant,
    });
  } catch (err) {
    console.error("Decline error:", err);
    res.status(500).json({ error: "Failed to decline applicant" });
  }
});

router.post(
  "/cenro/approve/:id",
  upload.single("cenroCert"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { cenroFee } = req.body;

      const applicant = await File.findByPk(id);
      if (!applicant) {
        return res.status(404).json({ error: "Applicant not found" });
      }

      const applicantStatus = await AppStatus.findByPk(id);
      if (!applicantStatus) {
        return res.status(404).json({ error: "Applicant status not found" });
      }

      const backroomApplicant = await Backroom.findByPk(id);
      if (!backroomApplicant) {
        return res.status(404).json({ error: "Backroom record not found" });
      }

      const approveTime = moment().format("DD/MM/YYYY HH:mm:ss");

      // File
      applicant.CENRO = "Approved";
      applicant.CENROtimeStamp = approveTime;
      applicant.cenroFee = cenroFee;

      if (req.file) {
        applicant.cenroCert = req.file.buffer;
        applicant.cenroCert_filename = req.file.originalname;
        applicant.cenroCert_mimetype = req.file.mimetype;
        applicant.cenroCert_size = req.file.size;
      }
      await applicant.save();

      // AppStatus
      await applicantStatus.update({
        CENRO: "Approved",
        CENROtimeStamp: approveTime,
        CENROdecline: "",
      });

      // Backroom
      await Backroom.update(
        {
          CENRO: "Approved",
          CENROtimeStamp: approveTime,
          CENROdecline: "",
          cenroCert: req.file ? req.file.buffer : null,
          cenroCert_filename: req.file ? req.file.originalname : null,
          cenroCert_mimetype: req.file ? req.file.mimetype : null,
          cenroCert_size: req.file ? req.file.size : null,
        },
        { where: { id } }
      );

      res.json({ message: "Applicant approved", applicant });
    } catch (err) {
      console.error("Approve error:", err);
      res.status(500).json({ error: "Failed to approve applicant" });
    }
  }
);

router.post("/cenro/decline/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const applicant = await File.findByPk(id);
    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    const applicantStatus = await AppStatus.findByPk(id);
    if (!applicantStatus) {
      return res.status(404).json({ error: "Applicant status not found" });
    }

    const backroomApplicant = await Backroom.findByPk(id);
    if (!backroomApplicant) {
      return res.status(404).json({ error: "Backroom record not found" });
    }

    const declineTime = moment().format("DD/MM/YYYY HH:mm:ss");

    // File
    applicant.CENRO = "Declined";
    applicant.CENROtimeStamp = declineTime;
    applicant.CENROdecline = reason;
    await applicant.save();

    // AppStatus
    await applicantStatus.update({
      CENRO: "Declined",
      CENROtimeStamp: declineTime,
      CENROdecline: reason,
    });

    // Backroom
    await Backroom.update(
      {
        CENRO: "Declined",
        CENROtimeStamp: declineTime,
        CENROdecline: reason,
        cenroCert: null,
        cenroCert_filename: null,
        cenroCert_mimetype: null,
        cenroCert_size: null,
      },
      { where: { id } }
    );

    res.json({ message: "Applicant declined successfully", applicant });
  } catch (err) {
    console.error("Decline error:", err);
    res.status(500).json({ error: "Failed to decline applicant" });
  }
});

router.post(
  "/csmwo/approve/:id",
  upload.single("cswmoCert"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { csmwoFee } = req.body;

      // find applicant
      const applicant = await File.findByPk(id);
      if (!applicant) {
        return res.status(404).json({ error: "Applicant not found" });
      }

      // find applicant status
      const applicantStatus = await AppStatus.findByPk(id);
      if (!applicantStatus) {
        return res.status(404).json({ error: "Applicant status not found" });
      }

      const backroomApplicant = await Backroom.findByPk(id);
      if (!applicantStatus) {
        return res.status(404).json({ error: "Applicant status not found" });
      }

      // update applicant fields
      applicant.CSMWO = "Approved";
      applicant.CSMWOtimeStamp = moment().format("DD/MM/YYYY HH:mm:ss");
      applicant.csmwoFee = csmwoFee;

      if (req.file) {
        applicant.cswmoCert = req.file.buffer;
        applicant.cswmoCert_filename = req.file.originalname;
        applicant.cswmoCert_mimetype = req.file.mimetype;
        applicant.cswmoCert_size = req.file.size;
      }

      await applicant.save();

      await Backroom.update(
        {
          CSMWO: "Approved",
          CSMWOtimeStamp: backroomApplicant.CSMWOtimeStamp,
          CSMWOdecline: "",
          cswmoCert: req.file ? req.file.buffer : null,
          cswmoCert_filename: req.file ? req.file.originalname : null,
          cswmoCert_mimetype: req.file ? req.file.mimetype : null,
          cswmoCert_size: req.file ? req.file.size : null,
        },
        { where: { id } }
      );

      await File.update(
        {
          CSMWO: "Approved",
          CSMWOtimeStamp: applicant.CSMWOtimeStamp,
          CSMWOdecline: "",
          cswmoCert: req.file ? req.file.buffer : null,
          cswmoCert_filename: req.file ? req.file.originalname : null,
          cswmoCert_mimetype: req.file ? req.file.mimetype : null,
          cswmoCert_size: req.file ? req.file.size : null,
        },
        { where: { id } }
      );

      // update applicant status
      await applicantStatus.update({
        CSMWO: "Approved",
        CSMWOtimeStamp: applicant.CSMWOtimeStamp,
        CSMWOdecline: "",
      });

      res.json({ message: "Applicant approved", applicant });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to approve applicant" });
    }
  }
);

router.post("/csmwo/decline/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body; // ⬅️ get reason from frontend

    // 1. Find applicant in File
    const applicant = await File.findByPk(id);
    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    const applicantStatus = await AppStatus.findByPk(id);
    if (!applicantStatus) {
      return res.status(404).json({ error: "Applicant status not found" });
    }

    const backroomApplicant = await Backroom.findByPk(id);
    if (!backroomApplicant) {
      return res.status(404).json({ error: "Backroom record not found" });
    }

    // 2. Update status, timestamp & decline reason
    const declineTime = moment().format("DD/MM/YYYY HH:mm:ss");

    // File
    applicant.CSMWO = "Declined";
    applicant.CSMWOtimeStamp = declineTime;
    applicant.CSMWOdecline = reason;
    await applicant.save();

    // AppStatus
    await applicantStatus.update({
      CSMWO: "Declined",
      CSMWOtimeStamp: declineTime,
      CSMWOdecline: reason,
    });

    // Backroom
    await Backroom.update(
      {
        CSMWO: "Declined",
        CSMWOtimeStamp: declineTime,
        CSMWOdecline: reason,
        cswmoCert: null,
        cswmoCert_filename: null,
        cswmoCert_mimetype: null,
        cswmoCert_size: null,
      },
      { where: { id } }
    );

    // 3. Respond
    res.json({
      message: "Applicant declined successfully",
      applicant,
    });
  } catch (err) {
    console.error("Decline error:", err);
    res.status(500).json({ error: "Failed to decline applicant" });
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
      where: { userId: id },
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
