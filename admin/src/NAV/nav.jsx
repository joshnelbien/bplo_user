import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import { AppBar, Box, Chip, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";

function Nav() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  return (
    <AppBar position="fixed" color="primary" elevation={1}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" , marginLeft:"250px"}}>
        {/* Brand Title */}
        <Typography variant="h6" noWrap>
          My Application
        </Typography>

        {/* Online/Offline Status */}
        <Box display="flex" alignItems="center" gap={1}>
          <Chip
            icon={isOnline ? <WifiIcon /> : <WifiOffIcon />}
            label={isOnline ? "Online" : "Offline"}
            color={isOnline ? "success" : "default"}
            variant="outlined"
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Nav;
