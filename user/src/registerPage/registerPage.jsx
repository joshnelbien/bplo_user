import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const logo = "/spclogo.png";

function RegisterPage() {
  const navigate = useNavigate();

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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;

    // mobile validation: numbers only, max 10
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

    if (!form.email.includes("@")) {
      newErrors.email = "Email must contain @";
    }
    if (form.mobile.length !== 10) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOpenSuccessDialog(true);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.error || "Registration failed",
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
          backgroundColor: "#f9f9f9",
          padding: { xs: 2, sm: 4 },
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
              src={logo}
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
            />
            <TextField
              id="firstname"
              label="First Name"
              value={form.firstname}
              onChange={handleChange}
              fullWidth
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
                startAdornment: <InputAdornment position="start">+63</InputAdornment>,
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
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#2e7d32",
                "&:hover": { backgroundColor: "#388e3c" },
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              Register
            </Button>

            <Typography variant="body2" sx={{ mt: 2, color: "#666" }}>
              Already have an account?{" "}
              <Link
                component="button"
                onClick={() => navigate("/")}
                sx={{ color: "#2e7d32", fontWeight: "bold" }}
              >
                Login
              </Link>
            </Typography>
          </Box>
        </Paper>

        {/* Success Dialog - clean style */}
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
          <DialogActions>
            <Button
              onClick={handleCloseSuccessDialog}
              variant="contained"
              sx={{ textTransform: "none" }}
            >
              Proceed to Login
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for errors */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
          >
            {snackbar.message}
          </MuiAlert>
        </Snackbar>
      </Box>

      {/* Simple animation */}
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
