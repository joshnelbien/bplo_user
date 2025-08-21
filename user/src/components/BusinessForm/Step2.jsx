// src/components/BusinessForm/Section2OwnerInfo.jsx
import { FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";

export default function Section2OwnerInfo({ formData, handleChange }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <Typography variant="h6" gutterBottom>
        Owner Information
      </Typography>

      <Stack spacing={3}>
        <TextField
          label="First Name"
          name="firstName"
          value={formData.firstName || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="Middle Name"
          name="middleName"
          value={formData.middleName || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="Last Name"
          name="lastName"
          value={formData.lastName || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="Ext. Name"
          name="extName"
          value={formData.extName || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <FormControl fullWidth sx={{ minWidth: 300 }}>
          <InputLabel id="sex-label">Sex</InputLabel>
          <Select
            labelId="sex-label"
            name="sex"
            value={formData.sex || ""}
            onChange={handleChange}
            label="Gender"
          >
            <MenuItem value="">Select</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Email"
          type="email"
          name="eMailAdd"
          value={formData.eMailAdd || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="Telephone No."
          name="telNo"
          value={formData.telNo || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        <TextField
          label="Mobile No."
          name="mobileNo"
          value={formData.mobileNo || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />
      </Stack>
    </div>
  );
}
