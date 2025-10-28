/* eslint-disable react-hooks/exhaustive-deps */
import { Stack, TextField, Typography, Button, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";

export default function Step5BusinessDetails({
  formData,
  handleChange,
  errors,
  handleFileChange,
}) {
  const files = [
    { label: "Cedula", name: "cedula" },
    {
      label: "Photo of Business Establishment (Interior)",
      name: "photoOfBusinessEstInt",
    },
    {
      label: "Photo of Business Establishment (Exterior)",
      name: "photoOfBusinessEstExt",
    },
  ];

  const [selectedFiles, setSelectedFiles] = useState({});

  // Only allow digits & limit to 6 characters
  const handleNumberInput = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    handleChange({ target: { name: e.target.name, value } });
  };

  const handleFileSelect = (e) => {
    const { name, files } = e.target;
    setSelectedFiles((prev) => ({
      ...prev,
      [name]: files[0] ? files[0].name : "",
    }));
    handleFileChange(e); // call parent handler
  };

  // Auto-calculate total employees using useEffect
  useEffect(() => {
    const male = parseInt(formData.maleEmployee || "0", 10);
    const female = parseInt(formData.femaleEmployee || "0", 10);
    const totalEmployees = male + female;

    if (formData.numberOfEmployee !== String(totalEmployees)) {
      handleChange({
        target: { name: "numberOfEmployee", value: String(totalEmployees) },
      });
    }
  }, [formData.maleEmployee, formData.femaleEmployee]);

  const totalEmployees =
    parseInt(formData.maleEmployee || "0", 10) +
    parseInt(formData.femaleEmployee || "0", 10);

  return (
    <div style={{ marginBottom: 20 }}>
      <Typography variant="h6" gutterBottom>
        Business Operation
      </Typography>

      <Stack spacing={3}>
        <TextField
          label="Total Floor Area"
          name="totalFloorArea"
          value={formData.totalFloorArea || ""}
          onInput={handleNumberInput}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          error={!!errors.totalFloorArea}
          helperText={errors.totalFloorArea}
        />

        <TextField
          label="Male Employees"
          name="maleEmployee"
          value={formData.maleEmployee || ""}
          onInput={handleNumberInput}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          error={!!errors.maleEmployee}
          helperText={errors.maleEmployee}
        />

        <TextField
          label="Female Employees"
          name="femaleEmployee"
          value={formData.femaleEmployee || ""}
          onInput={handleNumberInput}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          error={!!errors.femaleEmployee}
          helperText={errors.femaleEmployee}
        />

        <TextField
          label="Total Employees"
          name="numberOfEmployee"
          value={totalEmployees}
          InputProps={{ readOnly: true }}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          error={!!errors.numberOfEmployee}
          helperText={errors.numberOfEmployee}
        />

        <TextField
          label="Total Delivery Vehicle"
          name="totalDeliveryVehicle"
          value={formData.totalDeliveryVehicle || ""}
          onInput={handleNumberInput}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          error={!!errors.totalDeliveryVehicle}
          helperText={errors.totalDeliveryVehicle}
        />

        <TextField
          label="Number of Nozzles"
          name="numNozzle"
          value={formData.numNozzle || ""}
          onInput={handleNumberInput}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          error={!!errors.numNozzle}
          helperText={errors.numNozzle}
        />

        <TextField
          label="Weighing Scale"
          name="weighScale"
          value={formData.weighScale || ""}
          onInput={handleNumberInput}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          error={!!errors.weighScale}
          helperText={errors.weighScale}
        />

        <Typography variant="h6" gutterBottom>
          Business Documents
        </Typography>
        {files.map((file) => (
          <Stack key={file.name} direction="column" spacing={1}>
            <Typography>{file.label}:</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="contained"
                component="label"
                size="small"
                sx={{
                  minWidth: 120,
                  backgroundColor: "#1d5236",
                  "&:hover": { backgroundColor: "#072b0b" },
                }}
              >
                Choose File
                <input
                  type="file"
                  name={file.name}
                  hidden
                  onChange={handleFileSelect}
                />
              </Button>
              <TextField
                value={selectedFiles[file.name] || ""}
                placeholder="No file selected"
                size="small"
                fullWidth
                InputProps={{ readOnly: true }}
              />
            </Stack>
          </Stack>
        ))}
      </Stack>
    </div>
  );
}
