import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Box,
  Paper,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useState } from "react";

const defaultFees = {
  "CERTIFICATION FEE": 100.0,
  "TRANSFER FEE": 0.0,
  "CERT. OF NO IMPROVEMENT": 50.0,
  "CERT. OF ASSESSMENT": 50.0,
  "MISC.FEE(TAX MAPPING)": 30.0,
  "CERT. OF NON-OWNERSHIP": 50.0,
  "CTC": 50.0,
  "CERT. FEE(100 WORDS)": 50.0,
  "CERT. FEE(120 WORDS)": 0.0,
  "CERT. FEE(MERALCO)": 50.0,
  "MAYOR'S CLEARANCE": 50.0,
  "PUBLIC CEMETERY": 0.0,
  "RENTAL FEE": 100.0,
  "SENIOR CITIZEN'S": 0.0,
  "REPLACEMENT I.D": 100.0,
  "GARBAGE FEE": 365.0,
  "CERTIFIED OF XEROX COPY": 50.0,
};

function numberToWords(num) {
  if (!num) return "Zero Pesos Only";
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];
  const scales = ["", "Thousand", "Million", "Billion"];

  const convertHundreds = (n) => {
    let str = "";
    if (n > 99) str += ones[Math.floor(n / 100)] + " Hundred ";
    n %= 100;
    if (n > 19) {
      str += tens[Math.floor(n / 10)];
      n %= 10;
      if (n > 0) str += " " + ones[n];
    } else if (n > 0) {
      str += ones[n];
    }
    return str.trim();
  };

  if (num === 0) return "Zero Pesos Only";

  let word = "";
  let scaleIndex = 0;
  while (num > 0) {
    const chunk = num % 1000;
    if (chunk) {
      let chunkWord = convertHundreds(chunk);
      if (scaleIndex > 0) chunkWord += " " + scales[scaleIndex];
      word = chunkWord + (word ? " " + word : "");
    }
    num = Math.floor(num / 1000);
    scaleIndex++;
  }

  return word.trim() + " Pesos Only";
}

function FeeModal({ open, onClose, applicant }) {
  const [orNo, setOrNo] = useState("");
  const [payor, setPayor] = useState(applicant?.businessName || "");
  const [fund, setFund] = useState("GENERAL FUND");
  const [paymentMode, setPaymentMode] = useState("cash");
  const [checkBank, setCheckBank] = useState("");
  const [checkNumber, setCheckNumber] = useState("");
  const [checkDate, setCheckDate] = useState("");

  // Initialize fees with quantity
  const [feeData, setFeeData] = useState(() => {
    const saved = applicant?.fees ? JSON.parse(applicant.fees) : {};
    return Object.keys(defaultFees).reduce((acc, key) => {
      acc[key] = {
        amount: saved[key] ?? defaultFees[key],
        quantity: saved[key] > 0 ? 1 : 0,
      };
      return acc;
    }, {});
  });

  const handleQuantityChange = (name, delta) => {
    setFeeData((prev) => {
      const current = prev[name];
      const newQty = Math.max(0, current.quantity + delta);
      return {
        ...prev,
        [name]: { ...current, quantity: newQty },
      };
    });
  };

  const handleAmountChange = (name, value) => {
    const num = parseFloat(value) || 0;
    setFeeData((prev) => ({
      ...prev,
      [name]: { ...prev[name], amount: num },
    }));
  };

  // Calculate total
  const total = Object.values(feeData).reduce((sum, { amount, quantity }) => {
    return sum + amount * quantity;
  }, 0);

  const amountInWords = numberToWords(Math.floor(total)) +
    (total % 1 !== 0 ? " and " + ((total % 1) * 100).toFixed(0) + "/100" : "");

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Filter only items with quantity > 0
    const printableFees = Object.entries(feeData).filter(
      ([_, { quantity }]) => quantity > 0
    );

    printWindow.document.write(`

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Official Receipt</title>

<style>
  @page {
    size: 8.5in 11in;
    margin: 0;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: "Times New Roman", serif;
    background: white;
  }

  /* Center small OR on whole paper */
  .page-center {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 20px;
  }

  /* OR actual size (approx 4.5in wide like real OR) */
  .or-container {
    width: 4.6in;
    border: 1px solid #000;
    padding: 6px;
    box-sizing: border-box;
  }

  .header {
    text-align: center;
    line-height: 1.1;
    margin-bottom: 5px;
  }

  .seal-box {
    width: 60px;
    height: 60px;
    border: 1px solid #000;
    margin: 0 auto 4px auto;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .row {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    margin-bottom: 4px;
  }

  .label-line {
    border-bottom: 1px solid #000;
    padding-bottom: 2px;
    font-size: 11px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
    margin-top: 4px;
  }

  th, td {
    border: 1px solid #000;
    padding: 3px;
  }

  th {
    text-align: center;
    font-weight: bold;
    background: #f2f2f2;
  }

  .amount-right {
    text-align: right;
  }

  .total-row td {
    font-weight: bold;
    background: #eaeaea;
  }

  .amount-words {
    border: 1px solid #000;
    padding: 4px;
    font-size: 11px;
    margin-top: 6px;
  }

  .payment-box {
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
    font-size: 11px;
  }

  .signature {
    text-align: center;
    margin-top: 20px;
    font-size: 11px;
  }

  .note {
    font-size: 9px;
    margin-top: 10px;
    text-align: center;
  }
</style>
</head>

<body>
<div class="page-center"> 
  <div class="or-container">

<div class="header">
  <div class="seal-box">
    <img src="/republicofthephilippines.png" alt="Republic of the Philippines Seal" style="width: 100%; height: 100%; object-fit: contain;" />
  </div>
  <div style="font-weight:bold; font-size:14px;">OFFICIAL RECEIPT</div>
  <div style="font-size:11px;">Republic of the Philippines</div>
</div>

    <!-- FORM NUMBER + ORIGINAL -->
    <div class="row">
      <div style="font-size:10px;">
        Accountable Form No. 51<br/>
        Revised January, 1992
      </div>

      <div style="font-size:12px; font-weight:bold;">
        O R I G I N A L
      </div>
    </div>

    <!-- DATE + OR NO -->
    <div class="row">
      <div>Date: <span class="label-line">${today}</span></div>
      <div>No. <span class="label-line">${orNo || "________"}</span></div>
    </div>

    <!-- Agency + Fund -->
    <div class="row">
      <div>Agency: <span class="label-line">San Pablo City, Laguna</span></div>
      <div>Fund: <span class="label-line">${fund}</span></div>
    </div>

    <!-- Payor -->
    <div style="margin-top:5px; font-size:11px;">
      Payor: <span class="label-line">${payor || "____________________________"}</span>
    </div>

    <!-- TABLE -->
    <table>
      <thead>
        <tr>
          <th style="width: 60%;">NATURE OF COLLECTION</th>
          <th style="width: 20%;">ACCOUNT CODE</th>
          <th style="width: 20%;">AMOUNT</th>
        </tr>
      </thead>
      <tbody>
        ${printableFees
          .map(
            ([name, { amount, quantity }]) => `
          <tr>
            <td>${name}</td>
            <td></td>
            <td class="amount-right">₱ ${(amount * quantity).toFixed(2)}</td>
          </tr>
        `
          )
          .join("")}

        <tr class="total-row">
          <td colspan="2">TOTAL</td>
          <td class="amount-right">₱ ${total.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <!-- AMOUNT IN WORDS -->
    <div class="amount-words">
      <strong>AMOUNT IN WORDS:</strong><br/>
      ${amountInWords}
    </div>

    <!-- PAYMENT MODE -->
    <div class="payment-box">
      <div>
        <div><input type="checkbox" ${paymentMode === "cash" ? "checked" : ""}/> Cash</div>
        <div><input type="checkbox" ${paymentMode === "check" ? "checked" : ""}/> Check</div>
        <div><input type="checkbox" ${paymentMode === "moneyorder" ? "checked" : ""}/> Money Order</div>
      </div>

      <div style="text-align:right;">
        Drawee Bank: <span class="label-line">${checkBank || ""}</span><br/>
        Number: <span class="label-line">${checkNumber || ""}</span><br/>
        Date: <span class="label-line">${checkDate || ""}</span>
      </div>
    </div>

    <div class="signature">
      Received the amount stated above.<br/><br/><br/>
      _______________________________<br/>
      <strong>LUCIO GERALDO G. CIOLO</strong><br/>
      <em>Asst. City Treasurer</em><br/>
      Collecting Officer
    </div>

    <div class="note">
      NOTE: Write the number and date of this receipt at the back of checks or money orders.
    </div>

  </div>
</div>
</body>
</html>
`);


    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          backgroundColor: "#1c541eff",
          color: "white",
          textAlign: "center",
          fontWeight: "bold",
        }}
      > 
        Official Receipt (Accountable Form No. 51-C)
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
          <TextField
            label="OR No."
            size="small"
            value={orNo}
            onChange={(e) => setOrNo(e.target.value)}
            sx={{ width: 150 }}
          />
          <TextField
            label="Payor"
            size="small"
            fullWidth
            value={payor}
            onChange={(e) => setPayor(e.target.value)}
          />
          <TextField
            label="Fund"
            size="small"
            value={fund}
            onChange={(e) => setFund(e.target.value)}
            sx={{ width: 180 }}
          />
        </Box>

        <TableContainer component={Paper} elevation={3} sx={{ mb: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Nature of Collection</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Account Code</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Amount (₱)
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Qty
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Subtotal
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(defaultFees).map((name) => {
                const { amount, quantity } = feeData[name];
                const subtotal = amount * quantity;
                return (
                  <TableRow key={name}>
                    <TableCell>{name}</TableCell>
                    <TableCell></TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        type="number"
                        value={amount}
                        onChange={(e) => handleAmountChange(name, e.target.value)}
                        inputProps={{ step: "0.01", min: 0 }}
                        sx={{ width: 90 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(name, -1)}
                          disabled={quantity === 0}
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ mx: 1, minWidth: 30, textAlign: "center" }}>
                          {quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(name, 1)}
                          color="primary"
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <strong>₱{subtotal.toFixed(2)}</strong>
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell colSpan={4} sx={{ fontWeight: "bold", textAlign: "right" }}>
                  TOTAL
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  ₱{total.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Amount in Words:
          </Typography>
          <Typography variant="body1" sx={{ fontStyle: "italic" }}>
            {amountInWords}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={paymentMode === "cash"}
                  onChange={() => setPaymentMode("cash")}
                />
              }
              label="Cash"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={paymentMode === "check"}
                  onChange={() => setPaymentMode("check")}
                />
              }
              label="Check"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={paymentMode === "moneyorder"}
                  onChange={() => setPaymentMode("moneyorder")}
                />
              }
              label="Money Order"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <TextField
              label="Drawee Bank"
              size="small"
              fullWidth
              value={checkBank}
              onChange={(e) => setCheckBank(e.target.value)}
              disabled={paymentMode !== "check" && paymentMode !== "moneyorder"}
            />
            <TextField
              label="Number"
              size="small"
              fullWidth
              sx={{ mt: 1 }}
              value={checkNumber}
              onChange={(e) => setCheckNumber(e.target.value)}
              disabled={paymentMode !== "check" && paymentMode !== "moneyorder"}
            />
            <TextField
              label="Date"
              size="small"
              fullWidth
              sx={{ mt: 1 }}
              value={checkDate}
              onChange={(e) => setCheckDate(e.target.value)}
              disabled={paymentMode !== "check" && paymentMode !== "moneyorder"}
            />
          </Box>
        </Box>

        <Box sx={{ textAlign: "right", mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Received by: _______________________
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Date: {new Date().toLocaleDateString()}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handlePrint} variant="contained" color="primary">
          Print Official Receipt
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default FeeModal;