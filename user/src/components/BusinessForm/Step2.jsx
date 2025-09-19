import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function Step2PersonalInfo({
  formData,
  handleChange,
  errors,
  setErrors,
}) {
  // ✅ Uppercase handler for text fields
  const handleUppercaseChange = (e) => {
    const value = (e.target.value || "").toUpperCase();
    handleChange({ target: { name: e.target.name, value } });
  };

  // ✅ Telephone number: digits only, max 9
  const handleTelNumberInput = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 9);
    handleChange({ target: { name: e.target.name, value } });
  };

  // ✅ Mobile number: digits only, automatic +63 prefix
  const handlePhoneNumberInput = (e) => {
    let value = e.target.value.replace(/\D/g, "");

    // Automatically add +63 prefix if not present
    if (!value.startsWith("63") && value.length > 0) {
      value = `63${value}`;
    }

    // Limit to a total of 12 digits (63 + 9 digits)
    value = value.slice(0, 12);

    handleChange({ target: { name: e.target.name, value: `+${value}` } });
  };

  // ✅ Email handler: validates and automatically adds @gmail.com
  const handleEmailChange = (e) => {
    let value = e.target.value;

    // Check if the input contains '@' and if it ends with '@gmail.com'
    if (value.includes("@")) {
      // If the user types a full email, just update the value
      handleChange({ target: { name: e.target.name, value } });
    } else {
      // If the user hasn't typed '@', append '@gmail.com'
      value = `${value}@gmail.com`;
      handleChange({ target: { name: e.target.name, value } });
    }

    // Regex for basic email validation
    const emailRegex = /^[^\s@]+@gmail\.com$/i;
    if (value && !emailRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        eMailAdd: "Email must be a valid @gmail.com address",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        eMailAdd: "",
      }));
    }
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
          onChange={handleUppercaseChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          error={!!errors.firstName}
          helperText={errors.firstName}
        />

        {/* Middle Name */}
        <TextField
          label="Middle Name"
          name="middleName"
          value={formData.middleName || ""}
          onChange={handleUppercaseChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          error={!!errors.middleName}
          helperText={errors.middleName}
        />

        {/* Last Name */}
        <TextField
          label="Last Name"
          name="lastName"
          value={formData.lastName || ""}
          onChange={handleUppercaseChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          error={!!errors.lastName}
          helperText={errors.lastName}
        />

        {/* Ext. Name */}
        <TextField
          label="Ext. Name"
          name="extName"
          value={formData.extName || ""}
          onChange={handleUppercaseChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          error={!!errors.extName}
          helperText={errors.extName}
        />

        {/* Gender */}
        <FormControl fullWidth sx={{ minWidth: 300 }} error={!!errors.sex}>
          <InputLabel id="sex-label">Gender</InputLabel>
          <Select
            labelId="sex-label"
            name="sex"
            value={formData.sex || ""}
            onChange={handleUppercaseChange}
            label="Gender"
          >
            <MenuItem value="">Select</MenuItem>
            <MenuItem value="MALE">Male</MenuItem>
            <MenuItem value="FEMALE">Female</MenuItem>
          </Select>
          {!!errors.sex && (
            <Typography variant="caption" color="error">
              {errors.sex}
            </Typography>
          )}
        </FormControl>

        {/* Email */}
        <TextField
          label="Email"
          type="email"
          name="eMailAdd"
          value={formData.eMailAdd || ""}
          onChange={handleEmailChange} // ✅ validate email
          fullWidth
          disabled
          variant="outlined"
          sx={{ minWidth: 300 }}
          error={!!errors.eMailAdd}
          helperText={errors.eMailAdd}
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
          error={!!errors.telNo}
          helperText={errors.telNo}
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
          error={!!errors.mobileNo}
          helperText={errors.mobileNo}
          placeholder="+63"
        />
      </Stack>
    </div>
  );
}
