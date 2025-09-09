import axios from "axios";
import { useEffect, useState } from "react";
import Side_bar from "../../SIDE_BAR/side_bar";
import ChoApplicantModal from "./cho_modal";

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

function Cho() {
  const [applicants, setApplicants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("pending"); // pending by default
  const recordsPerPage = 20;
  const [selectedFiles, setSelectedFiles] = useState({});

  const handleFileChange = (name, file) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [name]: file,
    }));
  };

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
  const filteredApplicants = applicants.filter((a) => {
    if (filter === "pending")
      return a.CHO !== "Approved" && a.CHO !== "Declined";
    if (filter === "approved") return a.CHO === "Approved";
    if (filter === "declined") return a.CHO === "Declined";
    return true;
  });

  const totalPages = Math.ceil(filteredApplicants.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredApplicants.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  // ✅ Approve logic
  const handleApprove = async (id, choFee, selectedFiles) => {
    try {
      const formData = new FormData();
      formData.append("choFee", choFee);

      if (selectedFiles.choCert) {
        formData.append("choCert", selectedFiles.choCert);
      }

      await axios.post(
        `http://localhost:5000/backroom/cho/approve/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant.id === id
            ? { ...applicant, CHO: "Approved", choFee }
            : applicant
        )
      );
    } catch (error) {
      console.error("Error approving applicant:", error);
    }
  };

  // ✅ Decline logic (fixed)
  const handleDecline = async (id) => {
    try {
      await axios.post(`http://localhost:5000/backroom/cho/decline/${id}`);
      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant.id === id ? { ...applicant, CHO: "Declined" } : applicant
        )
      );
      alert("declined successfully");
      setIsModalOpen(false);
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
          CHO
        </Typography>

        {/* ✅ Button Group Filter */}
        <Box mb={2}>
          <ButtonGroup variant="contained">
            {["pending", "approved", "declined"].map((status) => (
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
                  <TableCell>{applicant.CHO}</TableCell>
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
      <ChoApplicantModal
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

export default Cho;
