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

  // ✅ Corrected TIN input: 9 digits, formatted as XXX-XX-XXXX
  const handleTINInput = (e) => {
    // Extract only digits from the input and limit to 9
    let digits = e.target.value.replace(/[^0-9]/g, "").slice(0, 9);

    // Build the formatted string
    let formatted = "";
    if (digits.length > 0) {
      formatted = digits.slice(0, 3);
    }
    if (digits.length > 3) {
      formatted += "-" + digits.slice(3, 5);
    }
    if (digits.length > 5) {
      formatted += "-" + digits.slice(5, 9);
    }

    // Update the form data with the new formatted value
    handleChange({ target: { name: e.target.name, value: formatted } });
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
          disabled
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
          disabled
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
          disabled
        />

        {/* TIN No. (numbers only, no uppercase conversion needed) */}
        {/* TIN No. (not editable) */}
        {/* TIN No. (numbers only, not editable) */}
        <TextField
          label="TIN No."
          name="tinNo"
          value={formData.tinNo || ""}
          onChange={handleTINInput}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          error={!!errors.tinNo}
          helperText={errors.tinNo}
          disabled // This will gray out the field and make it un-editable
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
          disabled
        />
      </Stack>
    </div>
  );
}