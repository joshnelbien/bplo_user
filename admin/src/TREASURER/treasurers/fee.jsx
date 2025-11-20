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

// Import print template
import generateORHtml from "./OfficialReceiptTemplate";

const defaultFees = {
  "CERTIFICATION FEE": 100.0,
  "TRANSFER FEE": 0.0,
  "CERT. OF NO IMPROVEMENT": 50.0,
  "CERT. OF ASSESSMENT": 50.0,
  "MISC.FEE(TAX MAPPING)": 30.0,
  "CERT. OF NON-OWNERSHIP": 50.0,
  CTC: 50.0,
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
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

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

  let word = "",
    scaleIndex = 0;
  const scales = ["", "Thousand", "Million", "Billion"];

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

  return word + " Pesos Only";
}

export default function FeeModal({ open, onClose, applicant }) {
  const [orNo, setOrNo] = useState("");
  const [payor, setPayor] = useState(applicant?.businessName || "");
  const [fund, setFund] = useState("GF");
  const [paymentMode, setPaymentMode] = useState("cash");
  const [checkBank, setCheckBank] = useState("");
  const [checkNumber, setCheckNumber] = useState("");
  const [checkDate, setCheckDate] = useState("");

  const [feeData, setFeeData] = useState(() => {
    const saved = applicant?.fees ? JSON.parse(applicant.fees) : {};
    return Object.fromEntries(
      Object.keys(defaultFees).map((key) => [
        key,
        {
          amount: saved[key] ?? defaultFees[key],
          quantity: saved[key] > 0 ? 1 : 0,
        },
      ])
    );
  });

  const handleQuantityChange = (name, delta) => {
    setFeeData((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        quantity: Math.max(0, prev[name].quantity + delta),
      },
    }));
  };

  const handleAmountChange = (name, value) => {
    setFeeData((prev) => ({
      ...prev,
      [name]: { ...prev[name], amount: parseFloat(value) || 0 },
    }));
  };

  const total = Object.values(feeData).reduce(
    (sum, f) => sum + f.amount * f.quantity,
    0
  );

  const amountInWords =
    numberToWords(Math.floor(total)) +
    (total % 1 !== 0 ? ` and ${((total % 1) * 100).toFixed(0)}/100` : "");

  const handlePrint = () => {
    const printHTML = generateORHtml({
      orNo,
      payor,
      fund,
      feeData,
      total,
      amountInWords,
      paymentMode,
      checkBank,
      checkNumber,
      checkDate,
    });

    // Create a hidden iframe
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";

    document.body.appendChild(iframe);

    // Write HTML into the iframe
    iframe.contentDocument.open();
    iframe.contentDocument.write(printHTML);
    iframe.contentDocument.close();

    // Wait for HTML + CSS to load before printing
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      document.body.removeChild(iframe);
    }, 500);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{ background: "#1c541e", color: "white", textAlign: "center" }}
      >
        Official Receipt (Accountable Form No. 51-C)
      </DialogTitle>

      <DialogContent dividers>
        {/* OR Inputs */}
        <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
          <TextField
            label="OR No."
            size="small"
            value={orNo}
            onChange={(e) => setOrNo(e.target.value)}
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
          />
        </Box>

        {/* TABLE */}
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nature of Collection</TableCell>
                <TableCell>Account Code</TableCell>
                <TableCell align="center">Amount (₱)</TableCell>
                <TableCell align="center">Qty</TableCell>
                <TableCell align="right">Subtotal</TableCell>
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
                        onChange={(e) =>
                          handleAmountChange(name, e.target.value)
                        }
                        sx={{ width: 90 }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(name, -1)}
                        disabled={quantity === 0}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>

                      {quantity}

                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(name, 1)}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </TableCell>

                    <TableCell align="right">₱{subtotal.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}

              <TableRow>
                <TableCell colSpan={4} align="right">
                  <strong>TOTAL</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>₱{total.toFixed(2)}</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* PAYMENT MODE */}
        <Box sx={{ display: "flex", gap: 3 }}>
          <Box>
            {["cash", "check", "moneyorder"].map((mode) => (
              <FormControlLabel
                key={mode}
                control={
                  <Checkbox
                    checked={paymentMode === mode}
                    onChange={() => setPaymentMode(mode)}
                  />
                }
                label={mode.toUpperCase()}
              />
            ))}
          </Box>

          <Box sx={{ flex: 1 }}>
            <TextField
              label="Drawee Bank"
              size="small"
              fullWidth
              disabled={paymentMode === "cash"}
              value={checkBank}
              onChange={(e) => setCheckBank(e.target.value)}
            />
            <TextField
              label="Check Number"
              size="small"
              fullWidth
              sx={{ mt: 1 }}
              disabled={paymentMode === "cash"}
              value={checkNumber}
              onChange={(e) => setCheckNumber(e.target.value)}
            />
            <TextField
              label="Check Date"
              size="small"
              fullWidth
              sx={{ mt: 1 }}
              disabled={paymentMode === "cash"}
              value={checkDate}
              onChange={(e) => setCheckDate(e.target.value)}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={handlePrint}>
          Print Receipt
        </Button>
      </DialogActions>
    </Dialog>
  );
}
