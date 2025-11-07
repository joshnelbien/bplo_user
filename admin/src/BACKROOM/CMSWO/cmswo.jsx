import axios from "axios";
import { useEffect, useState } from "react";
import Side_bar from "../../SIDE_BAR/side_bar";
import CmswoApplicantModal from "./cmswo_modal";
import TopBar from "../../NAVBAR/nav_bar";
import { CircularProgress } from "@mui/material";

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
  alpha,
} from "@mui/material";

const TOP_BAR_HEIGHT = 80; // Define height constant
const SIDE_BAR_WIDTH = 250;

/* ================== LIVE CLOCK COMPONENT (Top Bar Element) ================== */

/* ================== MAIN COMPONENT ================== */

function Cmswo() {
  const [applicants, setApplicants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("pending"); // pending by default
  const recordsPerPage = 20;
  const [selectedFiles, setSelectedFiles] = useState({});
  const API = import.meta.env.VITE_API_BASE;
  const [loading, setLoading] = useState(false);
  // NOTE: removed unused setValidationErrors and handleFileSelect from the original code
  // as they were incomplete/unnecessary in the Cmswo component logic provided.

  const handleFileChange = (name, file) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [name]: file,
    }));
  };

  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/backroom/backrooms`);

        // Sort by createdAt ascending (oldest first, newest at bottom)
        const sortedData = res.data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setApplicants(sortedData);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      } finally {
        setLoading(false); // stop loading
      }
    };

    fetchApplicants();
  }, [API]);

  // Filter applicants based on button selection
  const filteredApplicants =
    filter === "pending"
      ? applicants.filter(
          (a) => a.CSMWO !== "Approved" && a.CSMWO !== "Declined"
        )
      : filter === "approved"
      ? applicants.filter((a) => a.CSMWO === "Approved")
      : applicants.filter((a) => a.CSMWO === "Declined");

  const totalPages = Math.ceil(filteredApplicants.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredApplicants.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const handleApprove = async (id, csmwoFee, selectedFiles = {}) => {
    try {
      const formData = new FormData();
      formData.append("csmwoFee", csmwoFee);

      if (selectedFiles?.cswmoCert) {
        formData.append("cswmoCert", selectedFiles.cswmoCert);
      }

      await axios.post(`${API}/backroom/csmwo/approve/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant.id === id
            ? { ...applicant, CSMWO: "Approved", csmwoFee }
            : applicant
        )
      );
    } catch (error) {
      console.error("Error approving applicant:", error);
    }
  };
  const handleDecline = async (id, reason) => {
    try {
      await axios.post(
        `${API}/backroom/csmwo/decline/${id}`,
        { reason } // ⬅️ send reason to backend
      );

      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant.id === id
            ? { ...applicant, CSMWO: "Declined", CSMWOdecline: reason }
            : applicant
        )
      );
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
          background: "white", // Set to white
          // Offset from sidebar (250px)
          marginLeft: { xs: 0, sm: `${SIDE_BAR_WIDTH}px` },
          width: { xs: "100%", sm: `calc(100% - ${SIDE_BAR_WIDTH}px)` },
          // Padded to clear fixed TopBar (80px + margin)
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
          CMSWO
        </Typography>

        {/* ✅ Button Group Filter (Original Position Maintained) */}
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

        {/* ✅ Table (Original Position Maintained) */}
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={40} thickness={4} />
                    <Typography mt={1}>Loading data...</Typography>
                  </TableCell>
                </TableRow>
              ) : currentRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography>No records found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                currentRecords.map((applicant) => (
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
                    <TableCell>{applicant.CSMWO}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ✅ Pagination (Original Position Maintained) */}
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

      {/* ✅ Modal Component (Original Position Maintained) */}
      <CmswoApplicantModal
        applicant={selectedApplicant}
        isOpen={isModalOpen}
        onClose={closeModal}
        onApprove={handleApprove}
        onDecline={handleDecline}
        handleFileChange={handleFileChange}
        selectedFiles={selectedFiles}
      />
    </>
  );
}

export default Cmswo;
