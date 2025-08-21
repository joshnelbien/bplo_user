// Section6BusinessDetails.jsx
import { Grid, TextField, Typography } from "@mui/material";

export default function Section6BusinessDetails({ formData, handleChange }) {
  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Business Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Type of Industry/General Enterprises (TIGE)" name="tIGE" value={formData.tIGE || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Office Type" name="officeType" value={formData.officeType || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Other Office Type" name="officeTypeOther" value={formData.officeTypeOther || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Line of Business" name="lineOfBusiness" value={formData.lineOfBusiness || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Product/Service" name="productService" value={formData.productService || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Units" name="Units" value={formData.Units || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Capital" name="capital" value={formData.capital || ""} onChange={handleChange}/>
        </Grid>
      </Grid>
    </div>
  );
}
