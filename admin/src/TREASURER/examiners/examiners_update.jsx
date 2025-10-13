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
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import axios from "axios";
import ExaminersApplicantModal from "./examiners_modal";

const API = import.meta.env.VITE_API_BASE;

// ✅ Reusable Text Field
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

// ✅ Section Wrapper
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

// ✅ File Viewer / Downloader
const FileField = ({ label, fileKey, fileData }) => (
  <Grid item xs={12} sm={6}>
    <TextField
      label={label}
      value={
        fileData[fileKey] ? fileData[`${fileKey}_filename`] : "No file uploaded"
      }
      fullWidth
      variant="outlined"
      size="small"
      disabled
      InputProps={{
        sx: {
          color: "black",
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "black",
          },
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
            href={`${API}/examiners/examiners/${fileData.id}/${fileKey}`}
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
            href={`${API}/examiners/examiners/${fileData.id}/${fileKey}/download`}
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

function ExaminersApplicantModalUpdate({
  applicant,
  isOpen,
  onClose,
  onApprove,
}) {
  const [formData, setFormData] = useState({});
  const [capitalValues, setCapitalValues] = useState([]);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [examinersModal, setExaminersModal] = useState(false);

  useEffect(() => {
    if (applicant) {
      setFormData({ ...applicant });
      setCapitalValues(parseCSV(applicant.capital));
    }
  }, [applicant]);

  const parseCSV = (text) => {
    if (!text) return [];
    return text
      .trim()
      .replace(/^\[|\]$/g, "")
      .split(/",\s*"?/)
      .map((val) => val.replace(/^"|"$/g, "").trim())
      .filter((val) => val.length > 0);
  };

  if (!isOpen || !applicant) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.toUpperCase(),
    }));
  };

  const handleUpdate = async () => {
    try {
      const updatedData = {
        ...formData,
        capital: JSON.stringify(capitalValues), // send as JSON array string
      };

      const res = await axios.put(
        `${API}/examiners/examiners/${formData.id}`,
        updatedData
      );

      if (res.status === 200) {
        console.log("✅ Updated record:", res.data);
        setSuccessDialogOpen(true);

        if (onApprove) onApprove(formData, capitalValues);

        // wait a bit before closing and refreshing
        setTimeout(() => {
          setSuccessDialogOpen(false);
          setExaminersModal(false);
          onClose();

          // 🔄 Refresh the whole page
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      console.error("❌ Update failed:", err);
      alert("Failed to update applicant details.");
    }
  };

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Update Applicant Details</DialogTitle>
        <DialogContent dividers>
          {/* Business Info */}
          <Section title="Business Information">
            <Field label="Status" value={applicant.Examiners} />
            <Field label="Mode of Payment" value={applicant.Modeofpayment} />
            <Field label="BIN" value={applicant.BIN} />
            <Field label="Business Type" value={applicant.BusinessType} />
            <Field label="DSC Registration No" value={applicant.dscRegNo} />
            <Field label="Business Name" value={applicant.businessName} />
            <Field label="TIN No" value={applicant.tinNo} />
            <Field label="Trade Name" value={applicant.TradeName} />
          </Section>

          {/* Personal Info */}
          <Section title="Personal Information">
            <Field label="First Name" value={applicant.firstName} />
            <Field label="Middle Name" value={applicant.middleName} />
            <Field label="Last Name" value={applicant.lastName} />
            <Field label="Extension Name" value={applicant.extName} />
            <Field label="Sex" value={applicant.sex} />
          </Section>

          {/* Contact Info */}
          <Section title="Contact Information">
            <Field label="Email" value={applicant.eMailAdd} />
            <Field label="Telephone No" value={applicant.telNo} />
            <Field label="Mobile No" value={applicant.mobileNo} />
          </Section>

          {/* Address */}
          <Section title="Business Address">
            <Field label="Region" value={applicant.region} />
            <Field label="Province" value={applicant.province} />
            <Field
              label="City/Municipality"
              value={applicant.cityOrMunicipality}
            />
            <Field label="Barangay" value={applicant.barangay} />
            <Field label="Address Line 1" value={applicant.addressLine1} />
            <Field label="Zip Code" value={applicant.zipCode} />
            <Field label="Pin Address" value={applicant.pinAddress} />
            <Field label="Own Place" value={applicant.ownPlace} />

            {applicant.ownPlace === "YES" ? (
              <>
                <Field label="Tax Dec. No." value={applicant.taxdec} />
              </>
            ) : (
              <>
                <Field label="Lessor's Name" value={applicant.lessorName} />
                <Field label="Monthly Rent" value={applicant.monthlyRent} />
                <Field label="Tax Dec. No." value={applicant.taxdec} />
              </>
            )}
          </Section>

          {/* Operations */}
          <Section title="Business Operation">
            <Field label="Total Floor Area" value={applicant.totalFloorArea} />
            <Field label="Employees" value={applicant.numberOfEmployee} />
            <Field label="Male Employees" value={applicant.maleEmployee} />
            <Field label="Female Employees" value={applicant.femaleEmployee} />
            <Field
              label="Total Delivery Vehicle"
              value={applicant.totalDeliveryVehicle}
            />
            <Field label="No. of Nozzles" value={applicant.numNozzle} />
            <Field label="Weigh Scale" value={applicant.weighScale} />
          </Section>

          {/* Tax Address */}
          <Section title="Taxpayer Address">
            <Field label="Region" value={applicant.Taxregion} />
            <Field label="Province" value={applicant.Taxprovince} />
            <Field
              label="City/Municipality"
              value={applicant.TaxcityOrMunicipality}
            />
            <Field label="Barangay" value={applicant.Taxbarangay} />
            <Field label="Address Line 1" value={applicant.TaxaddressLine1} />
            <Field label="Zip Code" value={applicant.TaxzipCode} />
            <Field label="Pin Address" value={applicant.TaxpinAddress} />
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
              const parseCSV = (text) => {
                if (!text) return [];
                return text
                  .trim()
                  .replace(/^\[|\]$/g, "")
                  .split(/",\s*"?/)
                  .map((val) => val.replace(/^"|"$/g, "").trim())
                  .filter((val) => val.length > 0);
              };

              const lobArr = parseCSV(applicant.lineOfBusiness);
              const productArr = parseCSV(applicant.productService);
              const unitArr = parseCSV(applicant.Units);
              const natureCodeArr = parseCSV(applicant.natureCode);
              const businessNatureArr = parseCSV(applicant.businessNature);
              const lineCodeArr = parseCSV(applicant.lineCode);

              const maxLength = Math.max(
                lobArr.length,
                productArr.length,
                unitArr.length,
                capitalValues.length,
                natureCodeArr.length,
                businessNatureArr.length,
                lineCodeArr.length
              );

              return Array.from({ length: maxLength }).map((_, index) => (
                <Paper
                  key={index}
                  elevation={2}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    backgroundColor: "#f9f9f9",
                    width: "100%",
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
                    <Field
                      label="Line of Business"
                      value={lobArr[index] || ""}
                      fullWidth
                      multiline
                      rows={3}
                    />
                    <Grid item xs={12} sm={6}>
                      <Field
                        label="Product/Service"
                        value={productArr[index] || ""}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field label="Units" value={unitArr[index] || ""} />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Capital"
                        value={
                          capitalValues[index]
                            ? Number(
                                capitalValues[index]
                                  .toString()
                                  .replace(/,/g, "")
                              ).toLocaleString()
                            : ""
                        }
                        onChange={(e) => {
                          // Remove any commas, only keep digits
                          const rawValue = e.target.value
                            .replace(/,/g, "")
                            .replace(/\D/g, "");
                          const updated = [...capitalValues];
                          updated[index] = rawValue; // store numeric value (unformatted) in state
                          setCapitalValues(updated);
                        }}
                        fullWidth
                        variant="outlined"
                        size="small"
                        sx={{
                          backgroundColor: "#fffbe6",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#1c541e",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#2e7d32",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#1b5e20",
                          },
                        }}
                        InputLabelProps={{
                          sx: { color: "black" },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Field
                        label="Nature Code"
                        value={natureCodeArr[index] || ""}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field
                        label="Business Nature"
                        value={businessNatureArr[index] || ""}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Field
                        label="Line Code"
                        value={lineCodeArr[index] || ""}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ));
            })()}
          </Section>

          {/* Business Requirements */}
          <Section title="Business Requirements">
            <FileField
              fileKey="proofOfReg"
              label="Proof of Registration"
              fileData={applicant}
            />
            <FileField
              fileKey="proofOfRightToUseLoc"
              label="Proof of Right to Use Location"
              fileData={applicant}
            />
            <FileField
              fileKey="locationPlan"
              label="Location Plan"
              fileData={applicant}
            />
            <FileField
              fileKey="brgyClearance"
              label="Barangay Clearance"
              fileData={applicant}
            />
            <FileField
              fileKey="marketClearance"
              label="Market Clearance"
              fileData={applicant}
            />
            <FileField
              fileKey="occupancyPermit"
              label="Occupancy Permit"
              fileData={applicant}
            />
            <FileField fileKey="cedula" label="Cedula" fileData={applicant} />
            <FileField
              fileKey="photoOfBusinessEstInt"
              label="Photo (Interior)"
              fileData={applicant}
            />
            <FileField
              fileKey="photoOfBusinessEstExt"
              label="Photo (Exterior)"
              fileData={applicant}
            />
          </Section>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
          <Button variant="contained" color="success" onClick={handleUpdate}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Success Feedback */}
      <Dialog
        open={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
      >
        <DialogContent sx={{ textAlign: "center", p: 4 }}>
          <CheckCircleOutlineIcon
            color="success"
            sx={{ fontSize: 60, mb: 2 }}
          />
          <Typography variant="h6">Updated Successfully!</Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ExaminersApplicantModalUpdate;
