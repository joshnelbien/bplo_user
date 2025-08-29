import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CircularProgress from "@mui/material/CircularProgress"; // Optional: for a loading spinner
import CheckIcon from "@mui/icons-material/Check"; // If you have @mui/icons-material installed

import { useNavigate } from "react-router-dom";
import React from "react";

function Login() {
  const navigate = useNavigate();
  const [openSuccessDialog, setOpenSuccessDialog] = React.useState(false); // State for the success dialog

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Attempting to log in...");

    // Show the "Login successful" dialog
    setOpenSuccessDialog(true);

    // Wait for 2 seconds before navigating
    setTimeout(() => {
      setOpenSuccessDialog(false); // Close the dialog
      navigate("/dashboard");
    }, 2000); // 2000ms delay
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
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            borderRadius: 2,
            width: "100%",
            maxWidth: 400,
            textAlign: "center",
          }}
        >
          <Box sx={{ mb: 2 }}>
            <img
              src="./spclogo.png"
              alt="City of San Pablo Official Seal"
              style={{ width: 100 }}
            />
          </Box>

          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
            Login
          </Typography>

          <Box
            onSubmit={handleLogin}
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#cccccc" },
                  "&:hover fieldset": { borderColor: "#999999" },
                  "&.Mui-focused fieldset": { borderColor: "#666666" },
                },
                "& .MuiInputBase-input": { padding: "12px 14px" },
              }}
            />

            <TextField
              id="password"
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#cccccc" },
                  "&:hover fieldset": { borderColor: "#999999" },
                  "&.Mui-focused fieldset": { borderColor: "#666666" },
                },
                "& .MuiInputBase-input": { padding: "12px 14px" },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#4CAF50",
                "&:hover": { backgroundColor: "#45a049" },
                py: 1.5,
                fontSize: "1rem",
                textTransform: "uppercase",
                boxShadow: "none",
              }}
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Success Dialog */}
      <Dialog
        open={openSuccessDialog}
        aria-labelledby="login-success-dialog"
        PaperProps={{
          sx: {
            borderRadius: 2, // Apply rounded corners to the dialog paper
            minWidth: 300, // Adjust min-width as needed
            textAlign: "center",
          },
        }}
        // disableBackdropClick // Uncomment to prevent closing on outside click
        // disableEscapeKeyDown // Uncomment to prevent closing on Escape key
      >
        <DialogContent sx={{ padding: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2, // Space between elements
            }}
          >
            {/* Checkmark Icon */}
            {/* If @mui/icons-material is installed, use <CheckCircleOutlineIcon sx={{ fontSize: 60, color: '#4CAF50' }} /> */}
            {/* Otherwise, use a styled Box as a placeholder */}
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                backgroundColor: "#4CAF50", // Green background
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white", // White checkmark
                fontSize: 40,
                fontWeight: "bold",
                // Using CheckIcon from @mui/icons-material
                // If not installed, you might just use a div with content '✓'
              }}
            >
              <CheckIcon sx={{ fontSize: 40 }} />
            </Box>

            <Typography
              variant="h5"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              Login Successful!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Redirecting to your dashboard...
            </Typography>
            {/* Optional: A small loading spinner */}
            <CircularProgress size={20} sx={{ mt: 1, color: "#4CAF50" }} />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Login;
