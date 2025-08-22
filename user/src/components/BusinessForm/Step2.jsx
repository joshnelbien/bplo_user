import { FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";

export default function Step2PersonalInfo({ formData, handleChange }) {

      const handleTelNumberInput = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 9);
    handleChange({ target: { name: e.target.name, value } });
  };

       const handlePhoneNumberInput = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 11);
    handleChange({ target: { name: e.target.name, value } });
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <Typography variant="h6" gutterBottom>
        Owner's Personal Information
      </Typography>

      <Stack spacing={3}>
        {/* First Name */}
        <TextField
          label="First Name"
          name="firstName"
          value={formData.firstName || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        {/* Middle Name */}
        <TextField
          label="Middle Name"
          name="middleName"
          value={formData.middleName || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        {/* Last Name */}
        <TextField
          label="Last Name"
          name="lastName"
          value={formData.lastName || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        {/* Ext. Name */}
        <TextField
          label="Ext. Name"
          name="extName"
          value={formData.extName || ""}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        {/* Gender */}
        <FormControl fullWidth sx={{ minWidth: 300 }}>
          <InputLabel id="sex-label">Gender</InputLabel>
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

        {/* Email */}
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

        {/* Telephone No. */}
        <TextField
          label="Telephone No."
          name="telNo"
          value={formData.telNo || ""}
          onChange={handleTelNumberInput}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />

        {/* Mobile No. */}
        <TextField
          label="Mobile No."
          name="mobileNo"
          value={formData.mobileNo || ""}
          onChange={handlePhoneNumberInput}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
        />
      </Stack>
    </div>
  );
}
