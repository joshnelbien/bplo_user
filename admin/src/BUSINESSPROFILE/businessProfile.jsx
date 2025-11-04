import axios from "axios";
import { useEffect, useState } from "react";
import Side_bar from "../SIDE_BAR/side_bar";
import BusinessProfileModal from "./businessProfile_modal";
import TopBar from "../NAVBAR/nav_bar";
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
  TextField,
  Typography,
  alpha,
} from "@mui/material";

const primaryGreen = "#1d5236";
const TOP_BAR_HEIGHT = 80; // Define height constant

// Renamed the component to follow React conventions (PascalCase)
function BusinessProfile() {
  const [applicants, setApplicants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState(""); // ✅ NEW: search state

  const recordsPerPage = 20;
  const API = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(`${API}/businessProfile/businessProfiles`);
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

  // ✅ Filter + Search applicants
  const filteredApplicants = applicants.filter((a) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "new"
        ? a.application === "New"
        : a.application === "Renew";

    const matchesSearch =
      a.BIN?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.lastName?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredApplicants.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredApplicants.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const handlePageChange = (event, value) => setCurrentPage(value);

  // ✅ Export CSV
  const handleExportCSV = async () => {
    try {
      const res = await axios.get(
        `${API}/businessProfile/businessProfiles/export`
      );
      if (res.data.success) {
        const blob = new Blob([res.data.csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", res.data.filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error("❌ Error downloading CSV:", err);
    }
  };

  const handleRowClick = (applicant) => {
    setSelectedApplicant(applicant);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplicant(null);
  };
  const marginRightValue = "10000px";
  return (
    <>
      {/* 1. TOP BAR (New component) */}
      <TopBar />

      {/* 2. SIDE BAR */}
      <Side_bar />

      {/* 3. MAIN CONTENT (Updated styles for TopBar clearance and white background) */}
      <Box
        id="main_content"
        sx={{
          p: 0,
          minHeight: "100vh",
          background: "white", // CHANGED: Set background to plain white
          marginLeft: { xs: 0, sm: "250px" },
          marginRight: marginRightValue,
          width: { xs: "100%", sm: "calc(100% - 250px)" },
          pt: `${TOP_BAR_HEIGHT + 24}px`, // Added padding top to clear the fixed TopBar
        }}
      >
        {/* REMOVED: The original <Typography> is now in the TopBar */}

        {/* ✅ Filter, Search, and Export */}
        <Box
          mb={2}
          display="flex"
          ml={5}
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <ButtonGroup variant="contained">
            <Button
              sx={{
                bgcolor: filter === "all" ? "darkgreen" : "white",
                color: filter === "all" ? "white" : "darkgreen",

                bgcolor: filter === "all" ? primaryGreen : "white", // Use primaryGreen for consistency
                color: filter === "all" ? "white" : primaryGreen,
                "&:hover": {
                  bgcolor: filter === "all" ? "#004d00" : "#f0f0f0",
                },
              }}
              onClick={() => {
                setFilter("all");
                setCurrentPage(1);
              }}
            >
              All
            </Button>
            <Button
              sx={{
                bgcolor: filter === "new" ? "darkgreen" : "white",
                color: filter === "new" ? "white" : "darkgreen",

                bgcolor: filter === "new" ? primaryGreen : "white",
                color: filter === "new" ? "white" : primaryGreen,
                "&:hover": {
                  bgcolor: filter === "new" ? "#004d00" : "#f0f0f0",
                },
              }}
              onClick={() => {
                setFilter("new");
                setCurrentPage(1);
              }}
            >
              New
            </Button>
            <Button
              sx={{
                bgcolor: filter === "renew" ? "darkgreen" : "white",
                color: filter === "renew" ? "white" : "darkgreen",

                bgcolor: filter === "renew" ? primaryGreen : "white",
                color: filter === "renew" ? "white" : primaryGreen,
                "&:hover": {
                  bgcolor: filter === "renew" ? "#004d00" : "#f0f0f0",
                },
              }}
              onClick={() => {
                setFilter("renew");
                setCurrentPage(1);
              }}
            >
              Renew
            </Button>
          </ButtonGroup>

          {/* ✅ Search + Export */}
          <Box display="flex" alignItems="center">
            <TextField
              label="Search..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              sx={{ width: 250 }}
            />
            <Button
              variant="outlined"
              color="success"
              onClick={handleExportCSV}
            >
              Export to CSV
            </Button>
          </Box>
        </Box>

        {/* ✅ Table */}
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: 3,
            maxWidth: "1600px", // ✅ Set your desired max width
            margin: "0 auto", // ✅ Centers the table horizontally
          }}
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
                  <strong>Application</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentRecords.map((applicant) => (
                <TableRow
                  key={applicant.id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleRowClick(applicant)}
                >
                  <TableCell>{applicant.BIN}</TableCell>
                  <TableCell>{applicant.businessName}</TableCell>
                  <TableCell>{applicant.firstName}</TableCell>
                  <TableCell>{applicant.lastName}</TableCell>
                  <TableCell>{applicant.application}</TableCell>
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

      {/* ✅ Modal */}
      {selectedApplicant && (
        <BusinessProfileModal
          applicant={selectedApplicant}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </>
  );
}

export default BusinessProfile;
