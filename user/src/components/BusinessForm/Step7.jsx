// src/components/BusinessForm/Section7EmployeesVehicles.jsx
import { Stack, TextField, Typography } from "@mui/material";

export default function Section7EmployeesVehicles({ formData, handleChange }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <Typography variant="h6" gutterBottom>
        Employees & Vehicles
      </Typography>

      <Stack spacing={3}>
        <TextField
          label="Total Floor Area"
          name="totalFloorArea"
          value={formData.totalFloorArea || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="Number of Employees"
          name="numberOfEmployee"
          value={formData.numberOfEmployee || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="Male Employees"
          name="maleEmployee"
          value={formData.maleEmployee || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="Female Employees"
          name="femaleEmployee"
          value={formData.femaleEmployee || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="No. of Vans"
          name="numVehicleVan"
          value={formData.numVehicleVan || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="No. of Trucks"
          name="numVehicleTruck"
          value={formData.numVehicleTruck || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="No. of Motorcycles"
          name="numVehicleMotor"
          value={formData.numVehicleMotor || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="No. of Nozzles"
          name="numNozzle"
          value={formData.numNozzle || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="Weighing Scale"
          name="weighScale"
          value={formData.weighScale || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />
      </Stack>
    </div>
  );
}
