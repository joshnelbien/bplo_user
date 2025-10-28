import { MenuItem, Stack, TextField, Typography } from "@mui/material";

export default function Step1BusinessInfo({ formData, handleChange }) {
  const regLabelMap = {
    "Sole Proprietorship": "DTI Registration No.",
    Corporation: "SEC Registration No.",
    "One Person Corporation": "SEC Registration No.",
    Partnership: "SEC Registration No.",
    Cooperative: "CDA Registration No.",
  };

  const regLabel = regLabelMap[formData.business_type] || "Registration No.";

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
    // Extract only digits and limit to 12
    let digits = e.target.value.replace(/[^0-9]/g, "").slice(0, 12);

    // Build formatted string
    let formatted = "";
    if (digits.length >= 1) {
      formatted = digits.slice(0, 3);
      if (digits.length >= 4) {
        formatted += "-" + digits.slice(3, 6);
        if (digits.length >= 7) {
          formatted += "-" + digits.slice(6, 9);
          if (digits.length >= 10) {
            formatted += "-" + digits.slice(9, 12);
          }
        }
      }
    }

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
          label="BIN"
          name="bin"
          value={formData.bin || ""}
          onChange={handleUppercaseChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          select
          label="Business Type"
          name="business_type"
          value={formData.business_type || ""}
          onChange={handleUppercaseChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          // Add error props
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
        />

        {/* Business Name */}
        <TextField
          label="Business Name"
          name="business_name"
          value={formData.business_name || ""}
          onChange={handleUppercaseChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          // Add error props
        />

        {/* TIN No. (numbers only, no uppercase conversion needed) */}
        {/* TIN No. (not editable) */}
        {/* TIN No. (numbers only, not editable) */}
        <TextField
          label="TIN No."
          name="tin_no"
          value={formData.tin_no || ""}
          onChange={handleTINInput}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}

          // This will gray out the field and make it un-editable
        />
        {/* Trade Name */}
        <TextField
          label="Trade Name"
          name="trade_name"
          value={formData.trade_name || ""}
          onChange={handleUppercaseChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          // Add error props
        />
      </Stack>
    </div>
  );
}
