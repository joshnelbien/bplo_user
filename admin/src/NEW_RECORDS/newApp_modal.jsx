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
  TextField,
  Typography,
} from "@mui/material";

// Component to display a normal text field
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
          "&.Mui-disabled": {
            color: "black",
          },
        },
      }}
    />
  </Grid>
);

// Component to display files as links
const FileField = ({ label, fileKey, fileData }) => (
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
          href={`http://localhost:5000/api/files/${fileData.id}/${fileKey}`}
          target="_blank"
          rel="noreferrer"
        >
          View
        </a>{" "}
        |{" "}
        <a
          href={`http://localhost:5000/api/files/${fileData.id}/${fileKey}/download`}
          target="_blank"
          rel="noreferrer"
        >
          Download
        </a>
      </Typography>
    )}
  </Grid>
);

function ApplicantModal({ applicant, isOpen, onClose, onApprove }) {
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

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Applicant Details</DialogTitle>
      <DialogContent dividers>
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
          <Field label="City/Municipality" value={applicant.cityOrMunicipality} />
          <Field label="Barangay" value={applicant.barangay} />
          <Field label="Address Line 1" value={applicant.addressLine1} />
          <Field label="Zip Code" value={applicant.zipCode} />
          <Field label="Pin Address" value={applicant.pinAddress} />
        </Section>

        {/* Operations */}
        <Section title="Business Operation">
          <Field label="Total Floor Area" value={applicant.totalFloorArea} />
          <Field label="Employees" value={applicant.numberOfEmployee} />
          <Field label="Male Employees" value={applicant.maleEmployee} />
          <Field label="Female Employees" value={applicant.femaleEmployee} />
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
          <Field label="Tax City/Municipality" value={applicant.TaxcityOrMunicipality} />
          <Field label="Tax Barangay" value={applicant.Taxbarangay} />
          <Field label="Tax Address Line 1" value={applicant.TaxaddressLine1} />
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
            <FileField fileKey="tIGEfiles" label="Tax Incentives From Government" fileData={applicant} />
          )}
          <Field label="Office Type" value={applicant.officeType} />
          <Field label="Line of Business" value={applicant.lineOfBusiness} />
          <Field label="Product/Service" value={applicant.productService} />
          <Field label="Units" value={applicant.Units} />
          <Field label="Capital" value={applicant.capital} />
        </Section>

        {/* Business Requirements */}
        <Section title="Business Requirements">
          <FileField fileKey="proofOfReg" label="Proof of Registration" fileData={applicant} />
          <FileField fileKey="proofOfRightToUseLoc" label="Proof of Right to Use Location" fileData={applicant} />
          <FileField fileKey="locationPlan" label="Location Plan" fileData={applicant} />
          <FileField fileKey="brgyClearance" label="Barangay Clearance" fileData={applicant} />
          <FileField fileKey="marketClearance" label="Market Clearance" fileData={applicant} />
          <FileField fileKey="occupancyPermit" label="Occupancy Permit" fileData={applicant} />
          <FileField fileKey="cedula" label="Cedula" fileData={applicant} />
          <FileField fileKey="photoOfBusinessEstInt" label="Photo (Interior)" fileData={applicant} />
          <FileField fileKey="photoOfBusinessEstExt" label="Photo (Exterior)" fileData={applicant} />
        </Section>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose} color="secondary">
          Close
        </Button>
        <Button
          onClick={() => onApprove(applicant.id)}
          variant="contained"
          color="success"
        >
          Approve
        </Button>
        <Button onClick={onClose} variant="outlined" color="error">
          Decline
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ApplicantModal;
