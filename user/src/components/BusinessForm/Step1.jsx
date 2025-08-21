// src/components/BusinessForm/Section1BusinessInfo.jsx
import { Stack, TextField, Typography } from "@mui/material";

export default function Section1BusinessInfo({ formData, handleChange }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <Typography variant="h6" gutterBottom>
        Business Information
      </Typography>

      <Stack spacing={3}> {/* spacing controls vertical gap */}
        <TextField
          label="Business Type"
          name="BusinessType"
          value={formData.BusinessType || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }} // adjust width as needed
        />

        <TextField
          label="DSC Registration No."
          name="dscRegNo"
          value={formData.dscRegNo || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="Business Name"
          name="businessName"
          value={formData.businessName || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="TIN No."
          name="tinNo"
          value={formData.tinNo || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

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
