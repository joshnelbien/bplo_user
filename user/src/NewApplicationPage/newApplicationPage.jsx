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
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { styled } from "@mui/system";
import axios from "axios";
import { forwardRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Assuming these components are available in your project structure
import Step1BusinessInfo from "../components/BusinessForm/Step1";
import Step2PersonalInfo from "../components/BusinessForm/Step2";
import Step3AddressInfo from "../components/BusinessForm/Step3";
import Step4TaxInfo from "../components/BusinessForm/Step4";
import Step5BusinessDetails from "../components/BusinessForm/Step5";
import Step6BusinessActivity from "../components/BusinessForm/Step6";
import Section7FileUploads from "../components/BusinessForm/Step7";

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
  const API = import.meta.env.VITE_API_BASE;
  const [step, setStep] = useState(1);
  const [businessLines, setBusinessLines] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formDataState, setFormDataState] = useState({
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
    numVehicleVan: "",
    numVehicleTruck: "",
    numVehicleMotor: "",
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
  });

  const [filesState, setFilesState] = useState({
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
  });

  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const steps = [
    "Business Info",
    "Owner Info",
    "Business Address",
    "Tax Payer's Address",
    "Business Operation",
    "Business Activities",
    "Business Requirements",
  ];

  const validateTIN = (tin) => {
    const tinRegex = /^9[0-9]{2}-[0-9]{2}-[0-9]{4}$/;
    return tinRegex.test(tin);
  };

  const validateStep = () => {
    const newErrors = {};

    // Required fields for each step
    const requiredFields = {
      1: ["BusinessType", "businessName", "tinNo", "TradeName"],
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
      // 6: ['lineOfBusiness', 'productService', 'Units', 'capital'],
      7: ["proofOfReg", "brgyClearance", "cedula"],
    };

    // Validate required fields for current step
    requiredFields[step]?.forEach((field) => {
      if (step === 7) {
        if (!filesState[field]) {
          newErrors[field] = "This field is required";
        }
        if (step === 6 && businessLines.length === 0) {
          newErrors.businessLines =
            "At least one line of business is required.";
        }
      } else {
        if (!formDataState[field]) {
          newErrors[field] = "This field is required";
        }
      }
    });
    if (step === 6 && businessLines.length === 0) {
      newErrors.businessLines = "At least one line of business is required.";
    }

    // Validate TIN format
    if (
      step === 1 &&
      formDataState.tinNo &&
      !validateTIN(formDataState.tinNo)
    ) {
      newErrors.tinNo = "TIN must be in format NNN-NN-NNNN starting with 9";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Format TIN as user types
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
    setFilesState((prev) => ({ ...prev, [name]: files[0] }));
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

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateStep()) {
    setSnackbarState({
      open: true,
      message: "Please complete all required fields",
      severity: "error",
    });
    return;
  }

  setIsSubmitting(true); // Disable button & show processing text

  const formData = new FormData();

  if (businessLines.length > 0) {
    formData.append(
      "lineOfBusiness",
      businessLines.map((b) => b.lineOfBusiness).join(",")
    );
    formData.append(
      "productService",
      businessLines.map((b) => b.productService).join(",")
    );
    formData.append("Units", businessLines.map((b) => b.Units).join(","));
    formData.append("capital", businessLines.map((b) => b.capital).join(","));
  }

  Object.keys(formDataState).forEach((key) => {
    if (formDataState[key]) formData.append(key, formDataState[key]);
  });

  Object.keys(filesState).forEach((key) => {
    if (filesState[key]) formData.append(key, filesState[key]);
  });

  try {
    await axios.post(`${API}/api/files`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setSnackbarState({
      open: true,
      message: "Application submitted successfully!",
      severity: "success",
    });
    setTimeout(() => {
      navigate(`/homePage/${id}`);
    }, 2000);
  } catch (err) {
    console.error(err);
    setSnackbarState({
      open: true,
      message: "Submission failed. Please try again.",
      severity: "error",
    });
    setIsSubmitting(false); // Re-enable if error
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
            errors={errors}
          />
        );
      case 5:
        return (
          <Step5BusinessDetails
            formData={formDataState}
            handleChange={handleChange}
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
        py: { xs: 2, sm: 4 },
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 900, mx: "auto", mb: 2 }}>
        <GreenButton
          onClick={() => navigate(`/homePage/${id}`)}
          variant="contained"
        >
          BACK
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

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
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
            {step < 7 && (
              <GreenButton
                type="button"
                variant="contained"
                onClick={handleNextClick}
              >
                Next
              </GreenButton>
            )}
            {step === 7 && (
  <GreenButton
    type="submit"
    variant="contained"
    disabled={isSubmitting}
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm Navigation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to proceed to the next step?
          </Typography>
        </DialogContent>
        <DialogActions>
          <GreenButton variant="outlined" onClick={() => setDialogOpen(false)}>
            Cancel
          </GreenButton>
          <GreenButton variant="contained" onClick={handleDialogConfirm}>
            Confirm
          </GreenButton>
        </DialogActions>
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

export default NewApplicationPage;
