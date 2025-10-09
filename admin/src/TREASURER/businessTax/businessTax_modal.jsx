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
  Stack,
  Fade,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useState, useEffect } from "react";
import BusinessTax_computation from "./businessTax_computation";
const API = import.meta.env.VITE_API_BASE;
// Component to display a normal text field
const Field = ({
  label,
  value,
  xs = 12,
  sm = 6,
  fullWidth = false,
  multiline = false,
  rows = 1,
}) => (
  <Grid item xs={fullWidth ? 12 : sm} sm={sm}>
    <TextField
      label={label}
      value={value || "—"}
      fullWidth
      multiline={multiline}
      rows={rows}
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
  </Grid>
);

const formatCurrency = (value) => {
  if (!value) return "";
  const num = parseFloat(value.toString().replace(/,/g, ""));
  if (isNaN(num)) return value;
  return num.toLocaleString("en-US");
};

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

function BusinessTaxApplicantModal({
  applicant,
  isOpen,
  onClose,
  onApprove,
  handleFileChange,
  onDecline,
  baseUrl,
}) {
  if (!isOpen || !applicant) return null;

  const [confirmOpen, setConfirmOpen] = useState(false); // State for confirmation dialog
  const [successOpen, setSuccessOpen] = useState(false); // State for success pop-up
  const [selectedFiles, setSelectedFiles] = useState({});
  const [computeOpen, setComputeOpen] = useState(false);

  const files = [
    { label: "Business Tax Computation", name: "businessTaxComputation" },
  ];

  const handleFileSelect = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setSelectedFiles((prev) => ({
        ...prev,
        [name]: files[0],
      }));
      handleFileChange(name, files[0]);
    }
  };

  // Handle opening confirmation dialog
  const handleApproveClick = () => {
    setConfirmOpen(true);
  };

  // Handle confirmation dialog close
  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  // Handle approval confirmation
  const handleConfirmApprove = () => {
    setConfirmOpen(false);
    onApprove(applicant.id, selectedFiles); // Call the original onApprove
    setSuccessOpen(true); // Show success pop-up
  };

  // Handle closing success pop-up
  const handleSuccessClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessOpen(false);
  };

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
            <Field label="Status" value={applicant.BusinessTax} />
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

            {(() => {
              // ✅ Utility function to safely parse CSV-like fields with quotes
              const parseCSV = (text) => {
                if (!text) return [];
                return text

                  .trim()

                  .replace(/^\[|\]$/g, "")

                  .split(/",\s*"?/)

                  .map((val) => val.replace(/^"|"$/g, "").trim())
                  .filter((val) => val.length > 0);
              };

              // ✅ Extract arrays for each field
              const lobArr = parseCSV(applicant.lineOfBusiness);
              const productArr = parseCSV(applicant.productService);
              const unitArr = parseCSV(applicant.Units);
              const capitalArr = parseCSV(applicant.capital);
              const natureCodeArr = parseCSV(applicant.natureCode);
              const businessNatureArr = parseCSV(applicant.businessNature);
              const lineCodeArr = parseCSV(applicant.lineCode);

              // ✅ Find the maximum length among arrays (in case some are shorter)
              const maxLength = Math.max(
                lobArr.length,
                productArr.length,
                unitArr.length,
                capitalArr.length,
                natureCodeArr.length,
                businessNatureArr.length,
                lineCodeArr.length
              );

              return Array.from({ length: maxLength }).map((_, index) => {
                const lob = lobArr[index] || "";
                const product = productArr[index] || "";
                const unit = unitArr[index] || "";
                const capital = capitalArr[index] || "";
                const natureCode = natureCodeArr[index] || "";
                const businessNature = businessNatureArr[index] || "";
                const lineCode = lineCodeArr[index] || "";

                return (
                  <Paper
                    key={index}
                    elevation={2}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 2,
                      backgroundColor: "#f9f9f9",
                      width: "100%", // 🟩 Ensure Paper itself takes full width
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
                      {/* 🟩 Line of Business — full width */}
                      <Field
                        label="Line of Business"
                        value={lob}
                        fullWidth
                        multiline
                        rows={3} // adjust rows if you want a taller box (e.g., 4 or 5)
                      />

                      <Grid item xs={12} sm={6}>
                        <Field label="Product/Service" value={product} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field label="Units" value={unit} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          label="Capital"
                          value={formatCurrency(capital)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field label="Nature Code" value={natureCode} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field label="Business Nature" value={businessNature} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field label="Line Code" value={lineCode} />
                      </Grid>
                    </Grid>
                  </Paper>
                );
              });
            })()}
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

          <Grid container spacing={1} sx={{ mt: 1 }}>
            <Grid item>
              <Button
                variant="contained"
                component="label"
                size="small"
                color="success"
                sx={{ minWidth: 120 }}
              >
                Choose File
                <input
                  type="file"
                  name="businessTaxComputation"
                  hidden
                  onChange={handleFileSelect}
                />
              </Button>
            </Grid>
            <Grid item xs>
              <TextField
                value={selectedFiles.businessTaxComputation?.name || ""}
                placeholder="No file selected"
                size="small"
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={onClose}
            variant="contained"
            color="gray"
            sx={{ color: "#1c541eff" }}
          >
            Close
          </Button>

          <Button
            onClick={() => setComputeOpen(true)}
            variant="contained"
            color="primary"
          >
            Compute
          </Button>

          <Button
            onClick={handleApproveClick}
            variant="contained"
            color="success"
          >
            Approve
          </Button>
          <Button
            onClick={() => onDecline(applicant.id)}
            variant="contained"
            color="error"
            sx={{ color: "white" }}
          >
            Decline
          </Button>
        </DialogActions>

        {/* Computation Dialog */}
        <BusinessTax_computation
          isOpen={computeOpen}
          onClose={() => setComputeOpen(false)}
          applicant={applicant}
        />
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={handleConfirmClose}
        aria-labelledby="confirm-dialog-title"
        sx={{ "& .MuiDialog-paper": { borderRadius: "10px", width: "400px" } }}
      >
        <DialogTitle
          id="confirm-dialog-title"
          align="center"
          sx={{
            py: 3,
            px: 4,
            fontWeight: "bold",
            fontSize: "1.25rem",
            color: "#333",
          }}
        >
          Are you sure you want to approve this applicant?
        </DialogTitle>
        <DialogContent sx={{ p: 0, m: 0 }}></DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            pb: 2,
          }}
        >
          <Button
            onClick={handleConfirmApprove}
            variant="contained"
            color="success"
            sx={{
              fontWeight: "bold",
              textTransform: "uppercase",
              minWidth: "100px",
              bgcolor: "#1a7322",
              "&:hover": { bgcolor: "#155a1b" },
            }}
          >
            Yes
          </Button>
          <Button
            onClick={handleConfirmClose}
            variant="outlined"
            color="primary"
            sx={{
              fontWeight: "bold",
              textTransform: "uppercase",
              minWidth: "100px",
              color: "#1a7322",
              borderColor: "#1a7322",
              "&:hover": { borderColor: "#1a7322", bgcolor: "#e8f5e9" },
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Pop-up */}
      <Dialog
        open={successOpen}
        onClose={handleSuccessClose}
        TransitionComponent={Fade}
        maxWidth="xs"
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            backgroundColor: "white",
            color: "#4caf50",
            borderRadius: 2,
          }}
        >
          <CheckCircleIcon
            fontSize="large"
            sx={{ fontSize: "5rem", color: "#4caf50" }}
          />
          <Typography variant="h5" fontWeight="bold">
            Successfully Approved!
          </Typography>
          <Button
            onClick={handleSuccessClose}
            variant="contained"
            color="success"
          >
            OK
          </Button>
        </Paper>
      </Dialog>
    </>
  );
}

export default BusinessTaxApplicantModal;
