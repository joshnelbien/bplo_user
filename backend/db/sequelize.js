// db/sequelize.js
const { Sequelize } = require("sequelize");

const {
  DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS, DB_SSL
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "postgres",
  dialectOptions: {
    ssl: DB_SSL === "true" ? { require: true, rejectUnauthorized: false } : false
  },
  logging: false,
});

module.exports = { sequelize };
