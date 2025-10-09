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
  TextField,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";

// Key for local storage (removed privacy-related key)
const AGREEMENT_KEY = null; // No longer needed

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

// 🔹 Centralized Requirements Data
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

// 🔹 Business Assessment Fee Calculation Logic
const calculateAssessmentFee = (capital) => {
  const c = Number(capital);
  if (isNaN(c) || c <= 0) {
    return { fee: "0.00", message: "Please enter a valid capital amount." };
  }

  // Sample Fee Schedule (Based on Capital/Gross Sales)
  if (c <= 50000) return { fee: 500, message: "Estimated Fee: ₱500.00" };
  if (c <= 200000) return { fee: 1500, message: "Estimated Fee: ₱1,500.00" };

  // For capital > 200,000: ₱1,500.00 plus 1% of the excess over ₱200,000
  const excess = c - 200000;
  const fee = 1500 + excess * 0.01;

  return {
    fee: fee.toFixed(2),
    message: `Estimated Fee: ₱${fee.toFixed(2)}`,
  };
};

// 🔹 Assessment Dialog Component
const AssessmentDialog = ({ open, onClose, calculateFee }) => {
  const [localCapital, setLocalCapital] = useState("");
  const [localResult, setLocalResult] = useState(null);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setLocalCapital("");
      setLocalResult(null);
    }
  }, [open]);

  const handleLocalChange = (e) => {
    // Only allow digits for capital input
    const value = e.target.value.replace(/\D/g, "");
    setLocalCapital(value);
  };

  const handleLocalCompute = () => {
    const res = calculateFee(localCapital);
    setLocalResult(res);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ color: "#09360D", fontWeight: "bold" }}>
        Business Fee Assessment
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" gutterBottom>
          Enter your total capital investment (₱) to get an estimated permit
          fee.
        </Typography>
        <TextField
          label="Total Capital Investment"
          type="tel"
          fullWidth
          margin="normal"
          value={localCapital}
          onChange={handleLocalChange}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
        />
        <Button
          variant="contained"
          onClick={handleLocalCompute}
          disabled={!localCapital || Number(localCapital) <= 0}
          sx={{
            mt: 2,
            backgroundColor: "#09360D",
            "&:hover": { backgroundColor: "#07270a" },
          }}
        >
          Compute Fee
        </Button>

        {localResult && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              border: "1px solid #09360D",
              borderRadius: 1,
              backgroundColor: "#e8f5e9",
              textAlign: "left",
            }}
          >
            <Typography variant="h6" color="#09360D" fontWeight="bold">
              Assessment Result:
            </Typography>
            <Typography variant="body1">{localResult.message}</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" startIcon={<CloseIcon />}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
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

  const [modalData, setModalData] = useState(null); // { title, content }

  // 🔹 State for Business Assessment Dialog
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  // Dropdown
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Open modal with data
  const handleSelect = (type) => {
    setAnchorEl(null);
    if (requirements[type]) {
      setModalData(requirements[type]);
    }
  };

  // Track button behavior
  const handleTrackClick = async () => {
    if (!searchValue.trim()) {
      setSnackbar({
        open: true,
        message: "⚠️ Please enter a BIN or User ID",
        severity: "warning",
      });
      return;
    }

    try {
      const response = await axios.get(
        `${API}/appStatus/status/${encodeURIComponent(searchValue)}`
      );

      if (response.data && response.data.length > 0) {
        setResults(response.data); // 🔹 store results instead of navigate
        console.log("Search results:", response.data);
      } else {
        setResults([]); // clear results
        setSnackbar({
          open: true,
          message: "No application found for this BIN/User ID.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error checking BIN/UserId:", error);
      setResults([]);
      setSnackbar({
        open: true,
        message: "❌ Error checking application.",
        severity: "error",
      });
    }
  };

  // Time updater
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
    <Box className="relative">
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

      {/* Main Content */}
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
              BUSINESS REGISTRATION
            </Typography>
          </Fade>
        </Slide>

        {/* Buttons */}
        <Stack
          direction="row"
          spacing={2}
          sx={{ mb: 3, flexWrap: "wrap", justifyContent: "center" }}
        >
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

        {/* Search Bar & Track/Assessment Buttons */}
        <Grow in={animate} timeout={2200}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column", // Stack vertically on mobile
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
              flexWrap: "wrap",
              mb: 1,
              // Use a max-width for the whole search/track block for better mobile centering
              maxWidth: 350,
              width: "100%",
            }}
          >
            {/* Search Input and Dropdown */}
            <Box
              sx={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              <SearchBar>
                <SearchInput
                  placeholder="Enter BIN , Business Name or Tin No."
                  value={searchValue}
                  onChange={(e) => {
                    let value = e.target.value;

                    if (value.length > 50) {
                      value = value.slice(0, 50);
                    }

                    setSearchValue(value);
                  }}
                  inputProps={{ maxLength: 50 }}
                />

                {/* Dropdown */}
                <Box
                  sx={{
                    borderLeft: "1px solid #09360D",
                    display: "flex",
                    alignItems: "center",
                    pl: 0.5,
                  }}
                >
                  <IconButton onClick={handleClick} aria-label="Open options">
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

            {/* Track Button (full width under search input) */}
            <Button
              variant="contained"
              sx={{
                width: "300px", // Match SearchBar width
                py: 1,
                fontWeight: "bold",
                backgroundColor: "#09360D",
                "&:hover": { backgroundColor: "#07270a" },
              }}
              onClick={handleTrackClick}
            >
              Track
            </Button>

            {/* 🔹 Business Assessment Button (under Track) */}
            <Button
              variant="outlined"
              sx={{
                width: "300px", // Match SearchBar width
                py: 1,
                fontWeight: "bold",
                borderColor: "#09360D",
                color: "#09360D",
                "&:hover": {
                  borderColor: "#07270a",
                  color: "#07270a",
                  backgroundColor: "rgba(9, 54, 13, 0.04)",
                },
                mt: 0, // Ensure no extra margin is applied
              }}
              onClick={() => setIsAssessmentOpen(true)}
            >
              Business Assessment
            </Button>

            {/* Results Section */}
            {results.length > 0 && (
              <Box
                sx={{
                  mt: 4,
                  px: { xs: 2, md: 6 },
                  py: 3,
                  borderTop: "2px solid #09360D",
                  width: "100%",
                  backgroundColor: "#fafafa",
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
                    <Typography>
                      <strong>Tracking ID:</strong> {status.userId}
                    </Typography>
                    <Typography>
                      <strong>BPLO:</strong> {status.BPLO}
                    </Typography>

                    <Typography>
                      <strong>Examiners:</strong> {status.Examiners}
                    </Typography>
                    {status.Examiners === "Declined" && (
                      <Typography color="error">
                        <strong>Reason:</strong> {status.Examinersdecline}
                      </Typography>
                    )}

                    <Typography>
                      <strong>CSMWO:</strong> {status.CSMWO}
                    </Typography>
                    {status.CSMWO === "Declined" && (
                      <Typography color="error">
                        <strong>Reason:</strong> {status.CSMWOdecline}
                      </Typography>
                    )}

                    <Typography>
                      <strong>CHO:</strong> {status.CHO}
                    </Typography>
                    {status.CHO === "Declined" && (
                      <Typography color="error">
                        <strong>Reason:</strong> {status.CHOdecline}
                      </Typography>
                    )}

                    <Typography>
                      <strong>ZONING:</strong> {status.ZONING}
                    </Typography>
                    {status.ZONING === "Declined" && (
                      <Typography color="error">
                        <strong>Reason:</strong> {status.ZONINGdecline}
                      </Typography>
                    )}

                    <Typography>
                      <strong>CENRO:</strong> {status.CENRO}
                    </Typography>
                    {status.CENRO === "Declined" && (
                      <Typography color="error">
                        <strong>Reason:</strong> {status.CENROdecline}
                      </Typography>
                    )}

                    <Typography>
                      <strong>OBO:</strong> {status.OBO}
                    </Typography>
                    {status.OBO === "Declined" && (
                      <Typography color="error">
                        <strong>Reason:</strong> {status.OBOdecline}
                      </Typography>
                    )}

                    <Typography>
                      <strong>Business Tax:</strong> {status.BUSINESSTAX}
                    </Typography>
                    {status.BUSINESSTAX === "Declined" && (
                      <Typography color="error">
                        <strong>Reason:</strong> {status.BUSINESSTAXdecline}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Grow>
      </Grid>

      {/* Modal using Dialog */}
      <Dialog
        open={!!modalData}
        onClose={() => setModalData(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: "bold", color: "#09360D" }}>
          {modalData?.title}
        </DialogTitle>
        <DialogContent dividers sx={{ whiteSpace: "pre-line" }}>
          {modalData?.content}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setModalData(null)}
            startIcon={<CloseIcon />}
            sx={{ color: "#09360D", fontWeight: "bold" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🔹 Business Assessment Dialog */}
      <AssessmentDialog
        open={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
        calculateFee={calculateAssessmentFee}
      />

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
          © {new Date().getFullYear()} Business Permit and Licensing Office |
          v3.0.5
        </Typography>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          elevation={6}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}

export default App;
