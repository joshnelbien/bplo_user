// Section8FileUploads.jsx
import { Button, Grid, Typography } from "@mui/material";

export default function Section8FileUploads({ handleFileChange }) {
  const fileInputs = [
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

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        File Uploads
      </Typography>
      <Grid container spacing={2}>
        {fileInputs.map((file, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <Button variant="outlined" component="label" fullWidth>
              {file.label}
              <input type="file" name={file.name} hidden onChange={handleFileChange}/>
            </Button>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
