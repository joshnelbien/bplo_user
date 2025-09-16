// db/sequelize.js
const { Sequelize } = require("sequelize");

const {
  SUPABASE_DB_HOST,
  SUPABASE_DB_PORT,
  SUPABASE_DB_NAME,
  SUPABASE_DB_USER,
  SUPABASE_DB_PASS,
  SUPABASE_DB_SSL,
} = process.env;

const sequelize = new Sequelize(
  SUPABASE_DB_NAME,
  SUPABASE_DB_USER,
  SUPABASE_DB_PASS,
  {
    host: SUPABASE_DB_HOST,
    port: SUPABASE_DB_PORT,
    dialect: "postgres",
    dialectOptions: {
      ssl:
        SUPABASE_DB_SSL === "true"
          ? { require: true, rejectUnauthorized: false }
          : false,
    },
    logging: false,
  }
);

module.exports = { sequelize };
