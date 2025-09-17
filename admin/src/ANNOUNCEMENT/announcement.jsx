// src/pages/Announcement.jsx
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
  Divider,
  TextField,
  Modal,
  CircularProgress,
  Snackbar,
  Alert,
  InputAdornment,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Side_bar from "../SIDE_BAR/side_bar";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", sm: 600 },
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 2,
  maxHeight: "90vh",
  overflowY: "auto",
};

const Announcement = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    text: "",
    startDate: "",
    endDate: "",
    createdBy: "Admin",
    attachedImageBlob: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Confirmation dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");

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
        const base64String = reader.result.split(",")[1];
        setNewAnnouncement({
          ...newAnnouncement,
          attachedImageBlob: base64String,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Ask for confirmation
  const confirmActionHandler = (message, action) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (confirmAction) await confirmAction();
    setConfirmOpen(false);
  };

  const handleCancel = () => {
    setConfirmOpen(false);
  };

  const handleAddOrEditAnnouncement = async (e) => {
    e.preventDefault();
    if (
      newAnnouncement.text.trim() !== "" &&
      newAnnouncement.startDate &&
      newAnnouncement.endDate
    ) {
      confirmActionHandler(
        isEditing
          ? "Are you sure you want to update this announcement?"
          : "Are you sure you want to post this announcement?",
        async () => {
          const announcementData = {
            text: newAnnouncement.text,
            startDate: newAnnouncement.startDate,
            endDate: newAnnouncement.endDate,
            createdBy: newAnnouncement.createdBy,
            attachedImageBlob: newAnnouncement.attachedImageBlob,
          };

          try {
            const response = await fetch(
              isEditing
                ? `/api/announcements/${currentId}`
                : "/api/announcements",
              {
                method: isEditing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(announcementData),
              }
            );

            if (!response.ok) {
              throw new Error("Failed to save announcement.");
            }
            setNewAnnouncement({
              text: "",
              startDate: "",
              endDate: "",
              createdBy: "Admin",
              attachedImageBlob: null,
            });
            setIsModalOpen(false);
            setIsEditing(false);
            setCurrentId(null);
            await fetchAnnouncements();
          } catch (e) {
            console.error("Failed to save announcement:", e);
            setError("Failed to save announcement. Please try again.");
            setSnackbarOpen(true);
          }
        }
      );
    }
  };

  const handleDeleteAnnouncement = (id) => {
    confirmActionHandler(
      "Are you sure you want to delete this announcement?",
      async () => {
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
      }
    );
  };

  const handleEditAnnouncement = (ann) => {
  setNewAnnouncement({
    text: ann.text,
    startDate: ann.startDate,
    endDate: ann.endDate,
    createdBy: ann.createdBy,
    attachedImageBlob: ann.attachedImageBlob,
  });
  setCurrentId(ann.id);
  setIsEditing(true);
  setIsModalOpen(true);
};


  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
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
          maxWidth: "900px",
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
            onClick={() => {
              confirmActionHandler(
                "Do you want to create a new announcement?",
                () => {
                  setIsEditing(false);
                  setCurrentId(null);
                  setNewAnnouncement({
                    text: "",
                    startDate: "",
                    endDate: "",
                    createdBy: "Admin",
                    attachedImageBlob: null,
                  });
                  setIsModalOpen(true);
                }
              );
            }}
          >
            New Announcement
          </Button>
        </Box>

        {/* Announcement History */}
        <Paper
          elevation={5}
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: "12px",
            bgcolor: "#fafafa",
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{ mb: 2, fontWeight: "bold", color: "#333" }}
          >
            Announcement History
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress color="success" />
            </Box>
          ) : announcements.length === 0 ? (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: "center", py: 4 }}
            >
              No announcements found.
            </Typography>
          ) : (
            <List>
              {announcements.map((ann, index) => (
                <React.Fragment key={ann.id}>
                  <ListItem
                    disableGutters
                    sx={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                      py: 3,
                    }}
                  >
                    {/* Letter-style Paper */}
                    <Paper
                      elevation={3}
                      sx={{
                        p: { xs: 2, sm: 3, md: 4 }, // smaller padding on phones, bigger on desktop
                        width: { xs: "100%", sm: "90%", md: "80%" }, // shrink width on bigger screens
                        mx: "auto", // center horizontally
                        borderRadius: "12px",
                        backgroundColor: "#fff",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          textAlign: "right",
                          mb: 2,
                          fontStyle: "italic",
                        }}
                      >
                        {new Date(ann.startDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Typography>

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

                      {ann.attachedImageBlob && (
                        <Box sx={{ my: 2, textAlign: "center" }}>
                          <img
                            src={`data:image/jpeg;base64,${ann.attachedImageBlob}`}
                            alt="Announcement"
                            style={{
                              maxWidth: "80%",
                              borderRadius: "8px",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                            }}
                          />
                        </Box>
                      )}

                      <Typography
                        variant="body2"
                        sx={{
                          mt: 2,
                          fontStyle: "italic",
                          color: "text.secondary",
                        }}
                      >
                        Active: {new Date(ann.startDate).toLocaleDateString()} -{" "}
                        {new Date(ann.endDate).toLocaleDateString()}
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{ mt: 4, fontWeight: "medium" }}
                      >
                        Sincerely,
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: "bold", color: "#1a7322" }}
                      >
                        {ann.createdBy}
                      </Typography>
                    </Paper>

                    {/* Action buttons (outside letter) */}
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ mt: 2, alignSelf: "flex-end" }}
                    >
                      <IconButton
                        aria-label="edit"
                        onClick={() => handleEditAnnouncement(ann)}
                        sx={{
                          color: "#1976d2",
                          "&:hover": { transform: "scale(1.2)" },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDeleteAnnouncement(ann.id)}
                        sx={{
                          color: "#d32f2f",
                          "&:hover": { transform: "scale(1.2)" },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </ListItem>
                  {index < announcements.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>

        {/* Add/Edit Announcement Modal */}
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <Box
            sx={modalStyle}
            component="form"
            onSubmit={handleAddOrEditAnnouncement}
          >
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
              {isEditing ? "Edit Announcement" : "Create New Announcement"}
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              label="Announcement Message"
              value={newAnnouncement.text}
              onChange={(e) =>
                setNewAnnouncement({ ...newAnnouncement, text: e.target.value })
              }
              required
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Created By"
              value={newAnnouncement.createdBy}
              onChange={(e) =>
                setNewAnnouncement({
                  ...newAnnouncement,
                  createdBy: e.target.value,
                })
              }
              sx={{ mt: 1 }}
              required
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Start Date"
              type="date"
              value={newAnnouncement.startDate}
              onChange={(e) =>
                setNewAnnouncement({
                  ...newAnnouncement,
                  startDate: e.target.value,
                })
              }
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
              onChange={(e) =>
                setNewAnnouncement({
                  ...newAnnouncement,
                  endDate: e.target.value,
                })
              }
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
              sx={{
                mt: 2,
                bgcolor: "#1a7322",
                "&:hover": { bgcolor: "#155a1b" },
              }}
            >
              {isEditing ? "Update" : "Submit"}
            </Button>

            {/* Preview as Letter */}
            <Typography
              variant="h6"
              sx={{ mt: 4, mb: 2, fontWeight: "bold", color: "#333" }}
            >
              Preview
            </Typography>
            <Paper elevation={2} sx={{ p: 3, borderRadius: "12px" }}>
              <Typography
                variant="body2"
                sx={{ textAlign: "right", mb: 2, fontStyle: "italic" }}
              >
                {newAnnouncement.startDate
                  ? new Date(newAnnouncement.startDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )
                  : "Date here"}
              </Typography>

              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: "bold", textDecoration: "underline" }}
              >
                Subject: Official Announcement
              </Typography>

              <Typography
                variant="body1"
                sx={{ textAlign: "justify", mb: 3, whiteSpace: "pre-line" }}
              >
                {newAnnouncement.text ||
                  "Your announcement will appear here..."}
              </Typography>

              {newAnnouncement.attachedImageBlob && (
                <Box sx={{ my: 2, textAlign: "center" }}>
                  <img
                    src={`data:image/jpeg;base64,${newAnnouncement.attachedImageBlob}`}
                    alt="Preview"
                    style={{
                      maxWidth: "80%",
                      borderRadius: "8px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                    }}
                  />
                </Box>
              )}

              <Typography
                variant="body2"
                sx={{ mt: 2, fontStyle: "italic", color: "text.secondary" }}
              >
                Active:{" "}
                {newAnnouncement.startDate
                  ? new Date(newAnnouncement.startDate).toLocaleDateString()
                  : "Start"}{" "}
                -{" "}
                {newAnnouncement.endDate
                  ? new Date(newAnnouncement.endDate).toLocaleDateString()
                  : "End"}
              </Typography>

              <Typography variant="body1" sx={{ mt: 4, fontWeight: "medium" }}>
                Sincerely,
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", color: "#1a7322" }}
              >
                {newAnnouncement.createdBy}
              </Typography>
            </Paper>
          </Box>
        </Modal>

        {/* Confirmation Dialog */}
        <Dialog open={confirmOpen} onClose={handleCancel}>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogContent>
            <DialogContentText>{confirmMessage}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleConfirm} color="primary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for error messages */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Announcement;
