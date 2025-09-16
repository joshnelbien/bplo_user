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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CampaignIcon from "@mui/icons-material/Campaign";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", sm: 600 },
  maxHeight: "85vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "16px",
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
        <Box sx={modalStyle}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ display: "flex", alignItems: "center", color: "primary.main" }}
            >
              <CampaignIcon sx={{ mr: 1 }} />
              Official Announcements
            </Typography>
            <IconButton onClick={onClose} color="error">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Announcements List */}
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
                  elevation={3}
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: "12px",
                    backgroundColor: "#fff",
                  }}
                >
                  {/* Date */}
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: "right",
                      mb: 2,
                      fontStyle: "italic",
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
                    variant="h6"
                    sx={{
                      mb: 2,
                      fontWeight: "bold",
                      textDecoration: "underline",
                    }}
                  >
                    Subject: Official Announcement
                  </Typography>

                  {/* Body */}
                  <Typography
                    variant="body1"
                    sx={{
                      textAlign: "justify",
                      mb: 3,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {ann.text}
                  </Typography>

                  {/* Image if attached */}
                  {ann.attachedImageBlob && (
                    <Box sx={{ my: 2, textAlign: "center" }}>
                      <img
                        src={`data:image/jpeg;base64,${ann.attachedImageBlob}`}
                        alt="Announcement Attachment"
                        style={{
                          maxWidth: "80%",
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
                      mt: 2,
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
                  <Typography variant="body1" sx={{ mt: 4, fontWeight: "medium" }}>
                    Sincerely,
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold", color: "#1a7322" }}
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
