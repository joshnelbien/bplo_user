import {
  Box,
  Button,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Step1BusinessInfo from "../components/BusinessForm/Step1";
import Step2PersonalInfo from "../components/BusinessForm/Step2";
import Step3AddressInfo from "../components/BusinessForm/Step3";
import Step4TaxInfo from "../components/BusinessForm/Step4";
import Step5BusinessDetails from "../components/BusinessForm/Step5";
import Step6BusinessActivity from "../components/BusinessForm/Step6";
import Section7FileUploads from "../components/BusinessForm/Step7";

function NewApplicationPage() {
  const API = import.meta.env.VITE_API_BASE;
  const [step, setStep] = useState(1);

  const steps = [
    "Business Info",
    "Owner Info",
    "Business Address",
    "Tax Payer's Address",
    "Business Operation",
    "Business Activities",
    "Business Requirements",
  ];
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFilesState((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(formDataState).forEach((key) => {
      formData.append(key, formDataState[key]);
    });

    Object.keys(filesState).forEach((key) => {
      if (filesState[key]) formData.append(key, filesState[key]);
    });

    try {
      await axios.post(`${API}/api/files`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Application submitted!");
      setStep(1);
    } catch (err) {
      console.error(err);
      alert("Submit failed");
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 1:
        return <Step1BusinessInfo formData={formDataState} handleChange={handleChange} />;
      case 2:
        return <Step2PersonalInfo formData={formDataState} handleChange={handleChange} />;
      case 3:
        return <Step3AddressInfo formData={formDataState} handleChange={handleChange} />;
      case 4:
        return <Step4TaxInfo formData={formDataState} handleChange={handleChange} />;
      case 5:
        return <Step5BusinessDetails formData={formDataState} handleChange={handleChange} />;
      case 6:
        return <Step6BusinessActivity formData={formDataState} handleChange={handleChange} />;
      case 7:
        return <Section7FileUploads handleFileChange={handleFileChange} />;
      default:
        return "Unknown step";
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 4,
        mb: 4,
        px: 2,
      }}
    >
      <Paper
        sx={{
          p: { xs: 2, sm: 4 },
          width: "100%",
          maxWidth: 700,
          mx: "auto",
        }}
      >

          <Button onClick={() => navigate("/homePage")} variant="contained" color="primary" sx={{ maxWidth: 150}}>
            back to Home
          </Button>

        <Typography variant="h4" align="center" gutterBottom>
          Business Application Form
        </Typography>

        {/* MUI Stepper */}
        <Stepper activeStep={step - 1} alternativeLabel sx={{ mb: 4, flexWrap: "wrap" }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                StepIconProps={{ sx: { fontSize: 20 } }}
                sx={{ "& .MuiStepLabel-label": { fontSize: { xs: "0.6rem", sm: "0.75rem" } } }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          {renderStepContent(step)}

          {/* Buttons like your snippet */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            {step > 1 && (
              <Button type="button" variant="outlined" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            {step < 7 && (
              <Button type="button" variant="contained" onClick={() => setStep(step + 1)}>
                Next
              </Button>
            )}
            {step === 7 && (
              <Button type="submit" variant="contained">
                Submit Form
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default NewApplicationPage;
