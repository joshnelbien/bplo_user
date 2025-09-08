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
  Alert
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

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
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Function to fetch announcements from the backend
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

  // Fetch announcements on component mount
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleAddAnnouncement = async () => {
    if (newAnnouncement.trim() !== "") {
      try {
        const response = await fetch("/api/announcements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: newAnnouncement }),
        });
        if (!response.ok) {
          throw new Error("Failed to add announcement.");
        }
        setNewAnnouncement("");
        setIsModalOpen(false);
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

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: "800px", mx: "auto" }}>
      {/* Header and Back Button */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            color: "#1a7322",
            mr: 2,
            transition: "transform 0.3s",
            "&:hover": { transform: "scale(1.1)" },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1, fontWeight: "bold", color: "#333" }}>
          Special Announcements
        </Typography>
      </Box>

      {/* Admin Only Warning */}
      <Paper elevation={3} sx={{ p: 2, mb: 4, borderRadius: "12px", bgcolor: "#fff3e0", border: "1px solid #ff9800" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FiberManualRecordIcon sx={{ color: "#ff9800", fontSize: "1rem" }} />
          <Typography variant="body1" sx={{ color: "#e65100", fontWeight: "medium" }}>
            This page is for administrators only.
          </Typography>
        </Box>
      </Paper>

      {/* Add New Announcement Button */}
      <Box sx={{ mb: 4, textAlign: "right" }}>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#1a7322",
            "&:hover": { bgcolor: "#155a1b" },
            borderRadius: "8px",
          }}
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
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
                      onClick={() => handleDeleteAnnouncement(ann.id)}
                      sx={{
                        color: "#d32f2f",
                        transition: "transform 0.3s",
                        "&:hover": { transform: "scale(1.2)" },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={ann.text}
                    secondary={new Date(ann.date).toLocaleString()}
                    primaryTypographyProps={{
                      fontWeight: "medium",
                    }}
                  />
                </ListItem>
                {index < announcements.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* Add Announcement Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box sx={modalStyle}>
          <IconButton
            onClick={() => setIsModalOpen(false)}
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
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddAnnouncement}
            sx={{ mt: 2, bgcolor: "#1a7322", "&:hover": { bgcolor: "#155a1b" } }}
          >
            Submit
          </Button>
        </Box>
      </Modal>

      {/* Snackbar for error messages */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Announcement;
