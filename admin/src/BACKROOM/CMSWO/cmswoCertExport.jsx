// src/components/cmswoCertExport.jsx
import React, { useRef, useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE; // Your API base URL

const CmswoCertExport = ({ applicant }) => {
  const certRef = useRef();

  // State for CMSWO signatory
  const [cmswoSignatoryName, setCmswoSignatoryName] = useState(
    "CHARLIE B. BELARMINO"
  );
  const [cmswoSignatorySig, setCmswoSignatorySig] = useState(null);

  // Load signatory signature and name from API
  useEffect(() => {
    const loadCmswoSig = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${API}/adminAccounts/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.signatories) {
          setCmswoSignatorySig(`data:image/png;base64,${res.data.signatories}`);
        }

        if (res.data?.name) {
          setCmswoSignatoryName(res.data.name); // Adjust if API returns first/last separately
        }
      } catch (err) {
        console.error("Error loading CMSWO admin signature:", err);
      }
    };

    loadCmswoSig();
  }, []);

  const handleDownloadPDF = async () => {
    const element = certRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = 210;
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`CSWMO_Certificate_${applicant.bin || "Applicant"}.pdf`);
  };

  // Helper to pick the day with ordinal suffix
  const dayWithSuffix = (day) => {
    const s = ["th", "st", "nd", "rd"],
      v = day % 100;
    return day + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const issueDate = applicant.issueDate
    ? new Date(applicant.issueDate)
    : new Date();
  const day = dayWithSuffix(issueDate.getDate());
  const month = issueDate.toLocaleString("en-US", { month: "long" });
  const year = issueDate.getFullYear();

  return (
    <Box sx={{ p: 3 }}>
      {/* Printable area */}
      <Box
        ref={certRef}
        sx={{
          position: "relative",
          width: "210mm",
          height: "297mm",
          backgroundImage: `url(/CSWMOwatermark.png)`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "90%",
          fontFamily: "'Times New Roman', Times, serif",
          color: "#000",
          overflow: "hidden",
          pageBreakAfter: "always",
        }}
      >
        {/* Left logo */}
        <Box
          component="img"
          src="/spclogo.png"
          alt="left logo"
          sx={{
            position: "absolute",
            top: "15mm",
            left: "20mm",
            width: "28mm",
            height: "auto",
            opacity: 0.85,
            zIndex: 1,
          }}
        />

        {/* Header */}
        <Box textAlign="center" pt={8}>
          <Typography variant="h6" fontWeight="bold">
            Republic of the Philippines
          </Typography>
          <Typography variant="h5" fontWeight="bold">
            City Solid Waste Management Office
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            San Pablo City
          </Typography>
        </Box>

        {/* Title */}
        <Box textAlign="center" mt={4} mb={3}>
          <Typography variant="h5">This</Typography>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ textTransform: "uppercase", letterSpacing: 2 }}
          >
            Certificate of Completion
          </Typography>
        </Box>

        {/* Body */}
        <Box px={10} textAlign="center">
          <Typography variant="h6" gutterBottom>
            Is hereby given to
          </Typography>

          {/* Name line */}
          <Box
            sx={{
              borderBottom: "2px solid #000",
              width: "100%",
              mx: "auto",
              py: 1,
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ letterSpacing: 1.5 }}
            >
              {applicant.firstName} {applicant.middleName} {applicant.lastName}
            </Typography>
          </Box>

          <Typography variant="body1" mt={3} lineHeight={1.8}>
            for having successfully completed the{" "}
            <strong>Seminar on Solid Waste Management</strong>, conducted as
            part of the requirements for securing a Business Permit, in
            accordance with the provisions of Republic Act No. 9003 (Ecological
            Solid Waste Management Act of 2000) and City Ordinance No. 2006-27
            of San Pablo City.
          </Typography>
        </Box>

        {/* Date */}
        <Box textAlign="center" mt={6}>
          <Typography variant="body1">
            Given this{" "}
            <strong>
              {day} day of {month}, {year}
            </strong>{" "}
            in the City of San Pablo.
          </Typography>
        </Box>

        {/* Signatures */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: 12,
            mt: 8,
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Left signatory – dynamically loaded */}
          <Box textAlign="center">
            {cmswoSignatorySig && (
              <Box
                component="img"
                src={cmswoSignatorySig}
                alt="signature"
                sx={{ width: "90px", mb: -1, mt: "13px" }}
              />
            )}
            <Typography variant="body1" fontWeight="bold">
              {cmswoSignatoryName}
            </Typography>
            <Typography variant="caption">
              Public Services Officer IV
            </Typography>
          </Box>

          {/* Right signatory – static */}
          <Box textAlign="center">
            <Box
              component="img"
              src="/samplesig.png"
              alt="signature"
              sx={{ width: "90px", mb: -1 }}
            />
            <Typography variant="body1" fontWeight="bold">
              HON. ARACADIO B. GAPANGADA JR, MNSA
            </Typography>
            <Typography variant="caption">
              City Mayor of San Pablo City
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CmswoCertExport;
