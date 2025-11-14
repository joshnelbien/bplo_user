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
import PaymentReciept from "./paymentReciept";

export default function PaymentModal({ open, onClose, applicant, onConfirm }) {
  const API = import.meta.env.VITE_API_BASE;
  const [mode, setMode] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [form, setForm] = useState({
    amount: "",
    paymentDate: "",
    draweeBank: "",
    checkNumber: "",
    orNo: "",
    checkDate: "",
  });

  const getToday = () => new Date().toISOString().split("T")[0];

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePayClick = (amount, index) => {
    setForm({ ...form, amount, paymentDate: getToday() });
    setMode("Cash");
    setSelectedIndex(index);
  };

  const handleTotalPayClick = () => {
    setForm({
      ...form,
      amount: applicant.businessTaxTotal,
      paymentDate: getToday(),
    });
    setMode("Cash");
    setSelectedIndex(null);
  };

  // ✅ Instead of submitting immediately, first show the receipt
  const handleSubmit = () => {
    if (!mode) return alert("Select a payment mode first.");

    const finalAmount = form.amount === "" ? "0" : form.amount;

    if (mode === "Cash" && (!finalAmount || !form.paymentDate))
      return alert("Please fill all Cash fields.");
    if (
      mode === "Check" &&
      (!finalAmount || !form.draweeBank || !form.checkNumber || !form.checkDate)
    )
      return alert("Please fill all Check fields.");

    // Show receipt first
    setShowReceipt(true);
  };

  // ✅ Call this AFTER receipt is closed
  const handleReceiptClose = () => {
    setShowReceipt(false);
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

          {applicant?.application === "Renew" && (
            <>
              <Typography variant="body2" color="text.secondary">
                Mode of Payment
              </Typography>
              <Typography fontWeight={600}>
                {applicant?.Modeofpayment || "—"}
              </Typography>
            </>
          )}

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

                {applicant?.application?.toLowerCase() === "new" &&
                  applicant?.TREASURER !== "Approved" && (
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

        {/* ✅ If RENEW Application — show Payment Schedule */}
        {applicant.TREASURER?.trim().toLowerCase() === "pending" && (
          <>
            {applicant?.application?.toLowerCase() === "renew" && (
              <>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    mb: 2,
                    color: "text.secondary",
                    mt: 1,
                  }}
                >
                  Payment Breakdown & Due Dates
                </Typography>

                {(() => {
                  const businessTaxTotal = parseFloat(
                    applicant.businessTaxTotal
                  );
                  const mode = applicant.Modeofpayment?.toLowerCase();
                  let breakdown = [];
                  let label = "";
                  let dueDates = [];

                  if (mode === "quarterly") {
                    breakdown = Array(4).fill(
                      (businessTaxTotal / 4).toFixed(2)
                    );
                    label = "Quarter";
                    dueDates = [
                      "January 20",
                      "April 20",
                      "July 20",
                      "October 20",
                    ];
                  } else if (mode === "semi-annual") {
                    breakdown = Array(2).fill(
                      (businessTaxTotal / 2).toFixed(2)
                    );
                    label = "Semi-Annual";
                    dueDates = ["January 20", "July 20"];
                  } else {
                    breakdown = [businessTaxTotal.toFixed(2)];
                    label = "Annual";
                    dueDates = ["January 20"];
                  }

                  const requiredPayments =
                    applicant.application === "Renew"
                      ? mode === "quarterly" ||
                        mode === "semi-annual" ||
                        mode === "annual"
                        ? [0] // first only
                        : []
                      : breakdown.map((_, i) => i); // all if new

                  return (
                    <Grid container spacing={2}>
                      {breakdown.map((amount, index) => {
                        const isPaid = false; // you can change logic later
                        const isRequired = requiredPayments.includes(index);

                        return (
                          <Grid item xs={12} sm={6} key={index}>
                            <Paper
                              elevation={3}
                              sx={{
                                p: 2.5,
                                borderRadius: 3,
                                backgroundColor: "white",
                                border: isRequired
                                  ? "1px solid #2e7d32"
                                  : "1px solid #ccc",
                                opacity: isRequired ? 1 : 0.6,
                                transition: "0.3s",
                              }}
                            >
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontWeight: 600,
                                  color: "primary.main",
                                }}
                              >
                                {label} {index + 1}
                              </Typography>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: "bold",
                                  color: "#2e7d32",
                                }}
                              >
                                ₱{" "}
                                {parseFloat(amount).toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                })}
                              </Typography>

                              {applicant.Modeofpayment !== "Annual" && (
                                <>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: "gray",
                                      mt: 1,
                                      fontStyle: "italic",
                                    }}
                                  >
                                    Due Date: {dueDates[index]}
                                  </Typography>
                                </>
                              )}

                              <Divider sx={{ my: 1.5 }} />

                              <Box display="flex" justifyContent="flex-end">
                                <Button
                                  size="small"
                                  variant="contained"
                                  // disabled={!isRequired || isPaid}
                                  onClick={() => handlePayClick(amount, index)}
                                  sx={{
                                    backgroundColor: "#1c541e",
                                    fontWeight: 600,
                                    px: 2.5,
                                    py: 0.7,
                                    borderRadius: 2,
                                    textTransform: "none",
                                    "&:hover": {
                                      backgroundColor: "#174617",
                                    },
                                  }}
                                >
                                  Pay
                                </Button>
                              </Box>
                            </Paper>
                          </Grid>
                        );
                      })}
                    </Grid>
                  );
                })()}
              </>
            )}
          </>
        )}

        {applicant.TREASURER === "Approved" && (
          <>
            {amountDues.map((amount, index) => {
              const paid =
                paidAmounts[index] && paidAmounts[index] !== ""
                  ? `₱ ${paidAmounts[index]}`
                  : "Pending";
              const dueDate = dueDates[index] || "—";

              // ✅ Determine if previous payments are completed
              const allPreviousPaid = paidAmounts
                .slice(0, index)
                .every((val) => val && val !== "");

              const canPay = paid === "Pending" && allPreviousPaid;

              return (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    p: 1.5,
                    mb: 1.5,
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                    backgroundColor: "#fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  }}
                >
                  {/* LEFT SIDE */}
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      ₱ {amount} — {dueDate}
                    </Typography>

                    <Typography
                      variant="body2"
                      color={paid === "Pending" ? "error.main" : "success.main"}
                      sx={{ fontWeight: 500 }}
                    >
                      {paid === "Pending" ? "Pending" : `Paid: ${paid}`}
                    </Typography>
                  </Box>

                  {/* RIGHT SIDE BUTTON */}
                  {paid === "Pending" && (
                    <Button
                      size="small"
                      variant="contained"
                      disabled={!canPay} // ✅ Disable until previous payments are done
                      onClick={() => handlePayClick(amount, index)}
                      sx={{
                        backgroundColor: canPay ? "#1c541e" : "#ccc",
                        color: "#fff",
                        fontWeight: 600,
                        borderRadius: 2,
                        textTransform: "none",
                        px: 2.5,
                        py: 0.7,
                        "&:hover": {
                          backgroundColor: canPay ? "#174617" : "#ccc",
                        },
                      }}
                    >
                      Pay
                    </Button>
                  )}
                </Box>
              );
            })}
          </>
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
                      label="OR No."
                      fullWidth
                      name="orNo"
                      value={form.orNo}
                      onChange={handleChange}
                    />

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
                          value={form.paymentDate || getToday()}
                          disabled
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

      <PaymentReciept
        open={showReceipt}
        applicant={applicant}
        orNo={form.orNo}
        onClose={() => setShowReceipt(false)}
        receiptData={{
          amount: form.amount,
          orNo: form.orNo, // <-- use form.orNo
          paymentDate: form.paymentDate,
          mode,
          draweeBank: form.draweeBank,
          checkNumber: form.checkNumber,
          checkDate: form.checkDate,
        }}
        onPrint={async () => {
          try {
            const res = await axios.put(
              `${API}/treasurer/treasurer-payments/${applicant.id}`,
              {
                amount_paid: form.amount,
                index: selectedIndex,
                payment_mode: mode,
                orNo: form.orNo, // <-- also here
                paymentDate: form.paymentDate,
                draweeBank: form.draweeBank,
                checkNumber: form.checkNumber,
                checkDate: form.checkDate,
              }
            );
            if (res.data.success) {
              onConfirm?.();
              setShowReceipt(false);
              onClose();
            }
          } catch (err) {
            console.error(err);
            alert("Error updating payment.");
          }
        }}
      />

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
