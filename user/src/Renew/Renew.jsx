import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Renewal() {
  const { id } = useParams();
  const [renewals, setRenewals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    businessName: "",
    bin: "",
  });

  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_BASE;

  const departments = ["BPLO", "CSMWO", "OBO", "CHO", "CENRO", "ZONING"];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // responsive

  useEffect(() => {
    let intervalId;

    const fetchData = async () => {
      try {
        const res = await axios.get(`${API}/renewal/${id}`);
        if (res.data.length > 0) {
          setRenewals(res.data);
        }
      } catch (err) {
        console.error("Error fetching renewals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, [id, API]);

  // handle form changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate BIN before sending
    if (!/^\d{10}$/.test(form.bin)) {
      alert("BIN must be exactly 10 digits.");
      return;
    }

    try {
      await axios.post(`${API}/renewal/${id}`, form);
      alert("Renewal submitted successfully!");
      setForm({
        businessName: "",
        bin: "",
      });
    } catch (err) {
      console.error("Error submitting renewal:", err);
      alert("Error submitting renewal");
    }
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );

  // reorder departments so Approved ones appear first
  const reorderDepartments = (renewal) => {
    return [...departments].sort((a, b) => {
      const aApproved = renewal[a] === "Approved";
      const bApproved = renewal[b] === "Approved";
      if (aApproved && !bApproved) return -1;
      if (!aApproved && bApproved) return 1;
      return 0;
    });
  };

  return (
    <Box sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
      <Button
        onClick={() => navigate(`/homePage/${id}`)}
        variant="contained"
        color="success"
        sx={{ maxWidth: 180, mb: 3, borderRadius: 2 }}
      >
        Back to Home
      </Button>

      {/* Renewal Form */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
          Renewal Application Form
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          display="grid"
          gap={2}
          mt={2}
        >
          <TextField
            label="Business Name"
            name="businessName"
            value={form.businessName}
            onChange={handleChange}
            required
            fullWidth
            color="primary"
            InputLabelProps={{ required: true }}
          />
          <TextField
            label="Business Identification Number (BIN)"
            name="bin"
            value={form.bin}
            onChange={handleChange}
            required
            fullWidth
            color="primary"
            inputProps={{
              maxLength: 10,
              pattern: "[0-9]{10}",
              title: "BIN must be exactly 10 digits",
            }}
            helperText="BIN must be exactly 10 digits"
            InputLabelProps={{ required: true }}
          />

          <Button
            type="submit"
            variant="contained"
            color="success"
            sx={{
              mt: 2,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Process Renewal
          </Button>
        </Box>
      </Paper>

      {/* Renewal Tracker */}
      {renewals.length === 0 ? (
        <Typography variant="h6" align="center" color="text.secondary">
          No renewal application found.
        </Typography>
      ) : (
        <>
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            Renewal Tracker
          </Typography>

          {renewals.map((renewal, idx) => {
            const orderedDepartments = reorderDepartments(renewal);
            const approvedCount = orderedDepartments.filter(
              (dept) => renewal[dept] === "Approved"
            ).length;
            const total = orderedDepartments.length;
            const percentage = Math.round((approvedCount / total) * 100);

            const activeStep = orderedDepartments.findIndex(
              (dept) => renewal[dept] !== "Approved"
            );
            const currentStep =
              activeStep === -1 ? orderedDepartments.length : activeStep;

            return (
              <Paper
                key={idx}
                elevation={3}
                sx={{ p: 4, mb: 3, borderRadius: 3 }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  mb={2}
                  color="text.secondary"
                >
                  Renewal {idx + 1}
                </Typography>

                {/* Progress Info */}
                <Box display="flex" alignItems="center" mb={2} gap={2}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {approvedCount} of {total} Approved ({percentage}%)
                    </Typography>
                    <Box
                      sx={{
                        mt: 0.5,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: "#eee",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          width: `${percentage}%`,
                          backgroundColor:
                            percentage === 100 ? "green" : "#1976d2",
                          transition: "width 0.5s ease",
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Stepper */}
                <Stepper
                  activeStep={currentStep}
                  orientation={isMobile ? "vertical" : "horizontal"}
                  alternativeLabel={!isMobile}
                >
                  {orderedDepartments.map((dept) => (
                    <Step key={dept} completed={renewal[dept] === "Approved"}>
                      <StepLabel>
                        <Typography variant="body1">{dept}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {renewal[dept]}{" "}
                          {renewal[`${dept}timeStamp`]
                            ? `(${renewal[`${dept}timeStamp`]})`
                            : ""}
                        </Typography>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Paper>
            );
          })}
        </>
      )}
    </Box>
  );
}

export default Renewal;
