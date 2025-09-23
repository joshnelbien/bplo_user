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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { IconButton, Menu, MenuItem } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const SearchBar = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid #09360D",
  borderRadius: 0,
  overflow: "hidden",
  width: "300px",
  backgroundColor: "#f9f9f9",
  mt: 2,
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  flexGrow: 1,
  px: theme.spacing(2),
  py: theme.spacing(1),
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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (value) => {
    console.log("Selected:", value);
    setAnchorEl(null);
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
    <Box>
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
        <Slide in={animate} direction="down" timeout={800}>
          <Box
            component="img"
            src="/spc.png"
            alt="Logo"
            sx={{ width: { xs: 150, sm: 120 }, mb: 5 }}
          />
        </Slide>

        <Slide in={animate} direction="down" timeout={1000}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 900,
              color: "#09360D",
              fontSize: { xs: "1.8rem", sm: "3rem" },
            }}
          >
            BUSINESS REGISTRATION
          </Typography>
        </Slide>

        <Fade in={animate} timeout={2500}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <Button
              variant="contained"
              sx={{
                px: 2,
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

            <Button
              variant="outlined"
              sx={{
                px: 2,
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
          </Box>
        </Fade>

        {/* Centered Search Bar */}
        <Box
          sx={{
            mt: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1, // space between search bar and button
            flexWrap: "wrap", // responsive wrapping on small screens
          }}
        >
          <SearchBar
            sx={{ display: "flex", alignItems: "center", maxWidth: 220 }}
          >
            <SearchInput
              placeholder="Track your application..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <IconButton onClick={handleClick}>
              <ArrowDropDownIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={() => handleSelect("New")}>
                New Application
              </MenuItem>
              <MenuItem onClick={() => handleSelect("Renew")}>Renewal</MenuItem>
            </Menu>
          </SearchBar>
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
          >
            Track
          </Button>
        </Box>
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
          © {new Date().getFullYear()} Business Permit and Licensing Office |
          v3.0.4
        </Typography>
      </Box>
    </Box>
  );
}

export default App;
