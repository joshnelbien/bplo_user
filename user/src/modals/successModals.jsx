import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function SuccessModals({
  open,
  onClose,
  message = "Action completed successfully!",
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
          py={2}
        >
          {/* Icon */}
          <CheckCircleIcon
            sx={{
              fontSize: 60,
              color: "success.main",
              mb: 1,
            }}
          />

          {/* Title */}
          <Typography variant="h6" fontWeight="bold" color="success.main">
            Success
          </Typography>

          {/* Message */}
          <Typography variant="body2" color="text.secondary" mt={1}>
            {message}
          </Typography>
        </Box>
      </DialogContent>

      {/* Button */}
      <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="success"
          sx={{ minWidth: 120, borderRadius: 2 }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SuccessModals;
