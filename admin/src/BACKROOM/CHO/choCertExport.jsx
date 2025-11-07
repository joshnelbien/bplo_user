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
  const issueDate = new Date("2025-10-22");
  const expiryDate = new Date("2025-12-31");

  const isRenewal = applicant.isRenewal || false;

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
          fontFamily: '"Times New Roman", Times, serif',
          fontSize: "11pt",
          color: "#000",
          boxSizing: "border-box",
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
    

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2 }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "15px", marginRight: "170px" }}>
            <img
              src="/spclogo.png"
              alt="San Pablo City Logo"
              style={{ width: "75px", height: "auto", marginLeft: "120px" }}
            />
            <div style={{ textAlign: "center", flex: 1 }}>
              <p style={{ margin: 0, fontWeight: "bold", fontSize: "13pt" }}>
                Republic of the Philippines
              </p>
              <p style={{ margin: "3px 0", fontWeight: "bold", fontSize: "13pt" }}>
                Office of the City Health Officer
              </p>
              <p style={{ margin: 0, fontWeight: "bold", fontSize: "13pt" }}>
                San Pablo City
              </p>
            </div>
          </div>

          {/* Title */}
          <div style={{ textAlign: "center", margin: "25px 0 15px" }}>
            <h1 style={{ margin: 0, fontSize: "20pt", fontWeight: "bold" }}>
              SANITARY PERMIT
            </h1>
          </div>

          {/* Permit Number & Type */}
          <div style={{ textAlign: "center", marginBottom: "15px", fontSize: "11pt" }}>
            <strong>No. 8461-2025</strong>&nbsp;&nbsp;&nbsp;
            <span>
              ☑ New &nbsp;&nbsp; ☐ Renewal
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
              <p style={{ margin: "0 0 8px", fontWeight: "bold", borderBottom: "1px solid #000", paddingBottom: "3px", width: "380px" }}>
                JUAN DELA CRUZ
              </p>
              <p style={{ margin: "0 0 15px", fontStyle: "italic", fontSize: "10pt" }}>
                (Registered Name)
              </p>

              <p style={{ margin: "0 0 8px", fontWeight: "bold", borderBottom: "1px solid #000", paddingBottom: "3px", width: "380px" }}>
                
              </p>
              <p style={{ margin: "0 0 15px", fontStyle: "italic", fontSize: "10pt" }}>
                (Business Name)
              </p>

              <p style={{ margin: "0 0 8px", fontWeight: "bold", borderBottom: "1px solid #000", paddingBottom: "3px", width: "380px" }}>
                
              </p>
              <p style={{ margin: "0 0 20px", fontStyle: "italic", fontSize: "10pt" }}>
                (Type of Establishment)
              </p>

              <p style={{ margin: "0 0 8px", fontWeight: "bold" }}>
                <strong>Address:</strong>&nbsp;
                <span style={{ borderBottom: "1px solid #000", paddingBottom: "3px", display: "inline-block", width: "320px" }}>
                 
                </span>
              </p>
            </div>
          </div>

          {/* Dates */}
          <div style={{ display: "flex", justifyContent: "space-between", margin: "30px 0", fontSize: "11pt" }}>
            <div style={{ textAlign: "center", flex: 1 }}>
              <strong>Date Issued:</strong>
              <div style={{ borderBottom: "1px solid #000", width: "180px", margin: "5px auto 0", paddingBottom: "3px" }}>
                {formatDate(issueDate)}
              </div>
            </div>
            <div style={{ textAlign: "center", flex: 1 }}>
              <strong>Date of Expiration:</strong>
              <div style={{ borderBottom: "1px solid #000", width: "180px", margin: "5px auto 0", paddingBottom: "3px" }}>
                {formatDate(expiryDate)}
              </div>
            </div>
          </div>

          {/* Legal Note */}
          <p style={{ fontSize: "10pt", textAlign: "justify", margin: "25px 0", lineHeight: "1.5" }}>
            This permit is <strong>not transferable</strong> and will be <strong>revoked</strong> for violation of Sanitary Laws, Rules or Regulation of PD 522, PD 856 or pertinent City Ordinances.
          </p>

          {/* Signatures */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px", fontSize: "11pt" }}>
            <div style={{ width: "48%", textAlign: "center" }}>
              <p style={{ margin: "0 0 5px", fontWeight: "bold" }}>Recommending Approval:</p>
              <div style={{ height: "50px" }}></div>
              <div style={{ borderTop: "1px solid #000", paddingTop: "5px" }}>
                <strong>Sanitary Inspector</strong>
              </div>
            </div>

            <div style={{ width: "48%", textAlign: "center" }}>
              <p style={{ margin: "0 0 5px", fontWeight: "bold" }}>Approved:</p>
              <div style={{ height: "50px" }}></div>
              <div style={{ borderTop: "1px solid #000", paddingTop: "5px" }}>
                <strong>MERCYDINA AM. CAPONPON, MD. DPPS, MPH</strong>
              </div>
              <p style={{ margin: "5px 0 0", fontSize: "10pt" }}>City Health Officer</p>
            </div>
          </div>

          {/* BY: Authorized */}
          <div style={{ marginTop: "35px", textAlign: "right", fontSize: "11pt" }}>
            <p style={{ marginRight: 200, margin: 0, fontWeight: "bold" }}>BY:</p>
            <div style={{ height: "1px" }}></div>
            <div style={{ borderTop: "1px solid #000", width: "200px", marginLeft: "auto", paddingTop: "5px", textAlign: "center" }}>
              <strong>(Authorized Signatory)</strong>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: "40px", fontSize: "9pt", textAlign: "center" }}>
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