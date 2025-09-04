import axios from "axios";
import { useEffect, useState } from "react";
import Side_bar from "../SIDE_BAR/side_bar";
import ApplicantModal from "./newApp_modal";

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

function New_records() {
  const [pendingApplicants, setPendingApplicants] = useState([]);
  const [approvedApplicants, setApprovedApplicants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("pending"); // ✅ pending by default
  const recordsPerPage = 20;

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        // ✅ Pending applicants
        const pendingRes = await axios.get(
          "http://localhost:5000/newApplication/files"
        );
        setPendingApplicants(pendingRes.data);

        // ✅ Approved applicants
        const approvedRes = await axios.get(
          "http://localhost:5000/backroom/backrooms"
        );
        setApprovedApplicants(approvedRes.data);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    fetchApplicants();
  }, []);

  // ✅ Decide which dataset to show
  const applicants =
    filter === "pending" ? pendingApplicants : approvedApplicants;

  const totalPages = Math.ceil(applicants.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = applicants.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const handleApprove = async (applicant) => {
    if (!applicant || !applicant.id) {
      alert("No applicant selected!");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/examiners/bplo/approve/${applicant.id}`
      );

      // ✅ remove from pending after approval
      setPendingApplicants((prev) => prev.filter((a) => a.id !== applicant.id));

      alert("Applicant approved and moved to examiner's division");
      closeModal();
    } catch (error) {
      console.error("Error approving applicant:", error);
      alert("Failed to approve applicant");
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
      <Box id="main_content"
        sx={{
          p: 3,
          minHeight: '100vh',
          background: 'linear-gradient(to bottom, #FFFFFF, #e6ffe6)'
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: '#1c541eff' }}>
          New Records
        </Typography>

        {/* ✅ Button Group Filter */}
        <Box mb={2}>
          <ButtonGroup variant="contained">
            <Button
              color={filter === "pending" ? "success" : "inherit"}
              onClick={() => {
                setFilter("pending");
                setCurrentPage(1);
              }}
              sx={{
                bgcolor: filter === "pending" ? "#1c541eff" : undefined,
                "&:hover": {
                  bgcolor: filter === "pending" ? "#1c541eff" : undefined,
                },
              }}
            >
              Pending
            </Button>
            <Button
              color={filter === "approved" ? "success" : "inherit"}
              onClick={() => {
                setFilter("approved");
                setCurrentPage(1);
              }}
              sx={{
                bgcolor: filter === "approved" ? "#1c541eff" : undefined,
                "&:hover": {
                  bgcolor: filter === "approved" ? "#1c541eff" : undefined,
                },
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
                  <strong>Business Name</strong>
                </TableCell>
                <TableCell>
                  <strong>First Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Last Name</strong>
                </TableCell>

                {filter === "approved" && (
                  <>
                    <TableCell>
                      <strong>BPLO</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Examiner's</strong>
                    </TableCell>
                    <TableCell>
                      <strong>CENRO</strong>
                    </TableCell>
                    <TableCell>
                      <strong>CHO</strong>
                    </TableCell>
                    <TableCell>
                      <strong>ZONING</strong>
                    </TableCell>
                    <TableCell>
                      <strong>CSWMO</strong>
                    </TableCell>
                    <TableCell>
                      <strong>OBO</strong>
                    </TableCell>
                  </>
                )}
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
                  <TableCell>{applicant.businessName}</TableCell>
                  <TableCell>{applicant.firstName}</TableCell>
                  <TableCell>{applicant.lastName}</TableCell>

                  {filter === "approved" && (
                    <>
                      <TableCell>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span>{applicant.BPLO}</span>
                          <span style={{ fontSize: "0.8em", color: "gray" }}>
                            {applicant.BPLOtimeStamp}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span>{applicant.Examiners}</span>
                          <span style={{ fontSize: "0.8em", color: "gray" }}>
                            {applicant.ExaminerstimeStamp}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span>{applicant.CENRO}</span>
                          <span style={{ fontSize: "0.8em", color: "gray" }}>
                            {applicant.CENROtimeStamp}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span>{applicant.CHO}</span>
                          <span style={{ fontSize: "0.8em", color: "gray" }}>
                            {applicant.CHOtimeStamp}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span>{applicant.ZONING}</span>
                          <span style={{ fontSize: "0.8em", color: "gray" }}>
                            {applicant.ZONINGtimeStamp}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span>{applicant.CSMWO}</span>
                          <span style={{ fontSize: "0.8em", color: "gray" }}>
                            {applicant.CSMWOtimeStamp}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span>{applicant.OBO}</span>
                          <span style={{ fontSize: "0.8em", color: "gray" }}>
                            {applicant.OBOtimeStamp}
                          </span>
                        </div>
                      </TableCell>
                    </>
                  )}
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
            sx={{
              '& .MuiPaginationItem-root.Mui-selected': {
                bgcolor: '#1c541eff',
                color: 'white',
                '&:hover': {
                  bgcolor: '#1c541eff',
                },
              },
            }}
            shape="rounded"
          />
        </Box>
      </Box>

      {/* ✅ Modal Component */}
      <ApplicantModal
        applicant={selectedApplicant}
        isOpen={isModalOpen}
        onClose={closeModal}
        onApprove={handleApprove}
        baseUrl={
          filter === "pending"
            ? "http://localhost:5000/newApplication/files"
            : "http://localhost:5000/backroom/backroom"
        }
      />
    </>
  );
}

export default New_records;
