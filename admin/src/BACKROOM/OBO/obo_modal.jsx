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
  Stack,
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
const FileField = ({ label, fileKey, fileData }) => {
  const fileVal = fileData[fileKey];
  const fileNameFromBackend = fileData[`${fileKey}_filename`];
  const fileNameFromPath =
    typeof fileVal === "string" && fileVal ? fileVal.split("/").pop() : "";
  const fileName =
    fileNameFromBackend || fileNameFromPath || "No file uploaded";

  const fileExists = !!fileVal || !!fileNameFromBackend;

  const fileUrl = fileExists
    ? `${API}/backroom/applications/${fileData.id}/file/${fileKey}`
    : null;
  const downloadUrl = fileExists ? `${fileUrl}?download=true` : null;

  const handleClick = (url) => {
    if (!url) {
      alert("❌ No file uploaded yet");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Grid item xs={12} sm={6}>
      <TextField
        label={label}
        value={fileName}
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
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "black" },
            "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
              borderColor: "black",
            },
          },
        }}
        InputLabelProps={{
          sx: { color: "black", "&.Mui-disabled": { color: "black" } },
        }}
      />
      <Stack direction="row" spacing={1} mt={1}>
        <Tooltip title={fileExists ? "View File" : "No file available"}>
          <IconButton size="small" onClick={() => handleClick(fileUrl)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={fileExists ? "Download File" : "No file available"}>
          <IconButton size="small" onClick={() => handleClick(downloadUrl)}>
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Grid>
  );
};

function OboApplicantModal({
  applicant,
  isOpen,
  onClose,
  onApprove,
  onDecline,
  fetchApplicants,
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
  const [selectedReason, setSelectedReason] = useState("");
  const [declineSuccessOpen, setDeclineSuccessOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggleReason = (reason) => {
    setSelectedReason(selectedReason === reason ? "" : reason);
  };

  const handleAddReason = () => {
    if (selectedReason) {
      setDeclineReason((prevReason) => {
        if (prevReason.includes(selectedReason)) {
          return prevReason;
        }
        return prevReason ? `${prevReason}, ${selectedReason}` : selectedReason;
      });
    }
  };

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
    const numericFields = [
      "BSAP",
      "SR",
      "Mechanical",
      "Electrical",
      "Signage",
      "Electronics",
    ];

    let newValue = value;

    if (numericFields.includes(field)) {
      // strip commas, keep only digits
      const raw = value.replace(/,/g, "").replace(/\D/g, "");
      newValue = raw ? parseInt(raw, 10).toLocaleString("en-US") : "";
    }

    setOboFields((prev) => ({ ...prev, [field]: newValue }));
    setFieldErrors((prev) => ({ ...prev, [field]: false }));
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
      setLoading(true);
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
    fetchApplicants();
    onClose();
  };

  // Decline Logic
  const handleDeclineClick = () => {
    setDeclineReason("");
    setSelectedReason("");
    setDeclineConfirmOpen(true);
  };
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

  const formatNumber = (value) => {
    if (!value) return "—";
    const num = Number(value.toString().replace(/[^0-9.-]+/g, ""));
    if (isNaN(num)) return value;
    return num.toLocaleString("en-US");
  };

  return (
    <>
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

        <DialogContent dividers>
          {/* Business Info */}
          <Section title="Business Information">
            <Field label="Status" value={applicant.OBO} />
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
                <Field
                  label="Monthly Rent"
                  value={formatCurrency(applicant.monthlyRent)}
                />
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
                        <Field label="Capital" value={formatNumber(capital)} />
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
            {applicant.application === "Renew" && (
              <>
                <FileField
                  fileKey="RecentBusinessPermit"
                  label="Business Permit"
                  fileData={applicant}
                />
              </>
            )}
          </Section>
          {applicant.OBO !== "Approved" && (
            <>
              <Grid item xs={12} sm={6} mt={2}>
                <TextField
                  label="Building Structure Architectural Presentability"
                  value={oboFields.BSAP}
                  onChange={(e) => handleChange("BSAP", e.target.value)}
                  fullWidth
                  size="small"
                  error={fieldErrors.BSAP}
                  helperText={
                    fieldErrors.BSAP && "Required to fill out this field"
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6} mt={2}>
                <TextField
                  label="Sanitary Requirements"
                  value={oboFields.SR}
                  onChange={(e) => handleChange("SR", e.target.value)}
                  fullWidth
                  size="small"
                  error={fieldErrors.SR}
                  helperText={
                    fieldErrors.SR && "Required to fill out this field"
                  }
                />
              </Grid>

              <Grid item xs={12} sm={6} mt={2}>
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

              <Grid item xs={12} sm={6} mt={2}>
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

              <Grid item xs={12} sm={6} mt={2}>
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

              <Grid item xs={12} sm={6} mt={2}>
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
            </>
          )}
        </DialogContent>

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
          {applicant.OBO !== "Approved" && (
            <>
              <Button
                onClick={handleApproveClick}
                variant="contained"
                color="success"
                disabled={loading}
              >
                {loading ? "Processing..." : "Approve"}
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
            </>
          )}
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
            backgroundColor: "#053d16ff",
            color: "white",
          }}
        >
          Decline Applicant
        </DialogTitle>
        <DialogContent sx={{ pt: 2, px: 3 }}>
          <Grid container spacing={1} sx={{ mt: 2, mb: 2 }}>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                onClick={() => handleToggleReason("Incomplete Requirements")}
                sx={{
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  minWidth: "24px",
                  mr: 1,
                  p: 0,
                  borderColor: "#053d16ff",
                  ...(selectedReason === "Incomplete Requirements" && {
                    backgroundColor: "#e8f5e9",
                  }),
                }}
              >
                {selectedReason === "Incomplete Requirements" && (
                  <CheckCircleIcon
                    sx={{ fontSize: "1rem", color: "#4caf50" }}
                  />
                )}
              </Button>
              <Typography
                component="span"
                sx={{
                  fontSize: "1.1rem",
                  color: "#000000",
                  verticalAlign: "middle",
                }}
              >
                Incomplete Requirements
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                onClick={() =>
                  handleToggleReason(
                    "Non-Compliance with Safety and Health Standards"
                  )
                }
                sx={{
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  minWidth: "24px",
                  mr: 1,
                  p: 0,
                  borderColor: "#053d16ff",
                  ...(selectedReason ===
                    "Non-Compliance with Safety and Health Standards" && {
                    backgroundColor: "#e8f5e9",
                  }),
                }}
              >
                {selectedReason ===
                  "Non-Compliance with Safety and Health Standards" && (
                  <CheckCircleIcon
                    sx={{ fontSize: "1rem", color: "#4caf50" }}
                  />
                )}
              </Button>
              <Typography
                component="span"
                sx={{
                  fontSize: "1.1rem",
                  color: "#000000",
                  verticalAlign: "middle",
                }}
              >
                Non-Compliance with Safety and Health Standards
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                onClick={() =>
                  handleToggleReason("Regulatory or Legal Violations")
                }
                sx={{
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  minWidth: "24px",
                  mr: 1,
                  p: 0,
                  borderColor: "#053d16ff",
                  ...(selectedReason === "Regulatory or Legal Violations" && {
                    backgroundColor: "#e8f5e9",
                  }),
                }}
              >
                {selectedReason === "Regulatory or Legal Violations" && (
                  <CheckCircleIcon
                    sx={{ fontSize: "1rem", color: "#4caf50" }}
                  />
                )}
              </Button>
              <Typography
                component="span"
                sx={{
                  fontSize: "1.1rem",
                  color: "#000000",
                  verticalAlign: "middle",
                }}
              >
                Regulatory or Legal Violations
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                onClick={() =>
                  handleToggleReason("Environmental and Compliance Concerns")
                }
                sx={{
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  minWidth: "24px",
                  mr: 1,
                  p: 0,
                  borderColor: "#053d16ff",
                  ...(selectedReason ===
                    "Environmental and Compliance Concerns" && {
                    backgroundColor: "#e8f5e9",
                  }),
                }}
              >
                {selectedReason === "Environmental and Compliance Concerns" && (
                  <CheckCircleIcon
                    sx={{ fontSize: "1rem", color: "#4caf50" }}
                  />
                )}
              </Button>
              <Typography
                component="span"
                sx={{
                  fontSize: "1.1rem",
                  color: "#000000",
                  verticalAlign: "middle",
                }}
              >
                Environmental and Compliance Concerns
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                onClick={() => handleToggleReason("Zoning and Location Issues")}
                sx={{
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  minWidth: "24px",
                  mr: 1,
                  p: 0,
                  borderColor: "#053d16ff",
                  ...(selectedReason === "Zoning and Location Issues" && {
                    backgroundColor: "#e8f5e9",
                  }),
                }}
              >
                {selectedReason === "Zoning and Location Issues" && (
                  <CheckCircleIcon
                    sx={{ fontSize: "1rem", color: "#4caf50" }}
                  />
                )}
              </Button>
              <Typography
                component="span"
                sx={{
                  fontSize: "1.1rem",
                  color: "#000000",
                  verticalAlign: "middle",
                }}
              >
                Zoning and Location Issues
              </Typography>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            onClick={handleAddReason}
            disabled={!selectedReason}
            sx={{
              bgcolor: "#053d16ff",
              mb: 2,
            }}
          >
            Add
          </Button>
          <TextField
            autoFocus
            margin="dense"
            id="decline-reason"
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
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#04812aff",
                },
                "&:hover fieldset": {
                  borderColor: "#04812aff",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#04812aff",
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeclineConfirmClose}
            sx={{
              color: "#333",
              "&:hover": { bgcolor: "#f5f5f5" },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleDeclineConfirm}
            variant="contained"
            sx={{
              bgcolor: "#d32f2f",
              "&:hover": { bgcolor: "#b71c1c" },
            }}
            disabled={declineReason.trim() === ""}
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
          <Typography variant="h5" fontWeight="bold" sx={{ color: "black" }}>
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
