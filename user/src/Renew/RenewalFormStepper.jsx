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

const steps = ["Business Information", "Personal Information"];

export default function RenewalFormStepper() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Grab record data passed from Renewal.jsx
  const record = location.state?.record;
  if (!record) {
    return (
      <Typography align="center" mt={4} color="error">
        ⚠️ No record data found. Please go back to renewal form.
      </Typography>
    );
  }

  // ✅ Initialize form data from matched record
  const [formData, setFormData] = useState({
    ...record,
  });

  const [errors, setErrors] = useState({});
  const [activeStep, setActiveStep] = useState(0);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      console.log("✅ Final form submitted", formData);
      navigate("/"); // redirect after renewal process
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
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
        >
          Back
        </Button>
        <Button variant="contained" color="success" onClick={handleNext}>
          {activeStep === steps.length - 1 ? "Finish" : "Next"}
        </Button>
      </Box>
    </Box>
  );
}
