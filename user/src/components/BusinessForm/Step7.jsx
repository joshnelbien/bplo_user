import { Button, Stack, TextField, Typography, Dialog, DialogActions, DialogContent, DialogContentText } from "@mui/material";
import { useState } from "react";

export default function Section7FileUploads({ handleFileChange }) {
  const files = [
    { label: "Proof of Registration", name: "proofOfReg" },
    { label: "Proof of Right to Use Location", name: "proofOfRightToUseLoc" },
    { label: "Location Plan", name: "locationPlan" },
    { label: "Barangay Clearance (Optional)", name: "brgyClearance" },
    { label: "Market Clearance (Optional)", name: "marketClearance" },
    { label: "Occupancy Permit (Optional)", name: "occupancyPermit" },
    { label: "Cedula", name: "cedula" },
    { label: "Photo of Business Establishment (Interior)", name: "photoOfBusinessEstInt" },
    { label: "Photo of Business Establishment (Exterior)", name: "photoOfBusinessEstExt" },
  ];

  const [selectedFiles, setSelectedFiles] = useState({});
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleFileSelect = (e) => {
    const { name, files } = e.target;
    setSelectedFiles((prev) => ({
      ...prev,
      [name]: files[0] ? files[0].name : "",
    }));
    handleFileChange(e); // call parent handler
  };

  // Open confirmation dialog
  const handleSubmitClick = () => {
    setOpenConfirm(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpenConfirm(false);
  };

  // Handle Yes
  const handleConfirmYes = () => {
    setOpenConfirm(false);
    console.log("Form submitted ✅"); // replace with your actual submit logic
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
                size="small"
                sx={{
                  minWidth: 120,
                  backgroundColor: "#4caf50", // ✅ your custom green
                  "&:hover": { backgroundColor: "#15400d" },
                }}
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
                InputProps={{ readOnly: true }}
              />
            </Stack>
          </Stack>
        ))}

       
      </Stack>

   
    </div>
  );
}
