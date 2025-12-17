import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import Step1BusinessInfo from "./components/Step1";
import Step2PersonalInfo from "./components/Step2";
import axios from "axios";
import SuccessModals from "../modals/successModals";

const steps = ["Business Information", "Personal Information"];

export default function RenewalFormStepper() {
  // 🔹 MODAL STATE
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_BASE;

  const record = location.state?.record;
  if (!record) {
    return (
      <Typography align="center" mt={4} color="error">
        ⚠️ No record data found. Please go back to the renewal form.
      </Typography>
    );
  }

  const [formData, setFormData] = useState({ ...record });
  const [errors, setErrors] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.bin) newErrors.bin = "BIN is required";
    if (!formData.business_name)
      newErrors.business_name = "Business Name is required";
    if (!formData.business_type)
      newErrors.business_type = "Business Type is required";
    if (!formData.tin_no) newErrors.tin_no = "TIN is required";
    if (!formData.dscRegNo) newErrors.dscRegNo = "Registration No. is required";
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.incharge_first_name)
      newErrors.incharge_first_name = "First Name is required";
    if (!formData.incharge_middle_name)
      newErrors.incharge_middle_name = "Middle Name is required";
    if (!formData.incharge_last_name)
      newErrors.incharge_last_name = "Last Name is required";
    if (!formData.incharge_sex) newErrors.incharge_sex = "Gender is required";
    if (!formData.email_address) newErrors.email_address = "Email is required";
    if (!formData.cellphone_no)
      newErrors.cellphone_no = "Mobile No. is required";
    return newErrors;
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      // simulate delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const payload = {
        bin: formData.bin,
        firstName: formData.incharge_first_name,
        middleName: formData.incharge_middle_name,
        lastName: formData.incharge_last_name,
        extName: formData.incharge_extension_name,
        sex: formData.incharge_sex,
        email: formData.email_address,
        mobileNo: formData.cellphone_no,
        BusinessType: formData.business_type,
        dscRegNo: formData.dscRegNo,
        businessName: formData.business_name,
        tinNo: formData.tin_no,
        TradeName: formData.trade_name,
        telNo: formData.telephone_no,
      };

      console.log("🚀 Submitting Renewal Payload:", payload);

      await axios.post(`${API}/userAccounts/register-renew`, payload);

      // ✅ SHOW SUCCESS MODAL
      setModalMessage("Renewal registration successful!");
      setSuccessOpen(true);
    } catch (error) {
      console.error("❌ Renewal submission failed:", error);

      // ❌ SHOW ERROR MODAL
      setModalMessage("Failed to submit renewal. Please try again.");
      setErrorOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    let stepErrors = {};
    if (activeStep === 0) stepErrors = validateStep1();
    else if (activeStep === 1) stepErrors = validateStep2();

    setErrors(stepErrors);

    if (Object.keys(stepErrors).length === 0) {
      if (activeStep === steps.length - 1) handleSubmit();
      else setActiveStep((prev) => prev + 1);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
    navigate("/");
  };

  const handleErrorClose = () => {
    setErrorOpen(false);
  };

  return (
    <>
      {/* ✅ SUCCESS MODAL */}
      <SuccessModals
        open={successOpen}
        onClose={handleSuccessClose}
        message={modalMessage}
      />

      {/* ❌ ERROR MODAL (temporary reuse) */}
      <SuccessModals
        open={errorOpen}
        onClose={handleErrorClose}
        message={modalMessage}
      />

      <Box
        sx={{
          width: "100%",
          maxWidth: 800,
          mx: "auto",
          p: 4,
          position: "relative",
        }}
      >
        {/* SUBMIT OVERLAY */}
        {submitting && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(255,255,255,0.7)",
              backdropFilter: "grayscale(100%)",
              zIndex: 1000,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress size={80} />
          </Box>
        )}

        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box mt={4}>
          {activeStep === 0 && (
            <Step1BusinessInfo
              formData={formData}
              handleChange={handleChange}
              errors={errors}
            />
          )}
          {activeStep === 1 && (
            <Step2PersonalInfo
              formData={formData}
              handleChange={handleChange}
              errors={errors}
              setErrors={setErrors}
            />
          )}
        </Box>

        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button
            disabled={activeStep === 0 || submitting}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleNext}
            disabled={submitting}
          >
            {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </Box>
      </Box>
    </>
  );
}
