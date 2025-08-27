import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";

const logo = "spclogo.png";

function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // In a real application, you would handle user registration here.
    // For now, it will simply navigate to the home page.
    navigate("/");
  };

  const handleLoginRedirect = () => {
    // This function will navigate the user to the login page.
    navigate("/loginPage");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#F0F2F5",
        padding: { xs: 2, sm: 4 },
      }}
    >
      <Paper
        elevation={10}
        sx={{
          padding: { xs: 4, sm: 6 },
          borderRadius: "16px",
          width: "100%",
          maxWidth: 400,
          textAlign: "center",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Box
            component="img"
            src={logo}
            alt="SPC Logo"
            sx={{
              height: 100,
              width: 100,
              mb: 2,
              borderRadius: "50%",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          />
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#333333",
            }}
          >
            Register
          </Typography>
        </Box>

        <Box
          onSubmit={handleRegister}
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
          {/* Email input field */}
          <TextField
            id="email"
            label="Email"
            type="email"
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

          {/* Mobile number input field with +63 adornment */}
          <TextField
            id="mobile-number"
            label="Mobile Number"
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">+63</InputAdornment>,
            }}
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

          {/* Confirm Password input field */}
          <TextField
            id="confirm-password"
            label="Confirm Password"
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

          {/* Submit button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#076e0cff",
              "&:hover": {
                backgroundColor: "#085f0cff",
              },
              borderRadius: "8px",
              fontWeight: "bold",
              py: 1.5,
              mt: 1,
            }}
          >
            Register
          </Button>

          {/* Link to login page */}
          <Typography variant="body2" sx={{ mt: 2, color: "#666666" }}>
            Already have an account?{" "}
            <Link component="button" onClick={handleLoginRedirect} sx={{ color: "#2E8B57", fontWeight: "bold" }}>
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default RegisterPage;
