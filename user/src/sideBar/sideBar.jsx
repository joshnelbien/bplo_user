import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  Drawer,
  Fade,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Modal,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // ✅ correct import

const logo = "/spclogo.png";

const Sidebar = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ get id from URL
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState({ firstName: "", lastName: "", email: "" });
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
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
          lastName: data.lastname,
          email: data.email,
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [id, API]); // ✅ depend on id

  // Logout modal handlers
  const handleLogoutOpen = () => setOpenLogoutModal(true);
  const handleLogoutClose = () => setOpenLogoutModal(false);
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
            mb: 3,
            borderRadius: "50%",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            mx: "auto",
            display: "block",
          }}
        />
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{
            mb: 4,
            p: 2,
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            bgcolor: "#f5f5f5",
          }}
        >
          <Avatar sx={{ width: 56, height: 56, bgcolor: "#2E8B57" }}>
            {user?.firstName && user?.lastName
              ? `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`
              : "?"}
          </Avatar>
          <Box>
            <Typography variant="body1">
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {user?.email}
            </Typography>
          </Box>
        </Stack>

        {/* Navigation */}
        <List component="nav">
          <ListItemButton onClick={() => navigate(`/newApplicationPage/${id}`)}>
            <ListItemIcon>
              <AddCircleOutlineIcon sx={{ color: "#2E8B57" }} />
            </ListItemIcon>
            <ListItemText primary="New Application" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate(`/renew/${id}`)}>
            <ListItemIcon>
              <AutorenewIcon sx={{ color: "#2E8B57" }} />
            </ListItemIcon>
            <ListItemText primary="Renew Application" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate(`/appTracker/${id}`)}>
            <ListItemIcon>
              <AssignmentTurnedInIcon sx={{ color: "#2E8B57" }} />
            </ListItemIcon>
            <ListItemText primary="Application Status" />
          </ListItemButton>
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
