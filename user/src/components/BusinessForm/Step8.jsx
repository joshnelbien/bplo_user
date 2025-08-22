// src/components/BusinessForm/Section8FileUploads.jsx
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function Section8FileUploads({ handleFileChange }) {
  const files = [
    { label: "Proof of Registration", name: "proofOfReg" },
    { label: "Proof of Right to Use Location", name: "proofOfRightToUseLoc" },
    { label: "Location Plan", name: "locationPlan" },
    { label: "Barangay Clearance", name: "brgyClearance" },
    { label: "Market Clearance", name: "marketClearance" },
    { label: "Occupancy Permit", name: "occupancyPermit" },
    { label: "Cedula", name: "cedula" },
    { label: "Photo of Business Establishment (Interior)", name: "photoOfBusinessEstInt" },
    { label: "Photo of Business Establishment (Exterior)", name: "photoOfBusinessEstExt" },
    { label: "TIGE Files", name: "tIGEfiles" },
  ];

  // State to track selected files
  const [selectedFiles, setSelectedFiles] = useState({});

  const handleFileSelect = (e) => {
    const { name, files } = e.target;
    setSelectedFiles((prev) => ({ ...prev, [name]: files[0] ? files[0].name : "" }));
    handleFileChange(e); // call parent handler
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <Typography variant="h6" gutterBottom>
        Business Requirements
      </Typography>

      <Stack spacing={3}>
        {files.map((file) => (
          <Stack key={file.name} direction="column" spacing={1}>
            <Typography>{file.label}:</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
                 <Button
                variant="contained"
                component="label"
                size="small" // smaller button
                sx={{ minWidth: 100 }}
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
    </div>
  );
}
