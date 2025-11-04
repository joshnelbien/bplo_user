import axios from "axios";
import { useEffect, useState } from "react";
import Side_bar from "../../SIDE_BAR/side_bar";
import ZoningApplicantModal from "./zoning_modal";
import { CheckCircleOutline } from "@mui/icons-material";
import TopBar from "../../NAVBAR/nav_bar";
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

const TOP_BAR_HEIGHT = 80; // Define height constant
const SIDE_BAR_WIDTH = 250;

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

function Zoning() {
  const [applicants, setApplicants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("pending"); // now supports pending/approved/declined
  const recordsPerPage = 20;
  const [selectedFiles, setSelectedFiles] = useState({});
  const API = import.meta.env.VITE_API_BASE;

  // Confirmation & Success state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(`${API}/backroom/backrooms`);

        // Sort by createdAt ascending (oldest first, newest at bottom)
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

  // Unified filtering logic
  const filteredApplicants = applicants.filter((a) => {
    if (filter === "pending")
      return a.ZONING !== "Approved" && a.ZONING !== "Declined";
    if (filter === "approved") return a.ZONING === "Approved";
    if (filter === "declined") return a.ZONING === "Declined";
    return true;
  });

  const totalPages = Math.ceil(filteredApplicants.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredApplicants.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setSelectedFiles((prev) => ({
      ...prev,
      [name]: files[0] || null,
    }));
  };

  const handleDecline = async (id, reason) => {
    try {
      await axios.post(`${API}/backroom/zoning/decline/${id}`, {
        reason, // send body correctly
      });

      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant.id === id
            ? { ...applicant, ZONING: "Declined", ZONINGdecline: reason }
            : applicant
        )
      );

      closeModal();
    } catch (error) {
      console.error("Error declining applicant:", error);
    }
  };

  const handleApprove = (id, renewZoningFee) => {
    // ✅ store the renew fee in applicants before confirm
    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, renewZoningFee } : a))
    );

    setConfirmationData(id);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAction = async () => {
    setIsConfirmModalOpen(false);
    const id = confirmationData;

    try {
      const formData = new FormData();
      if (selectedFiles["zoningCert"]) {
        formData.append("zoningCert", selectedFiles["zoningCert"]);
      }

      const applicant = applicants.find((a) => a.id === id);
      if (applicant) {
        const calculateZoningFee = (totalCapital) => {
          if (totalCapital <= 5000) return "Exempted";
          if (totalCapital >= 5001 && totalCapital <= 10000) return 100;
          if (totalCapital >= 10001 && totalCapital <= 50000) return 200;
          if (totalCapital >= 50001 && totalCapital <= 100000) return 300;
          return ((totalCapital - 100000) * 0.001 + 500).toFixed(2);
        };

        const zoningFee = calculateZoningFee(Number(applicant.totalCapital));

        const finalZoningFee =
          applicant.renewZoningFee !== "" &&
          applicant.renewZoningFee !== undefined &&
          applicant.renewZoningFee !== null
            ? applicant.renewZoningFee
            : zoningFee;

        formData.append("zoningFee", finalZoningFee);
      }

      await axios.post(`${API}/backroom/zoning/approve/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant.id === id
            ? {
                ...applicant,
                ZONING: "Approved",
                zoningFee: formData.get("zoningFee"),
              }
            : applicant
        )
      );

      setIsSuccessModalOpen(true);
      closeModal();
    } catch (error) {
      console.error("Error approving applicant:", error);
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
    setSelectedFiles({});
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
          ZONING
        </Typography>

        {/* Filter Button Group */}
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

        {/* Applicants Table */}
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, boxShadow: 3 }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>
                  <strong>Application Type</strong>
                </TableCell>
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
                  <TableCell>{applicant.application}</TableCell>
                  <TableCell>{applicant.bin}</TableCell>
                  <TableCell>{applicant.businessName}</TableCell>
                  <TableCell>{applicant.firstName}</TableCell>
                  <TableCell>{applicant.lastName}</TableCell>
                  <TableCell>{applicant.ZONING}</TableCell>
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

      {/* Modals */}
      <ZoningApplicantModal
        applicant={selectedApplicant}
        isOpen={isModalOpen}
        onClose={closeModal}
        onApprove={handleApprove}
        onDecline={handleDecline}
        handleFileChange={handleFileChange}
        selectedFiles={selectedFiles}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmAction}
        message="Are you sure you want to approve this applicant?"
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message="Applicant Approved!"
      />
    </>
  );
}

export default Zoning;
