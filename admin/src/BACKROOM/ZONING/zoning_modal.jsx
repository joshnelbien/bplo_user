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
  Stack,
  IconButton,
  Tooltip,
  Snackbar,
  Fade,
} from "@mui/material";
import { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import ZoningCert from "./zoningCert";
import { useEffect } from "react";
const API = import.meta.env.VITE_API_BASE;
// ✅ Normal text field
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
          "&.Mui-disabled": { color: "black" },
        },
      }}
    />
  </Grid>
);

// ✅ File display (with View/Download links)
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

function ZoningApplicantModal({
  applicant,
  isOpen,
  onClose,
  onApprove,
  handleFileChange,
  onDecline,
}) {
  const [showCert, setShowCert] = useState(false);
  const [declineOpen, setDeclineOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [declineSuccessOpen, setDeclineSuccessOpen] = useState(false);

  const files = [{ label: "Zoning Certificate", name: "zoningCert" }];

  const [selectedFiles, setSelectedFiles] = useState({});
  const [validationError, setValidationError] = useState(false);

  // Reset state when the modal opens with a new applicant
  useEffect(() => {
    if (isOpen) {
      setSelectedFiles({});
      setValidationError(false);
    }
  }, [isOpen]);

  const handleFileSelect = (e) => {
    const { name, files } = e.target;
    setSelectedFiles((prev) => ({
      ...prev,
      [name]: files[0] ? files[0].name : "",
    }));
    setValidationError(false); // Clear the error when a file is selected
    handleFileChange(e); // call parent handler
  };

  const handleApproveClick = () => {
    // Check if a file has been selected for zoningCert
    if (!selectedFiles.zoningCert) {
      setValidationError(true);
      return;
    }
    onApprove(applicant.id);
    setSuccessOpen(true);
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
    onClose();
  };

  const handleDeclineClick = () => {
    setDeclineOpen(true);
  };

  const handleDeclineConfirm = () => {
    onDecline(applicant.id, declineReason);
    setDeclineOpen(false);
    setDeclineSuccessOpen(true);
  };

  const handleDeclineSuccessClose = () => {
    setDeclineSuccessOpen(false);
    onClose();
  };

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

  function calculateZoningFee(totalCapital) {
    if (totalCapital <= 5000) {
      return "Exempted";
    } else if (totalCapital >= 5001 && totalCapital <= 10000) {
      return 100;
    } else if (totalCapital >= 10001 && totalCapital <= 50000) {
      return 200;
    } else if (totalCapital >= 50001 && totalCapital <= 100000) {
      return 300;
    } else {
      return ((totalCapital - 100000) * 0.001 + 500).toFixed(2);
    }
  }

  const zoningFee = calculateZoningFee(Number(applicant.totalCapital));

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>
          {showCert ? "Zoning Certificate" : "Applicant Details"}
        </DialogTitle>

        <DialogContent dividers>
          {!showCert ? (
            <>
              {/* Business Info */}
              <Section title="Business Information">
                <Field label="Status" value={applicant.ZONING} />
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
              </Section>

              {/* Operations */}
              <Section title="Business Operation">
                <Field
                  label="Total Floor Area"
                  value={applicant.totalFloorArea}
                />
                <Field label="Employees" value={applicant.numberOfEmployee} />
                <Field label="Male Employees" value={applicant.maleEmployee} />
                <Field
                  label="Female Employees"
                  value={applicant.femaleEmployee}
                />
                <Field label="Vans" value={applicant.numVehicleVan} />
                <Field label="Trucks" value={applicant.numVehicleTruck} />
                <Field label="Motorcycles" value={applicant.numVehicleMotor} />
                <Field label="No. of Nozzles" value={applicant.numNozzle} />
                <Field label="Weigh Scale" value={applicant.weighScale} />
              </Section>

              {/* Tax Address */}
              <Section title="Taxpayer Address">
                <Field label="Tax Region" value={applicant.Taxregion} />
                <Field label="Tax Province" value={applicant.Taxprovince} />
                <Field
                  label="Tax City/Municipality"
                  value={applicant.TaxcityOrMunicipality}
                />
                <Field label="Tax Barangay" value={applicant.Taxbarangay} />
                <Field
                  label="Tax Address Line 1"
                  value={applicant.TaxaddressLine1}
                />
                <Field label="Tax Zip Code" value={applicant.TaxzipCode} />
                <Field label="Tax Pin Address" value={applicant.TaxpinAddress} />
                <Field label="Own Place" value={applicant.ownPlace} />
                {applicant.ownPlace === "Yes" ? (
                  <Field label="Tax Dec. No." value={applicant.taxdec} />
                ) : (
                  <>
                    <Field label="Lessor's Name" value={applicant.lessorName} />
                    <Field label="Monthly Rent" value={applicant.monthlyRent} />
                    <Field label="Tax Dec. No." value={applicant.taxdec} />
                  </>
                )}
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
                  const product =
                    applicant.productService?.split(",")[index] || "";
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
                          <Field
                            label="Product/Service"
                            value={product.trim()}
                          />
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

              {/* Zoning Attachments */}
              <Typography variant="subtitle1" sx={{ mb: 3 }}>
                ZONING FEE:{" "}
                <b>{zoningFee === "Exempted" ? zoningFee : `₱${zoningFee}`}</b>
              </Typography>

              {applicant.ZONING === "Pending" ? (
                // ✅ Show upload fields
                <Stack spacing={3}>
                  {files.map((file) => (
                    <Stack key={file.name} direction="column" spacing={1}>
                      <Typography>{file.label}:</Typography>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Button
                          variant="contained"
                          component="label"
                          size="small"
                          sx={{ minWidth: 120 }}
                          color="success"
                        >
                          Choose File
                          <input
                            type="file"
                            name={file.name}
                            hidden
                            onChange={handleFileSelect}
                          />
                        </Button>
                        <TextField
                          value={selectedFiles[file.name] || ""}
                          placeholder="No file selected"
                          size="small"
                          fullWidth
                          error={validationError}
                          helperText={
                            validationError && "A file must be uploaded to approve."
                          }
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              ) : applicant.ZONING === "Approved" ? (
                <FileField
                  fileKey="zoningCert"
                  label="Zoning Certificate"
                  fileData={applicant}
                />
              ) : null}
            </>
          ) : (
            <ZoningCert applicant={applicant} />
          )}
        </DialogContent>
        {/* ✅ Cleaned Up Actions */}
        <DialogActions>
          {/* Only show Approve/Decline if not yet approved and not viewing cert */}
          {!showCert && applicant.ZONING !== "Approved" && (
            <>
              <Button
                onClick={onClose}
                variant="contained"
                color="gray"
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
              <Button
                onClick={handleApproveClick}
                variant="contained"
                color="success"
              >
                Approve
              </Button>

              <Button
                onClick={handleDeclineClick}
                variant="contained"
                color="error"
                sx={{
                  color: "white",
                  width: "100px",
                }}
              >
                Decline
              </Button>
            </>
          )}

          {/* ✅ Only allow Generate Certificate if pending */}
          {!showCert && applicant.ZONING !== "Approved" ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowCert(true)}
            >
              Generate Certificate
            </Button>
          ) : showCert ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowCert(false)}
            >
              Back to Details
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
      {/* Decline Reason Modal */}
      <Dialog open={declineOpen} onClose={() => setDeclineOpen(false)}>
        <DialogTitle>Reason for Decline</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeclineOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleDeclineConfirm}
            color="error"
            variant="contained"
            disabled={!declineReason.trim()}
          >
            Submit Decline
          </Button>
        </DialogActions>
      </Dialog>
      {/* Success Pop-up for Approve */}
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
      {/* Success Pop-up for Decline - NEW */}
      <Dialog
        open={declineSuccessOpen}
        onClose={handleDeclineSuccessClose}
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
            color: "#d32f2f",
            borderRadius: 2,
          }}
        >
          <CancelIcon
            fontSize="large"
            sx={{ fontSize: "5rem", color: "#d32f2f" }}
          />
          <Typography variant="h5" fontWeight="bold">
            Successfully Declined!
          </Typography>
          <Button
            onClick={handleDeclineSuccessClose}
            variant="contained"
            color="error"
          >
            OK
          </Button>
        </Paper>
      </Dialog>
    </>
  );
}

export default ZoningApplicantModal;