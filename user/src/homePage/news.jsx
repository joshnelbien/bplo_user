// src/components/announcement.jsx
import React from "react";
import {
  Box,
  Typography,
  Modal,
  Fade,
  Backdrop,
  IconButton,
  Paper,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CampaignIcon from "@mui/icons-material/Campaign";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const AnnouncementModal = ({ open, onClose, announcements }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={open}>
        <Box
          sx={{
            ...modalStyle,
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: { xs: 2, sm: 3, md: 4 },
            width: { xs: "90%", sm: "70%", md: "50%" },
            maxHeight: "80vh",
            overflowY: "auto",
            overflowX: "hidden", // 🔹 Prevent horizontal scroll
            transition: "all 0.3s ease-in-out",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              pb: 1,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <CampaignIcon sx={{ mr: 1, color: "primary.main" }} />
              Official Announcements
            </Typography>
            <Button
              onClick={onClose}
              color="error"
              sx={{
                minWidth: 0,
                p: 0.5,
                borderRadius: "50%",
                "&:hover": { bgcolor: "error.light", color: "#fff" },
              }}
            >
              <CloseIcon />
            </Button>
          </Box>

          {/* Announcements */}
          {announcements.length === 0 ? (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: "center", py: 4 }}
            >
              No announcements available.
            </Typography>
          ) : (
            announcements.map((ann, index) =>
              ann && ann.text ? (
                <Paper
                  key={ann.id || index}
                  elevation={2}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    bgcolor: "background.default",
                    "&:hover": {
                      bgcolor: "action.hover",
                      transform: "scale(1.01)",
                      transition: "0.2s ease",
                    },
                  }}
                >
                  {/* Date */}
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: "right",
                      mb: 1,
                      fontStyle: "italic",
                      color: "text.secondary",
                    }}
                  >
                    {ann.startDate
                      ? new Date(ann.startDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Date"}
                  </Typography>

                  {/* Subject */}
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mb: 1, textDecoration: "underline" }}
                  >
                    Subject: Official Announcement
                  </Typography>

                  {/* Body */}
                  <Typography
                    variant="body1"
                    sx={{
                      textAlign: "justify",
                      mb: 2,
                      whiteSpace: "pre-line",
                      wordBreak: "break-word", // 🔹 Prevents overflow
                    }}
                  >
                    {ann.text}
                  </Typography>

                  {/* Image */}
                  {ann.attachedImageBlob && (
                    <Box sx={{ my: 2, textAlign: "center" }}>
                      <img
                        src={`data:image/jpeg;base64,${ann.attachedImageBlob}`}
                        alt="Announcement"
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                          borderRadius: "8px",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                        }}
                      />
                    </Box>
                  )}

                  {/* Active Dates */}
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      fontStyle: "italic",
                      color: "text.secondary",
                    }}
                  >
                    Active:{" "}
                    {ann.startDate
                      ? new Date(ann.startDate).toLocaleDateString()
                      : "Start"}{" "}
                    -{" "}
                    {ann.endDate
                      ? new Date(ann.endDate).toLocaleDateString()
                      : "End"}
                  </Typography>

                  {/* Signature */}
                  <Typography variant="body1" sx={{ mt: 3 }}>
                    Sincerely,
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold", color: "success.main" }}
                  >
                    {ann.createdBy || "Admin"}
                  </Typography>
                </Paper>
              ) : null
            )
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default AnnouncementModal;
