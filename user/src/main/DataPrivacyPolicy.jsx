import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Slide, Paper } from "@mui/material";

export default function DataPrivacyPolicy() {
  const [open, setOpen] = useState(false);
  const [isGray, setIsGray] = useState(false);

  // 🔹 Check storage on page load
  useEffect(() => {
    const accepted = sessionStorage.getItem("privacyAccepted");
    const rejected = localStorage.getItem("privacyRejected");

    if (accepted === "true") {
      // Already accepted → no popup, no grayscale
      setOpen(false);
      setIsGray(false);
    } else if (rejected === "true") {
      // Rejected before → show popup again, keep grayscale
      setOpen(true);
      setIsGray(true);
    } else {
      // First time visiting → show popup
      setOpen(true);
      setIsGray(true);
    }
  }, []);

  // 🔹 Accept handler
  const handleAccept = () => {
    sessionStorage.setItem("privacyAccepted", "true");
    localStorage.removeItem("privacyRejected");
    setIsGray(false);
    setOpen(false);
  };

  // 🔹 Reject handler
  const handleReject = () => {
    localStorage.setItem("privacyRejected", "true");
    setIsGray(true);
    setOpen(false); // hide snackbar
  };

  // 🔹 Overlay effect (grayscale + disable clicks)
  useEffect(() => {
    let overlay = document.getElementById("grayOverlay");

    if (isGray) {
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "grayOverlay";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.background = "rgba(255, 255, 255, 0.30)";
        overlay.style.backdropFilter = "grayscale(1)";
        overlay.style.zIndex = "9998";
        overlay.style.pointerEvents = "all"; // block all clicks
        document.body.appendChild(overlay);
      }
    } else {
      if (overlay) overlay.remove();
    }

    return () => {
      if (overlay) overlay.remove();
    };
  }, [isGray]);

  return (
    <Slide
      direction="up"
      in={open}
      mountOnEnter
      unmountOnExit
      timeout={{ enter: 1000, exit: 300 }} // longer for better visibility
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
          justifyContent: "center", // center content horizontally
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" }, // stack on mobile, inline on desktop
            alignItems: { xs: "stretch", md: "center" }, // stretch buttons on mobile
            justifyContent: "space-between",
            gap: 2,
            width: "100%",
            maxWidth: "1200px", // optional: limit max width on desktop
            mx: "auto", // center horizontally on desktop
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
              flexDirection: { xs: "column", sm: "row" }, // stacked on mobile, inline on desktop
              gap: 2,
              mt: { xs: 2, md: 0 },
              alignItems: "center",
              minWidth: { md: "200px" }, // optional: make desktop buttons container a bit wider
              justifyContent: { md: "flex-end" }, // push buttons to right on desktop
            }}
          >
            <Button
              variant="outlined"
              onClick={handleReject}
              sx={{
                borderColor: "#09360D",
                color: "#09360D",
                "&:hover": { backgroundColor: "#f5f5f5" },
                width: { xs: "100%", sm: "auto" }, // full width on mobile
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
                width: { xs: "100%", sm: "auto" }, // full width on mobile
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
