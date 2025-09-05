const { DataTypes } = require("sequelize");
const { sequelize } = require("../sequelize");

const File = sequelize.define(
  "NewApplication",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: DataTypes.UUID,
    allowNull: false,
    BusinessType: DataTypes.STRING,
    dscRegNo: DataTypes.STRING,
    businessName: DataTypes.STRING,
    tinNo: DataTypes.STRING,
    TradeName: DataTypes.STRING,
    firstName: DataTypes.STRING,
    middleName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    extName: DataTypes.STRING,
    sex: DataTypes.STRING,
    eMailAdd: DataTypes.STRING,
    telNo: DataTypes.STRING,
    mobileNo: DataTypes.STRING,
    region: DataTypes.STRING,
    province: DataTypes.STRING,
    cityOrMunicipality: DataTypes.STRING,
    barangay: DataTypes.STRING,
    addressLine1: DataTypes.STRING,
    zipCode: DataTypes.STRING,
    pinAddress: DataTypes.STRING,
    totalFloorArea: DataTypes.STRING,
    numberOfEmployee: DataTypes.STRING,
    maleEmployee: DataTypes.STRING,
    femaleEmployee: DataTypes.STRING,
    numVehicleVan: DataTypes.STRING,
    numVehicleTruck: DataTypes.STRING,
    numVehicleMotor: DataTypes.STRING,
    numNozzle: DataTypes.STRING,
    weighScale: DataTypes.STRING,
    Taxregion: DataTypes.STRING,
    Taxprovince: DataTypes.STRING,
    TaxcityOrMunicipality: DataTypes.STRING,
    Taxbarangay: DataTypes.STRING,
    TaxaddressLine1: DataTypes.STRING,
    TaxzipCode: DataTypes.STRING,
    TaxpinAddress: DataTypes.STRING,
    ownPlace: DataTypes.STRING,
    taxdec: DataTypes.STRING,
    lessorName: DataTypes.STRING,
    monthlyRent: DataTypes.STRING,
    tIGE: DataTypes.STRING,

    tIGEfiles: { type: DataTypes.BLOB("long"), allowNull: true },
    tIGEfiles_filename: { type: DataTypes.STRING, allowNull: true },
    tIGEfiles_mimetype: { type: DataTypes.STRING, allowNull: true },
    tIGEfiles_size: { type: DataTypes.INTEGER, allowNull: true },

    officeType: DataTypes.STRING,
    officeTypeOther: DataTypes.STRING,
    lineOfBusiness: DataTypes.STRING,
    productService: DataTypes.STRING,
    Units: DataTypes.STRING,
    capital: DataTypes.STRING,
    totalCapital: DataTypes.STRING,

    // Files
    proofOfReg: { type: DataTypes.BLOB("long"), allowNull: true },
    proofOfReg_filename: { type: DataTypes.STRING, allowNull: true },
    proofOfReg_mimetype: { type: DataTypes.STRING, allowNull: true },
    proofOfReg_size: { type: DataTypes.INTEGER, allowNull: true },

    proofOfRightToUseLoc: { type: DataTypes.BLOB("long"), allowNull: true },
    proofOfRightToUseLoc_filename: { type: DataTypes.STRING, allowNull: true },
    proofOfRightToUseLoc_mimetype: { type: DataTypes.STRING, allowNull: true },
    proofOfRightToUseLoc_size: { type: DataTypes.INTEGER, allowNull: true },

    locationPlan: { type: DataTypes.BLOB("long"), allowNull: true },
    locationPlan_filename: { type: DataTypes.STRING, allowNull: true },
    locationPlan_mimetype: { type: DataTypes.STRING, allowNull: true },
    locationPlan_size: { type: DataTypes.INTEGER, allowNull: true },

    brgyClearance: { type: DataTypes.BLOB("long"), allowNull: true },
    brgyClearance_filename: { type: DataTypes.STRING, allowNull: true },
    brgyClearance_mimetype: { type: DataTypes.STRING, allowNull: true },
    brgyClearance_size: { type: DataTypes.INTEGER, allowNull: true },

    marketClearance: { type: DataTypes.BLOB("long"), allowNull: true },
    marketClearance_filename: { type: DataTypes.STRING, allowNull: true },
    marketClearance_mimetype: { type: DataTypes.STRING, allowNull: true },
    marketClearance_size: { type: DataTypes.INTEGER, allowNull: true },

    occupancyPermit: { type: DataTypes.BLOB("long"), allowNull: true },
    occupancyPermit_filename: { type: DataTypes.STRING, allowNull: true },
    occupancyPermit_mimetype: { type: DataTypes.STRING, allowNull: true },
    occupancyPermit_size: { type: DataTypes.INTEGER, allowNull: true },

    cedula: { type: DataTypes.BLOB("long"), allowNull: true },
    cedula_filename: { type: DataTypes.STRING, allowNull: true },
    cedula_mimetype: { type: DataTypes.STRING, allowNull: true },
    cedula_size: { type: DataTypes.INTEGER, allowNull: true },

    photoOfBusinessEstInt: { type: DataTypes.BLOB("long"), allowNull: true },
    photoOfBusinessEstInt_filename: { type: DataTypes.STRING, allowNull: true },
    photoOfBusinessEstInt_mimetype: { type: DataTypes.STRING, allowNull: true },
    photoOfBusinessEstInt_size: { type: DataTypes.INTEGER, allowNull: true },

    photoOfBusinessEstExt: { type: DataTypes.BLOB("long"), allowNull: true },
    photoOfBusinessEstExt_filename: { type: DataTypes.STRING, allowNull: true },
    photoOfBusinessEstExt_mimetype: { type: DataTypes.STRING, allowNull: true },
    photoOfBusinessEstExt_size: { type: DataTypes.INTEGER, allowNull: true },

    status: { type: DataTypes.STRING, defaultValue: "pending" },
  },

  {
    tableName: "NewApplications",
    timestamps: true,
  }
);

module.exports = File;
