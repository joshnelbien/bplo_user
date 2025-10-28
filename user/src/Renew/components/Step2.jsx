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

  return (
    <div style={{ marginBottom: 20 }}>
      <Typography variant="h6" gutterBottom>
        Owner's Personal Information
      </Typography>

      <Stack spacing={3}>
        {/* First Name */}
        <TextField
          label="First Name"
          name="incharge_first_name"
          value={formData.incharge_first_name || ""}
          onChange={handleUppercaseChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          error={!!errors.incharge_first_name}
          helperText={errors.incharge_first_name}
        />

        {/* Middle Name */}
        <TextField
          label="Middle Name"
          name="incharge_middle_name"
          value={formData.incharge_middle_name || ""}
          onChange={handleUppercaseChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          error={!!errors.incharge_middle_name}
          helperText={errors.incharge_middle_name}
        />

        {/* Last Name */}
        <TextField
          label="Last Name"
          name="incharge_last_name"
          value={formData.incharge_last_name || ""}
          onChange={handleUppercaseChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          error={!!errors.incharge_last_name}
          helperText={errors.incharge_last_name}
        />

        {/* Ext. Name */}
        <TextField
          label="Ext. Name"
          name="incharge_extension_name"
          value={formData.incharge_extension_name || ""}
          onChange={handleUppercaseChange}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          error={!!errors.incharge_extension_name}
          helperText={errors.incharge_extension_name}
        />

        {/* Gender */}
        <FormControl
          fullWidth
          sx={{ minWidth: 300 }}
          error={!!errors.incharge_sex}
        >
          <InputLabel id="incharge_sex">Gender</InputLabel>
          <Select
            labelId="incharge_sex"
            name="incharge_sex"
            value={
              formData.incharge_sex === "M"
                ? "M"
                : formData.incharge_sex === "F"
                ? "F"
                : ""
            }
            onChange={(e) => {
              const value = e.target.value;
              handleChange({
                target: {
                  name: "incharge_sex",
                  value: value === "M" ? "M" : value === "F" ? "F" : "",
                },
              });
            }}
            label="Gender"
          >
            <MenuItem value="">Select</MenuItem>
            <MenuItem value="M">Male</MenuItem>
            <MenuItem value="F">Female</MenuItem>
          </Select>
          {!!errors.incharge_sex && (
            <Typography variant="caption" color="error">
              {errors.incharge_sex}
            </Typography>
          )}
        </FormControl>

        {/* Email */}
        <TextField
          label="Email"
          type="email"
          name="email_address"
          value={formData.email_address || ""}
          onChange={(e) => {
            const value = e.target.value.toLowerCase();
            handleChange({ target: { name: e.target.name, value } });

            // ✅ Simple live validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
              setErrors((prev) => ({
                ...prev,
                email_address: "Please enter a valid email address.",
              }));
            } else {
              setErrors((prev) => ({ ...prev, email_address: "" }));
            }
          }}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          error={!!errors.email_address}
          helperText={errors.email_address || "Example: name@example.com"}
        />

        {/* Telephone No. */}
        <TextField
          label="Telephone No."
          name="telephone_no"
          value={formData.telephone_no || ""}
          onChange={handleTelNumberInput}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          error={!!errors.telephone_no}
          helperText={errors.telephone_no}
        />

        {/* Mobile No. */}
        <TextField
          label="Mobile No."
          name="cellphone_no"
          value={formData.cellphone_no || ""}
          onChange={handlePhoneNumberInput}
          fullWidth
          variant="outlined"
          sx={{ minWidth: 300 }}
          error={!!errors.cellphone_no}
          helperText={errors.cellphone_no}
          placeholder="+63"
        />
      </Stack>
    </div>
  );
}
