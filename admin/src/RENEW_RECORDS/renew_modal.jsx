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

function RenewApplicantModal({ applicant, isOpen, onClose, onApprove }) {
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
          color: "black", // text color
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "black", // override disabled gray
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "black", // border black
          },
          "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
            borderColor: "black", // keep border black when disabled
          },
        },
      }}
      InputLabelProps={{
        sx: {
          color: "black", // label black
          "&.Mui-disabled": {
            color: "black", // label black when disabled
          },
        },
      }}
    />
  </Grid>
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
          <Field label="Office Type" value={applicant.officeType} />
          <Field label="Line of Business" value={applicant.lineOfBusiness} />
          <Field label="Product/Service" value={applicant.productService} />
          <Field label="Units" value={applicant.Units} />
          <Field label="Capital" value={applicant.capital} />
        </Section>

        {/* Requirements */}
        <Section title="Business Requirements">
          <Field label="Proof of Registration" value={applicant.proofOfReg} />
          <Field label="Proof of Right to Use Location" value={applicant.proofOfRightToUseLoc} />
          <Field label="Location Plan" value={applicant.locationPlan} />
          <Field label="Barangay Clearance" value={applicant.brgyClearance} />
          <Field label="Market Clearance" value={applicant.marketClearance} />
          <Field label="Occupancy Permit" value={applicant.occupancyPermit} />
          <Field label="Cedula" value={applicant.cedula} />
          <Field label="Photo (Interior)" value={applicant.photoOfBusinessEstInt} />
          <Field label="Photo (Exterior)" value={applicant.photoOfBusinessEstExt} />
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

export default RenewApplicantModal;
