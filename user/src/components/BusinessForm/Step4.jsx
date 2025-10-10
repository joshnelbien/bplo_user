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
import "leaflet/dist/leaflet.css";

export default function Step4TaxInfo({
  formData,
  handleChange,
  errors,
  handleFileChange,
}) {
  const [psgc, setPsgc] = useState(null);
  const [sameAsBusiness, setSameAsBusiness] = useState("");

  useEffect(() => {
    fetch("/psgc.json")
      .then((res) => res.json())
      .then((data) => setPsgc(data))
      .catch((err) => console.error("Error loading PSGC:", err));
  }, []);

  // ✅ Auto-fill taxpayer’s address if same as business
  useEffect(() => {
    if (!formData) return; // safety check

    if (sameAsBusiness === "YES") {
      handleChange({ target: { name: "Taxregion", value: formData.region } });
      handleChange({
        target: { name: "Taxprovince", value: formData.province },
      });
      handleChange({
        target: {
          name: "TaxcityOrMunicipality",
          value: formData.cityOrMunicipality,
        },
      });
      handleChange({
        target: { name: "Taxbarangay", value: formData.barangay },
      });
      handleChange({
        target: { name: "TaxaddressLine1", value: formData.addressLine1 },
      });
      handleChange({ target: { name: "TaxzipCode", value: formData.zipCode } });
    } else if (sameAsBusiness === "NO") {
      handleChange({ target: { name: "Taxregion", value: "" } });
      handleChange({ target: { name: "Taxprovince", value: "" } });
      handleChange({ target: { name: "TaxcityOrMunicipality", value: "" } });
      handleChange({ target: { name: "Taxbarangay", value: "" } });
      handleChange({ target: { name: "TaxaddressLine1", value: "" } });
      handleChange({ target: { name: "TaxzipCode", value: "" } });
    }
  }, [sameAsBusiness]);

  const handleUppercaseChange = (e) => {
    const { name, value } = e.target;
    handleChange({ target: { name, value: value.toUpperCase() } });
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

  const [selectedFiles, setSelectedFiles] = useState({});

  const files = [
    { label: "Barangay Clearance", name: "brgyClearance" },
    { label: "Market Clearance", name: "marketClearance" },
    { label: "Occupancy Permit", name: "occupancyPermit" },
  ];

  const handleFileSelect = (e) => {
    const { name, files } = e.target;
    setSelectedFiles((prev) => ({
      ...prev,
      [name]: files[0] ? files[0].name : "",
    }));
    handleFileChange(e); // call parent handler
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <Typography variant="h6" gutterBottom>
        Taxpayer’s Address
      </Typography>

      <Stack spacing={3}>
        {/* Same as business address */}
        <FormControl fullWidth>
          <InputLabel id="same-as-business-label">
            Same as Business Address?
          </InputLabel>
          <Select
            labelId="same-as-business-label"
            value={sameAsBusiness}
            onChange={(e) => setSameAsBusiness(e.target.value)}
          >
            <MenuItem value="">-- Select --</MenuItem>
            <MenuItem value="YES">YES</MenuItem>
            <MenuItem value="NO">NO</MenuItem>
          </Select>
        </FormControl>

        {sameAsBusiness === "NO" ? (
          <>
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
              >
                <MenuItem value="">Select Region</MenuItem>
                {psgc &&
                  Object.entries(psgc).map(([code, data]) => (
                    <MenuItem key={code} value={code}>
                      {data.region_name.toUpperCase()}
                    </MenuItem>
                  ))}
              </Select>
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
              >
                <MenuItem value="">Select Province</MenuItem>
                {provinceOptions.map((prov) => (
                  <MenuItem key={prov} value={prov}>
                    {prov.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* City/Municipality */}
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
              >
                <MenuItem value="">Select City</MenuItem>
                {cityOptions.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Barangay */}
            <FormControl
              fullWidth
              sx={{ minWidth: 300 }}
              error={!!errors.Taxbarangay}
            >
              <InputLabel id="tax-brgy-label">Barangay</InputLabel>
              <Select
                labelId="tax-brgy-label"
                name="Taxbarangay"
                value={formData.Taxbarangay || ""}
                onChange={handleUppercaseChange}
                disabled={!formData.TaxcityOrMunicipality}
              >
                <MenuItem value="">Select Barangay</MenuItem>
                {barangayOptions.map((brgy, i) => (
                  <MenuItem key={i} value={brgy}>
                    {brgy.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Address Line 1 */}
            <TextField
              label="Address Line 1"
              name="TaxaddressLine1"
              value={formData.TaxaddressLine1 || ""}
              onChange={handleUppercaseChange}
              fullWidth
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
              error={!!errors.TaxzipCode}
              helperText={errors.TaxzipCode}
            />
          </>
        ) : sameAsBusiness === "YES" ? (
          <>
            {/* Just show plain fields for autofilled address */}
            <TextField
              label="Region"
              name="Taxregion"
              value={formData.Taxregion || ""}
              onChange={handleUppercaseChange}
              fullWidth
              disabled
            />
            <TextField
              label="Province"
              name="Taxprovince"
              value={formData.Taxprovince || ""}
              onChange={handleUppercaseChange}
              fullWidth
              disabled
            />
            <TextField
              label="City / Municipality"
              name="TaxcityOrMunicipality"
              value={formData.TaxcityOrMunicipality || ""}
              onChange={handleUppercaseChange}
              fullWidth
              disabled
            />
            <TextField
              label="Barangay"
              name="Taxbarangay"
              value={formData.Taxbarangay || ""}
              onChange={handleUppercaseChange}
              fullWidth
              disabled
            />
            <TextField
              label="Address Line 1"
              name="TaxaddressLine1"
              value={formData.TaxaddressLine1 || ""}
              onChange={handleUppercaseChange}
              fullWidth
              disabled
            />
            <TextField
              label="Zip Code"
              name="TaxzipCode"
              value={formData.TaxzipCode || ""}
              onChange={handleUppercaseChange}
              fullWidth
              disabled
            />
          </>
        ) : null}
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
