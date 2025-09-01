// db/sequelize.js
const { Sequelize } = require("sequelize");
const dbConfig = require("./config");

const useSupabase = process.env.USE_SUPABASE === "true";
const config = useSupabase ? dbConfig.supabase : dbConfig.local;

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  port: config.PORT,
  dialect: config.dialect,
  dialectOptions: {
    ssl: config.SSL ? { require: true, rejectUnauthorized: false } : false,
  },
  logging: false,
});

module.exports = { sequelize };
