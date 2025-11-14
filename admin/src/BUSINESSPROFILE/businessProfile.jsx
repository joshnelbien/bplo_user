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
  useTheme,
  useMediaQuery,
} from "@mui/material";

const primaryGreen = "#1d5236";
const TOP_BAR_HEIGHT = 80;

function BusinessProfile() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [applicants, setApplicants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter + Search
  const filteredApplicants = applicants.filter((a) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "new"
        ? a.application === "New"
        : a.application === "Renew";

    const matchesSearch =
      a.bin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Error downloading CSV:", err);
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

  return (
    <>
      <TopBar />
      <Side_bar />

      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#fff",
          pt: `${TOP_BAR_HEIGHT + 24}px`,
          px: { xs: 1, sm: 2, md: 3 },
          ml: { xs: 0, md: "250px" },
          width: { xs: "100%", md: "calc(100% - 250px)" },
        }}
      >
        {/* FILTER + SEARCH + EXPORT */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            gap: 2,
            px: { xs: 1, md: 2 },
          }}
        >
          {/* Filter Buttons */}
          <ButtonGroup
            orientation={isMobile ? "vertical" : "horizontal"}
            variant="contained"
            fullWidth={isMobile}
            sx={{ flex: { sm: 1 }, maxWidth: { sm: 400 } }}
          >
            {[
              { key: "all", label: "All" },
              { key: "new", label: "New" },
              { key: "renew", label: "Renew" },
            ].map((btn) => (
              <Button
                key={btn.key}
                onClick={() => {
                  setFilter(btn.key);
                  setCurrentPage(1);
                }}
                sx={{
                  bgcolor: filter === btn.key ? primaryGreen : "#fff",
                  color: filter === btn.key ? "#fff" : primaryGreen,
                  border: `1px solid ${primaryGreen}`,
                  "&:hover": {
                    bgcolor: filter === btn.key ? "#004d00" : "#f0f0f0",
                  },
                  flexGrow: 1,
                }}
              >
                {btn.label}
              </Button>
            ))}
          </ButtonGroup>

          {/* Search + Export */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <TextField
              label="Search BIN, Name, Business..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              sx={{
                width: { xs: "100%", sm: 280 },
                "& .MuiOutlinedInput-root": {
                  fontSize: { xs: "0.875rem" },
                },
              }}
            />
            <Button
              variant="outlined"
              color="success"
              onClick={handleExportCSV}
              sx={{
                whiteSpace: "nowrap",
                minWidth: { xs: "100%", sm: "auto" },
              }}
            >
              Export CSV
            </Button>
          </Box>
        </Box>

        {/* TABLE */}
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: 3,
            maxWidth: "1600px",
            mx: "auto",
            overflowX: "auto",
          }}
        >
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell><strong>BIN</strong></TableCell>
                <TableCell><strong>Business Name</strong></TableCell>
                <TableCell><strong>First Name</strong></TableCell>
                <TableCell><strong>Last Name</strong></TableCell>
                <TableCell><strong>Application</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentRecords.length === 0 ? (
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
                    onClick={() => handleRowClick(applicant)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>{applicant.bin || "-"}</TableCell>
                    <TableCell>{applicant.businessName || "-"}</TableCell>
                    <TableCell>{applicant.firstName || "-"}</TableCell>
                    <TableCell>{applicant.lastName || "-"}</TableCell>
                    <TableCell>{applicant.application || "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* PAGINATION */}
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="success"
            shape="rounded"
            size={isMobile ? "small" : "medium"}
          />
        </Box>
      </Box>

      {/* MODAL */}
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