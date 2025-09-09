// NEW_RECORDS/newApp_modal.jsx
import React from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import axios from "axios";
import ApplicantDetails from "./applicantDetails";

function ApplicantModal({ applicant, isOpen, onClose, onApprove, baseUrl }) {
  if (!isOpen || !applicant) return null;

  // Check if all approved (needed for Pass to Business Tax button)
  const steps = ["BPLO", "Examiners", "CENRO", "CHO", "ZONING", "CSMWO", "OBO"];
  const allApproved = steps.every(
    (step) => applicant[step]?.toLowerCase() === "approved"
  );

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Applicant Details</DialogTitle>

      {/* ✅ Details Moved to Separate File */}
      <ApplicantDetails applicant={applicant} baseUrl={baseUrl} />

      {/* ✅ Actions */}
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>

        {applicant.BPLO?.toLowerCase() !== "approved" ? (
          <>
            <Button
              onClick={() => onApprove(applicant)}
              variant="contained"
              color="success"
            >
              Approve
            </Button>
            <Button onClick={onClose} variant="contained" color="error">
              Decline
            </Button>
          </>
        ) : (
          <>
            {allApproved ? (
              <Button
                onClick={async () => {
                  try {
                    const res = await axios.post(
                      `http://localhost:5000/businessTax/businessTax/approve/${applicant.id}`
                    );
                    if (res.status === 201) {
                      alert("Applicant successfully passed to Business Tax!");
                      onClose();
                    }
                  } catch (error) {
                    console.error("Error passing to Business Tax:", error);
                    alert("Failed to pass applicant to Business Tax");
                  }
                }}
                variant="contained"
                color="success"
              >
                Pass to Business Tax
              </Button>
            ) : (
              <Button variant="contained" color="success" disabled>
                Pass to Business Tax
              </Button>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default ApplicantModal;
