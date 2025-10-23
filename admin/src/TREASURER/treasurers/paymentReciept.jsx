import React, { useRef, useMemo } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { useReactToPrint } from "react-to-print";

/* ✅ Convert Number to Words (₱ → Pesos) */
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

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "5in",
          height: "7in",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
          overflowY: "auto",
          fontFamily: "'Times New Roman', serif",
        }}
      >
        {/* ✅ Printable Content */}
        <Box ref={printRef}>
          <Typography variant="h6" gutterBottom align="center">
            PAYMENT RECEIPT
          </Typography>
          <Typography variant="body2">
            <strong>Date:</strong> {receiptData?.paymentDate || "N/A"}
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Barangay:</strong> {applicant?.barangay || "N/A"}
            </Typography>
            <Typography variant="body2">
              <strong>Payor:</strong>{" "}
              {`${applicant?.lastName || ""} ${applicant?.firstName || ""} ${
                applicant?.middleName || ""
              }`}
            </Typography>

            <Typography variant="body2">ST/MP/S.F</Typography>
            <Typography variant="body2">O.F/H.C/S/S/F/G.F</Typography>
            <Typography variant="body2">S.F/B.F/MECF</Typography>
            <Typography variant="body2">E.F/SB/B/F</Typography>
            <Typography variant="body2">E/F./DV.F</Typography>
            <Typography variant="body2">SURC/INT/T.S.F.N.F.</Typography>
            <Typography variant="body2">O.C./FSIC.F</Typography>
            <Typography variant="body2">
              <strong>Payment Mode:</strong> {receiptData?.mode || "N/A"}
            </Typography>

            {/* ✅ Only show check info when mode is "Check" */}
            {receiptData?.mode === "Check" && (
              <>
                <Typography variant="body2">
                  <strong>Drawee Bank:</strong>{" "}
                  {receiptData?.draweeBank || "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>Check Number:</strong>{" "}
                  {receiptData?.checkNumber || "N/A"}
                </Typography>
                <Typography variant="body2">
                  <strong>Check Date:</strong> {receiptData?.checkDate || "N/A"}
                </Typography>
              </>
            )}

            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Amount:</strong> ₱{amount.toFixed(2)}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                fontStyle: "italic",
                mt: 1,
                textTransform: "capitalize",
              }}
            >
              <strong>Amount in Words:</strong> {amountInWords}
            </Typography>
          </Box>
        </Box>

        {/* 🚫 Buttons (Not Printed) */}
        <Box
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
