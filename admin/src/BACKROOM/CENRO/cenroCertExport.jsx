import React, { useRef, useState, useEffect } from "react";
import { Button } from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";

const spcLogo = "/spclogo.png";
const fallbackSignature = "/samplesig.png"; // default signature

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
      text: "Duli certified Barangay Clearance (when required)",
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
          fontFamily: "Arial, Helvetica, sans-serif",  // Changed to Arial globally
          fontSize: "11pt",                           // Slightly larger for better readability in Arial
          backgroundColor: "white",
          color: "black",
          lineHeight: "1.4",
          boxSizing: "border-box",
          width: "612px",
          margin: "0 auto",
          padding: "40px 50px",
        }}
      >
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <img
            src={spcLogo}
            alt="SPC Logo"
            style={{ width: "70px", height: "auto" }}
          />
        </div>
        <div style={{ textAlign: "center", marginBottom: "15px" }}>
          <h2
            style={{
              margin: "0 0 4px 0",
              fontSize: "14pt",
              fontWeight: "bold",
            }}
          >
            Republic of the Philippines
          </h2>
          <h3
            style={{
              margin: "0 0 4px 0",
              fontSize: "13pt",
              fontWeight: "bold",
            }}
          >
            CITY ENVIRONMENT AND NATURAL RESOURCES OFFICE
          </h3>
          <p style={{ margin: "0 0 10px 0", fontSize: "10pt" }}>
            4/F New 8th Storey Building, Capitol Complex, San Pablo City
            <br />
            Tel. No. (049) 562-2822
          </p>
          <h1
            style={{
              margin: "15px 0 20px 0",
              fontSize: "18pt",
              fontWeight: "bold",
              textTransform: "uppercase",
              borderBottom: "3px solid black",
              display: "inline-block",
              paddingBottom: "6px",
              letterSpacing: "3px",
            }}
          >
            CERTIFICATION
          </h1>
        </div>

        {/* BODY */}
        <div style={{ textAlign: "justify", marginBottom: "15px" }}>
          <p style={{ marginBottom: "12px", fontSize: "11pt" }}>
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
              margin: "15px 0 10px 0",
              fontSize: "12pt",
            }}
          >
            THAT SAID ESTABLISHMENT SHALL:
          </p>

          {/* CHECKBOX LIST - Enhanced visual */}
          <div style={{ marginBottom: "15px" }}>
            {checklistItems.map((item) => (
              <div
                key={item.key}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  marginBottom: "10px",
                  gap: "10px",
                }}
              >
                <input
                  type="checkbox"
                  checked={checkboxes[item.key]}
                  onChange={() => handleCheckboxChange(item.key)}
                  style={{
                    width: "18px",
                    height: "18px",
                    margin: "2px 0 0 0",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                  data-key={item.key}
                />
                <span style={{ fontSize: "11pt", lineHeight: "1.5" }}>
                  <strong>{item.key}.</strong> {item.text}
                </span>
              </div>
            ))}
          </div>

          {/* NUMBERED LIST */}
          <ol
            style={{
              margin: "12px 0 15px 20px",
              paddingLeft: "5px",
              fontSize: "11pt",
              lineHeight: "1.5",
            }}
          >
            <li style={{ marginBottom: "8px" }}>
              That the business establishment shall not violate the provisions
              of the San Pablo City Land Use and Zoning Ordinance.
            </li>
            <li style={{ marginBottom: "8px" }}>
              That any authorized City Environment and Natural Resources
              Personnel can conduct an on-the-spot inspection...
            </li>
            <li style={{ marginBottom: "8px" }}>
              That all necessary permits/certifications (ECC’s, CNC’s, Discharge
              Permits, NWRB, CWR) from other government agencies...
            </li>
            <li style={{ marginBottom: "8px" }}>
              That this certification shall be exhibited together with the
              Mayor’s Business Permit.
            </li>
          </ol>

          <p style={{ margin: "12px 0 15px 0", fontSize: "11pt" }}>
            This certification is valid up to{" "}
            <strong>December 31, {year}</strong> unless sooner revoked for cause.
          </p>

          <p style={{ margin: "12px 0", fontSize: "11pt" }}>
            Given this <u>{day}</u> day of <u>{monthName}</u>, {year}, in the City of San Pablo.
          </p>
        </div>

        {/* SIGNATURE SECTION */}
        <div
          style={{
            marginTop: "30px",
            display: "flex",
            justifyContent: "space-between",
            gap: "40px",
          }}
        >
          <div style={{ width: "45%", textAlign: "center" }}>
            <p
              style={{
                marginBottom: "8px",
                fontWeight: "bold",
                fontSize: "12pt",
              }}
            >
              CONFORME:
            </p>
            <div style={{ height: "60px", marginBottom: "8px" }} />
            <p
              style={{
                borderTop: "1px solid black",
                paddingTop: "8px",
                margin: "0 0 4px 0",
              }}
            >
              ________________________________________
            </p>
            <p style={{ fontSize: "10pt", margin: "4px 0" }}>
              Proprietor/Authorized Representative
              <br />
              (Signature over Printed Name)
            </p>
            <p style={{ fontSize: "10pt", marginTop: "10px" }}>
              <strong>CONTACT NO.</strong> ___________________________
            </p>
          </div>

          <div style={{ width: "45%", textAlign: "center" }}>
            <p style={{ marginBottom: "4px", fontSize: "11pt", fontWeight: "bold" }}>
              APPROVED BY:
            </p>
            <div style={{ margin: "10px 0" }}>
              {signatory && (
                <img
                  src={signatory}
                  alt="e-Signature"
                  style={{ width: "160px", height: "auto" }}
                />
              )}
            </div>
            <p style={{ margin: "8px 0 0 0", fontWeight: "bold", fontSize: "12pt" }}>
              DENNIS A. RAMOS, MPA
            </p>
            <p style={{ margin: "4px 0 0 0", fontSize: "11pt" }}>
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