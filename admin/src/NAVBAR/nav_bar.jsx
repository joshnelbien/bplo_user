import { useState, useEffect } from "react";
import { Box, Typography, alpha, Avatar, Button } from "@mui/material";

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

function TopBar() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "90px",
        backgroundColor: "#1d5236",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        p: 2,
        boxSizing: "border-box",
        color: "white",
        boxShadow: 3,
        zIndex: 1100,
        position: "fixed",
        top: 0,
        left: 0,
        right: 35,
      }}
    >
      {" "}
      {/* LEFT - Clock */} <LiveClock /> {/* Spacer */}{" "}
      <Box sx={{ flexGrow: 1 }} /> {/* RIGHT - Email, Button, Avatar */}{" "}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, pr: 2 }}>
        {" "}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          {" "}
          <Typography sx={{ fontWeight: 500, lineHeight: 1 }}>
            {" "}
            example@gmail.com{" "}
          </Typography>{" "}
          {/* Added Button */}{" "}
          <Button
            variant="contained"
            size="small"
            sx={{
              mt: 0.5,
              mx: 2,
              fontSize: "0.7rem",
              padding: "2px 8px",
              backgroundColor: "#296f48",
              "&:hover": { backgroundColor: "#1e5635" },
            }}
          >
            {" "}
            View Details{" "}
          </Button>{" "}
        </Box>{" "}
        <Avatar
          alt="User Pic"
          src="https://i.pravatar.cc/40"
          sx={{ width: 38, height: 38, border: "2px solid white" }}
        />{" "}
      </Box>{" "}
    </Box>
  );
}

export default TopBar;
