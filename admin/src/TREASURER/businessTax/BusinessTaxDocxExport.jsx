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
} from "docx";

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
      : "₱ ______";

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
        return belowTwenty[Math.floor(n / 100)] + " hundred " + helper(n % 100);
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
    const doc = new Document({
      sections: [
        {
          children: [
            // Header
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "Republic of the Philippines",
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "CITY OF SAN PABLO", bold: true }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 },
              children: [
                new TextRun({
                  text: "BUSINESS TAX ORDER OF PAYMENT",
                  bold: true,
                }),
              ],
            }),

            // Reference info
            new Paragraph(`REFERENCE NO: ___________`),
            new Paragraph(`BUSINESS ID: ${applicant?.BIN || "___________"}`),
            new Paragraph(`CAPITAL: ${applicant?.totalCapital || 0}`),
            new Paragraph(`GROSS: ${applicant?.gross || "___________"}`),

            // Owner / Business Info
            new Paragraph({
              spacing: { before: 300 },
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
            new Paragraph(
              `BUSINESS NAME: ${applicant?.businessName || "___________"}`
            ),
            new Paragraph(
              `BUSINESS ADDRESS: ${applicant?.barangay || "___________"}`
            ),
            new Paragraph(
              `NATURE OF BUSINESS: ${applicant?.nature || "___________"}`
            ),

            // Table for collections
            new Paragraph({ text: " ", spacing: { before: 200 } }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
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
                      children: [new Paragraph({ text: "AMOUNT", bold: true })],
                    }),
                  ],
                }),
                ...collections.map(
                  (item) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [new Paragraph(item.label)],
                        }),
                        new TableCell({
                          children: [new Paragraph(formatPeso(item.amount))],
                        }),
                      ],
                    })
                ),
              ],
            }),

            new Paragraph({
              spacing: { before: 200 },
              children: [
                new TextRun(
                  `Other Charges total: ${formatPeso(otherChargesTotal)}`
                ),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `TOTAL: ${formatPeso(total)}`,
                  bold: true,
                }),
              ],
            }),

            // Amount in Words
            new Paragraph({
              spacing: { before: 200 },
              children: [
                new TextRun({
                  text: `AMOUNT IN WORDS: ${amountInWords(total)}`,
                }),
              ],
            }),
            new Paragraph(`No. Of Service Vehicle: ___________`),
            new Paragraph(`Mode of Payment: ___________`),

            // Footer
            new Paragraph({ text: " ", spacing: { before: 300 } }),
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
