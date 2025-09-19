import { MenuItem, Stack, TextField, Typography } from "@mui/material";

export default function Step1BusinessInfo({ formData, handleChange, errors, setErrors }) {
  const regLabelMap = {
    "Sole Proprietorship": "DTI Registration No.",
    Corporation: "SEC Registration No.",
    "One Person Corporation": "SEC Registration No.",
    Partnership: "SEC Registration No.",
    Cooperative: "CDA Registration No.",
  };

  const regLabel = regLabelMap[formData.BusinessType] || "Registration No.";

  // ✅ Convert text to uppercase and validate minimum 3 letters
  const handleUppercaseChange = (e) => {
    const { name, value } = e.target;
    const upperValue = (value || "").toUpperCase();
    const letterCount = (upperValue.replace(/[^A-Za-z]/g, "") || "").length;

    // Update errors for TradeName and businessName if less than 3 letters
    if ((name === "TradeName" || name === "businessName") && letterCount < 3 && upperValue.length > 0) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Minimum of 3 letters required",
      }));
    } else if ((name === "TradeName" || name === "businessName") && letterCount >= 3) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    handleChange({ target: { name, value: upperValue } });
  };

  // ✅ TIN input: 9-12 digits, with hyphens as XXX-XXX-XXX-XX
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
          select
          label="Business Type"
          name="BusinessType"
          value={formData.BusinessType || ""}
          onChange={handleUppercaseChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
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
          error={!!errors.businessName}
          helperText={errors.businessName || "Minimum of 3 letters required"}
        />

        {/* TIN No. (9-12 digits with hyphens as XXX-XXX-XXX-XX) */}
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
          error={!!errors.TradeName}
          helperText={errors.TradeName || "Minimum of 3 letters required"}
        />
      </Stack>
    </div>
  );
}