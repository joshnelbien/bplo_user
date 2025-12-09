import { Box, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function Section7FileUploads({ handleFileChange, errors }) {
  const [localData, setLocalData] = useState({
    formData: {},
    files: {},
  });

  useEffect(() => {
    const storedFormData =
      JSON.parse(localStorage.getItem("formDataState")) || {};
    const storedFiles = JSON.parse(localStorage.getItem("filesState")) || {};
    setLocalData({ formData: storedFormData, files: storedFiles });
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Business Requirements
      </Typography>

      {/* Show ONLY fields that have a value */}
      {Object.keys(localData.formData)
        .filter((key) => localData.formData[key]) // only show if has value
        .map((key) => (
          <TextField
            key={key}
            label={key}
            name={key}
            value={localData.formData[key]}
            error={Boolean(errors[key])}
            helperText={errors[key] || ""}
            fullWidth
            disabled
          />
        ))}

      {/* Show ONLY files that exist */}
      {Object.keys(localData.files)
        .filter((key) => localData.files[key]) // only show if file exists
        .map((key) => (
          <TextField
            key={key}
            label={key}
            name={key}
            value={localData.files[key]?.name || ""}
            fullWidth
            disabled
          />
        ))}
    </Box>
  );
}
