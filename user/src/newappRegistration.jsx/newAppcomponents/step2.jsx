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
  // ✅ Uppercase handler for text fields with minimum 3 letters validation
  const handleUppercaseChange = (e) => {
    const { name, value } = e.target;
    const upperValue = (value || "").toUpperCase();
    const letterCount = (upperValue.replace(/[^A-Za-z]/g, "") || "").length;

    // Validate minimum 3 letters for firstName, middleName, and lastName
    if (
      (name === "firstName" || name === "middleName" || name === "lastName") &&
      letterCount < 3 &&
      upperValue.length > 0
    ) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Minimum of 3 letters required",
      }));
    } else if (
      (name === "firstName" || name === "middleName" || name === "lastName") &&
      letterCount >= 3
    ) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    handleChange({ target: { name, value: upperValue } });
  };

  // ✅ Telephone number: digits only, max 9, optional
  const handleTelNumberInput = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 9);
    handleChange({ target: { name: e.target.name, value } });
  };

  // ✅ Mobile number: digits only, starts with +63, append user input
  const handlePhoneNumberInput = (e) => {
    let value = e.target.value.replace(/\D/g, "");

    // If value is empty or just 63, reset to 63
    if (!value || value === "63") {
      value = "63";
    } else {
      // Remove existing 63 and append user input after it
      // This logic prevents the user from deleting the +63 prefix
      value = value.replace("63", "").trim();
      value = `63${value}`;
    }

    // Limit to a total of 12 digits (63 + 9 digits)
    value = value.slice(0, 12);

    handleChange({ target: { name: e.target.name, value: `+${value}` } });
  };

  // ❌ REMOVED CUSTOM LOGIC: Now just passes the raw input value up to the state.
  // The validation in the parent component will handle the "@gmail.com" requirement.
  const handleEmailChange = (e) => {
    handleChange(e);
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
          helperText={errors.firstName || "Minimum of 3 letters required"}
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
          helperText={errors.middleName || "Minimum of 3 letters required"}
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
          helperText={errors.lastName || "Minimum of 3 letters required"}
        />

        {/* Ext. Name (Optional) */}
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
          name="email"
          value={formData.email || ""} // ✅ CHANGED: Set value to an empty string (or the current state)
          onChange={handleEmailChange} // ✅ CHANGED: Now uses the simplified handler
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          error={!!errors.email}
          helperText={errors.email || "Example: user@gmail.com"} // ✅ IMPROVED HINT
          placeholder="user@gmail.com" // ✅ IMPROVED PLACEHOLDER
        />

        {/* Telephone No. (Optional) */}
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
          value={formData.mobileNo || "+63"}
          onChange={handlePhoneNumberInput}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          error={!!errors.mobileNo}
          helperText={formData.mobileNo === '+63' ? "Must be 9 digits after +63" : errors.mobileNo || "Philippine mobile numbers"}
          placeholder="+639171234567"
        />
      </Stack>
    </div>
  );
}