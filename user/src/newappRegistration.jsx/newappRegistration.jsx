import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Grow,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { styled } from "@mui/system";
import axios from "axios";
import { forwardRef, useEffect, useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";
import Step1BusinessInfo from "./newAppcomponents/step1";
import Step2PersonalInfo from "./newAppcomponents/step2";
import { useMediaQuery, useTheme } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";

const GreenButton = styled(Button)(({ variant }) => ({
  borderRadius: "8px",
  ...(variant === "contained" && {
    backgroundColor: "#4caf50",
    color: "#fff",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    "&:hover": {
      backgroundColor: "#388e3c",
    },
  }),
  ...(variant === "outlined" && {
    borderColor: "#4caf50",
    color: "#4caf50",
    "&:hover": {
      backgroundColor: "rgba(76, 175, 80, 0.08)",
      borderColor: "#4caf50",
    },
  }),
}));

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function NewApplicationRegisterPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API = import.meta.env.VITE_API_BASE;
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [formDataState, setFormDataState] = useState({
    BusinessType: "",
    dscRegNo: "",
    businessName: "",
    tinNo: "",
    TradeName: "",
    firstName: "",
    middleName: "",
    lastName: "",
    extName: "",
    sex: "",
    email: "", // Default value set to @gmail.com
    telNo: "",
    mobileNo: "+63", // Default value set to +63
  });

  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const steps = ["Business Info", "Owner Info"];

  const validateTIN = (tin) => {
    const tinRegex = /^(?:\d{3}-\d{3}-\d{3}|\d{3}-\d{3}-\d{3}-\d{2,3})$/;
    return (
      tinRegex.test(tin) &&
      tin.replace(/-/g, "").length >= 9 &&
      tin.replace(/-/g, "").length <= 12
    );
  };

  const validateStep = () => {
    const newErrors = {};

    const requiredFields = {
      1: ["BusinessType", "businessName", "tinNo", "TradeName"],
      2: ["firstName", "lastName", "sex", "email", "mobileNo"], // extName and telNo are optional
    };

    requiredFields[step]?.forEach((field) => {
      if (!formDataState[field]) {
        newErrors[field] = "Please fill out this field";
      }
    });

    if (
      step === 1 &&
      formDataState.tinNo &&
      !validateTIN(formDataState.tinNo)
    ) {
      newErrors.tinNo =
        "TIN must be in format XXX-XXX-XXX or XXX-XXX-XXX-XX (9-12 digits)";
    }

    // Additional validation for minimum 3 letters in TradeName and businessName
    const letterCountBusinessName = (
      formDataState.businessName.replace(/[^A-Za-z]/g, "") || ""
    ).length;
    if (
      step === 1 &&
      formDataState.businessName &&
      letterCountBusinessName < 3
    ) {
      newErrors.businessName = "Minimum of 3 letters required";
    }

    const letterCountTradeName = (
      formDataState.TradeName.replace(/[^A-Za-z]/g, "") || ""
    ).length;
    if (step === 1 && formDataState.TradeName && letterCountTradeName < 3) {
      newErrors.TradeName = "Minimum of 3 letters required";
    }

    // Validation for Step 2
    const letterCountFirstName = (
      formDataState.firstName.replace(/[^A-Za-z]/g, "") || ""
    ).length;
    if (step === 2 && formDataState.firstName && letterCountFirstName < 3) {
      newErrors.firstName = "Minimum of 3 letters required";
    }

    const letterCountMiddleName = (
      formDataState.middleName.replace(/[^A-Za-z]/g, "") || ""
    ).length;
    if (step === 2 && formDataState.middleName && letterCountMiddleName < 3) {
      newErrors.middleName = "Minimum of 3 letters required";
    }

    const letterCountLastName = (
      formDataState.lastName.replace(/[^A-Za-z]/g, "") || ""
    ).length;
    if (step === 2 && formDataState.lastName && letterCountLastName < 3) {
      newErrors.lastName = "Minimum of 3 letters required";
    }

    // Email validation: must end with @gmail.com
    if (
      step === 2 &&
      formDataState.email &&
      !formDataState.email.endsWith("@gmail.com")
    ) {
      newErrors.email = "Email must end with @gmail.com";
    }

    // Mobile number validation: must start with +63
    if (
      step === 2 &&
      formDataState.mobileNo &&
      !formDataState.mobileNo.startsWith("+63")
    ) {
      newErrors.mobileNo = "Mobile number must start with +63";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSnackbarClose = () => {
    setSnackbarState({ ...snackbarState, open: false });
  };

  const handleNextClick = () => {
    if (validateStep()) {
      setDialogOpen(true);
    } else {
      setSnackbarState({
        open: true,
        message: "Please fill in all required fields correctly",
        severity: "error",
      });
    }
  };

  const handleDialogConfirm = () => {
    setStep(step + 1);
    setDialogOpen(false);
    setSnackbarState({
      open: true,
      message: "Data saved successfully!",
      severity: "success",
    });
  };

  const handleSubmit = async () => {
    console.log("Submitting formDataState:", formDataState);
    if (!validateStep()) {
      setSnackbarState({
        open: true,
        message: "Please complete all required fields",
        severity: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(`${API}/userAccounts/register`, formDataState, {
        headers: { "Content-Type": "application/json" },
      });

      localStorage.removeItem("formDataState");
      localStorage.removeItem("filesState");
      localStorage.removeItem("businessLines");
      localStorage.removeItem("formStep");

      setSuccessDialogOpen(true);
      setTimeout(() => navigate(`/`), 2000);
    } catch (err) {
      console.error(err);
      setSnackbarState({
        open: true,
        message: "Submission failed. Please try again.",
        severity: "error",
      });
      setIsSubmitting(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 1:
        return (
          <Step1BusinessInfo
            formData={formDataState}
            handleChange={handleChange}
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 2:
        return (
          <Step2PersonalInfo
            formData={formDataState}
            handleChange={handleChange}
            errors={errors}
            setErrors={setErrors}
          />
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
        py: { xs: 2, sm: 4 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: isMobile ? 320 : 900,
          mx: "auto",
          mb: 2,
        }}
      >
        <IconButton
          onClick={() => navigate(`/`)}
          sx={{
            color: "#fff",
            backgroundColor: "#4caf50",
            borderRadius: "50%", // circle
            p: 1.5,
            boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#388e3c",
              transform: "scale(1.1)", // smooth pop effect
              boxShadow: "0 5px 12px rgba(0,0,0,0.25)",
            },
          }}
        >
          <ArrowBackIcon fontSize="medium" />
        </IconButton>
      </Box>

      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, sm: 4 },
          width: "100%",
          maxWidth: isMobile ? 320 : 900, // ✅ Responsive maxWidth
          mx: "auto",
          borderRadius: "16px",
        }}
      >
        <Typography
          variant="h6"
          align="center"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#333",
            mt: 2,
          }}
        >
          Business Application Form
        </Typography>

        <Stepper
          activeStep={step - 1}
          alternativeLabel
          sx={{
            mb: 4,
            flexWrap: "wrap",
            justifyContent: "center",
            "& .MuiStepIcon-root": {
              color: "#4caf50",
              "&.Mui-active": {
                color: "#388e3c",
              },
              "&.Mui-completed": {
                color: "#4caf50",
              },
            },
            "& .MuiStepConnector-line": {
              borderColor: "#4caf50",
            },
          }}
        >
          {steps.map((label, index) => (
            <Step key={label} completed={step - 1 > index}>
              <StepLabel
                StepIconProps={{ sx: { fontSize: 32 } }}
                sx={{
                  "& .MuiStepLabel-label": {
                    fontSize: { xs: "0.6rem", sm: "0.75rem", md: "0.9rem" },
                    textAlign: "center",
                    color: step - 1 >= index ? "#4caf50" : "#333",
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <form style={{ width: "100%" }}>
          {renderStepContent(step)}

          <Box
            sx={{
              display: "flex",
              justifyContent: step === 1 ? "flex-end" : "space-between",
              mt: 3,
            }}
          >
            {step > 1 && (
              <GreenButton
                type="button"
                variant="outlined"
                onClick={() => setStep(step - 1)}
              >
                Back
              </GreenButton>
            )}
            {step < 2 && (
              <GreenButton
                type="button"
                variant="contained"
                onClick={handleNextClick}
              >
                Next
              </GreenButton>
            )}
            {step === 2 && (
              <GreenButton
                type="button"
                variant="contained"
                disabled={isSubmitting}
                onClick={() => setSubmitDialogOpen(true)}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                {isSubmitting ? (
                  <>
                    <CircularProgress size={20} color="inherit" />
                    Processing...
                  </>
                ) : (
                  "Submit Form"
                )}
              </GreenButton>
            )}
          </Box>
        </form>
      </Paper>

      {/* Next Step Confirmation */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm Next Step</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to proceed to the next step? <br />
            {step === 1 ? (
              <>
                <strong>Business Type:</strong>{" "}
                {formDataState.BusinessType || "Not specified"}
                <br />
                <strong>Registration No:</strong>{" "}
                {formDataState.dscRegNo || "Not specified"}
                <br />
                <strong>Business Name:</strong>{" "}
                {formDataState.businessName || "Not specified"}
                <br />
                <strong>TIN No:</strong>{" "}
                {formDataState.tinNo || "Not specified"}
                <br />
                <strong>Trade Name:</strong>{" "}
                {formDataState.TradeName || "Not specified"}
              </>
            ) : (
              <>
                <strong>First Name:</strong>{" "}
                {formDataState.firstName || "Not specified"}
                <br />
                <strong>Middle Name:</strong>{" "}
                {formDataState.middleName || "Not specified"}
                <br />
                <strong>Last Name:</strong>{" "}
                {formDataState.lastName || "Not specified"}
                <br />
                <strong>Ext. Name:</strong>{" "}
                {formDataState.extName || "Not specified"}
                <br />
                <strong>Gender:</strong> {formDataState.sex || "Not specified"}
                <br />
                <strong>Email:</strong> {formDataState.email || "Not specified"}
                <br />
                <strong>Telephone No:</strong>{" "}
                {formDataState.telNo || "Not specified"}
                <br />
                <strong>Mobile No:</strong>{" "}
                {formDataState.mobileNo || "Not specified"}
              </>
            )}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2, p: 2 }}>
          <GreenButton
            variant="outlined"
            onClick={() => setDialogOpen(false)}
            sx={{ minWidth: "90px" }}
          >
            No
          </GreenButton>
          <GreenButton
            variant="contained"
            onClick={handleDialogConfirm}
            sx={{ minWidth: "120px" }}
          >
            Yes
          </GreenButton>
        </DialogActions>
      </Dialog>

      {/* Submit Confirmation */}
      <Dialog
        open={submitDialogOpen}
        onClose={() => setSubmitDialogOpen(false)}
      >
        <DialogTitle>Submit Application</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to submit? <br />
            <strong>Business Type:</strong>{" "}
            {formDataState.BusinessType || "Not specified"}
            <br />
            <strong>Registration No:</strong>{" "}
            {formDataState.dscRegNo || "Not specified"}
            <br />
            <strong>Business Name:</strong>{" "}
            {formDataState.businessName || "Not specified"}
            <br />
            <strong>TIN No:</strong> {formDataState.tinNo || "Not specified"}
            <br />
            <strong>Trade Name:</strong>{" "}
            {formDataState.TradeName || "Not specified"}
            <br />
            <strong>First Name:</strong>{" "}
            {formDataState.firstName || "Not specified"}
            <br />
            <strong>Middle Name:</strong>{" "}
            {formDataState.middleName || "Not specified"}
            <br />
            <strong>Last Name:</strong>{" "}
            {formDataState.lastName || "Not specified"}
            <br />
            <strong>Ext. Name:</strong>{" "}
            {formDataState.extName || "Not specified"}
            <br />
            <strong>Gender:</strong> {formDataState.sex || "Not specified"}
            <br />
            <strong>Email:</strong> {formDataState.email || "Not specified"}
            <br />
            <strong>Telephone No:</strong>{" "}
            {formDataState.telNo || "Not specified"}
            <br />
            <strong>Mobile No:</strong>{" "}
            {formDataState.mobileNo || "Not specified"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <GreenButton
            variant="outlined"
            onClick={() => setSubmitDialogOpen(false)}
          >
            No
          </GreenButton>
          <GreenButton
            variant="contained"
            onClick={() => {
              setSubmitDialogOpen(false);
              handleSubmit();
            }}
          >
            Yes
          </GreenButton>
        </DialogActions>
      </Dialog>

      {/* ✅ Success Popup */}
      <Dialog
        open={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            textAlign: "center",
            p: 3,
          },
        }}
      >
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Grow in={successDialogOpen}>
            <CheckCircleOutlineIcon sx={{ fontSize: 80, color: "#105c12ff" }} />
          </Grow>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#040504ff" }}
          >
            Submitted Successfully!
          </Typography>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbarState.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarState.severity}
          sx={{
            backgroundColor:
              snackbarState.severity === "success" ? "#4caf50" : "#d32f2f",
          }}
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default NewApplicationRegisterPage;
