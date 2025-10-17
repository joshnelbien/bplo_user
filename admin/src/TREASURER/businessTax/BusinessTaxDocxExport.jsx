import React from "react";
import { Button } from "@mui/material";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Optional: If you want custom fonts (e.g., Calibri), generate and import
// For now, using default Helvetica which is close enough; add later if needed.

function BusinessTaxPdfExport({
  applicant,
  collections,
  total,
  otherChargesTotal,
}) {
  // 🛑 MODIFIED: Removed '₱ ' from the returned string. It now only returns the formatted number.
  const formatPeso = (value) =>
    value > 0
      ? value.toLocaleString(undefined, { minimumFractionDigits: 2 })
      : "";

  // Convert number to words (unchanged)
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

    let word = "";
    let i = 0;
    let tempNum = num;
    while (tempNum > 0) {
      if (tempNum % 1000 !== 0) {
        word = helper(tempNum % 1000) + thousands[i] + " " + word;
      }
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

  // Load image as base64 for jsPDF
  const loadImageAsBase64 = async (imagePath) => {
    try {
      console.log("Loading image from:", imagePath);
      const response = await fetch(imagePath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
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
  };

  // Generate PDF
  const exportPdf = async () => {
    const validCollections = collections.filter(
      (item) => item.amount && Number(item.amount) > 0
    );

    // Load images as base64
    const spcLogoImageData = await loadImageAsBase64("/spclogo.png");
    const eSignatureImageData = await loadImageAsBase64("/samplesig.png");
    const oriaSignatureImageData = await loadImageAsBase64("/samplesig.png");

    console.log("SPC Logo image loaded:", !!spcLogoImageData);
    console.log("Mayor e-Signature image loaded:", !!eSignatureImageData);
    console.log("Oria e-Signature image loaded:", !!oriaSignatureImageData);

    const fullName = `${applicant.firstName || ""} ${
      applicant.middleName || ""
    } ${applicant.lastName || ""}`.trim();

    // jsPDF setup (A4: 595 x 842 pt)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    // Set default font (Helvetica approximates Calibri)
    pdf.setFont("helvetica");
    pdf.setFontSize(11); // Base size matching DOCX 22 half-points

    let yPos = 40; // Top margin

    // Header: Logo (centered)
    if (spcLogoImageData) {
      const logoWidth = 100;
      const logoHeight = 100;
      const xLogo = (pdf.internal.pageSize.getWidth() - logoWidth) / 2;
      pdf.addImage(spcLogoImageData, "PNG", xLogo, yPos, logoWidth, logoHeight);
    } else {
      pdf.text("[SPC Logo]", pdf.internal.pageSize.getWidth() / 2, yPos + 50, {
        align: "center",
      });
    }
    yPos += 120;

    // Republic and City text (centered, bold)
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(
      "Republic of the Philippines",
      pdf.internal.pageSize.getWidth() / 2,
      yPos,
      { align: "center" }
    );
    yPos += 15;
    pdf.setFontSize(11);
    pdf.text("City of San Pablo", pdf.internal.pageSize.getWidth() / 2, yPos, {
      align: "center",
    });
    yPos += 30;

    // Title: Shaded single-cell table
    autoTable(pdf, {
      startY: yPos,
      theme: "plain",
      // --- MODIFIED STYLES START ---
      styles: {
        // Set fillColor to black (RGB: [0, 0, 0])
        fillColor: [0, 0, 0],
        // Set textColor to white (RGB: [255, 255, 255])
        textColor: [255, 255, 255],
        fontSize: 12,
        fontStyle: "bold",
        cellPadding: 10,
        halign: "center",
      },
      // --- MODIFIED STYLES END ---
      body: [["BUSINESS TAX ORDER OF PAYMENT"]],
      margin: { left: 40, right: 40 },
      // Change tableWidth to 'auto' or omit it to span the margins
      tableWidth: "auto",
    });
    yPos = pdf.lastAutoTable.finalY + 20;

    // Business ID and Reference No
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(`BUSINESS ID: ${applicant?.BIN || "___________"}`, 40, yPos);
    yPos += 15;
    pdf.text(
      `REFERENCE NO: ${applicant?.referenceNo || "___________"}`,
      40,
      yPos
    );
    yPos += 30;

    // Business Info Table
    const infoBody = [
      ["NAME OF OWNER:", fullName || "___________"],
      ["ADDRESS:", applicant?.address || "___________"],
      ["BUSINESS NAME:", applicant?.businessName || "___________"],
      ["LINE OF BUSINESS:", applicant?.lineOfBusiness || "___________"],
      ["KIND OF ORGANIZATION:", applicant?.kindOfOrganization || "___________"],
      ["BUSINESS ADDRESS:", applicant?.barangay || "___________"],
    ];
    autoTable(pdf, {
      startY: yPos,
      body: infoBody,
      theme: "grid",
      styles: {
        cellPadding: 6,
        fontSize:8,
        lineColor: [0, 0, 0],
        lineWidth: 1,
      },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 150, fillColor: [255, 255, 255] },
        1: { cellWidth: 350, fillColor: [255, 255, 255] },
      },
      margin: { left: 40, right: 40 },
    });
    yPos = pdf.lastAutoTable.finalY + 20;

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
            // 🛑 MODIFIED: formatPeso is used here, which now excludes '₱'
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
        cellPadding: 8,
        fontSize: 8,
        lineColor: [0, 0, 0],
        lineWidth: 1,
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      columnStyles: { 0: {}, 1: { halign: "right" } },
      margin: { left: 40, right: 40 },
      pageBreak: "auto", // Handles overflow automatically
    });
    yPos = pdf.lastAutoTable.finalY + 40;

    // Signature Block (side by side)
    const sigWidth = 150;
    const sigHeight = 50;
    const leftX = 70;
    const rightX = 370;

    // Left: Oria
    if (oriaSignatureImageData) {
      pdf.addImage(
        oriaSignatureImageData,
        "PNG",
        leftX,
        yPos,
        sigWidth,
        sigHeight
      );
    }
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("WILLIAM CARTABIO", leftX + sigWidth / 2, yPos + sigHeight + 10, {
      align: "center",
    });
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.text("COMPUTED BY:", leftX + sigWidth / 2, yPos + sigHeight + 20, {
      align: "center",
    });

    // Right: Mayor
    if (eSignatureImageData) {
      pdf.addImage(
        eSignatureImageData,
        "PNG",
        rightX,
        yPos,
        sigWidth,
        sigHeight
      );
    }
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(
      "LUCIO GERALDO G. CIOLO",
      rightX + sigWidth / 2,
      yPos + sigHeight + 10,
      { align: "center" }
    );
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      "ACTING CITY TREASURER",
      rightX + sigWidth / 2,
      yPos + sigHeight + 20,
      { align: "center" }
    );

    // Save as Blob and download
    const blob = pdf.output("blob");
    saveAs(blob, "Business_Tax_Document.pdf");
  };

  return (
    <Button variant="contained" color="success" onClick={exportPdf}>
      Export to PDF
    </Button>
  );
}

export default BusinessTaxPdfExport;