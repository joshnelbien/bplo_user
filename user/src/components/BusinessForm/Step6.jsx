// src/components/BusinessForm/Step6BusinessActivity.jsx
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { NumericFormat } from "react-number-format";

export default function Step6BusinessActivity({
  formData,
  handleChange,
  handleFileChange,
  businessLines,
  setBusinessLines,
}) {
  const files = [{ label: "TIGE Files", name: "tIGEfiles" }];

  const [selectedFiles, setSelectedFiles] = useState({});
  const [newBusiness, setNewBusiness] = useState({
    lineOfBusiness: "",
    productService: "",
    Units: "",
    capital: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);

  // 🆕 Confirmation dialog state
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const handleOpenConfirm = (index) => {
    setDeleteIndex(index);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setDeleteIndex(null);
  };

  const handleConfirmDelete = () => {
    if (deleteIndex !== null) {
      const updated = [...businessLines];
      updated.splice(deleteIndex, 1);
      setBusinessLines(updated);
    }
    handleCloseConfirm();
  };

  const handleFileSelect = (e) => {
    const { name, files } = e.target;
    console.log("Step6 selected:", name, files[0]);
    setSelectedFiles((prev) => ({
      ...prev,
      [name]: files[0] ? files[0].name : "",
    }));
    handleFileChange(e); // pass file to parent
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
      const updated = [...businessLines];
      updated[editingIndex] = newBusiness;
      setBusinessLines(updated);
      setEditingIndex(null);
    } else {
      setBusinessLines([...businessLines, newBusiness]);
    }

    setNewBusiness({
      lineOfBusiness: "",
      productService: "",
      Units: "",
      capital: "",
    });
  };

  const editBusinessLine = (index) => {
    setNewBusiness(businessLines[index]);
    setEditingIndex(index);
  };

  // ✅ Calculate total capital using useMemo (efficient re-rendering)
  const totalCapital = useMemo(() => {
    return businessLines.reduce(
      (sum, biz) => sum + (parseFloat(biz.capital) || 0),
      0
    );
  }, [businessLines]);

  useEffect(() => {
    handleChange({ target: { name: "totalCapital", value: totalCapital } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalCapital]);

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
        <NumericFormat
          customInput={TextField}
          label="Capital"
          name="capital"
          value={newBusiness.capital}
          onValueChange={(values) => {
            handleBusinessChange({
              target: { name: "capital", value: values.floatValue || 0 },
            });
          }}
          thousandSeparator=","
          decimalScale={2}
          fixedDecimalScale
          allowNegative={false}
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
                  Line Of Business : {biz.lineOfBusiness}
                </Typography>
                <Typography variant="subtitle2">
                  Product and Services : {biz.productService}
                </Typography>
                <Typography variant="body2">Units: {biz.Units}</Typography>
                <Typography variant="body2">
                  Capital:{" "}
                  <NumericFormat
                    value={biz.capital}
                    displayType="text"
                    thousandSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                    prefix="₱"
                  />
                </Typography>
                <Stack direction="row" spacing={1} mt={1}>
                  <IconButton
                    onClick={() => editBusinessLine(index)}
                    color="success"
                  >
                    <Typography>Edit</Typography>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleOpenConfirm(index)}
                    color="error"
                  >
                    <Typography>Delete</Typography>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>

        {/* ✅ Total Capital */}
        {businessLines.length > 0 && (
          <Typography variant="h6" sx={{ mt: 2 }}>
            Total Capital: {totalCapital.toLocaleString()}
          </Typography>
        )}
      </Stack>

      {/* 🆕 Delete Confirmation Modal */}
      <Dialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        aria-labelledby="confirm-delete-title"
      >
        <DialogTitle id="confirm-delete-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this line of business?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
