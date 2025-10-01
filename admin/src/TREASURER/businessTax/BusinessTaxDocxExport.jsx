import React from "react";
import { Button } from "@mui/material";
import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  VerticalAlign, // Import VerticalAlign for cell alignment
  // Assuming you have an 'Image' or 'Media' utility for the logo. 
  // If not, we'll use a Paragraph placeholder.
  // Example: Media, maybe? For simplicity, we'll use a placeholder.
} from "docx";

// The rest of your functions (formatPeso, numberToWords, amountInWords) remain the same.

function BusinessTaxDocxExport({
  applicant,
  collections,
  total,
  otherChargesTotal,
}) {
  // ✅ Peso formatter
  const formatPeso = (value) =>
    value > 0
      ? `₱ ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
      : "";

  // ✅ Convert number to words
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
        return (
          belowTwenty[Math.floor(n / 100)] + " hundred " + helper(n % 100)
        );
    }

    let word = "";
    let i = 0;
    while (num > 0) {
      if (num % 1000 !== 0) {
        word = helper(num % 1000) + thousands[i] + " " + word;
      }
      num = Math.floor(num / 1000);
      i++;
    }
    return word.trim();
  }

  function amountInWords(amount) {
    const pesos = Math.floor(amount);
    const centavos = Math.round((amount - pesos) * 100);
    let words = "";
    if (pesos > 0) words += numberToWords(pesos) + " pesos";
    if (centavos > 0) words += " and " + numberToWords(centavos) + " centavos";
    return words || "zero";
  }

  // ✅ Generate DOCX file
  const exportDocx = async () => {
    const validCollections = collections.filter(
      (item) => item.amount && Number(item.amount) > 0
    );

    // --- START: Logo/Header Table Definition ---
    // NOTE: This table is the key to aligning the logo and text side-by-side.
    const headerTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
            new TableRow({
                children: [
                    // --- Column 1: Logo (Left) ---
                    new TableCell({
                        width: { size: 15, type: WidthType.PERCENTAGE }, // Allocate 15% width for the logo
                        verticalAlign: VerticalAlign.CENTER,
                        children: [
                            // ⚠️ IMPORTANT: Replace this placeholder with your actual docx image insertion logic
                            // If you use Media.addImage or a similar function, insert it here.
                            new Paragraph({
                                text: "[spclogo.png Placeholder]", // Placeholder for the logo image
                                alignment: AlignmentType.CENTER,
                                spacing: { after: 0, before: 0 },
                                style: "NoSpacing" // Use NoSpacing to reduce vertical space
                            }),
                        ],
                        borders: { top: { style: "none" }, bottom: { style: "none" }, left: { style: "none" }, right: { style: "none" } },
                    }),
                    // --- Column 2: Text (Right/Center Block) ---
                    new TableCell({
                        width: { size: 85, type: WidthType.PERCENTAGE }, // Allocate 85% width for the text
                        verticalAlign: VerticalAlign.CENTER,
                        children: [
                            new Paragraph({
                                // Republic of the Philippines
                                alignment: AlignmentType.LEFT,
                                spacing: { after: 0, before: 0 },
                                children: [
                                    new TextRun({ text: "Republic of the Philippines", bold: false, size: 22 }), // Adjust size as needed
                                ],
                            }),
                            new Paragraph({
                                // CITY OF SAN PABLO
                                alignment: AlignmentType.LEFT,
                                spacing: { after: 0, before: 0 },
                                children: [
                                    new TextRun({ text: "CITY OF SAN PABLO", bold: true, size: 24 }),
                                ],
                            }),
                            new Paragraph({
                                // BUSINESS TAX ORDER OF PAYMENT
                                alignment: AlignmentType.LEFT,
                                spacing: { after: 200, before: 0 }, // Add slight spacing after this line
                                children: [
                                    new TextRun({ text: "BUSINESS TAX ORDER OF PAYMENT", bold: true, size: 22 }),
                                ],
                            }),
                        ],
                        borders: { top: { style: "none" }, bottom: { style: "none" }, left: { style: "none" }, right: { style: "none" } },
                    }),
                ],
            }),
        ],
    });
    // --- END: Logo/Header Table Definition ---


    const doc = new Document({
      sections: [
        {
          children: [
            // Insert the new Header Table
            headerTable,
            
            // Add a blank line/separator
            new Paragraph({ text: " ", spacing: { after: 200 } }), 

            // Reference info (Improved spacing)
            new Paragraph({ text: `REFERENCE NO: ___________`, spacing: { after: 50 } }),
            new Paragraph({ text: `BUSINESS ID: ${applicant?.BIN || "___________"}`, spacing: { after: 50 } }),
            new Paragraph({ text: `CAPITAL: ${applicant?.totalCapital || "___________"}`, spacing: { after: 50 } }),
            new Paragraph({ text: `GROSS: ${applicant?.gross || "___________"}`, spacing: { after: 300 } }), // Extra space after GROSS

            // Owner / Business Info
            new Paragraph({
                spacing: { before: 0, after: 50 },
                children: [
                    new TextRun({
                        text: `NAME OF OWNER: ${
                            applicant
                                ? `${applicant.firstName || ""} ${
                                      applicant.middleName || ""
                                  } ${applicant.lastName || ""}`
                                : "___________"
                        }`,
                    }),
                ],
            }),
            new Paragraph({ text: `BUSINESS NAME: ${applicant?.businessName || "___________"}`, spacing: { after: 50 } }),
            new Paragraph({ text: `BUSINESS ADDRESS: ${applicant?.barangay || "___________"}`, spacing: { after: 50 } }),
            new Paragraph({ text: `NATURE OF BUSINESS: ${applicant?.nature || "___________"}`, spacing: { after: 300 } }),

            // Table for collections (Added Table Cell Alignment)
            ...(validCollections.length > 0
              ? [
                  new Table({
                    // Set table width to less than 100% and center it for a cleaner look
                    width: { size: 9000, type: WidthType.DXA }, // DXA is the measurement unit for fixed table width in docx, 9000 DXA is approx 6.25 inches
                    alignment: AlignmentType.CENTER,
                    rows: [
                      new TableRow({
                        children: [
                          new TableCell({
                            children: [
                              new Paragraph({
                                text: "NATURE OF COLLECTION",
                                bold: true,
                              }),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({ 
                                text: "AMOUNT", 
                                bold: true,
                                alignment: AlignmentType.RIGHT // Right-align the header AMOUNT text
                              }),
                            ],
                            width: { size: 3000, type: WidthType.DXA } // Fixed width for amount column
                          }),
                        ],
                      }),
                      ...validCollections.map(
                        (item) =>
                          new TableRow({
                            children: [
                              new TableCell({
                                children: [new Paragraph(item.label)],
                              }),
                              new TableCell({
                                children: [
                                  new Paragraph({
                                    text: formatPeso(Number(item.amount)),
                                    alignment: AlignmentType.RIGHT, // Crucial: Right-align the actual amount values
                                  }),
                                ],
                              }),
                            ],
                          })
                      ),
                    ],
                  }),
                ]
              : []),

            // Totals and Footer follow...

            // Other Charges (only if > 0)
            ...(otherChargesTotal > 0
              ? [
                  new Paragraph({
                    spacing: { before: 200 },
                    alignment: AlignmentType.RIGHT, // Right-align total line
                    children: [
                      new TextRun(
                        `Other Charges total: ${formatPeso(otherChargesTotal)}`
                      ),
                    ],
                  }),
                ]
              : []),

            // Total (only if > 0)
            ...(total > 0
              ? [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT, // Right-align total line
                    children: [
                      new TextRun({
                        text: `TOTAL: ${formatPeso(total)}`,
                        bold: true,
                      }),
                    ],
                  }),
                  new Paragraph({
                    spacing: { before: 200, after: 300 },
                    children: [
                      new TextRun({
                        text: `AMOUNT IN WORDS: ${amountInWords(total).toUpperCase()}`, // Use UPPERCASE for professionalism
                      }),
                    ],
                  }),
                ]
              : []),

            // Footer
            new Paragraph({ text: `No. Of Service Vehicle: ___________`, spacing: { after: 50 } }),
            new Paragraph({ text: `Mode of Payment: ___________`, spacing: { after: 400 } }),
            
            new Paragraph("Computed By: ___________"),
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [new TextRun("(Treasurer)")],
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Business_Tax_Order_of_Payment.docx");
  };

  return (
    <Button variant="contained" color="success" onClick={exportDocx}>
      Export to Word
    </Button>
  );
}

export default BusinessTaxDocxExport;