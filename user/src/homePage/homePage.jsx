import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
// FIX: Corrected import syntax from '=>' to 'from'
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

// Helper function to format the time and date separately as required
const formatDateTime = () => {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
  const date = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });
  return { time, date };
};

const BIN = 'PLACEHOLDER_BIN';

const HomePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dateTime, setDateTime] = useState(formatDateTime());

  useEffect(() => {
    const timerId = setInterval(() => {
      setDateTime(formatDateTime());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const { time, date } = dateTime;

  const buttonStyle = {
    mt: 2,
    px: 4,
    py: 1.5,
    width: 300,
    height: 60,
    fontSize: "1.1rem",
    fontWeight: 600,
    letterSpacing: 1,
    bgcolor: "#09360D",
    color: "white",
    borderRadius: '12px', // Added rounded corners for modern look
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    "&:hover": {
      bgcolor: "#2E8B57",
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
      transform: 'translateY(-2px)'
    },
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", bgcolor: "white" }}>
      <Box
        sx={{
          bgcolor: "#09360D",
          color: "white",
          p: 1,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          width: "100%",
          height: '60px',
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            mr: 3,
          }}
        >
          <Typography variant="subtitle1" component="div" sx={{ lineHeight: 1 }}>
            {time}
          </Typography>
          <Typography variant="subtitle2" component="div" sx={{ lineHeight: 1 }}>
            {date}
          </Typography>
        </Box>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 5, sm: 3 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          color: "text.secondary",
        }}
      >
        {/* Logos Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4, // Increased gap for better logo separation
            mb: 3,
            mt: -5
          }}
        >
          {/* bplologo.png (Left, Minimized) */}
          <img
            src="/bplologo.png"
            alt="BPLO Logo"
            style={{ maxWidth: '80px', height: 'auto', display: 'block' }}
          />
          {/* bagongp.png (Center) */}
          <img
            src="/bagongp.png"
            alt="Bagong Pagasa Logo"
            style={{ maxWidth: '90px', height: '75px', display: 'block' }}
          />
          {/* spclogo.png (Right) */}
          <img
            src="/spclogo.png"
            alt="SPC Logo"
            style={{ maxWidth: '80px', height: 'auto', display: 'block' }}
          />
        </Box>

        {/* Paragraph under the logos */}
        <Typography
          variant="body1"
          align="justify"
          sx={{ mb: 4, maxWidth: '600px', lineHeight: 1.6, color: 'text.primary', fontSize: '1.1rem' }}
        >
          Welcome to the Business Permit and Licensing Office (BPLO) Application Portal. Here, you can
          conveniently track your existing applications, submit new business applications, or renew your current
          business permits with ease. Our goal is to streamline the process for entrepreneurs and businesses in
          our community.
        </Typography>

        {/* Buttons */}
        <Button
          variant="contained"
          onClick={() => navigate(`/appTracker/${id}`)}
          sx={buttonStyle}
        >
          Application Tracker
        </Button>

        <Button
          variant="contained"
          onClick={() => navigate(`/newApplicationPage/${id}`)}
          sx={buttonStyle}
        >
          New Business Application
        </Button>

        <Button
          variant="contained"
          onClick={() => navigate(`/renewPage/${id}/${BIN}`)}
          sx={buttonStyle}
        >
          Renew Business Application
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
