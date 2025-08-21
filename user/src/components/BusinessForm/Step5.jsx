// Section5RentalOwnership.jsx
import { Grid, TextField, Typography } from "@mui/material";

export default function Section5RentalOwnership({ formData, handleChange }) {
  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Rental & Ownership
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Own Place" name="ownPlace" value={formData.ownPlace || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Tax Declaration" name="taxdec" value={formData.taxdec || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Lessor Name" name="lessorName" value={formData.lessorName || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Monthly Rent" name="monthlyRent" value={formData.monthlyRent || ""} onChange={handleChange}/>
        </Grid>
      </Grid>
    </div>
  );
}
