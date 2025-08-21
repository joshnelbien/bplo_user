// src/components/BusinessForm/Section6BusinessDetails.jsx
import { Stack, TextField, Typography } from "@mui/material";

export default function Section6BusinessDetails({ formData, handleChange }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <Typography variant="h6" gutterBottom>
        Business Details
      </Typography>

      <Stack spacing={3}>
        <TextField
          label="Type of Industry/General Enterprises (TIGE)"
          name="tIGE"
          value={formData.tIGE || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="Office Type"
          name="officeType"
          value={formData.officeType || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="Other Office Type"
          name="officeTypeOther"
          value={formData.officeTypeOther || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

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
          value={formData.Units || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="Capital"
          name="capital"
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
