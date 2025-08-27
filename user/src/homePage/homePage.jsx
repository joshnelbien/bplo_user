import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
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
import Button from '@mui/material/Button'; // New import
import Modal from '@mui/material/Modal'; // New import
import Backdrop from '@mui/material/Backdrop'; // New import
import Fade from '@mui/material/Fade'; // New import
import CloseIcon from '@mui/icons-material/Close'; // New import

const logo = "spclogo.png";

// Style for the modal
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
};

function HomePage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // State for modal visibility

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  // Function to navigate and handle logout
  const handleLogout = () => {
    // Implement your logout logic here
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
      {/* Sidebar container */}
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
          {/* Logo */}
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
              display: 'block'
            }}
          />

          {/* Account Profile Section */}
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

          {/* Navigation list */}
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

        {/* Logout button */}
        <Box sx={{ p: 2, borderTop: '1px solid #E0E0E0' }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: '8px',
              bgcolor: alpha('#d32f2f', 0.1),
              '&:hover': {
                bgcolor: alpha('#d32f2f', 0.2),
              },
            }}
          >
            <ListItemIcon>
              <LogoutIcon sx={{ color: '#d32f2f' }} />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: '#d32f2f', fontWeight: 'bold' }} />
          </ListItemButton>
        </Box>
      </Paper>

      {/* Main content area */}
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

        {/* New button to open the modal */}
        <Button 
          variant="contained" 
          onClick={handleOpen} 
          sx={{ mt: 4, bgcolor: '#2E8B57', '&:hover': { bgcolor: '#006400' } }}
        >
          Renewal Requirements
        </Button>

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
                  Renewal Requirements
                </Typography>
                <Button onClick={handleClose} color="error" sx={{ minWidth: 0, p: 0 }}>
                  <CloseIcon />
                </Button>
              </Box>
              <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                To renew your application, please submit the following documents:
                <br />
                - A valid ID (e.g., driver's license, passport)
                <br />
                - Previous permit number
                <br />
                - Proof of address (utility bill, bank statement)
                <br />
                - Updated contact information
              </Typography>
            </Box>
          </Fade>
        </Modal>
      </Box>
    </Box>
  );
}

export default HomePage;