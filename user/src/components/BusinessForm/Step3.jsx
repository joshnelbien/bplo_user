// src/components/BusinessForm/Step3AddressInfo.jsx
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";

export default function Step3AddressInfo({ formData, handleChange }) {
  const barangays = [
    "ATISAN",
    "BAGONG BAYAN II-A (POB.)",
    "BAGONG POOK VI-C (POB.)",
    "BARANGAY I-A (POB.)",
    "BARANGAY I-B (POB.)",
    "BARANGAY II-A (POB.)",
    "BARANGAY II-B (POB.)",
    "BARANGAY II-C (POB.)",
    "BARANGAY II-D (POB.)",
    "BARANGAY II-E (POB.)",
    "BARANGAY II-F (POB.)",
    "BARANGAY III-A (POB.)",
    "BARANGAY III-B (POB.)",
    "BARANGAY III-C (POB.)",
    "BARANGAY III-D (POB.)",
    "BARANGAY III-E (POB.)",
    "BARANGAY III-F (POB.)",
    "BARANGAY IV-A (POB.)",
    "BARANGAY IV-B (POB.)",
    "BARANGAY IV-C (POB.)",
    "BARANGAY V-A (POB.)",
    "BARANGAY V-B (POB.)",
    "BARANGAY V-C (POB.)",
    "BARANGAY V-D (POB.)",
    "BARANGAY VI-A (POB.)",
    "BARANGAY VI-B (POB.)",
    "BARANGAY VI-D (POB.)",
    "BARANGAY VI-E (POB.)",
    "BARANGAY VII-A (POB.)",
    "BARANGAY VII-B (POB.)",
    "BARANGAY VII-C (POB.)",
    "BARANGAY VII-D (POB.)",
    "BARANGAY VII-E (POB.)",
    "BAUTISTA",
    "CONCEPCION",
    "DEL REMEDIO",
    "DOLORES",
    "SAN ANTONIO 1",
    "SAN ANTONIO 2",
    "SAN BARTOLOME",
    "SAN BUENAVENTURA",
    "SAN CRISPIN",
    "SAN CRISTOBAL",
    "SAN DIEGO",
    "SAN FRANCISCO",
    "SAN GABRIEL",
    "SAN GREGORIO",
    "SAN IGNACIO",
    "SAN ISIDRO",
    "SAN JOAQUIN",
    "SAN JOSE",
    "SAN JUAN",
    "SAN LORENZO",
    "SAN LUCAS 1",
    "SAN LUCAS 2",
    "SAN MARCOS",
    "SAN MATEO",
    "SAN MIGUEL",
    "SAN NICOLAS",
    "SAN PEDRO",
    "SAN RAFAEL",
    "SAN ROQUE",
    "SAN VICENTE",
    "SANTA ANA",
    "SANTA CATALINA",
    "SANTA CRUZ",
    "SANTA ELENA",
    "SANTA FELOMINA",
    "SANTA ISABEL",
    "SANTA MARIA",
    "SANTA MARIA MAGDALENA",
    "SANTA MONICA",
    "SANTA VERONICA",
    "SANTIAGO I",
    "SANTIAGO II",
    "SANTISIMO ROSARIO",
    "SANTO ANGEL",
    "SANTO CRISTO",
    "SANTO NIÑO",
    "SOLEDAD",
  ];

  // ✅ Uppercase handler
  const handleUppercaseChange = (e) => {
    const value = (e.target.value || "").toUpperCase();
    handleChange({ target: { name: e.target.name, value } });
  };

  // Auto-set fixed values if not set
  useEffect(() => {
    if (
      !formData.region ||
      !formData.province ||
      !formData.cityOrMunicipality ||
      !formData.zipCode
    ) {
      handleChange({ target: { name: "region", value: "REGION IV-A" } });
      handleChange({ target: { name: "province", value: "LAGUNA" } });
      handleChange({
        target: { name: "cityOrMunicipality", value: "SAN PABLO CITY" },
      });
      handleChange({ target: { name: "zipCode", value: "4000" } });
    }
  }, [
    formData.region,
    formData.province,
    formData.cityOrMunicipality,
    formData.zipCode,
    handleChange,
  ]);

  return (
    <div style={{ marginBottom: 20 }}>
      <Typography variant="h6" gutterBottom>
        Address Information
      </Typography>

      <Stack spacing={3}>
        {/* Fixed Region */}
        <TextField
          label="Region"
          value="REGION IV-A"
          disabled
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        {/* Fixed Province */}
        <TextField
          label="Province"
          value="LAGUNA"
          disabled
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        {/* Fixed City / Municipality */}
        <TextField
          label="City / Municipality"
          value="SAN PABLO CITY"
          disabled
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        {/* Barangay Dropdown */}
        <FormControl fullWidth sx={{ minWidth: 300 }}>
          <InputLabel id="barangay-label">Barangay</InputLabel>
          <Select
            labelId="barangay-label"
            name="barangay"
            value={formData.barangay || ""}
            onChange={handleUppercaseChange}
            label="Barangay"
          >
            <MenuItem value="">Select Barangay</MenuItem>
            {barangays.map((brgy) => (
              <MenuItem key={brgy} value={brgy}>
                {brgy}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Address Line 1 */}
        <TextField
          label="Address Line 1"
          name="addressLine1"
          value={formData.addressLine1 || ""}
          onChange={handleUppercaseChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        {/* Zip Code */}
        <TextField
          label="Zip Code"
          value="4000"
          disabled
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        {/* Pin Address */}
        <TextField
          label="Pin Address"
          name="pinAddress"
          value={formData.pinAddress || ""}
          onChange={handleUppercaseChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />
      </Stack>
    </div>
  );
}
