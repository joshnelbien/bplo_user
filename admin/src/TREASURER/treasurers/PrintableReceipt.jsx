// PrintableReceipt.js
import React, { forwardRef } from "react";
import { Box, Typography } from "@mui/material";

const PrintableReceipt = forwardRef(
  ({ receiptData, applicant, orNo, groupSums, amount, amountInWords }, ref) => {
    return (
      <Box
        ref={ref}
        sx={{
          fontSize: "12px",
          height: "6in",
          position: "relative",
          "--space": "6px",
          mb: 1,
          fontFamily: "'Times New Roman', serif",
        }}
      >
        {/* OR NUMBER + DATE */}
        <Box sx={{ textAlign: "right" }}>
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

        {/* Address + GF */}
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
                {value.toFixed(2)}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Total */}
        <Box
          sx={{
            position: "absolute",
            top: "340px",
            right: "20px",
            textAlign: "right",
          }}
        >
          <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>
            {amount.toFixed(2)}
          </Typography>
        </Box>

        {/* Amount in Words */}
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
          }}
        >
          <Typography sx={{ fontSize: "10px" }}>/</Typography>

          {receiptData?.mode === "Check" && (
            <>
              <Typography sx={{ fontSize: "10px", ml: "70px" }}>
                {receiptData?.draweeBank}
              </Typography>
              <Typography sx={{ fontSize: "10px" }}>
                {receiptData?.checkNumber}
              </Typography>
              <Typography sx={{ fontSize: "10px" }}>
                {receiptData?.checkDate}
              </Typography>
            </>
          )}
        </Box>

        {/* Mode of Payment */}
        <Box sx={{ position: "absolute", top: "500px", left: "30px" }}>
          <Typography sx={{ fontSize: "15px" }}>
            {applicant.Modeofpayment}
          </Typography>
        </Box>

        {/* Collector */}
        <Box
          sx={{
            position: "absolute",
            top: "520px",
            right: "20px",
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
    );
  }
);

export default PrintableReceipt;
