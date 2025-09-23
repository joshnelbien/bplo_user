import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import DescriptionIcon from "@mui/icons-material/Description";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {
  Box,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const logo = "/spclogo.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState({ firstName: "", lastName: "", email: "" });
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [openRequirements, setOpenRequirements] = useState(false); // ✅ state for dropdown
  const API = import.meta.env.VITE_API_BASE;

  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!id) return;

        const response = await fetch(`${API}/userAccounts/${id}`);
        if (!response.ok) throw new Error("Failed to fetch user");

        const data = await response.json();
        setUser({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [id, API]);

  // Logout handlers
  const handleLogoutOpen = () => setOpenLogoutModal(true);
  const handleConfirmLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  const content = (
    <Paper
      elevation={8}
      sx={{
        width: { xs: 250, sm: 280 },
        maxWidth: 280,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 2,
        borderRadius: 0,
        backgroundColor: "#FFFFFF",
        height: "100%",
      }}
    >
      {/* Logo and User Info */}
      <Box>
        <Box
          component="img"
          src={logo}
          alt="SPC Logo"
          sx={{
            height: 100,
            width: 100,
            mb: 1.5,
            borderRadius: "50%",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            mx: "auto",
            display: "block",
          }}
        />

        {/* User Info */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="body1" fontWeight="bold">
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {user?.email}
          </Typography>
        </Box>

        {/* Navigation */}
        <List component="nav">
          {/* Requirements Dropdown */}
          <ListItemButton onClick={() => setOpenRequirements(!openRequirements)}>
            <ListItemIcon>
              <DescriptionIcon sx={{ color: "#2E8B57" }} />
            </ListItemIcon>
            <ListItemText primary="Requirements" />
            {openRequirements ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={openRequirements} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={() => navigate(`/requirements/new/${id}`)}
              >
                <ListItemText primary="New Application Requirements" />
              </ListItemButton>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={() => navigate(`/requirements/renewal/${id}`)}
              >
                <ListItemText primary="Renewal Application Requirements" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Box>

      {/* Logout */}
      <Box sx={{ p: 2, borderTop: "1px solid #E0E0E0" }}>
        <ListItemButton
          onClick={handleLogoutOpen}
          sx={{ bgcolor: "#be0606ff", "&:hover": { bgcolor: "#ce0000ff" } }}
        >
          <ListItemIcon>
            <LogoutIcon sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            sx={{ color: "white", fontWeight: "bold" }}
          />
        </ListItemButton>
      </Box>
    </Paper>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <IconButton
        color="inherit"
        edge="start"
        onClick={toggleDrawer}
        sx={{
          display: { sm: "none" },
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 1300,
          bgcolor: "#fff",
          boxShadow: 1,
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Drawer for mobile */}
      <Drawer
        open={mobileOpen}
        onClose={toggleDrawer}
        variant="temporary"
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 280 },
        }}
      >
        {content}
      </Drawer>

      {/* Sidebar for desktop */}
      <Box sx={{ display: { xs: "none", sm: "block" }, width: 280 }}>
        {content}
      </Box>
    </>
  );
};

export default Sidebar;
