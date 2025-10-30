// src/components/cmswoCertExport.jsx
import React, { useRef } from "react";
import {
  Box,
  Typography,
  TableContainer,
  Paper,
  Button,
} from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const CmswoCertExport = ({ applicant }) => {
  const certRef = useRef();

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDownloadPDF = async () => {
    const element = certRef.current;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`CSWMO_Certificate_${applicant.bin || "Applicant"}.pdf`);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Hidden printable area */}
      <Box
        ref={certRef}
        sx={{
          p: 6,
          backgroundColor: "#fff",
          borderRadius: 2,
          width: "210mm",
          minHeight: "297mm",
          margin: "0 auto",
          fontFamily: "'Times New Roman', Times, serif",
          color: "#000",
          "@media print": {
            size: "A4",
            margin: 0,
            body: { margin: 0 },
          },
        }}
      >
        {/* Logo */}
        <Box textAlign="center" mb={2}>
          <img
            src="/spclogo.png"
            alt="San Pablo City Logo"
            style={{
              width: "80px",
              height: "auto",
              marginBottom: "8px",
            }}
          />
        </Box>

        {/* Header */}
        <Box textAlign="center" mb={3}>
          <Typography variant="h5" fontWeight="bold">
            SAN PABLO CITY
          </Typography>
          <Typography variant="h6">Office of the City Solid Waste Management</Typography>
          <Typography variant="subtitle1" fontStyle="italic">
            Republic of the Philippines
          </Typography>
        </Box>

        <Box textAlign="center" mb={5}>
          <Typography variant="h4" fontWeight="bold" color="#1d5236">
            CERTIFICATE OF SOLID WASTE MANAGEMENT COMPLIANCE
          </Typography>
        </Box>

        <Typography variant="body1" paragraph textAlign="justify">
          This is to certify that:
        </Typography>

        <Box mx={6} mb={4}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {applicant.businessName || "________________________"}
          </Typography>
          <Typography variant="body1">
            with Business Identification Number (BIN):{" "}
            <strong>{applicant.bin || "N/A"}</strong>
          </Typography>
          <Typography variant="body1" paragraph>
            located at{" "}
            <strong>
              {applicant.addressLine1}, {applicant.barangay},{" "}
              {applicant.cityOrMunicipality}, {applicant.province}
            </strong>
          </Typography>

          <Typography variant="body1" paragraph textAlign="justify">
            has been inspected and found to be in compliance with the provisions
            of the City Solid Waste Management Ordinance and related environmental
            laws and regulations.
          </Typography>

          <Typography variant="body1" paragraph>
            This certificate is issued upon payment of the required{" "}
            <strong>Solid Waste Management Fee</strong> in the amount of{" "}
            <strong>
              ₱{parseFloat(applicant.csmwoFee || 0).toLocaleString()}
            </strong>.
          </Typography>
        </Box>

        {/* Signatures */}
        <Box display="flex" justifyContent="space-between" mt={10} px={6}>
          <Box textAlign="center">
            <Typography variant="body1" fontWeight="bold">
              {applicant.inspectorName || "________________________"}
            </Typography>
            <Typography variant="caption">Inspector / Authorized Signatory</Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="body1" fontWeight="bold">
              {applicant.cmoHead || "________________________"}
            </Typography>
            <Typography variant="caption">City Solid Waste Management Officer</Typography>
          </Box>
        </Box>
      </Box>

    </Box>
  );
};

export default CmswoCertExport;