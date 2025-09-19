import { useState, useEffect } from "react";
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
  Snackbar,
  Fade,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel"; // New icon for decline
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
            href={`${API}/examiners/examiners/${fileData.id}/${fileKey}`}
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
            href={`${API}/examiners/examiners/${fileData.id}/${fileKey}/download`}
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

function OboApplicantModal({
  applicant,
  isOpen,
  onClose,
  onApprove,
  onDecline,
}) {
  if (!isOpen || !applicant) return null;

  const [oboFields, setOboFields] = useState({
    BSAP: "",
    SR: "",
    Mechanical: "",
    Electrical: "",
    Signage: "",
    Electronics: "",
  });

  // State to manage validation errors for each field
  const [fieldErrors, setFieldErrors] = useState({
    BSAP: false,
    SR: false,
    Mechanical: false,
    Electrical: false,
    Signage: false,
    Electronics: false,
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [declineConfirmOpen, setDeclineConfirmOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [declineSuccessOpen, setDeclineSuccessOpen] = useState(false);

  useEffect(() => {
    if (applicant) {
      setOboFields({
        BSAP: applicant.BSAP || "",
        SR: applicant.SR || "",
        Mechanical: applicant.Mechanical || "",
        Electrical: applicant.Electrical || "",
        Signage: applicant.Signage || "",
        Electronics: applicant.Electronics || "",
      });
    }
  }, [applicant]);

  // Function to handle changes and clear the error for the changed field
  const handleChange = (field, value) => {
    setOboFields((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: false })); // Clear error on change
  };

  // Validation function to check if all fields are filled
  const validateFields = () => {
    const newErrors = {};
    let isValid = true;

    if (!oboFields.BSAP) {
      newErrors.BSAP = true;
      isValid = false;
    }
    if (!oboFields.SR) {
      newErrors.SR = true;
      isValid = false;
    }
    if (!oboFields.Mechanical) {
      newErrors.Mechanical = true;
      isValid = false;
    }
    if (!oboFields.Electrical) {
      newErrors.Electrical = true;
      isValid = false;
    }
    if (!oboFields.Signage) {
      newErrors.Signage = true;
      isValid = false;
    }
    if (!oboFields.Electronics) {
      newErrors.Electronics = true;
      isValid = false;
    }

    setFieldErrors(newErrors);
    return isValid;
  };

  // Approve Logic
  const handleApproveClick = () => {
    if (validateFields()) {
      setConfirmOpen(true);
    }
  };
  const handleConfirmClose = () => setConfirmOpen(false);
  const handleConfirmApprove = () => {
    setConfirmOpen(false);
    onApprove(applicant.id, oboFields);
    setSuccessOpen(true);
  };
  const handleSuccessClose = () => {
    setSuccessOpen(false);
    onClose();
  };

  // Decline Logic
  const handleDeclineClick = () => setDeclineConfirmOpen(true);
  const handleDeclineConfirmClose = () => setDeclineConfirmOpen(false);
  const handleDeclineConfirm = () => {
    setDeclineConfirmOpen(false);
    onDecline(applicant.id, declineReason);
    setDeclineSuccessOpen(true);
  };
  const handleDeclineSuccessClose = () => {
    setDeclineSuccessOpen(false);
    onClose();
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
            <Field label="Status" value={applicant.OBO} />
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

          <Grid item xs={12} sm={6}>
            <TextField
              label="Building Structure Architectural Presentability"
              value={oboFields.BSAP}
              onChange={(e) => handleChange("BSAP", e.target.value)}
              fullWidth
              size="small"
              error={fieldErrors.BSAP}
              helperText={fieldErrors.BSAP && "Required to fill out this field"}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Sanitary Requirements"
              value={oboFields.SR}
              onChange={(e) => handleChange("SR", e.target.value)}
              fullWidth
              size="small"
              error={fieldErrors.SR}
              helperText={fieldErrors.SR && "Required to fill out this field"}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Mechanical"
              value={oboFields.Mechanical}
              onChange={(e) => handleChange("Mechanical", e.target.value)}
              fullWidth
              size="small"
              error={fieldErrors.Mechanical}
              helperText={
                fieldErrors.Mechanical && "Required to fill out this field"
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Electrical"
              value={oboFields.Electrical}
              onChange={(e) => handleChange("Electrical", e.target.value)}
              fullWidth
              size="small"
              error={fieldErrors.Electrical}
              helperText={
                fieldErrors.Electrical && "Required to fill out this field"
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Signage"
              value={oboFields.Signage}
              onChange={(e) => handleChange("Signage", e.target.value)}
              fullWidth
              size="small"
              error={fieldErrors.Signage}
              helperText={
                fieldErrors.Signage && "Required to fill out this field"
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Electronics"
              value={oboFields.Electronics}
              onChange={(e) => handleChange("Electronics", e.target.value)}
              fullWidth
              size="small"
              error={fieldErrors.Electronics}
              helperText={
                fieldErrors.Electronics && "Required to fill out this field"
              }
            />
          </Grid>
        </DialogContent>

        <DialogActions>
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
            }}
          >
            Decline
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Approve */}
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

      {/* Decline Dialog with Reason TextField */}
      <Dialog
        open={declineConfirmOpen}
        onClose={handleDeclineConfirmClose}
        aria-labelledby="decline-dialog-title"
      >
        <DialogTitle
          id="decline-dialog-title"
          sx={{
            fontWeight: "bold",
            backgroundColor: "#d32f2f",
            color: "white",
          }}
        >
          Decline Applicant
        </DialogTitle>
        <DialogContent sx={{ pt: 2, px: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            id="decline-reason"
            label="Reason for Decline"
            type="text"
            fullWidth
            variant="outlined"
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeclineConfirmClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeclineConfirm}
            color="error"
            variant="contained"
          >
            Decline
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

export default OboApplicantModal;
