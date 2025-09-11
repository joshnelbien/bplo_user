import React, { useState, useEffect } from "react";
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
  Fade
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { styled } from "@mui/system";

// A reusable component for displaying a read-only text field with custom styles.
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

// A reusable component for displaying a read-only text field for a file, with view/download links.
const FileField = ({ label, fileKey, fileData }) => (
  <Grid item xs={12} sm={6}>
    <TextField
      label={label}
      value={fileData[fileKey] ? fileData[`${fileKey}_filename`] : "No file uploaded"}
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
            href={`http://localhost:5000/backroom/backroom/${fileData.id}/${fileKey}`}
            target="_blank"
            rel="noreferrer"
          >
            <Typography component="span">View</Typography>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Download File">
          <IconButton
            size="small"
            component="a"
            href={`http://localhost:5000/backroom/backroom/${fileData.id}/${fileKey}/download`}
            target="_blank"
            rel="noreferrer"
          >
            <Typography component="span">Download</Typography>
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Typography>
    )}
  </Grid>
);

// A reusable component for confirmation dialogs.
const ConfirmDialog = ({ open, title, onConfirm, onCancel, confirmColor }) => (
  <Dialog
    open={open}
    onClose={onCancel}
    sx={{ "& .MuiDialog-paper": { borderRadius: "10px", width: "400px" } }}
  >
    <DialogTitle
      align="center"
      sx={{
        py: 3,
        px: 4,
        fontWeight: "bold",
        fontSize: "1.25rem",
        color: confirmColor,
      }}
    >
      {title}
    </DialogTitle>
    <DialogActions
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 2,
        pb: 2,
      }}
    >
      <Button
        onClick={onConfirm}
        variant="contained"
        color={confirmColor}
        sx={{
          fontWeight: "bold",
          textTransform: "uppercase",
          minWidth: "100px",
        }}
      >
        Yes
      </Button>
      <Button
        onClick={onCancel}
        variant="outlined"
        sx={{
          fontWeight: "bold",
          textTransform: "uppercase",
          minWidth: "100px",
          color: confirmColor,
          borderColor: confirmColor,
          "&:hover": { borderColor: confirmColor },
        }}
      >
        No
      </Button>
    </DialogActions>
  </Dialog>
);

// A reusable component for status dialogs (success/decline).
const StatusDialog = ({ open, onClose, icon, title, color }) => (
  <Dialog
    open={open}
    onClose={onClose}
    TransitionComponent={Fade}
    maxWidth="xs"
    sx={{
      "& .MuiDialog-paper": {
        borderRadius: "10px",
        backgroundColor: "white",
      },
    }}
  >
    <Paper
      elevation={6}
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        color: color,
      }}
    >
      {icon}
      <Typography variant="h5" fontWeight="bold">
        {title}
      </Typography>
      <Button
        onClick={onClose}
        variant="contained"
        sx={{
          backgroundColor: color,
          "&:hover": { backgroundColor: color },
        }}
      >
        OK
      </Button>
    </Paper>
  </Dialog>
);

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

function ChoApplicantModal({
  applicant,
  isOpen,
  onClose,
  onApprove,
  handleFileChange,
  onDecline,
}) {
  if (!isOpen || !applicant) return null;

  const [choFee, setChoFee] = useState(applicant.choFee || "");
  const [declineReason, setDeclineReason] = useState("");
  const [selectedFiles, setSelectedFiles] = useState({});

  // Dialog state management
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
  const [declineConfirmOpen, setDeclineConfirmOpen] = useState(false);
  const [successStatusOpen, setSuccessStatusOpen] = useState(false);
  const [declineStatusOpen, setDeclineStatusOpen] = useState(false);

  useEffect(() => {
    if (applicant) {
      setChoFee(applicant.choFee || "");
    }
  }, [applicant]);

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

  const handleApproveConfirm = () => {
    setApproveConfirmOpen(false);
    onApprove(applicant.id, choFee, selectedFiles);
    setSuccessStatusOpen(true);
  };

  const handleDeclineConfirm = () => {
    if (declineReason.trim() === "") {
      // Reason is required, the button will be disabled
      return;
    }
    setDeclineConfirmOpen(false);
    onDecline(applicant.id, declineReason);
    setDeclineStatusOpen(true);
  };

  const handleApproveStatusClose = () => {
    setSuccessStatusOpen(false);
    onClose();
  };

  const handleDeclineStatusClose = () => {
    setDeclineStatusOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Applicant Details</DialogTitle>
        <DialogContent dividers>
          <Section title="Business Information">
            <Field label="Status" value={applicant.CHO} />
            <Field label="BIN" value={applicant.BIN} />
            <Field label="Business Type" value={applicant.BusinessType} />
            <Field label="DSC Registration No" value={applicant.dscRegNo} />
            <Field label="Business Name" value={applicant.businessName} />
            <Field label="TIN No" value={applicant.tinNo} />
            <Field label="Trade Name" value={applicant.TradeName} />
          </Section>

          <Section title="Personal Information">
            <Field label="First Name" value={applicant.firstName} />
            <Field label="Middle Name" value={applicant.middleName} />
            <Field label="Last Name" value={applicant.lastName} />
            <Field label="Extension Name" value={applicant.extName} />
            <Field label="Sex" value={applicant.sex} />
          </Section>

          <Section title="Contact Information">
            <Field label="Email" value={applicant.eMailAdd} />
            <Field label="Telephone No" value={applicant.telNo} />
            <Field label="Mobile No" value={applicant.mobileNo} />
          </Section>

          <Section title="Business Address">
            <Field label="Region" value={applicant.region} />
            <Field label="Province" value={applicant.province} />
            <Field label="City/Municipality" value={applicant.cityOrMunicipality} />
            <Field label="Barangay" value={applicant.barangay} />
            <Field label="Address Line 1" value={applicant.addressLine1} />
            <Field label="Zip Code" value={applicant.zipCode} />
            <Field label="Pin Address" value={applicant.pinAddress} />
          </Section>

          <Section title="Business Operation">
            <Field label="Total Floor Area" value={applicant.totalFloorArea} />
            <Field label="Employees" value={applicant.numberOfEmployee} />
            <Field label="Male Employees" value={applicant.maleEmployee} />
            <Field label="Female Employees" value={applicant.femaleEmployee} />
            <Field label="Vans" value={applicant.numVehicleVan} />
            <Field label="Trucks" value={applicant.numVehicleTruck} />
            <Field label="Motorcycles" value={applicant.numVehicleMotor} />
            <Field label="No. of Nozzles" value={applicant.numNozzle} />
            <Field label="Weigh Scale" value={applicant.weighScale} />
          </Section>

          <Section title="Taxpayer Address">
            <Field label="Tax Region" value={applicant.Taxregion} />
            <Field label="Tax Province" value={applicant.Taxprovince} />
            <Field label="Tax City/Municipality" value={applicant.TaxcityOrMunicipality} />
            <Field label="Tax Barangay" value={applicant.Taxbarangay} />
            <Field label="Tax Address Line 1" value={applicant.TaxaddressLine1} />
            <Field label="Tax Zip Code" value={applicant.TaxzipCode} />
            <Field label="Tax Pin Address" value={applicant.TaxpinAddress} />
            <Field label="Own Place" value={applicant.ownPlace} />
            {applicant.ownPlace === "Yes" ? (
              <Field label="Tax Dec. No." value={applicant.taxdec} />
            ) : (
              <>
                <Grid item xs={12} sm={6}>
                  <Field label="Lessor's Name" value={applicant.lessorName} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field label="Monthly Rent" value={applicant.monthlyRent} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field label="Tax Dec. No." value={applicant.taxdec} />
                </Grid>
              </>
            )}
          </Section>

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

          <TextField
            label="Sanitary Fee"
            value={choFee}
            onChange={(e) => setChoFee(e.target.value)}
            fullWidth
            size="small"
            sx={{ mt: 2 }}
          />
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
                  name="choCert"
                  hidden
                  onChange={handleFileSelect}
                />
              </Button>
            </Grid>
            <Grid item xs>
              <TextField
                value={selectedFiles.choCert?.name || ""}
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
            sx={{
              backgroundColor: "#e0e0e0",
              color: "#424242",
              width: "100px",
              "&:hover": {
                backgroundColor: "#bdbdbd",
              },
            }}
          >
            Close
          </Button>
          <Button onClick={() => setApproveConfirmOpen(true)} variant="contained" color="success">
            Approve
          </Button>
          <Button onClick={() => setDeclineConfirmOpen(true)} variant="contained" color="error">
            Decline
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reusable Confirmation Dialog for Approve */}
      <ConfirmDialog
        open={approveConfirmOpen}
        title="Are you sure you want to approve this applicant?"
        onConfirm={handleApproveConfirm}
        onCancel={() => setApproveConfirmOpen(false)}
        confirmColor="success"
      />

      {/* New Decline Dialog with Reason TextField */}
      <Dialog 
        open={declineConfirmOpen} 
        onClose={() => setDeclineConfirmOpen(false)} 
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
            required
            error={declineReason.trim() === ""}
            helperText={declineReason.trim() === "" ? "Reason is required" : ""}
          /> 
        </DialogContent> 
        <DialogActions> 
          <Button onClick={() => setDeclineConfirmOpen(false)} color="primary"> 
            Cancel 
          </Button> 
          <Button 
            onClick={handleDeclineConfirm} 
            color="error" 
            variant="contained" 
            disabled={declineReason.trim() === ""}
          > 
            Decline 
          </Button> 
        </DialogActions> 
      </Dialog> 

      {/* Reusable Status Dialog for Success */}
      <StatusDialog
        open={successStatusOpen}
        onClose={handleApproveStatusClose}
        icon={<CheckCircleIcon fontSize="large" sx={{ fontSize: "5rem" }} />}
        title="Successfully Approved!"
        color="#4caf50"
      />

      {/* Reusable Status Dialog for Decline */}
      <StatusDialog
        open={declineStatusOpen}
        onClose={handleDeclineStatusClose}
        icon={<CancelIcon fontSize="large" sx={{ fontSize: "5rem" }} />}
        title="Successfully Declined!"
        color="#d32f2f"
      />
    </>
  );
}

export default ChoApplicantModal;
  