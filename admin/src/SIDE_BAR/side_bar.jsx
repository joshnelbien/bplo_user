import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {
  AppBar,
  Box,
  Chip,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

function Side_bar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [openDept, setOpenDept] = useState(false); // ✅ for dropdown

  // Detect if screen is small (mobile)
  const isMobile = useMediaQuery("(max-width:768px)");

  // Online/Offline handler
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
    navigate("/");
  };

  const menuItems = [
    { text: "Dashboard", path: "/dashboard" },
    { text: "New Application", path: "/new_records" },
    { text: "Renew Application", path: "/renew_records" },
    { text: "Profile", path: "/profile" },
  ];

  const departmentItems = [
    { text: "OBO", path: "/obo" },
    { text: "CHO", path: "/cho" },
    { text: "CMSWO", path: "/cmswo" },
    { text: "ZONING", path: "/zoning" },
    { text: "CENRO", path: "/cenro" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      {/* ✅ Top NavBar with Online/Offline */}
      <AppBar
        color="success"
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setOpen(true)}
              sx={{ mr: 2 }}
            >
              ☰
            </IconButton>
          )}

          {/* Brand */}
          <Typography variant="h6" noWrap>
            My Application
          </Typography>

          {/* Online/Offline Status */}
          <Chip
            icon={isOnline ? <WifiIcon /> : <WifiOffIcon />}
            label={isOnline ? "Online" : "Offline"}
            color={isOnline ? "primary" : "default"}
            variant="contained"
          />
        </Toolbar>
      </AppBar>

      {/* Drawer for Sidebar */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? open : true}
        onClose={() => setOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setOpen(false);
                }}
              >
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}

          {/* ✅ Dropdown Section */}
          <ListItemButton onClick={() => setOpenDept(!openDept)}>
            <ListItemText primary="Backroom" />
            {openDept ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openDept} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {departmentItems.map((dept) => (
                <ListItem key={dept.text} disablePadding>
                  <ListItemButton
                    sx={{ pl: 4 }} // indent inside dropdown
                    onClick={() => {
                      navigate(dept.path);
                      if (isMobile) setOpen(false);
                    }}
                  >
                    <ListItemText primary={dept.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>

          <Divider sx={{ my: 1 }} />

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                handleLogout();
                if (isMobile) setOpen(false);
              }}
            >
              <ListItemText primary="Log Out" sx={{ color: "red" }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}

export default Side_bar;
