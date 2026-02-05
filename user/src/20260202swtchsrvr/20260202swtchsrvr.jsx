import React, { useState } from "react";
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export default function SwitchServer() {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return true;   // during SSR/hydration
    const v = localStorage.getItem("privacyOverlayEnabled");
    return v === null ? true : v === "true";
  });

  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [pendingValue, setPendingValue] = useState(null);
  const [error, setError] = useState(false);

  const correctPassword = "superadmin2026";

  const handleToggleRequest = (e) => {
    const newValue = e.target.checked;
    // If trying to turn it OFF → require password
    // (You can also require it for both directions — just remove the condition)
    if (newValue === false) {
      setPendingValue(newValue);
      setOpen(true);
      setError(false);
      setPassword("");
    } else {
      // Allow turning ON without password (optional — change logic if needed)
      performToggle(newValue);
    }
  };

  const performToggle = (newValue) => {
    setEnabled(newValue);
    localStorage.setItem("privacyOverlayEnabled", newValue.toString());
    setOpen(false);
    setPendingValue(null);
    setPassword("");
    setError(false);
    // Optional: window.location.reload(); or notify user
  };

  const handleConfirm = () => {
    if (password === correctPassword) {
      performToggle(pendingValue);
    } else {
      setError(true);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setPassword("");
    setError(false);
    setPendingValue(null);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 480, mx: "auto", mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Server / Privacy Control
      </Typography>

      <FormControlLabel
        control={
          <Switch
            checked={enabled}
            onChange={handleToggleRequest}
            color="primary"
          />
        }
        label={enabled ? "Privacy Overlay → ON (site blocked)" : "Privacy Overlay → OFF"}
      />

      {/* Password Dialog */}
      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle>Admin Verification Required</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Turning the privacy overlay OFF requires administrator permission.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="Enter pass key"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
            helperText={error ? "Incorrect password" : ""}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleConfirm();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}