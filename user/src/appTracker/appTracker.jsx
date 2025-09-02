import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function AppTracker() {
  const { id } = useParams();
  const [trackers, setTrackers] = useState([]);
  const [fileStatuses, setFileStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_BASE;

  const departments = ["BPLO", "CSMWO", "OBO", "CHO", "CENRO", "ZONING"];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // responsive

  useEffect(() => {
    let intervalId;

    const fetchData = async () => {
      try {
        const trackerRes = await axios.get(`${API}/backroom/backrooms/${id}`);
        if (trackerRes.data.length > 0) {
          setTrackers(trackerRes.data);
        }

        const filesRes = await axios.get(`${API}/newApplication/files/${id}`);
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

    fetchData();
    intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
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

  // Reorder departments so Approved ones appear first
  const reorderDepartments = (tracker) => {
    return [...departments].sort((a, b) => {
      const aApproved = tracker[a] === "Approved";
      const bApproved = tracker[b] === "Approved";
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
        sx={{ maxWidth: 150, mb: 3 }}
      >
        Back to Home
      </Button>

      {trackers.length === 0 && fileStatuses.length === 0 ? (
        <Typography variant="h6" align="center" color="text.secondary">
          No tracker or file data found.
        </Typography>
      ) : (
        <>
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            Application Tracker
          </Typography>

          {/* Trackers */}
          {trackers.map((tracker, idx) => {
            const orderedDepartments = reorderDepartments(tracker);
            const activeStep = orderedDepartments.findIndex(
              (dept) => tracker[dept] !== "Approved"
            );
            const currentStep =
              activeStep === -1 ? orderedDepartments.length : activeStep;

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

                <Stepper
                  activeStep={currentStep}
                  orientation={isMobile ? "vertical" : "horizontal"}
                  alternativeLabel={!isMobile}
                >
                  {orderedDepartments.map((dept) => (
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

          {/* File statuses */}
          {fileStatuses.map((file, idx) => {
            // reorder so Approved (BPLO) first
            const orderedDepartments = [...departments].sort((a, b) => {
              const aApproved = a === "BPLO" && file.status === "Approved";
              const bApproved = b === "BPLO" && file.status === "Approved";
              if (aApproved && !bApproved) return -1;
              if (!aApproved && bApproved) return 1;
              return 0;
            });

            const activeStep = orderedDepartments.findIndex((dept) => {
              if (dept === "BPLO") return file.status !== "Approved";
              return true;
            });
            const currentStep =
              activeStep === -1 ? orderedDepartments.length : activeStep;

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

                <Stepper
                  activeStep={currentStep}
                  orientation={isMobile ? "vertical" : "horizontal"}
                  alternativeLabel={!isMobile}
                >
                  {orderedDepartments.map((dept) => {
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
        </>
      )}
    </Box>
  );
}

export default AppTracker;
