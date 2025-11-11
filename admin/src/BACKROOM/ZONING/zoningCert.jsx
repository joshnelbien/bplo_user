import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import jsPDF from "jspdf";
import { useState } from "react";

// Convert month number to Filipino month name
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

// Compute zoning fee based on capital
function calculateZoningFee(totalCapital) {
  if (totalCapital <= 5000) return "Exempted";
  if (totalCapital <= 10000) return 100;
  if (totalCapital <= 50000) return 200;
  if (totalCapital <= 100000) return 300;
  return ((totalCapital - 100000) * 0.001 + 500).toFixed(2);
}

// Dynamic TextField width
const getTextFieldWidth = (value) => {
  const minWidth = 80;
  const widthPerChar = 8;
  return `${Math.max(minWidth, value.length * widthPerChar)}px`;
};

function ZoningCert({ applicant, renewZoningFee }) {
  const today = new Date();
  const day = today.getDate();
  const month = getFilipinoMonth(today.getMonth());
  const year = today.getFullYear();

  const [form, setForm] = useState({
    firstName: applicant.firstName || "Juan",
    lastName: applicant.lastName || "Dela Cruz",
    barangay: applicant.barangay || "San Francisco",
    businessType: applicant.businessType || "Tindahan",
    totalCapital: applicant.totalCapital || "150000",
  });

  const zoningFee =
    applicant.application === "Renew"
      ? renewZoningFee
      : calculateZoningFee(Number(form.totalCapital));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // === EXPORT TO PDF ===
  const exportPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginX = 20;
    let y = 20;

    // 1. WATERMARK: FULLY OPAQUE
    const watermarkPath = "/ZoningWatermark.png";
    const wmWidth = 160;
    const wmHeight = 160;
    const wmX = (pageWidth - wmWidth) / 2;
    const wmY = (pageHeight - wmHeight) / 2;
    doc.addImage(watermarkPath, "PNG", wmX, wmY, wmWidth, wmHeight);

    // 2. HEADER: spclogo (left), zoninglogo (right)
    const logoSize = 28;
    const logoY = y;

    doc.addImage("/spclogo.png", "PNG", marginX, logoY, logoSize, logoSize);
    doc.addImage(
      "/zoninglogo.png",
      "PNG",
      pageWidth - marginX - logoSize,
      logoY,
      logoSize,
      logoSize
    );

    const centerX = pageWidth / 2;
    doc.setFont("Times", "bold");
    doc.setFontSize(16);
    doc.text("CITY MAYOR'S OFFICE", centerX, y + 8, { align: "center" });

    y += 8;
    doc.setFontSize(12);
    doc.text("San Pablo City", centerX, y + 8, { align: "center" });

    y += 8;
    doc.setFontSize(16);
    doc.text("ZONING AND LAND USE DIVISION", centerX, y + 8, {
      align: "center",
    });

    y += 12;
    doc.setFontSize(14);
    doc.text("PAGPAPATUNAY", centerX, y + 8, { align: "center" });

    // 3. BODY - JUSTIFIED PARAGRAPH
    y += 25;
    doc.setFontSize(12);
    doc.setFont("Times", "normal");

    const paragraph1 = `ITO AY PAGPAPATUNAY na ang isang lugar na lupang matatagpuan sa barangay ${form.barangay}, San Pablo City, nakatala sa pangalan ni ${form.firstName} ${form.lastName} ay nakakasakop sa SONANG nakatalaga sa/o para gamiting RES/COMM/IND/AGRI/INS, dahil dito ang pagtatayo ng ${form.businessType} ay maaaring pahintulutan at pasubaling babawiin o patitigilin sa sandaling mapatunayan naglalagay ng panganib sa PANGMADLANG KALUSUGAN AT KALIGTASAN.`;

    doc.text(paragraph1, marginX, y, {
      maxWidth: 170,
      align: "justify",
    });

    y += 45; // Approx height of justified paragraph

    const dateText = `Ipinagkaloob ngayon ika-${day} ng ${month}, ${year} kaugnay ng kanyang kahilingan para sa MAYOR'S PERMIT.`;
    doc.text(dateText, marginX, y, { maxWidth: 170, align: "justify" });

    y += 20;
    doc.setFont("Times", "bold");
    doc.text(`CAPITAL: P ${form.totalCapital}`, marginX, y);
    y += 8;
    const feeText = zoningFee === "Exempted" ? "Exempted" : `P ${zoningFee}`;
    doc.text(`ZONING FEE: ${feeText}`, marginX, y);

    // 4. SIGNATURE WITH "For:" ABOVE
    y += 35;

    doc.setFont("Times", "normal");
    doc.text("For:", 150, y, { align: "center" });

    y += 25; // Space before signature

    const sigPath = "/samplesig.png";
    const sigWidth = 50;
    const sigHeight = 20;
    const sigX = 150 - sigWidth / 2;
    const sigY = y;

    doc.addImage(sigPath, "PNG", sigX, sigY, sigWidth, sigHeight);

    y += sigHeight + 3;
    doc.setFont("Times", "bold");
    doc.text("HON. ARCADIO B. GAPANGADA, MNSA", 150, y, { align: "center" });

    y += 7;
    doc.setFont("Times", "normal");
    doc.text("City Mayor", 150, y, { align: "center" });

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
          backgroundImage: `url(/ZoningWatermark.png)`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "70%",
        }}
      >
        {/* === HEADER: spclogo (left), text (center), zoninglogo (right) === */}
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={3} sx={{ textAlign: "left" }}>
            <Box
              component="img"
              src="/spclogo.png"
              alt="SPC Logo"
              sx={{ width: 70, height: 70 }}
            />
          </Grid>

          <Grid item xs={6} sx={{ textAlign: "center" }}>
            <Typography variant="h5" fontWeight="bold">
              CITY MAYOR'S OFFICE
            </Typography>
            <Typography variant="h6">San Pablo City PAG PAPATUNAY</Typography>
            <Typography variant="h5" fontWeight="bold">
              ZONING AND LAND USE DIVISION
            </Typography>
          </Grid>

          <Grid item xs={3} sx={{ textAlign: "right" }}>
            <Box
              component="img"
              src="/zoninglogo.png"
              alt="Zoning Logo"
              sx={{ width: 70, height: 70 }}
            />
          </Grid>
        </Grid>

        {/* === CERTIFICATE BODY === */}
        <Typography paragraph sx={{ textAlign: "justify", mt: 5, mb: 2 }}>
          ITO AY PAGPAPATUNAY na ang isang lugar na lupang matatagpuan sa
          barangay{" "}
          <TextField
            name="barangay"
            value={form.barangay}
            onChange={handleChange}
            variant="standard"
            sx={{ width: getTextFieldWidth(form.barangay) }}
          />{" "}
          , San Pablo City, nakatala sa pangalan ni{" "}
          <TextField
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            variant="standard"
            sx={{ width: getTextFieldWidth(form.firstName) }}
          />{" "}
          <TextField
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            variant="standard"
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
            sx={{ width: getTextFieldWidth(form.businessType) }}
          />{" "}
          ay maaaring pahintulutan at pasubaling babawiin o patitigilin sa
          sandaling mapatunayan naglalagay ng panganib sa PANGMADLANG KALUSUGAN
          AT KALIGTASAN.
        </Typography>

        <Typography paragraph sx={{ textAlign: "justify" }}>
          Ipinagkaloob ngayon ika-{day} ng {month}, {year} kaugnay ng kanyang
          kahilingan para sa MAYOR'S PERMIT.
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          CAPITAL: P{" "}
          <TextField
            name="totalCapital"
            value={form.totalCapital}
            onChange={handleChange}
            variant="standard"
            sx={{ width: getTextFieldWidth(form.totalCapital) }}
          />
        </Typography>

        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          ZONING FEE:{" "}
          <b>{zoningFee === "Exempted" ? zoningFee : `P${zoningFee}`}</b>
        </Typography>

        {/* === SIGNATURE WITH "For:" ABOVE === */}
        <Box mt={5} textAlign="right" sx={{ mr: 10 }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            For:
          </Typography>

          <Box
            component="img"
            src="/samplesig.png"
            alt="Signature"
            sx={{ width: 120, height: 50, mb: -1 }}
          />
          
          <Typography variant="body1" fontWeight="bold">
            HON. ARCADIO B. GAPANGADA, MNSA
          </Typography>
          <Typography variant="body2">City Mayor</Typography>
        </Box>

        {/* === EXPORT BUTTON === */}
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