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
  Divider,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import BusinessIcon from "@mui/icons-material/Business";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SecurityIcon from "@mui/icons-material/Security";

function App() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [animate, setAnimate] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: "Account", path: "/" },
    { label: "Settings", path: "/" },
    { label: "Privacy Notice", path: "/" },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", p: 2 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: "bold", color: "#09360D" }}
      >
        ONLINE BUSINESS PROCESSING
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              sx={{ textAlign: "center" }}
              onClick={() => navigate(item.path)}
            >
              <ListItemText
                primary={item.label}
                sx={{
                  "& .MuiListItemText-primary": {
                    fontWeight: "bold",
                    color: "#09360D",
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
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
          backgroundColor: "#fff",
          color: "text.primary",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
          px: { xs: -1, md: 4 },
        }}
      >
        <Toolbar>
          {isMobile ? (
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, color: "#09360D" }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: "flex", gap: 3 }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  color="inherit"
                  onClick={() => navigate(item.path)}
                  sx={{ fontWeight: "bold", color: "#09360D" }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Brand / Logo */}
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "center", sm: "flex-start" },
            }}
          >
            <img
              src="/spc.png" // your logo in the public folder
              alt="BPLO Logo"
              style={{ height: 55, width: "auto" }}
            />
          </Box>

          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              textAlign: "center",
              fontWeight: "bold",
              color: "#09360D",
              display: { xs: "none", sm: "block" },
            }}
          ></Typography>
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

      {/* Hero Section */}
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          height: "25vh",
          px: { xs: 2, md: 6 },
          textAlign: "center",
          backgroundImage: `url('/path/to/your/image.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Slide in={animate} direction="down" timeout={1000}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#09360D",
              typography: { xs: "h4", sm: "h3" },
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

        {/* ✅ New & Renewal Buttons */}
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
    </Box>
  );
}

export default App;
