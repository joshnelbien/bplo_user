import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
  Paper,
  Button,
} from "@mui/material";

function PaymentBreakdownModal({ open, onClose, applicant, onConfirm }) {
  if (!applicant) return null;

  const businessTaxTotal = parseFloat(applicant.businessTaxTotal);
  const mode = applicant.Modeofpayment?.toLowerCase();
  let breakdown = [];
  let label = "";

  // 🧮 Determine breakdown
  if (mode === "quarterly") {
    breakdown = Array(4).fill((businessTaxTotal / 4).toFixed(2));
    label = "Quarter";
  } else if (mode === "semi-annual") {
    breakdown = Array(2).fill((businessTaxTotal / 2).toFixed(2));
    label = "Semi-Annual";
  } else {
    breakdown = [businessTaxTotal.toFixed(2)];
    label = "Annual";
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold" }}>Payment Breakdown</DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Mode of Payment:{" "}
              <span style={{ color: "#2e7d32" }}>
                {applicant.Modeofpayment || "N/A"}
              </span>
            </Typography>
            <Typography variant="h6" gutterBottom>
              Total Business Tax:{" "}
              <span style={{ fontWeight: "bold" }}>
                ₱{businessTaxTotal.toFixed(2)}
              </span>
            </Typography>
          </Grid>

          {breakdown.map((amount, index) => (
            <Grid item xs={12} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {label} {index + 1}
                </Typography>
                <Typography variant="body1">₱{amount}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" color="error">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="success">
          Confirm Payment
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PaymentBreakdownModal;
