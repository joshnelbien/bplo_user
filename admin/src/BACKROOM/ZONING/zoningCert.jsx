import {
  Box,
  Button,
  Grid, // ✅ Import Grid for better layout control
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import jsPDF from "jspdf";
import { useState } from "react";

// ✅ Convert month number to Filipino month name
function getFilipinoMonth(monthIndex) {
  const months = [
    "Enero",
    "Pebrero",
    "Marso",
    "Abril",
    "Mayo",
    "Hunyo",
    "Hulyo",
    "Agosto",
    "Setyembre",
    "Oktubre",
    "Nobyembre",
    "Disyembre",
  ];
  return months[monthIndex];
}

// ✅ Compute zoning fee based on capital
function calculateZoningFee(totalCapital) {
  if (totalCapital <= 5000) {
    return "Exempted";
  } else if (totalCapital >= 5001 && totalCapital <= 10000) {
    return 100;
  } else if (totalCapital >= 10001 && totalCapital <= 50000) {
    return 200;
  } else if (totalCapital >= 50001 && totalCapital <= 100000) {
    return 300;
  } else {
    // Ensure the return value is a string with 2 decimal places for fees
    return ((totalCapital - 100000) * 0.001 + 500).toFixed(2);
  }
}

// ✅ Helper to determine TextField width based on content length
const getTextFieldWidth = (value) => {
  // Use a minimum width (e.g., 80px) and add more width based on length
  // Adjust the multiplier (e.g., 8) as needed for your font and size
  const minWidth = 80;
  const widthPerChar = 8;
  return `${Math.max(minWidth, value.length * widthPerChar)}px`;
};

function ZoningCert({ applicant }) {
  const today = new Date();
  const day = today.getDate();
  const month = getFilipinoMonth(today.getMonth());
  const year = today.getFullYear();

  // ✅ Make form fields editable
  const [form, setForm] = useState({
    firstName: applicant.firstName || "Juan",
    lastName: applicant.lastName || "Dela Cruz",
    barangay: applicant.barangay || "San Francisco",
    businessType: applicant.businessType || "Tindahan",
    totalCapital: applicant.totalCapital || "150000",
  });

  const zoningFee = calculateZoningFee(Number(form.totalCapital));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Export to PDF (with Logo addition)
  const exportPDF = () => {
    const doc = new jsPDF("p", "mm", "a4"); // A4 page
    const marginX = 20;
    let y = 20;

    // --- LOGO (Added) ---
    // Ensure 'spclogo.png' is in the public folder
    const logoPath = "/spclogo.png";
    const logoWidth = 30; // mm
    const logoHeight = 30; // mm
    // Center the logo above the text block
    doc.addImage(logoPath, "PNG", 105 - logoWidth / 2, y, logoWidth, logoHeight);
    y += logoHeight + 5; // Move Y down past the logo

    // --- HEADER ---
    doc.setFont("Times", "bold");
    doc.setFontSize(16);
    doc.text("CITY MAYOR'S OFFICE", 105, y, { align: "center" });
    y += 8;
    doc.setFontSize(12);
    doc.text("San Pablo City", 105, y, { align: "center" });
    y += 8;
    doc.setFontSize(16);
    doc.text("ZONING AND LAND USE DIVISION", 105, y, { align: "center" });
    y += 10;
    doc.setFontSize(14);
    doc.text("PAGPAPATUNAY", 105, y, { align: "center" });

    // --- BODY ---
    y += 20;
    doc.setFontSize(12);
    doc.setFont("Times", "normal");

    // Full paragraph
    const paragraph1 = 
      `ITO AY PAGPAPATUNAY na ang isang lugar na lupang matatagpuan sa barangay ${form.barangay}, San Pablo City, nakatala sa pangalan ni ${form.firstName} ${form.lastName} ay nakakasakop sa SONANG nakatalaga sa/o para gamiting RES/COMM/IND/AGRI/INS, dahil dito ang pagtatayo ng ${form.businessType} ay maaaring pahintulutan at pasubaling babawiin o patitigilin sa sandaling mapatunayan naglalagay ng panganib sa PANGMADLANG KALUSUGAN AT KALIGTASAN.`;

    doc.text(paragraph1, marginX, y, { maxWidth: 170, textAlign: "justify" });

    // Date line
    y += 50;
    const dateText = `Ipinagkaloob ngayon ika-${day} ng ${month}, ${year} kaugnay ng kanyang kahilingan para sa MAYOR'S PERMIT.`;
    doc.text(dateText, marginX, y, { maxWidth: 170, textAlign: "justify" });

    // Capital & Fee
    y += 20;
    doc.setFont("Times", "bold");
    doc.text(`CAPITAL: P ${form.totalCapital}`, marginX, y);
    y += 8;
    const feeText = zoningFee === "Exempted" ? "Exempted" : `P ${zoningFee}`;
    doc.text(`ZONING FEE: ${feeText}`, marginX, y);

    // --- SIGNATURE SECTION (Right aligned) ---
    y += 40;
    doc.setFont("Times", "normal");
    doc.text("For", 150, y, { align: "center" });

    y += 12;
    doc.setFont("Times", "bold");
    doc.text("HON. ARCADIO B. GAPANGADA, MNSA", 150, y, { align: "center" });
    y += 7;
    doc.setFont("Times", "normal");
    doc.text("City Mayor", 150, y, { align: "center" });

    // Save file
    doc.save(`ZoningCert_${form.lastName}.pdf`);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 3 }}>
      <Paper
        elevation={6}
        sx={{
          width: "800px",
          p: 5,
          border: "2px solid black",
          borderRadius: 2,
          position: "relative",
        }}
      >
        {/* ✅ Enhanced Header with Logo and Grid for better alignment */}
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          {/* Logo on the left (e.g., column 4 of 12) */}
          <Grid item xs={3} sx={{ textAlign: "center" }}>
            {/* Logo path relative to the public folder */}
            <Box
              component="img"
              src="/spclogo.png"
              alt="San Pablo City Logo"
              sx={{ width: 80, height: 80 }}
            />
          </Grid>
          {/* Text in the center (e.g., column 8 of 12) */}
          <Grid item xs={9} sx={{ textAlign: "left" }}>
            <Typography variant="h5" fontWeight="bold">
              CITY MAYOR'S OFFICE
            </Typography>
            <Typography variant="h6">San Pablo City PAG PAPATUNAY</Typography>
            <Typography variant="h5" fontWeight="bold">
              ZONING AND LAND USE DIVISION
            </Typography>
          </Grid>
        
        </Grid>

        {/* --- Certificate Body --- */}
        <Typography paragraph sx={{ textAlign: "justify", mt: 5, mb: 2 }}>
          ITO AY PAGPAPATUNAY na ang isang lugar na lupang matatagpuan sa barangay{" "}
          <TextField
            name="barangay"
            value={form.barangay}
            onChange={handleChange}
            variant="standard"
            // ✅ Dynamic/Auto-expand width
            sx={{ width: getTextFieldWidth(form.barangay) }}
          />{" "}
          , San Pablo City, nakatala sa pangalan ni{" "}
          <TextField
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            variant="standard"
            // ✅ Dynamic/Auto-expand width
            sx={{ width: getTextFieldWidth(form.firstName) }}
          />{" "}
          <TextField
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            variant="standard"
            // ✅ Dynamic/Auto-expand width
            sx={{ width: getTextFieldWidth(form.lastName) }}
          />{" "}
          ay nakakasakop sa SONANG nakatalaga sa/o para gamiting{" "}
          <b>
            <u>RES/COMM/IND/AGRI/INS</u>
          </b>
          , dahil dito ang pagtatayo ng{" "}
          <TextField
            name="businessType"
            value={form.businessType}
            onChange={handleChange}
            variant="standard"
            // ✅ Dynamic/Auto-expand width
            sx={{ width: getTextFieldWidth(form.businessType) }}
          />{" "}
          ay maaaring pahintulutan...
        </Typography>

        <Typography>
          Ipinagkaloob ngayon ika-{day} ng {month}, {year} kaugnay ng kanyang
          kahilingan para sa MAYOR'S PERMIT.
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          CAPITAL: ₱{" "}
          <TextField
            name="totalCapital"
            value={form.totalCapital}
            onChange={handleChange}
            variant="standard"
            // ✅ Dynamic/Auto-expand width
            sx={{ width: getTextFieldWidth(form.totalCapital) }}
          />
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          ZONING FEE: <b>{zoningFee === "Exempted" ? zoningFee : `₱${zoningFee}`}</b>
        </Typography>

        {/* Signature Section */}
        <Box mt={5} textAlign="right">
          <Typography variant="body1">For:</Typography>
          <Typography variant="body1" fontWeight="bold">
            HON. ARCADIO B. GAPANGADA, MNSA
          </Typography>
          <Typography variant="body2">City Mayor</Typography>
        </Box>

        {/* Export PDF Button */}
        <Box mt={5} display="flex" justifyContent="center">
          <Button variant="contained" color="primary" onClick={exportPDF}>
            Export to PDF
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default ZoningCert;