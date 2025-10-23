import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

export default function PaymentReciept({
  open,
  onClose,
  receiptData,
  onPrint,
  applicant,
}) {
  const handlePrint = () => {
    alert("Printing");

    onClose();
    // window.print();
    onPrint();
  };
  console.log("applicant:", applicant);
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 288,
          height: 672,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          overflowY: "auto",
        }}
      >
        <Typography variant="h6">Payment Receipt</Typography>
        <Typography sx={{ mt: 2 }}>
          Amount Paid: ₱ {receiptData?.amount} <br />
          Payment Date: {receiptData?.paymentDate} <br />
          Payment Mode: {receiptData?.mode} <br />
          {receiptData?.mode === "Check" && (
            <>
              Drawee Bank: {receiptData?.draweeBank} <br />
              Check Number: {receiptData?.checkNumber} <br />
              Check Date: {receiptData?.checkDate} <br />
            </>
          )}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handlePrint}
        >
          Print & Confirm
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onClose}
          sx={{ mt: 2 }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
}
