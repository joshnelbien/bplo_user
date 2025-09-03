import axios from "axios";
import { useEffect, useState } from "react";
import Side_bar from "../../SIDE_BAR/side_bar";
import ExaminersApplicantModal from "./examiners_modal";

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
} from "@mui/material";

function Examiners() {
  const [applicants, setApplicants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("pending"); // ✅ pending by default
  const recordsPerPage = 20;
  const [selectedFiles, setSelectedFiles] = useState({});

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/examiners/examiners"
        );
        setApplicants(res.data);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    fetchApplicants();
  }, []);

  // ✅ Filter applicants based on button selection
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
      [name]: files[0] || null, // store the actual File object
    }));
  };

  const handleApprove = async (id) => {
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
        `http://localhost:5000/examiners/examiners/approve/${id}`,
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
      alert("Applicant approved");
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
  };

  return (
    <>
      <Side_bar />
      <Box id="main_content" sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          EXAMINERS
        </Typography>

        {/* ✅ Button Group Filter */}
        <Box mb={2}>
          <ButtonGroup variant="contained">
            <Button
              color={filter === "pending" ? "primary" : "inherit"}
              onClick={() => {
                setFilter("pending");
                setCurrentPage(1); // reset pagination when switching
              }}
            >
              Pending
            </Button>
            <Button
              color={filter === "approved" ? "primary" : "inherit"}
              onClick={() => {
                setFilter("approved");
                setCurrentPage(1);
              }}
            >
              Approved
            </Button>
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

        {/* ✅ Pagination */}
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

      {/* ✅ Modal Component */}
      <ExaminersApplicantModal
        applicant={selectedApplicant}
        isOpen={isModalOpen}
        onClose={closeModal}
        onApprove={handleApprove}
        handleFileChange={handleFileChange}
        selectedFiles={selectedFiles}
      />
    </>
  );
}

export default Examiners;
