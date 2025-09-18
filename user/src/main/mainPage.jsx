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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

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
          {/* Left: Menu (mobile) or Nav Items (desktop) */}
          {isMobile ? (
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, color: "#ffffffff" }}
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

          {/* Right: Optional text */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#09360D",
              display: { xs: "none", sm: "block" },
            }}
          >
            {/* BPLO System */}
          </Typography>
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
        {/* ✅ Logo */}
        <Slide in={animate} direction="down" timeout={800}>
          <Box
            component="img"
            src="/spc.png"
            alt="Logo"
            sx={{
              width: { xs: 150, sm: 120 },
              mb: 2,
            }}
          />
        </Slide>

        {/* ✅ Heading */}
        <Slide in={animate} direction="down" timeout={1000}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 900,
              color: "#09360D",
              typography: { xs: "h4", sm: "h3" },
            }}
          >
            BUSINESS REGISTRATION
          </Typography>
        </Slide>

        {/* ✅ Subtitle */}
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

        {/* ✅ Buttons */}
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

      {/* ✅ Footer */}
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
        <Typography
          variant="body2"
          sx={{ color: "#746a6aff"}}
        >
          © {new Date().getFullYear()} Business Processing and Licensing Office | v2.
        </Typography>
      </Box>
    </Box>
  );
}

export default App;
