import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function Step4TaxInfo({ formData, handleChange, errors, handleFileChange }) {
  const [psgc, setPsgc] = useState(null);

  const files = [
    { label: "Barangay Clearance (Optional)", name: "brgyClearance" },
    { label: "Market Clearance (Optional)", name: "marketClearance" },
    { label: "Occupancy Permit (Optional)", name: "occupancyPermit" },
  ];

  const [selectedFiles, setSelectedFiles] = useState({});

  useEffect(() => {
    fetch("/psgc.json")
      .then((res) => res.json())
      .then((data) => setPsgc(data))
      .catch((err) => console.error("Error loading PSGC:", err));
  }, []);

  const handleUppercaseChange = (e) => {
    const { name, value } = e.target;
    handleChange({ target: { name, value: value.toUpperCase() } });
  };

  const handleFileSelect = (e) => {
    const { name, files } = e.target;
    setSelectedFiles((prev) => ({
      ...prev,
      [name]: files[0] ? files[0].name : "",
    }));
    handleFileChange(e); // call parent handler
  };

  const provinceOptions =
    formData.Taxregion && psgc
      ? Object.keys(psgc[formData.Taxregion]?.province_list || {})
      : [];

  const cityOptions =
    formData.Taxregion && formData.Taxprovince && psgc
      ? Object.keys(
          psgc[formData.Taxregion]?.province_list[formData.Taxprovince]
            ?.municipality_list || {}
        )
      : [];

  const barangayOptions =
    formData.Taxregion &&
    formData.Taxprovince &&
    formData.TaxcityOrMunicipality &&
    psgc
      ? psgc[formData.Taxregion]?.province_list[formData.Taxprovince]
          ?.municipality_list[formData.TaxcityOrMunicipality]?.barangay_list ||
        []
      : [];

  // Default coordinates (San Pablo City center)
  const defaultPosition = [14.0697, 121.3259];

  // Leaflet marker icon fix
  const defaultIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  // Click handler for map
  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        handleChange({
          target: { name: "TaxpinAddress", value: `${lat},${lng}` },
        });
      },
    });

    if (formData.TaxpinAddress) {
      const [lat, lng] = formData.TaxpinAddress.split(",").map(Number);
      return <Marker position={[lat, lng]} icon={defaultIcon} />;
    }
    return null;
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <Typography variant="h6" gutterBottom>
        Taxpayer’s Address
      </Typography>

      <Stack spacing={3}>
        {/* Region */}
        <FormControl
          fullWidth
          sx={{ minWidth: 300 }}
          error={!!errors.Taxregion}
        >
          <InputLabel id="tax-region-label">Region</InputLabel>
          <Select
            labelId="tax-region-label"
            name="Taxregion"
            value={formData.Taxregion || ""}
            onChange={handleUppercaseChange}
            label="Region"
          >
            <MenuItem value="">Select Region</MenuItem>
            {psgc &&
              Object.entries(psgc).map(([code, data]) => (
                <MenuItem key={code} value={code}>
                  {data.region_name.toUpperCase()}
                </MenuItem>
              ))}
          </Select>
          {!!errors.Taxregion && (
            <Typography variant="caption" color="error">
              {errors.Taxregion}
            </Typography>
          )}
        </FormControl>

        {/* Province */}
        <FormControl
          fullWidth
          sx={{ minWidth: 300 }}
          error={!!errors.Taxprovince}
        >
          <InputLabel id="tax-province-label">Province</InputLabel>
          <Select
            labelId="tax-province-label"
            name="Taxprovince"
            value={formData.Taxprovince || ""}
            onChange={handleUppercaseChange}
            disabled={!formData.Taxregion}
            label="Province"
          >
            <MenuItem value="">Select Province</MenuItem>
            {provinceOptions.map((prov) => (
              <MenuItem key={prov} value={prov}>
                {prov.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
          {!!errors.Taxprovince && (
            <Typography variant="caption" color="error">
              {errors.Taxprovince}
            </Typography>
          )}
        </FormControl>

        {/* City / Municipality */}
        <FormControl
          fullWidth
          sx={{ minWidth: 300 }}
          error={!!errors.TaxcityOrMunicipality}
        >
          <InputLabel id="tax-city-label">City / Municipality</InputLabel>
          <Select
            labelId="tax-city-label"
            name="TaxcityOrMunicipality"
            value={formData.TaxcityOrMunicipality || ""}
            onChange={handleUppercaseChange}
            disabled={!formData.Taxprovince}
            label="City / Municipality"
          >
            <MenuItem value="">Select City / Municipality</MenuItem>
            {cityOptions.map((city) => (
              <MenuItem key={city} value={city}>
                {city.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
          {!!errors.TaxcityOrMunicipality && (
            <Typography variant="caption" color="error">
              {errors.TaxcityOrMunicipality}
            </Typography>
          )}
        </FormControl>

        {/* Barangay */}
        <FormControl
          fullWidth
          sx={{ minWidth: 300 }}
          error={!!errors.Taxbarangay}
        >
          <InputLabel id="tax-barangay-label">Barangay</InputLabel>
          <Select
            labelId="tax-barangay-label"
            name="Taxbarangay"
            value={formData.Taxbarangay || ""}
            onChange={handleUppercaseChange}
            disabled={!formData.TaxcityOrMunicipality}
            label="Barangay"
          >
            <MenuItem value="">Select Barangay</MenuItem>
            {barangayOptions.map((brgy) => (
              <MenuItem key={brgy} value={brgy}>
                {brgy.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
          {!!errors.Taxbarangay && (
            <Typography variant="caption" color="error">
              {errors.Taxbarangay}
            </Typography>
          )}
        </FormControl>

        {/* Address Line 1 */}
        <TextField
          label="Address Line 1"
          name="TaxaddressLine1"
          value={formData.TaxaddressLine1 || ""}
          onChange={handleUppercaseChange}
          fullWidth
          variant="outlined"
          error={!!errors.TaxaddressLine1}
          helperText={errors.TaxaddressLine1}
        />

        {/* Zip Code */}
        <TextField
          label="Zip Code"
          name="TaxzipCode"
          value={formData.TaxzipCode || ""}
          onChange={handleUppercaseChange}
          fullWidth
          variant="outlined"
          error={!!errors.TaxzipCode}
          helperText={errors.TaxzipCode}
        />

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
            name="TaxpinAddress"
            value={formData.TaxpinAddress || ""}
            fullWidth
            disabled
            sx={{ marginTop: 2 }}
          />
        </div>

        {/* Business Documents */}
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