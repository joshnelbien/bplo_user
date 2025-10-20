import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

function PaymentBreakdownModal({ open, onClose, applicant, onConfirm }) {
  if (!applicant) return null;

  const businessTaxTotal = parseFloat(applicant.businessTaxTotal);
  const mode = applicant.Modeofpayment?.toLowerCase();
  let breakdown = [];
  let label = "";

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
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: 8,
          backgroundColor: "#fff",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: 1,
          bgcolor: "primary.main",
          color: "white",
          py: 2,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          color: "white",
        }}
      >
        Payment Breakdown
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: "#fafafa", p: 3 }}>
        <Box
          sx={{
            mb: 3,
            p: 2.5,
            borderRadius: 2,
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: "gray" }}
          >
            Mode of Payment
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "primary.main", fontWeight: "bold", mb: 1 }}
          >
            {applicant.Modeofpayment || "N/A"}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: "gray" }}
          >
            Total Business Tax
          </Typography>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#2e7d32" }}
          >
            ₱
            {businessTaxTotal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </Typography>
        </Box>

        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", mb: 2, color: "text.secondary" }}
        >
          Breakdown
        </Typography>

        <Grid container spacing={2}>
          {breakdown.map((amount, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    backgroundColor: "white",
                    border: "1px solid #e0e0e0",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: "primary.main" }}
                  >
                    {label} {index + 1}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#2e7d32" }}
                  >
                    ₱
                    {parseFloat(amount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "space-between",
          p: 3,
          bgcolor: "#f5f5f5",
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          color="error"
          sx={{
            px: 3,
            borderRadius: 2,
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="success"
          sx={{
            px: 3,
            borderRadius: 2,
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          Confirm Payment
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PaymentBreakdownModal;
