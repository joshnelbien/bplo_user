import axios from "axios";
import { useEffect, useState } from "react";
import Side_bar from "../../SIDE_BAR/side_bar";
import OboApplicantModal from "./obo_modal";

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
        // Positioned after the fixed sidebar area
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
      {/* 1. LEFT ALIGNED: LIVE CLOCK */}
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
          display: { xs: "none", sm: "block" },
        }}
      >
        OFFICE OF THE BUILDING OFFICIAL
      </Typography>

      {/* 3. RIGHT ALIGNED: Placeholder (optional, keeping structure for consistency) */}
      <Box sx={{ mr: 4 }} />
    </Box>
  );
}

/* ================== MAIN COMPONENT ================== */

function Obo() {
  const [applicants, setApplicants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("pending"); // pending by default
  const recordsPerPage = 20;
  const API = import.meta.env.VITE_API_BASE;

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

  // Filter applicants based on button selection
  const filteredApplicants =
    filter === "pending"
      ? applicants.filter((a) => a.OBO !== "Approved" && a.OBO !== "Declined")
      : filter === "approved"
      ? applicants.filter((a) => a.OBO === "Approved")
      : applicants.filter((a) => a.OBO === "Declined");
  const totalPages = Math.ceil(filteredApplicants.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredApplicants.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const handleApprove = async (id, oboFields) => {
    try {
      // NOTE: Original logic maintained
      await axios.post(`${API}/backroom/obo/approve/${id}`, oboFields);

      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant.id === id
            ? {
                ...applicant,
                ...oboFields,
                OBO: "Approved",
              }
            : applicant
        )
      );
    } catch (error) {
      console.error("Error approving applicant:", error);
    }
  };

  const handleDeclined = async (id, reason) => {
    try {
      // NOTE: Original logic maintained
      await axios.post(`${API}/backroom/obo/decline/${id}`, {
        reason,
      });

      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant.id === id
            ? {
                ...applicant,
                OBO: "Declined",
                OBOdecline: reason,
              }
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

      {/* 2. SIDE BAR (Fixed Navigation) */}
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
          OBO
        </Typography>

        {/* Button Group Filter (Original Position Maintained) */}
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

            {/* Declined Button */}
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

        {/* Table (Original Position Maintained) */}
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
                  <TableCell>{applicant.bin}</TableCell>
                  <TableCell>{applicant.businessName}</TableCell>
                  <TableCell>{applicant.firstName}</TableCell>
                  <TableCell>{applicant.lastName}</TableCell>
                  <TableCell>{applicant.OBO}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination (Original Position Maintained) */}
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

      {/* Modal Component (Original Position Maintained) */}
      <OboApplicantModal
        applicant={selectedApplicant}
        isOpen={isModalOpen}
        onClose={closeModal}
        onApprove={handleApprove}
        onDecline={handleDeclined}
      />
    </>
  );
}

export default Obo;
