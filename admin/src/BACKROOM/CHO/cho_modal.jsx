// cho_modal.jsx
import React, { useState, useEffect, useRef } from "react";
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
  CircularProgress,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import ChoCertExport from "./choCertExport";

const API = import.meta.env.VITE_API_BASE;

// Reusable Field
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

// Format currency
const formatCurrency = (value) => {
  if (!value) return "";
  const num = parseFloat(value.toString().replace(/,/g, ""));
  if (isNaN(num)) return value;
  return num.toLocaleString("en-US");
};

// File viewer with links
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
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Typography>
    )}
  </Grid>
);

// Confirmation Dialog
const ConfirmDialog = ({
  open,
  title,
  onConfirm,
  onCancel,
  confirmColor,
  loading,
}) => (
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
      sx={{ display: "flex", justifyContent: "center", gap: 2, pb: 2 }}
    >
      <Button
        onClick={onConfirm}
        variant="contained"
        color={confirmColor}
        disabled={loading}
        sx={{
          fontWeight: "bold",
          textTransform: "uppercase",
          minWidth: "100px",
        }}
      >
        {loading ? "Processing..." : "Approve"}
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
        }}
      >
        No
      </Button>
    </DialogActions>
  </Dialog>
);

// Success/Decline Status Dialog
const StatusDialog = ({ open, onClose, icon, title, color }) => (
  <Dialog
    open={open}
    onClose={onClose}
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
        color,
      }}
    >
      {icon}
      <Typography variant="h5" fontWeight="bold">
        {title}
      </Typography>
      <Button
        onClick={onClose}
        variant="contained"
        sx={{ backgroundColor: color, "&:hover": { backgroundColor: color } }}
      >
        OK
      </Button>
    </Paper>
  </Dialog>
);

// Accordion Section
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
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
  const [declineConfirmOpen, setDeclineConfirmOpen] = useState(false);
  const [successStatusOpen, setSuccessStatusOpen] = useState(false);
  const [declineStatusOpen, setDeclineStatusOpen] = useState(false);
  const [certificatePreviewOpen, setCertificatePreviewOpen] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const certRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (applicant) setChoFee(applicant.choFee || "");
  }, [applicant]);

  const handleFileSelect = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setSelectedFiles((prev) => ({ ...prev, [name]: files[0] }));
      handleFileChange(name, files[0]);
      setValidationErrors((prev) => ({ ...prev, choCert: false }));
    }
  };

  const handleApproveClick = () => {
    const newErrors = {
      choFee: choFee.trim() === "",
      choCert: !selectedFiles.choCert,
    };
    setValidationErrors(newErrors);
    if (!Object.values(newErrors).some(Boolean)) {
      setApproveConfirmOpen(true);
    }
  };

  const handleApproveConfirm = () => {
    setApproveConfirmOpen(false);
    onApprove(applicant.id, choFee, selectedFiles);
    setLoading(true);
    setSuccessStatusOpen(true);
  };

  const handleDeclineClick = () => {
    setDeclineReason("");
    setSelectedReasons([]);
    setDeclineConfirmOpen(true);
  };

  const handleDeclineConfirm = () => {
    if (declineReason.trim() === "") return;
    setDeclineConfirmOpen(false);
    onDecline(applicant.id, declineReason);
    setDeclineStatusOpen(true);
  };

  const handleToggleReason = (reason) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  const handleAddReasons = () => {
    if (selectedReasons.length > 0) {
      const reasonsText = selectedReasons.join(", ");
      setDeclineReason((prev) =>
        prev ? `${prev}, ${reasonsText}` : reasonsText
      );
    }
  };

  // Generate PDF from preview modal
  const generatePDF = async () => {
    if (generatingPDF || !certRef.current) return;

    setGeneratingPDF(true);

    try {
      void certRef.current.offsetHeight;

      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      if (!imgData || imgData === "data:," || imgData.length < 1000) {
        throw new Error("Failed to generate image");
      }

      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(
        `CHO_Certificate_${applicant.bin || applicant.id || "Unknown"}.pdf`
      );
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert(`PDF generation failed: ${error.message}`);
    } finally {
      setGeneratingPDF(false);
    }
  };

  return (
    <>
      {/* Main Modal - Full Width Applicant Details */}
      <Dialog
        open={isOpen}
        onClose={onClose}
        fullWidth
        maxWidth="lg"
        scroll="paper"
      >
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

        <DialogContent dividers sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {/* Business Information */}
              <Section title="Business Information">
                <Field label="Status" value={applicant.CHO} />
                <Field
                  label="Mode of Payment"
                  value={applicant.Modeofpayment}
                />
                <Field label="BIN" value={applicant.bin} />
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
                  <Field label="Tax Dec. No." value={applicant.taxdec} />
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
                <Field
                  label="Address Line 1"
                  value={applicant.TaxaddressLine1}
                />
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
                            <Field
                              label="Business Nature"
                              value={businessNature}
                            />
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
                <FileField
                  fileKey="cedula"
                  label="Cedula"
                  fileData={applicant}
                />
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
                <Section title="Attachments">
                  <FileField
                    fileKey="choCert"
                    label="CHO Cert"
                    fileData={applicant}
                  />
                </Section>
              )}

              {applicant.CHO !== "Approved" && (
                <>
                  <TextField
                    label="Sanitary Fee"
                    value={formatCurrency(choFee)}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/,/g, "");
                      setChoFee(clean);
                      setValidationErrors((prev) => ({
                        ...prev,
                        choFee: false,
                      }));
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
            </Grid>
          </Grid>
        </DialogContent>

        {/* ---------- ACTION BUTTONS (aligned right, order: Close → Approve → Decline → Generate) ---------- */}
        <DialogActions sx={{ p: 2, justifyContent: "flex-end", gap: 1 }}>
          <Button
            onClick={onClose}
            variant="contained"
            sx={{ bgcolor: "#70706fff", color: "white" }}
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

              <Button
                onClick={handleDeclineClick}
                variant="contained"
                color="error"
              >
                Decline
              </Button>

              <Button
                onClick={() => setCertificatePreviewOpen(true)}
                variant="contained"
                sx={{
                  bgcolor: "#3179d6ff",
                  color: "white",
                  minWidth: "200px",
                  "&:hover": { bgcolor: "#0d42a3ff" },
                }}
              >
                GENERATE CERTIFICATE
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* === Certificate Preview Modal === */}
      <Dialog
        open={certificatePreviewOpen}
        onClose={() => setCertificatePreviewOpen(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogContent dividers sx={{ p: 3, backgroundColor: "#f9f9f9" }}>
          <Box
            ref={certRef}
            sx={{
              width: "100%",
              minHeight: "800px",
              p: 4,
              backgroundColor: "#fff",
              boxShadow: 3,
            }}
          >
            <ChoCertExport applicant={applicant} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
          <Button
            onClick={() => setCertificatePreviewOpen(false)}
            variant="outlined"
            sx={{ color: "#1d5236", borderColor: "#1d5236" }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setCertificatePreviewOpen(false);
              generatePDF();
            }}
            disabled={generatingPDF}
            variant="contained"
            sx={{
              bgcolor: "#1d5236",
              color: "white",
              minWidth: "180px",
              "&:hover": { bgcolor: "#155233" },
            }}
          >
            {generatingPDF ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Generating PDF...
              </>
            ) : (
              "Download PDF"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm & Status Dialogs */}
      <ConfirmDialog
        open={approveConfirmOpen}
        title="Are you sure you want to approve this applicant?"
        onConfirm={handleApproveConfirm}
        loading={loading}
        onCancel={() => setApproveConfirmOpen(false)}
        confirmColor="success"
      />

      <Dialog
        open={declineConfirmOpen}
        onClose={() => setDeclineConfirmOpen(false)}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            backgroundColor: "#053d16ff",
            color: "white",
            mb: 2,
          }}
        >
          Decline Applicant
        </DialogTitle>
        <DialogContent sx={{ pt: 2, px: 3 }}>
          <Grid container spacing={1} sx={{ mb: 2 }}>
            {[
              "Incomplete Requirements",
              "Non-Compliance with Safety and Health Standards",
              "Regulatory or Legal Violations",
              "Environmental and Compliance Concerns",
              "Zoning and Location Issues",
            ].map((reason) => (
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
                  {reason}
                </Typography>
              </Grid>
            ))}
          </Grid>
          <Button
            variant="contained"
            onClick={handleAddReasons}
            disabled={selectedReasons.length === 0}
            sx={{ bgcolor: "#053d16ff", mb: 2 }}
          >
            Add
          </Button>
          <TextField
            autoFocus
            label="Reason for Decline"
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
                "& fieldset": { borderColor: "#053d16ff" },
                "&:hover fieldset": { borderColor: "#053d16ff" },
                "&.Mui-focused fieldset": { borderColor: "#053d16ff" },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeclineConfirmOpen(false)}>Cancel</Button>
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

      <StatusDialog
        open={successStatusOpen}
        onClose={() => {
          setSuccessStatusOpen(false);
          onClose();
        }}
        icon={<CheckCircleIcon sx={{ fontSize: "5rem", color: "#4caf50" }} />}
        title="Successfully Approved!"
        color="#4caf50"
      />
      <StatusDialog
        open={declineStatusOpen}
        onClose={() => {
          setDeclineStatusOpen(false);
          onClose();
        }}
        icon={<CancelIcon sx={{ fontSize: "5rem", color: "#d32f2f" }} />}
        title="Successfully Declined!"
        color="#d32f2f"
      />
    </>
  );
}

export default ChoApplicantModal;
