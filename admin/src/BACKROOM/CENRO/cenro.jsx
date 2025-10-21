import axios from "axios";
import { useEffect, useState } from "react";
import Side_bar from "../../SIDE_BAR/side_bar";
import CenroApplicantModal from "./cenro_modal";
import { CheckCircleOutline } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Modal,
  alpha, // Needed for TopBar styling
} from "@mui/material";

/* ================== CONSTANTS ================== */
const primaryGreen = "#1d5236";
const TOP_BAR_HEIGHT = 80; // Define height constant
const SIDE_BAR_WIDTH = 250;

/* ================== LIVE CLOCK COMPONENT (Top Bar Element) ================== */

function LiveClock() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const timeString = currentDateTime.toLocaleTimeString("en-US", timeOptions);
  const dateString = currentDateTime.toLocaleDateString("en-US", dateOptions);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        color: "white",
        pl: 2,
        // Ensures the clock starts after the fixed sidebar area
        ml: `${SIDE_BAR_WIDTH + 16}px`,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          lineHeight: 1,
          textShadow: `0 0 5px ${alpha("#000000", 0.5)}`,
        }}
      >
        {timeString}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: "0.8rem", opacity: 0.8 }}>
        {dateString}
      </Typography>
    </Box>
  );
}

/* ================== TOP BAR COMPONENT (Title only) ================== */

function TopBar() {
  return (
    <Box
      sx={{
        width: "100%",
        height: TOP_BAR_HEIGHT,
        backgroundColor: primaryGreen,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        boxSizing: "border-box",
        color: "white",
        boxShadow: 3,
        zIndex: 1100,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
      }}
    >
      {/* 1. LEFT ALIGNED: LIVE CLOCK (Offset by sidebar width) */}
      <LiveClock />

      {/* 2. CENTERED: PAGE TITLE */}
      <Typography
        variant="h5"
        component="div"
        sx={{
          fontWeight: "light",
          textShadow: `0 0 5px ${alpha("#000000", 0.5)}`,
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          display: { xs: "none", sm: "block" }, // Hide on very small screens
        }}
      >
        CENRO
      </Typography>

      {/* 3. RIGHT ALIGNED: Placeholder (keeping structure) */}
      <Box sx={{ mr: 4 }} />
    </Box>
  );
}

// ✅ Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => (
  <Modal open={isOpen} onClose={onClose}>
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
        textAlign: "center",
        outline: "none",
      }}
    >
      <Typography variant="h6" mb={2}>
        {message}
      </Typography>
      <Box display="flex" justifyContent="center" gap={2}>
        <Button variant="contained" color="success" onClick={onConfirm}>
          Yes
        </Button>
        <Button variant="outlined" onClick={onClose}>
          No
        </Button>
      </Box>
    </Box>
  </Modal>
);

// ✅ Success Modal Component
const SuccessModal = ({ isOpen, onClose, message }) => (
  <Modal open={isOpen} onClose={onClose}>
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 300,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
        textAlign: "center",
        outline: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <CheckCircleOutline sx={{ color: "green", fontSize: 60 }} />
      <Typography variant="h6" mb={2}>
        {message}
      </Typography>
      <Button variant="contained" color="success" onClick={onClose}>
        OK
      </Button>
    </Box>
  </Modal>
);

function Cenro() {
  const [applicants, setApplicants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("pending"); // Default: pending
  const recordsPerPage = 20;
  const [selectedFiles, setSelectedFiles] = useState({});
  const API = import.meta.env.VITE_API_BASE;

  // ✅ Confirmation & Success state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null); // Stores { id, cenroFee, selectedFiles }
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleFileChange = (name, file) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [name]: file,
    }));
  };

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(`${API}/backroom/backrooms`);
        const sortedData = res.data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setApplicants(sortedData);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    fetchApplicants();
  }, [API]);

  // Filter applicants based on button selection
  const filteredApplicants =
    filter === "pending"
      ? applicants.filter(
          (a) => a.CENRO !== "Approved" && a.CENRO !== "Declined"
        )
      : filter === "approved"
      ? applicants.filter((a) => a.CENRO === "Approved")
      : applicants.filter((a) => a.CENRO === "Declined");

  const totalPages = Math.ceil(filteredApplicants.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredApplicants.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  // 1. Triggers the confirmation modal
  const handleApprove = (id, cenroFee, selectedFiles) => {
    setConfirmationData({ id, cenroFee, selectedFiles });
    setIsConfirmModalOpen(true);
  };

  // 2. Executes the action after confirmation
  const handleConfirmAction = async () => {
    setIsConfirmModalOpen(false);
    const { id, cenroFee, selectedFiles } = confirmationData;

    try {
      const formData = new FormData();
      formData.append("cenroFee", cenroFee);

      if (selectedFiles.cenroCert) {
        formData.append("cenroCert", selectedFiles.cenroCert);
      }

      await axios.post(`${API}/backroom/cenro/approve/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update local state immediately
      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant.id === id
            ? { ...applicant, CENRO: "Approved", cenroFee }
            : applicant
        )
      );
      setIsSuccessModalOpen(true);
      closeModal();
    } catch (error) {
      console.error("Error approving applicant:", error);
    }
  };

  // Handle decline logic (updated to use axios and update state)
  const handleDecline = async (id, reason) => {
    try {
      await axios.post(`${API}/backroom/cenro/decline/${id}`, { reason });

      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant.id === id
            ? { ...applicant, CENRO: "Declined", CENROdecline: reason }
            : applicant
        )
      );
      closeModal(); // Close the detail modal after action
    } catch (error) {
      console.error("Error declining applicant:", error);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const openModal = (applicant) => {
    setSelectedApplicant(applicant);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedApplicant(null);
    setIsModalOpen(false);
    setConfirmationData(null); // Clear confirmation data
  };

  return (
    <>
      {/* 1. TOP BAR (Fixed Header) */}
      <TopBar />

      {/* 2. SIDE BAR (Original Position Maintained) */}
      <Side_bar />

      {/* 3. MAIN CONTENT (Padded to clear fixed TopBar and offset by Side_bar) */}
      <Box
        id="main_content"
        sx={{
          p: 3,
          minHeight: "100vh",
          background: "white", // Clean background
          // Offset from sidebar (250px)
          marginLeft: { xs: 0, sm: `${SIDE_BAR_WIDTH}px` },
          width: { xs: "100%", sm: `calc(100% - ${SIDE_BAR_WIDTH}px)` },
          // Padded to clear fixed TopBar (80px + spacing)
          pt: `${TOP_BAR_HEIGHT + 24}px`,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: "darkgreen",
            fontWeight: "bold",
            // Only show on mobile since the TopBar handles the title on desktop
            display: { xs: "block", sm: "none" },
          }}
        >
          CENRO
        </Typography>

        {/* Button Group Filter */}
        <Box mb={2}>
          <ButtonGroup variant="contained">
            <Button
              sx={{
                bgcolor: filter === "pending" ? "darkgreen" : "white",
                color: filter === "pending" ? "white" : "darkgreen",
                "&:hover": {
                  bgcolor: filter === "pending" ? "#004d00" : "#f0f0f0",
                },
              }}
              onClick={() => {
                setFilter("pending");
                setCurrentPage(1);
              }}
            >
              Pending
            </Button>
            <Button
              sx={{
                bgcolor: filter === "approved" ? "darkgreen" : "white",
                color: filter === "approved" ? "white" : "darkgreen",
                "&:hover": {
                  bgcolor: filter === "approved" ? "#004d00" : "#f0f0f0",
                },
              }}
              onClick={() => {
                setFilter("approved");
                setCurrentPage(1);
              }}
            >
              Approved
            </Button>
            <Button
              sx={{
                bgcolor: filter === "declined" ? "darkgreen" : "white",
                color: filter === "declined" ? "white" : "darkgreen",
                "&:hover": {
                  bgcolor: filter === "declined" ? "#004d00" : "#f0f0f0",
                },
              }}
              onClick={() => {
                setFilter("declined");
                setCurrentPage(1);
              }}
            >
              Declined
            </Button>
          </ButtonGroup>
        </Box>

        {/* Table */}
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, boxShadow: 3 }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>
                  <strong>BIN</strong>
                </TableCell>
                <TableCell>
                  <strong>Business Name</strong>
                </TableCell>
                <TableCell>
                  <strong>First Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Last Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentRecords.map((applicant) => (
                <TableRow
                  key={applicant.id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => openModal(applicant)}
                >
                  <TableCell>{applicant.BIN}</TableCell>
                  <TableCell>{applicant.businessName}</TableCell>
                  <TableCell>{applicant.firstName}</TableCell>
                  <TableCell>{applicant.lastName}</TableCell>
                  <TableCell>{applicant.CENRO}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="success"
            shape="rounded"
          />
        </Box>
      </Box>

      {/* Modal Component for Applicant Details */}
      <CenroApplicantModal
        applicant={selectedApplicant}
        isOpen={isModalOpen}
        onClose={closeModal}
        onApprove={handleApprove}
        handleFileChange={handleFileChange}
        selectedFiles={selectedFiles}
        onDecline={handleDecline}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmAction}
        message="Are you sure you want to approve this CENRO application?"
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message="CENRO Application Approved!"
      />
    </>
  );
}

export default Cenro;
