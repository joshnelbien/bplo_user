import { Box, Button, Checkbox, Paper, Typography } from "@mui/material";

// ✅ Convert month number to Filipino month name
function getFilipinoMonth(monthIndex) {
  const months = [
    "Enero",
    "Pebrero",
    "Marso",
    "Abril",
    "Mayo",
    "Hunyo",
    "Hulyo",
    "Agosto",
    "Setyembre",
    "Oktubre",
    "Nobyembre",
    "Disyembre",
  ];
  return months[monthIndex];
}

// ✅ Compute zoning fee based on capital
function calculateZoningFee(capital) {
  if (capital <= 5000) {
    return "Exempted";
  } else if (capital >= 5001 && capital <= 10000) {
    return 100;
  } else if (capital >= 10001 && capital <= 50000) {
    return 200;
  } else if (capital >= 50001 && capital <= 100000) {
    return 300;
  } else {
    return ((capital - 100000) * 0.001 + 500).toFixed(2);
  }
}

function ZoningCert({ applicant }) {
  const today = new Date();
  const day = today.getDate();
  const month = getFilipinoMonth(today.getMonth());
  const year = today.getFullYear();

  const zoningFee = calculateZoningFee(applicant.capital);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 3,
        mb: 3,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "800px",
          p: 5,
          border: "2px solid black",
          borderRadius: 2,
          position: "relative",
        }}
      >
        {/* Header */}
        <Box textAlign="center" mb={3}>
          <Typography variant="h5" fontWeight="bold">
            CITY MAYOR'S OFFICE
          </Typography>
          <Typography variant="h6">San Pablo City</Typography>
          <Typography variant="h5" fontWeight="bold">
            ZONING AND LAND USE DIVISION
          </Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            PAGPAPATUNAY
          </Typography>
        </Box>

        {/* Certificate Body */}
        <Typography paragraph sx={{ textAlign: "justify", mb: 2 }}>
          ITO AY PAGPAPATUNAY na ang isang lugar na lupang matatagpuan sa
          barangay{" "}
          <b>
            <u>{applicant.barangay}</u>
          </b>
          , San Pablo City, nakatala sa pangalan ni{" "}
          <b>
            <u>
              {applicant.firstName} {applicant.lastName}
            </u>
          </b>{" "}
          ay nakakasakop sa SONANG nakatalaga sa/o para gamiting{" "}
          <b>
            <u>RES/COMM/IND/AGRI/INS</u>
          </b>
          , dahil dito ang pagtatayo ng{" "}
          <b>
            <u>{applicant.BusinessType}</u>
          </b>{" "}
          ay maaaring pahintulutan at pasubaling babawiin o patitigilin sa sandaling 
          mapatunayan naglalagay ng panganib sa PANGMADLANG KALUSUGAN AT KALIGTASAN 
          </Typography>
          <Typography>
           Ipinagkaloob ngayon ika-
          <b>
            <u>{day}</u>
          </b>{" "}
          ng{" "}
          <b>
            <u>{month}</u>
          </b>
          ,{" "}
          <b>
            <u>{year}</u>
          </b>{" "}
          kaugnay ng kanyang kahilingan para sa MAYOR'S PERMIT.
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          CAPITAL: P
          <b>
            <u>{applicant.capital}</u>
          </b>
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          ZONING FEE:{" "}
          <b>
            <u>{zoningFee === "Exempted" ? zoningFee : `P${zoningFee}`}</u>
          </b>
        </Typography>

        <Box display="flex" gap={5} mb={3} alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <Checkbox defaultChecked />
            <Typography>New</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Checkbox />
            <Typography>Renew</Typography>
          </Box>
        </Box>

        {/* Signature Section */}
        <Box mt={5} textAlign="right">
          <Typography variant="body1">For:</Typography>
          <Typography variant="body1" fontWeight="bold">
            HON. ARCADIO B. GAPANGADA, MNSA
          </Typography>
          <Typography variant="body2">City Mayor</Typography>
        </Box>

        {/* Print Button */}
        <Box mt={5} display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.print()}
          >
            Print Certificate
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default ZoningCert;
