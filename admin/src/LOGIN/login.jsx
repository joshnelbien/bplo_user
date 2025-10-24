import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Dialog,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const API = import.meta.env.VITE_API_BASE;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 🔹 Temporary hardcoded SuperAdmin login
      if (email === "superadmin@gmail.com" && password === "adminpassword") {
        const superAdmin = {
          Email: "superadmin@gmail.com",
          Office: "SUPERADMIN",
          Role: "SUPERADMIN",
          Name: "System Administrator",
        };

        const fakeToken = "superadmin-token-123";

        // Save to localStorage
        localStorage.setItem("adminData", JSON.stringify(superAdmin));
        localStorage.setItem("token", fakeToken);

        setOpenSuccessDialog(true);

        // Redirect to SuperAdmin dashboard (you can change this path)
        setTimeout(() => {
          setOpenSuccessDialog(false);
          navigate("/dashboard");
        }, 2000);

        return; // ✅ Stop here, no backend call needed
      }

      // 🔹 Otherwise, continue with backend authentication
      const response = await axios.post(`${API}/adminAccounts/admin-login`, {
        Email: email,
        Password: password,
      });

      if (response.status === 200) {
        const { token, admin } = response.data;

        localStorage.setItem("adminData", JSON.stringify(admin));
        localStorage.setItem("token", token);

        setOpenSuccessDialog(true);

        const officeRoutes = {
          BPLO: "/dashboard",
          EXAMINERS: "/examiners",
          "BUSINESS TAX": "/businessTax",
          TREASURER: "/treasurers",
          OBO: "/obo",
          CSWMO: "/cmswo",
          CENRO: "/cenro",
          ZONING: "/zoning",
          CHO: "/cho",
        };

        const redirectPath =
          officeRoutes[admin.Office?.toUpperCase()] || "/dashboard";

        setTimeout(() => {
          setOpenSuccessDialog(false);
          navigate(redirectPath);
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) setError("Email not found");
      else if (err.response?.status === 401) setError("Incorrect password");
      else setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #ffffff, #e8f5e9)",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{ padding: 4, borderRadius: 2, textAlign: "center" }}
        >
          <Box sx={{ mb: 2 }}>
            <img
              src="./spclogo.png"
              alt="City of San Pablo Official Seal"
              style={{ width: 100 }}
            />
          </Box>

          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Admin Login
          </Typography>

          <Box
            onSubmit={handleLogin}
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}
          >
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />

            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: "#034d06ff",
                "&:hover": { backgroundColor: "#45a049" },
                py: 1.5,
                fontSize: "1rem",
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* ✅ Success Dialog */}
      <Dialog
        open={openSuccessDialog}
        PaperProps={{
          sx: { borderRadius: 2, minWidth: 300, textAlign: "center" },
        }}
      >
        <DialogContent sx={{ padding: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                backgroundColor: "#4CAF50",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
              }}
            >
              <CheckIcon sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Login Successful!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Redirecting to your dashboard...
            </Typography>
            <CircularProgress size={20} sx={{ mt: 1, color: "#4CAF50" }} />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Login;
