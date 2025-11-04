import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Renewal() {
  const { id } = useParams();
  const [form, setForm] = useState({
    business_name: "",
    incharge_last_name: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_BASE;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value.toUpperCase() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("🔍 Searching for:");
      console.log("   Last Name:", form.incharge_last_name);
      console.log("   Business Name:", form.business_name);

      const res = await axios.get(`${API}/businessProfile/businessProfiles`);

      const matchedRecord = res.data.find(
        (item) =>
          item.incharge_last_name?.trim().toLowerCase() ===
            form.incharge_last_name.trim().toLowerCase() &&
          item.business_name?.trim().toLowerCase() ===
            form.business_name.trim().toLowerCase()
      );

      if (matchedRecord) {
        console.log("✅ Matching record found:", matchedRecord);
        navigate(`/renewal-form/step1`, { state: { record: matchedRecord } });
      } else {
        alert(
          "No matching record found. Please verify the Business Name and Last Name."
        );
      }
    } catch (error) {
      console.error("❌ Error searching renewal:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
      <Button
        onClick={() => navigate(`/`)}
        variant="contained"
        color="success"
        sx={{ maxWidth: 180, mb: 3, borderRadius: 2 }}
      >
        Back to Home
      </Button>

      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
          Renewal Application Form
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          display="grid"
          gap={2}
          mt={2}
        >
          <TextField
            label="Business Name"
            name="business_name"
            value={form.business_name}
            onChange={handleChange}
            required
            fullWidth
            color="primary"
          />

          <TextField
            label="In-Charge Last Name"
            name="incharge_last_name"
            value={form.incharge_last_name}
            onChange={handleChange}
            required
            fullWidth
            color="primary"
          />

          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={loading}
            sx={{
              mt: 2,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
              position: "relative",
              height: 40,
            }}
          >
            {loading ? (
              <>
                <CircularProgress
                  size={24}
                  sx={{
                    color: "white",
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
                <span style={{ visibility: "hidden" }}>Processing...</span>
              </>
            ) : (
              "Process Renewal"
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Renewal;
