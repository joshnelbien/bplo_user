// src/pages/homePage/homePage.jsx
import CloseIcon from "@mui/icons-material/Close";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import Checkbox from "@mui/material/Checkbox";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sideBar/sideBar";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CampaignIcon from "@mui/icons-material/Campaign";
import DescriptionIcon from "@mui/icons-material/Description";
import AnnouncementModal from "./news";

// Modal styles
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 500 },
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "white",
  boxShadow: "0 12px 28px rgba(0,0,0,0.25)",
  p: 4,
  borderRadius: "20px",
  border: "2px solid",
  borderImageSlice: 1,
};

// Card style
const cardStyle = {
  width: { xs: "100%", sm: 300 },
  minHeight: { xs: 200, sm: 220 }, // ✅ force same min height
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "16px",
  cursor: "pointer",
  background: "white",
  border: "3px solid transparent",
  backgroundImage:
    "linear-gradient(white, white), linear-gradient(135deg, #2A8238, #34d399)",
  backgroundOrigin: "border-box",
  backgroundClip: "content-box, border-box",
  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-8px) scale(1.03)",
    boxShadow: "0 12px 28px rgba(0,0,0,0.25)",
  },
  "& svg": {
    fontSize: "3rem",
    color: "#2A8238",
    transition: "all 0.3s ease",
  },
  "&:hover svg": {
    color: "#34d399",
    filter: "drop-shadow(0 0 6px #34d399)",
  },
};

// Modal contents
const modalContents = {
  newApplication: {
    title: "REQUIREMENTS FOR NEW BUSINESS REGISTRATION",
    items: [
      { text: "Filled-up Unified Business Permit Application Form" },
      {
        text: "1 photocopy of DTI/SEC/CDA Registration and Articles of Incorporation",
      },
      { text: "Contract of Lease and Lessor Mayor's Permit (if rented)" },
      { text: "Photocopy of Occupancy Permit (if newly constructed building)" },
      { text: "Location of Business (Sketch/Map)" },
      { text: "Land Tax Clearance/Certificate of Payment" },
      { text: "Market Clearance (if stallholder)" },
    ],
  },
  renewal: {
    title: "REQUIREMENTS FOR BUSINESS PERMIT RENEWAL",
    items: [
      { text: "Filled-up Unified Business Permit Application Form" },
      { text: "Previous year's Mayor's Permit" },
      { text: "Financial Statement/Income Tax Return of previous year/Statement of Gross" },
      { text: "Barangay Business Clearance (Window 1-BPLD)" },
      { text: "Land Tax Clearance/ Certificate of Payment" },
      { text: "Market Clearance (if market stall holder)" },
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
      const response = await fetch("http://localhost:5000/api/announcements");
      if (!response.ok) {
        setAnnouncements([]);
        return;
      }
      const data = await response.json();
      setAnnouncements(data);
    } catch {
      setAnnouncements([]);
    }
    setIsAnnouncementModalOpen(true);
  };

  const handleCloseAnnouncementModal = () => {
    setIsAnnouncementModalOpen(false);
  };

  const buttonStyle = {
    color: "#2A8238",
    fontWeight: "bold",
    borderRadius: "10px",
    px: 2,
    py: 1,
    border: "2px solid #2A8238",
    background: "white",
    transition: "all 0.3s",
    "&:hover": {
      background: "#2A8238",
      color: "white",
      transform: "scale(1.08)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    },
    "& .MuiSvgIcon-root": {
      transition: "color 0.3s",
      color: "#2A8238",
    },
    "&:hover .MuiSvgIcon-root": {
      color: "#34d399",
    },
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f9fafb" }}>
      <Sidebar id={userId} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Buttons */}
        <Stack
          direction="row"
          spacing={2}
          sx={{
            width: "100%",
            maxWidth: 1200,
            justifyContent: "flex-end",
            mb: 4,
            flexWrap: "wrap",
          }}
        >
          <Button sx={buttonStyle} onClick={handleAnnouncementClick}>
            <CampaignIcon sx={{ mr: 1 }} /> News
          </Button>
        </Stack>

        {/* Cards */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={4}
          sx={{ mb: 4 }}
        >
          {["newApplication", "renewal"].map((type) => {
            const icons = {
              newApplication: <AssignmentIcon />,
              renewal: <AutorenewIcon />,
            };
            const titles = {
              newApplication: "NEW APPLICATION REQUIREMENTS",
              renewal: "RENEWAL REQUIREMENTS",
            };
            return (
              <Box key={type} onClick={() => handleOpen(type)} sx={cardStyle}>
                {icons[type]}
                <Typography
                  fontWeight="bold"
                  mt={1}
                  sx={{
                    textAlign: "center",
                    px: 1,
                    wordWrap: "break-word",
                    fontSize: { xs: "0.9rem", sm: "1rem" }, // ✅ auto adjust font
                  }}
                >
                  {titles[type]}
                </Typography>
              </Box>
            );
          })}
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
          {["Holidays", "Officehrs"].map((type) => {
            const icons = {
              Holidays: <WbSunnyIcon />,
              Officehrs: <AccessTimeIcon />,
            };
            const titles = {
              Holidays: "HOLIDAYS INFORMATION.",
              Officehrs: "OFFICE HOURS INFORMATION.",
            };
            return (
              <Box key={type} onClick={() => handleOpen(type)} sx={cardStyle}>
                {icons[type]}
                <Typography
                  fontWeight="bold"
                  mt={1}
                  sx={{
                    textAlign: "center",
                    px: 1,
                    wordWrap: "break-word",
                  }}
                >
                  {titles[type]}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </Box>

      {/* Enhanced Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={open}>
          <Box
            sx={{
              ...modalStyle,
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: 24,
              p: { xs: 2, sm: 3, md: 4 },
              width: { xs: "90%", sm: "70%", md: "50%" },
              maxHeight: "80vh",
              overflowY: "auto",
              transition: "all 0.3s ease-in-out",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                pb: 1,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                {modalTitle}
              </Typography>
              <Button
                onClick={handleClose}
                color="error"
                sx={{
                  minWidth: 0,
                  p: 0.5,
                  borderRadius: "50%",
                  "&:hover": { bgcolor: "error.light", color: "#fff" },
                }}
              >
                <CloseIcon />
              </Button>
            </Box>

            {/* Content */}
            <List dense>
              {modalItems.map((item, i) => (
                <ListItem
                  key={i}
                  sx={{
                    px: 1,
                    borderRadius: 2,
                    mb: 1,
                    "&:hover": {
                      bgcolor: "action.hover",
                      transform: "scale(1.02)",
                      transition: "0.2s ease",
                    },
                  }}
                >
                  <Checkbox
                    defaultChecked
                    disabled
                    sx={{
                      "&.Mui-disabled": {
                        color: "success.main", // success green
                      },
                    }}
                  />
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      sx: { fontSize: { xs: "0.9rem", sm: "1rem" } },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Fade>
      </Modal>

      {/* Announcement Modal */}
      <AnnouncementModal
        open={isAnnouncementModalOpen}
        onClose={handleCloseAnnouncementModal}
        announcements={announcements}
      />
    </Box>
  );
};

export default HomePage;
