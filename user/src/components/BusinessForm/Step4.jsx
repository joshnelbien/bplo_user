// Section4TaxInfo.jsx
import { Grid, TextField, Typography } from "@mui/material";

export default function Section4TaxInfo({ formData, handleChange }) {
  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Tax Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Tax Region" name="Taxregion" value={formData.Taxregion || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Tax Province" name="Taxprovince" value={formData.Taxprovince || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Tax City/Municipality" name="TaxcityOrMunicipality" value={formData.TaxcityOrMunicipality || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Tax Barangay" name="Taxbarangay" value={formData.Taxbarangay || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Tax Address Line 1" name="TaxaddressLine1" value={formData.TaxaddressLine1 || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Tax Zip Code" name="TaxzipCode" value={formData.TaxzipCode || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Tax Pin Address" name="TaxpinAddress" value={formData.TaxpinAddress || ""} onChange={handleChange}/>
        </Grid>
      </Grid>
    </div>
  );
}
