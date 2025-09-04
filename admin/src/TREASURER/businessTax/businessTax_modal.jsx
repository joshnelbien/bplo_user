import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import BusinessTax_computation from "./businessTax_computation";

function BusinessTaxApplicantModal({ isOpen, onClose, applicant, onApprove }) {
  const [isComputeOpen, setIsComputeOpen] = useState(false);

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Business Tax Applicant</DialogTitle>
        <DialogContent dividers>
          <Typography>Applicant Name: {applicant?.owner || "N/A"}</Typography>
          <Typography>
            Business Name: {applicant?.businessName || "N/A"}
          </Typography>
          <Typography>Capital: {applicant?.capital || "N/A"}</Typography>
          <Typography>Gross: {applicant?.gross || "N/A"}</Typography>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose} color="secondary">
            Close
          </Button>
          <Button
            onClick={() => setIsComputeOpen(true)}
            variant="contained"
            color="info"
          >
            Compute
          </Button>
          <Button
            onClick={() => onApprove(applicant?.id)}
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

      {/* ✅ Compute Modal */}
      <BusinessTax_computation
        isOpen={isComputeOpen}
        onClose={() => setIsComputeOpen(false)}
        applicant={applicant}
      />
    </>
  );
}

export default BusinessTaxApplicantModal;
