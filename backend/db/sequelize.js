// supabase db connection

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
    port: SUPABASE_DB_PORT || 5432,
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
        SUPABASE_DB_SSL === "true"
          ? { require: true, rejectUnauthorized: false }
          : false,
    },
  }
);

module.exports = { sequelize };

// // // localhost db connection

// const { Sequelize } = require("sequelize");

// const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS, DB_SSL } = process.env;

// const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
//   host: DB_HOST,
//   port: DB_PORT,
//   dialect: "postgres",
//   dialectOptions: {
//     ssl:
//       DB_SSL === "true" ? { require: true, rejectUnauthorized: false } : false,
//   },
//   logging: false,
// });

// module.exports = { sequelize };
