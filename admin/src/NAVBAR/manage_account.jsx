import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Avatar,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ZoomInIcon from "@mui/icons-material/ZoomIn";

const API = import.meta.env.VITE_API_BASE;

export default function ManageAccountModal({ open, handleClose }) {
  const [form, setForm] = useState({
    FirstName: "",
    MiddleName: "",
    LastName: "",
    Email: "",
    Office: "",
    Position: "",
    profile: null,
    signatories: null,
  });

  const [previewProfile, setPreviewProfile] = useState(null);
  const [previewSign, setPreviewSign] = useState(null);

  // For viewing images
  const [viewImage, setViewImage] = useState(null);

  useEffect(() => {
    const loadAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${API}/adminAccounts/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const u = res.data;

        setForm({
          FirstName: u.FirstName,
          MiddleName: u.MiddleName,
          LastName: u.LastName,
          Email: u.Email,
          Office: u.Office,
          Position: u.Position,
          profile: null,
          signatories: null,
        });

        if (u.profile) setPreviewProfile(`data:image/png;base64,${u.profile}`);
        if (u.signatories)
          setPreviewSign(`data:image/png;base64,${u.signatories}`);
      } catch (err) {
        console.log("❌ Error loading admin:", err);
      }
    };

    if (open) loadAdmin();
  }, [open]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFile = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    setForm((prev) => ({ ...prev, [name]: file }));

    if (name === "profile") setPreviewProfile(URL.createObjectURL(file));
    if (name === "signatories") setPreviewSign(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null) fd.append(key, value);
      });

      await axios.put(`${API}/adminAccounts/update`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Account updated successfully!");
      handleClose();
      window.location.reload();
    } catch (err) {
      console.log("❌ Update error:", err);
      alert("Failed to update account.");
    }
  };

  const btnColor = "#1d5236";
  const btnHover = "#17452c";

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            background: btnColor,
            color: "white",
            fontWeight: 700,
            textAlign: "center",
          }}
        >
          Manage Account
        </DialogTitle>

        <DialogContent dividers sx={{ background: "#f5f7f5" }}>
          <Typography
            variant="subtitle1"
            sx={{ mb: 2, fontWeight: 600, color: btnColor }}
          >
            Personal Information
          </Typography>

          <Grid container spacing={2}>
            {[
              ["First Name", "FirstName"],
              ["Middle Name", "MiddleName"],
              ["Last Name", "LastName"],
              ["Email Address", "Email"],
              ["Office", "Office", true],
              ["Position", "Position"],
            ].map(([label, name, disabled]) => (
              <Grid item xs={6} key={name}>
                <TextField
                  label={label}
                  name={name}
                  fullWidth
                  size="small"
                  disabled={disabled}
                  value={form[name]}
                  onChange={handleChange}
                />
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="subtitle1"
            sx={{ mb: 2, fontWeight: 600, color: btnColor }}
          >
            Profile & Signatory
          </Typography>

          <Grid container spacing={2}>
            {/* Profile */}
            <Grid item xs={6}>
              <Box textAlign="center">
                <Avatar
                  src={previewProfile}
                  sx={{
                    width: 100,
                    height: 100,
                    margin: "auto",
                    border: `3px solid ${btnColor}`,
                  }}
                />
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<PhotoCameraIcon />}
                  sx={{
                    mt: 1,
                    background: btnColor,
                    "&:hover": { background: btnHover },
                    textTransform: "none",
                  }}
                >
                  Upload Profile
                  <input
                    type="file"
                    name="profile"
                    hidden
                    accept="image/*"
                    onChange={handleFile}
                  />
                </Button>

                {previewProfile && (
                  <Button
                    size="small"
                    startIcon={<ZoomInIcon />}
                    sx={{ mt: 1, textTransform: "none", color: btnColor }}
                    onClick={() => setViewImage(previewProfile)}
                  >
                    View Photo
                  </Button>
                )}
              </Box>
            </Grid>

            {/* Signatory */}
            <Grid item xs={6}>
              <Box textAlign="center">
                <Avatar
                  src={previewSign}
                  sx={{
                    width: 100,
                    height: 100,
                    margin: "auto",
                    border: `3px solid ${btnColor}`,
                  }}
                />
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<PhotoCameraIcon />}
                  sx={{
                    mt: 1,
                    background: btnColor,
                    "&:hover": { background: btnHover },
                    textTransform: "none",
                  }}
                >
                  Upload Signatory
                  <input
                    type="file"
                    name="signatories"
                    hidden
                    accept="image/*"
                    onChange={handleFile}
                  />
                </Button>

                {previewSign && (
                  <Button
                    size="small"
                    startIcon={<ZoomInIcon />}
                    sx={{ mt: 1, textTransform: "none", color: btnColor }}
                    onClick={() => setViewImage(previewSign)}
                  >
                    View Signature
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ background: "#f5f7f5", p: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ background: btnColor, "&:hover": { background: btnHover } }}
            onClick={handleSubmit}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ View Image Modal */}
      <Dialog open={Boolean(viewImage)} onClose={() => setViewImage(null)}>
        <DialogContent>
          <img
            src={viewImage}
            alt="Preview"
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
