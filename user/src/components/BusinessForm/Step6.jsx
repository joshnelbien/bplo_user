// src/components/BusinessForm/Step6BusinessActivity.jsx
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Card,
  CardContent,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function Step6BusinessActivity({
  formData,
  handleChange,
  handleFileChange,
  businessLines,
  setBusinessLines
}) {
  const files = [{ label: "TIGE Files", name: "tIGEfiles" }];

  // State to track selected files
  const [selectedFiles, setSelectedFiles] = useState({});

  // State for multiple lines of business

  const [newBusiness, setNewBusiness] = useState({
    lineOfBusiness: "",
    productService: "",
    Units: "",
    capital: "",
  });

  // For editing
  const [editingIndex, setEditingIndex] = useState(null);

  const handleFileSelect = (e) => {
    const { name, files } = e.target;
    setSelectedFiles((prev) => ({
      ...prev,
      [name]: files[0] ? files[0].name : "",
    }));
    handleFileChange(e); // call parent handler
  };

  const handleBusinessChange = (e) => {
    const { name, value } = e.target;
    setNewBusiness((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addBusinessLine = () => {
    if (
      !newBusiness.lineOfBusiness ||
      !newBusiness.productService ||
      !newBusiness.Units ||
      !newBusiness.capital
    ) {
      alert("Please fill all fields before adding.");
      return;
    }

    if (editingIndex !== null) {
      // Update existing
      const updated = [...businessLines];
      updated[editingIndex] = newBusiness;
      setBusinessLines(updated);
      setEditingIndex(null);
    } else {
      // Add new
      setBusinessLines([...businessLines, newBusiness]);
    }

    // Reset input
    setNewBusiness({ lineOfBusiness: "", productService: "", Units: "", capital: "" });
  };

  const editBusinessLine = (index) => {
    setNewBusiness(businessLines[index]);
    setEditingIndex(index);
  };

  const deleteBusinessLine = (index) => {
    const updated = [...businessLines];
    updated.splice(index, 1);
    setBusinessLines(updated);
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <Typography variant="h6" gutterBottom>
        Business Activity
      </Typography>

      <Stack spacing={3}>
        {/* Tax Incentives */}
        <FormControl fullWidth sx={{ minWidth: 300 }}>
          <InputLabel id="tIGE-label">Tax Incentives from Gov't</InputLabel>
          <Select
            labelId="tIGE-label"
            name="tIGE"
            value={formData.tIGE || ""}
            onChange={handleChange}
          >
            <MenuItem value="">Select</MenuItem>
            <MenuItem value="No">No</MenuItem>
            <MenuItem value="Yes">Yes</MenuItem>
          </Select>
        </FormControl>

        {/* File Upload for TIGE */}
        {formData.tIGE === "Yes" && (
          <Stack spacing={3}>
            {files.map((file) => (
              <Stack key={file.name} direction="column" spacing={1}>
                <Typography>{file.label}:</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    variant="contained"
                    component="label"
                    size="small"
                    sx={{ minWidth: 120 }}
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
        )}

        {/* Office Type */}
        <FormControl fullWidth sx={{ minWidth: 300 }}>
          <InputLabel id="officeType-label">Office Type</InputLabel>
          <Select
            labelId="officeType-label"
            name="officeType"
            value={formData.officeType || ""}
            onChange={handleChange}
          >
            <MenuItem value="">-- Select Office Type --</MenuItem>
            <MenuItem value="Main">Main</MenuItem>
            <MenuItem value="Branch Office">Branch Office</MenuItem>
            <MenuItem value="Admin Office Only">Admin Office Only</MenuItem>
            <MenuItem value="Warehouse">Warehouse</MenuItem>
            <MenuItem value="Others">Others (Specify)</MenuItem>
          </Select>
        </FormControl>

        {formData.officeType === "Others" && (
          <TextField
            label="Specify Business Activity"
            name="officeTypeOther"
            value={formData.officeTypeOther || ""}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            sx={{ minWidth: 300 }}
          />
        )}

        {/* Add Line of Business Section */}
        <Typography variant="subtitle1">Add Line of Business</Typography>

        <TextField
          label="Line of Business"
          name="lineOfBusiness"
          value={newBusiness.lineOfBusiness}
          onChange={handleBusinessChange}
          fullWidth
        />
        <TextField
          label="Product/Service"
          name="productService"
          value={newBusiness.productService}
          onChange={handleBusinessChange}
          fullWidth
        />
        <TextField
          label="Units"
          name="Units"
          type="number"
          value={newBusiness.Units}
          onChange={handleBusinessChange}
          fullWidth
        />
        <TextField
          label="Capital"
          name="capital"
          type="number"
          value={newBusiness.capital}
          onChange={handleBusinessChange}
          fullWidth
        />

        <Button variant="contained" onClick={addBusinessLine}>
          {editingIndex !== null ? "Save Changes" : "Add Line of Business"}
        </Button>

        {/* Business List */}
        <Stack spacing={2}>
          {businessLines.map((biz, index) => (
            <Card key={index} variant="outlined">
              <CardContent>
                <Typography variant="subtitle2">
                  Line Of Business : {biz.productService}
                </Typography>
                <Typography variant="subtitle2">
                  Product and Services : {biz.productService}
                </Typography>
                <Typography variant="body2">
                  Units: {biz.Units}
                </Typography>
                <Typography variant="body2">
                  Capital: {biz.capital}
                </Typography>
                <Stack direction="row" spacing={1} mt={1}>
                  <IconButton onClick={() => editBusinessLine(index)}>
                    <EditIcon variant="outlined" />
                  </IconButton>
                  <IconButton onClick={() => deleteBusinessLine(index)}>
                    <DeleteIcon variant="outlined" />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Stack>
    </div>
  );
}
