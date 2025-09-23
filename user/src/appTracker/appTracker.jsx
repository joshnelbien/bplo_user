// AppTracker.jsx
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
import ApplicantModal from "./ApplicantModal";

function ColoredStepIcon(props) {
  const { active, icon, status } = props;
  let color = "gray";
  if (status === "Approved") color = "green";
  else if (status === "Declined") color = "red";
  else if (active) color = "blue";

  return (
    <Box
      sx={{
        width: 30,
        height: 30,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: color,
        color: "white",
        fontWeight: "bold",
      }}
    >
      {icon}
    </Box>
  );
}

function AppTracker() {
  const { id } = useParams();
  const [trackers, setTrackers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_BASE;

  const departments = [
    "BPLO",
    "Examiners",
    "CSMWO",
    "OBO",
    "CHO",
    "CENRO",
    "ZONING",
    "BUSINESSTAX",
  ];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    let intervalId;

    // 🔹 fetch status (with interval)
    const fetchStatus = async () => {
      try {
        const trackerRes = await axios.get(`${API}/appStatus/status/${id}`);
        if (trackerRes.data) {
          setTrackers(trackerRes.data);
        }
      } catch (err) {
        console.error("Error fetching tracker:", err);
      } finally {
        setLoading(false);
      }
    };

    // 🔹 fetch files (only once on mount, not in interval)
    const fetchFiles = async () => {
      try {
        const fileRes = await axios.get(`${API}/appStatus/files/${id}`);
        setSelectedApp(fileRes.data); // preload application details
      } catch (err) {
        console.error("Error fetching application files:", err);
      }
    };

    fetchStatus();
    fetchFiles(); // 👈 only once

    intervalId = setInterval(fetchStatus, 5000);

    return () => clearInterval(intervalId);
  }, [id, API]);
  const handleViewApplication = () => {
    setOpenModal(true);
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

  const reorderDepartments = (tracker) => {
    return [...departments].sort((a, b) => {
      if (a === "BPLO") return -1;
      if (b === "BPLO") return 1;
      if (a === "BUSINESS TAX") return 1;
      if (b === "BUSINESS TAX") return -1;

      const isANotPending = tracker[a] !== "Pending";
      const isBNotPending = tracker[b] !== "Pending";

      if (isANotPending && !isBNotPending) return -1;
      if (!isANotPending && isBNotPending) return 1;
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

      {trackers.length === 0 ? (
        <Typography variant="h6" align="center" color="text.secondary">
          No tracker data found.
        </Typography>
      ) : (
        trackers.map((tracker, idx) => {
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
                {orderedDepartments.map((dept) => {
                  const status = tracker[dept];
                  const textColor =
                    status === "Approved"
                      ? "green"
                      : status === "Declined"
                      ? "red"
                      : "text.secondary";

                  return (
                    <Step key={dept} completed={status === "Approved"}>
                      <StepLabel
                        StepIconComponent={(props) => (
                          <ColoredStepIcon {...props} status={status} />
                        )}
                      >
                        <Typography variant="body1">{dept}</Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: textColor, fontWeight: "bold" }}
                        >
                          {status}{" "}
                          {tracker[`${dept}timeStamp`]
                            ? `(${tracker[`${dept}timeStamp`]})`
                            : ""}
                          {status === "Declined" &&
                          tracker[`${dept}decline`] ? (
                            <Box
                              component="span"
                              sx={{ color: "red", display: "block" }}
                            >
                              Reason: {tracker[`${dept}decline`]}
                            </Box>
                          ) : null}
                        </Typography>
                      </StepLabel>
                    </Step>
                  );
                })}
              </Stepper>

              {/* ✅ Modal trigger without re-fetch */}
              <Button
                variant="outlined"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => handleViewApplication(tracker)}
              >
                View Application
              </Button>
            </Paper>
          );
        })
      )}

      <ApplicantModal
        applicant={selectedApp}
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        baseUrl={`${API}/newApplication/files`}
      />
    </Box>
  );
}

export default AppTracker;
