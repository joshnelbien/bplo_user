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

export default function Step3AddressInfo({ formData, handleChange }) {
  const barangays = [
    "ATISAN",
    "BAGONG BAYAN II-A (POB.)",
    "BAGONG POOK VI-C (POB.)",
    // ... rest of your barangays
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
        {/* Fixed Region */}
        <TextField label="Region" value="REGION IV-A" disabled fullWidth />

        {/* Fixed Province */}
        <TextField label="Province" value="LAGUNA" disabled fullWidth />

        {/* Fixed City */}
        <TextField
          label="City / Municipality"
          value="SAN PABLO CITY"
          disabled
          fullWidth
        />

        {/* Barangay Dropdown */}
        <FormControl fullWidth>
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
        />

        {/* Zip Code */}
        <TextField label="Zip Code" value="4000" disabled fullWidth />

        {/* Pin Address with Map */}
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
