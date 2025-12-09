// // supabase db connection
const { Sequelize } = require("sequelize");

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS, DB_SSL } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT || 5432,
  dialect: "postgres",
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    ssl:
      DB_SSL === "true" ? { require: true, rejectUnauthorized: false } : false,
  },
});

module.exports = { sequelize };
