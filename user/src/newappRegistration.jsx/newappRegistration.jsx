import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
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
import PrivacyAgreementDialog from "./DataPrivacyModal";
import NextStepConfirmationDialog from "./newAppcomponents/NextStepConfirmationDialog";

const PRIMARY_COLOR = "#09360D";
const HOVER_COLOR = "#072b0b";
const LIGHT_HOVER_COLOR = "rgba(9, 54, 13, 0.08)";

const GreenButton = styled(Button)(({ variant }) => ({
  borderRadius: "8px",
  ...(variant === "contained" && {
    backgroundColor: PRIMARY_COLOR,
    color: "#fff",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    "&:hover": {
      backgroundColor: HOVER_COLOR,
    },
  }),
  ...(variant === "outlined" && {
    borderColor: PRIMARY_COLOR,
    color: PRIMARY_COLOR,
    "&:hover": {
      backgroundColor: LIGHT_HOVER_COLOR,
      borderColor: PRIMARY_COLOR,
    },
  }),
}));

const BackButtonContained = styled(Button)({
  borderRadius: "8px",
  backgroundColor: PRIMARY_COLOR, 
  color: "#fff",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    backgroundColor: HOVER_COLOR, 
  },
});

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
    email: "",
    telNo: "",
    mobileNo: "+63",
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
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);

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
      2: ["firstName", "lastName", "sex", "email", "mobileNo"],
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

    if (
      step === 2 &&
      formDataState.email &&
      !formDataState.email.endsWith("@gmail.com")
    ) {
      newErrors.email = "Email must end with @gmail.com";
    }

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

  const handleClose = () => {
    setDialogOpen(false);
    window.history.back();
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

  const handlePrivacyCheck = (e) => {
    setPrivacyChecked(e.target.checked);
  };

  const handlePrivacyAgree = () => {
    setPrivacyDialogOpen(false);
    handleSubmit();
  };

  const handleBackButton = () => {
    if (step === 1) {
      navigate('/');
    } else {
      setStep(step - 1);
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
      </Box>

      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, sm: 4 },
          width: "100%",
          maxWidth: isMobile ? 320 : 900,
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
          BUSINESS APPLICATION FORM
        </Typography>

        <Stepper
          activeStep={step - 1}
          alternativeLabel
          sx={{
            mb: 4,
            flexWrap: "wrap",
            justifyContent: "center",
            "& .MuiStepIcon-root": {
              color: PRIMARY_COLOR,
              "&.Mui-active": {
                color: HOVER_COLOR,
              },
              "&.Mui-completed": {
                color: PRIMARY_COLOR,
              },
            },
            "& .MuiStepConnector-line": {
              borderColor: PRIMARY_COLOR,
            },
            "& .MuiStepLabel-label": {
              color: PRIMARY_COLOR,
            }
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
                    color: step - 1 >= index ? PRIMARY_COLOR : "#333",
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
              justifyContent: "space-between",
              mt: 3,
            }}
          >
            {(step === 1 || step > 1) && (
              <BackButtonContained
                type="button"
                variant="contained"
                onClick={handleBackButton}
              >
                {step === 1 ? "Back" : "Back"}
              </BackButtonContained>
            )}

            <Box>
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
          </Box>
        </form>
      </Paper>

      <NextStepConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleDialogConfirm}
        formData={formDataState}
        step={step}
      />

      <NextStepConfirmationDialog
        open={submitDialogOpen}
        onClose={() => setSubmitDialogOpen(false)}
        onConfirm={() => {
          setSubmitDialogOpen(false);
          setPrivacyDialogOpen(true);
        }}
        formData={formDataState}
        step={step}
        isSubmit={true}
      />

      <PrivacyAgreementDialog
        open={privacyDialogOpen}
        onAgree={handlePrivacyAgree}
        onCheck={handlePrivacyCheck}
        checked={privacyChecked}
        onClose={handleClose}
      />

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
            <CheckCircleOutlineIcon sx={{ fontSize: 80, color: PRIMARY_COLOR }} />
          </Grow>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#040504ff" }}
          >
            Submitted Successfully!
            <br />
            Please Check your Email for the next steps.
            <br />
            Check your Spam/Junk folder just in case.
          </Typography>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbarState.open}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarState.severity}
          sx={{
            backgroundColor:
              snackbarState.severity === "success" ? PRIMARY_COLOR : "#d32f2f",
          }}
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default NewApplicationRegisterPage;