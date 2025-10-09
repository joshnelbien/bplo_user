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
    Media,
    ImageRun,
    ShadingType,
} from "docx";

// Utility function to create a cell with solid borders
const createBorderedCell = (children, widthSize, verticalAlign = VerticalAlign.TOP) => {
    return new TableCell({
        children: children,
        verticalAlign: verticalAlign,
        width: { size: widthSize, type: WidthType.PERCENTAGE },
        margins: { top: 100, bottom: 100, left: 100, right: 100 },
        borders: {
            top: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
            bottom: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
        },
    });
};

// Utility function for a simple text paragraph with no spacing
const createNoSpacingPara = (text, isBold = false, size = 22, alignment = AlignmentType.LEFT, color = "000000") => {
    return new Paragraph({
        alignment: alignment,
        spacing: { after: 0, before: 0 },
        children: [
            new TextRun({ text: text, bold: isBold, size: size, color: color }),
        ],
    });
};

function BusinessTaxDocxExport({
    applicant,
    collections,
    total,
    otherChargesTotal,
}) {
    // Peso formatter
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

    // Generate DOCX file
    const exportDocx = async () => {
        const validCollections = collections.filter(
            (item) => item.amount && Number(item.amount) > 0
        );

        // Load images
        const spcLogoImageData = await createImageData('/spclogo.png');
        const eSignatureImageData = await createImageData('/samplesig.png');
        const oriaSignatureImageData = await createImageData('/samplesig.png');
        
        console.log('SPC Logo image loaded:', !!spcLogoImageData);
        console.log('Mayor e-Signature image loaded:', !!eSignatureImageData);
        console.log('Oria e-Signature image loaded:', !!oriaSignatureImageData);

        // Custom Styles
        const FIELD_LABEL_WIDTH = 30;
        const FIELD_VALUE_WIDTH = 70;

        // Header Section (Non-table)
        const headerSection = [
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
            createNoSpacingPara("Republic of the Philippines", true, 24, AlignmentType.CENTER),
            createNoSpacingPara("City of San Pablo", true, 22, AlignmentType.CENTER),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [
                                    createNoSpacingPara("BUSINESS TAX ORDER OF PAYMENT", true, 28, AlignmentType.CENTER, "FFFFFF"),
                                ],
                                shading: {
                                    fill: "D9D9D9", // Gray background
                                    type: ShadingType.SOLID,
                                },
                                borders: { top: BorderStyle.NONE, bottom: BorderStyle.NONE, left: BorderStyle.NONE, right: BorderStyle.NONE },
                            }),
                        ],
                    }),
                ],
            }),
        ];

        // Business Info Table (6 Rows)
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

        // Collection Table (Two Columns)
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
            collectionRows.push(
                new TableRow({
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
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [createNoSpacingPara("AMOUNT IN WORDS", true)],
                            margins: { top: 50, bottom: 50, left: 100, right: 100 },
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    text: amountInWords(total).toUpperCase(),
                                    alignment: AlignmentType.RIGHT,
                                    spacing: { after: 0, before: 0 }
                                }),
                            ],
                            margins: { top: 50, bottom: 50, left: 100, right: 100 },
                        }),
                    ]
                })
            );
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

        // Dual Signature Block (Mayor and Licensing Officer)
        const signatureBlock = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                new TableRow({
                    children: [
                        // Left Cell: Licensing Officer's Signature
                        new TableCell({
                            width: { size: 50, type: WidthType.PERCENTAGE },
                            children: [
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
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    spacing: { after: 0, before: 0 },
                                    children: [
                                        new TextRun({ text: "WILLIAM CARTABIO", bold: true }),
                                        new TextRun({ break: 1, text: "COMPUTED BY:", size: 16 }),
                                    ],
                                }),
                            ],
                            borders: { top: BorderStyle.NONE, bottom: BorderStyle.NONE, left: BorderStyle.NONE, right: BorderStyle.NONE },
                        }),
                        // Right Cell: Mayor's Signature
                        new TableCell({
                            width: { size: 50, type: WidthType.PERCENTAGE },
                            children: [
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
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    spacing: { after: 0, before: 0 },
                                    children: [
                                        new TextRun({ text: "LUCIO GERALDO G. CIOLO", bold: true }),
                                        new TextRun({ break: 1, text: "ACTING CITY TREASURER", size: 16 }),
                                    ],
                                }),
                            ],
                            borders: { top: BorderStyle.NONE, bottom: BorderStyle.NONE, left: BorderStyle.NONE, right: BorderStyle.NONE },
                        }),
                    ],
                }),
            ],
        });

        // Main Document Structure
        const mainDocChildren = [
            // Header Section (Non-table)
            ...headerSection,
            // Business ID and Reference No
            new Paragraph({
                alignment: AlignmentType.LEFT,
                spacing: { before: 200, after: 200 },
                children: [
                    new TextRun({ break: 1, text: `BUSINESS ID: ${applicant?.BIN || "___________"}`, bold: true }),
                    new TextRun({ break: 1, text: `REFERENCE NO: ${applicant?.referenceNo || "___________"}`, bold: true }),
                ]
            }),
            // Business Info Table
            infoTable,
            new Paragraph({ text: " " }),
            // Collection Table
            collectionTable,
            // Signature Block
            signatureBlock,
        ];

        const doc = new Document({
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
                children: mainDocChildren,
            }],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, "Business_Tax_Document.docx");
    };

    return (
        <Button variant="contained" color="success" onClick={exportDocx}>
            Export to Word
        </Button>
    );
}

export default BusinessTaxDocxExport;