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
  Stack,
  IconButton,
  Tooltip,
  Fade,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { styled } from "@mui/system";
import CenroCertExport from "./cenroCertExport";

// The API base URL is hardcoded as a placeholder since environment variables cannot be accessed.
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

const FileField = ({ label, fileKey, fileData }) => {
  const fileVal = fileData[fileKey];
  const fileNameFromBackend = fileData[`${fileKey}_filename`];
  const fileNameFromPath =
    typeof fileVal === "string" && fileVal ? fileVal.split("/").pop() : "";
  const fileName =
    fileNameFromBackend || fileNameFromPath || "No file uploaded";

  const fileExists = !!fileVal || !!fileNameFromBackend;

  const fileUrl = fileExists
    ? `${API}/newApplication/applications/${fileData.id}/file/${fileKey}`
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
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [declineConfirmOpen, setDeclineConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [declineSuccessOpen, setDeclineSuccessOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [validationErrors, setValidationErrors] = useState({
    cenroFee: false,
    cenroCert: false,
  });

  // NEW STATE FOR CERTIFICATE MODAL
  const [certOpen, setCertOpen] = useState(false);

  useEffect(() => {
    if (applicant) {
      setcenroField({
        cenroFee: applicant.cenroFee || "",
      });
    }
  }, [applicant]);

  // Update declineReason whenever selectedReasons change
  useEffect(() => {
    setDeclineReason(selectedReasons.join(", "));
  }, [selectedReasons]);

  const formatCurrency = (value) => {
    if (value == null || value === "") return "";
    const num = parseFloat(value.toString().replace(/,/g, ""));
    if (isNaN(num)) return value;
    return num.toLocaleString("en-US");
  };

  const handleChange = (field, value) => {
    const numericFields = ["cenroFee"];
    const cleanValue = numericFields.includes(field)
      ? value.replace(/,/g, "")
      : value;

    setcenroField((prev) => ({ ...prev, [field]: cleanValue }));
    setValidationErrors((prev) => ({ ...prev, [field]: false }));
  };

  const files = [{ label: "CENRO Certificate", name: "cenroCert" }];

  // Updated decline reasons as requested
  const declineReasonOptions = [
    "Incomplete Requirements",
    "Non-Compliance with Safety and Health Standards",
    "Regulatory or Legal Violations",
    "Environmental and Compliance Concerns",
    "Zoning and Location Issues",
  ];

  const handleFileSelect = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setSelectedFiles((prev) => ({
        ...prev,
        [name]: files[0],
      }));
      handleFileChange(name, files[0]);
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
    setDeclineReason("");
    setSelectedReasons([]);
    setDeclineConfirmOpen(true);
  };

  const handleConfirmApprove = () => {
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
      setConfirmOpen(true); // show modal only when valid
      onApprove(applicant.id, cenroField.cenroFee, selectedFiles);
    }
  };

  const handleDeclineConfirm = () => {
    if (declineReason.trim() === "") {
      return;
    }
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

  const handleToggleReason = (reason) => {
    setSelectedReasons((prevReasons) =>
      prevReasons.includes(reason)
        ? prevReasons.filter((r) => r !== reason)
        : [...prevReasons, reason]
    );
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
        <DialogTitle
          sx={{
            backgroundColor: "#1d5236",
            color: "white",
            textAlign: "center",
            py: 2,
          }}
        >
          Applicant Details
        </DialogTitle>

        <DialogContent dividers>
          {/* Business Info */}
          <Section title="Business Information">
            <Field label="Status" value={applicant.CENRO} />
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
              const parseCSV = (text) => {
                if (!text) return [];
                return text
                  .trim()
                  .replace(/^\[|\]$/g, "")
                  .split(/",\s*"?/)
                  .map((val) => val.replace(/^"|"$/g, "").trim())
                  .filter((val) => val.length > 0);
              };

              const lobArr = parseCSV(applicant.lineOfBusiness);
              const productArr = parseCSV(applicant.productService);
              const unitArr = parseCSV(applicant.Units);
              const capitalArr = parseCSV(applicant.capital);
              const natureCodeArr = parseCSV(applicant.natureCode);
              const businessNatureArr = parseCSV(applicant.businessNature);
              const lineCodeArr = parseCSV(applicant.lineCode);

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
                      width: "100%",
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
                      <Field
                        label="Line of Business"
                        value={lob}
                        fullWidth
                        multiline
                        rows={3}
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

          {applicant.CENRO === "Approved" && (
            <>
              <Section title={"Attachments"}>
                <FileField
                  fileKey="cenroCert"
                  label="Cenro Certificate"
                  fileData={applicant}
                />
              </Section>
            </>
          )}

          {applicant.CENRO !== "Approved" && (
            <>
              {/* CENRO Fee input */}
              <TextField
                label="Environmental Fee"
                value={formatCurrency(cenroField.cenroFee)}
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
                <Grid container spacing={1} sx={{ mt: 1 }} key={file.name}>
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
                        validationErrors.cenroCert &&
                        "A file is required for approval."
                      }
                    />
                  </Grid>
                </Grid>
              ))}
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

          {applicant.CENRO !== "Approved" && (
            <>
              <Button
                onClick={handleConfirmApprove}
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

              {/* UPDATED: Generate Certificate Button */}
              <Button
                onClick={() => setCertOpen(true)}
                variant="contained"
                sx={{
                  backgroundColor: "#3179d6ff",
                  color: "white",
                  width: "200px",
                  "&:hover": {
                    backgroundColor: "#0d42a3ff",
                  },
                }}
              >
                Generate Certificate
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Approve */}
      {/* <Dialog
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
      </Dialog> */}

      {/* Decline Dialog with Reason Buttons and input */}
      <Dialog
        open={declineConfirmOpen}
        onClose={handleDeclineConfirmClose}
        aria-labelledby="decline-dialog-title"
      >
        <DialogTitle
          id="decline-dialog-title"
          sx={{
            fontWeight: "bold",
            backgroundColor: "#053d16ff",
            color: "white",
            marginBottom: "20px",
          }}
        >
          Decline Applicant
        </DialogTitle>
        <DialogContent sx={{ pt: 2, px: 3 }}>
          <Grid container spacing={1} sx={{ mb: 2 }}>
            {declineReasonOptions.map((reason, index) => (
              <Grid item xs={12} key={reason}>
                <Button
                  variant="outlined"
                  onClick={() => handleToggleReason(reason)}
                  sx={{
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    minWidth: "24px",
                    mr: 1,
                    p: 0,
                    borderColor: "#053d16ff",
                    ...(selectedReasons.includes(reason) && {
                      backgroundColor: "#ffebee",
                    }),
                  }}
                >
                  {selectedReasons.includes(reason) && (
                    <CheckCircleIcon
                      sx={{ fontSize: "1rem", color: "#053d16ff" }}
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
                  {index + 1}. {reason}
                </Typography>
              </Grid>
            ))}
          </Grid>
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
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#053d16ff",
                },
                "&:hover fieldset": {
                  borderColor: "#053d16ff",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#053d16ff",
                },
              },
            }}
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

      {/* NEW: Certificate Generation Dialog */}
      <Dialog
        open={certOpen}
        onClose={() => setCertOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            backgroundColor: "#1d5236",
            color: "white",
            textAlign: "center",
            py: 2,
          }}
        >
          Generate CENRO Certificate
        </DialogTitle>
        <DialogContent dividers>
          <CenroCertExport applicant={applicant} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setCertOpen(false)}
            variant="contained"
            sx={{
              backgroundColor: "#70706fff",
              color: "white",
              "&:hover": { backgroundColor: "#acababff" },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CenroApplicantModal;
