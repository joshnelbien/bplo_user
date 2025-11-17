// NEW_RECORDS/ApplicantModal.jsx
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  Tooltip,
  IconButton,
  Paper,
  Stack,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";

// ✅ Custom Step Icon
function ColorStepIcon({ icon, status }) {
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

// ✅ Currency formatter
const formatCurrency = (value) => {
  if (value == null || value === "") return "—";
  const num = parseFloat(value);
  if (isNaN(num)) return value; // return as is if not a number
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// ✅ Reusable text field
const Field = ({ label, value }) => (
  <Grid item xs={12} sm={6}>
    <TextField
      label={label}
      value={value || "—"}
      fullWidth
      size="small"
      variant="outlined"
      InputProps={{
        readOnly: true,
        sx: { "& .MuiOutlinedInput-notchedOutline": { borderColor: "black" } },
      }}
      InputLabelProps={{ sx: { color: "black" } }}
    />
  </Grid>
);

// ✅ Reusable file field
const FileField = ({ label, fileKey, fileData, baseUrl }) => (
  <Grid item xs={12} sm={6}>
    <TextField
      label={label}
      value={fileData[fileKey] ? fileData[`${fileKey}_filename`] : "No file"}
      fullWidth
      size="small"
      variant="outlined"
      InputProps={{
        readOnly: true,
        sx: { "& .MuiOutlinedInput-notchedOutline": { borderColor: "black" } },
      }}
      InputLabelProps={{ sx: { color: "black" } }}
    />
    {fileData[fileKey] && (
      <Typography
        variant="body2"
        sx={{ mt: 0.5, display: "flex", gap: 1, alignItems: "center" }}
      >
        <Tooltip title="View">
          <IconButton
            size="small"
            component="a"
            href={`${baseUrl}/${fileData.id}/${fileKey}`}
            target="_blank"
            rel="noreferrer"
          >
            <Typography>View</Typography>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Download">
          <IconButton
            size="small"
            component="a"
            href={`${baseUrl}/${fileData.id}/${fileKey}/download`}
            target="_blank"
            rel="noreferrer"
          >
            <Typography>Download</Typography>
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Typography>
    )}
  </Grid>
);

function ApplicantModal({ applicant, isOpen, onClose, baseUrl }) {
  if (!isOpen || !applicant) return null;

  // ✅ Reusable section
  const Section = ({ title, children }) => (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight="bold">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {children}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>My Application</DialogTitle>
      <DialogContent dividers>
        {/* Business Info */}
        <Section title="Business Information">
          <Field label="Application" value={applicant.application} />
          <Field label="Mode of Payment" value={applicant.Modeofpayment} />
          <Field label="Business Type" value={applicant.BusinessType} />
          <Field label="DTI/SEC Registration No" value={applicant.dscRegNo} />
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
            <Field label="Tax Dec. No." value={applicant.taxdec} />
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
          <Field label="Tax Incentives" value={applicant.tIGE} />
          {applicant.tIGE === "Yes" && (
            <FileField
              fileKey="tIGEfiles"
              label="Tax Incentives From Government"
              fileData={applicant}
              baseUrl={baseUrl}
            />
          )}
          <Field label="Office Type" value={applicant.officeType} />

          {applicant.lineOfBusiness?.split(",").map((lob, index) => {
            const product = applicant.productService?.split(",")[index] || "";
            const unit = applicant.Units?.split(",")[index] || "";
            const capital = applicant.capital?.split(",")[index] || "";
            return (
              <Paper
                key={index}
                elevation={2}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Business Line {index + 1}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field label="Line of Business" value={lob.trim()} />
                  </Grid>
                  <Grid item xs={12}>
                    <Field label="Product/Service" value={product.trim()} />
                  </Grid>
                  <Grid item xs={12}>
                    <Field label="Units" value={unit.trim()} />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      label="Capital"
                      value={formatCurrency(capital.trim())}
                    />
                  </Grid>
                </Grid>
              </Paper>
            );
          })}
        </Section>

        {/* Requirements */}
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
        </Section>

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
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
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
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
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
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
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
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
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
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
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

        <Section title="Business Permit & Tax Order">
          <FileField
            fileKey="businessPermit"
            label="Business Permit"
            fileData={applicant}
          />

          <FileField
            fileKey="businesstaxComputation"
            label="Business Permit"
            fileData={applicant}
          />
        </Section>
      </DialogContent>
    </Dialog>
  );
}

export default ApplicantModal;
