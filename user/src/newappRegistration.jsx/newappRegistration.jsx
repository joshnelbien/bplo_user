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
  const navigate = useNavigate();

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
    eMailAdd: "",
    telNo: "",
    mobileNo: "",
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
    const tinRegex = /^9[0-9]{2}-[0-9]{2}-[0-9]{4}$/;
    return tinRegex.test(tin);
  };

  const validateStep = () => {
    const newErrors = {};
    const requiredFields = {
      1: ["BusinessType", "businessName", "tinNo", "TradeName"],
      2: ["firstName", "lastName", "sex", "eMailAdd", "mobileNo"],
    };

    requiredFields[step]?.forEach((field) => {
      if (!formDataState[field]) {
        newErrors[field] = "Please fill out this field";
      }
    });

    // ✅ Align regex with formatter (drop "15")
    if (
      step === 1 &&
      formDataState.tinNo &&
      !/^9[0-9]{2}-[0-9]{2}-[0-9]{4}$/.test(formDataState.tinNo)
    ) {
      newErrors.tinNo = "TIN must be in format 9NN-NN-NNNN";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tinNo") {
      let formattedValue = value.replace(/[^0-9]/g, "");
      if (formattedValue.length > 3) {
        formattedValue =
          formattedValue.slice(0, 3) + "-" + formattedValue.slice(3);
      }
      if (formattedValue.length > 6) {
        formattedValue =
          formattedValue.slice(0, 6) + "-" + formattedValue.slice(6);
      }
      setFormDataState((prev) => ({
        ...prev,
        [name]: formattedValue.slice(0, 11), // keep NNN-NN-NNNN
      }));
    } else {
      setFormDataState((prev) => ({ ...prev, [name]: value }));
    }
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
    if (!validateStep()) {
      setSnackbarState({
        open: true,
        message: "Please complete all required fields",
        severity: "error",
      });
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();

    try {
      await axios.post(`${API}/newApplication/files`, formData, {
        userId,
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.removeItem("formDataState");
      localStorage.removeItem("filesState");
      localStorage.removeItem("businessLines");
      localStorage.removeItem("formStep");

      setSuccessDialogOpen(true);

      setTimeout(() => {
        navigate(`/homePage/me/${userId}`);
      }, 2000);
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
          />
        );
      case 2:
        return (
          <Step2PersonalInfo
            formData={formDataState}
            handleChange={handleChange}
            errors={errors}
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
      <Box sx={{ width: "100%", maxWidth: 900, mx: "auto", mb: 2 }}>
        <GreenButton onClick={() => navigate(`/`)} variant="contained">
          BACK TO DASHBOARD
        </GreenButton>
      </Box>

      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, sm: 4 },
          width: "100%",
          maxWidth: 900,
          mx: "auto",
          borderRadius: "16px",
        }}
      >
        <Typography
          variant="h4"
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
        <DialogTitle></DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to proceed to the next step?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2, p: 2 }}>
          <GreenButton
            variant="outlined"
            onClick={() => setDialogOpen(false)}
            sx={{ minWidth: "90px" }}
          >
            Cancel
          </GreenButton>
          <GreenButton
            variant="contained"
            onClick={handleDialogConfirm}
            sx={{ minWidth: "120px" }}
          >
            Confirm
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
          <Typography>Are you sure you want to submit?</Typography>
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
            <CheckCircleOutlineIcon sx={{ fontSize: 80, color: "#4caf50" }} />
          </Grow>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#4caf50" }}
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
