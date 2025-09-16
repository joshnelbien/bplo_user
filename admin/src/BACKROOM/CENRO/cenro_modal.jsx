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
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useState, useEffect } from "react";

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
            href={`http://localhost:5000/backroom/backroom/${fileData.id}/${fileKey}`}
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
            href={`http://localhost:5000/backroom/backroom/${fileData.id}/${fileKey}/download`}
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

function CenroApplicantModal({
  applicant,
  isOpen,
  onClose,
  onApprove,
  handleFileChange,
  onDecline,
}) {
  if (!isOpen || !applicant) return null;

  const [cenroField, setcenroField] = useState({ cenroFee: "" });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [declineConfirmOpen, setDeclineConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [declineSuccessOpen, setDeclineSuccessOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [validationErrors, setValidationErrors] = useState({
    cenroFee: false,
    cenroCert: false,
  });

  useEffect(() => {
    if (applicant) {
      setcenroField({
        cenroFee: applicant.cenroFee || "",
      });
    }
  }, [applicant]);

  const handleChange = (field, value) => {
    setcenroField((prev) => ({ ...prev, [field]: value }));
    setValidationErrors((prev) => ({ ...prev, [field]: false }));
  };

  const files = [{ label: "cenro Certificate", name: "cenroCert" }];

  const handleFileSelect = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setSelectedFiles((prev) => ({
        ...prev,
        [name]: files[0], // store the actual File object
      }));
      handleFileChange(name, files[0]); // send file up to parent
      setValidationErrors((prev) => ({ ...prev, cenroCert: false }));
    }
  };

  const handleApproveClick = () => {
    let hasError = false;
    const newErrors = { cenroFee: false, cenroCert: false };

    if (cenroField.cenroFee.trim() === "") {
      newErrors.cenroFee = true;
      hasError = true;
    }

    if (!selectedFiles.cenroCert) {
      newErrors.cenroCert = true;
      hasError = true;
    }

    setValidationErrors(newErrors);

    if (!hasError) {
      setConfirmOpen(true);
    }
  };

  const handleDeclineClick = () => {
    setDeclineConfirmOpen(true);
  };

  const handleConfirmApprove = () => {
    setConfirmOpen(false);
    onApprove(applicant.id, cenroField.cenroFee, selectedFiles);
    setSuccessOpen(true);
  };

  const handleDeclineConfirm = () => {
    setDeclineConfirmOpen(false);
    onDecline(applicant.id, declineReason);
    setDeclineSuccessOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleDeclineConfirmClose = () => {
    setDeclineConfirmOpen(false);
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
    onClose();
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
            <Field label="Status" value={applicant.CENRO} />
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

          {/* CENRO Fee input */}
          <TextField
            label="Environmental Fee"
            value={cenroField.cenroFee || ""}
            onChange={(e) => handleChange("cenroFee", e.target.value)}
            fullWidth
            size="small"
            sx={{ mt: 2 }}
            error={validationErrors.cenroFee}
            helperText={
              validationErrors.cenroFee &&
              "Environmental Fee is required for approval."
            }
          />

          {/* File Upload */}
          {files.map((file) => (
            <Grid container spacing={1} key={file.name} sx={{ mt: 1 }}>
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
                    name={file.name}
                    hidden
                    onChange={handleFileSelect}
                  />
                </Button>
              </Grid>
              <Grid item xs>
                <TextField
                  value={selectedFiles[file.name]?.name || ""}
                  placeholder="No file selected"
                  size="small"
                  fullWidth
                  InputProps={{ readOnly: true }}
                  error={validationErrors.cenroCert}
                  helperText={
                    validationErrors.cenroCert && "A file is required for approval."
                  }
                />
              </Grid>
            </Grid>
          ))}
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            onClick={onClose}
            color="secondary"
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
            sx={{ width: "100px" }}
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
            disabled={!declineReason.trim()}
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

      {/* Success Pop-up for Decline */}
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

export default CenroApplicantModal;