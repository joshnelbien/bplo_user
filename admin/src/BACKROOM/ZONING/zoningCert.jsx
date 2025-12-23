import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import jsPDF from "jspdf";
import { useState, useEffect } from "react";
import axios from "axios";

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
    application: applicant.application || "New",
  });

  const [userSignatory, setUserSignatory] = useState(null);
  const [fallbackSig, setFallbackSig] = useState(null);

  const zoningFee =
    applicant.application === "Renew"
      ? renewZoningFee
      : calculateZoningFee(Number(form.totalCapital));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Load dynamic signature
  useEffect(() => {
    const loadSignatures = async () => {
      try {
        const loadImageAsBase64 = async (imagePath) => {
          try {
            const response = await fetch(imagePath);
            const blob = await response.blob();
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(blob);
            });
          } catch {
            return null;
          }
        };

        const fallback = await loadImageAsBase64("/samplesig.png");
        setFallbackSig(fallback);

        const token = localStorage.getItem("token");
        if (token) {
          const API = import.meta.env.VITE_API_BASE;
          const res = await axios.get(`${API}/adminAccounts/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.data?.signatories) {
            setUserSignatory(`data:image/png;base64,${res.data.signatories}`);
          }
        }
      } catch (err) {
        console.error("Error loading signatures:", err);
      }
    };

    loadSignatures();
  }, []);

  const signatureToUse = userSignatory || fallbackSig;

  // === EXPORT TO PDF ===
  const exportPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginX = 20;
    let y = 20;

    // Set default font to Arial for entire PDF
    doc.setFont("helvetica"); // jsPDF uses "helvetica" as Arial equivalent

    // 1. WATERMARK
    const watermarkPath = "/ZoningWatermark.png";
    const wmWidth = 160;
    const wmHeight = 160;
    const wmX = (pageWidth - wmWidth) / 2;
    const wmY = (pageHeight - wmHeight) / 2;
    doc.addImage(watermarkPath, "PNG", wmX, wmY, wmWidth, wmHeight);

    // 2. HEADER
    const logoSize = 28;
    doc.addImage("/bagongpilipinas.png", "PNG", marginX, y, logoSize, logoSize);
    doc.addImage(
      "/spclogo.png",
      "PNG",
      pageWidth - marginX - logoSize,
      y,
      logoSize,
      logoSize
    );

    const centerX = pageWidth / 2;
    doc.setFont("helvetica", "bold");
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

    // 3. BODY
    y += 25;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const paragraph1 = `ITO AY PAGPAPATUNAY na ang isang lugar na lupang matatagpuan sa barangay ${form.barangay}, San Pablo City, nakatala sa pangalan ni ${form.firstName} ${form.lastName} ay nakakasakop sa SONANG nakatalaga sa/o para gamiting RES/COMM/IND/AGRI/INS, dahil dito ang pagtatayo ng ${form.businessType} ay maaaring pahintulutan at pasubaling babawiin o patitigilin sa sandaling mapatunayan naglalagay ng panganib sa PANGMADLANG KALUSUGAN AT KALIGTASAN.`;
    doc.text(paragraph1, marginX, y, { maxWidth: 170, align: "justify" });

    y += 45;
    const dateText = `Ipinagkaloob ngayon ika-${day} ng ${month}, ${year} kaugnay ng kanyang kahilingan para sa MAYOR'S PERMIT.`;
    doc.text(dateText, marginX, y, { maxWidth: 170, align: "justify" });

    y += 20;
    doc.setFont("helvetica", "bold");
    doc.text(`CAPITAL: P ${form.totalCapital}`, marginX, y);
    y += 8;
    const feeText = zoningFee === "Exempted" ? "Exempted" : `P ${zoningFee}`;
    doc.text(`ZONING FEE: ${feeText}`, marginX, y);

    // 4. Dynamic Checkboxes in PDF
    y += 15;
    doc.setFont("helvetica", "normal");
    doc.text("Type:", marginX, y);
    const checkboxX = marginX + 20;
    const checkboxY = y - 3;
    const boxSize = 5;

    // New
    doc.rect(checkboxX, checkboxY, boxSize, boxSize);
    if (applicant.application === "New") {
      doc.setFontSize(10);
      doc.text("/", checkboxX + 1, checkboxY + boxSize);
    }
    doc.setFontSize(12);
    doc.text("New", checkboxX + 10, y);

    // Renew
    const renewX = checkboxX + 40;
    doc.rect(renewX, checkboxY, boxSize, boxSize);
    if (applicant.application === "Renew") {
      doc.setFontSize(10);
      doc.text("/", renewX + 1, checkboxY + boxSize);
    }
    doc.setFontSize(12);
    doc.text("Renew", renewX + 10, y);

    // 5. SIGNATURE
    y += 35;
    doc.setFont("helvetica", "normal");
    doc.text("For:", 150, y, { align: "center" });

    y += 25;
    if (signatureToUse) {
      const sigWidth = 50;
      const sigHeight = 20;
      const sigX = 150 - sigWidth / 2;
      const sigY = y;
      doc.addImage(signatureToUse, "PNG", sigX, sigY, sigWidth, sigHeight);
    }

    y += 25;
    doc.setFont("helvetica", "bold");
    doc.text("HON. ARCADIO B. GAPANGADA, MNSA", 150, y, { align: "center" });
    y += 7;
    doc.setFont("helvetica", "normal");
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
          fontFamily: "Arial, Helvetica, sans-serif", // Global Arial for preview
        }}
      >
        {/* HEADER */}
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={3} sx={{ textAlign: "left" }}>
            <Box
              component="img"
              src="/bagongpilipinas.png"
              alt="bagong pilipinas Logo"
              sx={{ width: 70, height: 70 }}
            />
          </Grid>

          <Grid item xs={6} sx={{ textAlign: "center" }}>
            <Typography variant="h5" fontWeight="bold" sx={{ fontFamily: "Arial" }}>
              CITY MAYOR'S OFFICE
            </Typography>
            <Typography variant="h6" sx={{ fontFamily: "Arial" }}>
              San Pablo City
            </Typography>
            <Typography variant="h5" fontWeight="bold" sx={{ fontFamily: "Arial" }}>
              ZONING AND LAND USE DIVISION
            </Typography>
            <Typography variant="h5" fontWeight="bold" sx={{ fontFamily: "Arial", mt: 1 }}>
              PAGPAPATUNAY
            </Typography>
          </Grid>

          <Grid item xs={3} sx={{ textAlign: "right" }}>
            <Box
              component="img"
              src="/spclogo.png"
              alt="spc Logo"
              sx={{ width: 70, height: 70 }}
            />
          </Grid>
        </Grid>

        {/* BODY */}
        <Typography
          paragraph
          sx={{
            textAlign: "justify",
            mt: 5,
            mb: 2,
            fontFamily: "Arial",
            fontSize: "14pt",
            lineHeight: 1.6,
          }}
        >
          ITO AY PAGPAPATUNAY na ang isang lugar na lupang matatagpuan sa
          barangay{" "}
          <TextField
            name="barangay"
            value={form.barangay}
            onChange={handleChange}
            variant="standard"
            InputProps={{ style: { fontFamily: "Arial" } }}
            sx={{ width: getTextFieldWidth(form.barangay) }}
          />{" "}
          , San Pablo City, nakatala sa pangalan ni
          <TextField
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            variant="standard"
            InputProps={{ style: { fontFamily: "Arial" } }}
            sx={{ width: getTextFieldWidth(form.firstName) }}
          />
          <TextField
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            variant="standard"
            InputProps={{ style: { fontFamily: "Arial" } }}
            sx={{ width: getTextFieldWidth(form.lastName) }}
          />{" "}
          ay nakakasakop sa SONANG nakatalaga sa/o para gamiting{" "}
          <b>
            <u>RES/COMM/IND/AGRI/INS</u>
          </b>
          , dahil dito ang pagtatayo ng
          <TextField
            name="businessType"
            value={form.businessType}
            onChange={handleChange}
            variant="standard"
            InputProps={{ style: { fontFamily: "Arial" } }}
            sx={{ width: getTextFieldWidth(form.businessType) }}
          />{" "}
          ay maaaring pahintulutan at pasubaling babawiin o patitigilin sa
          sandaling mapatunayan naglalagay ng panganib sa PANGMADLANG KALUSUGAN
          AT KALIGTASAN.
        </Typography>

        <Typography
          paragraph
          sx={{ textAlign: "justify", fontFamily: "Arial", fontSize: "14pt", lineHeight: 1.6 }}
        >
          Ipinagkaloob ngayon ika-{day} ng {month}, {year} kaugnay ng kanyang
          kahilingan para sa MAYOR'S PERMIT.
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2, fontFamily: "Arial", fontWeight: "bold" }}>
          CAPITAL: P
          <TextField
            name="totalCapital"
            value={form.totalCapital}
            onChange={handleChange}
            variant="standard"
            InputProps={{ style: { fontFamily: "Arial" } }}
            sx={{ width: getTextFieldWidth(form.totalCapital) }}
          />
        </Typography>

        <Typography variant="subtitle1" sx={{ mb: 1, fontFamily: "Arial" }}>
          ZONING FEE:{" "}
          <b>{zoningFee === "Exempted" ? zoningFee : `P${zoningFee}`}</b>
        </Typography>

        {/* DYNAMIC CHECKBOXES */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <FormControlLabel
            control={<Checkbox checked={applicant.application === "New"} />}
            label={<span style={{ fontFamily: "Arial" }}>New</span>}
          />
          <FormControlLabel
            control={<Checkbox checked={applicant.application === "Renew"} />}
            label={<span style={{ fontFamily: "Arial" }}>Renew</span>}
          />
        </Box>

        {/* SIGNATURE */}
        <Box mt={5} textAlign="right" sx={{ mr: 10 }}>
          <Typography variant="body1" sx={{ mb: 3, fontFamily: "Arial" }}>
            For:
          </Typography>
          {signatureToUse && (
            <Box
              component="img"
              src={signatureToUse}
              sx={{ width: 120, height: 50, mb: -1 }}
            />
          )}
          <Typography variant="body1" fontWeight="bold" sx={{ fontFamily: "Arial" }}>
            HON. ARCADIO B. GAPANGADA, MNSA
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: "Arial" }}>
            City Mayor
          </Typography>
        </Box>

        {/* EXPORT BUTTON */}
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