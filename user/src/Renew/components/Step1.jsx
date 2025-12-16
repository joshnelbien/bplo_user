import { MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useMemo } from "react";

export default function Step1BusinessInfo({ formData, handleChange, errors }) {
  const regLabelMap = {
    "SOLE PROPRIETORSHIP": "DTI Registration No.",
    CORPORATION: "SEC Registration No.",
    "ONE PERSON CORPORATION": "SEC Registration No.",
    PARTNERSHIP: "SEC Registration No.",
    COOPERATIVE: "CDA Registration No.",
  };

  const regLabel = useMemo(() => {
    return regLabelMap[formData.business_type] || "Registration No.";
  }, [formData.business_type]);
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
    let digits = e.target.value.replace(/[^0-9]/g, "").slice(0, 12);

    let formatted = "";
    if (digits.length > 0) formatted = digits.slice(0, 3);
    if (digits.length > 3) formatted += "-" + digits.slice(3, 6);
    if (digits.length > 6) formatted += "-" + digits.slice(6, 9);
    if (digits.length > 9) formatted += "-" + digits.slice(9, 12);

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
          name="bin"
          value={formData.bin || ""}
          onChange={handleUppercaseChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          // Add error props (assuming this isn't required by default)
          error={!!errors.bin}
          helperText={errors.bin}
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
          error={!!errors.business_type}
          helperText={errors.business_type}
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
          error={!!errors.business_name}
          helperText={errors.business_name}
        />
        <TextField
          label="TIN No."
          name="tin_no"
          value={formData.tin_no || ""}
          onChange={handleTINInput}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          error={!!errors.tin_no}
          helperText={errors.tin_no}
          // This will gray out the field and make it un-editable
        />

        <TextField
          label={regLabelMap[formData.business_type] || "Registration No."}
          name="dscRegNo"
          value={formData.dscRegNo || ""}
          onChange={handleUppercaseChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          error={!!errors.dscRegNo}
          helperText={errors.dscRegNo}
        />
        {/* Trade Name */}

        <TextField
          label="Trade Name (optional)"
          name="trade_name"
          value={formData.trade_name || ""}
          onChange={handleUppercaseChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />
      </Stack>
    </div>
  );
}
