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
  const [trackers, setTrackers] = useState([]);
  const [fileStatuses, setFileStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_BASE;

  const departments = ["BPLO", "CSMWO", "OBO", "CHO", "CENRO", "ZONING"];

  useEffect(() => {
    let intervalId;

    const fetchData = async () => {
      try {
        const trackerRes = await axios.get(`${API}/backroom/backrooms/${id}`);
        if (trackerRes.data.length > 0) setTrackers(trackerRes.data);

        const filesRes = await axios.get(`${API}/api/files/${id}`);
        if (filesRes.data.length > 0) {
          const statusList = filesRes.data.map((file) => ({
            trackerId: file.trackerId,
            status: file.status || "pending",
          }));
          setFileStatuses(statusList);
        }
      } catch (err) {
        console.error("Error fetching tracker/files:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // initial fetch
    intervalId = setInterval(fetchData, 5000); // fetch every 5s

    return () => clearInterval(intervalId); // cleanup on unmount
  }, [id, API]);

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

  if (trackers.length === 0 && fileStatuses.length === 0)
    return (
      <Typography variant="h6" align="center" color="text.secondary">
        No tracker or file data found.
      </Typography>
    );

  return (
    <Box sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
      <Button
        onClick={() => navigate(`/homePage/${id}`)}
        variant="contained"
        color="primary"
        sx={{ maxWidth: 150, mb: 3 }}
      >
        Back to Home
      </Button>

      <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
        Application Tracker
      </Typography>

      {/* Render application trackers */}
      {trackers.map((tracker, idx) => {
        const activeStep = departments.findIndex(
          (dept) => tracker[dept] !== "Approved"
        );
        const currentStep = activeStep === -1 ? departments.length : activeStep;

        return (
          <Paper key={idx} elevation={3} sx={{ p: 4, mb: 3 }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              mb={2}
              color="text.secondary"
            >
              Application {idx + 1}
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
        );
      })}

      {/* Render file statuses in stepper style */}
      {fileStatuses.map((file, idx) => {
        const activeStep = departments.findIndex((dept) => {
          if (dept === "BPLO") return file.status !== "Approved";
          return true; // Other departments default to pending
        });
        const currentStep = activeStep === -1 ? departments.length : activeStep;

        return (
          <Paper key={idx} elevation={3} sx={{ p: 4, mb: 3 }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              mb={2}
              color="text.secondary"
            >
              Application {idx + 1}
            </Typography>

            <Stepper activeStep={currentStep} alternativeLabel>
              {departments.map((dept) => {
                const status = dept === "BPLO" ? file.status : "pending";
                return (
                  <Step key={dept} completed={status === "Approved"}>
                    <StepLabel>
                      <Typography variant="body1">{dept}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {status}
                      </Typography>
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </Paper>
        );
      })}
    </Box>
  );
}

export default AppTracker;
