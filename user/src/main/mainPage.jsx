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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function App() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [openRequirements, setOpenRequirements] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleToggleRequirements = () => {
    setOpenRequirements(!openRequirements);
  };

  const navItems = [
    { label: "Application Status", path: "/" },
    { label: "New Business Requirements", path: "/newApplicationRegister" },
    { label: "Renewal Business Requirements", path: "/renew" },
    { label: "Privacy Notice", path: "/privacy" },
  ];

  // Drawer (Mobile)
  // Drawer (Mobile)
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
          if (
            item.label === "New Business Requirements" ||
            item.label === "Renewal Business Requirements"
          )
            return null;

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
                onClick={() => {
                  navigate(item.path);
                  // optionally close drawer: setMobileOpen(false);
                }}
              >
                <ListItemText
                  primary={item.label}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontWeight: "normal",
                      color: "#09360D",
                      transition: "color 0.3s",
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
                  transition: "color 0.3s",
                },
              }}
            />
            {openRequirements ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
        </ListItem>

        <Collapse in={openRequirements} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 4 }}>
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
                onClick={() => navigate("/newApplicationRegister")}
              >
                <ListItemText
                  primary="New Business Requirements"
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontWeight: "normal",
                      color: "#09360D",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>

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
                onClick={() => navigate("/renew")}
              >
                <ListItemText
                  primary="Renewal Business Requirements"
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontWeight: "normal",
                      color: "#09360D",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>
      </List>
    </Box>
  );

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <Box>
      {/* Navbar */}
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "#1d5236",
          color: "text.primary",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
          px: { xs: 2, md: 4 },
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 70, md: 85 },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {isMobile ? (
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, color: "#ffffff" }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: "flex", gap: 3, flexGrow: 1 }}>
              {/* Desktop nav */}
              <Button
                onClick={() => navigate("/")}
                sx={{
                  color: "#09360D",
                  fontWeight: "bold",
                  textTransform: "none",
                }}
              >
                Application Status
              </Button>

              {/* Requirements Dropdown Desktop */}
              <Box>
                <Button
                  onClick={handleToggleRequirements}
                  sx={{
                    color: "#09360D",
                    fontWeight: "bold",
                    textTransform: "none",
                  }}
                  endIcon={
                    openRequirements ? <ExpandLessIcon /> : <ExpandMoreIcon />
                  }
                >
                  Requirements
                </Button>
                <Collapse in={openRequirements} timeout="auto" unmountOnExit>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      pl: 1,
                    }}
                  >
                    <Button
                      onClick={() => navigate("/newApplicationRegister")}
                      sx={{
                        color: "#09360D",
                        fontWeight: "normal",
                        textTransform: "none",
                        justifyContent: "flex-start",
                      }}
                    >
                      New Business Requirements
                    </Button>
                    <Button
                      onClick={() => navigate("")}
                      sx={{
                        color: "#09360D",
                        fontWeight: "normal",
                        textTransform: "none",
                        justifyContent: "flex-start",
                      }}
                    >
                      Renewal Business Requirements
                    </Button>
                  </Box>
                </Collapse>
              </Box>

              <Button
                onClick={() => navigate("")}
                sx={{
                  color: "#09360D",
                  fontWeight: "bold",
                  textTransform: "none",
                }}
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
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { width: 260 },
        }}
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

        <Fade in={animate} timeout={2000}>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: "700px",
              mb: 4,
              typography: { xs: "body1", sm: "h6" },
              whiteSpace: "pre-line",
            }}
          >
            {``}
          </Typography>
        </Fade>

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
              New
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
