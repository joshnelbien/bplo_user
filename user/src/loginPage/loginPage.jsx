import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const logo = "spclogo.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_BASE;

  const [form, setForm] = useState({ email: "", password: "" });
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);

  // handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  // handle login submit
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/userAccounts/login`, form);
      const userId = res.data.user.id;

      // show success dialog first
      setOpenSuccessDialog(true);

      setTimeout(() => {
        setOpenSuccessDialog(false);
        navigate(`/homePage/${userId}`);
      }, 1500);
    } catch (err) {
      // only show error dialog
      setOpenErrorDialog(true);

      setTimeout(() => {
        setOpenErrorDialog(false);
      }, 1500);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    navigate("/registerPage");
  };

  return (
    <>
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#CCCCCC" },
                  "&:hover fieldset": { borderColor: "#2E8B57" },
                  "&.Mui-focused fieldset": { borderColor: "#2E8B57" },
                },
                "& .MuiInputLabel-root": { color: "#666666" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#2E8B57" },
              }}
            />

            <TextField
              id="password"
              label="Password"
              type="password"
              value={form.password}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#CCCCCC" },
                  "&:hover fieldset": { borderColor: "#2E8B57" },
                  "&.Mui-focused fieldset": { borderColor: "#2E8B57" },
                },
                "& .MuiInputLabel-root": { color: "#666666" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#2E8B57" },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#2E8B57",
                "&:hover": { backgroundColor: "#3CB371" },
                borderRadius: "8px",
                fontWeight: "bold",
                py: 1.5,
                mt: 1,
              }}
            >
              Login
            </Button>

            <Button
              onClick={handleRegister}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#2E8B57",
                "&:hover": { backgroundColor: "#3CB371" },
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

      {/* Error Dialog with ❌ */}
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
            Invalid email or password.
          </DialogContentText>
        </DialogContent>
      </Dialog>

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
