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
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Renewal() {
  const { id } = useParams();
  const [renewals, setRenewals] = useState([]);
  const [form, setForm] = useState({
    business_name: "",
    bin: "",
  });
  const [loading, setLoading] = useState(false); // ✅ Processing state

  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_BASE;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // ✅ Fetch existing records
  useEffect(() => {
    const fetchRenewals = async () => {
      try {
        const res = await axios.get(`${API}/businessProfile/businessProfiles`);
        if (Array.isArray(res.data)) {
          const sortedData = res.data.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          setRenewals(sortedData);
        } else {
          console.warn("⚠️ Unexpected response format:", res.data);
        }
      } catch (error) {
        console.error("❌ Error fetching renewals:", error);
      }
    };
    fetchRenewals();
  }, [API]);

  const formatBIN = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 18);
    if (digits.length <= 7) return digits;
    if (digits.length <= 11) return `${digits.slice(0, 7)}-${digits.slice(7)}`;
    return `${digits.slice(0, 7)}-${digits.slice(7, 11)}-${digits.slice(
      11,
      18
    )}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "bin") {
      setForm({ ...form, bin: formatBIN(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const binDigitsOnly = form.bin.replace(/\D/g, "");
    if (binDigitsOnly.length !== 18) {
      alert("BIN must follow the format 0000000-0000-0000000 (18 digits).");
      return;
    }

    setLoading(true); // ✅ Start processing

    try {
      console.log("🔍 Searching for EXACT record with:");
      console.log("BIN:", form.bin);
      console.log("Business Name:", form.business_name);

      const matchedRecord = renewals.find(
        (item) =>
          item.bin === form.bin && item.business_name === form.business_name
      );

      if (matchedRecord) {
        console.log("✅ Exact Matching Record Found:", matchedRecord);
        navigate(`/renewal-form/step1`, {
          state: { record: matchedRecord },
        });
      } else {
        console.warn(
          "⚠️ No exact matching record found for BIN and Business Name."
        );
        alert(
          "No matching record found. Please check your BIN and Business Name."
        );
      }
    } catch (error) {
      console.error("❌ Error processing renewal:", error);
      alert("An error occurred while processing. Please try again.");
    } finally {
      setLoading(false); // ✅ End processing
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
            label="Business Identification Number (BIN)"
            name="bin"
            value={form.bin}
            onChange={handleChange}
            required
            fullWidth
            color="primary"
            placeholder="0000000-0000-0000000"
            helperText="BIN must follow the format 0000000-0000-0000000"
          />

          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={loading} // ✅ Disable while processing
            sx={{
              mt: 2,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
              position: "relative",
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
