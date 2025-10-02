import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Step1BusinessInfo from "./components/Step1";
import Step2PersonalInfo from "./components/Step2";
import axios from "axios";

const steps = ["Business Information", "Personal Information"];

export default function RenewalFormStepper() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_BASE;

  // ✅ Grab record data passed from Renewal.jsx
  const record = location.state?.record;
  if (!record) {
    return (
      <Typography align="center" mt={4} color="error">
        ⚠️ No record data found. Please go back to the renewal form.
      </Typography>
    );
  }

  // ✅ Initialize form data from matched record
  const [formData, setFormData] = useState({
    ...record,
  });

  const [errors, setErrors] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ✅ Handle Finish / Submit
  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      // 📝 Prepare clean payload (map fields to backend)
      const payload = {
        BIN: formData.BIN,
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        extName: formData.extName,
        sex: formData.sex,
        email: formData.eMailAdd, // from Step2PersonalInfo
        mobileNo: formData.mobileNo,
        BusinessType: formData.BusinessType,
        dscRegNo: formData.dscRegNo,
        businessName: formData.businessName,
        tinNo: formData.tinNo,
        TradeName: formData.TradeName,
        telNo: formData.telNo,
      };

      console.log("🚀 Submitting Renewal Payload:", payload);

      await axios.post(`${API}/userAccounts/register-renew`, payload);

      alert("✅ Renewal registration successful!");
      navigate("/"); // redirect after successful submission
    } catch (error) {
      console.error("❌ Renewal submission failed:", error);
      alert("Failed to submit renewal. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Handle Step navigation
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit(); // 🚀 Call submit on Finish
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 800, mx: "auto", p: 4 }}>
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
  );
}
