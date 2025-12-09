import axios from "axios";
import { useEffect, useState } from "react";
import Side_bar from "../../SIDE_BAR/side_bar";
import ChoApplicantModal from "./cho_modal";
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
  useTheme,
  useMediaQuery,
} from "@mui/material";

const TOP_BAR_HEIGHT = 80;
const SIDE_BAR_WIDTH = 250;

function Cho() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [applicants, setApplicants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("pending");
  const [selectedFiles, setSelectedFiles] = useState({});
  const [loading, setLoading] = useState(false);

  const recordsPerPage = 20;
  const API = import.meta.env.VITE_API_BASE;

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
        const sortedData = res.data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setApplicants(sortedData);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [API]);

  // Filter Logic
  const filteredApplicants = applicants.filter((a) => {
    if (filter === "pending") return a.CHO !== "Approved" && a.CHO !== "Declined";
    if (filter === "approved") return a.CHO === "Approved";
    if (filter === "declined") return a.CHO === "Declined";
    return true;
  });

  const totalPages = Math.ceil(filteredApplicants.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredApplicants.slice(indexOfFirstRecord, indexOfLastRecord);

  // Approve
  const handleApprove = async (id, choFee, selectedFiles) => {
    try {
      const formData = new FormData();
      formData.append("choFee", choFee);
      if (selectedFiles.choCert) formData.append("choCert", selectedFiles.choCert);

      await axios.post(`${API}/backroom/cho/approve/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant.id === id
            ? { ...applicant, CHO: "Approved", choFee }
            : applicant
        )
      );
    } catch (error) {
      console.error("Error approving:", error);
    }
  };

  // Decline
  const handleDecline = async (id, reason) => {
    try {
      await axios.post(`${API}/backroom/cho/decline/${id}`, { reason });
      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant.id === id
            ? { ...applicant, CHO: "Declined", CHOdecline: reason }
            : applicant
        )
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error declining:", error);
    }
  };

  const handlePageChange = (event, value) => setCurrentPage(value);

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
      <TopBar />
      <Side_bar />

      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#fff",
          pt: `${TOP_BAR_HEIGHT + 24}px`,
          px: { xs: 1, sm: 2, md: 3 },
          ml: { xs: 0, md: `${SIDE_BAR_WIDTH}px` },
          width: { xs: "100%", md: `calc(100% - ${SIDE_BAR_WIDTH}px)` },
        }}
      >
        {/* Mobile Title */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#1d5236",
            mb: 2,
            display: { xs: "block", sm: "none" },
            textAlign: "center",
          }}
        >
          CHO
        </Typography>

        {/* Filter Buttons */}
        <Box mb={3}>
          <ButtonGroup
            orientation={isMobile ? "vertical" : "horizontal"}
            variant="contained"
            fullWidth={isMobile}
            sx={{ gap: 1 }}
          >
            {["pending", "approved", "declined"].map((status) => (
              <Button
                key={status}
                onClick={() => {
                  setFilter(status);
                  setCurrentPage(1);
                }}
                sx={{
                  bgcolor: filter === status ? "#1d5236" : "#fff",
                  color: filter === status ? "#fff" : "#1d5236",
                  border: `1px solid #1d5236`,
                  "&:hover": {
                    bgcolor: filter === status ? "#0f2a1b" : "#f0f0f0",
                  },
                  flexGrow: 1,
                  textTransform: "capitalize",
                }}
              >
                {status === "pending" ? "Pending" : status === "approved" ? "Approved" : "Declined"}
              </Button>
            ))}
          </ButtonGroup>
        </Box>

        {/* Table */}
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: 3,
            overflowX: "auto",
            maxWidth: "100%",
          }}
        >
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell><strong>Application</strong></TableCell>
                <TableCell><strong>BIN</strong></TableCell>
                <TableCell><strong>Business Name</strong></TableCell>
                <TableCell><strong>First Name</strong></TableCell>
                <TableCell><strong>Last Name</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={40} thickness={4} />
                    <Typography mt={1}>Loading...</Typography>
                  </TableCell>
                </TableRow>
              ) : currentRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography>No records found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                currentRecords.map((applicant) => (
                  <TableRow
                    key={applicant.id}
                    hover
                    onClick={() => openModal(applicant)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>{applicant.application || "-"}</TableCell>
                    <TableCell>{applicant.bin || "-"}</TableCell>
                    <TableCell>{applicant.businessName || "-"}</TableCell>
                    <TableCell>{applicant.firstName || "-"}</TableCell>
                    <TableCell>{applicant.lastName || "-"}</TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          color:
                            applicant.CHO === "Approved"
                              ? "success.main"
                              : applicant.CHO === "Declined"
                              ? "error.main"
                              : "text.primary",
                        }}
                      >
                        {applicant.CHO || "Pending"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
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
            size={isMobile ? "small" : "medium"}
          />
        </Box>
      </Box>

      {/* Modal */}
      <ChoApplicantModal
        applicant={selectedApplicant}
        isOpen={isModalOpen}
        onClose={closeModal}
        onApprove={handleApprove}
        onDecline={handleDecline}
        handleFileChange={handleFileChange}
        selectedFiles={selectedFiles}
        baseUrl={`${API}/newApplication/files`}
      />
    </>
  );
}

export default Cho;