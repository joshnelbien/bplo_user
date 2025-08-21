// src/components/BusinessForm/Section3AddressInfo.jsx
import { Stack, TextField, Typography } from "@mui/material";

export default function Section3AddressInfo({ formData, handleChange }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <Typography variant="h6" gutterBottom>
        Address Information
      </Typography>

      <Stack spacing={3}>
        <TextField
          label="Region"
          name="region"
          value={formData.region || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="Province"
          name="province"
          value={formData.province || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="City / Municipality"
          name="cityOrMunicipality"
          value={formData.cityOrMunicipality || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="Barangay"
          name="barangay"
          value={formData.barangay || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="Address Line 1"
          name="addressLine1"
          value={formData.addressLine1 || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="Zip Code"
          name="zipCode"
          value={formData.zipCode || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="Pin Address"
          name="pinAddress"
          value={formData.pinAddress || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />
      </Stack>
    </div>
  );
}
