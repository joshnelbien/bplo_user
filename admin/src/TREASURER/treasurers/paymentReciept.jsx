// PaymentReceiptModal.js
import React, { useRef, useMemo } from "react";
import { Modal, Box, Button } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import PrintableReceipt from "./PrintableReceipt";

// Convert Numbers to Words
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

export default function PaymentReceiptModal({
  open,
  onClose,
  receiptData,
  applicant,
  onPrint,
  orNo,
}) {
  const printRef = useRef();

  const amount = Number(receiptData?.amount) || 0;
  const amountInWords = useMemo(() => numberToWords(amount), [amount]);

  const oboTotal =
    (Number(applicant.BSAP) || 0) +
    (Number(applicant.SR) || 0) +
    (Number(applicant.Mechanical) || 0) +
    (Number(applicant.Electrical) || 0) +
    (Number(applicant.Signage) || 0) +
    (Number(applicant.Electronics) || 0);

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

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Payment Receipt",
    removeAfterPrint: true,
    onAfterPrint: () => {
      onPrint?.();
      onClose?.();
    },
  });

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "4in",
          height: "8in",
          bgcolor: "#fff",
          border: "2px solid black",
          borderRadius: "4px",
          boxShadow: 24,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Printable Content */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 1,
          }}
        >
          <PrintableReceipt
            ref={printRef}
            receiptData={receiptData}
            applicant={applicant}
            orNo={orNo}
            groupSums={groupSums}
            amount={amount}
            amountInWords={amountInWords}
          />
        </Box>

        {/* Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            p: 1,
            borderTop: "1px solid #ccc",
            background: "#fafafa",
          }}
        >
          <Button variant="contained" onClick={handlePrint}>
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
