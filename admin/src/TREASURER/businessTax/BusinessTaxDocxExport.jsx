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
  VerticalAlign,
  Media,
  BorderStyle,
} from "docx";

// ⚠️ PLACEHOLDER FOR IMAGE DATA:
// You need to replace this with your actual image loading logic.
const spcLogoImageBuffer = null; 

// --- STYLES FOR THE DOCX DOCUMENT ---
const greenColor = "0F5132"; // Dark Green from the image
const whiteColor = "FFFFFF";
const redColor = "FF0000"; // Red for "IMPORTANT"

function BusinessTaxDocxExport({
  applicant = {}, // Default to empty object to prevent errors
  collections = [],
  total = 0,
  otherChargesTotal = 0,
}) {
  // ✅ Peso formatter (unchanged)
  const formatPeso = (value) => {
    // Ensure value is a number before formatting
    const numValue = Number(value) || 0;
    return numValue > 0
      ? `₱ ${numValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
      : "";
  }

  // NOTE: numberToWords and amountInWords functions are omitted for brevity,
  // as they are not used in the structure of the Mayor's Permit image,
  // but they are assumed to be available as in your original code.
  // ... (numberToWords and amountInWords functions here) ...

  // ✅ Generate DOCX file
  const exportDocx = async () => {
    
    // --- LOGIC FOR ADDING IMAGE ---
    // Note: The DOCX library requires the Document instance to add the image, 
    // which makes using Media.addImage outside the main doc object difficult.
    // We will keep a simple text placeholder for the logo unless the 
    // image buffer loading is handled and an explicit image is ready.
    let logoChildren = [
        new Paragraph({ 
            text: "[Logo]", 
            alignment: AlignmentType.CENTER, 
            spacing: { after: 0, before: 0 } 
        }),
    ];
    // If you correctly load the ArrayBuffer into spcLogoImageBuffer, uncomment and adjust this block
    /*
    if (spcLogoImageBuffer) {
        // You'd need a temp Document to create the image element
        const tempDoc = new Document();
        const image = Media.addImage(tempDoc, spcLogoImageBuffer, 50, 50); // Adjust size
        logoChildren = [new Paragraph({ children: [image], alignment: AlignmentType.CENTER })];
    }
    */
    // --- END: LOGIC FOR ADDING IMAGE ---

    // --- START: Header Table (Three Rows for better control of the vertical layout) ---
    const headerTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        // Define column widths explicitly: 15% for logo, 50% for office text, 35% for permit number
        columnWidths: [1500, 5000, 3500], 
        rows: [
            // Row 1: Logo, Office Title, Permit Number/Year
            new TableRow({
                children: [
                    // Col 1: Logo
                    new TableCell({
                        width: { size: 15, type: WidthType.PERCENTAGE },
                        verticalAlign: VerticalAlign.CENTER,
                        children: logoChildren,
                        borders: { top: { style: "none" }, bottom: { style: "none" }, left: { style: "none" }, right: { style: "none" } },
                    }),
                    // Col 2: Office Title
                    new TableCell({
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        verticalAlign: VerticalAlign.CENTER,
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                spacing: { after: 0, before: 0 },
                                children: [new TextRun({ text: "OFFICE OF THE MAYOR", bold: true, size: 20 })],
                            }),
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                spacing: { after: 0, before: 0 },
                                children: [new TextRun({ text: "BUSINESS PERMIT AND LICENSING DIVISION", bold: true, size: 18 })],
                            }),
                        ],
                        borders: { top: { style: "none" }, bottom: { style: "none" }, left: { style: "none" }, right: { style: "none" } },
                    }),
                    // Col 3: Permit Number Box
                    new TableCell({
                        width: { size: 35, type: WidthType.PERCENTAGE },
                        verticalAlign: VerticalAlign.TOP,
                        children: [
                            // 2025
                            new Paragraph({
                                alignment: AlignmentType.RIGHT,
                                spacing: { after: 0, before: 0 },
                                children: [new TextRun({ text: "2025", bold: true, color: greenColor, size: 48 })],
                            }),
                            // 00000
                            new Paragraph({
                                alignment: AlignmentType.RIGHT,
                                spacing: { after: 0, before: 0 },
                                children: [new TextRun({ text: "00000", bold: true, color: greenColor, size: 48 })],
                            }),
                            // PERMIT NUMBER
                            new Paragraph({
                                alignment: AlignmentType.RIGHT,
                                spacing: { after: 0, before: 0 },
                                children: [new TextRun({ text: "PERMIT NUMBER", size: 16 })],
                            }),
                        ],
                        borders: { top: { style: "none" }, bottom: { style: "none" }, left: { style: "none" }, right: { style: "none" } },
                    }),
                ],
            }),
             // Row 2: Green Banner with "MAYOR'S PERMIT"
            new TableRow({
                children: [
                    new TableCell({
                        columnSpan: 3,
                        verticalAlign: VerticalAlign.CENTER,
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                spacing: { after: 100, before: 100 },
                                children: [
                                    new TextRun({ text: "MAYOR'S PERMIT", bold: true, size: 36, color: whiteColor }),
                                ],
                            }),
                        ],
                        shading: { fill: greenColor }, 
                        borders: { top: { style: "none" }, bottom: { style: "none" }, left: { style: "none" }, right: { style: "none" } },
                    }),
                ],
            }),
        ],
    });
    // --- END: Header Table ---


    // --- START: Permit Body Info Table (for cleaner alignment) ---
    // Helper function to create a row for a single field
    const createInfoRow = (label, data, needsUnderline = true) => {
        const fieldData = data || "_________________________________________"; // Default underline placeholder
        const dataRun = new TextRun({ text: fieldData, size: 20 });
        
        return new TableRow({
            children: [
                new TableCell({
                    children: [
                        new Paragraph({
                            spacing: { after: 80, before: 0 }, // Adjust vertical spacing
                            children: [
                                new TextRun({ text: `${label}: `, bold: true, size: 20 }),
                                dataRun,
                            ],
                        }),
                    ],
                    borders: { top: { style: "none" }, bottom: { style: "none" }, left: { style: "none" }, right: { style: "none" } },
                }),
            ],
        });
    };

    const infoTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
            createInfoRow("NAME OF OWNER", applicant.nameOfOwner || "AWDAW", false),
            createInfoRow("ADDRESS", applicant.address || "_________________________________________"),
            createInfoRow("BUSINESS NAME", applicant.businessName || "AWDAW"),
            createInfoRow("LINE OF BUSINESS", applicant.lineOfBusiness || "1212312"),
            createInfoRow("KIND OF ORGANISATION", applicant.kindOfOrganisation || "_________________________________________"),
            createInfoRow("BUSINESS ADDRESS", applicant.businessAddress || "_________________________________________"),
        ],
        borders: { top: { style: "none" }, bottom: { style: "none" }, left: { style: "none" }, right: { style: "none" } },
    });
    // --- END: Permit Body Info Table ---

    // --- START: Collections Table ---
    const collectionsTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({ text: "NATURE OF COLLECTION", bold: true, alignment: AlignmentType.CENTER })],
                        borders: { 
                            top: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
                            bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" } 
                        },
                    }),
                    new TableCell({
                        children: [new Paragraph({ text: "AMOUNT", bold: true, alignment: AlignmentType.CENTER })],
                        borders: { 
                            top: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
                            bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" } 
                        },
                    }),
                ],
            }),
            // Data Row 1: BUSINESS TAX (Using total as placeholder)
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph({ text: "BUSINESS TAX", spacing: { before: 50, after: 50 } })] }),
                    new TableCell({ children: [new Paragraph({ text: formatPeso(total) || "₱ 17,374,235.55", alignment: AlignmentType.RIGHT, spacing: { before: 50, after: 50 } })] }),
                ],
            }),
            // Data Row 2: MAYOR'S PERMIT (Fixed fee example)
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph({ text: "MAYOR'S PERMIT", spacing: { before: 50, after: 50 } })] }),
                    new TableCell({ children: [new Paragraph({ text: "₱ 500.00", alignment: AlignmentType.RIGHT, spacing: { before: 50, after: 50 } })] }),
                ],
            }),
            // Add empty rows for the form's appearance (3 more needed)
            ...Array.from({ length: 3 }).map(() => new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph({ text: " ", spacing: { before: 50, after: 50 } })] }),
                    new TableCell({ children: [new Paragraph({ text: " ", spacing: { before: 50, after: 50 } })] }),
                ],
                borders: { 
                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" } 
                },
            })),
        ],
        borders: {
            left: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            // Individual row borders will handle top/bottom of the main data block
        },
        columnWidths: [7000, 3000],
    });
    // --- END: Collections Table ---

    // --- START: Footer/Signature/Notes ---
    const signatory = new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 800, after: 0 },
        children: [
            new TextRun({ text: "HON. ARCADIO B. GAPANGADA, JR., MNS", bold: true, size: 24 }),
        ],
    });

    const signatoryTitle = new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 0, before: 0 },
        children: [
            new TextRun({ text: "CITY MAYOR", size: 20 }),
        ],
    });
    
    // IMPORTANT heading in red
    const importantHeading = new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 400, after: 0 },
        children: [
            new TextRun({ text: "IMPORTANT", bold: true, color: redColor, size: 22 }),
        ],
    });

    // Notes using smaller font and center alignment
    const notes = [
        "Violation of any provision of ordinance No. 2012, otherwise known as the “2012 REVISED REVENUE CODE OF THE CITY OF SAN PABLO” as amended, shall cause revocation of this permit and forfeiture of all sums paid for rights granted in addition to the penalties provided for.",
        "ITO AY DAPAT IPASIL SA HAYAG NA POOK NG KALAKALAN AT DAPAT IPAKITA SA SANDALING HINGIN NG MGA KINAUUKULAN MAY KAPANGYARIHAN. ITO AY DAPAT IPASIL SA HAYAG NA POOK NG KALAKALAN AT DAPAT IPAKITA SA SANDALING HINGIN NG MGA KINAUUKULAN MAY KAPANGYARIHAN.",
        "This must be posted on conspicuous place and presented upon demand by proper authorities. This must be posted on conspicuous place and presented upon demand by proper authorities.",
    ].map(text => new Paragraph({
        text: text,
        alignment: AlignmentType.JUSTIFIED,
        spacing: { before: 100, after: 100 },
        children: [new TextRun({ text: text, size: 18 })],
    }));

    const finalFooter = new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 300, after: 0 },
        children: [
            new TextRun({ text: "ANY ALTERATION AND /OR ERASURE WILL INVALID THIS PERMIT.", bold: true }),
        ],
    });
    // --- END: Footer/Signature/Notes ---


    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: {
                        font: "Arial", 
                        size: 20, // 10pt equivalent
                    },
                },
            },
        },
        sections: [
            {
                children: [
                    headerTable,
                    
                    // Introductory Paragraph
                    new Paragraph({
                        alignment: AlignmentType.LEFT,
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: "Pursuant to City Ordinance No. 2012-40, s of 2012, also known as the “2012 Revenue Code of the City of San Pablo,” as amended, BUSINESS LICENSE and MAYOR’S PERMIT is hereby granted to:", size: 20 }),
                        ],
                    }),

                    // Info Table
                    infoTable,
                    
                    // Spacer
                    new Paragraph({ text: " ", spacing: { after: 200 } }), 

                    // Collections Table
                    collectionsTable,
                    
                    // Expiration Note
                    new Paragraph({
                        alignment: AlignmentType.LEFT,
                        spacing: { before: 200, after: 200 },
                        children: [
                            new TextRun({ text: "This Permit shall take effect upon approval until December 31, 2025 unless sooner revoked for cause and shall be reviewed on or before January 20, 2026", size: 20 }),
                        ],
                    }),
                    
                    // Signatory
                    signatory,
                    signatoryTitle,

                    // Important Notes
                    importantHeading,
                    ...notes,

                    // Final Footer
                    finalFooter,
                ],
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Mayors_Permit_San_Pablo.docx");
  };

  return (
    <Button variant="contained" color="success" onClick={exportDocx}>
      Export Mayor's Permit to Word (Revised)
    </Button>
  );
}

export default BusinessTaxDocxExport;