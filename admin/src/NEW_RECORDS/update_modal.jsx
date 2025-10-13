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

const formatCurrency = (value) => {
  if (value == null || value === "") return "";
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

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

    // Remove commas for numeric fields
    const cleanValue = value.replace(/,/g, "");

    setFormData((prev) => ({
      ...prev,
      [name]: cleanValue.toUpperCase(), // keep uppercase for text
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
          <Field label="Tax Incentives" value={applicant.tIGE} />
          {applicant.tIGE === "Yes" && (
            <FileField
              fileKey="tIGEfiles"
              label="Tax Incentives From Government"
              fileData={applicant}
            />
          )}

          <Field label="Office Type" value={applicant.officeType} />

          {(() => {
            // ✅ Utility function to safely parse CSV-like fields with quotes
            const parseCSV = (text) => {
              if (!text) return [];
              return text

                .trim()

                .replace(/^\[|\]$/g, "")

                .split(/",\s*"?/)

                .map((val) => val.replace(/^"|"$/g, "").trim())
                .filter((val) => val.length > 0);
            };

            // ✅ Extract arrays for each field
            const lobArr = parseCSV(applicant.lineOfBusiness);
            const productArr = parseCSV(applicant.productService);
            const unitArr = parseCSV(applicant.Units);
            const capitalArr = parseCSV(applicant.capital);
            const natureCodeArr = parseCSV(applicant.natureCode);
            const businessNatureArr = parseCSV(applicant.businessNature);
            const lineCodeArr = parseCSV(applicant.lineCode);

            // ✅ Find the maximum length among arrays (in case some are shorter)
            const maxLength = Math.max(
              lobArr.length,
              productArr.length,
              unitArr.length,
              capitalArr.length,
              natureCodeArr.length,
              businessNatureArr.length,
              lineCodeArr.length
            );

            return Array.from({ length: maxLength }).map((_, index) => {
              const lob = lobArr[index] || "";
              const product = productArr[index] || "";
              const unit = unitArr[index] || "";
              const capital = capitalArr[index] || "";
              const natureCode = natureCodeArr[index] || "";
              const businessNature = businessNatureArr[index] || "";
              const lineCode = lineCodeArr[index] || "";

              return (
                <Paper
                  key={index}
                  elevation={2}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    backgroundColor: "#f9f9f9",
                    width: "100%", // 🟩 Ensure Paper itself takes full width
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    gutterBottom
                  >
                    Business Line {index + 1}
                  </Typography>

                  <Grid container spacing={2}>
                    {/* 🟩 Line of Business — full width */}
                    <Field
                      label="Line of Business"
                      value={lob}
                      fullWidth
                      multiline
                      rows={3} // adjust rows if you want a taller box (e.g., 4 or 5)
                    />

                    <Grid item xs={12} sm={6}>
                      <Field label="Product/Service" value={product} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field label="Units" value={unit} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field label="Capital" value={formatCurrency(capital)} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field label="Nature Code" value={natureCode} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field label="Business Nature" value={businessNature} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field label="Line Code" value={lineCode} />
                    </Grid>
                  </Grid>
                </Paper>
              );
            });
          })()}
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
