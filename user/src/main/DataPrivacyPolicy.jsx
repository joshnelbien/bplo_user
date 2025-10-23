import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Slide, Paper } from "@mui/material";

export default function DataPrivacyPolicy() {
  const [open, setOpen] = useState(false);
  const [isGray, setIsGray] = useState(false);
  const [blockClicks, setBlockClicks] = useState(false);

  // 🔹 Check storage on page load
  useEffect(() => {
    localStorage.removeItem("privacyRejected");

    const accepted = sessionStorage.getItem("privacyAccepted");
    const rejected = localStorage.getItem("privacyRejected");

    if (accepted === "true") {
      setOpen(false);
      setIsGray(false);
      setBlockClicks(false);
    } else if (rejected === "true") {
      setOpen(true);
      setIsGray(true);
      setBlockClicks(true); // grayscale and block clicks after reject
    } else {
      setOpen(true);
      setIsGray(false);
      setBlockClicks(true); // first visit → block page until user chooses
    }
  }, []);

  // 🔹 Accept handler
  const handleAccept = () => {
    sessionStorage.setItem("privacyAccepted", "true");
    localStorage.removeItem("privacyRejected");
    setIsGray(false);
    setBlockClicks(false);
    setOpen(false);
  };

  // 🔹 Reject handler
  const handleReject = () => {
    localStorage.setItem("privacyRejected", "true");
    setIsGray(true);
    setBlockClicks(true);
    setOpen(false);
  };

  // 🔹 Overlay effect (grayscale + disable clicks)
  useEffect(() => {
    let overlay = document.getElementById("grayOverlay");

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "grayOverlay";
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.zIndex = "9998";
      document.body.appendChild(overlay);
    }

    overlay.style.background = isGray
      ? "rgba(255, 255, 255, 0.30)"
      : "transparent";
    overlay.style.backdropFilter = isGray ? "grayscale(1)" : "none";
    overlay.style.pointerEvents = blockClicks ? "all" : "none";

    return () => {
      if (overlay) overlay.remove();
    };
  }, [isGray, blockClicks]);

  return (
    <Slide
      direction="up"
      in={open}
      mountOnEnter
      unmountOnExit
      timeout={{ enter: 1000, exit: 300 }}
    >
      <Paper
        elevation={6}
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#fff",
          borderTop: "1px solid #ddd",
          p: 3,
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
            gap: 2,
            width: "100%",
            maxWidth: "1200px",
            mx: "auto",
            mt: { xs: 2, md: 0 },
          }}
        >
          {/* Text */}
          <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
            <Typography variant="h6" fontWeight="bold">
              Data Privacy Policy
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              The City Government of San Pablo values your privacy and is
              dedicated to protecting your personal data in compliance with the
              Data Privacy Act (DPA) of 2012 (Republic Act No. 10173).{" "}
              <a
                href="https://sanpablocity.gov.ph/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#09360D", textDecoration: "underline" }}
              >
                Read More
              </a>
            </Typography>
          </Box>

          {/* Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mt: { xs: 2, md: 0 },
              alignItems: "center",
              minWidth: { md: "200px" },
              justifyContent: { md: "flex-end" },
            }}
          >
            <Button
              variant="outlined"
              onClick={handleReject}
              sx={{
                borderColor: "#09360D",
                color: "#09360D",
                "&:hover": { backgroundColor: "#f5f5f5" },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Reject All
            </Button>
            <Button
              variant="contained"
              onClick={handleAccept}
              sx={{
                backgroundColor: "#09360D",
                "&:hover": { backgroundColor: "#07270a" },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Accept All
            </Button>
          </Box>
        </Box>
      </Paper>
    </Slide>
  );
}
