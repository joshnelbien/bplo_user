// NEW_RECORDS/ApplicantModal.jsx
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Typography,
  Tooltip,
  IconButton,
  Stack,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import { useState, useEffect } from "react";
import MayorsPermit from "./MayorsPermitDocsExport"; // ✅ Import the export component

// ✅ Custom Colored Step Icon
function ColorStepIcon(props) {
  const { icon, status } = props;

  let color = "gray";
  if (status === "Approved") color = "green";
  else if (status === "Declined") color = "red";

  return (
    <div
      style={{
        backgroundColor: color,
        color: "white",
        borderRadius: "50%",
        width: 28,
        height: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
      }}
    >
      {icon}
    </div>
  );
}

const formatCurrency = (value) => {
  if (value == null || value === "") return "—";
  const num = parseFloat(value);
  if (isNaN(num)) return value; // return as is if not a number
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const Field = ({ label, value, fullWidth = false }) => (
  <Grid item xs={fullWidth ? 12 : 6}>
    <TextField
      label={label}
      value={value || "—"}
      fullWidth
      variant="outlined"
      size="small"
      disabled
      InputProps={{
        sx: {
          color: "black",
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "black",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "black",
          },
          "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
            borderColor: "black",
          },
        },
      }}
      InputLabelProps={{
        sx: {
          color: "black",
          "&.Mui-disabled": {
            color: "black",
          },
        },
      }}
    />
  </Grid>
);

const EditableField = ({ label, value, onChange }) => (
  <Grid item xs={12} sm={6}>
    <TextField label={label} fullWidth variant="outlined" size="small" />
  </Grid>
);

// ✅ Component to display files as links
const FileField = ({ label, fileKey, fileData, baseUrl }) => (
  <Grid item xs={12} sm={6}>
    <TextField
      label={label}
      value={
        fileData[fileKey] ? fileData[`${fileKey}_filename`] : "No file uploaded"
      }
      fullWidth
      variant="outlined"
      size="small"
      InputProps={{
        sx: {
          color: "black",
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "black",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "black",
          },
          "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
            borderColor: "black",
          },
        },
      }}
      InputLabelProps={{
        sx: {
          color: "black",
          "&.Mui-disabled": { color: "black" },
        },
      }}
    />
    {fileData[fileKey] && (
      <Typography
        variant="body2"
        sx={{ mt: 0.5, display: "flex", gap: 1, alignItems: "center" }}
      >
        <Tooltip title="View File">
          <IconButton
            size="small"
            component="a"
            href={`${baseUrl}/${fileData.id}/${fileKey}`}
            target="_blank"
            rel="noreferrer"
          >
            <Typography component="span">view</Typography>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Download File">
          <IconButton
            size="small"
            component="a"
            href={`${baseUrl}/${fileData.id}/${fileKey}/download`}
            target="_blank"
            rel="noreferrer"
          >
            <Typography component="span">download</Typography>
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Typography>
    )}
  </Grid>
);

const formatForDatabase = (arr) => {
  return arr.map((val) => `"${val || ""}"`).join(",");
};

function ApplicantModal({ applicant, isOpen, onClose, onApprove, baseUrl }) {
  if (!isOpen || !applicant) return null;
  const [expandedSection, setExpandedSection] = useState(false);
  const [businessDetails, setBusinessDetails] = useState([]);
  const [fsicData, setFsicData] = useState([]);

  useEffect(() => {
    const fetchFSIC = async () => {
      try {
        const API = import.meta.env.VITE_API_BASE;
        const res = await axios.get(`${API}/api/my-existing-table`);
        setFsicData(res.data);
      } catch (error) {
        console.error("❌ Failed to fetch FSICDB:", error);
      }
    };

    fetchFSIC();
  }, []);

  useEffect(() => {
    if (applicant.lineOfBusiness && fsicData.length > 0) {
      const lobArray =
        applicant.lineOfBusiness
          .match(/"[^"]+"/g)
          ?.map((l) => l.replace(/"/g, "")) || [];

      const initialized = lobArray.map((lob) => {
        const matched = fsicData.find(
          (item) => item.business_line.toUpperCase() === lob.toUpperCase()
        );
        return {
          business_line: lob.toUpperCase(),
          nature_code: matched?.nature_code || "",
          business_nature: matched?.business_nature || "",
          line_code: matched?.line_code || "",
        };
      });

      setBusinessDetails(initialized);
    }
  }, [applicant.lineOfBusiness, fsicData]);

  const handleIndustryChange = (index, value) => {
    const selectedFSIC = fsicData.find((item) => item.business_line === value);

    const updated = [...businessDetails];
    updated[index] = {
      business_line: value,
      nature_code: `"${selectedFSIC?.nature_code}"` || "",
      business_nature: `"${selectedFSIC?.business_nature}"` || "",
      line_code: `"${selectedFSIC?.line_code}"` || "",
    };

    setBusinessDetails(updated);
  };

  // ✅ Stepper definitions
  const steps = [
    { key: "BPLO", label: "BPLO", timeKey: "BPLOtimeStamp" },
    { key: "Examiners", label: "Examiner's", timeKey: "ExaminerstimeStamp" },
    { key: "CENRO", label: "CENRO", timeKey: "CENROtimeStamp" },
    { key: "CHO", label: "CHO", timeKey: "CHOtimeStamp" },
    { key: "ZONING", label: "ZONING", timeKey: "ZONINGtimeStamp" },
    { key: "CSMWO", label: "CSWMO", timeKey: "CSMWOtimeStamp" },
    { key: "OBO", label: "OBO", timeKey: "OBOtimeStamp" },
  ];
  const API = import.meta.env.VITE_API_BASE;

  // ✅ Check if all statuses are approved
  const allApproved = steps.every((step) => applicant[step.key] === "Approved");

  // ✅ Active step = first "Pending"
  const activeStep = steps.findIndex(
    (step) => applicant[step.key] === "Pending"
  );

  const Section = ({ title, children }) => {
    const isExpanded = expandedSection === title;
    return (
      <Accordion
        expanded={isExpanded}
        onChange={() => setExpandedSection(isExpanded ? false : title)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" fontWeight="bold">
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {children}
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  };

  const oboTotal =
    (Number(applicant.BSAP) || 0) +
    (Number(applicant.SR) || 0) +
    (Number(applicant.Mechanical) || 0) +
    (Number(applicant.Electrical) || 0) +
    (Number(applicant.Signage) || 0) +
    (Number(applicant.Electronics) || 0) +
    (Number(applicant.otherFee) || 0);
  // ✅ Collections data - customize based on your applicant fields (e.g., fees from backroom sections)
  // This is a placeholder; map real fields like applicant.zoningFee, applicant.choFee, etc.
  const collections = [
    { label: "Zoning Fee", amount: applicant.zoningFee || 0 },
    { label: "Sanitary Fee", amount: applicant.choFee || 0 },
    { label: "Solid Waste Fee", amount: applicant.csmwoFee || 0 },
    { label: "Environment Fee", amount: applicant.cenroFee || 0 },

    { label: "OBO", amount: oboTotal },

    // Add more as needed, e.g., { label: "Other Charge", amount: applicant.someOtherFee }
  ].filter((item) => item.amount > 0);

  const total = collections.reduce((sum, item) => sum + Number(item.amount), 0);
  const otherChargesTotal = 0; // If you have separate other charges, calculate here

  const handlePassToBusinessTax = async () => {
    try {
      const res = await axios.post(
        `${API}/businessTax/businessTax/approve/${applicant.id}`
      );

      if (res.status === 201) {
        alert("✅ Applicant successfully passed to Business Tax!");
        onClose();
      } else {
        alert("⚠️ Unexpected response from server.");
      }
    } catch (error) {
      console.error("❌ Error passing to Business Tax:", error);
      alert("Failed to pass applicant to Business Tax");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          backgroundColor: "#1d5236", // Requested Background Color
          color: "white", // White text for contrast
          textAlign: "center", // Center the text
          py: 2, // Vertical padding
        }}
      >
        Applicant Details
      </DialogTitle>

      {/* ✅ Stepper Flow - Added vertical margin */}
      <DialogContent sx={{ mt: 2, mb: 4 }}>
        <Stepper activeStep={activeStep === -1 ? steps.length : activeStep}>
          {steps
            .sort((a, b) => {
              const aTime = applicant[a.timeKey];
              const bTime = applicant[b.timeKey];
              if (!aTime && !bTime) return 0;
              if (!aTime) return 1;
              if (!bTime) return -1;
              return new Date(aTime) - new Date(bTime);
            })
            .map((step) => (
              <Step key={step.key}>
                <StepLabel
                  StepIconComponent={(props) => (
                    <ColorStepIcon {...props} status={applicant[step.key]} />
                  )}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {/* Default Label */}
                    <span>
                      {step.label}
                      {applicant[step.key] === "Declined" &&
                        ["CENRO", "OBO", "ZONING", "CSMWO", "CHO"].includes(
                          step.key
                        ) &&
                        ` Decline`}
                    </span>

                    {/* Timestamp if available */}
                    {applicant[step.timeKey] && (
                      <span
                        style={{
                          fontSize: "0.7em",
                          color: "gray",
                          marginTop: "2px",
                        }}
                      >
                        {applicant[step.timeKey]}
                      </span>
                    )}

                    {/* Decline Reason if status is Declined */}
                    {applicant[step.key] === "Declined" &&
                      applicant[`${step.key}decline`] && (
                        <span
                          style={{
                            fontSize: "0.8em",
                            color: "red",
                            marginTop: "4px",
                          }}
                        >
                          Reason: {applicant[`${step.key}decline`]}
                        </span>
                      )}
                  </div>
                </StepLabel>
              </Step>
            ))}
        </Stepper>
      </DialogContent>

      {/* ✅ All your sections stay the same */}
      <DialogContent dividers>
        {/* Business Info */}
        <Section title="Business Information">
          <Field label="Status" value={applicant.BPLO} />
          <Field label="Mode of Payment" value={applicant.Modeofpayment} />
          <Field label="BIN" value={applicant.bin} />
          <Field label="Business Type" value={applicant.BusinessType} />
          <Field label="DSC Registration No" value={applicant.dscRegNo} />
          <Field label="Business Name" value={applicant.businessName} />
          <Field label="TIN No" value={applicant.tinNo} />
          <Field label="Trade Name" value={applicant.TradeName} />
        </Section>
        {/* Personal Info */}
        <Section title="Personal Information">
          <Field label="First Name" value={applicant.firstName} />
          <Field label="Middle Name" value={applicant.middleName} />
          <Field label="Last Name" value={applicant.lastName} />
          <Field label="Extension Name" value={applicant.extName} />
          <Field label="Sex" value={applicant.sex} />
        </Section>
        {/* Contact Info */}
        <Section title="Contact Information">
          <Field label="Email" value={applicant.eMailAdd} />
          <Field label="Telephone No" value={applicant.telNo} />
          <Field label="Mobile No" value={applicant.mobileNo} />
        </Section>
        {/* Address */}
        <Section title="Business Address">
          <Field label="Region" value={applicant.region} />
          <Field label="Province" value={applicant.province} />
          <Field
            label="City/Municipality"
            value={applicant.cityOrMunicipality}
          />
          <Field label="Barangay" value={applicant.barangay} />
          <Field label="Address Line 1" value={applicant.addressLine1} />
          <Field label="Zip Code" value={applicant.zipCode} />
          <Field label="Pin Address" value={applicant.pinAddress} />
          <Field label="Own Place" value={applicant.ownPlace} />

          {applicant.ownPlace === "YES" ? (
            <>
              <Field label="Tax Dec. No." value={applicant.taxdec} />
            </>
          ) : (
            <>
              <Field label="Lessor's Name" value={applicant.lessorName} />
              <Field label="Monthly Rent" value={applicant.monthlyRent} />
              <Field label="Tax Dec. No." value={applicant.taxdec} />
            </>
          )}
        </Section>
        {/* Operations */}
        <Section title="Business Operation">
          <Field label="Total Floor Area" value={applicant.totalFloorArea} />
          <Field label="Employees" value={applicant.numberOfEmployee} />
          <Field label="Male Employees" value={applicant.maleEmployee} />
          <Field label="Female Employees" value={applicant.femaleEmployee} />
          <Field
            label="Total Vehicles"
            value={applicant.totalDeliveryVehicle}
          />
          <Field label="No. of Nozzles" value={applicant.numNozzle} />
          <Field label="Weigh Scale" value={applicant.weighScale} />
        </Section>
        {/* Tax Address */}
        <Section title="Taxpayer Address">
          <Field label="Region" value={applicant.Taxregion} />
          <Field label="Province" value={applicant.Taxprovince} />
          <Field
            label="City/Municipality"
            value={applicant.TaxcityOrMunicipality}
          />
          <Field label="Barangay" value={applicant.Taxbarangay} />
          <Field label="Address Line 1" value={applicant.TaxaddressLine1} />
          <Field label="Zip Code" value={applicant.TaxzipCode} />
          <Field label="Pin Address" value={applicant.TaxpinAddress} />
        </Section>

        {/* Business Activity */}
        <Section title="Business Activity & Incentives">
          <Field label="Office Type" value={applicant.officeType} />

          {/* ✅ Use regex to properly split quoted lineOfBusiness values */}
          {(applicant.lineOfBusiness?.match(/"[^"]+"/g) || []).map(
            (lob, index) => {
              const cleanedLOB = lob.replace(/"/g, ""); // remove quotes

              // Parse corresponding arrays using the same quoted format
              const products =
                applicant.productService
                  ?.match(/"[^"]+"/g)
                  ?.map((p) => p.replace(/"/g, "")) || [];
              const units =
                applicant.Units?.match(/"[^"]+"/g)?.map((u) =>
                  u.replace(/"/g, "")
                ) || [];
              const capitals =
                applicant.capital
                  ?.match(/"[^"]+"/g)
                  ?.map((c) => c.replace(/"/g, "")) || [];

              const product = products[index] || "";
              const unit = units[index] || "";
              const capital = capitals[index] || "";

              const fullWidthProps = {
                fullWidth: true,
                size: "small",
                InputProps: { readOnly: true },
              };

              return (
                <Paper
                  key={index}
                  elevation={2}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    backgroundColor: "#f9f9f9",
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ width: "100%" }}
                  >
                    Business Line {index + 1}
                  </Typography>

                  {/* ✅ Proper Line of Business Display */}
                  <TextField
                    label="Line of Business"
                    value={cleanedLOB.toUpperCase()}
                    {...fullWidthProps}
                    sx={{ width: "100%", mb: 2 }}
                  />

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Product/Service"
                        value={product}
                        {...fullWidthProps}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Units"
                        value={unit}
                        {...fullWidthProps}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Capital"
                        value={formatCurrency(capital)}
                        {...fullWidthProps}
                      />
                    </Grid>

                    {/* ✅ Industry dropdown with proper default */}
                    <Grid item xs={12}>
                      <TextField
                        label="FSIC"
                        select
                        fullWidth
                        size="small"
                        SelectProps={{ native: true }}
                        value={cleanedLOB.toUpperCase()}
                        onChange={(e) =>
                          handleIndustryChange(index, e.target.value)
                        }
                      >
                        <option value="">-- Select Business Line --</option>
                        {fsicData.map((item, i) => (
                          <option
                            key={i}
                            value={item.business_line.toUpperCase()}
                          >
                            {item.business_line.toUpperCase()}
                          </option>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Nature Code"
                        value={businessDetails?.[index]?.nature_code || ""}
                        {...fullWidthProps}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Business Nature"
                        value={businessDetails?.[index]?.business_nature || ""}
                        {...fullWidthProps}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="line_code"
                        value={businessDetails?.[index]?.line_code || ""}
                        {...fullWidthProps}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              );
            }
          )}
        </Section>

        {/* Business Requirements */}
        <Section title="Business Requirements">
          <FileField
            fileKey="proofOfReg"
            label="Proof of Registration"
            fileData={applicant}
            baseUrl={baseUrl}
          />
          <FileField
            fileKey="proofOfRightToUseLoc"
            label="Proof of Right to Use Location"
            fileData={applicant}
            baseUrl={baseUrl}
          />
          <FileField
            fileKey="locationPlan"
            label="Location Plan"
            fileData={applicant}
            baseUrl={baseUrl}
          />
          <FileField
            fileKey="brgyClearance"
            label="Barangay Clearance"
            fileData={applicant}
            baseUrl={baseUrl}
          />
          <FileField
            fileKey="marketClearance"
            label="Market Clearance"
            fileData={applicant}
            baseUrl={baseUrl}
          />
          <FileField
            fileKey="occupancyPermit"
            label="Occupancy Permit"
            fileData={applicant}
            baseUrl={baseUrl}
          />
          <FileField
            fileKey="cedula"
            label="Cedula"
            fileData={applicant}
            baseUrl={baseUrl}
          />
          <FileField
            fileKey="photoOfBusinessEstInt"
            label="Photo (Interior)"
            fileData={applicant}
            baseUrl={baseUrl}
          />
          <FileField
            fileKey="photoOfBusinessEstExt"
            label="Photo (Exterior)"
            fileData={applicant}
            baseUrl={baseUrl}
          />

          <FileField
            fileKey="RecentBusinessPermit"
            label="Business Permit"
            fileData={applicant}
            baseUrl={baseUrl}
          />
        </Section>
        {/* Backroom Section */}
        {applicant.BPLO === "Approved" && (
          <Section title="Backroom">
            <Stack spacing={2}>
              {/* ✅ Zoning */}
              {applicant.ZONING !== "Pending" && (
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Zoning
                  </Typography>

                  <Grid container spacing={2}>
                    <Field label="Zoning Fee" value={applicant.zoningFee} />
                    <FileField
                      fileKey="zoningCert"
                      label="Zoning Certificate"
                      fileData={applicant}
                      baseUrl={baseUrl}
                      fullWidth
                    />
                  </Grid>
                </Paper>
              )}

              {/* ✅ OBO */}
              {applicant.OBO !== "Pending" && (
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    OBO
                  </Typography>

                  <Grid container spacing={2}>
                    <Field
                      label="Building Structure Architectural Presentability"
                      value={applicant.BSAP}
                    />
                    <Field label="Sanitary Requirements" value={applicant.SR} />
                    <Field label="Mechanical" value={applicant.Mechanical} />
                    <Field label="Electrical" value={applicant.Electrical} />
                    <Field label="Signage" value={applicant.Signage} />
                    <Field label="Electronics" value={applicant.Electronics} />
                  </Grid>
                </Paper>
              )}

              {/* ✅ CHO */}
              {applicant.CHO !== "Pending" && (
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    CHO
                  </Typography>

                  <Grid container spacing={2}>
                    <Field label="Sanitary Fee" value={applicant.choFee} />
                    <FileField
                      fileKey="choCert"
                      label="CHO Certificate"
                      fileData={applicant}
                      baseUrl={baseUrl}
                    />
                  </Grid>
                </Paper>
              )}

              {/* ✅ CSWMO */}
              {applicant.CSMWO !== "Pending" && (
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    CSWMO
                  </Typography>

                  <Grid container spacing={2}>
                    <Field label="Solid Waste Fee" value={applicant.csmwoFee} />

                    <FileField
                      fileKey="cswmoCert"
                      label="Cenro Certificate"
                      fileData={applicant}
                      baseUrl={baseUrl}
                    />
                  </Grid>
                </Paper>
              )}

              {/* ✅ CENRO */}
              {applicant.CENRO !== "Pending" && (
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    CENRO
                  </Typography>

                  <Grid container spacing={2}>
                    <Field label="Environment Fee" value={applicant.cenroFee} />
                    <FileField
                      fileKey="cenroCert"
                      label="Cenro Certificate"
                      fileData={applicant}
                      baseUrl={baseUrl}
                    />
                  </Grid>
                </Paper>
              )}
            </Stack>
          </Section>
        )}

        {applicant.passtoBusinessTax === "Done" && (
          <>
            <Section title={"Tax Order"}>
              <FileField
                fileKey="businesstaxComputation"
                label="Tax Order"
                fileData={applicant}
                baseUrl={baseUrl}
              />
            </Section>
          </>
        )}
      </DialogContent>

      {/* ✅ Actions */}
      <DialogActions>
        {/* Close Button */}
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: "#70706fff",
            color: "white",
            "&:hover": { backgroundColor: "#acababff" },
            width: "100px",
            border: "none",
          }}
        >
          Close
        </Button>

        {/* Conditional Buttons */}
        {applicant.permitRelease === "Yes" ? (
          // ✅ Generate Permit Button triggers the export component's logic
          <>
            <MayorsPermit
              applicant={applicant}
              collections={collections}
              total={total}
              otherChargesTotal={otherChargesTotal}
            />
          </>
        ) : applicant.BPLO?.toLowerCase() !== "approved" ? (
          // ✅ Show Approve / Decline
          <>
            <Button
              onClick={() => onApprove(applicant, businessDetails)}
              variant="contained"
              color="success"
            >
              Approve
            </Button>
            <Button
              onClick={onClose}
              variant="contained"
              color="error"
              sx={{ color: "white" }}
            >
              Decline
            </Button>
          </>
        ) : (
          // ✅ Show Pass to Business Tax
          <Button
            onClick={handlePassToBusinessTax}
            variant="contained"
            color="success"
            disabled={!allApproved}
          >
            Pass to Business Tax
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default ApplicantModal;
