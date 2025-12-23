import { Button, CircularProgress } from "@mui/material";
import { saveAs } from "file-saver";
import React from "react";
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
import { LoadingButton } from "@mui/lab";
import { useState } from "react";

const API = import.meta.env.VITE_API_BASE;

// 🟢 Updated: Larger font for collection items
const styles = StyleSheet.create({
  page: { padding: 15, fontFamily: "Helvetica" },
  pageWatermark: {
    position: "absolute",
    top: "22%",
    left: "5%",
    width: "90%",
    height: "60%",
    opacity: 0.1,
    zIndex: -1,
  },
  frame: {
    border: "8pt solid #1D5A2E",
    margin: 0,
    padding: 20,
    height: "100%",
    position: "relative",
    justifyContent: "flex-start",
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

  banner: {
    backgroundColor: "#1D5A2E",
    paddingVertical: 6,
    paddingHorizontal: 0,
    marginVertical: 4,
    position: "relative",
    left: 0,
    right: 0,
    width: "100%",
    textAlign: "center",
  },
  bannerText: {
    color: "white",
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
  },
  spacer: { height: 4 },
  signatureCol: { width: "50%", alignItems: "center", marginTop: 8 },
  footerGreenBar: {
    backgroundColor: "#1D5A2E",
    padding: 6,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  introText: {
    fontSize: 8,
    marginBottom: 5,
    textAlign: "center",
    paddingBottom: 5,
  },

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
  collectionCell: {
    padding: 4,
    border: "0.5pt solid black",
    fontSize: 8, // ← Increased from 5 to 8 (much more readable)
    minHeight: 14, // Slightly taller rows for clarity
  },
  totalCell: {
    padding: 4,
    border: "0.5pt solid black",
    minHeight: 14,
    fontSize: 9, // ← Slightly larger for TOTAL
    fontWeight: "bold",
  },
  wordsRow: { flexDirection: "row", border: "0.5pt solid black" },
  wordsLabelSmall: {
    width: "40%",
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
  bottomText: {
    position: "absolute",
    bottom: 35,
    left: 20,
    right: 20,
    fontSize: 10,
    textAlign: "center",
    lineHeight: 1.4,
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

function MayorsPermit({
  applicant,
  collections,
  total,
  onClose,
  selectedFiles,
}) {
  console.log(selectedFiles);
  const [doneLoading, setDoneLoading] = useState(false);

  const handleDone = async (id) => {
    if (!selectedFiles?.businessPermit) {
      alert("No file selected!");
      return;
    }

    setDoneLoading(true);

    try {
      const formData = new FormData();
      formData.append("businessPermit", selectedFiles.businessPermit);

      await axios.put(`${API}/newApplication/appDone/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Permit marked as released and file uploaded!");
      onClose?.();
    } catch (error) {
      console.error("Error updating permit:", error);
      alert("Failed to update permit");
    } finally {
      setDoneLoading(false);
    }
  };

  const formatPeso = (val) =>
    val > 0 ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "";

  const exportPdf = async () => {
    const validCollections = collections.filter(
      (i) => i.amount && Number(i.amount) > 0
    );

    const MAX_ROWS = 13;
    const filledRows = [...validCollections];
    while (filledRows.length < MAX_ROWS) {
      filledRows.push({ label: "", amount: "" });
    }

    const bagongPilipinasSrc = await loadImageAsBase64("/bagongpilipinas.png");
    const spcLogoSrc = await loadImageAsBase64("/spclogo.png");
    const eSig = await loadImageAsBase64("/samplesig.png");
    const oSig = await loadImageAsBase64("/samplesig.png");

    const fullName = `${applicant.firstName || ""} ${
      applicant.middleName || ""
    } ${applicant.lastName || ""}`.trim();
    const businessAddress = `${applicant.barangay || ""}, ${
      applicant.cityOrMunicipality || ""
    }`;
    const amountInWords = total > 0 ? numberToWords(total) : "";

    const PdfDocument = () => (
      <Document>
        <Page size="A4" style={styles.page}>
          <Image src={spcLogoSrc} style={styles.pageWatermark} />
          <View style={styles.frame}>
            {/* Header */}
            <View style={styles.row}>
              <View style={styles.col25}>
                <Image
                  src={bagongPilipinasSrc}
                  style={{ width: 65, height: 65 }}
                />
              </View>
              <View style={[styles.col50, { alignItems: "center" }]}>
                <Image src={spcLogoSrc} style={{ width: 65, height: 65 }} />
                <Text
                  style={{ fontSize: 16, fontWeight: "bold", paddingTop: 5 }}
                >
                  OFFICE OF THE MAYOR
                </Text>
                <Text style={{ fontSize: 10 }}>
                  BUSINESS PERMIT AND LICENSING DIVISION
                </Text>
              </View>
              <View style={[styles.col25, { alignItems: "flex-end" }]}>
                <Text style={{ fontSize: 26, fontWeight: "bold" }}>
                  {new Date().getFullYear()}
                </Text>
                <Text style={{ fontSize: 26, fontWeight: "bold" }}>
                  {applicant?.PermitNumber || "00000"}
                </Text>
                <Text style={{ fontSize: 8 }}>PERMIT NUMBER</Text>
              </View>
            </View>

            <View style={styles.banner}>
              <Text style={[styles.bannerText, { fontSize: 26 }]}>
                MAYOR'S PERMIT
              </Text>
            </View>

            <Text style={styles.introText}>
              Pursuant to City Ordinance No. 2012-40, s. of 2012, also known as
              the "2012 Revenue Code of the City of San Pablo", as amended.
              {"\n"}
              BUSINESS LICENSE and MAYOR'S PERMIT is hereby granted to:
            </Text>

            <Text style={{ fontWeight: "bold", fontSize: 8 }}>
              BUSINESS ID: {applicant?.bin || "__________"}
            </Text>
            <Text style={{ fontWeight: "bold", fontSize: 8 }}>
              REFERENCE NO: {applicant?.referenceNo || ""}
            </Text>
            <Text style={{ fontWeight: "bold", fontSize: 8 }}>
              APPLICATION TYPE: {applicant?.application || ""}
            </Text>

            {/* Info Table */}
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

            {/* Collections + Signatures */}
            <View style={[styles.row, { marginTop: 8 }]}>
              <View style={{ width: "70%" }}>
                <View style={styles.row}>
                  <Text style={[styles.collectionHeader, { width: "40%" }]}>
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

                {filledRows.map((item, idx) => (
                  <View style={styles.row} key={idx}>
                    <Text style={[styles.collectionCell, { width: "40%" }]}>
                      {item.label}
                    </Text>
                    <Text
                      style={[
                        styles.collectionCell,
                        { width: "70%", textAlign: "left" },
                      ]}
                    >
                      {item.amount ? formatPeso(Number(item.amount)) : ""}
                    </Text>
                  </View>
                ))}

                {total > 0 && (
                  <>
                    <View style={styles.row}>
                      <Text style={[styles.totalCell, { width: "40%" }]}>
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
                      <Text style={styles.wordsLabelSmall}>
                        AMOUNT IN WORDS:
                      </Text>
                      <Text style={styles.wordsValueSmall}>
                        {amountInWords}
                      </Text>
                    </View>
                  </>
                )}
              </View>

              {/* Signatures */}
              <View style={{ width: "50%", paddingLeft: 10 }}>
                <View
                  style={{
                    alignItems: "center",
                    marginBottom: 10,
                    marginTop: 20,
                  }}
                >
                  <Image
                    src={oSig}
                    style={{
                      width: 40,
                      height: 40,
                      marginBottom: -10,
                      marginTop: 65,
                    }}
                  />
                  <Text style={{ fontWeight: "bold", fontSize: 10 }}>
                    JOHN ANDRE A. BELEN, MPA
                  </Text>
                  <Text style={{ fontSize: 8 }}>
                    LICENSING OFFICER III
                  </Text>
                </View>

                <View style={{ alignItems: "center" }}>
                  <Image
                    src={eSig}
                    style={{
                      width: 40,
                      height: 40,
                      marginBottom: -10,
                      marginTop: 30,
                    }}
                  />
                  <Text style={{ fontWeight: "bold", fontSize: 10 }}>
                    HON. ARCADIO B. GAPANGADA JR., MNSA
                  </Text>
                  <Text style={{ fontSize: 8 }}>CITY MAYOR</Text>
                </View>
              </View>
            </View>

            {/* Bottom Text */}
            <Text style={styles.bottomText}>
              This Permit shall take effect upon approval until December 31,
              2025 unless sooner revoked for cause and shall be renewed on or
              before{" "}
              <Text style={{ fontWeight: "bold" }}>
                January 20, {new Date().getFullYear() + 1}
              </Text>
              .{"\n"}
              <Text style={{ fontWeight: "bold", fontSize: 10 }}>
                IMPORTANT:
              </Text>{" "}
              Violation of any provision of ordinance No.: 2012 - 40 s. 2012,
              otherwise known as the "2012 Revenue Code of the City of San
              Pablo", as amended, shall cause revocation of this permit and
              forfeiture of all sums paid for rights granted in addition to the
              penalties provided for.
              {"\n"}
              <Text style={{ fontWeight: "bold" }}>
                ITO AY DAPAT IPASIKIL SA HAYAG NA POOK NG KALAKALAN AT DAPAT
                IPAKITA SA SANDALING HINGIN NG MGA KINAUUKULAN MAY
                KAPANGYARIHAN.
              </Text>
              {"\n"}
              This must be posted in a conspicuous place and presented upon
              demand by proper authorities.
            </Text>

            <View style={styles.footerGreenBar}>
              <Text
                style={[
                  styles.whiteText,
                  styles.center,
                  { fontWeight: "bold", fontSize: 10 },
                ]}
              >
                ANY ALTERATION AND/OR ERASURE WILL INVALIDATE THIS PERMIT.
                {"\n"}
                "BAGONG SAN PABLO"
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
      <LoadingButton
        variant="contained"
        color="primary"
        onClick={() => handleDone(applicant.id)}
        loading={doneLoading}
        style={{ marginLeft: "10px" }}
      >
        Done
      </LoadingButton>
    </>
  );
}

export default MayorsPermit;
