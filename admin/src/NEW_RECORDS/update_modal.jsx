import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";

// ✅ Editable Text Field
const Field = ({ label, value, onChange, name }) => (
  <Grid item xs={12} sm={6}>
    <TextField
      label={label}
      name={name}
      value={value || ""}
      onChange={onChange}
      fullWidth
      variant="outlined"
      size="small"
    />
  </Grid>
);

// ✅ Section Container
const Section = ({ title, children }) => (
  <Paper
    elevation={0}
    sx={{ border: "1px solid #ddd", p: 2, mb: 2, borderRadius: 2 }}
  >
    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
      {title}
    </Typography>
    <Grid container spacing={2}>
      {children}
    </Grid>
  </Paper>
);

function UpdateModal({ applicant, isOpen, onClose, baseUrl }) {
  if (!isOpen || !applicant) return null;

  // ✅ Local editable state
  const [formData, setFormData] = useState({});
  const API = import.meta.env.VITE_API_BASE;

  // ✅ Initialize only when applicant changes
  useEffect(() => {
    if (applicant) {
      setFormData(applicant);
    }
  }, [applicant]);

  // ✅ Update handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.toUpperCase(), // Convert input to uppercase
    }));
  };

  const FileField = ({ label, fileKey, fileData, baseUrl }) => (
    <Grid item xs={12} sm={6}>
      <TextField
        label={label}
        value={
          fileData[fileKey]
            ? fileData[`${fileKey}_filename`]
            : "No file uploaded"
        }
        fullWidth
        variant="outlined"
        size="small"
        InputProps={{
          sx: {
            color: "black",
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "black",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "black",
            },
            "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
              borderColor: "black",
            },
          },
        }}
        InputLabelProps={{
          sx: {
            color: "black",
            "&.Mui-disabled": { color: "black" },
          },
        }}
      />
      {fileData[fileKey] && (
        <Typography
          variant="body2"
          sx={{ mt: 0.5, display: "flex", gap: 1, alignItems: "center" }}
        >
          <Tooltip title="View File">
            <IconButton
              size="small"
              component="a"
              href={`${baseUrl}/${fileData.id}/${fileKey}`}
              target="_blank"
              rel="noreferrer"
            >
              <Typography component="span">view</Typography>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Download File">
            <IconButton
              size="small"
              component="a"
              href={`${baseUrl}/${fileData.id}/${fileKey}/download`}
              target="_blank"
              rel="noreferrer"
            >
              <Typography component="span">download</Typography>
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>
      )}
    </Grid>
  );

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Applicant Details</DialogTitle>

      <DialogContent dividers>
        {/* Business Info */}
        <Section title="Business Information">
          <Field
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          />
          <Field
            label="ID"
            name="id"
            value={formData.id}
            onChange={handleChange}
          />
          <Field
            label="Business Type"
            name="BusinessType"
            value={formData.BusinessType}
            onChange={handleChange}
          />
          <Field
            label="DSC Registration No"
            name="dscRegNo"
            value={formData.dscRegNo}
            onChange={handleChange}
          />
          <Field
            label="Business Name"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
          />
          <Field
            label="TIN No"
            name="tinNo"
            value={formData.tinNo}
            onChange={handleChange}
          />
          <Field
            label="Trade Name"
            name="TradeName"
            value={formData.TradeName}
            onChange={handleChange}
          />
        </Section>

        {/* Personal Info */}
        <Section title="Personal Information">
          <Field
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <Field
            label="Middle Name"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
          />
          <Field
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          <Field
            label="Extension Name"
            name="extName"
            value={formData.extName}
            onChange={handleChange}
          />
          <Field
            label="Sex"
            name="sex"
            value={formData.sex}
            onChange={handleChange}
          />
        </Section>

        {/* Contact Info */}
        <Section title="Contact Information">
          <Field
            label="Email"
            name="eMailAdd"
            value={formData.eMailAdd}
            onChange={handleChange}
          />
          <Field
            label="Telephone No"
            name="telNo"
            value={formData.telNo}
            onChange={handleChange}
          />
          <Field
            label="Mobile No"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleChange}
          />
        </Section>

        {/* Address */}
        <Section title="Business Address">
          <Field
            label="Region"
            name="region"
            value={formData.region}
            onChange={handleChange}
          />
          <Field
            label="Province"
            name="province"
            value={formData.province}
            onChange={handleChange}
          />
          <Field
            label="City/Municipality"
            name="cityOrMunicipality"
            value={formData.cityOrMunicipality}
            onChange={handleChange}
          />
          <Field
            label="Barangay"
            name="barangay"
            value={formData.barangay}
            onChange={handleChange}
          />
          <Field
            label="Address Line 1"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
          />
          <Field
            label="Zip Code"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
          />
          <Field
            label="Pin Address"
            name="pinAddress"
            value={formData.pinAddress}
            onChange={handleChange}
          />
        </Section>

        {/* Operations */}
        <Section title="Business Operation">
          <Field
            label="Total Floor Area"
            name="totalFloorArea"
            value={formData.totalFloorArea}
            onChange={handleChange}
          />
          <Field
            label="Employees"
            name="numberOfEmployee"
            value={formData.numberOfEmployee}
            onChange={handleChange}
          />
          <Field
            label="Male Employees"
            name="maleEmployee"
            value={formData.maleEmployee}
            onChange={handleChange}
          />
          <Field
            label="Female Employees"
            name="femaleEmployee"
            value={formData.femaleEmployee}
            onChange={handleChange}
          />
          <Field
            label="Vans"
            name="numVehicleVan"
            value={formData.numVehicleVan}
            onChange={handleChange}
          />
          <Field
            label="Trucks"
            name="numVehicleTruck"
            value={formData.numVehicleTruck}
            onChange={handleChange}
          />
          <Field
            label="Motorcycles"
            name="numVehicleMotor"
            value={formData.numVehicleMotor}
            onChange={handleChange}
          />
          <Field
            label="No. of Nozzles"
            name="numNozzle"
            value={formData.numNozzle}
            onChange={handleChange}
          />
          <Field
            label="Weigh Scale"
            name="weighScale"
            value={formData.weighScale}
            onChange={handleChange}
          />
        </Section>

        {/* Tax Address */}
        <Section title="Taxpayer Address">
          <Field
            label="Tax Region"
            name="Taxregion"
            value={formData.Taxregion}
            onChange={handleChange}
          />
          <Field
            label="Tax Province"
            name="Taxprovince"
            value={formData.Taxprovince}
            onChange={handleChange}
          />
          <Field
            label="Tax City/Municipality"
            name="TaxcityOrMunicipality"
            value={formData.TaxcityOrMunicipality}
            onChange={handleChange}
          />
          <Field
            label="Tax Barangay"
            name="Taxbarangay"
            value={formData.Taxbarangay}
            onChange={handleChange}
          />
          <Field
            label="Tax Address Line 1"
            name="TaxaddressLine1"
            value={formData.TaxaddressLine1}
            onChange={handleChange}
          />
          <Field
            label="Tax Zip Code"
            name="TaxzipCode"
            value={formData.TaxzipCode}
            onChange={handleChange}
          />
          <Field
            label="Tax Pin Address"
            name="TaxpinAddress"
            value={formData.TaxpinAddress}
            onChange={handleChange}
          />
          <Field
            label="Own Place"
            name="ownPlace"
            value={formData.ownPlace}
            onChange={handleChange}
          />

          {formData.ownPlace === "Yes" ? (
            <Field
              label="Tax Dec. No."
              name="taxdec"
              value={formData.taxdec}
              onChange={handleChange}
            />
          ) : (
            <>
              <Field
                label="Lessor's Name"
                name="lessorName"
                value={formData.lessorName}
                onChange={handleChange}
              />
              <Field
                label="Monthly Rent"
                name="monthlyRent"
                value={formData.monthlyRent}
                onChange={handleChange}
              />
              <Field
                label="Tax Dec. No."
                name="taxdec"
                value={formData.taxdec}
                onChange={handleChange}
              />
            </>
          )}
        </Section>

        {/* Business Activity */}
        <Section title="Business Activity & Incentives">
          <Field
            label="Tax Incentives"
            name="tIGE"
            value={formData.tIGE}
            onChange={handleChange}
          />

          <Field
            label="Office Type"
            name="officeType"
            value={formData.officeType}
            onChange={handleChange}
          />

          {formData.lineOfBusiness?.split(",").map((lob, index) => {
            const product = formData.productService?.split(",")[index] || "";
            const unit = formData.Units?.split(",")[index] || "";
            const capital = formData.capital?.split(",")[index] || "";

            return (
              <Paper
                key={index}
                elevation={2}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Business Line {index + 1}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      label="Line of Business"
                      name={`lob-${index}`}
                      value={lob.trim()}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      label="Product/Service"
                      name={`product-${index}`}
                      value={product.trim()}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      label="Units"
                      name={`unit-${index}`}
                      value={unit.trim()}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      label="Capital"
                      name={`capital-${index}`}
                      value={capital.trim()}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </Paper>
            );
          })}
        </Section>

        {/* Business Requirements */}
        <Section title="Business Requirements">
          <FileField
            fileKey="proofOfReg"
            label="Proof of Registration"
            fileData={formData}
            baseUrl={baseUrl}
          />
          <FileField
            fileKey="proofOfRightToUseLoc"
            label="Proof of Right to Use Location"
            fileData={formData}
            baseUrl={baseUrl}
          />
          <FileField
            fileKey="locationPlan"
            label="Location Plan"
            fileData={formData}
            baseUrl={baseUrl}
          />
          <FileField
            fileKey="brgyClearance"
            label="Barangay Clearance"
            fileData={formData}
            baseUrl={baseUrl}
          />
          <FileField
            fileKey="marketClearance"
            label="Market Clearance"
            fileData={formData}
            baseUrl={baseUrl}
          />
          <FileField
            fileKey="occupancyPermit"
            label="Occupancy Permit"
            fileData={formData}
            baseUrl={baseUrl}
          />
          <FileField
            fileKey="cedula"
            label="Cedula"
            fileData={formData}
            baseUrl={baseUrl}
          />
          <FileField
            fileKey="photoOfBusinessEstInt"
            label="Photo (Interior)"
            fileData={formData}
            baseUrl={baseUrl}
          />
          <FileField
            fileKey="photoOfBusinessEstExt"
            label="Photo (Exterior)"
            fileData={formData}
            baseUrl={baseUrl}
          />
        </Section>

        {/* Backroom */}
        {formData.status !== "pending" && (
          <Section title="Backroom">
            {/* keep your zoning, OBO, CHO, CSWMO, CENRO sections here with editable fields */}
          </Section>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>

        <Button
          variant="contained"
          color="success"
          onClick={async () => {
            try {
              // Send PUT request to update applicant
              const res = await axios.put(
                `${API}/newApplication/files/${formData.id}`,
                formData
              );

              if (res.status === 200) {
                alert("✅ Applicant updated successfully!");
                onClose(); // Close modal
              } else {
                alert("⚠️ Unexpected response from server.");
              }
            } catch (err) {
              console.error("❌ Update failed:", err);
              alert("Failed to update applicant.");
            }
          }}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UpdateModal;
