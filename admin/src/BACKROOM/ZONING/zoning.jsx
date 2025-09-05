import axios from "axios";
import { useEffect, useState } from "react";
import Side_bar from "../../SIDE_BAR/side_bar";
import ZoningApplicantModal from "./zoning_modal";
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
} from "@mui/material";

// ✅ New Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  return (
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
};

// ✅ New Success Modal Component
const SuccessModal = ({ isOpen, onClose, message }) => {
  return (
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
};

function Zoning() {
  const [applicants, setApplicants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("pending");
  const recordsPerPage = 20;
  const [selectedFiles, setSelectedFiles] = useState({});

  // ✅ New state for confirmation and success modals
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get("http://localhost:5000/backroom/backrooms");
        setApplicants(res.data);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    fetchApplicants();
  }, []);

  const filteredApplicants =
    filter === "pending"
      ? applicants.filter((a) => a.ZONING !== "Approved")
      : applicants.filter((a) => a.ZONING === "Approved");

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

  const handleApprove = async (id) => {
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
        formData.append("zoningFee", zoningFee);
      }

      await axios.post(
        `http://localhost:5000/backroom/zoning/approve/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

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
      <Side_bar />
      <Box
        id="main_content"
        sx={{
          p: 3,
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #FFFFFF, #e6ffe6)",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: "darkgreen",
            fontWeight: "bold",
          }}
        >
          ZONING
        </Typography>

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
          </ButtonGroup>
        </Box>


        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>
                  <strong>Applicant ID</strong>
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
                  <TableCell>{applicant.id}</TableCell>
                  <TableCell>{applicant.businessName}</TableCell>
                  <TableCell>{applicant.firstName}</TableCell>
                  <TableCell>{applicant.lastName}</TableCell>
                  <TableCell>{applicant.ZONING}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Box>
      </Box>

      <ZoningApplicantModal
        applicant={selectedApplicant}
        isOpen={isModalOpen}
        onClose={closeModal}
        onApprove={handleApprove}
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
