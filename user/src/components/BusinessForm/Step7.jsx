// src/components/BusinessForm/Step7BusinessActivity.jsx
import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";

export default function Step7BusinessActivity({ formData, handleChange }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <Typography variant="h6" gutterBottom>
        Business Activity
      </Typography>

      <Stack spacing={3}>
        {/* Tax Incentives */}
        <FormControl fullWidth sx={{ minWidth: 300 }}>
          <InputLabel id="tIGE-label">Tax Incentives from Gov't</InputLabel>
          <Select
            labelId="tIGE-label"
            name="tIGE"
            value={formData.tIGE || ""}
            onChange={handleChange}
          >
            <MenuItem value="">Select</MenuItem>
            <MenuItem value="No">No</MenuItem>
            <MenuItem value="Yes">Yes</MenuItem>
          </Select>
        </FormControl>

        {formData.tIGE === "Yes" && (
          <Button variant="outlined" component="label" sx={{ minWidth: 300 }}>
            Attach Supporting Document
            <input
              type="file"
              name="tIGEFile"
              hidden
              onChange={handleChange}
            />
          </Button>
        )}

        {/* Office Type */}
        <FormControl fullWidth sx={{ minWidth: 300 }}>
          <InputLabel id="officeType-label">Office Type</InputLabel>
          <Select
            labelId="officeType-label"
            name="officeType"
            value={formData.officeType || ""}
            onChange={handleChange}
          >
            <MenuItem value="">-- Select Office Type --</MenuItem>
            <MenuItem value="Main">Main</MenuItem>
            <MenuItem value="Branch Office">Branch Office</MenuItem>
            <MenuItem value="Admin Office Only">Admin Office Only</MenuItem>
            <MenuItem value="Warehouse">Warehouse</MenuItem>
            <MenuItem value="Others">Others (Specify)</MenuItem>
          </Select>
        </FormControl>

        {formData.officeType === "Others" && (
          <TextField
            label="Specify Business Activity"
            name="officeTypeOther"
            value={formData.officeTypeOther || ""}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            sx={{ minWidth: 300 }}
          />
        )}

        <TextField
          label="Line of Business"
          name="lineOfBusiness"
          value={formData.lineOfBusiness || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="Product/Service"
          name="productService"
          value={formData.productService || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="Units"
          name="Units"
          type="number"
          value={formData.Units || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="Capital"
          name="capital"
          type="number"
          value={formData.capital || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />
      </Stack>
    </div>
  );
}
