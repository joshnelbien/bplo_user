import { Stack, TextField, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

export default function Step4TaxInfo({
  formData,
  handleChange,
  errors,
  handleFileChange,
}) {
  const [psgc, setPsgc] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({});

  // Load PSGC data
  useEffect(() => {
    fetch("/psgc.json")
      .then((res) => res.json())
      .then((data) => setPsgc(data))
      .catch((err) => console.error("Error loading PSGC:", err));
  }, []);

  // Convert text to uppercase for consistency
  const handleUppercaseChange = (e) => {
    const { name, value } = e.target;
    handleChange({ target: { name, value: value.toUpperCase() } });
  };

  // File input configuration
  const files = [
    { label: "Barangay Clearance", name: "brgyClearance" },
    { label: "Market Clearance", name: "marketClearance" },
    { label: "Occupancy Permit", name: "occupancyPermit" },
  ];

  // Handle file selection display
  const handleFileSelect = (e) => {
    const { name, files } = e.target;
    setSelectedFiles((prev) => ({
      ...prev,
      [name]: files[0] ? files[0].name : "",
    }));
    handleFileChange(e); // Pass event to parent
  };

  return (
    <div style={{ marginBottom: 20 }}>
      {/* ✅ Taxpayer’s Address (auto-filled & disabled) */}
      <Typography variant="h6" gutterBottom>
        Taxpayer’s Address
      </Typography>

      <Stack spacing={3}>
        <TextField
          label="Region"
          name="Taxregion"
          value={formData.Taxregion || ""}
          onChange={handleUppercaseChange}
          fullWidth
          disabled
          error={!!errors.Taxregion}
          helperText={errors.Taxregion}
        />

        <TextField
          label="Province"
          name="Taxprovince"
          value={formData.Taxprovince || ""}
          onChange={handleUppercaseChange}
          fullWidth
          disabled
          error={!!errors.Taxprovince}
          helperText={errors.Taxprovince}
        />

        <TextField
          label="City / Municipality"
          name="TaxcityOrMunicipality"
          value={formData.TaxcityOrMunicipality || ""}
          onChange={handleUppercaseChange}
          fullWidth
          disabled
          error={!!errors.TaxcityOrMunicipality}
          helperText={errors.TaxcityOrMunicipality}
        />

        <TextField
          label="Barangay"
          name="Taxbarangay"
          value={formData.Taxbarangay || ""}
          onChange={handleUppercaseChange}
          fullWidth
          disabled
          error={!!errors.Taxbarangay}
          helperText={errors.Taxbarangay}
        />

        <TextField
          label="Address Line 1"
          name="TaxaddressLine1"
          value={formData.TaxaddressLine1 || ""}
          onChange={handleUppercaseChange}
          fullWidth
          disabled
          error={!!errors.TaxaddressLine1}
          helperText={errors.TaxaddressLine1}
        />

        <TextField
          label="Zip Code"
          name="TaxzipCode"
          value={formData.TaxzipCode || ""}
          onChange={handleUppercaseChange}
          fullWidth
          disabled
          error={!!errors.TaxzipCode}
          helperText={errors.TaxzipCode}
        />

        {/* 📄 Business Documents Upload */}
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
                  backgroundColor: "#4caf50",
                  "&:hover": { backgroundColor: "#15400d" },
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
