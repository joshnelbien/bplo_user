import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import ZoningCert from "./zoningCert";

// ✅ Normal text field
const Field = ({ label, value }) => (
  <Grid item xs={12} sm={6}>
    <TextField
      label={label}
      value={value || "—"}
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
  </Grid>
);

// ✅ File display (with View/Download links)
const FileField = ({ label, fileKey, fileData }) => (
  <Grid item xs={12} sm={6}>
    <TextField
      label={label}
      value={
        fileData[fileKey]
          ? fileData[`${fileKey}_filename`] || "File available"
          : "No file uploaded"
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
      <Typography variant="body2" sx={{ mt: 0.5 }}>
        <a
          href={`http://localhost:5000/backroom/backroom/${fileData.id}/${fileKey}`}
          target="_blank"
          rel="noreferrer"
        >
          View
        </a>{" "}
        |{" "}
        <a
          href={`http://localhost:5000/backroom/backroom/${fileData.id}/${fileKey}/download`}
          target="_blank"
          rel="noreferrer"
        >
          Download
        </a>
      </Typography>
    )}
  </Grid>
);

function ZoningApplicantModal({
  applicant,
  isOpen,
  onClose,
  onApprove,
  handleFileChange,
}) {
  const [showCert, setShowCert] = useState(false);
  const [zoningAttachment, setZoningAttachment] = useState(null);
  if (!isOpen || !applicant) return null;

  const Section = ({ title, children }) => (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="subtitle1" fontWeight="bold">
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {children}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );

  function calculateZoningFee(totalCapital) {
    if (totalCapital <= 5000) {
      return "Exempted";
    } else if (totalCapital >= 5001 && totalCapital <= 10000) {
      return 100;
    } else if (totalCapital >= 10001 && totalCapital <= 50000) {
      return 200;
    } else if (totalCapital >= 50001 && totalCapital <= 100000) {
      return 300;
    } else {
      return ((totalCapital - 100000) * 0.001 + 500).toFixed(2);
    }
  }

  const zoningFee = calculateZoningFee(Number(applicant.totalCapital));

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {showCert ? "Zoning Certificate" : "Applicant Details"}
      </DialogTitle>

      <DialogContent dividers>
        {!showCert ? (
          <>
            {/* Business Info */}
            <Section title="Business Information">
              <Field label="Status" value={applicant.status} />
              <Field label="ID" value={applicant.id} />
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
            </Section>

            {/* Operations */}
            <Section title="Business Operation">
              <Field
                label="Total Floor Area"
                value={applicant.totalFloorArea}
              />
              <Field label="Employees" value={applicant.numberOfEmployee} />
              <Field label="Male Employees" value={applicant.maleEmployee} />
              <Field
                label="Female Employees"
                value={applicant.femaleEmployee}
              />
              <Field label="Vans" value={applicant.numVehicleVan} />
              <Field label="Trucks" value={applicant.numVehicleTruck} />
              <Field label="Motorcycles" value={applicant.numVehicleMotor} />
              <Field label="No. of Nozzles" value={applicant.numNozzle} />
              <Field label="Weigh Scale" value={applicant.weighScale} />
            </Section>

            {/* Tax Address */}
            <Section title="Taxpayer Address">
              <Field label="Tax Region" value={applicant.Taxregion} />
              <Field label="Tax Province" value={applicant.Taxprovince} />
              <Field
                label="Tax City/Municipality"
                value={applicant.TaxcityOrMunicipality}
              />
              <Field label="Tax Barangay" value={applicant.Taxbarangay} />
              <Field
                label="Tax Address Line 1"
                value={applicant.TaxaddressLine1}
              />
              <Field label="Tax Zip Code" value={applicant.TaxzipCode} />
              <Field label="Tax Pin Address" value={applicant.TaxpinAddress} />
              <Field label="Own Place" value={applicant.ownPlace} />
              {applicant.ownPlace === "Yes" ? (
                <Field label="Tax Dec. No." value={applicant.taxdec} />
              ) : (
                <>
                  <Field label="Lessor's Name" value={applicant.lessorName} />
                  <Field label="Monthly Rent" value={applicant.monthlyRent} />
                  <Field label="Tax Dec. No." value={applicant.taxdec} />
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

              {applicant.lineOfBusiness?.split(",").map((lob, index) => {
                const product =
                  applicant.productService?.split(",")[index] || "";
                const unit = applicant.Units?.split(",")[index] || "";
                const capital = applicant.capital?.split(",")[index] || "";

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
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      gutterBottom
                    >
                      Business Line {index + 1}
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Field label="Line of Business" value={lob.trim()} />
                      </Grid>
                      <Grid item xs={12}>
                        <Field label="Product/Service" value={product.trim()} />
                      </Grid>
                      <Grid item xs={12}>
                        <Field label="Units" value={unit.trim()} />
                      </Grid>
                      <Grid item xs={12}>
                        <Field label="Capital" value={capital.trim()} />
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

            {/* Zoning Attachments */}
            <Section title="Zoning Attachments">
              <Typography variant="subtitle1" sx={{ mb: 3 }}>
                ZONING FEE:{" "}
                <b>{zoningFee === "Exempted" ? zoningFee : `₱${zoningFee}`}</b>
              </Typography>

              <TextField
                type="file"
                size="small"
                fullWidth
                onChange={(e) => setZoningAttachment(e.target.files[0])}
              />
            </Section>
          </>
        ) : (
          <ZoningCert applicant={applicant} />
        )}
      </DialogContent>

      {/* ✅ Cleaned Up Actions */}
      {/* ✅ Cleaned Up Actions */}
      <DialogActions>
        <Button variant="outlined" onClick={onClose} color="secondary">
          Close
        </Button>

        {/* Only show Approve/Decline if not yet approved and not viewing cert */}
        {!showCert && applicant.ZONING !== "Approved" && (
          <>
            <Button
              onClick={() => onApprove(applicant.id, zoningAttachment)}
              color="success"
              variant="contained"
            >
              Approve
            </Button>
            <Button onClick={onClose} color="error" variant="outlined">
              Decline
            </Button>
          </>
        )}

        {/* ✅ Only allow Generate Certificate if pending */}
        {!showCert && applicant.ZONING !== "Approved" ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowCert(true)}
          >
            Generate Certificate
          </Button>
        ) : showCert ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowCert(false)}
          >
            Back to Details
          </Button>
        ) : null}
      </DialogActions>
    </Dialog>
  );
}

export default ZoningApplicantModal;
