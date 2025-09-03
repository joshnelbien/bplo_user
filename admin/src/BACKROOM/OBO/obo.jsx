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
} from "@mui/material";

function Obo() {
  const [applicants, setApplicants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("pending"); // ✅ pending by default
  const recordsPerPage = 20;

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

  // ✅ Filter applicants based on button selection
  const filteredApplicants =
    filter === "pending"
      ? applicants.filter((a) => a.OBO !== "Approved")
      : applicants.filter((a) => a.OBO === "Approved");

  const totalPages = Math.ceil(filteredApplicants.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredApplicants.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const handleApprove = async (id, oboFields) => {
    try {
      await axios.post(
        `http://localhost:5000/backroom/obo/approve/${id}`,
        oboFields
      );
      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant.id === id
            ? {
                ...applicant,
                ...oboFields,
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
          OBO
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
                  <TableCell>{applicant.OBO}</TableCell>
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
      <OboApplicantModal
        applicant={selectedApplicant}
        isOpen={isModalOpen}
        onClose={closeModal}
        onApprove={handleApprove}
      />
    </>
  );
}

export default Obo;
