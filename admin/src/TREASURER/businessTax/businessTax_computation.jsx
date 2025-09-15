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
  TextField,
} from "@mui/material";
import BusinessTaxDocxExport from "./BusinessTaxDocxExport";

function BusinessTax_computation({ isOpen, onClose, applicant }) {
  const [barangayBrackets, setBarangayBrackets] = useState(null);
  const [collections, setCollections] = useState([]);

  // Employee-based fee
  const numberOfEmployee = Number(applicant?.numberOfEmployee) || 0;
  const occupationalTax = numberOfEmployee * 50;

  // Load JSON (brackets) once
  useEffect(() => {
    fetch("/barangay_brackets.json")
      .then((res) => res.json())
      .then((data) => setBarangayBrackets(data))
      .catch((err) => console.error("Error loading JSON:", err));
  }, []);

  // Compute Business Tax
  const capital = Number(applicant?.totalCapital) || 0;
  const businessTax = capital * 0.5 * 0.01;

  const nonEditableFields = new Set([
    "BUSINESS TAX",
    "BARANGAY FEE",
    "OCCUPATIONAL TAX",
    "HEALTH, CER & SSF",
    "SWM GARBAGE FEE",
    "SANITARY INSPECTION",
    "BUILDING INSPECTION",
    "MECHANICAL INSPECTION",
    "ELECTRICAL INSPECTION",
    "SIGNBOARD/BILLBOARD",
    "ELECTRONIC INSPECTION",
    "ZONING FEE",
    "CENRO",
    "SWMO CERT",
  ]);

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

  function getBarangayBracket(barangay) {
    if (!barangayBrackets) return null;
    for (const [bracket, list] of Object.entries(barangayBrackets)) {
      if (list.includes(barangay)) return bracket;
    }
    return null;
  }

  function computeBarangayFee(barangay, capital) {
    const bracket = getBarangayBracket(barangay);
    if (!bracket) return 0;
    const range = feeRanges[bracket].find(
      (r) => capital >= r.min && capital <= r.max
    );
    return range ? range.fee : 0;
  }

  // Recompute fee whenever brackets or applicant changes
  const [barangayFee, setBarangayFee] = useState(0);
  useEffect(() => {
    if (applicant?.barangay && barangayBrackets) {
      const fee = computeBarangayFee(applicant.barangay, capital);
      setBarangayFee(fee);
    }
  }, [applicant, barangayBrackets, capital]);

  // Initialize collections
  useEffect(() => {
    setCollections([
      { label: "BUSINESS TAX", amount: String(businessTax) },
      { label: "MAYOR’S PERMIT", amount: "" },
      {
        label: "BARANGAY FEE",
        amount: barangayFee > 0 ? String(barangayFee) : "",
      },
      { label: "OCCUPATIONAL TAX", amount: String(occupationalTax) },
      { label: "HEALTH, CER & SSF", amount: String(applicant?.choFee || "") },
      { label: "SWM GARBAGE FEE", amount: String(applicant?.csmwoFee || "") },
      { label: "OBO", amount: "" },
      { label: "SANITARY INSPECTION", amount: String(applicant?.SR || "") },
      { label: "BUILDING INSPECTION", amount: String(applicant?.BSAP || "") },
      {
        label: "MECHANICAL INSPECTION",
        amount: String(applicant?.Mechanical || ""),
      },
      {
        label: "ELECTRICAL INSPECTION",
        amount: String(applicant?.Electrical || ""),
      },
      {
        label: "SIGNBOARD/BILLBOARD",
        amount: String(applicant?.Signage || ""),
      },
      {
        label: "ELECTRONIC INSPECTION",
        amount: String(applicant?.Electronics || ""),
      },
      { label: "DELIVERY VEHICLE", amount: "" },
      { label: "SURCHARGE", amount: "" },
      { label: "INTEREST", amount: "" },
      { label: "TINPLATE/STICKER FEE", amount: "" },
      { label: "VERIFICATION FEE", amount: "" },
      { label: "ZONING FEE", amount: String(applicant?.zoningFee || "") },
      { label: "CENRO", amount: String(applicant?.cenroFee || "") },
      { label: "SWMO CERT", amount: String(applicant?.cenroFee || "") },
      { label: "VETERNARY FEE", amount: "" },
      { label: "FIXED TAX", amount: "" },
      { label: "VIDEOKE CARABET DANCEHALL", amount: "" },
      { label: "CIGARETTES", amount: "" },
      { label: "LIQUOR", amount: "" },
      { label: "BILLIARDS", amount: "" },
      { label: "BOARD AND LOGGING", amount: "" },
      { label: "FSIC FEE", amount: "" },
    ]);
  }, [applicant, barangayFee, businessTax, occupationalTax]);

  // Handle editable fields
  const handleAmountChange = (label, value) => {
    setCollections((prev) =>
      prev.map((item) =>
        item.label === label ? { ...item, amount: value } : item
      )
    );
  };

  const total = collections.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0
  );
  const otherChargesTotal = collections
    .filter((item) => item.label !== "BUSINESS TAX")
    .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const formatPeso = (value) =>
    value > 0
      ? `₱ ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
      : "₱ ______";

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

          {/* Reference */}
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

          {/* Collection Table */}
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
                      <TextField
                        size="small"
                        type="number"
                        variant="outlined"
                        value={item.amount}
                        onChange={(e) =>
                          handleAmountChange(item.label, e.target.value)
                        }
                        sx={{ width: 140 }}
                        InputProps={{
                          startAdornment: <span>₱&nbsp;</span>,
                          readOnly: nonEditableFields.has(item.label),
                        }}
                      />
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
        <BusinessTaxDocxExport
          applicant={applicant}
          collections={collections}
          total={total}
          otherChargesTotal={otherChargesTotal}
        />
      </DialogActions>
    </Dialog>
  );
}

export default BusinessTax_computation;
