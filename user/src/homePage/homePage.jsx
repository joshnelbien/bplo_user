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
const holidaysImage = "/holidays.png";
const officehoursImage = "/officehours.png";

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

const bounceAnimation = {
  "@keyframes bounce": {
    "0%, 100%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-10px)" },
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
  Holidays: {
    title: "HOLIDAY SCHEDULE INFORMATION",
    items: [
      { text: "- Offices are closed on national holidays." },
      { text: "- Local government declared holidays may also apply." },
      { text: "- Please check official announcements for updates." },
      { text: "- Applications will be processed on the next business day." },
    ],
  },
  Officehrs: {
    title: "OFFICE HOURS INFORMATION",
    items: [
      { text: "- Monday to Friday: 8:00 AM - 5:00 PM" },
      { text: "- Break time: 12:00 NN - 1:00 PM" },
      { text: "- No transactions during lunch break." },
      { text: "- Closed on Saturdays, Sundays, and Holidays." },
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
          flexDirection: "column",
          alignItems: "center",
          p: { xs: 2, sm: 4 },
          pt: { xs: 4, sm: 6 },
        }}
      >
        <Stack
          direction="row"
          spacing={{ xs: 2, sm: 4 }}
          sx={{
            width: "100%",
            maxWidth: 1200,
            justifyContent: "center",
            alignItems: "center",
            mb: 4,
          }}
        >
          {["newApplication", "renewal", "Holidays", "Officehrs"].map((type) => {
            let img, title, animation;

            if (type === "newApplication") {
              img = reqImage;
              title = "NEW APPLICATION REQ.";
              animation = shakeAnimation;
            } else if (type === "renewal") {
              img = renewImage;
              title = "RENEWAL REQ.";
              animation = bounceAnimation;
            } else if (type === "Holidays") {
              img = holidaysImage;
              title = "HOLIDAYS INFO.";
              animation = shakeAnimation;
            } else if (type === "Officehrs") {
              img = officehoursImage;
              title = "OFFICE HOURS INFO.";
              animation = bounceAnimation;
            }

            return (
              <Box
                key={type}
                onClick={() => handleOpen(type)}
                sx={{
                  width: { xs: "90%", sm: 220 },
                  maxWidth: 250,
                  height: { xs: 200, sm: 220 },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  p: 1.5,
                  borderRadius: "16px",
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
                    width: { xs: "85%", sm: "90%" },
                    height: { xs: "85%", sm: "90%" },
                    objectFit: "contain",
                    animation: type === "renewal" || type === "Officehrs" ? `bounce 0.6s infinite` : `shake 0.5s infinite alternate`,
                    ...animation,
                  }}
                />
                <Box
                  sx={{
                    width: "110%",
                    bgcolor: "#98c293",
                    py: 1.5,
                    textAlign: "center",
                    borderBottomLeftRadius: "16px",
                    borderBottomRightRadius: "16px",
                  }}
                >
                  <Typography variant="body1" sx={{ color: "#fff", fontWeight: "bold" }}>
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