import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  Modal,
  CircularProgress,
  Snackbar,
  Alert,
  InputAdornment
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Side_bar from '../SIDE_BAR/side_bar';

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 400 },
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

const Announcement = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    text: "",
    startDate: "",
    endDate: "",
    createdBy: "Admin", // This should be dynamically set from user data
    attachedImageBlob: null,
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/announcements");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAnnouncements(data);
    } catch (e) {
      console.error("Failed to fetch announcements:", e);
      setError("Failed to load announcements. Please try again.");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAnnouncement({ ...newAnnouncement, attachedImageBlob: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    if (newAnnouncement.text.trim() !== "" && newAnnouncement.startDate && newAnnouncement.endDate) {
      const announcementData = {
        text: newAnnouncement.text,
        startDate: newAnnouncement.startDate,
        endDate: newAnnouncement.endDate,
        createdBy: newAnnouncement.createdBy,
        attachedImageBlob: newAnnouncement.attachedImageBlob,
      };

      try {
        const response = await fetch("/api/announcements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(announcementData),
        });

        if (!response.ok) {
          throw new Error("Failed to add announcement.");
        }
        setNewAnnouncement({ text: "", startDate: "", endDate: "", createdBy: "Admin", attachedImageBlob: null });
        setIsCreateModalOpen(false);
        await fetchAnnouncements();
      } catch (e) {
        console.error("Failed to add announcement:", e);
        setError("Failed to create announcement. Please try again.");
        setSnackbarOpen(true);
      }
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      const response = await fetch(`/api/announcements/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete announcement.");
      }
      await fetchAnnouncements();
    } catch (e) {
      console.error("Failed to delete announcement:", e);
      setError("Failed to delete announcement. Please try again.");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const openDetailModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedAnnouncement(null);
    setIsDetailModalOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        background: "linear-gradient(to bottom, #ffffff, #e6ffe6)",
        minHeight: "100vh",
      }}
    >
      <Side_bar />
      <Box
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 4 },
          maxWidth: "800px",
          mx: "auto",
        }}
      >
        {/* Add New Announcement Button */}
        <Box sx={{ mb: 4, textAlign: "left" }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#1a7322",
              "&:hover": { bgcolor: "#155a1b" },
              borderRadius: "8px",
            }}
            startIcon={<AddIcon />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            New Announcement
          </Button>
        </Box>

        {/* Announcement History */}
        <Paper elevation={5} sx={{ p: { xs: 2, sm: 4 }, borderRadius: "12px", bgcolor: "#fafafa" }}>
          <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: "bold", color: "#333" }}>
            Announcement History
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress color="success" />
            </Box>
          ) : announcements.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
              No announcements found.
            </Typography>
          ) : (
            <List>
              {announcements.map((ann, index) => (
                <React.Fragment key={ann.id}>
                  <ListItem
                    disableGutters
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAnnouncement(ann.id);
                        }}
                        sx={{
                          color: "#d32f2f",
                          transition: "transform 0.3s",
                          "&:hover": { transform: "scale(1.2)" },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                    onClick={() => openDetailModal(ann)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                      borderRadius: "8px",
                    }}
                  >
                    <ListItemText
                      primary={`Created by: ${ann.createdBy}`}
                      primaryTypographyProps={{ fontWeight: "medium" }}
                    />
                  </ListItem>
                  {index < announcements.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>

        {/* Add Announcement Modal */}
        <Modal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
          <Box sx={modalStyle} component="form" onSubmit={handleAddAnnouncement}>
            <IconButton
              onClick={() => setIsCreateModalOpen(false)}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "grey.500",
                "&:hover": { color: "error.main", transform: "scale(1.2)" },
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" component="h2" fontWeight="bold">
              Create New Announcement
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              label="Announcement Message"
              value={newAnnouncement.text}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, text: e.target.value })}
              required
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Created By"
              value={newAnnouncement.createdBy}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, createdBy: e.target.value })}
              sx={{ mt: 1 }}
              required
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Start Date"
              type="date"
              value={newAnnouncement.startDate}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, startDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ mt: 1 }}
              required
            />
            <TextField
              fullWidth
              variant="outlined"
              label="End Date"
              type="date"
              value={newAnnouncement.endDate}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, endDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ mt: 1 }}
              required
            />
            <TextField
              fullWidth
              variant="outlined"
              type="file"
              label="Attached Image"
              onChange={handleFileChange}
              InputLabelProps={{ shrink: true }}
              sx={{ mt: 1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <AttachFileIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2, bgcolor: "#1a7322", "&:hover": { bgcolor: "#155a1b" } }}
            >
              Submit
            </Button>
          </Box>
        </Modal>

        {/* Announcement Detail Modal */}
        <Modal open={isDetailModalOpen} onClose={closeDetailModal}>
          <Box sx={modalStyle}>
            <IconButton
              onClick={closeDetailModal}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "grey.500",
                "&:hover": { color: "error.main", transform: "scale(1.2)" },
              }}
            >
              <CloseIcon />
            </IconButton>
            {selectedAnnouncement && (
              <Box>
                <Typography variant="h6" component="h2" fontWeight="bold">
                  Announcement Details
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography
                  variant="body1"
                  sx={{
                    mt: 1,
                    wordWrap: 'break-word',
                    whiteSpace: 'normal',
                  }}
                >
                  **Message:** {selectedAnnouncement.text}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  **Created by:** {selectedAnnouncement.createdBy || "Unknown"}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  **Active:** {new Date(selectedAnnouncement.startDate).toLocaleDateString()} to{" "}
                  {new Date(selectedAnnouncement.endDate).toLocaleDateString()}
                </Typography>
                {selectedAnnouncement.attachedImageBlob && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={selectedAnnouncement.attachedImageBlob}
                      alt="Announcement Attachment"
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Modal>

        {/* Snackbar for error messages */}
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Announcement;