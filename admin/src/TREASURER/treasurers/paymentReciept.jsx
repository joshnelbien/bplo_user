import React, { useRef, useMemo, useEffect } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { useReactToPrint } from "react-to-print";

// Function to convert number to words
const numberToWords = (num) => {
  const a = [
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
  const b = [
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

  if (!num || isNaN(num)) return "ZERO PESOS ONLY";
  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);

  const inWords = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
    if (n < 1000)
      return (
        a[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 ? " " + inWords(n % 100) : "")
      );
    if (n < 1000000)
      return (
        inWords(Math.floor(n / 1000)) +
        " Thousand" +
        (n % 1000 ? " " + inWords(n % 1000) : "")
      );
    return (
      inWords(Math.floor(n / 1000000)) +
      " Million" +
      (n % 1000000 ? " " + inWords(n % 1000000) : "")
    );
  };

  let result = inWords(integerPart);
  if (decimalPart > 0) result += ` and ${inWords(decimalPart)} Cents`;

  return result.toUpperCase() + " PESOS ONLY";
};

export default function PaymentReceipt({
  open,
  onClose,
  receiptData,
  applicant,
  onPrint,
  orNo,
}) {
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Payment Receipt",
    removeAfterPrint: true,
    onAfterPrint: () => {
      onPrint?.();
      onClose?.();
    },
  });

  const amount = Number(receiptData?.amount) || 0;
  const amountInWords = useMemo(() => numberToWords(amount), [amount]);

  const oboTotal =
    (Number(applicant.BSAP) || 0) +
    (Number(applicant.SR) || 0) +
    (Number(applicant.Mechanical) || 0) +
    (Number(applicant.Electrical) || 0) +
    (Number(applicant.Signage) || 0) +
    (Number(applicant.Electronics) || 0);
  // Calculate grouped fee sums
  const groupSums = {
    "B.T/M.P/B.F/O.T":
      (Number(applicant.businessTaxFee) || 0) +
      (Number(applicant.mayorsPermit) || 0) +
      (Number(applicant.barangayFee) || 0) +
      (Number(applicant.occupationalTax) || 0),

    "H.C/OBO": (Number(applicant.choFee) || 0) + oboTotal,

    "D.V/SURC/INT":
      (Number(applicant.deliveryVehicle) || 0) +
      (Number(applicant.surcharge) || 0) +
      (Number(applicant.interest) || 0),

    "T.P/SF/V.F":
      (Number(applicant.tinplateStickerFee) || 0) +
      (Number(applicant.fsicFee) || 0) +
      (Number(applicant.verificationFee) || 0),

    "Z.F/E.F/S.W.F":
      (Number(applicant.zoningFee) || 0) +
      (Number(applicant.cenroFee) || 0) +
      (Number(applicant.csmwoFee) || 0),

    "V.F/F.T":
      (Number(applicant.veterinaryFee) || 0) +
      (Number(applicant.fixedTax) || 0),

    "O.C./FSIC.F":
      (Number(applicant.videokeFee) || 0) +
      (Number(applicant.cigarettes) || 0) +
      (Number(applicant.liquor) || 0) +
      (Number(applicant.billiards) || 0) +
      (Number(applicant.boardAndLogging) || 0) +
      (Number(applicant.fsicFee) || 0),
  };

  const totalFees = Object.values(groupSums).reduce((a, b) => a + b, 0);

  // Log for debugging
  useEffect(() => {
    console.log("Applicant:", applicant);
    console.log("Grouped Fee Sums:", groupSums);
    console.log("Total Fees:", totalFees);
  }, [applicant]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "3in",
          height: "7in",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 2,
          borderRadius: 1,
          overflow: "hidden",
          fontFamily: "'Times New Roman', serif",
        }}
      >
        <style>
          {`
    @media print {
      @page {
        size: 3in 7in;
        margin: 0;
      }

      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      /* Hide buttons when printing */
      .no-print {
        display: none !important;
      }
            .print-outline {
      outline: 2px solid black !important;
      padding: 4px !important;
    }
    }
  `}
        </style>
        <Box
          ref={printRef}
          className="print-outline"
          sx={{
            fontSize: "12px",
            "--pad-xs": "2px",
            "--pad-sm": "4px",
            "--pad-md": "6px",
            "--space": "6px",
          }}
        >
          {/* Top Right: OR + Date */}
          <Box sx={{ textAlign: "right", mb: "var(--space)" }}>
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: "bold",
                mt: "120px",
                mr: "35px",
              }}
            >
              {orNo}
            </Typography>
            <Typography sx={{ fontSize: "14px", mt: "10px", mr: "40px" }}>
              {receiptData?.paymentDate}
            </Typography>
          </Box>

          {/* Address + Fund (GF) inline */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: "var(--space)",
            }}
          >
            <Typography sx={{ fontSize: "12px", ml: "50px", mt: "15px" }}>
              {applicant?.barangay}
            </Typography>

            <Typography sx={{ fontSize: "12px", mr: "25px", mt: "15px" }}>
              GF
            </Typography>
          </Box>

          {/* Payor */}
          <Box sx={{ mb: "var(--space)", ml: "30px" }}>
            <Typography sx={{ fontSize: "12px", mb: "px" }}>
              {applicant?.lastName}, {applicant?.firstName}{" "}
              {applicant?.middleName}
            </Typography>
          </Box>

          {/* Fee Breakdown */}
          <Box>
            {Object.entries(groupSums).map(([label, value]) => (
              <Box
                key={label}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: "var(--pad-xs)",
                  mx: "20px",
                  mt: "5px",
                }}
              >
                <Typography sx={{ fontSize: "12px" }}>{label}</Typography>
                <Typography sx={{ fontSize: "12px" }}>
                  ₱{value.toFixed(2)}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Total Right Side */}
          <Box sx={{ textAlign: "right", mt: "var(--space)" }}>
            <Typography
              sx={{ fontWeight: "bold", fontSize: "12px", mr: "20px" }}
            >
              {amount.toFixed(2)}
            </Typography>
          </Box>

          {/* Amount in Words */}
          <Box sx={{ mt: "var(--space)" }}>
            <Typography
              sx={{
                fontStyle: "italic",
                textTransform: "capitalize",
                fontSize: "8px",
                ml: "20px",
                mt: "20px",
              }}
            >
              {amountInWords}
            </Typography>
          </Box>

          {/* Cash / Check */}
          <Box sx={{ mt: "var(--space)" }}>
            <Typography sx={{ fontSize: "10px" }}>
              <strong>Payment Mode:</strong> {receiptData?.mode}
            </Typography>

            {receiptData?.mode === "Check" && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  mt: "var(--pad-md)",
                }}
              >
                <Typography sx={{ fontSize: "10px" }}>
                  <strong>Drawee Bank:</strong> {receiptData?.draweeBank}
                </Typography>

                <Typography sx={{ fontSize: "10px" }}>
                  <strong>Check No:</strong> {receiptData?.checkNumber}
                </Typography>

                <Typography sx={{ fontSize: "10px" }}>
                  <strong>Date:</strong> {receiptData?.checkDate}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Collector (Right Side) */}
          <Box sx={{ textAlign: "right", mt: "30px" }}>
            <Typography sx={{ fontSize: "10px" }}>
              ________________________
            </Typography>
            <Typography sx={{ fontSize: "10px" }}>
              Authorized Collector
            </Typography>
          </Box>
        </Box>

        {/* Buttons (Not Printed) */}
        <Box
          className="no-print"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 3,
            borderTop: "1px solid #ccc",
            pt: 2,
          }}
        >
          <Button variant="contained" color="primary" onClick={handlePrint}>
            Print
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
