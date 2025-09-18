import { MenuItem, Stack, TextField, Typography } from "@mui/material";

export default function Step1BusinessInfo({ formData, handleChange, errors }) {
  const regLabelMap = {
    "Sole Proprietorship": "DTI Registration No.",
    Corporation: "SEC Registration No.",
    "One Person Corporation": "SEC Registration No.",
    Partnership: "SEC Registration No.",
    Cooperative: "CDA Registration No.",
  };

  const regLabel = regLabelMap[formData.BusinessType] || "Registration No.";

  // ✅ Convert text to uppercase before saving
  const handleUppercaseChange = (e) => {
    const value = (e.target.value || "").toUpperCase();
    handleChange({ target: { name: e.target.name, value } });
  };

  // ✅ Numbers only, no letters, still uppercase-safe
  const handleNumberInput = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 15);
    handleChange({ target: { name: e.target.name, value } });
  };

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
          onChange={handleUppercaseChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          // Add error props
          error={!!errors.BusinessType}
          helperText={errors.BusinessType}
        >
          <MenuItem value="">Select Business Type</MenuItem>
          <MenuItem value="SOLE PROPRIETORSHIP">Sole Proprietorship</MenuItem>
          <MenuItem value="CORPORATION">Corporation</MenuItem>
          <MenuItem value="ONE PERSON CORPORATION">
            One Person Corporation
          </MenuItem>
          <MenuItem value="PARTNERSHIP">Partnership</MenuItem>
          <MenuItem value="COOPERATIVE">Cooperative</MenuItem>
        </TextField>

        {/* Dynamic Registration No. */}
        <TextField
          label={regLabel}
          name="dscRegNo"
          value={formData.dscRegNo || ""}
          onChange={handleUppercaseChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          // Add error props (assuming this isn't required by default)
          error={!!errors.dscRegNo}
          helperText={errors.dscRegNo}
        />

        {/* Business Name */}
        <TextField
          label="Business Name"
          name="businessName"
          value={formData.businessName || ""}
          onChange={handleUppercaseChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          // Add error props
          error={!!errors.businessName}
          helperText={errors.businessName}
        />

        {/* TIN No. (numbers only, no uppercase conversion needed) */}
        <TextField
          label="TIN No."
          name="tinNo"
          value={formData.tinNo || ""}
          onChange={handleNumberInput}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          // Add error props
          error={!!errors.tinNo}
          helperText={errors.tinNo}
        />

        {/* Trade Name */}
        <TextField
          label="Trade Name"
          name="TradeName"
          value={formData.TradeName || ""}
          onChange={handleUppercaseChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          // Add error props
          error={!!errors.TradeName}
          helperText={errors.TradeName}
        />
      </Stack>
    </div>
  );
}
