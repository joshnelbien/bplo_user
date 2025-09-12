// src/components/AnnouncementModal.jsx
import React from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItemText,
  Divider,
  Modal,
  Fade,
  Backdrop
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CampaignIcon from '@mui/icons-material/Campaign';

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 500 },
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "12px",
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
              <CampaignIcon sx={{ mr: 1 }} />
              Special Announcements
            </Typography>
            <Button
              onClick={onClose}
              color="error"
              sx={{ minWidth: 0, p: 0 }}
            >
              <CloseIcon />
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {announcements.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
              No announcements available.
            </Typography>
          ) : (
            <List dense>
              {announcements.map((ann, index) => (
                ann && ann.id && ann.text ? (
                  <Box key={ann.id} sx={{ py: 0.5, px: 0 }}>
                    <Typography variant="subtitle2" color="text.primary" fontWeight="bold">
                      {ann.text}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <AccessTimeIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                      Active: {ann.startDate ? new Date(ann.startDate).toLocaleDateString() : "N/A"} - 
                      {ann.endDate ? new Date(ann.endDate).toLocaleDateString() : "N/A"}
                    </Typography>
                    {ann.attachedImageBlob && (
                      <Box sx={{ mt: 1, mb: 1, textAlign: 'center' }}>
                        <img
                          src={`data:image/jpeg;base64,${ann.attachedImageBlob}`}
                          alt="Announcement Attachment"
                          style={{ maxWidth: "100%", height: "auto", borderRadius: '8px' }}
                        />
                      </Box>
                    )}
                    {index < announcements.length - 1 && <Divider sx={{ my: 1 }} />}
                  </Box>
                ) : null
              ))}
            </List>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default AnnouncementModal;