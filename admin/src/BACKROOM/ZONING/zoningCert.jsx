import {
  Box,
  Button,
  Paper,
  TextField,
  Typography
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
    return ((totalCapital - 100000) * 0.001 + 500).toFixed(2);
  }
}

function ZoningCert({ applicant }) {
  const today = new Date();
  const day = today.getDate();
  const month = getFilipinoMonth(today.getMonth());
  const year = today.getFullYear();

  // ✅ Make form fields editable
  const [form, setForm] = useState({
    firstName: applicant.firstName,
    lastName: applicant.lastName,
    barangay: applicant.barangay,
    businessType: applicant.BusinessType,
    totalCapital: applicant.totalCapital,
  });

  const zoningFee = calculateZoningFee(Number(form.totalCapital));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Export to PDF
const exportPDF = () => {
  const doc = new jsPDF("p", "mm", "a4"); // A4 page
  const marginX = 20;
  let y = 20;

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

  // Full paragraph like modal
  const paragraph1 = 
    `ITO AY PAGPAPATUNAY na ang isang lugar na lupang matatagpuan sa barangay ${form.barangay}, San Pablo City, nakatala sa pangalan ni ${form.firstName} ${form.lastName} ay nakakasakop sa SONANG nakatalaga sa/o para gamiting ${form.businessType}, dahil dito ang pagtatayo ay maaaring pahintulutan at pasubaling babawiin o patitigilin sa sandaling mapatunayan naglalagay ng panganib sa PANGMADLANG KALUSUGAN AT KALIGTASAN.`;

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

  // --- SIGNATURE SECTION (Right aligned like preview) ---
y += 40;
doc.setFont("Times", "normal");
doc.text("For", 150, y, { align: "center" });   // Centered "For"

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
        {/* Header */}
        <Box textAlign="center" mb={3}>
          <Typography variant="h5" fontWeight="bold">
            CITY MAYOR'S OFFICE
          </Typography>
          <Typography variant="h6">San Pablo City</Typography>
          <Typography variant="h5" fontWeight="bold">
            ZONING AND LAND USE DIVISION
          </Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            PAGPAPATUNAY
          </Typography>
        </Box>

        {/* Editable Certificate Body */}
        <Typography paragraph sx={{ textAlign: "justify", mb: 2 }}>
          ITO AY PAGPAPATUNAY na ang isang lugar na lupang matatagpuan sa barangay{" "}
          <TextField
            name="barangay"
            value={form.barangay}
            onChange={handleChange}
            variant="standard"
            sx={{ width: 150 }}
          />{" "}
          , San Pablo City, nakatala sa pangalan ni{" "}
          <TextField
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            variant="standard"
            sx={{ width: 120 }}
          />{" "}
          <TextField
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            variant="standard"
            sx={{ width: 120 }}
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
            sx={{ width: 160 }}
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
            sx={{ width: 120 }}
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
