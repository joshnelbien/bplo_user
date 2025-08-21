require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./db/sequelize");
const File = require("./db/model/files");
const fileRoutes = require("./routes/newApp");

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (_, res) => res.json({ ok: true }));

// DB setup
(async () => {
  await sequelize.authenticate();
  await File.sync();
  console.log("Database ready");
})();

// Use routes
app.use("/api", fileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
