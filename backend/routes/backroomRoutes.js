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

router.post("/obo/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const applicant = await Backroom.findByPk(id);
    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    const applicantStatus = await AppStatus.findByPk(id);
    if (!applicantStatus) {
      return res.status(404).json({ error: "Applicant not found" });
    }

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

    await applicantStatus.update({
      OBO: "Approved",
      OBOtimeStamp: applicant.OBOtimeStamp,
    });

    res.json({ message: "Applicant approved", applicant });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ error: "Failed to approve applicant" });
  }
});

router.post("/obo/decline/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body; // get reason from frontend

    const applicant = await Backroom.findByPk(id);
    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    const applicantStatus = await AppStatus.findByPk(id);
    if (!applicantStatus) {
      return res.status(404).json({ error: "Applicant status not found" });
    }

    // ✅ Update fields
    applicant.OBO = "Declined";
    applicant.OBOdecline = reason || "Declined"; // save reason
    applicant.OBOtimeStamp = moment().format("DD/MM/YYYY HH:mm:ss");

    await applicant.save();

    await applicantStatus.update({
      OBO: "Declined",
      OBOdecline: applicant.OBOdecline,
      OBOtimeStamp: applicant.OBOtimeStamp,
    });

    res.json({ message: "Applicant declined", applicant });
  } catch (err) {
    console.error("Decline error:", err);
    res.status(500).json({ error: "Failed to Decline applicant" });
  }
});

router.post(
  "/zoning/approve/:id",
  upload.single("zoningCert"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { zoningFee } = req.body;

      const applicant = await Backroom.findByPk(id);
      if (!applicant) {
        return res.status(404).json({ error: "Applicant not found" });
      }

      const applicantStatus = await AppStatus.findByPk(id);
      if (!applicantStatus) {
        return res.status(404).json({ error: "Applicant not found" });
      }

      applicant.ZONING = "Approved";
      applicant.ZONINGtimeStamp = moment().format("DD/MM/YYYY HH:mm:ss");

      applicant.zoningFee = zoningFee;

      if (req.file) {
        applicant.zoningCert = req.file.buffer;
        applicant.zoningCert_filename = req.file.originalname;
        applicant.zoningCert_mimetype = req.file.mimetype;
        applicant.zoningCert_size = req.file.size;
      }

      await applicant.save();

      await applicantStatus.update({
        ZONING: "Approved",
        ZONINGtimeStamp: applicant.ZONINGtimeStamp,
      });

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

    const applicant = await Backroom.findByPk(id);
    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    const applicantStatus = await AppStatus.findByPk(id);
    if (!applicantStatus) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    // 2. Update status & timestamp
    applicant.ZONING = "Declined";
    applicant.ZONINGtimeStamp = moment().format("DD/MM/YYYY HH:mm:ss");

    // 3. Save changes
    await applicant.save();

    await applicantStatus.update({
      ZONING: "Declined",
      ZONINGtimeStamp: applicant.ZONINGtimeStamp,
    });

    // 4. Respond
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

    const applicant = await Backroom.findByPk(id);
    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    const applicantStatus = await AppStatus.findByPk(id);
    if (!applicantStatus) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    applicant.CHO = "Approved";
    applicant.CHOtimeStamp = moment().format("DD/MM/YYYY HH:mm:ss");

    applicant.choFee = choFee;

    if (req.file) {
      applicant.choCert = req.file.buffer;
      applicant.choCert_filename = req.file.originalname;
      applicant.choCert_mimetype = req.file.mimetype;
      applicant.choCert_size = req.file.size;
    }

    await applicant.save();

    await applicantStatus.update({
      CHO: "Approved",
      CHOtimeStamp: applicant.CHOtimeStamp,
      CHOdecline: "",
    });

    res.json({ message: "Applicant approved", applicant });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ error: "Failed to approve applicant" });
  }
});

router.post("/cho/decline/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body; // <-- Get decline reason from frontend

    const applicant = await Backroom.findByPk(id);
    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    const applicantStatus = await AppStatus.findByPk(id);
    if (!applicantStatus) {
      return res.status(404).json({ error: "Applicant status not found" });
    }

    const declineTime = moment().format("DD/MM/YYYY HH:mm:ss");

    // Update Backroom
    applicant.CHO = "Declined";
    applicant.CHOtimeStamp = declineTime;
    applicant.CHOdecline = reason;
    await applicant.save();

    // Update AppStatus
    await applicantStatus.update({
      CHO: "Declined",
      CHOtimeStamp: declineTime,
      CHOdecline: reason,
    });

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

      const applicant = await Backroom.findByPk(id);
      if (!applicant) {
        return res.status(404).json({ error: "Applicant not found" });
      }

      const applicantStatus = await AppStatus.findByPk(id);
      if (!applicantStatus) {
        return res.status(404).json({ error: "Applicant not found" });
      }

      applicant.CENRO = "Approved";
      applicant.CENROtimeStamp = moment().format("DD/MM/YYYY HH:mm:ss");

      applicant.cenroFee = cenroFee;

      if (req.file) {
        applicant.cenroCert = req.file.buffer;
        applicant.cenroCert_filename = req.file.originalname;
        applicant.cenroCert_mimetype = req.file.mimetype;
        applicant.cenroCert_size = req.file.size;
      }
      await applicant.save();

      await applicantStatus.update({
        CENRO: "Approved",
        CENROtimeStamp: applicant.CENROtimeStamp,
        CENROdecline: "",
      });

      // ✅ (Optional) If you really want to destroy it after approval
      // await applicant.destroy();

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

    const applicant = await Backroom.findByPk(id);
    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    const applicantStatus = await AppStatus.findByPk(id);
    if (!applicantStatus) {
      return res.status(404).json({ error: "Applicant status not found" });
    }

    const declineTimestamp = moment().format("DD/MM/YYYY HH:mm:ss");

    applicant.CENRO = "Declined";
    applicant.CENROtimeStamp = declineTimestamp;
    applicant.CENROdecline = reason;

    await applicant.save();

    await applicantStatus.update({
      CENRO: "Declined",
      CENROtimeStamp: declineTimestamp,
      CENROdecline: reason,
    });

    res.json({ message: "Applicant declined", applicant });
  } catch (err) {
    console.error("Decline error:", err);
    res.status(500).json({ error: "Failed to decline applicant" });
  }
});

router.post("/csmwo/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { csmwoFee } = req.body;

    const applicant = await Backroom.findByPk(id);
    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }
    const applicantStatus = await AppStatus.findByPk(id);
    if (!applicantStatus) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    applicant.CSMWO = "Approved";
    applicant.CSMWOtimeStamp = moment().format("DD/MM/YYYY HH:mm:ss");
    applicant.csmwoFee = csmwoFee;

    await applicant.save();
    await applicantStatus.update({
      CSMWO: "Approved",
      CSMWOtimeStamp: applicant.CSMWOtimeStamp,
      CSMWOdecline: "",
    });

    res.json({ message: "Applicant approved", applicant });
  } catch (err) {
    res.status(500).json({ error: "Failed to approve applicant" });
  }
});
router.post("/csmwo/decline/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body; // ⬅️ get reason from frontend

    // 1. Find applicant in Backroom
    const applicant = await Backroom.findByPk(id);
    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }

    const applicantStatus = await AppStatus.findByPk(id);
    if (!applicantStatus) {
      return res.status(404).json({ error: "Applicant status not found" });
    }

    // 2. Update status, timestamp & decline reason
    const declineTime = moment().format("DD/MM/YYYY HH:mm:ss");

    applicant.CSMWO = "Declined";
    applicant.CSMWOtimeStamp = declineTime;
    applicant.CSMWOdecline = reason;
    await applicant.save();

    await applicantStatus.update({
      CSMWO: "Declined",
      CSMWOtimeStamp: declineTime,
      CSMWOdecline: reason,
    });

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
