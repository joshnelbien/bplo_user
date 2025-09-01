// db/config.js
require("dotenv").config();

module.exports = {
  local: {
    DB: "your_local_db",
    USER: "your_local_user",
    PASSWORD: "your_local_password",
    HOST: "localhost",
    PORT: 5432,
    dialect: "postgres",
    SSL: false,
  },
  supabase: {
    DB: process.env.SUPABASE_DB_NAME,
    USER: process.env.SUPABASE_DB_USER,
    PASSWORD: process.env.SUPABASE_DB_PASS,
    HOST: process.env.SUPABASE_DB_HOST,
    PORT: process.env.SUPABASE_DB_PORT,
    dialect: "postgres",
    SSL: process.env.SUPABASE_DB_SSL === "true",
  },
};
