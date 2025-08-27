import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

// Updated the logo to use a file path. You should place the 'spclogo.png' file
// in your project's 'public' directory for it to be accessible this way.
const logo = "spclogo.png";


const LoginPage = () => {
  // Hook to handle navigation between pages.
  const navigate = useNavigate();

  // Function to handle the form submission for login.
  const handleLogin = (e) => {
    e.preventDefault();
    // In a real application, you would handle authentication here before navigating.
    navigate("/homePage");
  };

  // Function to handle the register button click.
  const handleRegister = (e) => {
    e.preventDefault();
    navigate("/registerPage");
  };

  return (
    // Main container for the login page.
    // The background is now a solid white.
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#F0F2F5", // A light gray background for a clean look
        padding: { xs: 2, sm: 4 }, // Responsive padding
      }}
    >
      {/* The login card. Styled with a solid white background, rounded corners, and a shadow. */}
      <Paper
        elevation={10}
        sx={{
          padding: { xs: 4, sm: 6 }, // Responsive padding
          borderRadius: "16px",
          width: "100%",
          maxWidth: 400,
          textAlign: "center",
          backgroundColor: "#FFFFFF", // White background for the card
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Logo and title container */}
        <Box sx={{ mb: 3 }}>
          {/* Custom logo image */}
          <Box
            component="img"
            src={logo} // Use the file path here
            alt="SPC Logo"
            sx={{
              height: 100,
              width: 100,
              mb: 2,
              borderRadius: "50%",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          />
          {/* Title for the login form */}
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#333333", // Dark color for text on a white background
            }}
          >
            Login
          </Typography>
        </Box>

        {/* Form container. Uses flexbox to stack elements with responsive spacing. */}
        <Box
          onSubmit={handleLogin}
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
          }}
          noValidate
          autoComplete="off"
        >
          {/* Username input field */}
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#CCCCCC",
                },
                "&:hover fieldset": {
                  borderColor: "#2E8B57",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#2E8B57",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#666666",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#2E8B57",
              },
            }}
          />

          {/* Password input field */}
          <TextField
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#CCCCCC",
                },
                "&:hover fieldset": {
                  borderColor: "#2E8B57",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#2E8B57",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#666666",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#2E8B57",
              },
            }}
          />

          {/* Login button with dark green color and a subtle box shadow */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#2E8B57", // Dark green
              "&:hover": {
                backgroundColor: "#3CB371", // Lighter green on hover
              },
              borderRadius: "8px",
              fontWeight: "bold",
              py: 1.5,
              mt: 1, // Margin-top to create some space
            }}
          >
            Login
          </Button>

          {/* Register button with a similar style */}
          <Button
            onClick={handleRegister}
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#2E8B57", // Dark green
              "&:hover": {
                backgroundColor: "#3CB371", // Lighter green on hover
              },
              borderRadius: "8px",
              fontWeight: "bold",
              py: 1.5,
            }}
          >
            Register
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
