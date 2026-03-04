import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Slide,
  Paper,
  Modal,
  Fade,
  Backdrop,
} from "@mui/material";

export default function DataPrivacyPolicy() {
  const [open, setOpen] = useState(false);
  const [isGray, setIsGray] = useState(false);
  const [blockClicks, setBlockClicks] = useState(false);
  const [showRedirectModal, setShowRedirectModal] = useState(false);

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
      setBlockClicks(true);
    } else {
      setOpen(true);
      setIsGray(false);
      setBlockClicks(true);
    }
  }, []);

  // 🔹 Accept handler → show modal instead of just closing banner
  const handleAccept = () => {
    sessionStorage.setItem("privacyAccepted", "true");
    localStorage.removeItem("privacyRejected");
    setIsGray(false);
    setBlockClicks(false);
    setOpen(false);
    setShowRedirectModal(true); // ← show the new modal
  };

  // 🔹 Reject handler (unchanged)
  const handleReject = () => {
    localStorage.setItem("privacyRejected", "true");
    setIsGray(true);
    setBlockClicks(true);
    setOpen(false);
  };

  // 🔹 Close the redirect/info modal
  const handleCloseRedirectModal = () => {
    setShowRedirectModal(false);
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
    <>
      {/* Privacy Banner */}
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

      {/* Redirect / System Notice Modal */}
      <Modal
        open={showRedirectModal}
        onClose={handleCloseRedirectModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={showRedirectModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: 480 },
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              outline: "none",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" component="h2" fontWeight="bold" gutterBottom>
              Important Notice
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, mt: 2 }}>
              This system is no longer used for BPLMS transactions.<br /><br />
              We are now using the <strong>eGov system</strong>.<br />
              To start your business registration or renewal, please proceed to
              the official eGov portal of the City Government of San Pablo.
            </Typography>

            <Button
              variant="contained"
              onClick={handleCloseRedirectModal}
              sx={{
                backgroundColor: "#09360D",
                "&:hover": { backgroundColor: "#07270a" },
                px: 5,
              }}
            >
              OK
            </Button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
// import React, { useEffect, useState } from "react";
// import { Box, Button, Typography, Slide, Paper } from "@mui/material";

// export default function DataPrivacyPolicy() {
//   const [open, setOpen] = useState(true);
//   const [isGray, setIsGray] = useState(true);
//   const [blockClicks, setBlockClicks] = useState(true);

//   // 🔹 Always block the site
//   useEffect(() => {
//     setOpen(true);
//     setIsGray(true);
//     setBlockClicks(true);
//   }, []);

//   // 🔹 Overlay effect (grayscale + disable clicks)
//   useEffect(() => {
//     let overlay = document.getElementById("grayOverlay");

//     if (!overlay) {
//       overlay = document.createElement("div");
//       overlay.id = "grayOverlay";
//       overlay.style.position = "fixed";
//       overlay.style.top = "0";
//       overlay.style.left = "0";
//       overlay.style.width = "100%";
//       overlay.style.height = "100%";
//       overlay.style.zIndex = "9998";
//       document.body.appendChild(overlay);
//     }

//     overlay.style.background = "rgba(0, 0, 0, 0.45)";
//     overlay.style.backdropFilter = "grayscale(1) blur(3px)";
//     overlay.style.pointerEvents = "all";

//     return () => {
//       if (overlay) overlay.remove();
//     };
//   }, []);

//   const handleProceed = () => {
//     window.location.href = "https://e.gov.ph/";
//   };

//   return (
//     <Slide
//       direction="up"
//       in={open}
//       mountOnEnter
//       unmountOnExit={false}
//       timeout={{ enter: 600 }}
//     >
//       <Paper
//         elevation={10}
//         sx={{
//           position: "fixed",
//           bottom: 0,
//           left: 0,
//           right: 0,
//           backgroundColor: "#fff",
//           borderTop: "2px solid #09360D",
//           p: 4,
//           zIndex: 9999,
//           display: "flex",
//           justifyContent: "center",
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             textAlign: "center",
//             gap: 2,
//             width: "100%",
//             maxWidth: "700px",
//             mx: "auto",
//           }}
//         >
//           {/* Title */}
//           <Typography variant="h5" fontWeight="bold" sx={{ color: "#09360D" }}>
//             Access Notice
//           </Typography>

//           {/*Sub Title */}
//           <Typography variant="h6" fontWeight="bold" sx={{ color: "#09360D" }}>
//             Access is available only upon official request

//           </Typography>

//           {/* Message */}
//           <Typography variant="body2" sx={{ color: "#555" }}>
//             BPLMS serves as the digitalized backup system of the City Government of San Pablo for the Business Processing and Licensing Office.

//           </Typography>

//           <Typography variant="body2" sx={{ color: "#555" }}>
// To start your business registration or renewal, please proceed to the official eGov portal of the City Government of San Pablo.          </Typography>

//           {/* Button */}
//           <Box sx={{ mt: 2 }}>
//             <Button
//               variant="contained"
//               size="large"
//               onClick={handleProceed}
//               sx={{
//                 backgroundColor: "#09360D",
//                 px: 5,
//                 "&:hover": { backgroundColor: "#07270a" },
//               }}
//             >
//               Click here
//             </Button>
//           </Box>

//           <Typography variant="caption" sx={{ mt: 1, color: "#777" }}>
//             City Government of San Pablo
//           </Typography>
//         </Box>
//       </Paper>
//     </Slide>
//   );
// }
