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
import { forwardRef, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HomeIcon from "@mui/icons-material/Home";
import { useMediaQuery, useTheme } from "@mui/material";
import Step1BusinessInfo from "../components/BusinessForm/Step1";
import Step2PersonalInfo from "../components/BusinessForm/Step2";
import Step3AddressInfo from "../components/BusinessForm/Step3";
import Step4TaxInfo from "../components/BusinessForm/Step4";
import Step5BusinessDetails from "../components/BusinessForm/Step5";
import Step6BusinessActivity from "../components/BusinessForm/Step6";
import Section7FileUploads from "../components/BusinessForm/Step7";
import NewAppConfirmation from "./newAppConfirmation"; // NEW IMPORT

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

function NewApplicationPage() {
  const { id } = useParams();
  const API = import.meta.env.VITE_API_BASE;
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isExtraSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const savedFormData =
    JSON.parse(localStorage.getItem("formDataState")) || null;
  const savedFiles = JSON.parse(localStorage.getItem("filesState")) || null;
  const savedBusinessLines =
    JSON.parse(localStorage.getItem("businessLines")) || [];
  const savedStep = parseInt(localStorage.getItem("formStep")) || 1;

  // --- START CONSOLIDATED STATE DEFINITIONS ---
  const [step, setStep] = useState(savedStep);
  const [businessLines, setBusinessLines] = useState(savedBusinessLines);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const paperRef = useRef(null);

  const [formDataState, setFormDataState] = useState(
    savedFormData || {
      userId: id,
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
      region: "",
      province: "",
      cityOrMunicipality: "",
      barangay: "",
      addressLine1: "",
      zipCode: "",
      pinAddress: "",
      totalFloorArea: "",
      numberOfEmployee: "",
      maleEmployee: "",
      femaleEmployee: "",
      numNozzle: "",
      weighScale: "",
      Taxregion: "",
      Taxprovince: "",
      TaxcityOrMunicipality: "",
      Taxbarangay: "",
      TaxaddressLine1: "",
      TaxzipCode: "",
      TaxpinAddress: "",
      ownPlace: "",
      taxdec: "",
      lessorName: "",
      monthlyRent: "",
      tIGE: "",
      officeType: "",
      officeTypeOther: "",
      lineOfBusiness: "",
      productService: "",
      Units: "",
      capital: "",
      totalCapital: "",
      totalDeliveryVehicle: "",
      Modeofpayment: "",
      application: "New",
    }
  );

  const [filesState, setFilesState] = useState(
    savedFiles || {
      proofOfReg: null,
      proofOfRightToUseLoc: null,
      locationPlan: null,
      brgyClearance: null,
      marketClearance: null,
      occupancyPermit: null,
      cedula: null,
      photoOfBusinessEstInt: null,
      photoOfBusinessEstExt: null,
      tIGEfiles: null,
    }
  );

  // THESE STATES WERE MOVED UP TO FIX THE REFERNCE ERROR
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errors, setErrors] = useState({});
  // --- END CONSOLIDATED STATE DEFINITIONS ---

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  // Scroll to top when step changes (Now safe to use successDialogOpen)
  useEffect(() => {
    // Only scroll the Paper component if we are not on the success screen
    if (paperRef.current && !successDialogOpen) {
      paperRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (!successDialogOpen) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [step, successDialogOpen]); // Added successDialogOpen to dependencies

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${API}/newApplication/${id}`);
        const userData = res.data;

        setFormDataState((prev) => ({
          ...prev,
          // Step 1
          BusinessType: userData.business_type || prev.BusinessType,
          dscRegNo: userData.dsc_reg_no || prev.dscRegNo,
          businessName: userData.business_name || prev.businessName,
          tinNo: userData.tin_no || prev.tinNo,
          TradeName: userData.trade_name || prev.TradeName,

          // Step 2
          firstName: userData.firstName || prev.firstName,
          middleName: userData.middleName || prev.middleName,
          lastName: userData.lastName || prev.lastName,
          extName: userData.extName || prev.extName,
          sex: userData.sex || prev.sex,
          eMailAdd: userData.email || prev.eMailAdd,
          telNo: userData.tel || prev.telNo,
          mobileNo: userData.mobile || prev.mobileNo,
        }));
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };

    fetchUserData();
  }, [id, API]);

  const steps = [
    "Business Info",
    "Owner Info",
    "Business Address",
    "Tax Payer's Address",
    "Business Operation",
    "Business Activities",
    "Business Requirements",
  ];

  useEffect(() => {
    localStorage.setItem("formDataState", JSON.stringify(formDataState));
  }, [formDataState]);

  useEffect(() => {
    localStorage.setItem("filesState", JSON.stringify(filesState));
  }, [filesState]);

  useEffect(() => {
    localStorage.setItem("businessLines", JSON.stringify(businessLines));
  }, [businessLines]);

  useEffect(() => {
    localStorage.setItem("formStep", step);
  }, [step]);

  const validateStep = () => {
    const newErrors = {};
    const requiredFields = {
      1: ["BusinessType", "businessName", "tinNo"],
      2: ["firstName", "lastName", "sex", "eMailAdd", "mobileNo"],
      3: [
        "region",
        "province",
        "cityOrMunicipality",
        "barangay",
        "addressLine1",
        "zipCode",
      ],
      4: [
        "Taxregion",
        "Taxprovince",
        "TaxcityOrMunicipality",
        "Taxbarangay",
        "TaxaddressLine1",
        "TaxzipCode",
      ],
      5: [
        "totalFloorArea",
        "numberOfEmployee",
        "maleEmployee",
        "femaleEmployee",
      ],
    };

    requiredFields[step]?.forEach((field) => {
      if (step === 7) {
        if (!filesState[field]) {
          newErrors[field] = "Please fill out this field";
        }
      } else {
        if (!formDataState[field]) {
          newErrors[field] = "Please fill out this field";
        }
      }
    });

    if (step === 6 && businessLines.length === 0) {
      newErrors.businessLines = "At least one line of business is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "tinNo") {
      let formattedValue = value.replace(/[^0-9]/g, "");
      if (formattedValue.length > 0 && formattedValue[0] !== "9") {
        formattedValue = "9" + formattedValue.slice(1);
      }
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
        [name]: formattedValue.slice(0, 11),
      }));
    } else {
      setFormDataState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (!file) return;

    // Allowed file types
    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/webp",
    ];

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      alert(
        "Invalid file type. Only PDF, PNG, JPG, JPEG, and WEBP are allowed."
      );
      e.target.value = ""; // Reset input
      return;
    }

    setFilesState((prev) => ({ ...prev, [name]: file }));
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

    if (businessLines.length > 0) {
      // Wrap each lineOfBusiness in quotes
      const wrappedLOB = businessLines.map((b) => `"${b.lineOfBusiness}"`);
      formData.append("lineOfBusiness", wrappedLOB.join(","));

      formData.append(
        "productService",
        businessLines.map((b) => `"${b.productService}"`).join(",")
      );
      formData.append(
        "Units",
        businessLines.map((b) => `"${b.Units}"`).join(",")
      );
      formData.append(
        "capital",
        businessLines.map((b) => `"${b.capital}"`).join(",")
      );
    }

    Object.keys(formDataState).forEach((key) => {
      if (formDataState[key]) formData.append(key, formDataState[key]);
    });

    Object.keys(filesState).forEach((key) => {
      if (filesState[key]) formData.append(key, filesState[key]);
    });

    try {
      await axios.post(`${API}/newApplication/files`, formData, {
        id,
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.removeItem("formDataState");
      localStorage.removeItem("filesState");
      localStorage.removeItem("businessLines");
      localStorage.removeItem("formStep");

      setSuccessDialogOpen(true);

      // Scroll to top on success
      if (paperRef.current) {
        paperRef.current.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }

      setTimeout(() => {
        navigate(`/appTracker/${id}`);
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
      case 3:
        return (
          <Step3AddressInfo
            handleFileChange={handleFileChange}
            formData={formDataState}
            handleChange={handleChange}
            errors={errors}
          />
        );
      case 4:
        return (
          <Step4TaxInfo
            formData={formDataState}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            errors={errors}
          />
        );
      case 5:
        return (
          <Step5BusinessDetails
            formData={formDataState}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
            errors={errors}
          />
        );
      case 6:
        return (
          <>
            <Step6BusinessActivity
              formData={formDataState}
              handleChange={handleChange}
              handleFileChange={handleFileChange}
              businessLines={businessLines}
              setBusinessLines={setBusinessLines}
              errors={errors}
            />
            {errors.businessLines && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {errors.businessLines}
              </Typography>
            )}
          </>
        );
      case 7:
        return (
          <Section7FileUploads
            handleFileChange={handleFileChange}
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
      }}
    >
      {/* AppBar-like Header */}
      <Box
        sx={{
          backgroundColor: "#1d5236",
          py: { xs: 1, sm: 2 },
          boxShadow: 3,
          width: "100%",
          position: "sticky",
          top: 0,
          zIndex: theme.zIndex.appBar,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: "bold",
            color: "#ffffff",
            fontSize: { xs: "1.5rem", sm: "2.2rem" },
            mt: 0,
            mb: 0,
          }}
        >
          BUSINESS APPLICATION FORM
        </Typography>
      </Box>

      {/* Main Content Box with Padding for AppBar */}
      <Box sx={{ pt: { xs: 2, sm: 4 }, flexGrow: 1 }}>
        <Box
          sx={{
            width: "100%",
            maxWidth: isExtraSmall ? "90%" : 900,
            mx: "auto",
            px: isExtraSmall ? 1 : 0,
            mb: 2,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <GreenButton
            onClick={() => navigate(`/homePage/${id}`)}
            variant="contained"
            sx={{
              backgroundColor: "#1d5236",
              "&:hover": {
                backgroundColor: "#072b0b",
              },
              minWidth: { xs: 40, sm: 44 },
              width: { xs: 40, sm: 44 },
              height: { xs: 40, sm: 44 },
              p: 0,
              borderRadius: "50%",
            }}
          >
            <HomeIcon sx={{ fontSize: { xs: 24, sm: 28 }, color: "#fff" }} />
          </GreenButton>
        </Box>

        <Paper
          elevation={6}
          ref={paperRef}
          sx={{
            p: { xs: 2, sm: 4 },
            width: "100%",
            maxWidth: isExtraSmall ? "90%" : 900,
            mx: "auto",
            borderRadius: "16px",
            mb: 4,
          }}
        >
          <Stepper
            activeStep={step - 1}
            orientation={isMobile ? "vertical" : "horizontal"}
            alternativeLabel={!isMobile}
            connector={isMobile ? null : null}
            sx={{
              mb: 2,
              ...(!isMobile && {
                flexWrap: "nowrap",
                justifyContent: "space-between",
                "& .MuiStep-root": {
                  p: 0,
                  minWidth: "auto",
                  flex: "1 1 auto",
                },
              }),
              ...(isMobile && {
                "& .MuiStep-root": {
                  padding: "8px 0",
                },
                "& .MuiStepLabel-root": {
                  textAlign: "left",
                },
              }),

              "& .MuiStepIcon-root": {
                fontSize: { xs: "1rem", sm: "1.5rem" },
                color: "gray",
                "&.Mui-active": { color: "#1d5236" },
                "&.Mui-completed": { color: "#1d5236" },
                "& .MuiStepIcon-text": {
                  fill: "#ffffff",
                },
              },
              "& .MuiStepLabel-label": {
                fontSize: { xs: "0.75rem", sm: "0.75rem" },
                marginTop: 1,
                textAlign: isMobile ? "left" : "center",
                color: "gray",
                display: "block",
              },
            }}
          >
            {steps.map((label, index) => (
              <Step key={label} completed={step - 1 > index}>
                <StepLabel
                  sx={{
                    display: "flex",
                    flexDirection: isMobile ? "row" : "column",
                    alignItems: isMobile ? "center" : "center",
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
                  variant="contained"
                  onClick={() => setStep(step - 1)}
                  sx={{
                    backgroundColor: "#70706fff",
                    "&:hover": {
                      backgroundColor: "#acababff",
                    },
                  }}
                >
                  Back
                </GreenButton>
              )}
              {step < 7 && (
                <GreenButton
                  type="button"
                  variant="contained"
                  onClick={handleNextClick}
                  sx={{
                    backgroundColor: "#1d5236",
                    "&:hover": {
                      backgroundColor: "#072b0b",
                    },
                  }}
                >
                  Next
                </GreenButton>
              )}
              {step === 7 && (
                <GreenButton
                  type="button"
                  variant="contained"
                  disabled={isSubmitting}
                  onClick={() => setSubmitDialogOpen(true)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    backgroundColor: "#1d5236",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#072b0b",
                    },
                  }}
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
      </Box>

      {/* RENDER NEW CONFIRMATION COMPONENT */}
      <NewAppConfirmation
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        handleDialogConfirm={handleDialogConfirm}
        submitDialogOpen={submitDialogOpen}
        setSubmitDialogOpen={setSubmitDialogOpen}
        successDialogOpen={successDialogOpen}
        setSuccessDialogOpen={setSuccessDialogOpen}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
      />
      {/* END NEW CONFIRMATION COMPONENT */}

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

export default NewApplicationPage;
