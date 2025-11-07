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
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

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

  // ✅ Load current admin data
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

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    setForm((prev) => ({ ...prev, [name]: file }));

    if (name === "profile") setPreviewProfile(URL.createObjectURL(file));
    if (name === "signatories") setPreviewSign(URL.createObjectURL(file));
  };

  // ✅ Submit
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
      window.location.reload(); // refresh topbar info
    } catch (err) {
      console.log("❌ Update error:", err);
      alert("Failed to update account.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Manage Account</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="First Name"
              fullWidth
              name="FirstName"
              value={form.FirstName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Middle Name"
              fullWidth
              name="MiddleName"
              value={form.MiddleName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Last Name"
              fullWidth
              name="LastName"
              value={form.LastName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Email"
              fullWidth
              name="Email"
              value={form.Email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Office"
              fullWidth
              name="Office"
              value={form.Office}
              disabled
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Position"
              fullWidth
              name="Position"
              value={form.Position}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6}>
            <Typography mb={1}>Profile Photo</Typography>
            <Avatar
              src={previewProfile}
              sx={{ width: 80, height: 80, mb: 1 }}
            />
            <input
              type="file"
              name="profile"
              accept="image/*"
              onChange={handleFile}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography mb={1}>Signatory Image</Typography>
            <Avatar src={previewSign} sx={{ width: 80, height: 80, mb: 1 }} />
            <input
              type="file"
              name="signatories"
              accept="image/*"
              onChange={handleFile}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
