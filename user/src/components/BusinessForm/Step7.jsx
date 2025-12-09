import { Box, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function Section7FileUploads({ handleFileChange, errors }) {
  // State to hold all the localStorage formData and files
  const [localData, setLocalData] = useState({
    formData: {},
    files: {},
  });

  // On mount, load data from localStorage
  useEffect(() => {
    const storedFormData =
      JSON.parse(localStorage.getItem("formDataState")) || {};
    const storedFiles = JSON.parse(localStorage.getItem("filesState")) || {};
    setLocalData({ formData: storedFormData, files: storedFiles });
  }, []);

  // Handle changes for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData((prev) => {
      const updatedFormData = { ...prev.formData, [name]: value };
      localStorage.setItem("formDataState", JSON.stringify(updatedFormData));
      return { ...prev, formData: updatedFormData };
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Business Requirements
      </Typography>

      {Object.keys(localData.formData)
        .filter((key) => localData.formData[key])
        .map((key) => (
          <TextField
            key={key}
            label={key}
            name={key}
            value={localData.formData[key]}
            onChange={handleChange}
            error={Boolean(errors[key])}
            helperText={errors[key] || ""}
            fullWidth
            disabled
          />
        ))}

      {Object.keys(localData.files)
        .filter((key) => localData.files[key])
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
