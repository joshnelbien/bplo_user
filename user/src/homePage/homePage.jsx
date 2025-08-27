import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import LogoutIcon from '@mui/icons-material/Logout';
import { alpha } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import CloseIcon from '@mui/icons-material/Close';

const logo = "spclogo.png";
const reqImage = "req.png";
const renewImage = "renew.png";

// Style for the modal
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 500 },
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  // I have removed the border to remove the black outline
  boxShadow: 24,
  p: 4,
  borderRadius: '12px',
};

// Define the shaking keyframes outside the component for better performance
const shakeAnimation = {
  '@keyframes shake': {
    '0%, 100%': {
      transform: 'rotate(0deg)',
    },
    '25%': {
      transform: 'rotate(-5deg)',
    },
    '75%': {
      transform: 'rotate(5deg)',
    },
  },
};

// Define the content for each modal type
const modalContents = {
  newApplication: {
    title: "REQUIREMENTS FOR NEW BUSINESS REGISTRATION",
    items: [
      { text: "- Filled-up Unified Business Permit Application Form" },
      { text: "- 1 (one) photocopy of: DTI Business Name Registration (if sole proprietor), SEC Registration and Articles of Incorporation (if corporation or partnership), CDA Registration and Articles of Cooperation (if cooperative)" },
      { text: "- Barangay Clearance (Window 1-BPLD)" },
      { text: "- Barangay Capitalization" },
      { text: "- 1 (one) photocopy of Contract of Lease and Lessor Mayor's Permit (if place of business is rented)" },
      { text: "- Photocopy of Occupancy Permit (if newly constructed building)" },
      { text: "- Location of Business (Sketch/Map)" },
      { text: "- Land Tax Clearance/Certificate of Payment" },
      { text: "- Market Clearance (if stallholder)" },
    ],
  },
  renewal: {
    title: "REQUIREMENTS FOR BUSINESS PERMIT RENEWAL",
    items: [
      { text: "- Filled-up Unified Business Permit Application Form" },
      { text: "- Previous year's Mayor's Permit" },
      { text: "- Financial Statement/Income Tax Return of the previous year/Statement of Gross Sales/Receipt" },
      { text: "- Barangay Clearance (Window 1-BPLD)" },
      { text: "- Land Tax Clearance/ Certificate of Payment" },
      { text: "- Market Clearance (if market stall holder)" },
      { text: "- Public Liability Insurance (for certain businesses)" },
    ],
  },
};

function HomePage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalItems, setModalItems] = useState([]);

  const handleOpen = (type) => {
    const content = modalContents[type];
    if (content) {
      setModalTitle(content.title);
      setModalItems(content.items);
      setOpen(true);
    }
  };

  const handleClose = () => setOpen(false);
  
  const handleLogout = () => {
    navigate("/");
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        height: '100vh', 
        overflow: 'hidden', 
        background: 'linear-gradient(to right, #ffffff, #eaffe9)'
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: { xs: '100%', sm: 280 },
          maxWidth: 280,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 2,
          borderRadius: 0,
          backgroundColor: '#FFFFFF',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
          overflowY: 'auto'
        }}
      >
        <Box>
          <Box
            component="img"
            src={logo}
            alt="SPC Logo"
            sx={{
              height: 100,
              width: 100,
              mb: 3,
              borderRadius: "50%",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              mx: 'auto',
              display: 'block',
            }}
          />
          <Stack 
            direction="row" 
            spacing={2} 
            alignItems="center" 
            sx={{ mb: 4, p: 2, border: '1px solid #e0e0e0', borderRadius: '8px', bgcolor: '#f5f5f5' }}
          >
            <Avatar sx={{ width: 56, height: 56, bgcolor: '#2E8B57' }}>JS</Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" noWrap>
                Jeremie Sotero
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                jeremiesotero@gmail.com
              </Typography>
            </Box>
          </Stack>
          <List component="nav">
            <ListItemButton
              onClick={() => navigate("/newApplicationPage")}
              sx={{
                borderRadius: '8px',
                mb: 1,
                bgcolor: alpha('#076e0cff', 0.1),
                '&:hover': {
                  bgcolor: alpha('#085f0cff', 0.2),
                },
              }}
            >
              <ListItemIcon>
                <AddCircleOutlineIcon sx={{ color: '#2E8B57' }} />
              </ListItemIcon>
              <ListItemText primary="New Application" sx={{ fontWeight: 'bold' }} />
            </ListItemButton>
            <ListItemButton
              sx={{
                borderRadius: '8px',
                mb: 1,
                bgcolor: alpha('#076e0cff', 0.1),
                '&:hover': { 
                  bgcolor: alpha('#085f0cff', 0.2),
                },
              }}
            >
              <ListItemIcon>
                <AutorenewIcon sx={{ color: '#2E8B57' }} />
              </ListItemIcon>
              <ListItemText primary="Renew Application" sx={{ fontWeight: 'bold' }} />
            </ListItemButton>
            <ListItemButton
              sx={{
                borderRadius: '8px',
                mb: 1,
                bgcolor: alpha('#2E8B57', 0.1),
                '&:hover': {
                  bgcolor: alpha('#2E8B57', 0.2),
                },
              }}
            >
              <ListItemIcon>
                <AssignmentTurnedInIcon sx={{ color: '#2E8B57' }} />
              </ListItemIcon>
              <ListItemText primary="Status Permit" sx={{ fontWeight: 'bold' }} />
            </ListItemButton>
          </List>
        </Box>
        <Box sx={{ p: 2, borderTop: '1px solid #E0E0E0' }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: '8px',
              bgcolor: '#FF6B6B',
              '&:hover': {
                bgcolor: '#E55B5B',
              },
            }}
          >
            <ListItemIcon>
              <LogoutIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: 'white', fontWeight: 'bold' }} />
          </ListItemButton>
        </Box>
      </Paper>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 4 },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        {/* Container for buttons */}
        <Stack direction="row" spacing={4} sx={{ mt: 4 }}>
          {/* New Application Requirements Button */}
          <Box
            onClick={() => handleOpen('newApplication')}
            sx={{
              width: 170,
              height: 170,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              p: 1,
              borderRadius: '12px',
              bgcolor: '#d2ead0',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
              },
            }}
          >
            <Box
              className="icon"
              component="img"
              src={reqImage}
              alt="New Application Icon"
              sx={{
                width: '85%',
                height: '85%',
                objectFit: 'contain',
                animation: `shake 0.5s infinite alternate`,
                ...shakeAnimation,
              }}
            />
            <Box
              sx={{
                width: '110%',
                bgcolor: '#98c293',
                py: 1,
                textAlign: 'center',
                borderBottomLeftRadius: '12px',
                borderBottomRightRadius: '12px',
              }}
            >
              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 'bold' }}>
                NEW APPLICATION REQ.
              </Typography>
            </Box>
          </Box>
          {/* Renewal Requirements Button */}
          <Box
            onClick={() => handleOpen('renewal')}
            sx={{
              width: 170,
              height: 170,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              p: 1,
              borderRadius: '12px',
              bgcolor: '#d2ead0',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
              },
            }}
          >
            <Box
              className="icon"
              component="img"
              src={renewImage}
              alt="Renewal Icon"
              sx={{
                width: '85%',
                height: '85%',
                objectFit: 'contain',
                animation: `shake 0.5s infinite alternate`,
                ...shakeAnimation,
              }}
            />
            <Box
              sx={{
                width: '110%',
                bgcolor: '#98c293',
                py: 1,
                textAlign: 'center',
                borderBottomLeftRadius: '12px',
                borderBottomRightRadius: '12px',
              }}
            >
              <Typography variant="body2" sx={{ color: '#fff', fontWeight: 'bold' }}>
                RENEWAL REQ.
              </Typography>
            </Box>
          </Box>
        </Stack>

        {/* Modal component */}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={open}>
            <Box sx={modalStyle}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography id="transition-modal-title" variant="h6" component="h2" fontWeight="bold">
                  {modalTitle}
                </Typography>
                <Button onClick={handleClose} color="error" sx={{ minWidth: 0, p: 0 }}>
                  <CloseIcon />
                </Button>
              </Box>
              <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                <List dense>
                  {modalItems.map((item, index) => (
                    // I have removed the ListItemIcon component to remove the empty space for the icon.
                    <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                      <ListItemText primary={item.text} sx={{ color: 'text.secondary' }} />
                    </ListItem>
                  ))}
                </List>
              </Typography>
            </Box>
          </Fade>
        </Modal>
      </Box>
    </Box>
  );
}

export default HomePage;
