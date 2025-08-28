import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const logo = "spclogo.png";

const LoginPage = () => {
  const navigate = useNavigate();

  // local state for form values
  const [form, setForm] = useState({ email: "", password: "" });

  // handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  // handle login submit
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/userAccounts/login",
        form
      );
      const userId = res.data.user.id;

      navigate(`/homePage/${userId}`);
    } catch (err) {
      alert(err.response?.data?.error || "Invalid credentials");
    }
  };

  // go to register page
  const handleRegister = (e) => {
    e.preventDefault();
    navigate("/registerPage");
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
  );
};

export default LoginPage;
