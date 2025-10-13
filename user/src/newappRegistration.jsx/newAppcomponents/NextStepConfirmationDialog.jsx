import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";

// Define styles for buttons (reusing the same styles as in the main component)
const PRIMARY_COLOR = "#09360D";
const HOVER_COLOR = "#072b0b";
const LIGHT_HOVER_COLOR = "rgba(9, 54, 13, 0.08)";
const WHITE = "#fff";

const GreenButton = styled(Button)(({ variant }) => ({
  borderRadius: "8px",
  ...(variant === "contained" && {
    backgroundColor: PRIMARY_COLOR,
    color: WHITE,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    "&:hover": {
      backgroundColor: HOVER_COLOR,
    },
  }),
  ...(variant === "outlined" && {
    borderColor: PRIMARY_COLOR,
    color: PRIMARY_COLOR,
    "&:hover": {
      backgroundColor: LIGHT_HOVER_COLOR,
      borderColor: PRIMARY_COLOR,
    },
  }),
}));

// Reusable NextStepConfirmationDialog component
function NextStepConfirmationDialog({
  open,
  onClose,
  onConfirm,
  formData,
  step,
  isSubmit = false,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: "12px" } }}
    >
      <DialogTitle
        sx={{
          backgroundColor: PRIMARY_COLOR,
          color: WHITE,
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
          fontWeight: "bold",
        }}
      >
        {isSubmit ? "Submit Application" : "Confirm Next Step"}
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Typography variant="body1" sx={{ color: "text.primary", mb: 1 }}>
          {isSubmit}
        </Typography>
        <Typography
          component="div"
          variant="body2"
          sx={{
            mt: 2,
            p: 2,
            backgroundColor: "rgba(9, 54, 13, 0.04)",
            borderRadius: "6px",
            color: PRIMARY_COLOR,
          }}
        >
          {isSubmit || step === 1 ? (
            <>
              <strong>Business Type:</strong>{" "}
              {formData.BusinessType || "Not specified"}
              <br />
              <strong>Registration No:</strong>{" "}
              {formData.dscRegNo || "Not specified"}
              <br />
              <strong>Business Name:</strong>{" "}
              {formData.businessName || "Not specified"}
              <br />
              <strong>TIN No:</strong> {formData.tinNo || "Not specified"}
              <br />
              <strong>Trade Name:</strong>{" "}
              {formData.TradeName || "Not specified"}
              {isSubmit && (
                <>
                  <br />
                  <strong>First Name:</strong>{" "}
                  {formData.firstName || "Not specified"}
                  <br />
                  <strong>Middle Name:</strong>{" "}
                  {formData.middleName || "Not specified"}
                  <br />
                  <strong>Last Name:</strong>{" "}
                  {formData.lastName || "Not specified"}
                  <br />
                  <strong>Ext. Name:</strong>{" "}
                  {formData.extName || "Not specified"}
                  <br />
                  <strong>Gender:</strong> {formData.sex || "Not specified"}
                  <br />
                  <strong>Email:</strong> {formData.email || "Not specified"}
                  <br />
                  <strong>Telephone No:</strong>{" "}
                  {formData.telNo || "Not specified"}
                  <br />
                  <strong>Mobile No:</strong>{" "}
                  {formData.mobileNo || "Not specified"}
                </>
              )}
            </>
          ) : (
            <>
              <strong>First Name:</strong>{" "}
              {formData.firstName || "Not specified"}
              <br />
              <strong>Middle Name:</strong>{" "}
              {formData.middleName || "Not specified"}
              <br />
              <strong>Last Name:</strong> {formData.lastName || "Not specified"}
              <br />
              <strong>Ext. Name:</strong> {formData.extName || "Not specified"}
              <br />
              <strong>Gender:</strong> {formData.sex || "Not specified"}
              <br />
              <strong>Email:</strong> {formData.email || "Not specified"}
              <br />
              <strong>Telephone No:</strong> {formData.telNo || "Not specified"}
              <br />
              <strong>Mobile No:</strong> {formData.mobileNo || "Not specified"}
            </>
          )}
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "center",
          gap: 2,
          p: 2,
          borderTop: `1px solid ${LIGHT_HOVER_COLOR}`,
        }}
      >
        <GreenButton
          variant="contained"
          onClick={onClose}
          sx={{
            minWidth: "100px",
            backgroundColor: "#70706fff",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#acababff",
            },
          }}
        >
          No
        </GreenButton>

        <GreenButton
          variant="contained"
          onClick={onConfirm}
          sx={{ minWidth: "100px" }}
        >
          Yes
        </GreenButton>
      </DialogActions>
    </Dialog>
  );
}

export default NextStepConfirmationDialog;
