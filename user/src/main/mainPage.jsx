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
  ListItemIcon,
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
    { label: "Application Status", path: "/" },
    { label: "New Business Requirements", type: "newApplication" },
    { label: "Renewal Business Requirements", type: "renewal" },
    { label: "Privacy Notice", path: "/privacy" },
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
        sx={{ mb: 2, fontWeight: "bold", color: "#09360D" }}
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
              <Button
                onClick={() => navigate("/")}
                sx={{ color: "#09360D", fontWeight: "bold" }}
              >
                Application Status
              </Button>
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
                onClick={() => navigate("/privacy")}
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
            sx={{ width: { xs: 150, sm: 120 }, mb: 2 }}
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
              typography: { xs: "1", sm: "5" },
            }}
          >
            BUSINESS REGISTRATION
          </Typography>
        </Slide>

        <Fade in={animate} timeout={2500}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" }, // Stack on mobile, row on larger screens
              gap: { xs: 2, sm: 3 },
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              px: { xs: 2, sm: 0 }, // Padding on mobile
            }}
          >
            <Button
              variant="contained"
              fullWidth={{ xs: true, sm: false }} // Full width on mobile
              sx={{
                px: { xs: 0, sm: 4 },
                py: 1.5,
                fontWeight: "bold",
                backgroundColor: "#09360D",
                color: "white",
                "&:hover": { backgroundColor: "#07270a" },
              }}
              onClick={() => navigate("/newApplicationRegister")}
            >
              New
            </Button>

            <Button
              variant="outlined"
              fullWidth={{ xs: true, sm: false }} // Full width on mobile
              sx={{
                px: { xs: 0, sm: 4 },
                py: 1.5,
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

      {/* Requirements Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal} closeAfterTransition>
        <Fade in={modalOpen}>
          <Box sx={modalStyle}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                {modalType === "newApplication"
                  ? "New Business Requirements"
                  : "Renewal Business Requirements"}
              </Typography>
              <Button onClick={handleCloseModal} sx={{ minWidth: 0, p: 0.5 }}>
                <CloseIcon />
              </Button>
            </Box>
            <List>
              {requirementsData[modalType]?.map((item, index) => (
                <ListItem key={index} sx={{ px: 1, mb: 1 }}>
                  <Checkbox
                    defaultChecked
                    disabled
                    sx={{ "&.Mui-disabled": { color: "success.main" } }}
                  />
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
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
          v2.
        </Typography>
      </Box>
    </Box>
  );
}

export default App;
