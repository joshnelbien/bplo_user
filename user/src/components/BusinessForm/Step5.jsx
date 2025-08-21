// src/components/BusinessForm/Section5RentalOwnership.jsx
import { Stack, TextField, Typography } from "@mui/material";

export default function Section5RentalOwnership({ formData, handleChange }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <Typography variant="h6" gutterBottom>
        Rental & Ownership
      </Typography>

      <Stack spacing={3}>
        <TextField
          label="Own Place"
          name="ownPlace"
          value={formData.ownPlace || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="Tax Declaration"
          name="taxdec"
          value={formData.taxdec || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="Lessor Name"
          name="lessorName"
          value={formData.lessorName || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="Monthly Rent"
          name="monthlyRent"
          value={formData.monthlyRent || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />
      </Stack>
    </div>
  );
}
