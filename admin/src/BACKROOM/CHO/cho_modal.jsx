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
  Fade,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { styled } from "@mui/system";

const API = import.meta.env.VITE_API_BASE;

// A reusable component for displaying a read-only text field with custom styles.
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

// A reusable component for displaying a read-only text field for a file, with view/download links.
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
            href={`${API}/newApplication/files/${fileData.id}/${fileKey}`}
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
            href={`${API}/newApplication/files/${fileData.id}/${fileKey}/download`}
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
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [validationErrors, setValidationErrors] = useState({
    choFee: false,
    choCert: false,
  });

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
      setValidationErrors((prev) => ({ ...prev, choCert: false }));
    }
  };

  const handleApproveClick = () => {
    let hasError = false;
    const newErrors = { choFee: false, choCert: false };

    if (choFee.trim() === "") {
      newErrors.choFee = true;
      hasError = true;
    }

    if (!selectedFiles.choCert) {
      newErrors.choCert = true;
      hasError = true;
    }

    setValidationErrors(newErrors);

    if (!hasError) {
      setApproveConfirmOpen(true);
    }
  };

  const handleApproveConfirm = () => {
    setApproveConfirmOpen(false);
    onApprove(applicant.id, choFee, selectedFiles);
    setSuccessStatusOpen(true);
  };

  const handleDeclineClick = () => {
    setDeclineReason("");
    setSelectedReasons([]);
    setDeclineConfirmOpen(true);
  };

  const handleDeclineConfirm = () => {
    if (declineReason.trim() === "") {
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

  const handleToggleReason = (reason) => {
    setSelectedReasons((prevReasons) =>
      prevReasons.includes(reason)
        ? prevReasons.filter((r) => r !== reason)
        : [...prevReasons, reason]
    );
  };

  const handleAddReasons = () => {
    if (selectedReasons.length > 0) {
      const reasonsText = selectedReasons.join(", ");
      setDeclineReason((prevReason) =>
        prevReason ? `${prevReason}, ${reasonsText}` : reasonsText
      );
    }
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
          <Section title="Business Information">
            <Field label="Status" value={applicant.CHO} />
            <Field label="Mode of Payment" value={applicant.Modeofpayment} />
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
          {applicant.CHO === "Approved" && (
            <>
              <Section title={"Attachments"}>
                <FileField
                  fileKey="choCert"
                  label="CHO Cert"
                  fileData={applicant}
                />
              </Section>
            </>
          )}
          {applicant.CHO !== "Approved" && (
            <>
              <TextField
                label="Sanitary Fee"
                value={formatCurrency(choFee)}
                onChange={(e) => {
                  const cleanValue = e.target.value.replace(/,/g, "");
                  setChoFee(cleanValue);
                  setValidationErrors((prev) => ({ ...prev, choFee: false }));
                }}
                fullWidth
                size="small"
                sx={{ mt: 2 }}
                error={validationErrors.choFee}
                helperText={
                  validationErrors.choFee &&
                  "Sanitary Fee is required for approval."
                }
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
                    error={validationErrors.choCert}
                    helperText={
                      validationErrors.choCert &&
                      "A file is required for approval."
                    }
                  />
                </Grid>
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
          {applicant.CHO !== "Approved" && (
            <>
              <Button
                onClick={handleApproveClick}
                variant="contained"
                color="success"
              >
                Approve
              </Button>
            </>
          )}

          <Button
            onClick={handleDeclineClick}
            variant="contained"
            color="error"
          >
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
            backgroundColor: "#053d16ff",
            color: "white",
            marginBottom: "20px",
          }}
        >
          Decline Applicant
        </DialogTitle>
        <DialogContent sx={{ pt: 2, px: 3 }}>
          <Grid container spacing={1} sx={{ mb: 2 }}>
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
                  ...(selectedReasons.includes("Incomplete Requirements") && {
                    backgroundColor: "#ffebee",
                  }),
                }}
              >
                {selectedReasons.includes("Incomplete Requirements") && (
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
                1. Incomplete Requirements
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
                  ...(selectedReasons.includes(
                    "Non-Compliance with Safety and Health Standards"
                  ) && {
                    backgroundColor: "#ffebee",
                  }),
                }}
              >
                {selectedReasons.includes(
                  "Non-Compliance with Safety and Health Standards"
                ) && (
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
                2. Non-Compliance with Safety and Health Standards
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
                  ...(selectedReasons.includes(
                    "Regulatory or Legal Violations"
                  ) && {
                    backgroundColor: "#ffebee",
                  }),
                }}
              >
                {selectedReasons.includes("Regulatory or Legal Violations") && (
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
                3. Regulatory or Legal Violations
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
                  ...(selectedReasons.includes(
                    "Environmental and Compliance Concerns"
                  ) && {
                    backgroundColor: "#ffebee",
                  }),
                }}
              >
                {selectedReasons.includes(
                  "Environmental and Compliance Concerns"
                ) && (
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
                4. Environmental and Compliance Concerns
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
                  ...(selectedReasons.includes(
                    "Zoning and Location Issues"
                  ) && {
                    backgroundColor: "#ffebee",
                  }),
                }}
              >
                {selectedReasons.includes("Zoning and Location Issues") && (
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
                5. Zoning and Location Issues
              </Typography>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            onClick={handleAddReasons}
            disabled={selectedReasons.length === 0}
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
