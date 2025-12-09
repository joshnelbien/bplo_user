import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Button,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function AddAdminModal({ open, onClose }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const API = import.meta.env.VITE_API_BASE;

  const [formData, setFormData] = useState({
    FirstName: "",
    MiddleName: "",
    LastName: "",
    Email: "",
    Office: "",
    Position: "",
    Password: "",
    ConfirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false); // ✅ Success dialog
  const [loading, setLoading] = useState(false);

  const offices = [
    "BPLO",
    "EXAMINERS",
    "BUSINESS TAX",
    "TREASURER",
    "OBO",
    "CSWMO",
    "CENRO",
    "ZONING",
    "CHO",
    "SUPERADMIN",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateFields = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([key, val]) => {
      if (key === "MiddleName") return;
      if (!val.trim()) newErrors[key] = "This field is required";
    });

    if (formData.Password !== formData.ConfirmPassword) {
      newErrors.ConfirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    setLoading(true); // ⏳ Start loading

    try {
      await axios.post(`${API}/adminAccounts/admin-register`, formData);

      setFormData({
        FirstName: "",
        MiddleName: "",
        LastName: "",
        Email: "",
        Office: "",
        Position: "",
        Password: "",
        ConfirmPassword: "",
      });

      setSuccessOpen(true);
    } catch (err) {
      console.error(err);
      setErrors({ Email: "Email may already be registered" });
    } finally {
      setLoading(false); // ✅ Stop loading whether success or error
    }
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
    onClose(); // ✅ Close parent modal AFTER success dialog
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            width: isSmallScreen ? "90%" : "600px",
            borderRadius: 4,
            boxShadow: "0 12px 35px rgba(0,0,0,0.2)",
            background: "linear-gradient(to bottom right, #ffffff, #f9fbff)",
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: 700,
            fontSize: "1.6rem",
            color: "primary.main",
            pb: 1,
          }}
        >
          Register New Admin
        </DialogTitle>

        <DialogContent dividers sx={{ px: 4, py: 3 }}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ textAlign: "center", mb: 3 }}
          >
            Fill out all fields below to create a new admin account.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="First Name"
                  name="FirstName"
                  value={formData.FirstName}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.FirstName}
                  helperText={errors.FirstName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label="Middle Name (Optional)"
                  name="MiddleName"
                  value={formData.MiddleName}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label="Last Name"
                  name="LastName"
                  value={formData.LastName}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.LastName}
                  helperText={errors.LastName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="Email"
                  type="email"
                  value={formData.Email}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.Email}
                  helperText={errors.Email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  <TextField
                    select
                    label="Office"
                    name="Office"
                    value={formData.Office}
                    onChange={handleChange}
                    required
                    error={!!errors.Office}
                    helperText={errors.Office}
                    sx={{ width: "250px" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  >
                    {offices.map((office) => (
                      <MenuItem key={office} value={office}>
                        {office}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    label="Position"
                    name="Position"
                    value={formData.Position}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.Position}
                    helperText={errors.Position}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <WorkIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Password"
                  name="Password"
                  type={showPassword ? "text" : "password"}
                  value={formData.Password}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.Password}
                  helperText={errors.Password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Confirm Password"
                  name="ConfirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.ConfirmPassword}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.ConfirmPassword}
                  helperText={errors.ConfirmPassword}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: 4,
            py: 2.5,
            borderTop: "1px solid #e0e0e0",
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            color="error"
            sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ borderRadius: 2, textTransform: "none", px: 3 }}
          >
            {loading ? (
              <span
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <CircularProgress size={20} /> Processing...
              </span>
            ) : (
              "Register Admin"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Success Alert Dialog */}
      <Dialog open={successOpen} onClose={handleSuccessClose}>
        <DialogTitle>✅ Success</DialogTitle>
        <DialogContent>
          <Typography>Admin successfully registered!</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSuccessClose}
            variant="contained"
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddAdminModal;
