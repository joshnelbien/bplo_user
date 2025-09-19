import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Grid,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
  Fade,
  Slide,
  Collapse,
  Modal,
  Checkbox,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 500 },
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "white",
  boxShadow: "0 12px 28px rgba(0,0,0,0.25)",
  p: 4,
  borderRadius: "20px",
  border: "2px solid #2A8238",
};

const requirementsData = {
  newApplication: [
    "Filled-up Unified Business Permit Application Form",
    "1 photocopy of DTI/SEC/CDA Registration and Articles of Incorporation",
    "Contract of Lease and Lessor Mayor's Permit (if rented)",
    "Photocopy of Occupancy Permit (if newly constructed building)",
    "Location of Business (Sketch/Map)",
    "Land Tax Clearance/Certificate of Payment",
    "Market Clearance (if stallholder)",
  ],
  renewal: [
    "Filled-up Unified Business Permit Application Form",
    "Previous year's Mayor's Permit",
    "Financial Statement/Income Tax Return of previous year/Statement of Gross",
    "Barangay Business Clearance (Window 1-BPLD)",
    "Land Tax Clearance/Certificate of Payment",
    "Market Clearance (if market stall holder)",
  ],
};

const privacyNotice = `
We value your privacy. The information you provide in this system will be collected,
stored, and processed solely for the purpose of business permit registration and renewal.
Your data will not be shared with third parties except as required by law or with your consent.
By continuing to use this service, you acknowledge and agree to the data privacy practices
of the Business Permit and Licensing Office.
`;

function App() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [openRequirements, setOpenRequirements] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleToggleRequirements = () => setOpenRequirements(!openRequirements);

  const handleOpenModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  const navItems = [
    { label: "New Business Requirements", type: "newApplication" },
    { label: "Renewal Business Requirements", type: "renewal" },
    { label: "Privacy Notice", type: "privacy" },
    { label: "News", type: "news" },
    
  ];

  const drawer = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        p: 1,
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 1, fontWeight: "bold", color: "#09360D" }}
      >
        ONLINE BUSINESS PROCESSING
      </Typography>
      
      <List>
        {navItems.map((item) => {
          if (item.type) return null;
          return (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                sx={{
                  justifyContent: "flex-start",
                  transition: "background-color 0.3s, color 0.3s",
                  "&:hover": {
                    backgroundColor: "#e6f2e6",
                    "& .MuiListItemText-primary": { color: "#07270a" },
                  },
                }}
                onClick={() => navigate(item.path)}
              >
                <ListItemText
                  primary={item.label}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontWeight: "normal",
                      color: "#09360D",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
        {/* Requirements Dropdown */}
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              justifyContent: "flex-start",
              transition: "background-color 0.3s, color 0.3s",
              "&:hover": {
                backgroundColor: "#e6f2e6",
                "& .MuiListItemText-primary": { color: "#07270a" },
              },
            }}
            onClick={handleToggleRequirements}
          >
            <ListItemText
              primary="Requirements"
              sx={{
                "& .MuiListItemText-primary": {
                  fontWeight: "bold",
                  color: "#09360D",
                },
              }}
            />
            {openRequirements ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openRequirements} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleOpenModal("newApplication")}>
                <ListItemText
                  primary="New Business Requirements"
                  sx={{ "& .MuiListItemText-primary": { color: "#09360D" } }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleOpenModal("renewal")}>
                <ListItemText
                  primary="Renewal Business Requirements"
                  sx={{ "& .MuiListItemText-primary": { color: "#09360D" } }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>

        <ListItem disablePadding>
          <ListItemButton onClick={() => handleOpenModal("news")}>
            <ListItemText
              primary="News"
              sx={{ "& .MuiListItemText-primary": { color: "#09360D" } }}
            />
          </ListItemButton>
        </ListItem>
        {/* Privacy Notice in Drawer */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleOpenModal("privacy")}>
            <ListItemText
              primary="Privacy Notice"
              sx={{ "& .MuiListItemText-primary": { color: "#09360D" } }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  useEffect(() => setAnimate(true), []);

  return (
    <Box>
      {/* Navbar */}
      <AppBar
        position="sticky"
        sx={{ backgroundColor: "#1d5236", px: { xs: 2, md: 4 } }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 70, md: 85 },
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {isMobile ? (
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ color: "#ffffff" }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: "flex", gap: 3, flexGrow: 1 }}>
        
              <Box>
                <Button
                  onClick={handleToggleRequirements}
                  sx={{ color: "#09360D", fontWeight: "bold" }}
                  endIcon={
                    openRequirements ? <ExpandLessIcon /> : <ExpandMoreIcon />
                  }
                >
                  Requirements
                </Button>
                <Collapse in={openRequirements} timeout="auto" unmountOnExit>
                  <Box sx={{ display: "flex", flexDirection: "column", pl: 1 }}>
                    <Button
                      onClick={() => handleOpenModal("newApplication")}
                      sx={{
                        color: "#09360D",
                        fontWeight: "normal",
                        justifyContent: "flex-start",
                      }}
                    >
                      New Business Requirements
                    </Button>
                    <Button
                      onClick={() => handleOpenModal("renewal")}
                      sx={{
                        color: "#09360D",
                        fontWeight: "normal",
                        justifyContent: "flex-start",
                      }}
                    >
                      Renewal Business Requirements
                    </Button>
                  </Box>
                </Collapse>
              </Box>
              <Button
                onClick={() => handleOpenModal("privacy")}
                sx={{ color: "#09360D", fontWeight: "bold" }}
              >
                Privacy Notice
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ "& .MuiDrawer-paper": { width: 260 } }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Grid
        container
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        sx={{
          minHeight: "85vh",
          px: { xs: 2, md: 6 },
          textAlign: "center",
          background: "#fff",
          pt: 8,
        }}
      >
        <Slide in={animate} direction="down" timeout={800}>
          <Box
            component="img"
            src="/spc.png"
            alt="Logo"
            sx={{ width: { xs: 150, sm: 120 }, mb: 5 }}
          />
        </Slide>

        <Slide in={animate} direction="down" timeout={1000}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 900,
              color: "#09360D",
              fontSize: { xs: "3.5rem", sm: "2.8rem" },
            }}
          >
            BUSINESS REGISTRATION
          </Typography>
        </Slide>

        <Fade in={animate} timeout={2500}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              sx={{
                px: 4,
                py: 1,
                fontWeight: "bold",
                backgroundColor: "#09360D",
                color: "white",
                "&:hover": { backgroundColor: "#07270a" },
              }}
              onClick={() => navigate("/newApplicationRegister")}
            >
              New Application
            </Button>

            <Button
              variant="outlined"
              sx={{
                px: 4,
                py: 1,
                fontWeight: "bold",
                borderColor: "#09360D",
                color: "#09360D",
                "&:hover": { borderColor: "#07270a", color: "#07270a" },
              }}
              onClick={() => navigate("/renew")}
            >
              Renewal
            </Button>
          </Box>
        </Fade>
      </Grid>

      {/* Requirements & Privacy Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal} closeAfterTransition>
        <Fade in={modalOpen}>
          <Box
            sx={{
              ...modalStyle,
              maxWidth: 600,
              width: "70%",
              mx: "auto",
              my: "2vh",
              p: 4,
              borderRadius: 4,
              bgcolor: "background.paper",
              boxShadow: 24,
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
                borderBottom: "3px solid",
                borderColor: "divider",
                pb: 2,
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                {modalType === "newApplication"
                  ? "New Business Requirements"
                  : modalType === "renewal"
                  ? "Renewal Business Requirements"
                  : "Privacy Notice"}
              </Typography>
              <Button onClick={handleCloseModal} sx={{ minWidth: 0, p: 1 }}>
                <CloseIcon />
              </Button>
            </Box>
            {/* Content */}
            {/* Modal Content */}
            {modalType === "privacy" ? (
              // Privacy Notice Modal
              <Box>
                <Typography variant="body1" paragraph>
                  <strong>
                    San Pablo City Business Permit and Licensing Office (BPLO)
                  </strong>{" "}
                  is committed to protecting your privacy in compliance with the{" "}
                  <strong>Data Privacy Act of 2012 (RA 10173)</strong>.
                </Typography>
                <Typography variant="body1" paragraph>
                  We collect, use, and process your personal information solely
                  for the purpose of evaluating and processing your business
                  registration and renewal applications. Rest assured that your
                  information will not be shared with unauthorized parties.
                </Typography>
                <Typography variant="body1" paragraph>
                  By submitting your application, you consent to the collection
                  and processing of your data for legitimate and legal purposes.
                </Typography>
                <Typography variant="body1" paragraph>
                  If you have questions or concerns, you may contact us at the
                  BPLO, San Pablo City Hall.
                </Typography>
                <Box sx={{ mt: 4 }}>
                  <Typography variant="body1" fontWeight="bold">
                    Sincerely,
                  </Typography>
                  <Typography variant="body1">
                    Business Permit and Licensing Office
                  </Typography>
                  <Typography variant="body1">San Pablo City</Typography>
                </Box>
              </Box>
            ) : modalType === "news" ? (
              // News Modal
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                  Latest News & Updates
                </Typography>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  📢 <strong>New Business One-Stop Shop</strong> will open on{" "}
                  <strong>October 15, 2025</strong>. All business owners are
                  invited to process their applications in the new facility.
                </Typography>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  📰 <strong>Extended Renewal Deadline:</strong> Business permit
                  renewals have been extended until{" "}
                  <strong>January 31, 2026</strong>. Avoid penalties by applying
                  early.
                </Typography>

                <Typography variant="body2">
                  💡 Stay tuned for more updates on city ordinances and new
                  digital services from the BPLO.
                </Typography>
              </Box>
            ) : (
              // Requirements Modal
              <List>
                {requirementsData[modalType]?.map((item, index) => (
                  <ListItem key={index} sx={{ px: 0, mb: 1 }}>
                    <Checkbox
                      defaultChecked
                      disabled
                      sx={{ "&.Mui-disabled": { color: "success.main" } }}
                    />
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Fade>
      </Modal>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          mt: "auto",
          py: 3,
          borderTop: "2px solid #09360D",
          textAlign: "center",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Typography variant="body2" sx={{ color: "#746a6aff" }}>
          © {new Date().getFullYear()} Business Permit and Licensing Office |
          v3.0.1
        </Typography>
      </Box>
    </Box>
  );
}

export default App;
