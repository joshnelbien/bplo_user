import React, { useRef, useState, useEffect } from "react";
import { Button } from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";

const spcLogo = "/spclogo.png";
const fallbackSignature = "/samplesig.png"; // default signature

const API = import.meta.env.VITE_API_BASE; // your API base

const CenroCertExport = ({ applicant }) => {
  const certificateRef = useRef();

  // State for checkboxes
  const [checkboxes, setCheckboxes] = useState({
    A: false,
    B: false,
    C: false,
    D: false,
    E: false,
  });

  const handleCheckboxChange = (key) => {
    setCheckboxes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // State for signatory
  const [signatory, setSignatory] = useState(fallbackSignature);

  // Fetch admin/signatory from API
  useEffect(() => {
    const loadSignatory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${API}/adminAccounts/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.signatories) {
          setSignatory(`data:image/png;base64,${res.data.signatories}`);
        }
      } catch (err) {
        console.error("Error fetching signatory:", err);
        setSignatory(fallbackSignature);
      }
    };

    loadSignatory();
  }, []);

  // Generate PDF
  const handleGeneratePDF = async () => {
    const input = certificateRef.current;

    const canvas = await html2canvas(input, {
      scale: 2.5,
      useCORS: true,
      logging: false,
      width: 612,
      height: 1008,
      onclone: (clonedDoc) => {
        clonedDoc.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
          const key = cb.dataset.key;
          if (checkboxes[key]) cb.checked = true;
        });
      },
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("portrait", "pt", [612, 1008]);
    const imgWidth = 612;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(
      `CENRO_Certification_${applicant.businessName || "Applicant"}.pdf`
    );
  };

  const checklistItems = [
    {
      key: "A",
      text: "Abide by the provisions of existing National Environment Laws, the New Building code of the Philippines, Pertinent Local Ordinances;",
    },
    {
      key: "B",
      text: "Take such necessary measures for the avoidance of noise, dust and other Forms of pollution during site development/construction and actual Operation;",
    },
    {
      key: "C",
      text: "Make sure that proper collection, segregation, handling and disposal of Waste shall be effected;",
    },
    {
      key: "D",
      text: "Duli certified Barangay Clearance (when required)",
    },
    {
      key: "E",
      text: "Appoint a duly accredited POLLUTION CONTROL OFFICER.",
    },
  ];

  return (
    <>
      <div
        ref={certificateRef}
        style={{
          fontFamily: "'Times New Roman', Times, serif",
          fontSize: "10pt",
          backgroundColor: "white",
          color: "black",
          lineHeight: "1.2",
          boxSizing: "border-box",
          width: "612px",
          margin: "0 auto",
          padding: "30px 40px",
        }}
      >
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "5px" }}>
          <img
            src={spcLogo}
            alt="SPC Logo"
            style={{ width: "60px", height: "auto" }}
          />
        </div>
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

        {/* BODY */}
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
            San Pablo City, do hereby pledge to comply with the following...
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

          {/* CHECKBOX LIST */}
          <div style={{ marginBottom: "12px" }}>
            {checklistItems.map((item) => (
              <div
                key={item.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "6px",
                  gap: "6px",
                }}
              >
                <input
                  type="checkbox"
                  checked={checkboxes[item.key]}
                  onChange={() => handleCheckboxChange(item.key)}
                  style={{
                    width: "14px",
                    height: "14px",
                    margin: 0,
                    cursor: "pointer",
                  }}
                  data-key={item.key}
                />
                <span style={{ fontSize: "10pt", lineHeight: "1.2" }}>
                  <strong>{item.key}.</strong> {item.text}
                </span>
              </div>
            ))}
          </div>

          {/* NUMBERED LIST */}
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
              Personnel can conduct an on-the-spot inspection...
            </li>
            <li style={{ marginBottom: "4px" }}>
              That all necessary permits/certifications (ECC’s CNC’s, Discharge
              Permits, NWRB, CWR) from other government agencies...
            </li>
            <li style={{ marginBottom: "4px" }}>
              That this certification shall be exhibited together with the
              Mayor’s Business Permit.
            </li>
          </ol>

          <p style={{ margin: "8px 0 12px 0", fontSize: "10pt" }}>
            This certification is valid up to <strong>December 31, 2025</strong>
            ...
          </p>

          <p style={{ margin: "8px 0", fontSize: "10pt" }}>
            Given this <u>{new Date().getDate()}</u> day of{" "}
            <u>{new Date().toLocaleString("default", { month: "long" })}</u>,{" "}
            {new Date().getFullYear()}, in the City of San Pablo.
          </p>
        </div>

        {/* SIGNATURE */}
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "40px",
          }}
        >
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

          <div style={{ width: "45%", textAlign: "center" }}>
            <p style={{ marginBottom: "2px", fontSize: "9pt" }}>
              <strong>APPROVED BY:</strong>
            </p>
            <div style={{ marginBottom: "2px" }}>
              {signatory && (
                <img
                  src={signatory}
                  alt="e-Signature"
                  style={{ width: "140px", height: "auto" }}
                />
              )}
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

      {/* DOWNLOAD BUTTON */}
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
