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
import { useMediaQuery, useTheme } from "@mui/material";
import Step1BusinessInfo from "../RenewApplicationPage/components/BusinessForm/Step1";
import Step2PersonalInfo from "../RenewApplicationPage/components/BusinessForm/Step2";
import Step3AddressInfo from "../RenewApplicationPage/components/BusinessForm/Step3";
import Step4TaxInfo from "../RenewApplicationPage/components/BusinessForm/Step4";
import Step5BusinessDetails from "../RenewApplicationPage/components/BusinessForm/Step5";
import Step6BusinessActivity from "../RenewApplicationPage/components/BusinessForm/Step6";
import Section7FileUploads from "../RenewApplicationPage/components/BusinessForm/Step7";

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

function RenewApplicationPage() {
  const { bin, id } = useParams();

  const API = import.meta.env.VITE_API_BASE;
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const savedFormData =
    JSON.parse(localStorage.getItem("formDataState")) || null;
  const savedFiles = JSON.parse(localStorage.getItem("filesState")) || null;
  const savedBusinessLines =
    JSON.parse(localStorage.getItem("businessLines")) || [];
  const savedStep = parseInt(localStorage.getItem("formStep")) || 1;

  const [step, setStep] = useState(savedStep);
  const [businessLines, setBusinessLines] = useState(savedBusinessLines);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const paperRef = useRef(null); // Ref for the Paper component

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
      application: "Renew",
    }
  );

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  // Scroll to top when step changes
  useEffect(() => {
    if (paperRef.current) {
      paperRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [step]); // Trigger on step change

  useEffect(() => {
    if (!bin) return; // ✅ Prevent API call if bin is not set

    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${API}/businessProfile/${id}/${bin}`);
        const userData = res.data;
        console.log("✅ Fetched user data:", userData);

        // 📝 Populate all form fields by step
        setFormDataState((prev) => ({
          ...prev,

          // 📝 Step 1 - Business Profile
          bin: userData.bin || prev.bin,
          business_type: userData.business_type || prev.business_type,
          dscRegNo: userData.dscRegNo || prev.dscRegNo,
          business_name: userData.business_name || prev.business_name,
          tin_no: userData.tin_no || prev.tin_no,
          trade_name: userData.trade_name || prev.trade_name,
          incharge_first_name:
            userData.incharge_first_name || prev.incharge_first_name,
          incharge_middle_name:
            userData.incharge_middle_name || prev.incharge_middle_name,
          incharge_last_name:
            userData.incharge_last_name || prev.incharge_last_name,
          incharge_extension_name:
            userData.incharge_extension_name || prev.incharge_extension_name,
          incharge_sex: userData.incharge_sex || prev.incharge_sex,
          email_address: userData.email_address || prev.email_address,
          telephone_no: userData.telephone_no || prev.telephone_no,
          cellphone_no: userData.cellphone_no || prev.cellphone_no,

          // 🧭 Step 3 - Business Address
          region: userData.region || prev.region || "",
          province: userData.province || prev.province || "",
          cityOrMunicipality:
            userData.cityOrMunicipality || prev.cityOrMunicipality || "",
          barangay: userData.barangay || prev.barangay || "",
          addressLine1: userData.addressLine1 || prev.addressLine1 || "",
          zipCode: userData.zipCode || prev.zipCode || "",

          // 🏡 Step 4 - Taxpayer Address
          Taxregion: userData.region || prev.region || "",
          Taxprovince: userData.province || prev.province || "",
          TaxcityOrMunicipality:
            userData.cityOrMunicipality || prev.cityOrMunicipality || "",
          Taxbarangay: userData.barangay || prev.barangay || "",
          TaxaddressLine1: userData.addressLine1 || prev.addressLine1 || "",
          TaxzipCode: userData.zipCode || prev.zipCode || "",

          // 📎 Step 4 - Business Documents
          proofOfReg: userData.proofOfReg || prev.proofOfReg || "",
          proofOfRightToUseLoc:
            userData.proofOfRightToUseLoc || prev.proofOfRightToUseLoc || "",
          locationPlan: userData.locationPlan || prev.locationPlan || "",

          // 🟩 Step 5 - Business Details
          totalFloorArea: userData.totalFloorArea || prev.totalFloorArea || "",
          maleEmployee: userData.maleEmployee || prev.maleEmployee || "",
          femaleEmployee: userData.femaleEmployee || prev.femaleEmployee || "",
          numberOfEmployee:
            userData.numberOfEmployee || prev.numberOfEmployee || "",
          totalDeliveryVehicle:
            userData.totalDeliveryVehicle || prev.totalDeliveryVehicle || "",
          numNozzle: userData.numNozzle || prev.numNozzle || "",
          weighScale: userData.weighScale || prev.weighScale || "",

          // 📝 Step 5 - Document Files (auto-display)
          cedula: userData.cedula || prev.cedula || "",
          photoOfBusinessEstInt:
            userData.photoOfBusinessEstInt || prev.photoOfBusinessEstInt || "",
          photoOfBusinessEstExt:
            userData.photoOfBusinessEstExt || prev.photoOfBusinessEstExt || "",

          // 🟦 Step 6 - Business Activity
          tIGE: userData.tIGE || prev.tIGE || "",
          tIGEfiles: userData.tIGEfiles || prev.tIGEfiles || "",
          officeType: userData.officeType || prev.officeType || "",
          officeTypeOther:
            userData.officeTypeOther || prev.officeTypeOther || "",
          totalCapital: userData.totalCapital || prev.totalCapital || 0,
        }));

        // 🟦 Step 6 - Business Lines (array handled separately)
        if (userData.lineOfBusiness) {
          const lobArray = userData.lineOfBusiness.trim().split(",");
          const productArray = userData.productService?.trim().split(",") || [];
          const unitsArray = userData.Units?.trim().split(",") || [];
          const capitalArray = userData.capital?.trim().split(",") || [];

          const combinedBusinessLines = lobArray.map((lob, i) => ({
            lineOfBusiness: lob.trim(),
            productService: productArray[i]?.trim() || "",
            Units: unitsArray[i]?.trim() || "",
            capital: capitalArray[i]?.trim() || "",
          }));

          setBusinessLines(combinedBusinessLines);
          console.log("✅ Combined business lines:", combinedBusinessLines);
        }
      } catch (err) {
        console.error("❌ Failed to fetch business profile:", err);
      }
    };

    fetchUserData();
  }, [bin, API]);

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

  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
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
      1: ["business_type", "business_name", "tin_no", "trade_name"],
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
      // 6: ["lineOfBusiness", "productService", "Units", "capital"],
      //7: ["proofOfReg", "brgyClearance", "cedula"],
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
    setDialogOpen(true);
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

    try {
      // 🧩 Prepare your clean payload for text fields
      const payload = {
        userId: id,
        bin: formDataState.bin,
        firstName: formDataState.incharge_first_name,
        middleName: formDataState.incharge_middle_name,
        lastName: formDataState.incharge_last_name,
        extName: formDataState.incharge_extension_name,
        sex: formDataState.incharge_sex,
        email: formDataState.email_address,
        mobileNo: formDataState.cellphone_no,
        BusinessType: formDataState.business_type,
        dscRegNo: formDataState.dscRegNo,
        businessName: formDataState.business_name,
        tinNo: formDataState.tin_no,
        TradeName: formDataState.trade_name,
        telNo: formDataState.telephone_no,
        region: formDataState.region,
        province: formDataState.province,
        cityOrMunicipality: formDataState.cityOrMunicipality,
        barangay: formDataState.barangay,
        addressLine1: formDataState.addressLine1,
        zipCode: formDataState.zipCode,
        Taxregion: formDataState.Taxregion,
        Taxprovince: formDataState.Taxprovince,
        TaxcityOrMunicipality: formDataState.TaxcityOrMunicipality,
        Taxbarangay: formDataState.Taxbarangay,
        TaxaddressLine1: formDataState.TaxaddressLine1,
        TaxzipCode: formDataState.TaxzipCode,
        totalFloorArea: formDataState.totalFloorArea,
        numberOfEmployee: formDataState.numberOfEmployee,
        maleEmployee: formDataState.maleEmployee,
        femaleEmployee: formDataState.femaleEmployee,
        numNozzle: formDataState.numNozzle,
        weighScale: formDataState.weighScale,
        totalDeliveryVehicle: formDataState.totalDeliveryVehicle,
        tIGE: formDataState.tIGE,
        officeType: formDataState.officeType,
        officeTypeOther: formDataState.officeTypeOther,
        totalCapital: formDataState.totalCapital,
        lineOfBusiness: businessLines
          .map((b) => `"${b.lineOfBusiness}"`)
          .join(","),
        productService: businessLines
          .map((b) => `"${b.productService}"`)
          .join(","),
        Units: businessLines.map((b) => `"${b.Units}"`).join(","),
        capital: businessLines.map((b) => `"${b.capital}"`).join(","),
        Modeofpayment: formDataState.Modeofpayment,
        application: "Renew",
      };

      // 🧩 Now combine files + text payload into FormData
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, value == null ? "" : String(value));
      });

      // 🧠 Append all your files (only if not null)
      const fileKeys = [
        "proofOfReg",
        "proofOfRightToUseLoc",
        "locationPlan",
        "brgyClearance",
        "marketClearance",
        "occupancyPermit",
        "cedula",
        "photoOfBusinessEstInt",
        "photoOfBusinessEstExt",
        "tIGEfiles",
        "RecentBusinessPermit",
      ];

      fileKeys.forEach((key) => {
        if (filesState[key]) {
          formData.append(key, filesState[key]); // File object (from input)
        }
      });

      console.log("🚀 Submitting renewal with files:", formData);

      // 📤 Submit to your backend
      await axios.post(`${API}/newApplication/files-renewal`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ Cleanup after success
      localStorage.removeItem("formDataState");
      localStorage.removeItem("filesState");
      localStorage.removeItem("businessLines");
      localStorage.removeItem("formStep");

      setSuccessDialogOpen(true);
      if (paperRef.current)
        paperRef.current.scrollIntoView({ behavior: "smooth" });
      else window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

      setTimeout(() => {
        navigate(`/appTracker/${id}`);
      }, 2000);
    } catch (error) {
      console.error("❌ Renewal submission failed:", error);
      setSnackbarState({
        open: true,
        message: "Submission failed. Please try again.",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 1:
        return (
          <Step1BusinessInfo
            formData={formDataState}
            handleChange={handleChange} // ✅ already defined globally
            errors={errors}
          />
        );
        40;
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
        <GreenButton
          onClick={() => navigate(`/homePage/${BIN}`)}
          variant="contained"
        >
          BACK TO DASHBOARD
        </GreenButton>
      </Box>

      <Paper
        elevation={6}
        ref={paperRef}
        sx={{
          p: { xs: 2, sm: 4 },
          width: "100%",
          maxWidth: isMobile ? 320 : 900,
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
          Renew Business Application Form
        </Typography>

        <Stepper
          activeStep={step - 1}
          alternativeLabel
          connector={null}
          sx={{
            mb: 2,
            flexWrap: "nowrap", // force one line
            justifyContent: "space-between", // spread evenly
            "& .MuiStep-root": {
              p: 0,
              minWidth: "auto", // remove default spacing
              flex: "1 1 auto",
            },
            "& .MuiStepIcon-root": {
              fontSize: { xs: "1rem", sm: "1.5rem" },
              color: "gray",
              "&.Mui-active": { color: "#4caf50" },
              "&.Mui-completed": { color: "#4caf50" },
            },
            "& .MuiStepLabel-label": {
              fontSize: { xs: "0.55rem", sm: "0.75rem" },
              marginTop: 1,
              textAlign: "center",
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
                  flexDirection: "column", // label below icon
                  alignItems: "center",
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

      {/* Success Popup */}
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
            <CheckCircleOutlineIcon sx={{ fontSize: 80, color: "#1a6d1cff" }} />
          </Grow>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#000000ff" }}
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

export default RenewApplicationPage;
