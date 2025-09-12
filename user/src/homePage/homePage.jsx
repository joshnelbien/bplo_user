// src/pages/homePage/homePage.jsx
import CloseIcon from "@mui/icons-material/Close";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sideBar/sideBar";
import AssignmentIcon from '@mui/icons-material/Assignment';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CampaignIcon from '@mui/icons-material/Campaign';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import AnnouncementModal from "../homePage/announcement";

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

const modalContents = {
  newApplication: {
    title: "REQUIREMENTS FOR NEW BUSINESS REGISTRATION",
    items: [
      { text: "- Filled-up Unified Business Permit Application Form" },
      {
        text: "- 1 photocopy of DTI/SEC/CDA Registration and Articles of Incorporation",
      },
      { text: "- Contract of Lease and Lessor Mayor's Permit (if rented)" },
      {
        text: "- Photocopy of Occupancy Permit (if newly constructed building)",
      },
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
      { text: "- Barangay Business Clearance (Window 1-BPLD)" },
      { text: "- Land Tax Clearance/ Certificate of Payment" },
      { text: "- Market Clearance (if market stall holder)" },
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
      { text: "- No Noon break." },
      { text: "- Closed on Saturdays, Sundays, and Holidays." },
    ],
  },
};

const HomePage = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalItems, setModalItems] = useState([]);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);

  const handleOpen = (type) => {
    const content = modalContents[type];
    if (content) {
      setModalTitle(content.title);
      setModalItems(content.items);
      setOpen(true);
    }
  };

  const handleClose = () => setOpen(false);

  const handleAnnouncementClick = async () => {
    try {
      // Replace with your actual API URL
      const response = await fetch("http://localhost:5000/api/announcements", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Uncomment and add authentication token if required
          // "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        console.error(`Failed to fetch announcements: ${response.status} ${response.statusText}`);
        setAnnouncements([]);
        return;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Response is not JSON:", await response.text());
        setAnnouncements([]);
        return;
      }

      const data = await response.json();
      setAnnouncements(data);
    } catch (e) {
      console.error("Error fetching announcements:", e);
      setAnnouncements([]);
    }
    setIsAnnouncementModalOpen(true);
  };

  const handleCloseAnnouncementModal = () => {
    setIsAnnouncementModalOpen(false);
  };

  const buttonStyle = {
    color: '#2A8238',
    fontWeight: 'bold',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.1)',
    },
    '& .MuiSvgIcon-root': {
      transition: 'color 0.2s',
      color: '#2A8238',
    },
    '&:hover .MuiSvgIcon-root': {
      color: '#1a5f27',
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        height: "100vh",
        background: "linear-gradient(to right, #ffffff, #eaffe9)",
      }}
    >
      <Sidebar id={userId} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: { xs: 2, sm: 4 },
          pt: { xs: 2, sm: 4 },
        }}
      >
        <Stack
          direction="row"
          spacing={{ xs: 1, sm: 2 }}
          sx={{
            width: "100%",
            maxWidth: 1200,
            justifyContent: "flex-end",
            alignSelf: "flex-end",
            mb: 2,
            flexWrap: "wrap",
          }}
        >
          <Button sx={buttonStyle} onClick={handleAnnouncementClick}>
            <CampaignIcon sx={{ mr: 1 }} />
            SPECIAL ANNOUNCEMENT
          </Button>
          <Button sx={buttonStyle}>
            <DescriptionIcon sx={{ mr: 1 }} />
            NEWS
          </Button>
          <Button sx={buttonStyle}>
            <EditIcon sx={{ mr: 1 }} />
            EDIT PROFILE
          </Button>
        </Stack>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: 900,
            mt: { xs: 12, sm: 14 },
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 3, sm: 8 }}
            sx={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              mb: { xs: 3, sm: 6 },
            }}
          >
            {["newApplication", "renewal"].map((type) => {
              let icon, title;
              if (type === "newApplication") {
                icon = <AssignmentIcon sx={{ fontSize: '3rem', color: 'white' }} />;
                title = "NEW APPLICATION REQ.";
              } else {
                icon = <AutorenewIcon sx={{ fontSize: '3rem', color: 'white' }} />;
                title = "RENEWAL REQ.";
              }
              return (
                <Box
                  key={type}
                  onClick={() => handleOpen(type)}
                  sx={{
                    width: { xs: "90%", sm: 300 },
                    height: { xs: 180, sm: 200 },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 1.5,
                    borderRadius: "16px",
                    bgcolor: "#2A8238",
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
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {icon}
                    <Typography
                      variant="body1"
                      sx={{ color: "white", fontWeight: "bold", mt: 1 }}
                    >
                      {title}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 3, sm: 8 }}
            sx={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {["Holidays", "Officehrs"].map((type) => {
              let icon, title;
              if (type === "Holidays") {
                icon = <WbSunnyIcon sx={{ fontSize: '3rem', color: 'white' }} />;
                title = "HOLIDAYS INFO.";
              } else {
                icon = <AccessTimeIcon sx={{ fontSize: '3rem', color: 'white' }} />;
                title = "OFFICE HOURS INFO.";
              }
              return (
                <Box
                  key={type}
                  onClick={() => handleOpen(type)}
                  sx={{
                    width: { xs: "90%", sm: 300 },
                    height: { xs: 180, sm: 200 },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 1.5,
                    borderRadius: "16px",
                    bgcolor: "#2A8238",
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
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {icon}
                    <Typography
                      variant="body1"
                      sx={{ color: "white", fontWeight: "bold", mt: 1 }}
                    >
                      {title}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Box>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
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
              <Typography variant="h6" fontWeight="bold">
                {modalTitle}
              </Typography>
              <Button
                onClick={handleClose}
                color="error"
                sx={{ minWidth: 0, p: 0 }}
              >
                <CloseIcon />
              </Button>
            </Box>
            <List dense>
              {modalItems.map((item, i) => (
                <Box key={i} sx={{ py: 0.5, px: 0 }}>
                  <ListItemText
                    primary={item.text}
                    sx={{ color: "text.secondary" }}
                  />
                </Box>
              ))}
            </List>
          </Box>
        </Fade>
      </Modal>

      <AnnouncementModal
        open={isAnnouncementModalOpen}
        onClose={handleCloseAnnouncementModal}
        announcements={announcements}
      />
    </Box>
  );
};

export default HomePage;