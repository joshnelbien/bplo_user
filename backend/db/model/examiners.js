const { DataTypes } = require("sequelize");
const { sequelize } = require("../sequelize");

const Examiners = sequelize.define(
  "Examiners",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    bin: {
      type: DataTypes.STRING,
    },
    userId: DataTypes.UUID,
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
    lineOfBusiness: DataTypes.TEXT,
    natureCode: DataTypes.STRING,
    businessNature: DataTypes.STRING,
    lineCode: DataTypes.STRING,
    productService: DataTypes.STRING,
    Units: DataTypes.STRING,
    capital: DataTypes.STRING,
    totalCapital: DataTypes.STRING,
    Modeofpayment: DataTypes.STRING,
    totalDeliveryVehicle: DataTypes.STRING,

    // Files
    proofOfReg: { type: DataTypes.BLOB("long"), allowNull: true },
    proofOfReg_filename: { type: DataTypes.STRING, allowNull: true },
    proofOfReg_mimetype: { type: DataTypes.STRING, allowNull: true },
    proofOfReg_size: { type: DataTypes.INTEGER, allowNull: true },

    RecentBusinessPermit: { type: DataTypes.BLOB("long"), allowNull: true },
    RecentBusinessPermit_filename: { type: DataTypes.STRING, allowNull: true },
    RecentBusinessPermit_mimetype: { type: DataTypes.STRING, allowNull: true },
    RecentBusinessPermit_size: { type: DataTypes.INTEGER, allowNull: true },

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

    BPLO: { type: DataTypes.STRING, defaultValue: "Approved" },
    BPLOtimeStamp: { type: DataTypes.STRING },

    CSMWO: { type: DataTypes.STRING, defaultValue: "Pending" },
    CSMWOtimeStamp: { type: DataTypes.STRING },
    CSMWOdecline: { type: DataTypes.STRING },
    csmwoFee: { type: DataTypes.STRING },
    cswmoCert: { type: DataTypes.BLOB("long"), allowNull: true },
    cswmoCert_filename: { type: DataTypes.STRING, allowNull: true },
    cswmoCert_mimetype: { type: DataTypes.STRING, allowNull: true },
    cswmoCert_size: { type: DataTypes.INTEGER, allowNull: true },

    OBO: { type: DataTypes.STRING, defaultValue: "Pending" },
    OBOdecline: { type: DataTypes.STRING },
    OBOtimeStamp: { type: DataTypes.STRING },
    //Building Structure Architectural Presentability
    BSAP: { type: DataTypes.STRING },
    //Sanitary Requirements
    SR: { type: DataTypes.STRING },
    //Mechanical
    Mechanical: { type: DataTypes.STRING },
    //Electrical
    Electrical: { type: DataTypes.STRING },
    //Signage
    Signage: { type: DataTypes.STRING },
    //Electronics
    Electronics: { type: DataTypes.STRING },

    Examiners: { type: DataTypes.STRING, defaultValue: "Pending" },
    ExaminerstimeStamp: { type: DataTypes.STRING },

    CHO: { type: DataTypes.STRING, defaultValue: "Pending" },
    CHOtimeStamp: { type: DataTypes.STRING },
    CHOdecline: { type: DataTypes.STRING },
    choFee: { type: DataTypes.STRING },
    choCert: { type: DataTypes.BLOB("long"), allowNull: true },
    choCert_filename: { type: DataTypes.STRING, allowNull: true },
    choCert_mimetype: { type: DataTypes.STRING, allowNull: true },
    choCert_size: { type: DataTypes.INTEGER, allowNull: true },

    CENRO: { type: DataTypes.STRING, defaultValue: "Pending" },
    CENROdecline: { type: DataTypes.STRING },
    CENROtimeStamp: { type: DataTypes.STRING },
    cenroFee: { type: DataTypes.STRING },
    cenroCert: { type: DataTypes.BLOB("long"), allowNull: true },
    cenroCert_filename: { type: DataTypes.STRING, allowNull: true },
    cenroCert_mimetype: { type: DataTypes.STRING, allowNull: true },
    cenroCert_size: { type: DataTypes.INTEGER, allowNull: true },

    ZONING: { type: DataTypes.STRING, defaultValue: "Pending" },
    ZONINGdecline: { type: DataTypes.STRING },
    ZONINGtimeStamp: { type: DataTypes.STRING },
    zoningFee: { type: DataTypes.STRING },
    zoningCert: { type: DataTypes.BLOB("long"), allowNull: true },
    zoningCert_filename: { type: DataTypes.STRING, allowNull: true },
    zoningCert_mimetype: { type: DataTypes.STRING, allowNull: true },
    zoningCert_size: { type: DataTypes.INTEGER, allowNull: true },

    BUSINESSTAX: { type: DataTypes.STRING, defaultValue: "Pending" },
    BUSINESSTAXtimeStamp: { type: DataTypes.STRING },
    businesstaxComputation: { type: DataTypes.BLOB("long"), allowNull: true },
    businesstaxComputation_filename: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passtoBusinessTax: { type: DataTypes.STRING, defaultValue: "No" },
    passtoTreasurer: { type: DataTypes.STRING, defaultValue: "No" },
    permitRelease: { type: DataTypes.STRING, defaultValue: "No" },
    businesstaxComputation_mimetype: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    businesstaxComputation_size: { type: DataTypes.INTEGER, allowNull: true },
    application: { type: DataTypes.STRING },
    businessTaxTotal: { type: DataTypes.STRING },
    plate_no: { type: DataTypes.STRING },
  },

  {
    tableName: "Examiners",
    timestamps: true,
  }
);

module.exports = Examiners;
