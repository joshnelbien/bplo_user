const express = require("express");
const router = express.Router();
const AdminAccounts = require("../db/model/adminAccountsDB");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateJWT = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// ✅ REGISTER (already exists)
router.post("/admin-register", async (req, res) => {
  try {
    const { Password, ...rest } = req.body;

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(Password, 10);

    const newAdmin = await AdminAccounts.create({
      ...rest,
      Password: hashedPassword,
    });

    res.status(201).json(newAdmin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering admin" });
  }
});

// ✅ LOGIN (new)
router.post("/admin-login", async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const admin = await AdminAccounts.findOne({ where: { Email } });

    if (!admin) return res.status(404).json({ message: "Email not found" });

    const isPasswordValid = await bcrypt.compare(Password, admin.Password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign(
      {
        id: admin.id,
        role: admin.Position,
        office: admin.Office,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Login successful",
      token, // 🔹 send JWT to frontend
      admin: {
        id: admin.id,
        FirstName: admin.FirstName,
        LastName: admin.LastName,
        Office: admin.Office,
        Position: admin.Position,
        Email: admin.Email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
});

router.get("/protected-data", authenticateJWT, async (req, res) => {
  res.json({
    message: "You have access to protected data!",
    user: req.user, // decoded token
  });
});

// ✅ Get logged-in user profile
router.get("/me", authenticateJWT, async (req, res) => {
  try {
    const user = await AdminAccounts.findByPk(req.user.id);

    const profileBase64 = user.profile ? user.profile.toString("base64") : null;

    const signBase64 = user.signatories
      ? user.signatories.toString("base64")
      : null;

    res.json({
      ...user.toJSON(),
      profile: profileBase64,
      signatories: signBase64,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.put(
  "/update",
  authenticateJWT,
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "signatories", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const userId = req.user.id; // Token has user id

      const { FirstName, MiddleName, LastName, Email, Office, Position } =
        req.body;

      const updateData = {
        FirstName,
        MiddleName,
        LastName,
        Email,
        Office,
        Position,
      };

      // ✅ If profile image uploaded, save buffer to BLOB
      if (req.files.profile) {
        updateData.profile = req.files.profile[0].buffer;
      }

      // ✅ If signatory uploaded
      if (req.files.signatories) {
        updateData.signatories = req.files.signatories[0].buffer;
      }

      await AdminAccounts.update(updateData, { where: { id: userId } });

      res.json({ message: "Account updated successfully ✅" });
    } catch (error) {
      console.error("Update Error:", error);
      res.status(500).json({ error: "Failed to update account" });
    }
  }
);

module.exports = router;
