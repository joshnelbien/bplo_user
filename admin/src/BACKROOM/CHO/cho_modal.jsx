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
  Snackbar,
  Fade,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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

function ChoApplicantModal({
  applicant,
  isOpen,
  onClose,
  onApprove,
  handleFileChange,
}) {
  if (!isOpen || !applicant) return null;

  const [choField, setChoField] = useState({ choFee: "" });
  const [confirmOpen, setConfirmOpen] = useState(false); // State for confirmation dialog
  const [successOpen, setSuccessOpen] = useState(false); // State for success pop-up
  const [selectedFiles, setSelectedFiles] = useState({});

  useEffect(() => {
    if (applicant) {
      setChoField({
        choFee: applicant.choFee || "",
      });
    }
  }, [applicant]);

  const handleChange = (field, value) => {
    setChoField((prev) => ({ ...prev, [field]: value }));
  };

  const files = [{ label: "CHO Certificate", name: "choCert" }];

  const handleFileSelect = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setSelectedFiles((prev) => ({
        ...prev,
        [name]: files[0], // store the actual File object
      }));
      handleFileChange(name, files[0]); // send file up to parent
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
    onApprove(applicant.id, choField.choFee, selectedFiles); // Call the original onApprove
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
            <Field label="Status" value={applicant.CHO} />
            <Field label="ID" value={applicant.id} />
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

          {/* CHO Fee input */}
          <TextField
            label="Sanitary Fee"
            value={choField.choFee || ""}
            onChange={(e) => handleChange("choFee", e.target.value)}
            fullWidth
            size="small"
            sx={{ mt: 2 }}
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
                />
              </Grid>
            </Grid>
          ))}
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
              width: "100px", // Set a specific width
            }}
          >
            Close
          </Button>
          <Button
            onClick={handleApproveClick} // Trigger confirmation dialog
            variant="contained"
            color="success"
          >
            Approve
          </Button>
          <Button
            onClick={onClose}
            variant="contained"
            color="error"
            sx={{
              color: "white", // Changes the font color to white
            }}
          >
            Decline
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={handleConfirmClose}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">Confirm Approval</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to approve?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="secondary">
            No
          </Button>
          <Button onClick={handleConfirmApprove} color="success" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Pop-up */}
      <Snackbar
        open={successOpen}
        autoHideDuration={2000}
        onClose={handleSuccessClose}
        anchorOrigin={{ vertical: "center", horizontal: "center" }}
        TransitionComponent={Fade}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            backgroundColor: "white",
            color: "#4caf50",
            borderRadius: 2,
            minWidth: "200px",
            textAlign: "center",
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 72 }} />
          <Typography variant="h6">Successfully Approved!</Typography>
        </Paper>
      </Snackbar>
    </>
  );
}

export default ChoApplicantModal;
