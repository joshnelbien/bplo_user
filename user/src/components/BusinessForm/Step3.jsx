import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

export default function Step3AddressInfo({ formData, handleChange, errors }) {
  const barangays = [
    "ATISAN",
    "BAGONG POOK VI-C (POB.)",
    "BARANGAY I-A (POB.)",
    "BARANGAY I-B (POB.)",
    "BAGONG BAYAN I-C (POB.)",
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

  // Default coordinates (San Pablo City center)
  const defaultPosition = [14.0697, 121.3259]; // lat, lng

  // Leaflet Marker icon fix
  const defaultIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  // Custom component for handling clicks
  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        handleChange({
          target: { name: "pinAddress", value: `${lat},${lng}` },
        });
      },
    });

    if (formData.pinAddress) {
      const [lat, lng] = formData.pinAddress.split(",").map(Number);
      return <Marker position={[lat, lng]} icon={defaultIcon} />;
    }
    return null;
  }

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
        {/* Fixed Region - Not required, no error needed */}
        <TextField label="Region" value="REGION IV-A" disabled fullWidth />

        {/* Fixed Province - Not required, no error needed */}
        <TextField label="Province" value="LAGUNA" disabled fullWidth />

        {/* Fixed City - Not required, no error needed */}
        <TextField
          label="City / Municipality"
          value="SAN PABLO CITY"
          disabled
          fullWidth
        />

        {/* Barangay Dropdown - ADDED VALIDATION */}
        <FormControl fullWidth error={!!errors.barangay}>
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
          {!!errors.barangay && (
            <Typography variant="caption" color="error">
              {errors.barangay}
            </Typography>
          )}
        </FormControl>

        {/* Address Line 1 - ADDED VALIDATION */}
        <TextField
          label="Address Line 1"
          name="addressLine1"
          value={formData.addressLine1 || ""}
          onChange={handleUppercaseChange}
          fullWidth
          error={!!errors.addressLine1}
          helperText={errors.addressLine1}
        />

        {/* Fixed Zip Code - Not required, no error needed */}
        <TextField label="Zip Code" value="4000" disabled fullWidth />

        {/* Pin Address with Map - Not required, no error needed */}
        <div>
          <Typography variant="subtitle1" gutterBottom>
            Pin Address (Click on the map)
          </Typography>
          <MapContainer
            center={defaultPosition}
            zoom={13}
            style={{ height: "400px", width: "100%", borderRadius: "10px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            />
            <LocationMarker />
          </MapContainer>
          <TextField
            label="Coordinates"
            name="pinAddress"
            value={formData.pinAddress || ""}
            fullWidth
            disabled
            sx={{ marginTop: 2 }}
          />
        </div>
      </Stack>
    </div>
  );
}