import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  InputAdornment,
  Link,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { styled } from "@mui/system";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Styled GreenButton
const GreenButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: "8px",
  backgroundColor: "#1c5111ff",
  color: "#fff",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    backgroundColor: "#1c5111ff",
  },  
}));

// Snackbar Alert component
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function RegisterPage() {
  const navigate = useNavigate();
  // NOTE: You'll need to define this API variable if you use it in your environment
  const API = import.meta.env.VITE_API_BASE;

  const [form, setForm] = useState({
    lastname: "",
    firstname: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "mobile") {
      if (/^\d*$/.test(value) && value.length <= 10) {
        setForm({ ...form, [id]: value });
      }
    } else {
      setForm({ ...form, [id]: value });
    }
  };

  const validate = () => {
    let newErrors = {};

    if (!form.lastname) newErrors.lastname = "Last Name is required";
    if (!form.firstname) newErrors.firstname = "First Name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.mobile) newErrors.mobile = "Mobile Number is required";
    if (!form.password) newErrors.password = "Password is required";
    if (!form.confirmPassword)
      newErrors.confirmPassword = "Confirm Password is required";

    if (form.email && !form.email.includes("@")) {
      newErrors.email = "Email must contain @";
    }
    if (form.mobile && form.mobile.length !== 10) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }
    if (form.password && form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (
      form.password &&
      form.confirmPassword &&
      form.password !== form.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setSnackbar({
        open: true,
        message: "Please correct the errors in the form.",
        severity: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const { lastname, firstname, email, password } = form;
      await axios.post(`${API}/userAccounts/register`, {
        lastname,
        firstname,
        email,
        password,
      });

      setLoading(false);
      setOpenSuccessDialog(true);
    } catch (err) {
      setLoading(false);
      const errorMessage =
        err.response?.data?.error || "Registration failed. Please try again.";
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    }
  };

  const handleCloseSuccessDialog = () => {
    setOpenSuccessDialog(false);
    navigate("/");
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          // The background image and blur are applied here
          backgroundImage: "url(mainbg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative", // Required for the pseudo-element
          padding: { xs: 2, sm: 4 },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backdropFilter: "blur(5px)", // Blurs the background image
            backgroundColor: "rgba(249, 249, 249, 0.7)", // Semi-transparent overlay
            zIndex: -1, // Pushes the overlay behind the content
          },
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: { xs: 4, sm: 6 },
            borderRadius: "16px",
            width: "100%",
            maxWidth: 400,
            textAlign: "center",
            backgroundColor: "#fff",
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Box
              component="img"
              src="/spclogo.png"
              alt="SPC Logo"
              sx={{
                height: 100,
                width: 100,
                mb: 2,
                borderRadius: "50%",
                boxShadow: "0 2px 6px rgba(13, 167, 26, 0.1)",
              }}
            />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
              Register
            </Typography>
          </Box>

          <Box
            onSubmit={handleRegister}
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="lastname"
              label="Last Name"
              value={form.lastname}
              onChange={handleChange}
              fullWidth
              error={!!errors.lastname}
              helperText={errors.lastname}
            />
            <TextField
              id="firstname"
              label="First Name"
              value={form.firstname}
              onChange={handleChange}
              fullWidth
              error={!!errors.firstname}
              helperText={errors.firstname}
            />
            <TextField
              id="email"
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              id="mobile"
              label="Mobile Number"
              value={form.mobile}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+63</InputAdornment>
                ),
              }}
              error={!!errors.mobile}
              helperText={errors.mobile}
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              fullWidth
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
            <GreenButton
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              startIcon={
                loading && <CircularProgress size={20} color="inherit" />
              }
            >
              {loading ? "Registering..." : "Register"}
            </GreenButton>

            <Typography variant="body2" sx={{ mt: 2, color: "#666" }}>
              Already have an account?{" "}
              <Link
                component="button"
                onClick={() => navigate("/")}
                sx={{ color: "#1d541fff", fontWeight: "bold" }}
              >
                Login
              </Link>
            </Typography>
          </Box>
        </Paper>

        <Dialog open={openSuccessDialog} onClose={handleCloseSuccessDialog}>
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
              Success!
            </Typography>
            <DialogContentText sx={{ color: "#555", mt: 1 }}>
              Your account has been created.
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "center", // ⬅️ centers the button horizontally
            }}
          >
            <GreenButton onClick={handleCloseSuccessDialog} variant="contained">
              Proceed to Login
            </GreenButton>
          </DialogActions>

        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>

      <style>
        {`
          @keyframes pop-in {
            0% { transform: scale(0.5); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </>
  );
}

export default RegisterPage;
