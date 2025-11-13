import React, { useRef } from "react";
import { Button } from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Ensure these images are in: public/spclogo.png and public/esignature.png
const spcLogo = "/spclogo.png";
const eSignature = "/samplesig.png";

const CenroCertExport = ({ applicant }) => {
  const certificateRef = useRef();

  const handleGeneratePDF = async () => {
    const input = certificateRef.current;
    const canvas = await html2canvas(input, {
      scale: 2.5,
      useCORS: true,
      logging: false,
      width: 612,
      height: 1008,
    });
    const imgData = canvas.toDataURL("image/png");

    // Legal size: 8.5 x 14 inches = 612 x 1008 pt
    const pdf = new jsPDF("portrait", "pt", [612, 1008]);
    const imgWidth = 612;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(
      `CENRO_Certification_${applicant.businessName || "Applicant"}.pdf`
    );
  };

  return (
    <>
      <div
        ref={certificateRef}
        style={{
          width: "612px",
          padding: "30px 40px",
          fontFamily: "'Times New Roman', Times, serif",
          fontSize: "10pt",
          backgroundColor: "white",
          color: "black",
          lineHeight: "1.2",
          boxSizing: "border-box",
        }}
      >
        {/* SPC Logo */}
        <div style={{ textAlign: "center", marginBottom: "5px" }}>
          <img
            src={spcLogo}
            alt="SPC Logo"
            style={{ width: "60px", height: "auto" }}
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <h2
            style={{
              margin: "0 0 2px 0",
              fontSize: "12pt",
              fontWeight: "bold",
            }}
          >
            Republic of the Philippines
          </h2>
          <h3
            style={{
              margin: "0 0 2px 0",
              fontSize: "11pt",
              fontWeight: "bold",
            }}
          >
            CITY ENVIRONMENT AND NATURAL RESOURCES OFFICE
          </h3>
          <p style={{ margin: "0 0 8px 0", fontSize: "9pt" }}>
            4/F New 8th Storey Building, Capitol Complex, San Pablo City
            <br />
            Tel. No. (049) 562-2822
          </p>
          <h1
            style={{
              margin: "10px 0 15px 0",
              fontSize: "14pt",
              fontWeight: "bold",
              textTransform: "uppercase",
              borderBottom: "2px solid black",
              display: "inline-block",
              paddingBottom: "4px",
              letterSpacing: "2px",
            }}
          >
            C E R T I F I C A T I O N
          </h1>
        </div>

        {/* Body */}
        <div style={{ textAlign: "justify", marginBottom: "10px" }}>
          <p style={{ marginBottom: "8px", fontSize: "10pt" }}>
            This is to certify that the establishment{" "}
            <strong>
              <u>{applicant.businessName || "_______________________"}</u>
            </strong>{" "}
            owned by{" "}
            <strong>
              <u>
                {applicant.lastName} {applicant.firstName}{" "}
                {applicant.middleName}
              </u>
            </strong>{" "}
            situated at{" "}
            <strong>
              <u>
                {applicant.addressLine1} {applicant.barangay}
              </u>
            </strong>{" "}
            San Pablo City, do hereby pledge to comply with the following, in
            consideration for the issuance/renewal of a business permit:
          </p>

          <p
            style={{
              fontWeight: "bold",
              margin: "10px 0 6px 0",
              fontSize: "10pt",
            }}
          >
            THAT SAID ESTABLISHMENT SHALL:
          </p>

          {/* Checkboxes */}
          <div style={{ marginBottom: "12px" }}>
            {[
              {
                letter: "A",
                text: "Abide by the provisions of existing National Environment Laws, the New Building code of the Philippines, Pertinent Local Ordinances;",
              },
              {
                letter: "B",
                text: "Take such necessary measures for the avoidance of noise, dust and other Forms of pollution during site development/construction and actual Operation;",
              },
              {
                letter: "C",
                text: "Make sure that proper collection, segregation, handling and disposal of Waste shall be effected;",
              },
              {
                letter: "D",
                text: "Duli certified Barangay Clearance (when required)",
              },
              {
                letter: "E",
                text: "Appoint a duly accredited POLLUTION CONTROL OFFICER.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: "4px",
                  display: "flex",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    fontFamily: "Arial",
                    fontSize: "12pt",
                    marginRight: "6px",
                    marginTop: "2px",
                  }}
                >
                  Checkmark
                </span>
                <span style={{ fontSize: "10pt" }}>
                  <strong>{item.letter}.</strong> {item.text}
                </span>
              </div>
            ))}
          </div>

          {/* Numbered List */}
          <ol
            style={{
              margin: "8px 0 12px 0",
              paddingLeft: "18px",
              fontSize: "9.5pt",
            }}
          >
            <li style={{ marginBottom: "4px" }}>
              That the business establishment shall not violate the provisions
              of the San Pablo City Land Use and Zoning Ordinance.
            </li>
            <li style={{ marginBottom: "4px" }}>
              That any authorized City Environment and Natural Resources
              Personnel can conduct an on-the-spot inspection and monitoring
              without prior notice from the proponent.
            </li>
            <li style={{ marginBottom: "4px" }}>
              That all necessary permits/certifications (ECC’s CNC’s, Discharge
              Permits, NWRB, CWR) from other government agencies shall be
              secured and submitted to this office within 45 days after the
              issuance of this certification. Failure to do so shall be a ground
              for revocation of the Business Permit.
            </li>
            <li style={{ marginBottom: "4px" }}>
              That this certification shall be exhibited together with the
              Mayor’s Business Permit.
            </li>
          </ol>

          <p style={{ margin: "8px 0 12px 0", fontSize: "10pt" }}>
            This certification is valid up to <strong>December 31, 2025</strong>{" "}
            and is issued as a condition precedent to the issuance of
            Business/Mayor’s Permit. Non-compliance with any of the above
            stipulations will be sufficient cause for suspension or cancellation
            of this certification.
          </p>

          <p style={{ margin: "8px 0", fontSize: "10pt" }}>
            Given this <u>{new Date().getDate()}</u> day of{" "}
            <u>{new Date().toLocaleString("default", { month: "long" })}</u>,{" "}
            {new Date().getFullYear()}, in the City of San Pablo.
          </p>
        </div>

        {/* CONFORME + APPROVED BY (Side by Side) */}
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "40px",
          }}
        >
          {/* CONFORME */}
          <div style={{ width: "45%", textAlign: "center" }}>
            <p
              style={{
                marginBottom: "4px",
                fontWeight: "bold",
                fontSize: "10pt",
              }}
            >
              CONFORME:
            </p>
            <p
              style={{
                borderTop: "1px solid black",
                paddingTop: "4px",
                marginBottom: "4px",
              }}
            >
              ________________________________
            </p>
            <p style={{ fontSize: "9pt", marginBottom: "6px" }}>
              Proprietor/Authorized Representative
              <br />
              (Signature over Printed Name)
            </p>
            <p style={{ fontSize: "9pt" }}>
              <strong>CONTACT NO.</strong> ___________________________
            </p>
          </div>

          {/* APPROVED BY */}
          <div style={{ width: "45%", textAlign: "center" }}>
            <p style={{ marginBottom: "2px", fontSize: "9pt" }}>
              <strong>APPROVED BY:</strong>
            </p>
            <div style={{ marginBottom: "2px" }}>
              <img
                src={eSignature}
                alt="e-Signature"
                style={{ width: "140px", height: "auto" }}
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>
            <p style={{ margin: "0", fontWeight: "bold", fontSize: "11pt" }}>
              DENNIS A. RAMOS, MPA
            </p>
            <p style={{ margin: "0", fontSize: "9pt" }}>
              City Environment and Natural Resources Officer
            </p>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button
          variant="contained"
          color="success"
          onClick={handleGeneratePDF}
          sx={{ width: "250px", padding: "10px" }}
        >
          Download Certification
        </Button>
      </div>
    </>
  );
};

export default CenroCertExport;
