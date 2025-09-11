import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

function BusinessTax_computation({ isOpen, onClose, applicant }) {
  const [barangayBrackets, setBarangayBrackets] = useState(null);

  // ✅ Load JSON from public/ once
  useEffect(() => {
    fetch("/barangay_brackets.json")
      .then((res) => res.json())
      .then((data) => setBarangayBrackets(data))
      .catch((err) => console.error("Error loading JSON:", err));
  }, []);

  // ✅ Compute Business Tax based on formula
  const capital = Number(applicant?.totalCapital) || 0;
  const businessTax = capital * 0.5 * 0.01; // (capital * 50%) * 1%

  // ✅ Fee ranges per bracket
  const feeRanges = {
    "Bracket A": [
      { min: 1, max: 20000, fee: 100 },
      { min: 20000, max: 30000, fee: 150 },
      { min: 30000, max: 40000, fee: 200 },
      { min: 40000, max: 50000, fee: 250 },
      { min: 50000, max: 100000, fee: 300 },
      { min: 100000, max: 300000, fee: 350 },
      { min: 300000, max: 500000, fee: 400 },
      { min: 500000, max: 750000, fee: 500 },
      { min: 750000, max: 900000, fee: 750 },
      { min: 900000, max: 1000000, fee: 1000 },
      { min: 1000000, max: Infinity, fee: 1500 },
    ],
    "Bracket B": [
      { min: 1, max: 20000, fee: 100 },
      { min: 20000, max: 30000, fee: 120 },
      { min: 30000, max: 40000, fee: 160 },
      { min: 40000, max: 50000, fee: 200 },
      { min: 50000, max: 100000, fee: 240 },
      { min: 100000, max: 300000, fee: 280 },
      { min: 300000, max: 500000, fee: 320 },
      { min: 500000, max: 750000, fee: 400 },
      { min: 750000, max: 900000, fee: 600 },
      { min: 900000, max: 1000000, fee: 800 },
      { min: 1000000, max: Infinity, fee: 1200 },
    ],
    "Bracket C": [
      { min: 1, max: 20000, fee: 100 },
      { min: 20000, max: 30000, fee: 105 },
      { min: 30000, max: 40000, fee: 140 },
      { min: 40000, max: 50000, fee: 275 },
      { min: 50000, max: 100000, fee: 210 },
      { min: 100000, max: 300000, fee: 245 },
      { min: 300000, max: 500000, fee: 280 },
      { min: 500000, max: 750000, fee: 350 },
      { min: 750000, max: 900000, fee: 475 },
      { min: 900000, max: 1000000, fee: 700 },
      { min: 1000000, max: Infinity, fee: 1050 },
    ],
  };

  // ✅ Find bracket of applicant’s barangay
  function getBarangayBracket(barangay) {
    if (!barangayBrackets) return null;
    for (const [bracket, list] of Object.entries(barangayBrackets)) {
      if (list.includes(barangay)) return bracket;
    }
    return null;
  }

  // ✅ Compute Barangay Fee
  function computeBarangayFee(barangay, capital) {
    const bracket = getBarangayBracket(barangay);
    if (!bracket) return 0;

    const range = feeRanges[bracket].find(
      (r) => capital >= r.min && capital <= r.max
    );
    return range ? range.fee : 0;
  }

  const barangayFee = computeBarangayFee(applicant?.barangay, capital);

  // ✅ Define the collection rows as raw numbers
  const collections = [
    { label: "BUSINESS TAX", amount: businessTax },
    { label: "MAYOR’S PERMIT", amount: 0 },
    { label: "BARANGAY FEE", amount: barangayFee },
    { label: "OCCUPATIONAL TAX", amount: 0 },
    { label: "HEALTH, CER & SSF", amount: 0 },
    { label: "SWM GARBAGE FEE", amount: Number(applicant?.csmwoFee) || 0 },
    { label: "OBO", amount: 0 },
    { label: "SANITARY INSPECTION", amount: Number(applicant?.SR) || 0 },
    { label: "BUILDING INSPECTION", amount: Number(applicant?.BSAP) || 0 },
    {
      label: "MECHANICAL INSPECTION",
      amount: Number(applicant?.Mechanical) || 0,
    },
    {
      label: "ELECTRICAL INSPECTION",
      amount: Number(applicant?.Electrical) || 0,
    },
    { label: "SIGNBOARD/BILLBOARD", amount: Number(applicant?.Signage) || 0 },
    {
      label: "ELECTRONIC INSPECTION",
      amount: Number(applicant?.Electronics) || 0,
    },
    { label: "DELIVERY VAN", amount: 0 },
    { label: "SURCHARGE", amount: 0 },
    { label: "INTEREST", amount: 0 },
    { label: "TINPLATE/STICKER FEE", amount: 0 },
    { label: "VERIFICATION FEE", amount: 0 },
    { label: "ZONING FEE", amount: Number(applicant?.zoningFee) || 0 },
    { label: "CENRO", amount: Number(applicant?.cenroFee) || 0 },
    { label: "SWMO CERT", amount: Number(applicant?.cenroFee) || 0 },
    { label: "VETERNARY FEE", amount: 0 },
    { label: "FIXED TAX", amount: 0 },
    { label: "VIDEOKE CARABET DANCEHALL", amount: 0 },
    { label: "CIGARETTES", amount: 0 },
    { label: "LIQUOR", amount: 0 },
    { label: "BILLIARDS", amount: 0 },
    { label: "BOARD AND LOGGING", amount: 0 },
    { label: "FSIC FEE", amount: 0 },
  ];

  // ✅ Compute totals
  const total = collections.reduce((sum, item) => sum + item.amount, 0);
  const otherChargesTotal = collections
    .filter((item) => item.label !== "BUSINESS TAX")
    .reduce((sum, item) => sum + item.amount, 0);

  // ✅ Peso formatter
  const formatPeso = (value) =>
    value > 0
      ? `₱ ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
      : "₱ ______";

  // ✅ Convert number to words
  function numberToWords(num) {
    if (num === 0) return "zero";

    const belowTwenty = [
      "",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "eleven",
      "twelve",
      "thirteen",
      "fourteen",
      "fifteen",
      "sixteen",
      "seventeen",
      "eighteen",
      "nineteen",
    ];
    const tens = [
      "",
      "",
      "twenty",
      "thirty",
      "forty",
      "fifty",
      "sixty",
      "seventy",
      "eighty",
      "ninety",
    ];
    const thousands = ["", "thousand", "million", "billion"];

    function helper(n) {
      if (n === 0) return "";
      else if (n < 20) return belowTwenty[n] + " ";
      else if (n < 100) return tens[Math.floor(n / 10)] + " " + helper(n % 10);
      else
        return belowTwenty[Math.floor(n / 100)] + " hundred " + helper(n % 100);
    }

    let word = "";
    let i = 0;

    while (num > 0) {
      if (num % 1000 !== 0) {
        word = helper(num % 1000) + thousands[i] + " " + word;
      }
      num = Math.floor(num / 1000);
      i++;
    }

    return word.trim();
  }

  // ✅ Convert total with pesos & centavos
  function amountInWords(amount) {
    const pesos = Math.floor(amount);
    const centavos = Math.round((amount - pesos) * 100);

    let words = "";
    if (pesos > 0) {
      words += numberToWords(pesos) + " pesos";
    }
    if (centavos > 0) {
      words += " and " + numberToWords(centavos) + " centavos";
    }
    return words || "zero";
  }

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Business Tax Computation</DialogTitle>
      <DialogContent dividers>
        <Box p={2}>
          {/* Header */}
          <Box textAlign="center" mb={2}>
            <Typography variant="h6">Republic of the Philippines</Typography>
            <Typography variant="h6">CITY OF SAN PABLO</Typography>
            <Typography variant="subtitle1" mt={1}>
              BUSINESS TAX ORDER OF PAYMENT
            </Typography>
          </Box>

          {/* Reference + Capital + Gross */}
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12}>
              <Typography>REFERENCE NO: ___________</Typography>
              <Typography>
                BUSINESS ID: {applicant?.BIN || "___________"}
              </Typography>
              <Typography>
                CAPITAL:{" "}
                {capital > 0
                  ? capital.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : "0.00"}
              </Typography>
              <Typography>
                GROSS: {applicant?.gross || "___________"}
              </Typography>
            </Grid>
          </Grid>

          {/* Business Info */}
          <Box mb={2} border={1} borderColor="grey.400" p={2}>
            <Typography>
              NAME OF OWNER:{" "}
              {applicant
                ? `${applicant.firstName || ""} ${applicant.middleName || ""} ${
                    applicant.lastName || ""
                  }`
                : "___________"}
            </Typography>
            <Typography>
              BUSINESS NAME: {applicant?.businessName || "___________"}
            </Typography>
            <Typography>BUSINESS ADDRESS: {applicant?.barangay}</Typography>
            <Typography>
              NATURE OF BUSINESS: {applicant?.nature || "___________"}
            </Typography>
          </Box>

          {/* Nature of Collection Table */}
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>NATURE OF COLLECTION</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>AMOUNT</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {collections.map((item) => (
                  <TableRow key={item.label}>
                    <TableCell>{item.label}</TableCell>
                    <TableCell align="right">
                      {formatPeso(item.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Totals */}
          <Box mb={2}>
            <Typography>
              Other Charges total: {formatPeso(otherChargesTotal)}
            </Typography>
            <Typography>Total: {formatPeso(total)}</Typography>
          </Box>

          {/* Amount in Words + Service Vehicle + Mode of Payment */}
          <Box mb={2} border={1} borderColor="grey.400" p={2}>
            <Typography>
              AMOUNT IN WORDS: {total > 0 ? amountInWords(total) : "__________"}
            </Typography>
            <Typography>No. Of Service Vehicle: ___________</Typography>
            <Typography>Mode of Payment: ___________</Typography>
          </Box>

          {/* Footer */}
          <Box mt={4}>
            <Typography>Computed By: ___________</Typography>
            <Typography textAlign="right" mt={2}>
              (Treasurer)
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Close
        </Button>
        <Button color="primary" variant="contained">
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default BusinessTax_computation;
