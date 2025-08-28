import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // make sure you installed axios
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

  const [form, setForm] = useState({
    lastname: "",
    firstname: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/userAccounts/register",
        {
          lastname: form.lastname,
          firstname: form.firstname,
          email: form.email,
          password: form.password, // backend hashes this
        }
      );

      alert(res.data.message);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Registration failed");
    }
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
          {/* Last Name input */}
          <TextField
            id="lastname"
            label="Last Name"
            value={form.lastname}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />

          {/* First Name input */}
          <TextField
            id="firstname"
            label="First Name"
            value={form.firstname}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />

          {/* Email input */}
          <TextField
            id="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />

          {/* Mobile number input with +63 */}
          <TextField
            id="mobile"
            label="Mobile Number"
            value={form.mobile}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">+63</InputAdornment>
              ),
            }}
          />

          {/* Password input */}
          <TextField
            id="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />

          {/* Confirm Password input */}
          <TextField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />

          {/* Submit button */}
          <Button type="submit" variant="contained" fullWidth>
            Register
          </Button>

          {/* Link to login page */}
          <Typography variant="body2" sx={{ mt: 2, color: "#666666" }}>
            Already have an account?{" "}
            <Link
              component="button"
              onClick={(e) => {
                e.preventDefault(); // stop form submit
                navigate("/");
              }}
              sx={{ color: "#2E8B57", fontWeight: "bold" }}
            >
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default RegisterPage;
