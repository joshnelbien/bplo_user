import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

function BusinessTaxPdfExport({ applicant, collections, total }) {
  const [userSignatory, setUserSignatory] = useState(null);
  const [defaultSignature, setDefaultSignature] = useState(null);
  const API = import.meta.env.VITE_API_BASE;

  // Format peso
  const formatPeso = (value) =>
    value > 0
      ? value.toLocaleString(undefined, { minimumFractionDigits: 2 })
      : "";

  // ✅ Convert numbers to words (your original logic)
  function numberToWords(num) {
    if (num === 0) return "zero";
    const belowTwenty = [
      "",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "eleven",
      "twelve",
      "thirteen",
      "fourteen",
      "fifteen",
      "sixteen",
      "seventeen",
      "eighteen",
      "nineteen",
    ];
    const tens = [
      "",
      "",
      "twenty",
      "thirty",
      "forty",
      "fifty",
      "sixty",
      "seventy",
      "eighty",
      "ninety",
    ];
    const thousands = ["", "thousand", "million", "billion"];
    function helper(n) {
      if (n === 0) return "";
      if (n < 20) return belowTwenty[n] + " ";
      if (n < 100) return tens[Math.floor(n / 10)] + " " + helper(n % 10);
      return belowTwenty[Math.floor(n / 100)] + " hundred " + helper(n % 100);
    }
    let word = "",
      i = 0,
      tempNum = num;
    while (tempNum > 0) {
      if (tempNum % 1000 !== 0)
        word = helper(tempNum % 1000) + thousands[i] + " " + word;
      tempNum = Math.floor(tempNum / 1000);
      i++;
    }
    return word.trim();
  }

  function amountInWords(amount) {
    const pesos = Math.floor(amount);
    const centavos = Math.round((amount - pesos) * 100);
    let words = "";
    if (pesos > 0) words += numberToWords(pesos) + " pesos";
    if (centavos > 0)
      words +=
        (pesos > 0 ? " and " : "") + numberToWords(centavos) + " centavos";
    return words || "zero";
  }

  // Convert local image to base64 (fallback sig)
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

  // ✅ Load logged-in user's signature from DB
  useEffect(() => {
    const loadAdmin = async () => {
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
        console.error("❌ Failed to load admin", err);
      }
    };

    const loadFallbackSig = async () => {
      const img = await loadImageAsBase64("/samplesig.png");
      setDefaultSignature(img);
    };

    loadAdmin();
    loadFallbackSig();
  }, [API]);

  // ✅ Export to PDF
  const exportPdf = async () => {
    const validCollections = collections.filter(
      (item) => item.amount && Number(item.amount) > 0
    );

    const spcLogoImageData = await loadImageAsBase64("/spclogo.png");

    // ✅ Use uploaded signature if exists, else fallback
    const signatureToUse = userSignatory || defaultSignature;

    const fullName = `${applicant.firstName || ""} ${
      applicant.middleName || ""
    } ${applicant.lastName || ""}`.trim();

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    // ---- HEADER ----
    pdf.setFont("helvetica");
    pdf.setFontSize(8);

    let yPos = 25;
    if (spcLogoImageData) {
      const logoWidth = 60;
      const xLogo = (pdf.internal.pageSize.getWidth() - logoWidth) / 2;
      pdf.addImage(spcLogoImageData, "PNG", xLogo, yPos, logoWidth, logoWidth);
    }
    yPos += 75;
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.text(
      "Republic of the Philippines",
      pdf.internal.pageSize.getWidth() / 2,
      yPos,
      { align: "center" }
    );
    yPos += 12;
    pdf.setFont("helvetica", "normal");
    pdf.text("City of San Pablo", pdf.internal.pageSize.getWidth() / 2, yPos, {
      align: "center",
    });
    yPos += 20;

    autoTable(pdf, {
      startY: yPos,
      theme: "plain",
      styles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: "bold",
        cellPadding: 4,
      },
      body: [["BUSINESS TAX ORDER OF PAYMENT"]],
      margin: { left: 50, right: 50 },
      tableWidth: 495,
    });
    yPos = pdf.lastAutoTable.finalY + 10;

    // ---- INFO TABLE ----
    const isRenew = applicant?.application?.toLowerCase() === "renew";
    const infoBody = [
      ["NAME OF OWNER:", fullName],
      ["BUSINESS NAME:", applicant?.businessName],
      ["NATURE OF BUSINESS:", applicant?.businessNature],
      ["KIND OF ORG.:", applicant?.BusinessType],
      ["BUSINESS ADDRESS:", applicant?.barangay],
      ["APPLICATION TYPE:", applicant?.application?.toUpperCase()],
      [
        isRenew ? "TOTAL GROSS:" : "TOTAL CAPITAL:",
        Number(applicant?.totalCapital)?.toLocaleString(),
      ],
    ];

    autoTable(pdf, {
      startY: yPos,
      body: infoBody,
      theme: "grid",
      styles: { fontSize: 7, cellPadding: 3 },
      margin: { left: 50, right: 50 },
      tableWidth: 495,
    });
    yPos = pdf.lastAutoTable.finalY + 10;

    // ---- COLLECTIONS TABLE ----
    const collectionBody = validCollections.map((item) => [
      item.label,
      { content: formatPeso(Number(item.amount)), styles: { halign: "right" } },
    ]);

    collectionBody.push(
      [
        "TOTAL",
        {
          content: formatPeso(total),
          styles: { halign: "right", fontStyle: "bold" },
        },
      ],
      [
        "AMOUNT IN WORDS",
        {
          content: amountInWords(total).toUpperCase(),
          styles: { halign: "right" },
        },
      ]
    );

    autoTable(pdf, {
      startY: yPos,
      head: [["NATURE OF COLLECTION", "AMOUNT"]],
      body: collectionBody,
      theme: "grid",
      styles: {
        fontSize: 7,
        cellPadding: 3,
        fillColor: null, // remove background for body cells
      },
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255], // black text
        fontStyle: "bold",
        halign: "center",
      },
      alternateRowStyles: { fillColor: null }, // remove row stripes
      margin: { left: 50, right: 50 },
      tableWidth: 495,
    });
    yPos = pdf.lastAutoTable.finalY + 20;

    // ---- SIGNATURES ----
    const sigWidth = 120,
      sigHeight = 40;
    const leftX = 70,
      rightX = 360;

    // Clerk Signature (You)
    if (signatureToUse)
      pdf.addImage(signatureToUse, "PNG", leftX, yPos, sigWidth, sigHeight);
    pdf.text("COMPUTED BY", leftX + sigWidth / 2, yPos + sigHeight + 20, {
      align: "center",
    });

    // Treasurer Fixed
    if (defaultSignature)
      pdf.addImage(defaultSignature, "PNG", rightX, yPos, sigWidth, sigHeight);
    pdf.text(
      "ACTING CITY TREASURER",
      rightX + sigWidth / 2,
      yPos + sigHeight + 20,
      { align: "center" }
    );

    saveAs(pdf.output("blob"), `${applicant.lastName}_Business_Tax_ORDER.pdf`);
  };

  return (
    <Button variant="contained" color="success" onClick={exportPdf}>
      Export to PDF
    </Button>
  );
}

export default BusinessTaxPdfExport;
