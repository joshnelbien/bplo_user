const { DataTypes } = require("sequelize");
const { sequelize } = require("../sequelize");

const ExistingBusinessProfile = sequelize.define(
  "business_profile",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    bin: { type: DataTypes.STRING },
    business_name: { type: DataTypes.STRING },
    trade_name: { type: DataTypes.STRING },
    business_type: { type: DataTypes.STRING },
    dti_no: { type: DataTypes.STRING },
    sec_no: { type: DataTypes.STRING },
    cda_no: { type: DataTypes.STRING },
    tin_no: { type: DataTypes.STRING },
    email_address: { type: DataTypes.STRING },
    cellphone_no: { type: DataTypes.STRING },
    telephone_no: { type: DataTypes.STRING },

    incharge_first_name: { type: DataTypes.STRING },
    incharge_middle_name: { type: DataTypes.STRING },
    incharge_last_name: { type: DataTypes.STRING },
    incharge_extension_name: { type: DataTypes.STRING },
    incharge_sex: { type: DataTypes.STRING },
    incharge_country_of_citizenship: { type: DataTypes.STRING },
    incharge_street: { type: DataTypes.STRING },
    incharge_barangay: { type: DataTypes.STRING },
    incharge_municipality: { type: DataTypes.STRING },
    incharge_province: { type: DataTypes.STRING },

    office_street: { type: DataTypes.STRING },
    office_barangay_code: { type: DataTypes.STRING },
    location_owned: { type: DataTypes.STRING },
    tdn_no: { type: DataTypes.STRING },
    pin_no: { type: DataTypes.STRING },
    lessor_name: { type: DataTypes.STRING },
    monthly_rental: { type: DataTypes.STRING },
    area: { type: DataTypes.STRING },

    no_of_male_employees: { type: DataTypes.STRING },
    no_of_female_employees: { type: DataTypes.STRING },
    no_of_employees_residing_within_the_area: { type: DataTypes.STRING },
    no_of_van: { type: DataTypes.STRING },
    no_of_truck: { type: DataTypes.STRING },
    no_of_motorcycle: { type: DataTypes.STRING },

    activity_type: { type: DataTypes.STRING },
  },
  {
    tableName: "business_profiles",
    timestamps: true, // includes createdAt, updatedAt
  }
);

module.exports = ExistingBusinessProfile;
