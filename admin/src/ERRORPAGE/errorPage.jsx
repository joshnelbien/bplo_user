import { Box, Typography, Button } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";

export default function Forbidden() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        bgcolor: "#f8f9fa",
        p: 3,
      }}
    >
      <Box
        sx={{
          bgcolor: "white",
          p: 5,
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          maxWidth: 450,
          width: "100%",
        }}
      >
        <LockIcon sx={{ fontSize: 70, color: "error.main", mb: 2 }} />

        <Typography variant="h4" fontWeight={700} mb={1} color="error.main">
          403 - Access Denied
        </Typography>

        <Typography variant="body1" mb={3}>
          Sorry, you do not have permission to view this page.
        </Typography>

        <Button variant="contained" fullWidth onClick={() => navigate("/")}>
          Back to Login
        </Button>
      </Box>
    </Box>
  );
}
