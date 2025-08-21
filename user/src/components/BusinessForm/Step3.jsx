// Section3AddressInfo.jsx
import { Grid, TextField, Typography } from "@mui/material";

export default function Section3AddressInfo({ formData, handleChange }) {
  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Address Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Region" name="region" value={formData.region || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Province" name="province" value={formData.province || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="City/Municipality" name="cityOrMunicipality" value={formData.cityOrMunicipality || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Barangay" name="barangay" value={formData.barangay || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Address Line 1" name="addressLine1" value={formData.addressLine1 || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Zip Code" name="zipCode" value={formData.zipCode || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Pin Address" name="pinAddress" value={formData.pinAddress || ""} onChange={handleChange}/>
        </Grid>
      </Grid>
    </div>
  );
}
