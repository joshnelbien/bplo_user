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
  <title>Official Receipt - ${orNo || "N/A"}</title>
  <style>
    @page {
      size: 8.5in 11in;
      margin: 0.3in;
    }
    body {
      font-family: "Courier New", Courier, monospace;
      font-size: 11pt;
      margin: 0;
      padding: 0.2in;
      line-height: 1.3;
    }
    .container {
      width: 100%;
      border: 2px solid black;
      padding: 0.15in;
      box-sizing: border-box;
    }
    .header {
      text-align: center;
      font-weight: bold;
      margin-bottom: 8px;
    }
    .logo {
      width: 80px;
      height: 80px;
      margin: 0 auto 5px;
      background: #fff;
      border: 1px solid #000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
    }
    .or-box {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      font-size: 12pt;
    }
    .or-no {
      border: 1px solid black;
      padding: 2px 8px;
      font-weight: bold;
    }
    .date {
      text-align: right;
    }
    .agency-fund {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      font-size: 11pt;
    }
    .payor {
      border-bottom: 1px solid black;
      padding-bottom: 2px;
      margin-bottom: 8px;
      font-weight: bold;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
      font-size: 11pt;
    }
    th, td {
      border: 1px solid black;
      padding: 4px 6px;
      text-align: left;
    }
    th {
      background-color: #f0f0f0;
      font-weight: bold;
    }
    .text-right {
      text-align: right;
    }
    .total-row td {
      font-weight: bold;
      background-color: #e0e0e0;
    }
    .amount-words {
      border: 1px solid black;
      padding: 5px;
      margin-bottom: 10px;
      font-size: 11pt;
    }
    .payment-mode {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 10pt;
    }
    .signature {
      margin-top: 20px;
      text-align: center;
    }
    .note {
      font-size: 9pt;
      margin-top: 15px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div style="font-size:14pt;">Accountable Form No. 51-C</div>
      <div style="font-size:10pt;">Revised January, 1992</div>
      <div style="font-size:10pt; float:right;">(TRIPLICATE)</div>
    </div>
    <table width="100%" style="margin-bottom:8px;">
      <tr>
        <td width="20%" align="center" valign="middle">
          <div class="logo">LOGO</div>
        </td>
        <td width="60%" align="center">
          <div style="font-size:16pt;font-weight:bold;">Official Receipt</div>
          <div style="font-size:13pt;">of the</div>
          <div style="font-size:14pt;font-weight:bold;">Republic of the Philippines</div>
        </td>
        <td width="20%" align="right" valign="top">
          <div class="or-box">
            <div>No. <span class="or-no">${orNo || "__________"}</span> V</div>
          </div>
          <div class="date">Date ${today}</div>
        </td>
      </tr>
    </table>

    <div class="agency-fund">
      <div>Agency <strong>San Pablo City, Laguna</strong></div>
      <div>Fund <strong>${fund}</strong></div>
    </div>

    <div class="payor">Payor <strong>${payor || "______________________________"}</strong></div>

    <table>
      <thead>
        <tr>
          <th>Nature of Collection</th>
          <th>Account Code</th>
          <th class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${printableFees
          .map(
            ([name, { amount, quantity }]) => `
            <tr>
              <td>${name}</td>
              <td></td>
              <td class="text-right">₱ ${amount.toFixed(2)} x ${quantity}</td>
            </tr>`
          )
          .join("")}
        <tr class="total-row">
          <td colspan="2"><strong>TOTAL</strong></td>
          <td class="text-right"><strong>₱ ${total.toFixed(2)}</strong></td>
        </tr>
      </tbody>
    </table>

    <div class="amount-words">
      <strong>Amount in Words:</strong><br/>
      ${amountInWords}
    </div>

    <div class="payment-mode">
      <div>
        ${paymentMode === "cash" ? "Check" : "Square"} Cash<br/>
        ${paymentMode === "check" ? "Check" : "Square"} Check<br/>
        ${paymentMode === "moneyorder" ? "Check" : "Square"} Money Order
      </div>
      <div>
        <strong>Drawee Bank</strong><br/>
        ${checkBank || "_________________"}<br/><br/>
        <strong>Number</strong><br/>
        ${checkNumber || "__________"}<br/><br/>
        <strong>Date</strong><br/>
        ${checkDate || "__________"}
      </div>
    </div>

    <div style="margin-top:15px;">
      Received the amount stated above.
    </div>

    <div class="signature">
      <br/><br/>
      <strong>_____________________________</strong><br/>
      <strong>LUCIO GERALDO G. CIOLO</strong><br/>
      <em>Asst. City Treasurer</em><br/><br/>
      <strong>Collecting Officer</strong>
    </div>

    <div class="note">
      <strong>NOTE:</strong> Write the number and date of this receipt on the back of check or money order received.
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