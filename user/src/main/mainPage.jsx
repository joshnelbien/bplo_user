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
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

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

function App() {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchValue, setSearchValue] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [modalTitle, setModalTitle] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info", // "success" | "error" | "warning" | "info"
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalContent("");
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle dropdown selection
  const handleSelect = (value) => {
    setAnchorEl(null);

    if (value === "New Application Requirements") {
      setModalTitle("REQUIREMENTS FOR NEW BUSINESS REGISTRATION");
      setModalContent(
        `1. Filled-up Unified Business Permit Application Form
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
9. Market Clearance (if stallholder)`
      );
    } else if (value === "Renewal Requirements") {
      setModalTitle("REQUIREMENTS FOR BUSINESS RENEWAL");
      setModalContent(
        `1. Filled-up Unified Business Permit Application Form
2. Previous year's Mayor's Permit
3. Financial Statement / Income Tax Return of the previous year / Statement of Gross Sales / Receipt
4. Barangay Clearance (Window 1 - BPLD)
5. Land Tax Clearance / Certificate of Payment
6. Market Clearance (if market stall holder)`
      );
    }

    setIsModalOpen(true);
  };

  // Optional: Track button behavior (if you want to type in search bar then Track)
  // Track button behavior
  const handleTrackClick = () => {
    if (!searchValue.trim()) {
      setSnackbar({
        open: true,
        message: "⚠️ Please enter your tracking details before proceeding.",
        severity: "warning",
      });
      return;
    }

    if (searchValue.toLowerCase().includes("new")) {
      handleSelect("New Application Requirements");
    } else if (searchValue.toLowerCase().includes("renew")) {
      handleSelect("Renewal Requirements");
    } else {
      setSnackbar({
        open: true,
        message:
          "❌ No matching record found. Please enter a valid requirement.",
        severity: "error",
      });
    }
  };

  // Update time every second
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
            <Typography
              sx={{ fontWeight: "bold", lineHeight: 1, fontSize: ".9rem" }}
            >
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
        justifyContent="flex-start"
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
              alt="Logo"
              sx={{ width: { xs: 150, sm: 120 }, mb: 5 }}
            />
          </Grow>
        </Slide>

        {/* Title */}
        <Slide in={animate} direction="down" timeout={1000}>
          <Fade in={animate} timeout={1500}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
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
                color: "white",
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

        {/* Search Bar */}
        <Grow in={animate} timeout={2200}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              flexWrap: "wrap",
              mb: 2,
            }}
          >
            <SearchBar>
              <SearchInput
                placeholder="Enter a valid BIN number"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
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
                <IconButton onClick={handleClick}>
                  <ArrowDropDownIcon />
                </IconButton>
              </Box>

              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem
                  onClick={() => handleSelect("New Application Requirements")}
                >
                  New Application Requirements
                </MenuItem>
                <MenuItem onClick={() => handleSelect("Renewal Requirements")}>
                  Renewal Requirements
                </MenuItem>
              </Menu>
            </SearchBar>

            {/* Track Button */}
            <Button
              variant="contained"
              sx={{
                px: 3,
                py: 1,
                fontWeight: "bold",
                backgroundColor: "#09360D",
                color: "white",
                "&:hover": { backgroundColor: "#07270a" },
              }}
              onClick={handleTrackClick}
            >
              Track
            </Button>
          </Box>
        </Grow>
      </Grid>

      {/* Modal */}
      {isModalOpen && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          }}
        >
          <Box
            sx={{
              position: "relative",
              maxWidth: 300,
              p: 4,
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: 24,
            }}
          >
            <IconButton
              onClick={handleModalClose}
              sx={{ position: "absolute", top: 8, right: 8, color: "black" }}
            >
              <CloseIcon />
            </IconButton>

            {/* Title Header */}
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", mb: 2, color: "#09360D" }}
            >
              {modalTitle}
            </Typography>

            {/* Requirements List */}
            <Typography
              variant="body1"
              sx={{ whiteSpace: "pre-line", textAlign: "left" }}
            >
              {modalContent}
            </Typography>
          </Box>
        </Box>
      )}

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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // 🔥 move to top
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
