
import CloseIcon from "@mui/icons-material/Close";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useParams } from "react-router-dom";

import Sidebar from "../sideBar/sideBar";

const reqImage = "/req.png";
const renewImage = "/renew.png";

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

const shakeAnimation = {
  "@keyframes shake": {
    "0%, 100%": { transform: "rotate(0deg)" },
    "25%": { transform: "rotate(-5deg)" },
    "75%": { transform: "rotate(5deg)" },
  },
};

const modalContents = {
  newApplication: {
    title: "REQUIREMENTS FOR NEW BUSINESS REGISTRATION",
    items: [
      { text: "- Filled-up Unified Business Permit Application Form" },
      { text: "- 1 photocopy of DTI/SEC/CDA Registration and Articles of Incorporation" },
      { text: "- Barangay Clearance (Window 1-BPLD)" },
      { text: "- Barangay Capitalization" },
      { text: "- Contract of Lease and Lessor Mayor's Permit (if rented)" },
      { text: "- Photocopy of Occupancy Permit (if newly constructed building)" },
      { text: "- Location of Business (Sketch/Map)" },
      { text: "- Land Tax Clearance/Certificate of Payment" },
      { text: "- Market Clearance (if stallholder)" },
    ],
  },
  renewal: {
    title: "REQUIREMENTS FOR BUSINESS PERMIT RENEWAL",
    items: [
      { text: "- Filled-up Unified Business Permit Application Form" },
      { text: "- Previous year's Mayor's Permit" },
      { text: "- Financial Statement/Income Tax Return of previous year" },
      { text: "- Barangay Clearance (Window 1-BPLD)" },
      { text: "- Land Tax Clearance/ Certificate of Payment" },
      { text: "- Market Clearance (if market stall holder)" },
      { text: "- Public Liability Insurance (for certain businesses)" },
    ],
  },
};

const HomePage = () => {
  const { id } = useParams();

  const [open, setOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalItems, setModalItems] = useState([]);

  const handleOpen = (type) => {
    const content = modalContents[type];
    if (content) {
      setModalTitle(content.title);
      setModalItems(content.items);
      setOpen(true);
    }
  };

  const handleClose = () => setOpen(false);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        height: "100vh",
        background: "linear-gradient(to right, #ffffff, #eaffe9)",
      }}
    >
      <Sidebar id={id} />

      {/* Main content container */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: { xs: 2, sm: 4 },
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 2, sm: 4 }}
          sx={{
            width: "100%",
            maxWidth: 900,
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {["newApplication", "renewal"].map((type) => {
            const isNew = type === "newApplication";
            const img = isNew ? reqImage : renewImage;
            const title = isNew ? "NEW APPLICATION REQ." : "RENEWAL REQ.";
            return (
              <Box
                key={type}
                onClick={() => handleOpen(type)}
                sx={{
                  width: { xs: "80%", sm: 170 },
                  maxWidth: 200,
                  height: { xs: 160, sm: 170 },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  p: 1,
                  borderRadius: "12px",
                  bgcolor: "#d2ead0",
                  cursor: "pointer",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <Box
                  component="img"
                  src={img}
                  alt={`${title} Icon`}
                  sx={{
                    width: { xs: "80%", sm: "85%" },
                    height: { xs: "80%", sm: "85%" },
                    objectFit: "contain",
                    animation: `shake 0.5s infinite alternate`,
                    ...shakeAnimation,
                  }}
                />
                <Box
                  sx={{
                    width: "110%",
                    bgcolor: "#98c293",
                    py: 1,
                    textAlign: "center",
                    borderBottomLeftRadius: "12px",
                    borderBottomRightRadius: "12px",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#fff", fontWeight: "bold" }}>
                    {title}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Box>

      {/* Requirement Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={open}>
          <Box sx={modalStyle}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">{modalTitle}</Typography>
              <Button onClick={handleClose} color="error" sx={{ minWidth: 0, p: 0 }}>
                <CloseIcon />
              </Button>
            </Box>
            <List dense>
              {modalItems.map((item, i) => (
                <ListItemButton key={i} sx={{ py: 0.5, px: 0 }}>
                  <ListItemText primary={item.text} sx={{ color: "text.secondary" }} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default HomePage;
