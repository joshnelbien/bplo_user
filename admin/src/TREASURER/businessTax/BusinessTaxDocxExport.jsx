import React from "react";
import { Button } from "@mui/material";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function BusinessTaxPdfExport({ applicant, collections, total }) {
  const formatPeso = (value) =>
    value > 0
      ? value.toLocaleString(undefined, { minimumFractionDigits: 2 })
      : "";

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
      else if (n < 20) return belowTwenty[n] + " ";
      else if (n < 100) return tens[Math.floor(n / 10)] + " " + helper(n % 10);
      else
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
    if (centavos > 0) {
      words +=
        (pesos > 0 ? " and " : "") + numberToWords(centavos) + " centavos";
    }
    return words || "zero";
  }

  const loadImageAsBase64 = async (imagePath) => {
    try {
      const response = await fetch(imagePath);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
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

  const exportPdf = async () => {
    const validCollections = collections.filter(
      (item) => item.amount && Number(item.amount) > 0
    );

    const spcLogoImageData = await loadImageAsBase64("/spclogo.png");
    const eSignatureImageData = await loadImageAsBase64("/samplesig.png");
    const oriaSignatureImageData = await loadImageAsBase64("/samplesig.png");

    const fullName = `${applicant.firstName || ""} ${
      applicant.middleName || ""
    } ${applicant.lastName || ""}`.trim();

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    pdf.setFont("helvetica");
    pdf.setFontSize(8);

    let yPos = 25;

    // Header Logo
    if (spcLogoImageData) {
      const logoWidth = 60;
      const logoHeight = 60;
      const xLogo = (pdf.internal.pageSize.getWidth() - logoWidth) / 2;
      pdf.addImage(spcLogoImageData, "PNG", xLogo, yPos, logoWidth, logoHeight);
    }
    yPos += 75;

    // Header Texts
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

    // Title Bar
    autoTable(pdf, {
      startY: yPos,
      theme: "plain",
      styles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: "bold",
        cellPadding: 4,
        halign: "center",
      },
      body: [["BUSINESS TAX ORDER OF PAYMENT"]],
      margin: { left: 50, right: 50 }, // ✅ consistent margin
      tableWidth: 495, // ✅ fixed width for both tables
    });
    yPos = pdf.lastAutoTable.finalY + 10;

    const formatPeso = (value) =>
      value && !isNaN(value)
        ? Number(value).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : "";
    // Info Table
    const isRenew = applicant?.application?.toLowerCase() === "renew";

    const infoBody = [
      ["NAME OF OWNER:", fullName || "___________"],
      ["BUSINESS NAME:", applicant?.businessName || "___________"],
      ["NATURE OF BUSINESS:", applicant?.businessNature || "___________"],
      ["KIND OF ORG.:", applicant?.BusinessType || "___________"],
      ["BUSINESS ADDRESS:", applicant?.barangay || "___________"],
      [
        "APPLICATION TYPE:",
        applicant?.application
          ? applicant.application.trim().toUpperCase()
          : "___________",
      ],
      // ✅ Show either TOTAL GROSS or TOTAL CAPITAL depending on type
      [
        isRenew ? "TOTAL GROSS:" : "TOTAL CAPITAL:",
        (() => {
          const value = isRenew
            ? applicant?.totalCapital
            : applicant?.totalCapital;
          return value
            ? Number(value).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : "___________";
        })(),
      ],
    ];

    autoTable(pdf, {
      startY: yPos,
      body: infoBody,
      theme: "grid",
      styles: {
        cellPadding: 3,
        fontSize: 7,
        lineWidth: 0.5,
      },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 160 }, // ✅ same proportional widths
        1: { cellWidth: 335 },
      },
      margin: { left: 50, right: 50 },
      tableWidth: 495, // ✅ same width as collections table
    });
    yPos = pdf.lastAutoTable.finalY + 10;

    // Collections Table
    const collectionBody = validCollections.map((item) => [
      item.label,
      { content: formatPeso(Number(item.amount)), styles: { halign: "right" } },
    ]);

    if (total > 0) {
      collectionBody.push(
        [
          { content: "TOTAL", styles: { fontStyle: "bold" } },
          {
            content: formatPeso(total),
            styles: { halign: "right", fontStyle: "bold" },
          },
        ],
        [
          { content: "AMOUNT IN WORDS", styles: { fontStyle: "bold" } },
          {
            content: amountInWords(total).toUpperCase(),
            styles: { halign: "right" },
          },
        ]
      );
    }

    autoTable(pdf, {
      startY: yPos,
      head: [["NATURE OF COLLECTION", "AMOUNT"]],
      body: collectionBody,
      theme: "grid",
      styles: {
        cellPadding: 3,
        fontSize: 7,
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 300 }, // ✅ total = 495 when combined with right column
        1: { halign: "right", cellWidth: 195 },
      },
      margin: { left: 50, right: 50 },
      tableWidth: 495, // ✅ same as info table
    });
    yPos = pdf.lastAutoTable.finalY + 20;

    // Signatures
    const sigWidth = 120;
    const sigHeight = 40;
    const leftX = 70;
    const rightX = 360;

    if (oriaSignatureImageData)
      pdf.addImage(
        oriaSignatureImageData,
        "PNG",
        leftX,
        yPos,
        sigWidth,
        sigHeight
      );
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.text("WILLIAM CARTABIO", leftX + sigWidth / 2, yPos + sigHeight + 8, {
      align: "center",
    });
    pdf.setFontSize(7);
    pdf.text("COMPUTED BY", leftX + sigWidth / 2, yPos + sigHeight + 18, {
      align: "center",
    });

    if (eSignatureImageData)
      pdf.addImage(
        eSignatureImageData,
        "PNG",
        rightX,
        yPos,
        sigWidth,
        sigHeight
      );
    pdf.setFontSize(8);
    pdf.text(
      "LUCIO GERALDO G. CIOLO",
      rightX + sigWidth / 2,
      yPos + sigHeight + 8,
      { align: "center" }
    );
    pdf.setFontSize(7);
    pdf.text(
      "ACTING CITY TREASURER",
      rightX + sigWidth / 2,
      yPos + sigHeight + 18,
      { align: "center" }
    );

    const blob = pdf.output("blob");
    saveAs(blob, `${applicant.lastName}_Business_Tax_ORDER.pdf`);
  };

  return (
    <Button variant="contained" color="success" onClick={exportPdf}>
      Export to PDF
    </Button>
  );
}

export default BusinessTaxPdfExport;
