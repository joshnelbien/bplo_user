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
import SuccessModals from "../modals/successModals"; // adjust path

function Renewal() {
  const { id } = useParams();
  const [form, setForm] = useState({
    business_name: "",
    incharge_last_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [matchedRecord, setMatchedRecord] = useState(null);

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
      const res = await axios.get(
        `${API}/businessProfile/exixting-businessProfiles`
      );

      const record = res.data.find(
        (item) =>
          item.incharge_last_name?.trim().toLowerCase() ===
            form.incharge_last_name.trim().toLowerCase() &&
          item.business_name?.trim().toLowerCase() ===
            form.business_name.trim().toLowerCase()
      );

      if (record) {
        setMatchedRecord(record);
        setSuccessOpen(true); // ✅ SHOW MODAL
      } else {
        alert("No matching record found. Please verify your inputs.");
      }
    } catch (error) {
      console.error("❌ Error searching renewal:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
    navigate(`/renewal-form/step1`, {
      state: { record: matchedRecord },
    });
  };

  return (
    <>
      {/* ✅ SUCCESS MODAL */}
      <SuccessModals
        open={successOpen}
        message="Matching record found. Proceeding to renewal form."
        onClose={handleSuccessClose}
      />

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
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
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
            />

            <TextField
              label="In-Charge Last Name"
              name="incharge_last_name"
              value={form.incharge_last_name}
              onChange={handleChange}
              required
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={loading}
              sx={{
                mt: 2,
                borderRadius: 2,
                fontWeight: "bold",
                height: 40,
                position: "relative",
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Process Renewal"
              )}
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
}

export default Renewal;
