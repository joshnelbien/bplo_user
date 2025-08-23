require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./db/sequelize");


const File = require("./db/model/files");
const fileRoutes = require("./routes/newApp");

const Backroom = require("./db/model/backroomLocal");
const BackroomRoutes = require("./routes/backroom");

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (_, res) => res.json({ ok: true }));

// DB setup
(async () => {
  await sequelize.authenticate();
  await File.sync();
  await Backroom.sync();
  console.log("Database ready");
})();

app.use("/backroom", BackroomRoutes);
// Use routes
app.use("/api", fileRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
