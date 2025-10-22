import axios from "axios";
import { useEffect, useState } from "react";
import Side_bar from "../../SIDE_BAR/side_bar";
import TreasurersApplicantModal from "./treasurers_modal";

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
  alpha, // Needed for text shadow effect
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
        // Aligned past the fixed sidebar area
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
          display: { xs: "none", sm: "block" },
        }}
      >
        TREASURER'S OFFICE
      </Typography>

      <Box sx={{ mr: 4 }} />
    </Box>
  );
}

function Treasurers() {
  const [applicants, setApplicants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("pending"); // ✅ pending by default
  const recordsPerPage = 20;
  const API = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(`${API}/treasurer/treasurer`);

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

  // ✅ Filter applicants based on button selection
  const filteredApplicants =
    filter === "pending"
      ? applicants.filter(
          (a) => a.TREASURER !== "Approved" && a.TREASURER !== "Declined"
        )
      : filter === "approved"
      ? applicants.filter(
          (a) =>
            a.TREASURER === "Approved" &&
            (!a.passtoTreasurer || a.passtoTreasurer !== "Done")
        )
      : filter === "payment"
      ? applicants.filter(
          (a) => a.TREASURER === "Approved" && a.passtoTreasurer === "Done"
        )
      : applicants.filter((a) => a.TREASURER === "Declined");

  const totalPages = Math.ceil(filteredApplicants.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredApplicants.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const handleApprove = async (id, csmwoFee) => {
    try {
      await axios.post(`${API}/treasurer/treasurerOffice/approve/${id}`);

      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant.id === id
            ? { ...applicant, TREASURER: "Approved", csmwoFee }
            : applicant
        )
      );
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
    console.log(`Business Tax  :`, applicant.businessTaxTotal);
    console.log(`Mode of Payment  :`, applicant.Modeofpayment);
  };

  const closeModal = () => {
    setSelectedApplicant(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <TopBar />
      <Side_bar />
      <Box
        id="main_content"
        sx={{
          p: 3,
          minHeight: "100vh",
          background: "white",
          marginLeft: { xs: 0, sm: `${SIDE_BAR_WIDTH}px` },
          width: { xs: "100%", sm: `calc(100% - ${SIDE_BAR_WIDTH}px)` },
          pt: `${TOP_BAR_HEIGHT + 24}px`,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: "darkgreen",
            fontWeight: "bold",
            display: { xs: "block", sm: "none" },
          }}
        >
          {/* Title for Mobile View */}
          TREASURER'S OFFICE
        </Typography>

        {/* ✅ Button Group Filter */}
        <Box mb={2}>
          <ButtonGroup variant="contained">
            {["pending", "payment"].map((status) => (
              <Button
                key={status}
                sx={{
                  bgcolor: filter === status ? "darkgreen" : "white",
                  color: filter === status ? "white" : "darkgreen",
                  "&:hover": {
                    bgcolor: filter === status ? "#004d00" : "#f0f0f0",
                  },
                }}
                onClick={() => {
                  setFilter(status);
                  setCurrentPage(1);
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </ButtonGroup>
        </Box>

        {/* ✅ Table */}
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
                  <TableCell>{applicant.TREASURER}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ✅ Pagination */}
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

      {/* ✅ Modal Component */}
      <TreasurersApplicantModal
        filter={filter}
        applicant={selectedApplicant}
        isOpen={isModalOpen}
        onClose={closeModal}
        onApprove={handleApprove}
      />
    </>
  );
}

export default Treasurers;
