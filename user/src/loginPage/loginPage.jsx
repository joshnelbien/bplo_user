/* eslint-disable no-unused-vars */
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  Paper,
  Snackbar,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { styled } from "@mui/system";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const logo = "spclogo.png";
const mainBackground = "mainbg.png";

// Styled GreenButton
const GreenButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: "8px",
  ...(variant === "contained" && {
    backgroundColor: "#1c5111ff",
    color: "#fff",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    "&:hover": {
      backgroundColor: "#1c5111ff",
    },
  }),
  ...(variant === "outlined" && {
    borderColor: "#22361C",
    color: "#22361C",
    "&:hover": {
      backgroundColor: "rgba(34, 54, 28, 0.08)",
      borderColor: "#22361C",
    },
  }),
}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const LoginPage = () => {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_BASE;
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem("userId");
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!form.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setSnackbarState({
        open: true,
        message: "Please correct the errors in the form",
        severity: "error",
      });
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API}/userAccounts/login`, form, {
        headers: { "Content-Type": "application/json" },
      });

      const user = res.data.user;
      if (!user?.id) {
        throw new Error("User ID not found in response");
      }

      localStorage.setItem("userId", user.id);

      setOpenSuccessDialog(true);

      setTimeout(() => {
        setOpenSuccessDialog(false);
        navigate(`/homePage/me`);
      }, 1500);
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      const errorMessage =
        err.response?.data?.error ||
        "Invalid email or password. Please try again.";

      setOpenErrorDialog(true);
      setSnackbarState({
        open: true,
        message: errorMessage,
        severity: "error",
      });
      setTimeout(() => setOpenErrorDialog(false), 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    navigate("/registerPage");
  };

  const handleSnackbarClose = () => {
    setSnackbarState({ ...snackbarState, open: false });
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: { xs: 2, sm: 4 },
          backgroundImage: `url(${mainBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
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
            backgroundColor: "#ffffff",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
            mr: { xs: 0, sm: 10 },
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
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.1) rotate(5deg)",
                },
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
              Login
            </Typography>
          </Box>
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
            <TextField
              id="email"
              label="Email"
              value={form.email}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#1c5111ff",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1c5111ff",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#1c5111ff",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#1c5111ff",
                },
              }}
            />
            <TextField
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#1c5111ff", // Green border when not focused
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1c5111ff", // Green outline on focus
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#1c5111ff", // Green label color
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#1c5111ff", // Green label color when focused
                },
              }}
            />
            <GreenButton
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ py: 1.5, mt: 1 }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                "Login"
              )}
            </GreenButton>
            <GreenButton
              onClick={handleRegister}
              variant="contained"
              fullWidth
              sx={{ py: 1.5 }}
            >
              Register
            </GreenButton>
          </Box>
        </Paper>
      </Box>

      {/* Success Dialog */}
      <Dialog open={openSuccessDialog}>
        <DialogContent
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 4,
          }}
        >
          <CheckCircleIcon
            sx={{
              fontSize: 80,
              color: "#4caf50",
              animation: "pop-in 0.6s ease-out",
            }}
          />
          <Typography variant="h5" sx={{ fontWeight: "bold", mt: 2 }}>
            Login Successful!
          </Typography>
          <DialogContentText sx={{ color: "#555", mt: 1 }}>
            Redirecting to your dashboard...
          </DialogContentText>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={openErrorDialog}>
        <DialogContent
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 4,
          }}
        >
          <CancelIcon
            sx={{
              fontSize: 80,
              color: "#f44336",
              animation: "shake 0.5s ease-in-out",
            }}
          />
          <Typography variant="h5" sx={{ fontWeight: "bold", mt: 2 }}>
            Login Failed!
          </Typography>
          <DialogContentText sx={{ color: "#555", mt: 1 }}>
            {snackbarState.message || "Invalid email or password."}
          </DialogContentText>
        </DialogContent>
      </Dialog>

      {/* Snackbar for additional feedback */}
      <Snackbar
        open={snackbarState.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarState.severity}
          sx={{
            backgroundColor:
              snackbarState.severity === "success" ? "#4caf50" : "#f44336",
          }}
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>

      {/* Animations */}
      <style>
        {`
          @keyframes pop-in {
            0% { transform: scale(0.5); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
            100% { transform: translateX(0); }
          }
        `}
      </style>
    </>
  );
};

export default LoginPage;
