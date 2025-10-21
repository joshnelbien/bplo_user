import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Grid,
  Typography,
  Divider,
  Box,
  Paper,
  Fade,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";

export default function PaymentModal({ open, onClose, applicant, onConfirm }) {
  const API = import.meta.env.VITE_API_BASE;
  const [mode, setMode] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [form, setForm] = useState({
    amount: "",
    paymentDate: "",
    draweeBank: "",
    checkNumber: "",
    checkDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePayClick = (amount, index) => {
    setForm((prev) => ({ ...prev, amount }));
    setMode("Cash");
    setSelectedIndex(index);
  };
  const handleTotalPayClick = () => {
    setForm((prev) => ({ ...prev, amount: applicant.businessTaxTotal }));
    setMode("Cash");
    setSelectedIndex(null);
  };

  const handleSubmit = async () => {
    if (!mode) return alert("Select a payment mode first.");

    const finalAmount = form.amount === "" ? "0" : form.amount;

    if (mode === "Cash" && (!finalAmount || !form.paymentDate))
      return alert("Please fill all Cash fields.");
    if (
      mode === "Check" &&
      (!finalAmount || !form.draweeBank || !form.checkNumber || !form.checkDate)
    )
      return alert("Please fill all Check fields.");

    try {
      const res = await axios.put(
        `${API}/treasurer/treasurer-payments/${applicant.id}`,
        {
          amount_paid: finalAmount,
          index: selectedIndex,
          payment_mode: mode,
          paymentDate: form.paymentDate,
          draweeBank: form.draweeBank,
          checkNumber: form.checkNumber,
          checkDate: form.checkDate,
        }
      );

      if (res.data.success) {
        alert("Payment recorded successfully!");
        onConfirm?.();
        onClose();
      }
    } catch (err) {
      console.error(err);
      alert("Error updating payment.");
    }
  };

  const parseValues = (value) => {
    if (!value) return [];
    return value
      .replace(/["']/g, "")
      .split(",")
      .map((v) => v.trim());
  };

  const amountDues = parseValues(applicant?.amount_due);
  const dueDates = parseValues(applicant?.due_date);
  const paidAmounts = parseValues(applicant?.amount_paid);

  // Determine required payment indexes
  const paymentMode = applicant.Modeofpayment?.toLowerCase();
  const appType = applicant.application?.toLowerCase();
  let requiredIndex = [];

  if (appType === "new") {
    requiredIndex = amountDues.map((_, i) => i);
  } else if (appType === "renew") {
    if (paymentMode === "quarterly") {
      requiredIndex = [0];
    } else if (paymentMode === "semi-annual" || paymentMode === "annual") {
      requiredIndex = [0];
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: "0px 8px 24px rgba(0,0,0,0.15)",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "#1c541e",
          color: "white",
          fontWeight: 600,
          py: 2,
          px: 3,
        }}
      >
        Payment for {applicant?.businessName || "Client"}
      </DialogTitle>

      <DialogContent
        sx={{
          backgroundColor: "#f9fafb",
          px: 3,
          py: 4,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            mt: 2,
            p: 2,
            mb: 3,
            borderRadius: 3,
            backgroundColor: "white",
            border: "1px solid #e0e0e0",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ mb: 1, fontWeight: 600, color: "#1c541e" }}
          >
            Business Summary
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Application Type
          </Typography>
          <Typography fontWeight={600}>
            {applicant?.application || "—"}
          </Typography>

          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Total Tax
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography fontWeight={600}>
                  ₱ {applicant?.businessTaxTotal || "—"}
                </Typography>

                {/* Only show Pay button for NEW applications */}
                {applicant?.application?.toLowerCase() === "new" && (
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleTotalPayClick}
                    sx={{
                      backgroundColor: "#1c541e",
                      fontWeight: 600,
                      px: 2.5,
                      py: 0.7,
                      borderRadius: 2,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                      "&:hover": {
                        backgroundColor: "#174617",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                      },
                      textTransform: "none",
                    }}
                  >
                    Pay
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {applicant?.application?.toLowerCase() === "renew" &&
          (amountDues.length > 0 || dueDates.length > 0) && (
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                mb: 3,
                borderRadius: 3,
                backgroundColor: "white",
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  mb: 1.5,
                  color: "#1c541e",
                }}
              >
                Payment Schedule
              </Typography>

              {amountDues.map((amount, index) => {
                const paid =
                  paidAmounts[index] && paidAmounts[index] !== ""
                    ? `₱ ${paidAmounts[index]}`
                    : "Pending";
                const dueDate = dueDates[index] || "—";
                const isRequired = requiredIndex.includes(index);

                return (
                  <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                      p: 1.5,
                      mb: 1,
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      backgroundColor:
                        selectedIndex === index ? "#edf7ed" : "#fafafa",
                      opacity: isRequired ? 1 : 0.5,
                    }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        ₱ {amount} — {dueDate}
                      </Typography>
                      <Typography
                        variant="body2"
                        color={
                          paid === "Pending" ? "error.main" : "success.main"
                        }
                      >
                        {paid === "Pending" ? "Pending" : `Paid: ${paid}`}
                      </Typography>
                    </Box>

                    {paid === "Pending" && isRequired && (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handlePayClick(amount, index)}
                        sx={{
                          backgroundColor: "#1c541e",
                          fontWeight: 600,
                          px: 2.5,
                          py: 0.7,
                          borderRadius: 2,
                          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                          "&:hover": {
                            backgroundColor: "#174617",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                          },
                          textTransform: "none",
                        }}
                      >
                        Pay
                      </Button>
                    )}
                  </Box>
                );
              })}
            </Paper>
          )}

        {mode && (
          <Fade in={mode !== ""}>
            <Box>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid #e0e0e0",
                  backgroundColor: "white",
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="#1c541e"
                  sx={{ mb: 2, fontWeight: 600 }}
                >
                  Payment Details
                </Typography>

                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label="Payment Mode"
                      fullWidth
                      value={mode}
                      onChange={(e) => setMode(e.target.value)}
                      variant="outlined"
                      sx={{ width: "225px" }}
                    >
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="Check">Check</MenuItem>
                    </TextField>
                  </Grid>

                  {mode === "Cash" && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Payment Date"
                          type="date"
                          fullWidth
                          name="paymentDate"
                          sx={{ width: "225px" }}
                          InputLabelProps={{ shrink: true }}
                          value={form.paymentDate}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Amount Paid"
                          fullWidth
                          name="amount"
                          disabled
                          value={form.amount}
                          onChange={handleChange}
                        />
                      </Grid>
                    </>
                  )}

                  {mode === "Check" && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Drawee Bank"
                          fullWidth
                          name="draweeBank"
                          value={form.draweeBank}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Check Number"
                          fullWidth
                          name="checkNumber"
                          value={form.checkNumber}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Check Date"
                          type="date"
                          fullWidth
                          name="checkDate"
                          InputLabelProps={{ shrink: true }}
                          value={form.checkDate}
                          onChange={handleChange}
                          sx={{ width: "225px" }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Amount"
                          fullWidth
                          name="amount"
                          disabled
                          value={form.amount}
                          onChange={handleChange}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              </Paper>
            </Box>
          </Fade>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          backgroundColor: "#f9fafb",
          px: 3,
          py: 2,
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: "#1c541e",
            borderColor: "#1c541e",
            borderRadius: 2,
            px: 3,
            "&:hover": { borderColor: "#1c541e", backgroundColor: "#edf7ed" },
            textTransform: "none",
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#1c541e",
            "&:hover": { backgroundColor: "#174617" },
            px: 3,
            borderRadius: 2,
            textTransform: "none",
            boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
          }}
        >
          Confirm Payment
        </Button>
      </DialogActions>
    </Dialog>
  );
}
