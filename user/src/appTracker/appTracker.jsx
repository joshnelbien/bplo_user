import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Stepper,
  Step,
  StepLabel,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";

function AppTracker() {
  const { id } = useParams();
  const [tracker, setTracker] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_BASE;

  const departments = ["BPLO", "CSMWO", "OBO", "CHO", "CENRO", "ZONING"];

  useEffect(() => {
    const fetchTracker = async () => {
      try {
        const res = await axios.get(`${API}/backroom/backrooms/${id}`);
        if (res.data.length > 0) {
          setTracker(res.data[0]);
        }
      } catch (err) {
        console.error("Error fetching tracker:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTracker();
  }, [id]);

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

  if (!tracker)
    return (
      <Typography variant="h6" align="center" color="text.secondary">
        No tracker data found.
      </Typography>
    );

  // Determine which step is active (first department that's not Approved)
  const activeStep = departments.findIndex(
    (dept) => tracker[dept] !== "Approved"
  );
  const currentStep = activeStep === -1 ? departments.length : activeStep;

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Button
          onClick={() => navigate(`/homePage/${id}`)}
          variant="contained"
          color="primary"
          sx={{ maxWidth: 150 }}
        >
          back to Home
        </Button>

        <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
          Application Tracker
        </Typography>

        <Stepper activeStep={currentStep} alternativeLabel>
          {departments.map((dept) => (
            <Step key={dept} completed={tracker[dept] === "Approved"}>
              <StepLabel>
                <Typography variant="body1">{dept}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {tracker[dept]}{" "}
                  {tracker[`${dept}timeStamp`]
                    ? `(${tracker[`${dept}timeStamp`]})`
                    : ""}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>
    </Box>
  );
}

export default AppTracker;
