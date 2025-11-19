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
          width: "4in",
          height: "8in", // slightly taller to fit buttons
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 1,
          borderRadius: 1,
          overflow: "visible",
          fontFamily: "'Times New Roman', serif",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between", // ensures buttons at bottom
        }}
      >
        {/* Printable area */}
        <Box
          ref={printRef}
          className="print-outline"
          sx={{
            fontSize: "12px",
            height: "6in", // adjust height
            position: "relative", // important for absolute children
            "--pad-xs": "2px",
            "--pad-sm": "4px",
            "--pad-md": "6px",
            "--space": "6px",
            mb: 1,
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
            <Typography sx={{ fontSize: "12px", mb: "35px" }}>
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
          <Box
            sx={{
              position: "absolute",
              top: "340px",
              right: "20px",
              textAlign: "right",
            }}
          >
            <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>
              ₱{amount.toFixed(2)}
            </Typography>
          </Box>

          {/* Amount in Words */}
          <Box sx={{ mt: "var(--space)" }}>
            <Typography
              sx={{
                fontStyle: "italic",
                position: "absolute",
                top: "400px",
                textTransform: "capitalize",
                fontSize: "8px",
                ml: "20px",
              }}
            >
              {amountInWords}
            </Typography>
          </Box>

          {/* Cash / Check */}
          <Box
            sx={{
              position: "absolute",
              top: "450px",
              left: "20px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "10px",
              fontSize: "10px",
              mt: receiptData?.mode === "Check" ? "10px" : 0, // extra spacing if check
            }}
          >
            {/* Always display slash / */}
            <Typography sx={{ fontSize: "10px" }}>/</Typography>

            {/* Show check details only if mode is actually "Check" */}
            {receiptData?.mode === "Check" && (
              <>
                <Typography sx={{ fontSize: "10px", ml: "70px" }}>
                  {receiptData?.draweeBank}
                </Typography>
                <Typography sx={{ fontSize: "10px", ml: "10px" }}>
                  {receiptData?.checkNumber}
                </Typography>
                <Typography sx={{ fontSize: "10px", ml: "10px" }}>
                  {receiptData?.checkDate}
                </Typography>
              </>
            )}
          </Box>

          {/* Collector (Right Side) */}

          <Box
            sx={{
              position: "absolute",
              top: "500px", // distance from bottom
              left: "30px", // distance from left
              textAlign: "left",
            }}
          >
            <Typography sx={{ fontSize: "15px" }}>
              {applicant.Modeofpayment}
            </Typography>
          </Box>

          <Box
            sx={{
              position: "absolute",
              top: "520px", // distance from bottom
              right: "20px", // distance from right
              textAlign: "right",
            }}
          >
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
            mt: 1,
            borderTop: "1px solid #ccc",
            pt: 1,
            px: 1,
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
