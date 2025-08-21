import { MenuItem, Stack, TextField, Typography } from "@mui/material";

export default function Step1BusinessInfo({ formData, handleChange }) {
  const regLabelMap = {
    "Sole Proprietorship": "DTI Registration No.",
    "Corporation": "SEC Registration No.",
    "One Person Corporation": "SEC Registration No.",
    "Partnership": "SEC Registration No.",
    "Cooperative": "CDA Registration No.",
  };

  const regLabel = regLabelMap[formData.BusinessType] || "Registration No.";

  return (
    <div style={{ marginBottom: 20 }}>
      <Typography variant="h6" gutterBottom>
        Business Information
      </Typography>

      <Stack spacing={3}>
        {/* Business Type Dropdown */}
        <TextField
          select
          label="Business Type"
          name="BusinessType"
          value={formData.BusinessType || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        >
          <MenuItem value="">Select Business Type</MenuItem>
          <MenuItem value="Sole Proprietorship">Sole Proprietorship</MenuItem>
          <MenuItem value="Corporation">Corporation</MenuItem>
          <MenuItem value="One Person Corporation">One Person Corporation</MenuItem>
          <MenuItem value="Partnership">Partnership</MenuItem>
          <MenuItem value="Cooperative">Cooperative</MenuItem>
        </TextField>

        {/* Dynamic Registration No. */}
        <TextField
          label={regLabel}
          name="dscRegNo"
          value={formData.dscRegNo || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        {/* Business Name */}
        <TextField
          label="Business Name"
          name="businessName"
          value={formData.businessName || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        {/* TIN No. without mask */}
        <TextField
          label="TIN No."
          name="tinNo"
          value={formData.tinNo || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        {/* Trade Name */}
        <TextField
          label="Trade Name"
          name="TradeName"
          value={formData.TradeName || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />
      </Stack>
    </div>
  );
}
