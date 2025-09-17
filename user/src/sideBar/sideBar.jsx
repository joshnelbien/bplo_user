/* eslint-disable react-hooks/exhaustive-deps */
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
import { useNavigate } from "react-router-dom";

const logo = "/spclogo.png";

const Sidebar = ({ id }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState({ firstName: "", lastName: "", email: "" });
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const API = import.meta.env.VITE_API_BASE;

  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const response = await fetch(`${API}/userAccounts/me/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user");

        const data = await response.json();
        setUser({
          firstName: data.firstname,
          lastName: data.lastname,
          email: data.email,
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

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
          {/* New Application */}
          <ListItemButton
            onClick={() => navigate(`/newApplicationPage/me`)}
            sx={{
              borderRadius: "8px",
              mb: 1,
              bgcolor: alpha("#076e0cff", 0.1),
              "&:hover": { bgcolor: alpha("#085f0cff", 0.2) },
            }}
          >
            <ListItemIcon>
              <AddCircleOutlineIcon sx={{ color: "#2E8B57" }} />
            </ListItemIcon>
            <ListItemText
              primary="New Application"
              sx={{ fontWeight: "bold" }}
            />
          </ListItemButton>

          {/* Renew Application */}
          <ListItemButton
            onClick={() => navigate(`/renew/me`)}
            sx={{
              borderRadius: "8px",
              mb: 1,
              bgcolor: alpha("#076e0cff", 0.1),
              "&:hover": { bgcolor: alpha("#085f0cff", 0.2) },
            }}
          >
            <ListItemIcon>
              <AutorenewIcon sx={{ color: "#2E8B57" }} />
            </ListItemIcon>
            <ListItemText
              primary="Renew Application"
              sx={{ fontWeight: "bold" }}
            />
          </ListItemButton>

          {/* Application Tracker */}
          <ListItemButton
            onClick={() => navigate(`/appTracker/me`)}
            sx={{
              borderRadius: "8px",
              mb: 1,
              bgcolor: alpha("#2E8B57", 0.1),
              "&:hover": { bgcolor: alpha("#2E8B57", 0.2) },
            }}
          >
            <ListItemIcon>
              <AssignmentTurnedInIcon sx={{ color: "#2E8B57" }} />
            </ListItemIcon>
            <ListItemText
              primary="Application Status"
              sx={{ fontWeight: "bold" }}
            />
          </ListItemButton>
        </List>
      </Box>

      {/* Logout */}
      <Box sx={{ p: 2, borderTop: "1px solid #E0E0E0" }}>
        <ListItemButton
          onClick={handleLogoutOpen}
          sx={{
            borderRadius: "8px",
            bgcolor: "#be0606ff",
            "&:hover": { bgcolor: "#ce0000ff" },
          }}
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

      {/* Logout Confirmation Modal */}
      <Modal
        open={openLogoutModal}
        onClose={handleLogoutClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={openLogoutModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "80%", sm: 400 },
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" mb={2}>
              Are you sure you want to log out?
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                color="error"
                onClick={handleConfirmLogout}
              >
                Yes
              </Button>
              <Button variant="outlined" onClick={handleLogoutClose}>
                No
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>
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
