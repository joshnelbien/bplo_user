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
import RoomIcon from "@mui/icons-material/Room";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import NatureIcon from "@mui/icons-material/Nature";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import BusinessIcon from "@mui/icons-material/Business";

// Common style
const listItemStyle = {
  borderRadius: "8px",
  my: 0.5,
  "&:hover": {
    backgroundColor: alpha("#1a7322", 0.1),
  },
};

// Active style
const activeListItemStyle = {
  ...listItemStyle,
  backgroundColor: alpha("#1a7322", 0.2),
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: alpha("#1a7322", 0.3),
  },
};

// Main menu items
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
];

// Department items
const departmentItems = [
  { text: "OBO", path: "/obo", icon: <BusinessIcon /> },
  { text: "CHO", path: "/cho", icon: <LocalHospitalIcon /> },
  { text: "CSWMO", path: "/cmswo", icon: <FamilyRestroomIcon /> },
  { text: "ZONING", path: "/zoning", icon: <RoomIcon /> },
  { text: "CENRO", path: "/cenro", icon: <NatureIcon /> },
];

// Treasurers dropdown items
const treasurers = [
  { text: "Treasurer's Office", path: "/treasurer" },
  { text: "Assessor Office", path: "/examiners" },
  { text: "Business Tax", path: "/businessTax" },
];

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
  const [openDept, setOpenDept] = useState(false);
  const [openTreasurers, setOpenTreasurers] = useState(false); // ✅ new dropdown
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const isMobile = useMediaQuery("(max-width:768px)");

  // Track online/offline status
  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  // ✅ Auto-open dropdowns if path matches
  useEffect(() => {
    if (
      departmentItems.some((dept) => location.pathname.startsWith(dept.path))
    ) {
      setOpenDept(true);
    } else {
      setOpenDept(false);
    }

    if (treasurers.some((t) => location.pathname.startsWith(t.path))) {
      setOpenTreasurers(true);
    } else {
      setOpenTreasurers(false);
    }
  }, [location.pathname]);

  const handleLogout = () => setOpenLogoutDialog(true);

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
        <img
          src="/spclogo.png"
          alt="SPC Logo"
          style={{ width: "100px", height: "100px", objectFit: "contain" }}
        />
      </Box>

      <List sx={{ p: 2, flexGrow: 1 }}>
        {/* Main Menu */}
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
                  color: "#1a7322",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.1)" },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}

        {/* Backroom Dropdown */}
        <ListItemButton
          onClick={() => setOpenDept(!openDept)}
          sx={listItemStyle}
        >
          <ListItemIcon>
            <BusinessIcon sx={{ color: "#1a7322" }} />
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
                      color: "#1a7322",
                      transition: "transform 0.3s",
                      "&:hover": { transform: "scale(1.1)" },
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

        {/* Treasurer’s Dropdown */}
        <ListItemButton
          onClick={() => setOpenTreasurers(!openTreasurers)}
          sx={listItemStyle}
        >
          <ListItemIcon>
            <BusinessIcon sx={{ color: "#1a7322" }} />
          </ListItemIcon>
          <ListItemText primary="Treasurer’s Office" />
          {openTreasurers ? (
            <ExpandLess sx={{ color: "#1a7322" }} />
          ) : (
            <ExpandMore sx={{ color: "#1a7322" }} />
          )}
        </ListItemButton>

        <Collapse in={openTreasurers} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {treasurers.map((tre) => (
              <ListItem key={tre.text} disablePadding>
                <ListItemButton
                  sx={{
                    pl: 4,
                    ...(location.pathname === tre.path
                      ? activeListItemStyle
                      : listItemStyle),
                  }}
                  onClick={() => {
                    navigate(tre.path);
                    if (isMobile) setOpenDrawer(false);
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "#1a7322",
                      transition: "transform 0.3s",
                      "&:hover": { transform: "scale(1.1)" },
                    }}
                  >
                    <BusinessIcon /> {/* you can replace with unique icons */}
                  </ListItemIcon>
                  <ListItemText primary={tre.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>

      {/* Logout */}
      <Box sx={{ p: 2, pt: 0 }}>
        <Divider sx={{ my: 1, borderColor: "transparent" }} />
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              ...listItemStyle,
              bgcolor: "#F76C6C",
              "&:hover": { bgcolor: "#E61414" },
              border: "none",
            }}
          >
            <ListItemIcon>
              <LogoutIcon
                sx={{
                  color: "white",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.1)" },
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
      {/* Status chip */}
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

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? openDrawer : true}
          onClose={() => setOpenDrawer(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "white",
              boxShadow: "2px 0 5px rgba(0,0,0,0.2)",
              borderRight: "none",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Logout Modal */}
      <Modal open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)}>
        <Box sx={modalStyle}>
          <IconButton
            onClick={() => setOpenLogoutDialog(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "grey.500",
              transition: "0.3s",
              "&:hover": {
                transform: "scale(1.2) rotate(90deg)",
                color: "error.main",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ mt: 2, mb: 3, textAlign: "center" }}>
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
