import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Checkbox,
  Button,
} from '@mui/material';
// CloseIcon import is not used in the JSX, but keeping it doesn't hurt.
import CloseIcon from '@mui/icons-material/Close'; 

const PrivacyAgreementDialog = ({ open, onAgree, onClose, onCheck, checked }) => (
  <Dialog open={open} fullWidth maxWidth="sm" disableEscapeKeyDown>
    <DialogTitle sx={{ color: "#09360D", fontWeight: "bold", borderBottom: '1px solid #eee' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          component="img"
          src="spclogo.png"
          alt="San Pablo City Logo"
          sx={{ width: 80, height: 80, mr: 2 }}
        />
        Data Privacy Consent
      </Box>
    </DialogTitle>

    <DialogContent dividers sx={{ pt: 2, maxHeight: '70vh', overflowY: 'auto' }}>
      <Typography variant="h6" gutterBottom color="#09360D" fontWeight="bold">
        ACKNOWLEDGEMENT AND DATA PRIVACY CONSENT (REPUBLIC ACT NO. 10173)
      </Typography>
      <Typography variant="body2" paragraph>
        By proceeding with this application, you acknowledge and agree to the following terms and conditions set forth by the City Government of San Pablo.
      </Typography>

      <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2, color: "#1d5236" }}>
        1. Acknowledgment of Responsibility
      </Typography>
      <Typography variant="body2" paragraph>
        I hereby certify that all information provided in this Business Permit Application System (BPLO) is true, correct, and complete to the best of my knowledge. I understand that any false or misleading information may lead to the disapproval or revocation of my business permit and subject me to applicable legal penalties.
      </Typography>

      <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2, color: "#1d5236" }}>
        2. Data Collection and Processing
      </Typography>
      <Typography variant="body2" paragraph>
        I understand that the City Government of San Pablo, through the Business Permit and Licensing Office (BPLO), will collect, process, and retain my personal and business data, solely for the purpose of processing this permit application, regulatory compliance, revenue generation, and official municipal transactions, pursuant to Republic Act No. 10173 (Data Privacy Act of 2012).
      </Typography>
      <Typography variant="body2" paragraph>
        The collected data will be treated with confidentiality and secured against unauthorized access or disclosure.
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, p: 1, border: '1px dashed #09360D', borderRadius: 1, backgroundColor: '#e8f5e9' }}>
        <Checkbox checked={checked} onChange={onCheck} required sx={{ color: "#09360D" }} />
        <Typography variant="body1" sx={{ fontWeight: 'bold', color: "#09360D" }}>
          I have read, understood, and voluntarily agree to the Acknowledgment and Data Privacy Consent.
        </Typography>
      </Box>
    </DialogContent>
    <DialogActions>
      <Button
        onClick={onAgree}
        disabled={!checked} // Only "Proceed" is disabled if not checked
        variant="contained"
        sx={{
          backgroundColor: "#09360D",
          "&:hover": { backgroundColor: "#07270a" },
          py: 1,
          px: 3
        }}
      >
        Proceed
      </Button>

      <Button
        onClick={onClose} // This button is now always active
        variant="contained"
        sx={{
          backgroundColor: "#09360D",
          "&:hover": { backgroundColor: "#07270a" },
          py: 1,
          px: 3
        }}
      >
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

export default PrivacyAgreementDialog;