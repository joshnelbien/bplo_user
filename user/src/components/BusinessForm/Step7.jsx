// Section7EmployeesVehicles.jsx
import { Grid, TextField, Typography } from "@mui/material";

export default function Section7EmployeesVehicles({ formData, handleChange }) {
  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Employees & Vehicles
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Total Floor Area" name="totalFloorArea" value={formData.totalFloorArea || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Number of Employees" name="numberOfEmployee" value={formData.numberOfEmployee || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Male Employees" name="maleEmployee" value={formData.maleEmployee || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Female Employees" name="femaleEmployee" value={formData.femaleEmployee || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="No. of Vans" name="numVehicleVan" value={formData.numVehicleVan || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="No. of Trucks" name="numVehicleTruck" value={formData.numVehicleTruck || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="No. of Motorcycles" name="numVehicleMotor" value={formData.numVehicleMotor || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="No. of Nozzles" name="numNozzle" value={formData.numNozzle || ""} onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Weighing Scale" name="weighScale" value={formData.weighScale || ""} onChange={handleChange}/>
        </Grid>
      </Grid>
    </div>
  );
}
