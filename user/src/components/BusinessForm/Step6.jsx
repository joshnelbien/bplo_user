// src/components/BusinessForm/Step6BusinessActivity.jsx
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function Step6BusinessActivity({
  formData,
  handleChange,
  handleFileChange,
}) {
  const files = [{ label: "TIGE Files", name: "tIGEfiles" }];

  // State to track selected files
  const [selectedFiles, setSelectedFiles] = useState({});

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

        {/* File Upload for TIGE */}
        {formData.tIGE === "Yes" && (
          <Stack spacing={3}>
            {files.map((file) => (
              <Stack key={file.name} direction="column" spacing={1}>
                <Typography>{file.label}:</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    variant="contained"
                    component="label"
                    size="small"
                    sx={{ minWidth: 120 }}
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
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Stack>
              </Stack>
            ))}
          </Stack>
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
