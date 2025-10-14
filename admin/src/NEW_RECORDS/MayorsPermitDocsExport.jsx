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
    BorderStyle,
    HeadingLevel,
    Media,
    ImageRun,
} from "docx";

// =================================================================
// NOTE: Utility functions remain the same
// =================================================================

// Function to create a cell with solid borders (for the main container)
const createBorderedCell = (children, widthSize, verticalAlign = VerticalAlign.TOP) => {
    return new TableCell({
        children: children,
        verticalAlign: verticalAlign,
        width: { size: widthSize, type: WidthType.PERCENTAGE },
        margins: { top: 100, bottom: 100, left: 100, right: 100 }, // Minimal internal padding
        borders: {
            top: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
            bottom: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
        },
    });
};

// Function for a simple text paragraph with no spacing
const createNoSpacingPara = (text, isBold = false, size = 22, alignment = AlignmentType.LEFT) => {
    return new Paragraph({
        alignment: alignment,
        spacing: { after: 0, before: 0 },
        children: [
            new TextRun({ text: text, bold: isBold, size: size }),
        ],
    });
};

function MayorsPermit({
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

    // Convert number to words
    function numberToWords(num) {
        if (num === 0) return "zero";
        const belowTwenty = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
        const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
        const thousands = ["", "thousand", "million", "billion"];

        function helper(n) {
            if (n === 0) return "";
            else if (n < 20) return belowTwenty[n] + " ";
            else if (n < 100) return tens[Math.floor(n / 10)] + " " + helper(n % 10);
            else return belowTwenty[Math.floor(n / 100)] + " hundred " + helper(n % 100);
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
            words += (pesos > 0 ? " and " : "") + numberToWords(centavos) + " centavos";
        }
        return words || "zero";
    }

    // Function to load image as Uint8Array for docx
    const loadImageAsUint8Array = async (imagePath) => {
        try {
            console.log('Loading image from:', imagePath);
            const response = await fetch(imagePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            console.log('Image loaded successfully, size:', arrayBuffer.byteLength);
            return new Uint8Array(arrayBuffer);
        } catch (error) {
            console.error('Error loading image:', error);
            return null;
        }
    };

    // Function to create image data for docx
    const createImageData = async (imagePath) => {
        try {
            const imageData = await loadImageAsUint8Array(imagePath);
            if (!imageData) return null;
            
            return {
                data: imageData,
                type: imagePath.endsWith('.png') ? "png" : "jpg"
            };
        } catch (error) {
            console.error('Error creating image data:', error);
            return null;
        }
    };

    // ✅ Generate DOCX file
    const exportDocx = async () => {
        const validCollections = collections.filter(
            (item) => item.amount && Number(item.amount) > 0
        );

        // Load images
        const bagongPilipinasImageData = await createImageData('/bagongpilipinas.png');
        const spcLogoImageData = await createImageData('/spclogo.png');
        // Load the e-signature image data for the Mayor
        const eSignatureImageData = await createImageData('/esignature.png');
        // Load the specific signature image for Oria
        const oriaSignatureImageData = await createImageData('/oria_sig.png'); 
        
        console.log('Bagong Pilipinas image loaded:', !!bagongPilipinasImageData);
        console.log('SPC Logo image loaded:', !!spcLogoImageData);
        console.log('Mayor e-Signature image loaded:', !!eSignatureImageData); 
        console.log('Oria e-Signature image loaded:', !!oriaSignatureImageData); 

        // --- Custom Styles for the Mayor's Permit Document ---
        const DARK_GREEN = "1D5A2E"; 
        const FIELD_LABEL_WIDTH = 30;
        const FIELD_VALUE_WIDTH = 70;

        // --- 1. Top Header Table (Logos, Permit Number) ---
        const topHeaderTable = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                new TableRow({
                    children: [
                        // Logo (Left) - 25%
                        new TableCell({
                            width: { size: 25, type: WidthType.PERCENTAGE },
                            verticalAlign: VerticalAlign.CENTER,
                            children: bagongPilipinasImageData ? [
                                new Paragraph({
                                    alignment: AlignmentType.LEFT,
                                    children: [
                                        new ImageRun({
                                            data: bagongPilipinasImageData.data,
                                            transformation: {
                                                width: 80,
                                                height: 80,
                                            },
                                        }),
                                    ],
                                })
                            ] : [new Paragraph({ text: "[Bagong Pilipinas Logo]", alignment: AlignmentType.LEFT })],
                            borders: { top: BorderStyle.NONE, bottom: BorderStyle.NONE, left: BorderStyle.NONE, right: BorderStyle.NONE },
                        }),
                        // Center Text with SPC Logo - 50%
                        new TableCell({
                            width: { size: 50, type: WidthType.PERCENTAGE },
                            verticalAlign: VerticalAlign.CENTER,
                            children: [
                                ...(spcLogoImageData ? [
                                    new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        children: [
                                            new ImageRun({
                                                data: spcLogoImageData.data,
                                                transformation: {
                                                    width: 100,
                                                    height: 100,
                                                },
                                            }),
                                        ],
                                    })
                                ] : [new Paragraph({ text: "[SPC Logo]", alignment: AlignmentType.CENTER })]),
                                createNoSpacingPara("OFFICE OF THE MAYOR", true, 24, AlignmentType.CENTER),
                                createNoSpacingPara("BUSINESS PERMIT AND LICENSING DIVISION", true, 22, AlignmentType.CENTER),
                            ],
                            borders: { top: BorderStyle.NONE, bottom: BorderStyle.NONE, left: BorderStyle.NONE, right: BorderStyle.NONE },
                        }),
                        // Permit Number (Right) - 25%
                        new TableCell({
                            width: { size: 25, type: WidthType.PERCENTAGE },
                            verticalAlign: VerticalAlign.TOP,
                            children: [
                                createNoSpacingPara("2025", true, 48, AlignmentType.RIGHT),
                                createNoSpacingPara(applicant?.PermitNumber || "00000", true, 36, AlignmentType.RIGHT),
                                createNoSpacingPara("PERMIT NUMBER", true, 16, AlignmentType.RIGHT),
                            ],
                            borders: { top: BorderStyle.NONE, bottom: BorderStyle.NONE, left: BorderStyle.NONE, right: BorderStyle.NONE },
                        }),
                    ],
                }),
            ],
        });

        // --- 2. MAYOR'S PERMIT Banner (FIXED) ---
        const mayorPermitBanner = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            columnSpan: 3, // ⬅️ FIX: Span all three columns to force full width
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    spacing: { before: 100, after: 100 },
                                    children: [
                                        new TextRun({ text: "MAYOR'S PERMIT", bold: true, size: 36, color: "FFFFFF" }),
                                    ],
                                }),
                            ],
                            shading: { fill: DARK_GREEN }, 
                            borders: { top: BorderStyle.NONE, bottom: BorderStyle.NONE, left: BorderStyle.NONE, right: BorderStyle.NONE },
                            margins: { top: 0, bottom: 0, left: 0, right: 0 } // Minimize internal cell margins
                        }),
                    ],
                }),
            ],
        });

        // --- 3. Business Info Table (6 Rows) ---
        const createInfoRow = (label, value) => new TableRow({
            children: [
                new TableCell({
                    width: { size: FIELD_LABEL_WIDTH, type: WidthType.PERCENTAGE },
                    children: [createNoSpacingPara(label, true, 20)],
                    borders: { top: BorderStyle.SINGLE, bottom: BorderStyle.SINGLE, left: BorderStyle.SINGLE, right: BorderStyle.SINGLE },
                    margins: { top: 50, bottom: 50, left: 100, right: 100 },
                }),
                new TableCell({
                    width: { size: FIELD_VALUE_WIDTH, type: WidthType.PERCENTAGE },
                    children: [createNoSpacingPara(value, false, 20)],
                    borders: { top: BorderStyle.SINGLE, bottom: BorderStyle.SINGLE, left: BorderStyle.SINGLE, right: BorderStyle.SINGLE },
                    margins: { top: 50, bottom: 50, left: 100, right: 100 },
                }),
            ],
        });

        const fullName = `${applicant.firstName || ""} ${applicant.middleName || ""} ${applicant.lastName || ""}`;

        const infoTable = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                createInfoRow("NAME OF OWNER:", fullName),
                createInfoRow("ADDRESS:", applicant?.address || "___________"),
                createInfoRow("BUSINESS NAME:", applicant?.businessName || "___________"),
                createInfoRow("LINE OF BUSINESS:", applicant?.lineOfBusiness || "___________"), 
                createInfoRow("KIND OF ORGANIZATION:", applicant?.kindOfOrganization || "___________"), 
                createInfoRow("BUSINESS ADDRESS:", applicant?.barangay || "___________"),
            ],
        });

        // --- 4. Collection Table (Two Columns, main body) ---
        const collectionRows = validCollections.map(
            (item) =>
                new TableRow({
                    children: [
                        new TableCell({
                            children: [createNoSpacingPara(item.label)],
                            margins: { top: 50, bottom: 50, left: 100, right: 100 },
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    text: formatPeso(Number(item.amount)),
                                    alignment: AlignmentType.RIGHT,
                                    spacing: { after: 0, before: 0 }
                                }),
                            ],
                            margins: { top: 50, bottom: 50, left: 100, right: 100 },
                        }),
                    ],
                })
        );

        // Add Total Row
        if (total > 0) {
            collectionRows.push(new TableRow({
                children: [
                    new TableCell({
                        children: [createNoSpacingPara("TOTAL", true)],
                        margins: { top: 50, bottom: 50, left: 100, right: 100 },
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.RIGHT,
                                spacing: { after: 0, before: 0 },
                                children: [
                                    new TextRun({ text: formatPeso(total), bold: true }) 
                                ]
                            }),
                        ],
                        margins: { top: 50, bottom: 50, left: 100, right: 100 },
                    }),
                ]
            }));
        }

        const collectionTable = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                // Header Row
                new TableRow({
                    children: [
                        new TableCell({
                            children: [createNoSpacingPara("NATURE OF COLLECTION", true, 22)],
                            borders: { top: BorderStyle.SINGLE, bottom: BorderStyle.SINGLE, left: BorderStyle.SINGLE, right: BorderStyle.SINGLE },
                        }),
                        new TableCell({
                            children: [createNoSpacingPara("AMOUNT", true, 22, AlignmentType.RIGHT)],
                            borders: { top: BorderStyle.SINGLE, bottom: BorderStyle.SINGLE, left: BorderStyle.SINGLE, right: BorderStyle.SINGLE },
                        }),
                    ],
                }),
                ...collectionRows,
            ],
        });

        // --- 5. Dual Signature Block (Mayor and Licensing Officer) ---
        const signatureBlock = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                new TableRow({
                    children: [
                        // --- Left Cell: Licensing Officer's Signature ---
                        new TableCell({
                            width: { size: 50, type: WidthType.PERCENTAGE },
                            children: [
                                // Oria signature image
                                ...(oriaSignatureImageData ? [
                                    new Paragraph({
                                        alignment: AlignmentType.CENTER, 
                                        spacing: { after: 0, before: 200 },
                                        children: [
                                            new ImageRun({
                                                data: oriaSignatureImageData.data, 
                                                transformation: {
                                                    width: 150,
                                                    height: 50,
                                                },
                                            }),
                                        ],
                                    }),
                                ] : [
                                    new Paragraph({ text: " ", spacing: { after: 100, before: 100 } }) 
                                ]),

                                new Paragraph({ // Signature Line (Text)
                                    alignment: AlignmentType.CENTER,
                                    spacing: { after: 0, before: 0 },
                                    children: [
                                        new TextRun({ text: "ORIA M. BAÑAGALE", bold: true }),
                                        new TextRun({ break: 1, text: "LICENSING OFFICER IV CHIEF, BPLO", size: 16 }),
                                    ],
                                }),
                            ],
                            borders: { top: BorderStyle.NONE, bottom: BorderStyle.NONE, left: BorderStyle.NONE, right: BorderStyle.NONE },
                        }),
                        // --- Right Cell: Mayor's Signature ---
                        new TableCell({
                            width: { size: 50, type: WidthType.PERCENTAGE },
                            children: [
                                // Mayor signature image
                                ...(eSignatureImageData ? [
                                    new Paragraph({
                                        alignment: AlignmentType.CENTER, 
                                        spacing: { after: 0, before: 200 },
                                        children: [
                                            new ImageRun({
                                                data: eSignatureImageData.data,
                                                transformation: {
                                                    width: 150,
                                                    height: 50,
                                                },
                                            }),
                                        ],
                                    }),
                                ] : [
                                    new Paragraph({ text: " ", spacing: { after: 100, before: 100 } }) 
                                ]),

                                new Paragraph({ // Signature Line (Text)
                                    alignment: AlignmentType.CENTER, 
                                    spacing: { after: 0, before: 0 },
                                    children: [
                                        new TextRun({ text: "HON. ARCADIO B. GAPANGADA JR., MNSA", bold: true }),
                                        new TextRun({ break: 1, text: "CITY MAYOR", size: 16 }),
                                    ],
                                        
                                }),
                            ],
                            borders: { top: BorderStyle.NONE, bottom: BorderStyle.NONE, left: BorderStyle.NONE, right: BorderStyle.NONE },
                        }),
                    ],
                }),
            ],
        });

        // --- The Main Document Structure Table (replicates the green frame and white content) ---
        const mainDocTable = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                // Header Row (Top Green Margin)
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({ text: " " })],
                            shading: { fill: DARK_GREEN },
                            borders: { top: BorderStyle.NONE, bottom: BorderStyle.NONE, left: BorderStyle.NONE, right: BorderStyle.NONE },
                            height: { value: 200, rule: 'exact' } 
                        }),
                    ]
                }),
                // Body Row (White Content Area)
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                topHeaderTable,
                                mayorPermitBanner, // The fixed banner
                                new Paragraph({
                                    text: `Pursuant to City Ordinance No. 2012-40, s. of 2012, also known as the "2012 Revenue Code of the City of San Pablo", as amended, BUSINESS LICENSE and MAYOR'S PERMIT is hereby granted to:`,
                                    alignment: AlignmentType.LEFT,
                                    spacing: { before: 200, after: 200 },
                                    children: [
                                        new TextRun({ break: 1, text: `BUSINESS ID: ${applicant?.BIN || "___________"}`, bold: true }),
                                        new TextRun({ break: 1, text: `REFERENCE NO: ${applicant?.referenceNo || "___________"}`, bold: true }),
                                    ]
                                }),

                                infoTable,

                                new Paragraph({ text: " " }), // Spacer

                                collectionTable,

                                signatureBlock, // Contains the dual signature block now

                                new Paragraph({ // Important Footer Text
                                    spacing: { before: 200, after: 200 },
                                    children: [
                                        new TextRun({
                                            text: "This Permit shall take effect upon approval until December 31, 2025 unless sooner revoked for cause and shall be renewed on or before January 20, 2026",
                                            italics: true,
                                            size: 20
                                        }),
                                        new TextRun({
                                            break: 2,
                                            text: "IMPORTANT",
                                            bold: true,
                                            size: 24,
                                            alignment: AlignmentType.CENTER
                                        }),
                                        new TextRun({
                                            break: 1,
                                            text: "Violation of any provision of ordinance No. 2012, otherwise known as the \"2012 REVISED REVENUE CODE OF THE CITY OF SAN PABLO\" as amended, shall cause revocation of this permit and forfeiture of all sums paid for rights granted in addition to the penalties provided for.",
                                            size: 18,
                                            alignment: AlignmentType.JUSTIFIED
                                        }),
                                        new TextRun({
                                            break: 2,
                                            text: "ITO AY DAPAT IPASIKIL SA HAYAG NA POOK NG KALAKALAN AT DAPAT IPARAMDAM SA SANDALING HINGIN NG MGA KINAUUKULAN MAY KARAPATAN.",
                                            bold: true,
                                            size: 18,
                                            alignment: AlignmentType.CENTER
                                        }),
                                        new TextRun({
                                            break: 1,
                                            text: "This must be posted on conspicuous place and be persented upon demand by proper authorities.",
                                            italics: true,
                                            size: 18,
                                            alignment: AlignmentType.CENTER
                                        }),
                                    ]
                                }),
                            ],
                            borders: { top: BorderStyle.NONE, bottom: BorderStyle.NONE, left: BorderStyle.NONE, right: BorderStyle.NONE },
                        }),
                    ],
                }),
                // Footer Row (Bottom Green Margin and Text)
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    spacing: { before: 100, after: 100 },
                                    children: [
                                        new TextRun({ text: "ANY ALTERATION AND /OR ERASURE WILL INVALID THIS PERMIT.", bold: true, color: "FFFFFF" }),
                                    ],
                                }),
                            ],
                            shading: { fill: DARK_GREEN },
                            borders: { top: BorderStyle.NONE, bottom: BorderStyle.NONE, left: BorderStyle.NONE, right: BorderStyle.NONE },
                        }),
                    ],
                }),
            ],
            // The outer table has a thick green border to replicate the frame
            borders: {
                top: { style: BorderStyle.SINGLE, size: 24, color: DARK_GREEN },
                bottom: { style: BorderStyle.SINGLE, size: 24, color: DARK_GREEN },
                left: { style: BorderStyle.SINGLE, size: 24, color: DARK_GREEN },
                right: { style: BorderStyle.SINGLE, size: 24, color: DARK_GREEN },
            },
        });

        const doc = new Document({
            // Set document page margins to zero or very small to allow the border table to take up maximum space
            sections: [{
                properties: {
                    page: {
                        margin: {
                            top: 100,
                            right: 100,
                            bottom: 100,
                            left: 100,
                        },
                    },
                },
                children: [mainDocTable],
            }],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, "Mayor_s_Permit.docx");
    };

    return (
        <Button variant="contained" color="success" onClick={exportDocx}>
            Export to Word
        </Button>
    );
}

export default MayorsPermit;