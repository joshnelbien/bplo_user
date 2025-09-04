import {
  Box,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

function BusinessTax_computation({ isOpen, onClose, applicant }) {
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Business Tax Computation</DialogTitle>
      <DialogContent dividers>
        <Box p={2}>
          {/* Header */}
          <Box textAlign="center" mb={2}>
            <Typography variant="h6">Republic of the Philippines</Typography>
            <Typography variant="h6">CITY OF SAN PABLO</Typography>
            <Typography variant="subtitle1" mt={1}>
              BUSINESS TAX ORDER OF PAYMENT
            </Typography>
          </Box>

          {/* Reference + Capital + Gross */}
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12}>
              <Typography>REFERENCE NO: ___________</Typography>
              <Typography>
                BUSINESS ID: {applicant?.id || "___________"}
              </Typography>
              <Typography>
                CAPITAL: {applicant?.capital || "___________"}
              </Typography>
              <Typography>
                GROSS: {applicant?.gross || "___________"}
              </Typography>
            </Grid>
          </Grid>

          {/* Business Info */}
          <Box mb={2} border={1} borderColor="grey.400" p={2}>
            <Typography>
              NAME OF OWNER: {applicant?.owner || "(FNAME MNAME LNAME)"}
            </Typography>
            <Typography>
              BUSINESS NAME: {applicant?.businessName || "___________"}
            </Typography>
            <Typography>
              BUSINESS ADDRESS: {applicant?.address || "___________"}
            </Typography>
            <Typography>
              NATURE OF BUSINESS: {applicant?.nature || "___________"}
            </Typography>
          </Box>

          {/* Nature of Collection Table */}
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>NATURE OF COLLECTION</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>AMOUNT</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  "BUSINESS TAX",
                  "MAYOR’S PERMIT",
                  "BARANGAY FEE",
                  "OCCUPATIONAL TAX",
                  "HEALTH, CER & SSF",
                  "SWM GARBAGE FEE",
                  "OBBO",
                  "SANITARY INSPECTION",
                  "BUILDING INSPECTION",
                  "MECHANICAL INSPECTION",
                  "ELECTRICAL INSPECTION",
                  "SIGNBOARD/BILLBOARD",
                  "ELECTRONIC INSPECTION",
                  "DELIVERY VAN",
                  "SURCHARGE",
                  "INTEREST",
                  "TINPLATE/STICKER FEE",
                  "VERIFICATION FEE",
                  "ZONING FEE",
                  "CENRO",
                  "SEWMO CERT",
                  "VETERNARY FEE",
                  "FIXED TAX",
                  "VIDEOKE CARABET DANCEHALL",
                  "CIGARETTES",
                  "LIQUOR",
                  "BILLIARDS",
                  "BOARD AND LOGGING",
                  "FSC FEE",
                ].map((item) => (
                  <TableRow key={item}>
                    <TableCell>{item}</TableCell>
                    <TableCell align="right">₱ ______</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Totals */}
          <Box mb={2}>
            <Typography>Other Charges total: ₱ ______</Typography>
            <Typography>Total: ₱ ______</Typography>
          </Box>

          {/* Amount in Words + Service Vehicle + Mode of Payment */}
          <Box mb={2} border={1} borderColor="grey.400" p={2}>
            <Typography>AMOUNT IN WORDS: ________________________</Typography>
            <Typography>No. Of Service Vehicle: ___________</Typography>
            <Typography>Mode of Payment: ___________</Typography>
          </Box>

          {/* Footer */}
          <Box mt={4}>
            <Typography>Computed By: ___________</Typography>
            <Typography textAlign="right" mt={2}>
              (Treasurer)
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Close
        </Button>
        <Button color="primary" variant="contained">
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default BusinessTax_computation;
