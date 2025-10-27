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
    alert("Permit marked as released!");
  } catch (error) {
    console.error("Error updating permit:", error);
    alert("Failed to update permit");
  }
};

// 🟢 Shrunk, tighter layout for one-page fit
const styles = StyleSheet.create({
  page: { padding: 15, fontFamily: "Helvetica" },
  frame: {
    border: "8pt solid #1D5A2E",
    margin: 6, // ⬅️ closer to page edge; you can reduce to 0 for edge-to-edge
    padding: 15, // ⬅️ keeps content spacing the same
  },
  darkGreen: { backgroundColor: "#1D5A2E" },
  whiteText: { color: "white" },
  bold: { fontWeight: "bold" },
  center: { textAlign: "center" },
  right: { textAlign: "right" },
  row: { flexDirection: "row" },
  col25: { width: "25%" },
  col50: { width: "50%" },
  col70: { width: "70%", border: "0.5pt solid black", padding: 3 },
  col30: { width: "30%", border: "0.5pt solid black", padding: 3 },
  banner: { backgroundColor: "#1D5A2E", padding: 6, marginVertical: 4 },
  bannerText: {
    color: "white",
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
  },
  spacer: { height: 4 },
  signatureCol: { width: "50%", alignItems: "center", marginTop: 8 },
  footerGreenBar: { backgroundColor: "#1D5A2E", padding: 6, marginTop: 8 },
  introText: { fontSize: 8, marginBottom: 5, textAlign: "justify" },

  infoTableRow: { flexDirection: "row", border: "0.5pt solid black" },
  infoTableHeader: {
    fontWeight: "bold",
    fontSize: 8,
    padding: 3,
    border: "0.5pt solid black",
    backgroundColor: "#F5F5F5",
  },
  infoTableCell: { padding: 3, border: "0.5pt solid black", fontSize: 7 },
  collectionHeader: {
    fontWeight: "bold",
    fontSize: 8,
    padding: 3,
    border: "0.5pt solid black",
    backgroundColor: "#F5F5F5",
  },
  collectionCell: { padding: 3, border: "0.5pt solid black", fontSize: 7 },
  totalCell: {
    padding: 3,
    border: "0.5pt solid black",
    fontSize: 7,
    fontWeight: "bold",
  },
  wordsRow: { flexDirection: "row", border: "0.5pt solid black" },
  wordsLabelSmall: {
    width: "30%",
    padding: 3,
    border: "0.5pt solid black",
    fontSize: 7,
    fontWeight: "bold",
  },
  wordsValueSmall: {
    width: "70%",
    padding: 3,
    border: "0.5pt solid black",
    fontSize: 7,
  },
});

async function loadImageAsBase64(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("Image load failed");
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function numberToWords(num) {
  if (num === 0) return "ZERO PESOS AND ZERO CENTAVOS";
  const ones = [
    "",
    "ONE",
    "TWO",
    "THREE",
    "FOUR",
    "FIVE",
    "SIX",
    "SEVEN",
    "EIGHT",
    "NINE",
    "TEN",
    "ELEVEN",
    "TWELVE",
    "THIRTEEN",
    "FOURTEEN",
    "FIFTEEN",
    "SIXTEEN",
    "SEVENTEEN",
    "EIGHTEEN",
    "NINETEEN",
  ];
  const tens = [
    "",
    "",
    "TWENTY",
    "THIRTY",
    "FORTY",
    "FIFTY",
    "SIXTY",
    "SEVENTY",
    "EIGHTY",
    "NINETY",
  ];
  const scales = ["", "THOUSAND", "MILLION"];
  const pesos = Math.floor(num);
  const centavos = Math.round((num - pesos) * 100);
  function convertGroup(n) {
    let str = "";
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + " HUNDRED ";
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + " ";
      n %= 10;
    }
    if (n > 0) str += ones[n] + " ";
    return str.trim();
  }
  function convertNumber(n) {
    if (n === 0) return "";
    let str = "";
    let i = 0;
    while (n > 0) {
      const group = n % 1000;
      if (group > 0) str = convertGroup(group) + " " + scales[i] + " " + str;
      n = Math.floor(n / 1000);
      i++;
    }
    return str.trim();
  }
  let words = convertNumber(pesos) + " PESOS";
  if (centavos > 0) words += " AND " + convertNumber(centavos) + " CENTAVOS";
  else words += " AND ZERO CENTAVOS";
  return words.trim();
}

function MayorsPermit({ applicant, collections, total }) {
  const formatPeso = (val) =>
    val > 0 ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";

  const exportPdf = async () => {
    const validCollections = collections.filter(
      (i) => i.amount && Number(i.amount) > 0
    );

    const bagongPilipinasSrc = await loadImageAsBase64("/bagongpilipinas.png");
    const spcLogoSrc = await loadImageAsBase64("/spclogo.png");
    const eSig = await loadImageAsBase64("/samplesig.png");
    const oSig = await loadImageAsBase64("/samplesig.png");

    const fullName = `${applicant.firstName || ""} ${
      applicant.middleName || ""
    } ${applicant.lastName || ""}`;
    const businessAddress = `${applicant.barangay || ""}, ${
      applicant.cityOrMunicipality || ""
    }`;
    const amountInWords = total > 0 ? numberToWords(total) : "";

    const PdfDocument = () => (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.frame}>
            <View style={styles.row}>
              <View style={styles.col25}>
                <Image
                  src={bagongPilipinasSrc}
                  style={{ width: 35, height: 35 }}
                />
              </View>
              <View style={[styles.col50, { alignItems: "center" }]}>
                <Image src={spcLogoSrc} style={{ width: 35, height: 35 }} />
                <Text style={{ fontSize: 9, fontWeight: "bold" }}>
                  OFFICE OF THE MAYOR
                </Text>
                <Text style={{ fontSize: 7 }}>
                  BUSINESS PERMIT AND LICENSING DIVISION
                </Text>
              </View>
              <View style={[styles.col25, { alignItems: "flex-end" }]}>
                <Text style={{ fontSize: 12, fontWeight: "bold" }}>2025</Text>
                <Text style={{ fontSize: 9, fontWeight: "bold" }}>
                  {applicant?.PermitNumber || "00000"}
                </Text>
                <Text style={{ fontSize: 6 }}>PERMIT NUMBER</Text>
              </View>
            </View>

            <View style={styles.banner}>
              <Text style={styles.bannerText}>MAYOR'S PERMIT</Text>
            </View>

            <Text style={styles.introText}>
              Pursuant to City Ordinance No. 2012-40, s. of 2012, BUSINESS
              LICENSE and MAYOR'S PERMIT is hereby granted to:
            </Text>

            <Text style={{ fontWeight: "bold", fontSize: 8 }}>
              BUSINESS ID: {applicant?.BIN || "__________"}
            </Text>
            <Text style={{ fontWeight: "bold", fontSize: 8 }}>
              REFERENCE NO: {applicant?.referenceNo || ""}
            </Text>

            <View style={{ marginVertical: 6 }}>
              <View style={styles.row}>
                <Text style={[styles.infoTableHeader, { width: "30%" }]}>
                  DESCRIPTION
                </Text>
                <Text
                  style={[
                    styles.infoTableHeader,
                    { width: "70%", textAlign: "center" },
                  ]}
                >
                  DETAILS
                </Text>
              </View>
              {[
                ["NAME OF OWNER:", fullName],
                ["ADDRESS:", applicant?.addressLine1 || "_________"],
                ["BUSINESS NAME:", applicant?.businessName || "_________"],
                [
                  "LINE OF BUSINESS:",
                  applicant?.lineOfBusiness?.replace(/"/g, "") || "_________",
                ],
                [
                  "KIND OF ORGANIZATION:",
                  applicant?.BusinessType || "_________",
                ],
                ["BUSINESS ADDRESS:", businessAddress],
              ].map(([label, value]) => (
                <View style={styles.infoTableRow} key={label}>
                  <Text style={[styles.infoTableCell, { width: "30%" }]}>
                    {label}
                  </Text>
                  <Text style={[styles.infoTableCell, { width: "70%" }]}>
                    {value}
                  </Text>
                </View>
              ))}
            </View>

            <View>
              <View style={styles.row}>
                <Text style={[styles.collectionHeader, { width: "30%" }]}>
                  NATURE OF COLLECTION
                </Text>
                <Text
                  style={[
                    styles.collectionHeader,
                    { width: "70%", textAlign: "center" },
                  ]}
                >
                  AMOUNT
                </Text>
              </View>
              {validCollections.map((item) => (
                <View style={styles.row} key={item.label}>
                  <Text style={[styles.collectionCell, { width: "30%" }]}>
                    {item.label}
                  </Text>
                  <Text
                    style={[
                      styles.collectionCell,
                      { width: "70%", textAlign: "left" },
                    ]}
                  >
                    {formatPeso(Number(item.amount))}
                  </Text>
                </View>
              ))}
              {total > 0 && (
                <>
                  <View style={styles.row}>
                    <Text style={[styles.totalCell, { width: "30%" }]}>
                      TOTAL
                    </Text>
                    <Text
                      style={[
                        styles.totalCell,
                        { width: "70%", textAlign: "left" },
                      ]}
                    >
                      {formatPeso(total)}
                    </Text>
                  </View>
                  <View style={styles.wordsRow}>
                    <Text style={styles.wordsLabelSmall}>AMOUNT IN WORDS:</Text>
                    <Text style={styles.wordsValueSmall}>{amountInWords}</Text>
                  </View>
                </>
              )}
            </View>

            <View style={styles.row}>
              <View style={styles.signatureCol}>
                <Image src={oSig} style={{ width: 40, height: 40 }} />
                <Text style={{ fontWeight: "bold", fontSize: 8 }}>
                  ORIA M. BAÑAGALE
                </Text>
                <Text style={{ fontSize: 7 }}>
                  LICENSING OFFICER IV, CHIEF, BPLO
                </Text>
              </View>
              <View style={styles.signatureCol}>
                <Image src={eSig} style={{ width: 40, height: 40 }} />
                <Text style={{ fontWeight: "bold", fontSize: 8 }}>
                  HON. ARCADIO B. GAPANGADA JR., MNSA
                </Text>
                <Text style={{ fontSize: 7 }}>CITY MAYOR</Text>
              </View>
            </View>

            <Text style={{ fontSize: 6, marginTop: 8, textAlign: "justify" }}>
              This Permit shall take effect upon approval until December 31,
              2025 unless sooner revoked. Violation of any provision of the
              "2012 REVISED REVENUE CODE OF THE CITY OF SAN PABLO" shall cause
              revocation of this permit and forfeiture of sums paid.{"\n\n"}
              <Text style={{ fontWeight: "bold" }}>
                ITO AY DAPAT IPASIKIL SA HAYAG NA POOK NG KALAKALAN.
              </Text>
            </Text>

            <View style={styles.footerGreenBar}>
              <Text
                style={[
                  styles.whiteText,
                  styles.center,
                  { fontWeight: "bold", fontSize: 6 },
                ]}
              >
                ANY ALTERATION AND/OR ERASURE WILL INVALIDATE THIS PERMIT.
              </Text>
            </View>
          </View>
        </Page>
      </Document>
    );

    const blob = await pdf(<PdfDocument />).toBlob();
    saveAs(blob, `${applicant.businessName}_Mayors_Permit.pdf`);
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
