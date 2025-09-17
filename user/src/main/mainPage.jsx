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
    { label: "About", path: "/" },
    { label: "Projects", path: "/" },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#09360D" }}>
        BPLO
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
      <Box sx={{ mt: 2 }}>
        <Button
          fullWidth
          variant="text"
          sx={{ my: 1, color: "#09360D", fontWeight: "bold" }}
          onClick={() => {
            navigate("/loginPage");
            setMobileOpen(false);
          }}
        >
          Login
        </Button>
        <Button
          fullWidth
          variant="contained"
          sx={{
            fontWeight: "bold",
            backgroundColor: "#09360D",
            color: "white",
            "&:hover": {
              backgroundColor: "#07270a",
            },
          }}
          onClick={() => {
            navigate("/registerPage");
            setMobileOpen(false);
          }}
        >
          Register Account
        </Button>
      </Box>
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
          px: { xs: 1, md: 4 },
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
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              textAlign: "center",
              fontWeight: "bold",
              color: "#09360D",
              display: { xs: "none", sm: "block" },
            }}
          >
            BPLO
          </Typography>

          {!isMobile && (
            <Box sx={{ ml: "auto", display: "flex", gap: 2 }}>
              <Button
                variant="text"
                sx={{ color: "#09360D", fontWeight: "bold" }}
                onClick={() => navigate("/loginPage")}
              >
                Login
              </Button>
              <Button
                variant="contained"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#09360D",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#07270a",
                  },
                }}
                onClick={() => navigate("/registerPage")}
              >
                Register Account
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

      {/* Hero Section */}
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          height: "100vh",
          px: { xs: 2, md: 6 },
          textAlign: "center",
          background: "linear-gradient(135deg, #e9f5ee 0%, #ffffff 100%)",
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
            BUSINESS PERMIT LICENSING OFFICE
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
            {`A streamlined platform designed to simplify the process of applying for, renewing,
and managing business permits. Our system reduces bureaucracy, saves
time, and provides a transparent and efficient experience for
businesses and government agencies alike.`}
          </Typography>
        </Fade>

        <Fade in={animate} timeout={2500}>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
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
              onClick={() => navigate("/registerPage")}
            >
              Get Started
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
              onClick={() => navigate("/")}
            >
              Learn More
            </Button>
          </Box>
        </Fade>

        {/* Scroll hint */}
        <Fade in={animate} timeout={3000}>
          <Box sx={{ mt: 6, animation: "bounce 2s infinite" }}>
            <ArrowDownwardIcon sx={{ fontSize: 40, color: "#09360D" }} />
          </Box>
        </Fade>
      </Grid>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Grid container spacing={4}>
          {[
            {
              icon: <BusinessIcon sx={{ fontSize: 50, color: "#09360D" }} />,
              title: "Business Friendly",
              desc: "A seamless experience for businesses applying and renewing permits.",
            },
            {
              icon: <AccessTimeIcon sx={{ fontSize: 50, color: "#09360D" }} />,
              title: "Time Efficient",
              desc: "Save time with automated processes and reduced bureaucracy.",
            },
            {
              icon: <SecurityIcon sx={{ fontSize: 50, color: "#09360D" }} />,
              title: "Secure & Transparent",
              desc: "Trustworthy transactions for both businesses and government agencies.",
            },
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Fade in={animate} timeout={1500 + index * 500}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 4,
                    borderRadius: 3,
                    boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
                    transition: "transform 0.3s",
                    "&:hover": { transform: "translateY(-8px)" },
                  }}
                >
                  {feature.icon}
                  <Typography variant="h6" sx={{ fontWeight: "bold", mt: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {feature.desc}
                  </Typography>
                </Box>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Divider />

      {/* Footer */}
      <Box sx={{ py: 4, textAlign: "center", bgcolor: "#f9f9f9", mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} BPLO Software Solutions. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

export default App;
