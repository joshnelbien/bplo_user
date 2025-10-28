import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Autocomplete,
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
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { NumericFormat } from "react-number-format";

export default function Step6BusinessActivity({
  formData,
  handleChange,
  handleFileChange,
  businessLines,
  setBusinessLines,
  errors,
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
  const [addErrors, setAddErrors] = useState({});
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  // ✅ Business line options from DB
  const [lobOptions, setLobOptions] = useState([]);
  const API = import.meta.env.VITE_API_BASE; // ✅ Your backend base URL

  useEffect(() => {
    const fetchBusinessLines = async () => {
      try {
        const res = await axios.get(`${API}/api/my-existing-table`);
        // assuming backend returns array of records with business_line field
        const lines = res.data
          .map((item) => item.business_line?.toUpperCase())
          .filter(Boolean);
        setLobOptions([...new Set(lines)]);
      } catch (err) {
        console.error("❌ Failed to fetch business_line from DB:", err);
      }
    };
    fetchBusinessLines();
  }, [API]);

  // ✅ File select handler
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;
    setSelectedFiles((prev) => ({
      ...prev,
      [name]: file ? file.name : "",
    }));
    handleFileChange(e);
  };

  // ✅ Delete business line
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

  // ✅ Input changes
  const handleBusinessChange = (e) => {
    const { name, value } = e.target;
    setNewBusiness((prev) => ({
      ...prev,
      [name]: typeof value === "string" ? value.toUpperCase() : value,
    }));
    setAddErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ✅ Add or edit business line
  const addBusinessLine = () => {
    const newErrors = {};
    if (!newBusiness.lineOfBusiness)
      newErrors.lineOfBusiness = "Line of Business is required";
    if (!newBusiness.productService)
      newErrors.productService = "Product/Service is required";
    if (!newBusiness.Units) newErrors.Units = "Units is required";
    if (!newBusiness.capital) newErrors.capital = "Capital is required";

    if (Object.keys(newErrors).length > 0) {
      setAddErrors(newErrors);
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
    setAddErrors({});
  };

  const editBusinessLine = (index) => {
    setNewBusiness(businessLines[index]);
    setEditingIndex(index);
    setAddErrors({});
  };

  // ✅ Total Capital calculation
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
        {/* ✅ Tax Incentives */}
        <FormControl fullWidth sx={{ minWidth: 300 }} error={!!errors.tIGE}>
          <InputLabel id="tIGE-label">Tax Incentives from Gov't</InputLabel>
          <Select
            labelId="tIGE-label"
            name="tIGE"
            value={formData.tIGE || ""}
            onChange={(e) =>
              handleChange({
                target: {
                  name: e.target.name,
                  value: e.target.value.toUpperCase(),
                },
              })
            }
            label="Tax Incentives from Gov't"
          >
            <MenuItem value="">Select</MenuItem>
            <MenuItem value="NO">No</MenuItem>
            <MenuItem value="YES">Yes</MenuItem>
          </Select>
          {!!errors.tIGE && (
            <Typography variant="caption" color="error">
              {errors.tIGE}
            </Typography>
          )}
        </FormControl>

        {/* ✅ File Upload */}
        {formData.tIGE === "YES" && (
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
                      backgroundColor: "#1d5236",
                      color: "white",
                      width: "180px",
                      "&:hover": {
                        backgroundColor: "#072b0b",
                      },
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
                    placeholder="NO FILE SELECTED"
                    size="small"
                    fullWidth
                    InputProps={{ readOnly: true }}
                    error={!!errors[file.name]}
                    helperText={errors[file.name]}
                  />
                </Stack>
              </Stack>
            ))}
          </Stack>
        )}

        {/* ✅ Office Type */}
        <FormControl
          fullWidth
          sx={{ minWidth: 300 }}
          error={!!errors.officeType}
        >
          <InputLabel id="officeType-label">Office Type</InputLabel>
          <Select
            labelId="officeType-label"
            name="officeType"
            value={formData.officeType || ""}
            onChange={(e) =>
              handleChange({
                target: {
                  name: e.target.name,
                  value: e.target.value.toUpperCase(),
                },
              })
            }
            label="Office Type"
          >
            <MenuItem value="">-- SELECT OFFICE TYPE --</MenuItem>
            <MenuItem value="MAIN">Main</MenuItem>
            <MenuItem value="BRANCH OFFICE">Branch Office</MenuItem>
            <MenuItem value="ADMIN OFFICE ONLY">Admin Office Only</MenuItem>
            <MenuItem value="WAREHOUSE">Warehouse</MenuItem>
            <MenuItem value="OTHERS">Others (Specify)</MenuItem>
          </Select>
        </FormControl>

        {formData.officeType === "OTHERS" && (
          <TextField
            label="Specify Business Activity"
            name="officeTypeOther"
            value={formData.officeTypeOther || ""}
            onChange={(e) =>
              handleChange({
                target: {
                  name: e.target.name,
                  value: e.target.value.toUpperCase(),
                },
              })
            }
            fullWidth
          />
        )}

        {/* ✅ Add Line of Business Section */}
        <Typography variant="subtitle1">Add Line of Business</Typography>

        <Autocomplete
          freeSolo
          options={lobOptions}
          value={newBusiness.lineOfBusiness}
          onChange={(event, newValue) => {
            setNewBusiness((prev) => ({
              ...prev,
              lineOfBusiness: (newValue || "").toUpperCase(),
            }));
            setAddErrors((prev) => ({ ...prev, lineOfBusiness: "" }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Line of Business"
              onChange={(e) =>
                setNewBusiness((prev) => ({
                  ...prev,
                  lineOfBusiness: e.target.value.toUpperCase(),
                }))
              }
              error={!!addErrors.lineOfBusiness}
              helperText={addErrors.lineOfBusiness}
            />
          )}
          fullWidth
        />

        <TextField
          label="Product/Service"
          name="productService"
          value={newBusiness.productService}
          onChange={handleBusinessChange}
          fullWidth
          error={!!addErrors.productService}
          helperText={addErrors.productService}
        />

        <TextField
          label="Units"
          name="Units"
          type="number"
          value={newBusiness.Units}
          onChange={handleBusinessChange}
          fullWidth
          error={!!addErrors.Units}
          helperText={addErrors.Units}
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
          error={!!addErrors.capital}
          helperText={addErrors.capital}
        />

        <Button
          variant="contained"
          onClick={addBusinessLine}
          sx={{
            backgroundColor: "#1d5236",
            color: "white",
            "&:hover": {
              backgroundColor: "#072b0b",
            },
          }}
        >
          {editingIndex !== null ? "SAVE CHANGES" : "ADD LINE OF BUSINESS"}
        </Button>

        {/* ✅ Business List */}
        <Stack spacing={2}>
          {businessLines.map((biz, index) => (
            <Card key={index} variant="outlined">
              <CardContent>
                <Typography variant="subtitle2">
                  LINE OF BUSINESS : {biz.lineOfBusiness}
                </Typography>
                <Typography variant="subtitle2">
                  PRODUCT AND SERVICES : {biz.productService}
                </Typography>
                <Typography variant="body2">UNITS: {biz.Units}</Typography>
                <Typography variant="body2">
                  CAPITAL:{" "}
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
                    <Typography>EDIT</Typography>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleOpenConfirm(index)}
                    color="error"
                  >
                    <Typography>DELETE</Typography>
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
            TOTAL CAPITAL:{" "}
            <NumericFormat
              value={totalCapital}
              displayType="text"
              thousandSeparator=","
              decimalScale={2}
              fixedDecimalScale
              prefix="₱"
            />
          </Typography>
        )}
      </Stack>

      {/* ✅ Delete Confirmation Modal */}
      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>CONFIRM DELETE</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ARE YOU SURE YOU WANT TO DELETE THIS LINE OF BUSINESS?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>CANCEL</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            DELETE
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
