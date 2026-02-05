import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Grid,
  Fade,
  Slide,
  InputBase,
  Grow,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import BusinessAssessmentDialog from "./BusinessAssessmentDialog";
import DataPrivacyPolicy from "./DataPrivacyPolicy";
import SearchBusinesses from "./SearchBusinesses";

const SearchBar = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid #09360D",
  borderRadius: 5,
  overflow: "hidden",
  width: "300px",
  backgroundColor: "#f9f9f9",
  mt: 2,
  padding: 10,
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  flexGrow: 1,
  px: theme.spacing(3),
  py: theme.spacing(1.5),
  textAlign: "center",
  "&::placeholder": {
    textAlign: "center",
  },
}));

// Centralized Requirements Data
const requirements = {
  new: {
    title: "REQUIREMENTS FOR NEW BUSINESS REGISTRATION",
    content: `1. Filled-up Unified Business Permit Application Form
2. 1 (one) photocopy of: 
   * DTI Business Name Registration (if sole proprietor)
   * SEC Registration and Articles of Incorporation (if corporation or partnership)
   * CDA Registration and Articles of Cooperation (if cooperative)
3. Barangay Clearance (Window 1 - BPLD)
4. Business Capitalization
5. 1 (one) photocopy of Contract of Lease and Lessor Mayor's Permit (if rented)
6. Photocopy of Occupancy Permit (if newly constructed building)
7. Location of Business (Sketch/Map)
8. Land Tax Clearance / Certificate of Payment
9. Market Clearance (if stallholder)`,
  },
  renewal: {
    title: "REQUIREMENTS FOR BUSINESS RENEWAL",
    content: `1. Filled-up Unified Business Permit Application Form
2. Previous year's Mayor's Permit
3. Financial Statement / Income Tax Return of the previous year / Statement of Gross Sales / Receipt
4. Barangay Clearance (Window 1 - BPLD)
5. Land Tax Clearance / Certificate of Payment
6. Market Clearance (if market stall holder)`,
  },
};

function App() {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [results, setResults] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const API = import.meta.env.VITE_API_BASE;
  const [isTracking, setIsTracking] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [searchBusiness, setSearchBusinesses] = useState(false);

  // Control privacy overlay + grayscale effect
  const [privacyEnabled, setPrivacyEnabled] = useState(() => {
    const saved = localStorage.getItem("privacyOverlayEnabled");
    return saved === null ? true : saved === "true";
  });

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSelect = (type) => {
    setAnchorEl(null);
    if (requirements[type]) {
      setModalData(requirements[type]);
    }
  };

  const handleSearchBusinesses = () => {
    setSearchBusinesses(true);
  };

  const handleTrackClick = async () => {
    if (!searchValue.trim()) {
      setSnackbar({
        open: true,
        message: "⚠️ Please enter a BIN or User ID",
        severity: "warning",
      });
      return;
    }

    setIsTracking(true);
    setNoResults(false);

    try {
      const response = await axios.get(
        `${API}/appStatus/status/${encodeURIComponent(searchValue)}`
      );

      if (response.data && response.data.length > 0) {
        setResults(response.data);
        setNoResults(false);
      } else {
        setResults([]);
        setNoResults(true);
        setSnackbar({
          open: true,
          message: "No application found for this BIN/User ID.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error checking BIN/UserId:", error);
      setResults([]);
      setNoResults(true);
      setSnackbar({
        open: true,
        message: "❌ Unable to connect or check application. Please try again.",
        severity: "error",
      });
    } finally {
      setIsTracking(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${ampm}`;
  };

  const formatDate = (date) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayName = days[date.getDay()];
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${dayName}, ${month}/${day}/${year}`;
  };

  useEffect(() => setAnimate(true), []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Navbar */}
      <AppBar
        position="sticky"
        sx={{ backgroundColor: "#1d5236", px: { xs: 2, md: 4 } }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 70, md: 85 },
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Box sx={{ color: "white", textAlign: "right" }}>
            <Typography sx={{ fontWeight: "bold", fontSize: ".9rem" }}>
              {formatTime(currentTime)}
            </Typography>
            <Typography sx={{ fontSize: ".9rem" }}>
              {formatDate(currentTime)}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main content area – gets grayed out when blocked */}
      <Box
        sx={{
          flex: 1,
          filter: privacyEnabled
            ? "grayscale(100%) brightness(0.82) contrast(0.9)"
            : "none",
          transition: "filter 0.5s ease",
          pointerEvents: privacyEnabled ? "none" : "auto",
          userSelect: privacyEnabled ? "none" : "auto",
        }}
      >
        <Grid
          container
          direction="column"
          alignItems="center"
          sx={{
            minHeight: "85vh",
            px: { xs: 2, md: 6 },
            textAlign: "center",
            background: "#fff",
            pt: 8,
          }}
        >
          {/* Logo */}
          <Slide in={animate} direction="down" timeout={800}>
            <Grow in={animate} timeout={1200}>
              <Box
                component="img"
                src="spclogo.png"
                alt="San Pablo City Logo"
                sx={{ width: { xs: 120, sm: 150 }, mb: 5 }}
              />
            </Grow>
          </Slide>

          {/* Title */}
          <Slide in={animate} direction="down" timeout={1000}>
            <Fade in={animate} timeout={1500}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  color: "#09360D",
                  fontSize: { xs: "1.8rem", sm: "3rem" },
                  mb: 3,
                }}
              >
                BUSINESS PERMIT AND LICENSING
              </Typography>
            </Fade>
          </Slide>

          {/* Buttons */}
          <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: "wrap" }}>
            <Fade in={animate} timeout={1800}>
              <Button
                variant="contained"
                sx={{
                  px: 3,
                  py: 1,
                  fontWeight: "bold",
                  backgroundColor: "#09360D",
                  "&:hover": { backgroundColor: "#07270a" },
                }}
                onClick={() => navigate("/newApplicationRegister")}
              >
                New Application
              </Button>
            </Fade>
            <Fade in={animate} timeout={2000}>
              <Button
                variant="outlined"
                sx={{
                  px: 3,
                  py: 1,
                  fontWeight: "bold",
                  borderColor: "#09360D",
                  color: "#09360D",
                  "&:hover": { borderColor: "#07270a", color: "#07270a" },
                }}
                onClick={() => navigate("/renew")}
              >
                Renewal
              </Button>
            </Fade>
          </Stack>

          {/* Search and action buttons */}
          <Grow in={animate} timeout={2200}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                maxWidth: 350,
              }}
            >
              <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <SearchBar>
                  <SearchInput
                    placeholder="Enter BIN , Business Name or Tin No."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value.slice(0, 50))}
                    inputProps={{ maxLength: 50 }}
                  />
                  <Box
                    sx={{
                      borderLeft: "1px solid #09360D",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <IconButton onClick={handleClick}>
                      <ArrowDropDownIcon />
                    </IconButton>
                  </Box>
                  <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                    <MenuItem onClick={() => handleSelect("new")}>
                      New Application Requirements
                    </MenuItem>
                    <MenuItem onClick={() => handleSelect("renewal")}>
                      Renewal Requirements
                    </MenuItem>
                  </Menu>
                </SearchBar>
              </Box>

              {/* Track button */}
              <Button
                variant="contained"
                sx={{
                  width: "300px",
                  py: 1,
                  fontWeight: "bold",
                  backgroundColor: "#09360D",
                  "&:hover": { backgroundColor: "#07270a" },
                  m: 1,
                }}
                onClick={handleTrackClick}
                disabled={isTracking}
              >
                {isTracking ? (
                  <>
                    <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
                    Tracking...
                  </>
                ) : (
                  "Track"
                )}
              </Button>

              <Button
                variant="outlined"
                sx={{
                  width: "300px",
                  fontWeight: "bold",
                  borderColor: "#09360D",
                  color: "#09360D",
                  "&:hover": { borderColor: "#07270a", color: "#07270a" },
                  mt: 5,
                }}
                onClick={handleSearchBusinesses}
              >
                Business Profiles
              </Button>

              <Button
                variant="outlined"
                sx={{
                  width: "300px",
                  py: 1,
                  fontWeight: "bold",
                  borderColor: "#09360D",
                  color: "#09360D",
                  "&:hover": { borderColor: "#07270a", color: "#07270a" },
                  m: 1,
                }}
                onClick={() => setIsAssessmentOpen(true)}
              >
                Business Assessment
              </Button>

              <Button
                variant="outlined"
                sx={{
                  width: "300px",
                  py: 1,
                  fontWeight: "bold",
                  borderColor: "#09360D",
                  color: "#09360D",
                  "&:hover": { borderColor: "#07270a", color: "#07270a" },
                  mt: 0,
                }}
                onClick={() => navigate("/feedback")}
              >
                Feedback
              </Button>

              {/* Results display */}
              {results.length > 0 && (
                <Box
                  sx={{
                    mt: 4,
                    px: { xs: 2, md: 6 },
                    py: 3,
                    borderTop: "2px solid #09360D",
                    width: "100%",
                    backgroundColor: "#fafafa",
                    m: 1,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", mb: 2, color: "#09360D" }}
                  >
                    Application Status
                  </Typography>

                  {results.map((status, index) => (
                    <Box
                      key={index}
                      sx={{
                        mb: 2,
                        p: 2,
                        border: "1px solid #ccc",
                        borderRadius: 2,
                        textAlign: "left",
                        backgroundColor: "white",
                      }}
                    >
                      <Typography><strong>Tracking ID:</strong> {status.userId}</Typography>
                      <Typography><strong>BPLO:</strong> {status.BPLO}</Typography>
                      <Typography><strong>Examiners:</strong> {status.Examiners}</Typography>
                      {status.Examiners === "Declined" && (
                        <Typography color="error">
                          <strong>Reason:</strong> {status.Examinersdecline}
                        </Typography>
                      )}
                      <Typography><strong>CSMWO:</strong> {status.CSMWO}</Typography>
                      <Typography><strong>CHO:</strong> {status.CHO}</Typography>
                      <Typography><strong>ZONING:</strong> {status.ZONING}</Typography>
                      <Typography><strong>CENRO:</strong> {status.CENRO}</Typography>
                      <Typography><strong>OBO:</strong> {status.OBO}</Typography>
                      <Typography><strong>Business Tax:</strong> {status.BUSINESSTAX}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Grow>
        </Grid>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            mt: "auto",
            py: 3,
            borderTop: "2px solid #09360D",
            textAlign: "center",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography variant="body2" sx={{ color: "#746a6aff" }}>
            © {new Date().getFullYear()} Business Permit and Licensing Office | v6.0.0
          </Typography>
        </Box>
      </Box>

      {/* Dialogs / Modals / Snackbar – remain interactive */}
      <Dialog
        open={!!modalData}
        onClose={() => setModalData(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "#09360D" }}>
          {modalData?.title}
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{ whiteSpace: "pre-line", color: "#09360D", lineHeight: 1.7 }}
          >
            {modalData?.content}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setModalData(null)}
            color="inherit"
            startIcon={<CloseIcon />}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <BusinessAssessmentDialog
        open={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
      />

      <SearchBusinesses
        open={searchBusiness}
        onClose={() => setSearchBusinesses(false)}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>

      {/* Privacy overlay – only when enabled */}
      {privacyEnabled && <DataPrivacyPolicy />}
    </Box>
  );
}

export default App;