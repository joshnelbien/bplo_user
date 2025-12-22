import axios from "axios";
import { useEffect, useState } from "react";
import Side_bar from "../../SIDE_BAR/side_bar";
import CenroApplicantModal from "./cenro_modal";
import { CheckCircleOutline } from "@mui/icons-material";
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
  Modal,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const TOP_BAR_HEIGHT = 80;
const SIDE_BAR_WIDTH = 250;

// Confirmation Modal (Responsive)
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  loading,
}) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: 300, sm: 400 },
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          textAlign: "center",
          outline: "none",
        }}
      >
        <Typography
          variant={isMobile ? "subtitle1" : "h6"}
          mb={2}
          fontWeight="bold"
        >
          {message}
        </Typography>
        <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
          <Button
            variant="contained"
            color="success"
            onClick={onConfirm}
            size={isMobile ? "small" : "medium"}
            disabled={loading}
          >
            {loading ? "Processing..." : "Approve"}
          </Button>
          <Button
            variant="outlined"
            onClick={onClose}
            size={isMobile ? "small" : "medium"}
          >
            No
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

// Success Modal (Responsive)
const SuccessModal = ({ isOpen, onClose, message }) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: 280, sm: 340 },
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
        <CheckCircleOutline
          sx={{ color: "green", fontSize: isMobile ? 50 : 60 }}
        />
        <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold">
          {message}
        </Typography>
        <Button
          variant="contained"
          color="success"
          onClick={onClose}
          size={isMobile ? "small" : "medium"}
        >
          OK
        </Button>
      </Box>
    </Modal>
  );
};

function Cenro() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [applicants, setApplicants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("pending");
  const [selectedFiles, setSelectedFiles] = useState({});
  const [loading, setLoading] = useState(false);

  // Confirmation & Success
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const recordsPerPage = 20;
  const API = import.meta.env.VITE_API_BASE;

  const handleFileChange = (name, file) => {
    setSelectedFiles((prev) => ({ ...prev, [name]: file }));
  };

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
  useEffect(() => {
    fetchApplicants();
  }, [API]);

  // Filter Logic
  const filteredApplicants = applicants.filter((a) => {
    if (filter === "pending")
      return a.CENRO !== "Approved" && a.CENRO !== "Declined";
    if (filter === "approved") return a.CENRO === "Approved";
    if (filter === "declined") return a.CENRO === "Declined";
    return true;
  });

  const totalPages = Math.ceil(filteredApplicants.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredApplicants.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  // 1. Open confirmation
  const handleApprove = (id, cenroFee, selectedFiles) => {
    setConfirmationData({ id, cenroFee, selectedFiles });
    setIsConfirmModalOpen(true);
  };

  // 2. Confirm & send to backend
  const handleConfirmAction = async () => {
    const { id, cenroFee, selectedFiles } = confirmationData;

    try {
      const formData = new FormData();
      formData.append("cenroFee", cenroFee);
      if (selectedFiles.cenroCert)
        formData.append("cenroCert", selectedFiles.cenroCert);

      await axios.post(`${API}/backroom/cenro/approve/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant.id === id
            ? { ...applicant, CENRO: "Approved", cenroFee }
            : applicant
        )
      );
      setIsConfirmModalOpen(false);
      setIsSuccessModalOpen(true);
      closeModal();
    } catch (error) {
      console.error("Error approving:", error);
    }
  };

  // Decline
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
      closeModal();
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
    setConfirmationData(null);
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
          CENRO
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
                {status === "pending"
                  ? "Pending"
                  : status === "approved"
                  ? "Approved"
                  : "Declined"}
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
                <TableCell>
                  <strong>Application</strong>
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
                            applicant.CENRO === "Approved"
                              ? "success.main"
                              : applicant.CENRO === "Declined"
                              ? "error.main"
                              : "text.primary",
                        }}
                      >
                        {applicant.CENRO || "Pending"}
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

      {/* Applicant Modal */}
      <CenroApplicantModal
        applicant={selectedApplicant}
        isOpen={isModalOpen}
        onClose={closeModal}
        onApprove={handleApprove}
        handleFileChange={handleFileChange}
        selectedFiles={selectedFiles}
        onDecline={handleDecline}
        fetchApplicants={fetchApplicants}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmAction}
        loading={loading}
        message="Are you sure you want to approve this applicant?"
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
