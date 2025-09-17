const express = require("express");
const bcrypt = require("bcryptjs");
const UserAccounts = require("../db/model/userAccounts");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { lastname, firstname, email, mobile, password } = req.body;

    if (!lastname || !firstname || !email || !mobile || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await UserAccounts.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserAccounts.create({
      lastname,
      firstname,
      email,
      mobile,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        lastname: user.lastname,
        firstname: user.firstname,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserAccounts.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        lastname: user.lastname,
        firstname: user.firstname,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// /me
router.get("/:id", async (req, res) => {
  try {
    const user = await UserAccounts.findByPk(req.params.id, {
      attributes: ["id", "lastname", "firstname", "email", "mobile"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
