import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Grow,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { styled } from "@mui/system";

// 1. Primary Action Button (Green - Confirm/Submit)
const GreenButton = styled(Button)(({ variant }) => ({
  borderRadius: "8px",
  backgroundColor: "#1d5236", // Primary Green
  color: "#fff", // White font color
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    backgroundColor: "#072b0b", // Darker Green for hover
  },
}));

// 2. Secondary Action Button (Gray - Cancel/No)
const GreyButton = styled(Button)(({ variant }) => ({
  borderRadius: "8px",
  backgroundColor: "#70706fff", // Dark Gray
  color: "#fff", // White font color
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    backgroundColor: "#acababff", // Lighter Gray for hover
  },
}));

function NewAppConfirmation({
  dialogOpen,
  setDialogOpen,
  handleDialogConfirm,
  submitDialogOpen,
  setSubmitDialogOpen,
  successDialogOpen,
  setSuccessDialogOpen,
  isSubmitting,
  handleSubmit,
}) {
  return (
    <>
      {/* Next Step Confirmation (No Changes) */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle></DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to proceed to the next step?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2, p: 2 }}>
          <GreyButton
            variant="contained"
            onClick={() => setDialogOpen(false)}
            sx={{ minWidth: "90px" }}
          >
            Cancel
          </GreyButton>
          <GreenButton
            variant="contained"
            onClick={handleDialogConfirm}
            sx={{ minWidth: "100px" }}
          >
            Confirm
          </GreenButton>
        </DialogActions>
      </Dialog>

      {/* --- Submit Confirmation (Updated) --- */}
      <Dialog
        open={submitDialogOpen}
        onClose={() => setSubmitDialogOpen(false)}
      >
        {/* REMOVED: <DialogTitle>Submit Application</DialogTitle> */}
        <DialogContent sx={{ textAlign: "center" }}>
          <Typography>Are you sure you want to submit?</Typography>
        </DialogContent>
        {/* Centered Actions */}
        <DialogActions sx={{ justifyContent: "center", gap: 2, p: 2 }}>
          {/* No button: Uses GreyButton (Contained Gray) */}
          <GreyButton
            variant="contained"
            onClick={() => setSubmitDialogOpen(false)}
          >
            No
          </GreyButton>
          {/* Yes button: Uses GreenButton (Contained Green) */}
          <GreenButton
            variant="contained"
            onClick={() => {
              setSubmitDialogOpen(false);
              handleSubmit();
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Submitting
              </>
            ) : (
              "Yes"
            )}
          </GreenButton>
        </DialogActions>
      </Dialog>

      {/* Success Popup (No Changes) */}
      <Dialog
        open={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            textAlign: "center",
            p: 3,
          },
        }}
      >
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Grow in={successDialogOpen}>
            <CheckCircleOutlineIcon sx={{ fontSize: 80, color: "#1a6d1cff" }} />
          </Grow>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "#000000ff" }}
          >
            Submitted Successfully!
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NewAppConfirmation;