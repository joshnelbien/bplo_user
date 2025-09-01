require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./db/sequelize");
require("./db/model/userAccounts");
require("./db/model/files");
require("./db/model/backroomCloud");


const UserAccountsRoutes = require("./routes/UserAccounts");
const newApplication = require("./routes/newApp");
const backroom = require("./routes/backroom");


const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (_, res) => res.json({ ok: true }));

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // sync all models
    console.log("✅ Database connected & models synced");
  } catch (err) {
    console.error("❌ Database connection error:", err);
  }
})();

app.use("/userAccountsCloud", UserAccountsRoutes);
app.use("/newApplicationCloud", newApplication);
app.use("/backroomCloud", backroom);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));