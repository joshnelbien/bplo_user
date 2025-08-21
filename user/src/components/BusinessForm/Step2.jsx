// Section2OwnerInfo.jsx
import { Grid, MenuItem, TextField, Typography } from "@mui/material";

export default function Section2OwnerInfo({ formData, handleChange }) {
  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Owner Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="First Name" name="firstName" value={formData.firstName || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="Middle Name" name="middleName" value={formData.middleName || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="Last Name" name="lastName" value={formData.lastName || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="Ext. Name" name="extName" value={formData.extName || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField select fullWidth label="Sex" name="sex" value={formData.sex || ""} onChange={handleChange}>
            <MenuItem value="">Select</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="Email" type="email" name="eMailAdd" value={formData.eMailAdd || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Telephone No." name="telNo" value={formData.telNo || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Mobile No." name="mobileNo" value={formData.mobileNo || ""} onChange={handleChange}/>
        </Grid>
      </Grid>
    </div>
  );
}
