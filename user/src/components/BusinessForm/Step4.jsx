// src/components/BusinessForm/Section4TaxInfo.jsx
import { Stack, TextField, Typography } from "@mui/material";

export default function Section4TaxInfo({ formData, handleChange }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <Typography variant="h6" gutterBottom>
        Tax Information
      </Typography>

      <Stack spacing={3}>
        <TextField
          label="Tax Region"
          name="Taxregion"
          value={formData.Taxregion || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="Tax Province"
          name="Taxprovince"
          value={formData.Taxprovince || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="Tax City / Municipality"
          name="TaxcityOrMunicipality"
          value={formData.TaxcityOrMunicipality || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="Tax Barangay"
          name="Taxbarangay"
          value={formData.Taxbarangay || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="Tax Address Line 1"
          name="TaxaddressLine1"
          value={formData.TaxaddressLine1 || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="Tax Zip Code"
          name="TaxzipCode"
          value={formData.TaxzipCode || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="Tax Pin Address"
          name="TaxpinAddress"
          value={formData.TaxpinAddress || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />
      </Stack>
    </div>
  );
}
