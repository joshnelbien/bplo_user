import React, { useRef, useState, useEffect } from "react";
import { Button } from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";

const spcLogo = "/spclogo.png";
const bagongPilipinasLogo = "/bagongpilipinas.png";
const fallbackSignature = "/samplesig.png";

const API = import.meta.env.VITE_API_BASE;

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
      text: "Duly certified Barangay Clearance (when required)",
    },
    {
      key: "E",
      text: "Appoint a duly accredited POLLUTION CONTROL OFFICER.",
    },
  ];

  // Current date formatted
  const today = new Date();
  const day = today.getDate();
  const monthName = today.toLocaleString("default", { month: "long" });
  const year = today.getFullYear();

  return (
    <>
      <div
        ref={certificateRef}
        style={{
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: "10pt", // Reduced from 11pt
          backgroundColor: "white",
          color: "black",
          lineHeight: "1.35", // Slightly tighter
          boxSizing: "border-box",
          width: "612px",
          margin: "0 auto",
          padding: "35px 45px", // Reduced padding
        }}
      >
        {/* HEADER with logos */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          {/* Left: Bagong Pilipinas */}
          <img
            src={bagongPilipinasLogo}
            alt="Bagong Pilipinas"
            style={{ width: "70px", height: "auto" }}
          />

          {/* Center text */}
          <div style={{ textAlign: "center", flex: 1 }}>
            <h2
              style={{
                margin: "0 0 4px 0",
                fontSize: "13pt",
                fontWeight: "bold",
              }}
            >
              Republic of the Philippines
            </h2>
            <h3
              style={{
                margin: "0 0 4px 0",
                fontSize: "12pt",
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
          </div>

          {/* Right: SPC Logo */}
          <img
            src={spcLogo}
            alt="SPC Logo"
            style={{ width: "70px", height: "auto" }}
          />
        </div>

        {/* CERTIFICATION TITLE */}
        <div style={{ textAlign: "center", marginBottom: "18px" }}>
          <h1
            style={{
              margin: "0 0 10px 0",
              fontSize: "16pt", // Slightly smaller
              fontWeight: "bold",
              textTransform: "uppercase",
              borderBottom: "3px solid black",
              display: "inline-block",
              paddingBottom: "4px",
              letterSpacing: "1.5px", // Reduced letter spacing
            }}
          >
            CERTIFICATION
          </h1>
        </div>

        {/* BODY */}
        <div style={{ textAlign: "justify", marginBottom: "12px" }}>
          <p style={{ marginBottom: "10px" }}>
            This is to certify that the establishment{" "}
            <strong>
              <u>{applicant.businessName || "_______________________"}</u>
            </strong>{" "}
            owned by{" "}
            <strong>
              <u>
                {applicant.lastName}, {applicant.firstName}{" "}
                {applicant.middleName || ""}
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
              margin: "12px 0 8px 0",
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
                  alignItems: "flex-start",
                  marginBottom: "8px",
                  gap: "8px",
                }}
              >
                <input
                  type="checkbox"
                  checked={checkboxes[item.key]}
                  onChange={() => handleCheckboxChange(item.key)}
                  style={{
                    width: "16px",
                    height: "16px",
                    margin: "2px 0 0 0",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                  data-key={item.key}
                />
                <span style={{ lineHeight: "1.4" }}>
                  <strong>{item.key}.</strong> {item.text}
                </span>
              </div>
            ))}
          </div>

          {/* NUMBERED LIST */}
          <ol
            style={{
              margin: "10px 0 12px 20px",
              paddingLeft: "5px",
              lineHeight: "1.4",
            }}
          >
            <li style={{ marginBottom: "6px" }}>
              That the business establishment shall not violate the provisions
              of the San Pablo City Land Use and Zoning Ordinance.
            </li>
            <li style={{ marginBottom: "6px" }}>
              That any authorized City Environment and Natural Resources
              Personnel can conduct an on-the-spot inspection...
            </li>
            <li style={{ marginBottom: "6px" }}>
              That all necessary permits/certifications (ECC’s, CNC’s, Discharge
              Permits, NWRB, CWR) from other government agencies...
            </li>
            <li style={{ marginBottom: "6px" }}>
              That this certification shall be exhibited together with the
              Mayor’s Business Permit.
            </li>
          </ol>

          <p style={{ margin: "10px 0 8px 0" }}>
            This certification is valid up to{" "}
            <strong>December 31, {year}</strong> unless sooner revoked for cause.
          </p>

          <p style={{ margin: "10px 0" }}>
            Given this <u>{day}</u> day of <u>{monthName}</u>, {year}, in the City of San Pablo.
          </p>
        </div>

        {/* SIGNATURE SECTION */}
        <div
          style={{
            marginTop: "25px",
            display: "flex",
            justifyContent: "space-between",
            gap: "30px",
          }}
        >
          <div style={{ width: "48%", textAlign: "center" }}>
            <p
              style={{
                marginBottom: "6px",
                fontWeight: "bold",
              }}
            >
              CONFORME:
            </p>
            <div style={{ height: "50px", marginBottom: "6px" }} />
            <p
              style={{
                borderTop: "1px solid black",
                paddingTop: "6px",
                margin: "0 0 4px 0",
              }}
            >
              ________________________________________
            </p>
            <p style={{ fontSize: "9pt", margin: "4px 0" }}>
              Proprietor/Authorized Representative
              <br />
              (Signature over Printed Name)
            </p>
            <p style={{ fontSize: "9pt", marginTop: "8px" }}>
              <strong>CONTACT NO.</strong> ___________________________
            </p>
          </div>

          <div style={{ width: "48%", textAlign: "center" }}>
            <p style={{ marginBottom: "4px", fontWeight: "bold" }}>
              APPROVED BY:
            </p>
            <div style={{ margin: "8px 0" }}>
              {signatory && (
                <img
                  src={signatory}
                  alt="e-Signature"
                  style={{ width: "140px", height: "auto" }}
                />
              )}
            </div>
            <p style={{ margin: "6px 0 0 0", fontWeight: "bold" }}>
              DENNIS A. RAMOS, MPA
            </p>
            <p style={{ margin: "3px 0 0 0", fontSize: "9pt" }}>
              City Environment and Natural Resources Officer
            </p>
          </div>
        </div>
      </div>

      {/* DOWNLOAD BUTTON */}
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <Button
          variant="contained"
          color="success"
          onClick={handleGeneratePDF}
          sx={{ width: "280px", padding: "12px", fontSize: "16px" }}
        >
          Download Certification
        </Button>
      </div>
    </>
  );
};

export default CenroCertExport;