// src/components/ChoCertExport.jsx
import React, { useRef } from "react";
import { Box, Button } from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ChoCertExport = ({ applicant }) => {
  const certRef = useRef();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const today = new Date();
  const nextYear = new Date(today);
  nextYear.setFullYear(today.getFullYear() + 1);

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

    pdf.save(`CHO_Permit_${applicant.bin || "Applicant"}.pdf`);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Printable Area */}
      <div
        ref={certRef}
        style={{
          width: "210mm",
          minHeight: "297mm",
          padding: "40px 50px",
          backgroundColor: "#fff",
          fontFamily: 'Georgia, "Times New Roman", Times, serif',
          fontSize: "12pt",
          lineHeight: "1.5",
          color: "#000",
          boxSizing: "border-box",
          margin: "0 auto",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src="/spclogo.png"
            alt="San Pablo City Logo"
            style={{
              width: "80px",
              height: "auto",
            }}
          />
        </div>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h2 style={{ margin: 0, fontWeight: "bold", fontSize: "18pt" }}>
            SAN PABLO CITY
          </h2>
          <h3 style={{ margin: "8px 0", fontSize: "16pt" }}>City Health Office</h3>
          <p style={{ fontStyle: "italic", margin: 0, fontSize: "12pt" }}>
            Republic of the Philippines
          </p>
        </div>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1
            style={{
              color: "#1d5236",
              fontSize: "28pt",
              fontWeight: "bold",
              margin: 0,
              letterSpacing: "1px",
            }}
          >
            C E R T I F I C A T I O N
          </h1>
        </div>

        {/* Body */}
        <p style={{ margin: "0 0 16px", textAlign: "justify" }}>
          This is to certify that:
        </p>

        <div style={{ margin: "0 40px 30px" }}>
          <h3 style={{ margin: "0 0 8px", fontWeight: "bold", fontSize: "14pt" }}>
            {applicant.businessName || "________________________"}
          </h3>
          <p style={{ margin: "0 0 8px" }}>
            with Business Identification Number (BIN):{" "}
            <strong>{applicant.bin || "N/A"}</strong>
          </p>
          <p style={{ margin: "0 0 16px" }}>
            located at{" "}
            <strong>
              {[
                applicant.addressLine1,
                applicant.barangay,
                applicant.cityOrMunicipality,
                applicant.province,
              ]
                .filter(Boolean)
                .join(", ")}
            </strong>
          </p>

          <p style={{ margin: "0 0 16px", textAlign: "justify" }}>
            has been inspected and found to be in compliance with the provisions of
            the City Health and Sanitation Code and related health regulations.
          </p>

          <p style={{ margin: "0 0 8px" }}>
            This permit is issued upon payment of the required{" "}
            <strong>Sanitary Fee</strong> in the amount of{" "}
            <strong>
              ₱
              {applicant.choFee
                ? parseFloat(applicant.choFee).toLocaleString("en-US")
                : "0.00"}
            </strong>
            .
          </p>

          <p style={{ margin: 0 }}>
            Valid from: <strong>{formatDate(today)}</strong> until{" "}
            <strong>{formatDate(nextYear)}</strong>
          </p>
        </div>

        {/* Signatures */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "60px",
            padding: "0 40px",
          }}
        >
          <div style={{ textAlign: "center", width: "45%" }}>
            <div
              style={{
                borderTop: "1px solid #000",
                paddingTop: "8px",
                fontWeight: "bold",
              }}
            >
              {applicant.sanitaryInspector || "________________________"}
            </div>
            <div style={{ fontSize: "10pt", marginTop: "4px" }}>
              Sanitary Inspector
            </div>
          </div>
          <div style={{ textAlign: "center", width: "45%" }}>
            <div
              style={{
                borderTop: "1px solid #000",
                paddingTop: "8px",
                fontWeight: "bold",
              }}
            >
              {applicant.choHead || "DR. JUAN DELA CRUZ"}
            </div>
            <div style={{ fontSize: "10pt", marginTop: "4px" }}>
              City Health Officer
            </div>
          </div>
        </div>

        {/* Certificate Number */}
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <p
            style={{
              color: "#666",
              fontSize: "10pt",
              margin: 0,
              fontStyle: "italic",
            }}
          >
            Permit No: CHO-{applicant.id || "XXXX"}-{today.getFullYear()}
          </p>
        </div>
      </div>
    </Box>
  );
};

export default ChoCertExport;