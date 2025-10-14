import React from "react";
import { Button } from "@mui/material";
import { saveAs } from "file-saver";
import axios from "axios";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Image,
} from "@react-pdf/renderer";

const API = import.meta.env.VITE_API_BASE;

const handleDone = async (id) => {
  try {
    const res = await axios.put(`${API}/newApplication/appDone/${id}`);
    console.log("✅ Permit updated:", res.data);
    alert("Permit marked as released!");
  } catch (error) {
    console.error("❌ Error updating permit:", error);
    alert("Failed to update permit");
  }
};

// Styles to mimic Word layout with adjustments
const styles = StyleSheet.create({
  page: { padding: 20, fontFamily: "Helvetica" },
  frame: { border: "10pt solid #1D5A2E", padding: 10 },
  darkGreen: { backgroundColor: "#1D5A2E" },
  whiteText: { color: "white" },
  bold: { fontWeight: "bold" },
  center: { textAlign: "center" },
  right: { textAlign: "right" },
  row: { flexDirection: "row" },
  col25: { width: "25%" },
  col50: { width: "50%" },
  col70: { width: "70%", border: "1pt solid black", padding: 5 },
  col30: { width: "30%", border: "1pt solid black", padding: 5 },
  banner: { backgroundColor: "#1D5A2E", padding: 10, marginVertical: 10 },
  bannerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  spacer: { height: 10 },
  signatureCol: { width: "50%", alignItems: "center", marginTop: 20 },
  footerGreenBar: { backgroundColor: "#1D5A2E", padding: 10, marginTop: 20 },
  introText: { fontSize: 10, marginBottom: 10 },
  infoTableRow: { flexDirection: "row", border: "1pt solid black" },
  infoTableHeader: {
    fontWeight: "bold",
    fontSize: 10,
    padding: 5,
    border: "1pt solid black",
    backgroundColor: "#F5F5F5",
  },
  infoTableCell: { padding: 5, border: "1pt solid black", fontSize: 10 },
  collectionHeader: {
    fontWeight: "bold",
    fontSize: 10,
    padding: 5,
    border: "1pt solid black",
    backgroundColor: "#F5F5F5",
  },
  collectionCell: { padding: 5, border: "1pt solid black", fontSize: 10 },
});

async function loadImageAsBase64(imagePath) {
  try {
    const response = await fetch(imagePath);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error loading image:", error);
    return null;
  }
}

function MayorsPermit({ applicant, collections, total, otherChargesTotal }) {
  const formatPeso = (value) =>
    value > 0
      ? `₱ ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
      : "";

  const exportPdf = async () => {
    const validCollections = collections.filter(
      (item) => item.amount && Number(item.amount) > 0
    );

    // Load images (place in /public folder)
    const bagongPilipinasSrc = await loadImageAsBase64("/bagongp.png");
    const spcLogoSrc = await loadImageAsBase64("/spclogo.png");
    const eSignatureSrc = await loadImageAsBase64("/samplesig.png");
    const oriaSignatureSrc = await loadImageAsBase64("/samplesig.png");

    const fullName = `${applicant.firstName || ""} ${
      applicant.middleName || ""
    } ${applicant.lastName || ""}`;
    const businessAddress = `${applicant.barangay || ""}, ${
      applicant.cityOrMunicipality || ""
    }`; // Adjust fields as needed

    const PdfDocument = () => (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.frame}>
            {/* 1. Top Header Row */}
            <View style={styles.row}>
              <View style={styles.col25}>
                <Image
                  src={bagongPilipinasSrc}
                  style={{ width: 90, height: 90 }}
                />
              </View>
              <View style={[styles.col50, { alignItems: "center" }]}>
                <Image src={spcLogoSrc} style={{ width: 70, height: 70 }} />
                <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                  OFFICE OF THE MAYOR
                </Text>
                <Text style={{ fontSize: 11 }}>
                  BUSINESS PERMIT AND LICENSING DIVISION
                </Text>
              </View>
              <View style={[styles.col25, { alignItems: "flex-end" }]}>
                <Text style={{ fontSize: 24, fontWeight: "bold" }}>2025</Text>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  {applicant?.PermitNumber || "00000"}
                </Text>
                <Text style={{ fontSize: 8, fontWeight: "bold" }}>
                  PERMIT NUMBER
                </Text>
              </View>
            </View>

            {/* 2. MAYOR'S PERMIT Banner */}
            <View style={styles.banner}>
              <Text style={styles.bannerText}>MAYOR'S PERMIT</Text>
            </View>

            {/* 3. Intro Paragraph */}
            <Text style={styles.introText}>
              Pursuant to City Ordinance No. 2012-40, s. of 2012, also known as
              the "2012 Revenue Code of the City of San Pablo", as amended,
              BUSINESS LICENSE and MAYOR'S PERMIT is hereby granted to:
            </Text>
            <Text style={{ fontWeight: "bold", fontSize: 10 }}>
              BUSINESS ID: {applicant?.BIN || "0403424-2025-0000400"}
            </Text>
            <Text style={{ fontWeight: "bold", fontSize: 10 }}>
              REFERENCE NO: {applicant?.referenceNo || ""}
            </Text>

            {/* 4. Business Info Table (6 rows, 2 cols with header) */}
            <View style={{ marginVertical: 10 }}>
              <View style={styles.row}>
                <Text style={[styles.infoTableHeader, { width: "70%" }]}>
                  DESCRIPTION
                </Text>
                <Text
                  style={[
                    styles.infoTableHeader,
                    { width: "30%", textAlign: "left" },
                  ]}
                >
                  DETAILS
                </Text>
              </View>
              {[
                ["NAME OF OWNER:", fullName],
                ["ADDRESS:", applicant?.addressLine1 || "___________"],
                ["BUSINESS NAME:", applicant?.businessName || "___________"],
                [
                  "LINE OF BUSINESS:",
                  applicant?.lineOfBusiness?.replace(/"/g, "") || "___________",
                ],
                [
                  "KIND OF ORGANIZATION:",
                  applicant?.kindOfOrganization || "___________",
                ],
                ["BUSINESS ADDRESS:", businessAddress],
              ].map(([label, value]) => (
                <View style={styles.infoTableRow} key={label}>
                  <Text style={[styles.infoTableCell, { width: "70%" }]}>
                    {label}
                  </Text>
                  <Text style={[styles.infoTableCell, { width: "30%" }]}>
                    {value}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.spacer} />

            {/* 5. Collections Table */}
            <View>
              <View style={styles.row}>
                <Text style={[styles.collectionHeader, { width: "70%" }]}>
                  NATURE OF COLLECTION
                </Text>
                <Text
                  style={[
                    styles.collectionHeader,
                    { width: "30%", textAlign: "right" },
                  ]}
                >
                  AMOUNT
                </Text>
              </View>
              {validCollections.map((item) => (
                <View style={styles.row} key={item.label}>
                  <Text style={[styles.collectionCell, { width: "70%" }]}>
                    {item.label}
                  </Text>
                  <Text
                    style={[
                      styles.collectionCell,
                      { width: "30%", textAlign: "right" },
                    ]}
                  >
                    {formatPeso(Number(item.amount))}
                  </Text>
                </View>
              ))}
              {total > 0 && (
                <View style={styles.row}>
                  <Text
                    style={[
                      styles.collectionCell,
                      { width: "70%", fontWeight: "bold" },
                    ]}
                  >
                    TOTAL
                  </Text>
                  <Text
                    style={[
                      styles.collectionCell,
                      { width: "30%", textAlign: "right", fontWeight: "bold" },
                    ]}
                  >
                    {formatPeso(total)}
                  </Text>
                </View>
              )}
            </View>

            {/* 6. Signature Block */}
            <View style={styles.row}>
              <View style={styles.signatureCol}>
                <Image
                  src={oriaSignatureSrc}
                  style={{ width: 150, height: 50 }}
                />
                <Text style={{ fontWeight: "bold", fontSize: 10 }}>
                  ORIA M. BAÑAGALE
                </Text>
                <Text style={{ fontSize: 8 }}>
                  LICENSING OFFICER IV, CHIEF, BPLO
                </Text>
              </View>
              <View style={styles.signatureCol}>
                <Image src={eSignatureSrc} style={{ width: 150, height: 50 }} />
                <Text style={{ fontWeight: "bold", fontSize: 10 }}>
                  HON. ARCADIO B. GAPANGADA JR., MNSA
                </Text>
                <Text style={{ fontSize: 8 }}>CITY MAYOR</Text>
              </View>
            </View>

            {/* 7. Footer Text */}
            <Text style={{ fontSize: 9, marginTop: 20, textAlign: "justify" }}>
              This Permit shall take effect upon approval until December 31,
              2025 unless sooner revoked for cause and shall be renewed on or
              before January 20, 2026{"\n\n"}
              <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                IMPORTANT
              </Text>
              {"\n"}
              Violation of any provision of ordinance No. 2012, otherwise known
              as the "2012 REVISED REVENUE CODE OF THE CITY OF SAN PABLO" as
              amended, shall cause revocation of this permit and forfeiture of
              all sums paid for rights granted in addition to the penalties
              provided for.{"\n\n"}
              <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                ITO AY DAPAT IPASIKIL SA HAYAG NA POOK NG KALAKALAN AT DAPAT
                IPARAMDAM SA SANDALING HINGIN NG MGA KINAUUKULAN MAY KARAPATAN.
              </Text>
              {"\n"}
              <Text style={{ fontStyle: "italic", textAlign: "center" }}>
                This must be posted on conspicuous place and be presented upon
                demand by proper authorities.
              </Text>
            </Text>

            {/* 8. Bottom Green Bar */}
            <View style={styles.footerGreenBar}>
              <Text
                style={[
                  styles.whiteText,
                  styles.center,
                  { fontWeight: "bold" },
                ]}
              >
                ANY ALTERATION AND /OR ERASURE WILL INVALID THIS PERMIT.
              </Text>
            </View>
          </View>
        </Page>
      </Document>
    );

    const blob = await pdf(<PdfDocument />).toBlob();
    saveAs(blob, "Mayors_Permit.pdf");
  };

  return (
    <>
      <Button variant="contained" color="success" onClick={exportPdf}>
        Export to PDF
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleDone(applicant.id)}
        style={{ marginLeft: "10px" }}
      >
        Done
      </Button>
    </>
  );
}

export default MayorsPermit;
