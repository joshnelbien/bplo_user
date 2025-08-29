import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Chip,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  alpha,
  Modal,
  Button,
  Typography,
} from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import RoomIcon from "@mui/icons-material/Room";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import GiteIcon from "@mui/icons-material/Gite";
import NatureIcon from "@mui/icons-material/Nature";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import BusinessIcon from "@mui/icons-material/Business";

// Define a common style for all list items
const listItemStyle = {
  borderRadius: "8px",
  my: 0.5,
  "&:hover": {
    backgroundColor: alpha("#1a7322", 0.1),
  },
};

// Define a style for the active list item
const activeListItemStyle = {
  ...listItemStyle,
  backgroundColor: alpha("#1a7322", 0.2),
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: alpha("#1a7322", 0.3),
  },
};

// Define a list of menu items with their text, path, and icon component
const menuItems = [
  { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  {
    text: "New Application",
    path: "/new_records",
    icon: <AssignmentTurnedInIcon />,
  },
  {
    text: "Renew Application",
    path: "/renew_records",
    icon: <AutorenewIcon />,
  },
  // { text: "Business Profile", path: "/profile", icon: <AccountCircleIcon /> },
];

// Define a list of department items for the dropdown menu
const departmentItems = [
  { text: "OBO", path: "/obo", icon: <BusinessIcon /> },
  { text: "CHO", path: "/cho", icon: <LocalHospitalIcon /> },
  { text: "CMSWO", path: "/cmswo", icon: <FamilyRestroomIcon /> },
  { text: "ZONING", path: "/zoning", icon: <RoomIcon /> },
  { text: "CENRO", path: "/cenro", icon: <NatureIcon /> },
];

// Adjusted drawer width to be slightly wider
const drawerWidth = 270;

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 300, md: 400 },
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  outline: "none",
};

function Side_bar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [openDept, setOpenDept] = useState(false); // State for the dropdown menu
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false); // State for logout confirmation dialog

  // Check if the screen size is mobile
  const isMobile = useMediaQuery("(max-width:768px)");

  // Handle online/offline status changes
  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  const handleLogout = () => {
    setOpenLogoutDialog(true);
  };

  const confirmLogout = () => {
    navigate("/");
    setOpenLogoutDialog(false);
  };

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Increased SPC Logo size slightly and removed the line under it */}
        <img
          src="/spclogo.png"
          alt="SPC Logo"
          style={{ width: "100px", height: "100px", objectFit: "contain" }}
        />
      </Box>
      <List sx={{ p: 2, flexGrow: 1 }}>
        {/* Main Menu Items */}
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (isMobile) setOpenDrawer(false);
              }}
              sx={
                location.pathname === item.path
                  ? activeListItemStyle
                  : listItemStyle
              }
            >
              <ListItemIcon
                sx={{
                  color: "#1a7322", // Always green
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}

        {/* Dropdown Section */}
        <ListItemButton
          onClick={() => setOpenDept(!openDept)}
          sx={listItemStyle}
        >
          <ListItemIcon>
            <ExpandMore
              sx={{
                color: "#1a7322", // Always green
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            />
          </ListItemIcon>
          <ListItemText primary="Backroom" />
          {openDept ? (
            <ExpandLess sx={{ color: "#1a7322" }} />
          ) : (
            <ExpandMore sx={{ color: "#1a7322" }} />
          )}
        </ListItemButton>
        <Collapse in={openDept} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {departmentItems.map((dept) => (
              <ListItem key={dept.text} disablePadding>
                <ListItemButton
                  sx={{
                    pl: 4,
                    ...(location.pathname === dept.path
                      ? activeListItemStyle
                      : listItemStyle),
                  }}
                  onClick={() => {
                    navigate(dept.path);
                    if (isMobile) setOpenDrawer(false);
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "#1a7322", // Always green
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    {dept.icon}
                  </ListItemIcon>
                  <ListItemText primary={dept.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>

      {/* Logout Button at the bottom */}
      <Box sx={{ p: 2, pt: 0 }}>
        <Divider sx={{ my: 1, borderColor: "transparent" }} />{" "}
        {/* Removed outline from the divider */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              ...listItemStyle,
              bgcolor: "#F76C6C", // Changed color to #F76C6C
              "&:hover": { bgcolor: "#E61414" }, // Changed hover color to #E61414
              border: "none", // Removed outline from logout button
            }}
          >
            <ListItemIcon>
              <LogoutIcon
                sx={{
                  color: "white",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              sx={{ color: "white", fontWeight: "bold" }}
            />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Container for the online/offline status chip in the top right corner */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          right: 0,
          p: 2,
          zIndex: (theme) => theme.zIndex.drawer + 2,
        }}
      >
        <Chip
          icon={isOnline ? <WifiIcon /> : <WifiOffIcon />}
          label={isOnline ? "Online" : "Offline"}
          color={isOnline ? "primary" : "default"}
          sx={{
            color: isOnline ? "white" : "black",
            backgroundColor: isOnline ? "#4caf50" : "#bdbdbd",
          }}
        />
      </Box>

      {/* Drawer for Sidebar */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? openDrawer : true}
          onClose={() => setOpenDrawer(false)}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "white",
              boxShadow: "2px 0 5px rgba(0, 0, 0, 0.2)", // Added shadow to the right side
              borderRight: "none", // Removed outline
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Logout Confirmation Dialog */}
      <Modal
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
        aria-labelledby="logout-modal-title"
        aria-describedby="logout-modal-description"
      >
        <Box sx={modalStyle}>
          <IconButton
            onClick={() => setOpenLogoutDialog(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "grey.500",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.2) rotate(90deg)",
                color: "error.main",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            id="logout-modal-description"
            sx={{ mt: 2, mb: 3, textAlign: "center" }}
          >
            Are you sure you want to log out?
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="contained" color="success" onClick={confirmLogout}>
              Yes
            </Button>
            <Button
              variant="outlined"
              onClick={() => setOpenLogoutDialog(false)}
            >
              No
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default Side_bar;
