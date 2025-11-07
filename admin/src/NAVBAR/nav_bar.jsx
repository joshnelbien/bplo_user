import { useEffect, useState } from "react";
import { Box, Typography, alpha, Avatar, Button } from "@mui/material";
import axios from "axios";
import ManageAccountModal from "./manage_account";

const API = import.meta.env.VITE_API_BASE;

function LiveClock() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const timeString = currentDateTime.toLocaleTimeString("en-US", timeOptions);
  const dateString = currentDateTime.toLocaleDateString("en-US", dateOptions);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        color: "white",
        pl: 2,
        ml: 35,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          lineHeight: 1,
          textShadow: `0 0 5px ${alpha("#000000", 0.5)}`,
        }}
      >
        {timeString}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: "0.8rem", opacity: 0.8 }}>
        {dateString}
      </Typography>
    </Box>
  );
}

export default function TopBar() {
  const [user, setUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${API}/adminAccounts/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
        localStorage.setItem("adminData", JSON.stringify(res.data));
      } catch (err) {
        console.log("❌ Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        height: "60px",
        backgroundColor: "#1d5236",
        display: "flex",
        alignItems: "center",
        p: 2,
        color: "white",
        position: "fixed",
        top: 0,
        zIndex: 1100,
      }}
    >
      <LiveClock />
      <Box sx={{ flexGrow: 1 }} />

      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1.5, pr: 2, mr: 5 }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography sx={{ fontWeight: 500 }}>
            {user?.Email || "..."}
          </Typography>

          <Button
            variant="contained"
            size="small"
            sx={{
              mt: 0.5,
              mx: 1,
              fontSize: "0.7rem",
              padding: "2px 8px",
              backgroundColor: "#296f48",
              "&:hover": { backgroundColor: "#1e5635" },
            }}
            onClick={() => setOpenModal(true)}
          >
            Manage Account
          </Button>
        </Box>

        <Avatar
          src={
            user?.profile
              ? `data:image/png;base64,${user.profile}`
              : "https://i.pravatar.cc/40"
          }
        />
      </Box>

      <ManageAccountModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
      />
    </Box>
  );
}
