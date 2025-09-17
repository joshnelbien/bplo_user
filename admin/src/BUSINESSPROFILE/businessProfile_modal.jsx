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
  IconButton,
  Tooltip,
  Fade,
  Stack,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
const API = import.meta.env.VITE_API_BASE;
// Component to display a normal text field
const Field = ({ label, value }) => (
  <Grid item xs={12} sm={6}>
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

// Component to display files as links
const FileField = ({ label, fileKey, fileData }) => (
  <Grid item xs={12} sm={6}>
    <TextField
      label={label}
      value={
        fileData[fileKey] ? fileData[`${fileKey}_filename`] : "No file uploaded"
      }
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
          "&.Mui-disabled": { color: "black" },
        },
      }}
    />

    {fileData[fileKey] && (
      <Typography
        component="span"
        sx={{ mt: 0.5, display: "flex", gap: 1, alignItems: "center" }}
      >
        <Tooltip title="View File">
          <IconButton
            size="small"
            component="a"
            href={`${API}/backroom/backroom/${fileData.id}/${fileKey}`}
            target="_blank"
            rel="noreferrer"
          >
            <Typography component="span"> View</Typography>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Download File">
          <IconButton
            size="small"
            component="a"
            href={`${API}/backroom/backroom/${fileData.id}/${fileKey}/download`}
            target="_blank"
            rel="noreferrer"
          >
            <Typography component="span"> Download</Typography>
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Typography>
    )}
  </Grid>
);

function BusinessProfileModal({ applicant, isOpen, onClose, baseUrl }) {
  if (!isOpen || !applicant) return null;

  const Section = ({ title, children }) => (
    <Accordion>
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

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Applicant Details</DialogTitle>
        <DialogContent dividers>
          {/* Business Info */}
          <Section title="Business Information">
            <Field label="Status" value={applicant.TREASURER} />
            <Field label="Mode of Payment" value={applicant.Modeofpayment} />
            <Field label="BIN" value={applicant.BIN} />
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
              label="Total Delivery Vehicle"
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
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    gutterBottom
                  >
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
                      <Field label="Capital" value={capital.trim()} />
                    </Grid>
                  </Grid>
                </Paper>
              );
            })}
          </Section>

          {/* Business Requirements */}
          <Section title="Business Requirements">
            <FileField
              fileKey="proofOfReg"
              label="Proof of Registration"
              fileData={applicant}
            />
            <FileField
              fileKey="proofOfRightToUseLoc"
              label="Proof of Right to Use Location"
              fileData={applicant}
            />
            <FileField
              fileKey="locationPlan"
              label="Location Plan"
              fileData={applicant}
            />
            <FileField
              fileKey="brgyClearance"
              label="Barangay Clearance"
              fileData={applicant}
            />
            <FileField
              fileKey="marketClearance"
              label="Market Clearance"
              fileData={applicant}
            />
            <FileField
              fileKey="occupancyPermit"
              label="Occupancy Permit"
              fileData={applicant}
            />
            <FileField fileKey="cedula" label="Cedula" fileData={applicant} />
            <FileField
              fileKey="photoOfBusinessEstInt"
              label="Photo (Interior)"
              fileData={applicant}
            />
            <FileField
              fileKey="photoOfBusinessEstExt"
              label="Photo (Exterior)"
              fileData={applicant}
            />
          </Section>

          <Section title="Backroom">
            <Stack spacing={2}>
              {/* ✅ Zoning */}

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

              {/* ✅ OBO */}

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

              {/* ✅ CHO */}

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

              {/* ✅ CSWMO */}

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
                </Grid>
              </Paper>

              {/* ✅ CENRO */}

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
            </Stack>
          </Section>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              color: "#1c541eff",
              borderColor: "#1c541eff",
              "&:hover": {
                borderColor: "#1c541eff",
              },
              width: "100px",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default BusinessProfileModal;
