// src/components/announcement.jsx
import React from "react";
import {
  Box,
  Typography,
  Modal,
  Fade,
  Backdrop,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CampaignIcon from "@mui/icons-material/Campaign";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 600 },
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
              Special Announcements
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
              ann && (ann.text || ann.title) ? (
                <Box
                  key={ann.id || index}
                  sx={{
                    p: 2.5,
                    mb: 2,
                    borderRadius: "12px",
                    bgcolor: "#f9fff9",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  {/* Title/Text */}
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                    color="text.primary"
                  >
                    {ann.title || ann.text}
                  </Typography>

                  {/* Dates */}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: ann.attachedImageBlob ? 1.5 : 0.5,
                    }}
                  >
                    <AccessTimeIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                    {ann.startDate
                      ? new Date(ann.startDate).toLocaleDateString()
                      : "N/A"}{" "}
                    –{" "}
                    {ann.endDate
                      ? new Date(ann.endDate).toLocaleDateString()
                      : "N/A"}
                  </Typography>

                  {/* Image if attached */}
                  {ann.attachedImageBlob && (
                    <Box sx={{ textAlign: "center" }}>
                      <img
                        src={`data:image/jpeg;base64,${ann.attachedImageBlob}`}
                        alt="Announcement Attachment"
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                          borderRadius: "8px",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        }}
                      />
                    </Box>
                  )}
                </Box>
              ) : null
            )
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default AnnouncementModal;
