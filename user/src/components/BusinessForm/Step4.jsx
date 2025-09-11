// src/components/BusinessForm/Step4TaxInfo.jsx
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

export default function Step4TaxInfo({ formData, handleChange }) {
  const [psgc, setPsgc] = useState(null);

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

  return (
    <div style={{ marginBottom: 20 }}>
      <Typography variant="h6" gutterBottom>
        Taxpayer’s Address
      </Typography>

      <Stack spacing={3}>
        {/* Region */}
        <FormControl fullWidth sx={{ minWidth: 300 }}>
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
        <FormControl fullWidth sx={{ minWidth: 300 }}>
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

        {/* City / Municipality */}
        <FormControl fullWidth sx={{ minWidth: 300 }}>
          <InputLabel id="tax-city-label">City / Municipality</InputLabel>
          <Select
            labelId="tax-city-label"
            name="TaxcityOrMunicipality"
            value={formData.TaxcityOrMunicipality || ""}
            onChange={handleUppercaseChange}
            disabled={!formData.Taxprovince}
          >
            <MenuItem value="">Select City / Municipality</MenuItem>
            {cityOptions.map((city) => (
              <MenuItem key={city} value={city}>
                {city.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Barangay */}
        <FormControl fullWidth sx={{ minWidth: 300 }}>
          <InputLabel id="tax-barangay-label">Barangay</InputLabel>
          <Select
            labelId="tax-barangay-label"
            name="Taxbarangay"
            value={formData.Taxbarangay || ""}
            onChange={handleUppercaseChange}
            disabled={!formData.TaxcityOrMunicipality}
          >
            <MenuItem value="">Select Barangay</MenuItem>
            {barangayOptions.map((brgy) => (
              <MenuItem key={brgy} value={brgy}>
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
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        {/* Zip Code */}
        <TextField
          label="Zip Code"
          name="TaxzipCode"
          value={formData.TaxzipCode || ""}
          onChange={handleUppercaseChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        {/* Pin Address */}
        <TextField
          label="Pin Address"
          name="TaxpinAddress"
          value={formData.TaxpinAddress || ""}
          onChange={handleUppercaseChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        {/* Own Place */}
        <FormControl fullWidth sx={{ minWidth: 300 }}>
          <InputLabel id="own-place-label">Own Place</InputLabel>
          <Select
            labelId="own-place-label"
            name="ownPlace"
            value={formData.ownPlace || ""}
            onChange={handleUppercaseChange}
          >
            <MenuItem value="">Select</MenuItem>
            <MenuItem value="YES">YES</MenuItem>
            <MenuItem value="NO">NO</MenuItem>
          </Select>
        </FormControl>

        {/* Conditional: Own Place = YES */}
        {formData.ownPlace === "YES" && (
          <TextField
            label="Tax Declaration No."
            name="taxdec"
            value={formData.taxdec || ""}
            onChange={handleUppercaseChange}
            fullWidth
            variant="outlined"
            sx={{ minWidth: 300 }}
          />
        )}

        {/* Conditional: Own Place = NO */}
        {formData.ownPlace === "NO" && (
          <Stack spacing={3}>
            <Typography variant="subtitle1">Owner’s Address</Typography>
            <TextField
              label="Lessor's Name"
              name="lessorName"
              value={formData.lessorName || ""}
              onChange={handleUppercaseChange}
              fullWidth
              variant="outlined"
              sx={{ minWidth: 300 }}
            />
            <TextField
              label="Monthly Rental"
              name="monthlyRent"
              value={formData.monthlyRent || ""}
              onChange={handleUppercaseChange}
              fullWidth
              variant="outlined"
              sx={{ minWidth: 300 }}
            />
            <TextField
              label="Tax Declaration No."
              name="taxdec"
              value={formData.taxdec || ""}
              onChange={handleUppercaseChange}
              fullWidth
              variant="outlined"
              sx={{ minWidth: 300 }}
            />
          </Stack>
        )}
      </Stack>
    </div>
  );
}
