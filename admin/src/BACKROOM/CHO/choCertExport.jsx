// src/components/ChoCertExport.jsx
import React, { useRef, useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE;

const ChoCertExport = ({ applicant }) => {
  const certRef = useRef();

  // SIGNATURE STATES
  const [userSignatory, setUserSignatory] = useState(null);
  const [fallbackSig, setFallbackSig] = useState(null);

  // Convert fallback image to base64
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

  // LOAD SIGNATURES
  useEffect(() => {
    const loadAdminSig = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${API}/adminAccounts/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.signatories) {
          setUserSignatory(`data:image/png;base64,${res.data.signatories}`);
        }
      } catch (err) {
        console.error("Error loading admin signature:", err);
      }
    };

    const loadFallback = async () => {
      const img = await loadImageAsBase64("/samplesig.png");
      setFallbackSig(img);
    };

    loadAdminSig();
    loadFallback();
  }, []);

  const signatureToUse = userSignatory || fallbackSig;
  const cho = fallbackSig;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const today = new Date();
  const endOfYear = new Date(today.getFullYear(), 11, 31);

  const handleDownloadPDF = async () => {
    const element = certRef.current;
    const canvas = await html2canvas(element, { scale: 3, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`Sanitary_Permit_${applicant.bin || "Applicant"}.pdf`);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Printable Area */}
      <div
        ref={certRef}
        style={{
          position: "relative",
          width: "210mm",
          minHeight: "297mm",
          padding: "45px 55px",
          backgroundImage: "url(/choDocsBg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: "12pt",
          color: "#000",
          boxSizing: "border-box",
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        {/* Content */}
        <div style={{ position: "relative", zIndex: 2 }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "15px",
            }}
          >
            {/* Left side: Bagong Pilipinas logo */}
            <img
              src="/bagongpilipinas.png"
              alt="Bagong Pilipinas"
              style={{ 
                width: "75px", 
                height: "auto",
                marginLeft: "0" 
              }}
            />
            
            {/* Center text */}
            <div style={{ textAlign: "center", flex: 1 }}>
              <p style={{ margin: 0, fontWeight: "bold", fontSize: "13pt" }}>
                Republic of the Philippines
              </p>
              <p
                style={{
                  margin: "3px 0",
                  fontWeight: "bold",
                  fontSize: "13pt",
                }}
              >
                Office of the City Health Officer
              </p>
              <p style={{ margin: 0, fontWeight: "bold", fontSize: "13pt" }}>
                San Pablo City
              </p>
            </div>
            
            {/* Right side: SPC logo */}
            <img
              src="/spclogo.png"
              alt="San Pablo City Logo"
              style={{ 
                width: "75px", 
                height: "auto", 
                marginRight: "0" 
              }}
            />
          </div>

          {/* Title */}
          <div style={{ textAlign: "center", margin: "25px 0 15px" }}>
            <h1 style={{ margin: 0, fontSize: "20pt", fontWeight: "bold" }}>
              SANITARY PERMIT
            </h1>
          </div>

          {/* Permit Number & Type */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "15px",
              fontSize: "11pt",
            }}
          >
            <strong>No. 8461-2025</strong>&nbsp;&nbsp;&nbsp;
            <span>
              {applicant.application === "New"
                ? "☑ New   ☐ Renewal"
                : "☐ New   ☑ Renewal"}
            </span>
          </div>

          {/* To Operate */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <p style={{ margin: 0, fontWeight: "bold", fontSize: "12pt" }}>
              To operate
            </p>
          </div>

          {/* Issued To */}
          <div style={{ textAlign: "center", marginBottom: "25px" }}>
            <div style={{ display: "inline-block", textAlign: "center" }}>
              <p
                style={{
                  margin: "0 0 8px",
                  fontWeight: "bold",
                  borderBottom: "1px solid #000",
                  paddingBottom: "3px",
                  width: "380px",
                }}
              >
                {applicant.lastName}, {applicant.firstName}{" "}
                {applicant.middleName}
              </p>
              <p
                style={{
                  margin: "0 0 15px",
                  fontStyle: "italic",
                  fontSize: "10pt",
                }}
              >
                (Registered Name)
              </p>

              <p
                style={{
                  margin: "0 0 8px",
                  fontWeight: "bold",
                  borderBottom: "1px solid #000",
                  paddingBottom: "3px",
                  width: "380px",
                }}
              >
                {applicant.businessName}
              </p>
              <p
                style={{
                  margin: "0 0 15px",
                  fontStyle: "italic",
                  fontSize: "10pt",
                }}
              >
                (Business Name)
              </p>

              <p
                style={{
                  margin: "0 0 8px",
                  fontWeight: "bold",
                  borderBottom: "1px solid #000",
                  paddingBottom: "3px",
                  width: "380px",
                }}
              >
                {applicant.officeType}
              </p>
              <p
                style={{
                  margin: "0 0 20px",
                  fontStyle: "italic",
                  fontSize: "10pt",
                }}
              >
                (Type of Establishment)
              </p>

              <p style={{ margin: "0 0 8px", fontWeight: "bold" }}>
                <strong>Address:</strong>&nbsp;
                <span
                  style={{
                    borderBottom: "1px solid #000",
                    paddingBottom: "3px",
                    display: "inline-block",
                    width: "320px",
                  }}
                >
                  {applicant.addressLine1} {applicant.barangay}
                </span>
              </p>
            </div>
          </div>

          {/* Dates */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "30px 0",
              fontSize: "11pt",
            }}
          >
            <div style={{ textAlign: "center", flex: 1 }}>
              <strong>Date Issued:</strong>
              <div
                style={{
                  borderBottom: "1px solid #000",
                  width: "180px",
                  margin: "5px auto 0",
                  paddingBottom: "3px",
                }}
              >
                {formatDate(today)}
              </div>
            </div>
            <div style={{ textAlign: "center", flex: 1 }}>
              <strong>Date of Expiration:</strong>
              <div
                style={{
                  borderBottom: "1px solid #000",
                  width: "180px",
                  margin: "5px auto 0",
                  paddingBottom: "3px",
                }}
              >
                {formatDate(endOfYear)}
              </div>
            </div>
          </div>

          {/* Legal Note */}
          <p
            style={{
              fontSize: "10pt",
              textAlign: "justify",
              margin: "25px 0",
              lineHeight: "1.5",
            }}
          >
            This permit is <strong>not transferable</strong> and will be{" "}
            <strong>revoked</strong> for violation of Sanitary Laws, Rules or
            Regulation of PD 522, PD 856 or pertinent City Ordinances.
          </p>

          {/* Signatures */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "50px",
              fontSize: "11pt",
            }}
          >
            <div style={{ width: "48%", textAlign: "center" }}>
              <p style={{ margin: "0 0 5px", fontWeight: "bold" }}>
                Recommending Approval:
              </p>
              <div style={{ height: "50px" }}></div>
              <div style={{ borderTop: "1px solid #000", paddingTop: "5px" }}>
                <strong>Sanitary Inspector</strong>
              </div>
            </div>

            <div
              style={{
                width: "48%",
                textAlign: "center",
                position: "relative",
                height: "120px",
              }}
            >
              <p style={{ margin: "0 0 5px", fontWeight: "bold" }}>Approved:</p>

              {/* SIGNATURE ABOVE NAME */}
              {cho && (
                <img
                  src={cho}
                  alt="CHO Signature"
                  style={{
                    position: "absolute", // absolute positioning
                    top: 0, // adjust vertical position
                    left: "50%", // center horizontally
                    transform: "translateX(-50%)", // center correctly
                    width: "150px",
                    height: "auto",
                  }}
                />
              )}

              <div
                style={{
                  position: "absolute",
                  bottom: 0, // pin to the bottom of the container
                  left: 0,
                  right: 0,
                  borderTop: "1px solid #000",
                  paddingTop: "5px",
                }}
              >
                <strong>MERCYDINA AM. CAPONPON, MD. DPPS, MPH</strong>
                <p style={{ margin: "5px 0 0", fontSize: "10pt" }}>
                  City Health Officer
                </p>
              </div>
            </div>
          </div>

          {/* BY: Authorized (WITH SIGNATURE) */}
          <div
            style={{
              marginTop: "15px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "200px",
                gap: "5px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  marginBottom: 10,
                  marginTop: 15,
                  fontWeight: "bold",
                }}
              >
                BY:
              </p>

              {/* SIGNATURE IMAGE */}
              {signatureToUse && (
                <img
                  src={signatureToUse}
                  alt="Authorized Signatory"
                  style={{
                    width: "150px",
                    height: "auto",
                    marginBottom: "-5px",
                  }}
                />
              )}

              <div
                style={{
                  borderTop: "1px solid #000",
                  width: "100%",
                  paddingTop: "5px",
                  textAlign: "center",
                }}
              >
                <strong>(Authorized Signatory)</strong>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{ marginTop: "40px", fontSize: "9pt", textAlign: "center" }}
          >
            <p style={{ margin: "5px 0", fontWeight: "bold" }}>
              This permit should be displayed in a conspicuous place.
            </p>
            <p style={{ margin: "5px 0", fontWeight: "bold" }}>
              Not valid if with erasures/alteration
            </p>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default ChoCertExport;