// src/components/BusinessForm/Section1BusinessInfo.jsx
import { Grid, TextField, Typography } from "@mui/material";

export default function Section1BusinessInfo({ formData, handleChange }) {
  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Business Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Business Type"
            name="BusinessType"
            value={formData.BusinessType || ""}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="DSC Registration No."
            name="dscRegNo"
            value={formData.dscRegNo || ""}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Business Name"
            name="businessName"
            value={formData.businessName || ""}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="TIN No."
            name="tinNo"
            value={formData.tinNo || ""}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Trade Name"
            name="TradeName"
            value={formData.TradeName || ""}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
      </Grid>
    </div>
  );
}
