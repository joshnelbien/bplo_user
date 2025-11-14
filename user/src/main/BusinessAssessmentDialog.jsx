import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  Paper,
  ButtonGroup,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import barangayBrackets from "../../public/barangay_brackets.json";
import barangayList from "../../public/barangaylist.json";

// 🔹 Fee Ranges
const feeRanges = {
  "Bracket A": [
    { min: 1, max: 20000, fee: 100 },
    { min: 20001, max: 30000, fee: 150 },
    { min: 30001, max: 40000, fee: 200 },
    { min: 40001, max: 50000, fee: 250 },
    { min: 50001, max: 100000, fee: 300 },
    { min: 100001, max: 300000, fee: 350 },
    { min: 300001, max: 500000, fee: 400 },
    { min: 500001, max: 750000, fee: 500 },
    { min: 750001, max: 900000, fee: 750 },
    { min: 900001, max: 1000000, fee: 1000 },
    { min: 1000001, max: Infinity, fee: 1500 },
  ],
  "Bracket B": [
    { min: 1, max: 20000, fee: 100 },
    { min: 20001, max: 30000, fee: 120 },
    { min: 30001, max: 40000, fee: 160 },
    { min: 40001, max: 50000, fee: 200 },
    { min: 50001, max: 100000, fee: 240 },
    { min: 100001, max: 300000, fee: 280 },
    { min: 300001, max: 500000, fee: 320 },
    { min: 500001, max: 750000, fee: 400 },
    { min: 750001, max: 900000, fee: 600 },
    { min: 900001, max: 1000000, fee: 800 },
    { min: 1000001, max: Infinity, fee: 1200 },
  ],
  "Bracket C": [
    { min: 1, max: 20000, fee: 100 },
    { min: 20001, max: 30000, fee: 105 },
    { min: 30001, max: 40000, fee: 140 },
    { min: 40001, max: 50000, fee: 275 },
    { min: 50001, max: 100000, fee: 210 },
    { min: 100001, max: 300000, fee: 245 },
    { min: 300001, max: 500000, fee: 280 },
    { min: 500001, max: 750000, fee: 350 },
    { min: 750001, max: 900000, fee: 475 },
    { min: 900001, max: 1000000, fee: 700 },
    { min: 1000001, max: Infinity, fee: 1050 },
  ],
};

// 🔹 Extra Fees
const extraFees = {
  sanitary: 150,
  solidWaste: 150,
  environmental: 150,
  building: 150,
  sanitaryRequirements: 150,
  mechanical: 150,
  electrical: 150,
  signage: 150,
  electronics: 150,
};

// 🔹 Utility Functions
const getBarangayBracket = (barangay) => {
  if (!barangay) return null;
  for (const [bracket, list] of Object.entries(barangayBrackets)) {
    if (
      list.some((b) => b.trim().toLowerCase() === barangay.trim().toLowerCase())
    ) {
      return bracket;
    }
  }
  return null;
};

const computeBarangayFee = (barangay, capital) => {
  const bracket = getBarangayBracket(barangay);
  if (!bracket) return 0;
  const range = feeRanges[bracket].find(
    (r) => capital >= r.min && capital <= r.max
  );
  return range ? range.fee : 0;
};

const calculateZoningFee = (totalCapital) => {
  if (totalCapital <= 5000) return "Exempted";
  if (totalCapital <= 10000) return 100;
  if (totalCapital <= 50000) return 200;
  if (totalCapital <= 100000) return 300;
  return ((totalCapital - 100000) * 0.001 + 500).toFixed(2);
};

const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 80; i <= currentYear + 0; i++) {
    years.push(i);
  }
  return years;
};

// 🔹 Main Calculator
const calculateBusinessTax = (capital, employees, barangay) => {
  const c = Number(capital.replace(/,/g, ""));
  const e = Number(employees);
  if (isNaN(c) || c <= 0) return { fee: "0.00", details: null };

  const businessTax = c * 0.005;
  const barangayFee = computeBarangayFee(barangay, c);
  const occupationalTax = e * 50;
  const zoningFee = calculateZoningFee(c);
  const zoningFeeValue = zoningFee === "Exempted" ? 0 : Number(zoningFee);

  const totalExtraFees = Object.values(extraFees).reduce((a, b) => a + b, 0);

  const total =
    businessTax +
    barangayFee +
    occupationalTax +
    zoningFeeValue +
    totalExtraFees;

  return {
    fee: total.toFixed(2),
    details: {
      businessTax,
      barangayFee,
      occupationalTax,
      zoningFee,
      extraFees,
      total,
    },
  };
};

// 🔹 Dialog Component
const BusinessAssessmentDialog = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    capital: "",
    barangay: "",
    employees: "",
  });
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState("New"); // <-- "New" is default

  useEffect(() => {
    if (open) {
      setFormData({ capital: "", barangay: "", employees: "" });
      setResult(null);
      setMode("New");
    }
  }, [open]);

  const formatNumber = (value) => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue ? Number(numericValue).toLocaleString("en-PH") : "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Automatically compute months delayed when quarter changes
    if (name === "quarter") {
      const year = Number(formData.year || new Date().getFullYear());
      let dueDate;

      if (value === "Q1") dueDate = new Date(year, 0, 20); // Jan 20
      else if (value === "Q2") dueDate = new Date(year, 3, 20); // Apr 20
      else if (value === "Q3") dueDate = new Date(year, 6, 20); // Jul 20
      else if (value === "Q4") dueDate = new Date(year, 9, 20); // Oct 20

      const today = new Date();
      const monthsDiff =
        (today.getFullYear() - dueDate.getFullYear()) * 12 +
        (today.getMonth() - dueDate.getMonth());
      const monthsDelayed = Math.max(0, monthsDiff);

      setFormData((prev) => ({
        ...prev,
        [name]: value,
        monthsDelayed,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCompute = () => {
    const res = calculateBusinessTax(
      formData.capital,
      formData.employees,
      formData.barangay
    );

    // 🔹 Compute months delayed (just an example: assume current month vs Jan)
    const today = new Date();
    const dueDate = new Date(today.getFullYear(), 0, 20); // Jan 20
    const monthsDiff =
      (today.getFullYear() - dueDate.getFullYear()) * 12 +
      (today.getMonth() - dueDate.getMonth());
    const monthsDelayed = Math.max(0, monthsDiff);

    // 🔹 Compute surcharge (2% per month, max 72%)
    const surcharge = Math.min(
      res.details.total * 0.02 * monthsDelayed,
      res.details.total * 0.72
    );

    setResult({
      ...res,
      surcharge,
      monthsDelayed,
      totalWithSurcharge: res.details.lastPaymentAmount + surcharge,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {/* 🔹 Title + Mode Toggle */}
      <DialogTitle sx={{ color: "#09360D", fontWeight: "bold" }}>
        Business Fee Assessment
      </DialogTitle>

      <DialogContent>
        {/* 🔹 Mode Button Group */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <ButtonGroup variant="outlined">
            <Button
              variant={mode === "New" ? "contained" : "outlined"}
              sx={{
                backgroundColor: mode === "New" ? "#09360D" : "transparent",
                color: mode === "New" ? "#fff" : "#09360D",
                "&:hover": {
                  backgroundColor: mode === "New" ? "#07270a" : "#e8f5e9",
                },
              }}
              onClick={() => setMode("New")}
            >
              New
            </Button>
            <Button
              variant={mode === "Renew" ? "contained" : "outlined"}
              sx={{
                backgroundColor: mode === "Renew" ? "#09360D" : "transparent",
                color: mode === "Renew" ? "#fff" : "#09360D",
                "&:hover": {
                  backgroundColor: mode === "Renew" ? "#07270a" : "#e8f5e9",
                },
              }}
              onClick={() => setMode("Renew")}
            >
              Renew
            </Button>
          </ButtonGroup>
        </Box>

        {/* 🔹 Instruction Text */}
        <Typography variant="body2" gutterBottom>
          {mode === "New"
            ? "Enter your business details below to estimate your total permit fee for a new business."
            : "Enter your details below for renewal (testing fields)."}
        </Typography>

        {/* 🔹 Dynamic Form Fields */}
        {mode === "New" ? (
          <>
            <TextField
              name="capital"
              label="Total Capital Investment (₱)"
              fullWidth
              margin="normal"
              value={formData.capital}
              onChange={handleChange}
            />
            <TextField
              select
              name="barangay"
              label="Select Barangay"
              fullWidth
              margin="normal"
              value={formData.barangay}
              onChange={handleChange}
              SelectProps={{ native: true }}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">-- Select Barangay --</option>
              {barangayList.barangays.map((b, i) => (
                <option key={i} value={b}>
                  {b}
                </option>
              ))}
            </TextField>
            <TextField
              name="employees"
              label="Total Employees"
              fullWidth
              margin="normal"
              value={formData.employees}
              onChange={handleChange}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleCompute}
              disabled={!formData.capital}
              sx={{
                mt: 3,
                backgroundColor: "#09360D",
                "&:hover": { backgroundColor: "#07270a" },
              }}
            >
              Compute Fee
            </Button>
          </>
        ) : (
          <>
            {/* 🔹 Renew Mode — Only Test Fields */}
            <TextField
              name="bt"
              label="Business Tax (₱)"
              fullWidth
              margin="normal"
              type="number"
              value={formData.bt || ""}
              onChange={handleChange}
            />

            <TextField
              name="mp"
              label="Mayor's Permit (₱)"
              fullWidth
              margin="normal"
              type="number"
              value={formData.mp || ""}
              onChange={handleChange}
            />

            <TextField
              name="GrossSales"
              label="Business Tax Total Fees"
              fullWidth
              margin="normal"
              type="number"
              value={formData.GrossSales || ""}
              onChange={handleChange}
            />

            <TextField
              name="lastPaymentAmount"
              label="Gross Sales"
              fullWidth
              margin="normal"
              type="number"
              value={formData.lastPaymentAmount || ""}
              onChange={handleChange}
            />

            <TextField
              select
              name="modeOfPayment"
              label="Mode of Payment"
              fullWidth
              margin="normal"
              value={formData.modeOfPayment || ""}
              onChange={handleChange}
              SelectProps={{ native: true }}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">-- Select Mode of Payment --</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Semi-Annually">Semi-Annually</option>
            </TextField>

            <TextField
              select
              name="quarter"
              label="Latest Quarter of Payment"
              fullWidth
              margin="normal"
              value={formData.quarter || ""}
              onChange={handleChange}
              SelectProps={{ native: true }}
              InputLabelProps={{ shrink: true }}
            >
              <option value="">-- Select Quarter --</option>
              <option value="Q1">Q1 – January 20</option>
              <option value="Q2">Q2 – April 20</option>
              <option value="Q3">Q3 – July 20</option>
              <option value="Q4">Q4 – October 20</option>
            </TextField>

            <TextField
              select
              name="year"
              label="Year"
              fullWidth
              margin="normal"
              value={formData.year || new Date().getFullYear()}
              onChange={handleChange}
              SelectProps={{ native: true }}
              InputLabelProps={{ shrink: true }}
            >
              {getYearOptions().map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </TextField>

            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                const bt = Number(formData.bt || 0);
                const mp = Number(formData.mp || 0);
                const GrossSales = Number(formData.GrossSales || 0);

                let lastPaymentAmount = Number(formData.lastPaymentAmount || 0);

                // Adjust lastPaymentAmount based on mode of payment
                if (formData.modeOfPayment === "Quarterly") {
                  lastPaymentAmount = lastPaymentAmount / 4;
                } else if (formData.modeOfPayment === "Semi-Annually") {
                  lastPaymentAmount = lastPaymentAmount / 2;
                }

                const totalFees = bt + mp;

                const year = Number(formData.year || new Date().getFullYear());
                let dueDate;

                switch (formData.quarter) {
                  case "Q1":
                    dueDate = new Date(year, 0, 20);
                    break;
                  case "Q2":
                    dueDate = new Date(year, 3, 20);
                    break;
                  case "Q3":
                    dueDate = new Date(year, 6, 20);
                    break;
                  case "Q4":
                    dueDate = new Date(year, 9, 20);
                    break;
                  default:
                    dueDate = new Date(year, 0, 20);
                }

                const today = new Date();

                let monthsDelayed =
                  (today.getFullYear() - dueDate.getFullYear()) * 12 +
                  (today.getMonth() - dueDate.getMonth());
                monthsDelayed = Math.max(0, monthsDelayed);

                const cappedMonths = Math.min(monthsDelayed, 36);

                const surcharge = Math.min(
                  totalFees * 0.02 * cappedMonths,
                  totalFees * 0.72
                );

                const totalDue = lastPaymentAmount + surcharge;
                setResult({
                  bt,
                  mp,
                  totalFees,
                  surc: surcharge,
                  lastPaymentAmount,
                  GrossSales,
                  monthsDelayed,
                  total: totalDue,
                  quarter: formData.quarter,
                  year: formData.year,
                  modeOfPayment: formData.modeOfPayment,
                });
              }}
              disabled={
                !formData.bt ||
                !formData.mp ||
                !formData.GrossSales ||
                !formData.lastPaymentAmount ||
                !formData.modeOfPayment ||
                !formData.quarter
              }
              sx={{
                mt: 3,
                backgroundColor: "#09360D",
                "&:hover": { backgroundColor: "#07270a" },
              }}
            >
              Compute Renewal Fee
            </Button>

            {/* 🔹 Renewal Result Display */}
            {result && (
              <Paper
                elevation={3}
                sx={{
                  mt: 4,
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: "#f7faf8",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: "#09360D", fontWeight: "bold", mb: 1 }}
                >
                  Renewal Fee Breakdown
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mt: 2 }}>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    <li
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography>Gross Sales</Typography>
                      <Typography>
                        ₱
                        {result.GrossSales.toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                      </Typography>
                    </li>

                    <li
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography>Business Tax Total Fees</Typography>
                      <Typography>
                        ₱
                        {result.lastPaymentAmount.toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                      </Typography>
                    </li>

                    <li
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography>Surcharge (2%/month)</Typography>
                      <Typography>
                        ₱
                        {result.surc.toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                      </Typography>
                    </li>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        Total Amount Due:
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ color: "#1B5E20", fontWeight: "bold" }}
                      >
                        ₱
                        {result.total.toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                      </Typography>
                    </Box>
                  </ul>

                  <Divider sx={{ my: 1.5 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      Total Amount Due:
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: "#1B5E20", fontWeight: "bold" }}
                    >
                      ₱
                      {result.total.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{ color: "gray", mt: 1, fontStyle: "italic" }}
                  >
                    Quarter: {result.quarter || "N/A"} • Year: {result.year} •
                    Months Delayed: {result.monthsDelayed}
                  </Typography>
                </Box>
              </Paper>
            )}
          </>
        )}

        {/* 🔹 Show Result only for New mode */}
        {mode === "New" && result?.details && (
          <Paper
            elevation={3}
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 2,
              backgroundColor: "#f7faf8",
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "#09360D", fontWeight: "bold", mb: 1 }}
            >
              Assessment Breakdown
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mt: 2 }}>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography>Business Tax</Typography>
                  <Typography>
                    ₱
                    {result.details.businessTax.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </Typography>
                </li>
                <li
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography>Barangay Fee</Typography>
                  <Typography>
                    ₱
                    {result.details.barangayFee.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </Typography>
                </li>
                <li
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography>Occupational Tax</Typography>
                  <Typography>
                    ₱
                    {result.details.occupationalTax.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </Typography>
                </li>
                <li
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography>Zoning Fee</Typography>
                  <Typography>
                    {result.details.zoningFee === "Exempted"
                      ? "Exempted"
                      : `₱${Number(result.details.zoningFee).toLocaleString(
                          "en-PH",
                          {
                            minimumFractionDigits: 2,
                          }
                        )}`}
                  </Typography>
                </li>
                {Object.entries(result.details.extraFees).map(
                  ([key, value]) => (
                    <li
                      key={key}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography>
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (s) => s.toUpperCase())}
                      </Typography>
                      <Typography>
                        ₱
                        {value.toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                      </Typography>
                    </li>
                  )
                )}
              </ul>

              <Divider sx={{ my: 1.5 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Estimated Fee:
                </Typography>
                <Box textAlign="right">
                  <Typography
                    variant="body2"
                    sx={{ color: "gray", fontStyle: "italic", lineHeight: 1 }}
                  >
                    ±₱1,000
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ color: "#1B5E20", fontWeight: "bold" }}
                  >
                    ₱
                    {result.details.total.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit" startIcon={<CloseIcon />}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BusinessAssessmentDialog;
