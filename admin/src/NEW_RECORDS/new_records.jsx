import axios from "axios";
import { useEffect, useState } from "react";
import Side_bar from "../SIDE_BAR/side_bar.jsx";
import ApplicantModal from "./newApp_modal.jsx";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import {
  IconButton,
  Tooltip,
  Modal,
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
import { CheckCircleOutline } from "@mui/icons-material";
import UpdateModal from "./update_modal.jsx";

/* ✅ Confirmation Modal */
const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => (
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

/* ✅ Success Modal */
const SuccessModal = ({ isOpen, onClose, message }) => (
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

function New_records() {
  const API = import.meta.env.VITE_API_BASE;
  const [applicants, setApplicants] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [updateApplicant, setUpdateApplicant] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);

  const recordsPerPage = 20;

  /* ✅ Fetch applicants */
  const fetchApplicants = async () => {
    try {
      const res = await axios.get(`${API}/newApplication/files`);
      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setApplicants(sorted);
    } catch (error) {
      console.error("❌ Error fetching applicants:", error);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [API]);

  /* ✅ Filter logic */
  const filteredApplicants = applicants.filter((a) => {
    const bploStatus = a.BPLO?.toLowerCase();
    const businessTax = a.passtoBusinessTax === "Yes";

    if (filter === "pending") {
      return bploStatus === "pending";
    }

    if (filter === "approved") {
      return bploStatus === "approved" && !businessTax;
    }

    if (filter === "businessTax") {
      return businessTax;
    }

    return true;
  });

  /* ✅ Pagination */
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredApplicants.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredApplicants.length / recordsPerPage);

  /* ✅ Approve handler (called from ApplicantModal) */
  const handleApprove = (applicant, businessDetails) => {
    console.log("📌 handleApprove() called");
    console.log("👉 Applicant:", applicant);
    console.log("👉 Business Details:", businessDetails);

    setConfirmationData({
      ...applicant,
      businessDetails, // ✅ Attach business details properly
    });
    setIsConfirmModalOpen(true);
  };

  /* ✅ Confirm Approval */
  const handleConfirmAction = async () => {
    console.log(
      "📥 Incoming confirmationData before submit:",
      confirmationData
    );

    if (!confirmationData) return;
    try {
      await axios.post(`${API}/examiners/bplo/approve/${confirmationData.id}`, {
        businessDetails: confirmationData.businessDetails,
      });
      setIsConfirmModalOpen(false);
      setIsSuccessModalOpen(true);
      fetchApplicants();
    } catch (error) {
      console.error("❌ Error approving applicant:", error);
    }
  };

  /* ✅ Modal handlers */
  const openModal = (applicant) => {
    setSelectedApplicant(applicant);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedApplicant(null);
    setIsModalOpen(false);
  };

  const openUpdateModal = (applicant) => {
    setUpdateApplicant(applicant);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setUpdateApplicant(null);
    setIsUpdateModalOpen(false);
  };

  return (
    <>
      <Side_bar />
      <Box
        sx={{
          p: 3,
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #FFFFFF, #e6ffe6)",
          marginLeft: { xs: 0, sm: "250px" },
          width: { xs: "100%", sm: "calc(100% - 250px)" },
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "darkgreen", fontWeight: "bold" }}
        >
          NEW RECORDS
        </Typography>

        {/* ✅ Filter Buttons */}
        <Box mb={2}>
          <ButtonGroup variant="contained">
            <Button
              onClick={() => {
                setFilter("pending");
                setCurrentPage(1);
              }}
              sx={{
                bgcolor: filter === "pending" ? "#1c541e" : undefined,
                color: filter === "pending" ? "white" : undefined,
              }}
            >
              Pending
            </Button>
            <Button
              onClick={() => {
                setFilter("approved");
                setCurrentPage(1);
              }}
              sx={{
                bgcolor: filter === "approved" ? "#1c541e" : undefined,
                color: filter === "approved" ? "white" : undefined,
              }}
            >
              On Going
            </Button>
            <Button
              onClick={() => {
                setFilter("businessTax");
                setCurrentPage(1);
              }}
              sx={{
                bgcolor: filter === "businessTax" ? "#1c541e" : undefined,
                color: filter === "businessTax" ? "white" : undefined,
              }}
            >
              Computation
            </Button>
             <Button
              onClick={() => {
                setFilter("pending");
                setCurrentPage(1);
              }}
              sx={{
                bgcolor: filter === "pending" ? "#1c541e" : undefined,
                color: filter === "pending" ? "white" : undefined,
              }}
            >
              FOR RELEASING PERMIT
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
                <TableCell>
                  <strong>Application Type</strong>
                </TableCell>
                {filter === "approved" && (
                  <>
                    <TableCell>
                      <strong>BIN</strong>
                    </TableCell>
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
                <TableCell align="center">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {currentRecords.map((applicant) => (
                <TableRow key={applicant.id} hover>
                  <TableCell>{applicant.businessName}</TableCell>
                  <TableCell>{applicant.firstName}</TableCell>
                  <TableCell>{applicant.lastName}</TableCell>
                  <TableCell>{applicant.application}</TableCell>

                  {filter === "approved" && (
                    <>
                      <TableCell>{applicant.BIN}</TableCell>
                      <TableCell>
                        {applicant.BPLO}
                        <br />
                        <small style={{ color: "gray" }}>
                          {applicant.BPLOtimeStamp}
                        </small>
                      </TableCell>
                      <TableCell>{applicant.Examiners}</TableCell>
                      <TableCell>{applicant.CENRO}</TableCell>
                      <TableCell>{applicant.CHO}</TableCell>
                      <TableCell>{applicant.ZONING}</TableCell>
                      <TableCell>{applicant.CSMWO}</TableCell>
                      <TableCell>{applicant.OBO}</TableCell>
                    </>
                  )}

                  <TableCell align="center">
                    <Tooltip title="View">
                      <IconButton
                        color="primary"
                        onClick={() => openModal(applicant)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Update">
                      <IconButton
                        color="secondary"
                        onClick={() => openUpdateModal(applicant)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
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
            onChange={(e, value) => setCurrentPage(value)}
            sx={{
              "& .MuiPaginationItem-root.Mui-selected": {
                bgcolor: "#1c541e",
                color: "white",
              },
            }}
            shape="rounded"
          />
        </Box>
      </Box>

      <ApplicantModal
        applicant={selectedApplicant}
        isOpen={isModalOpen}
        onApprove={handleApprove} // ✅ Pass both applicant & businessDetails
        baseUrl={`${API}/newApplication/files`}
        onClose={closeModal}
      />

      <UpdateModal
        applicant={updateApplicant}
        isOpen={isUpdateModalOpen}
        onClose={closeUpdateModal}
        baseUrl={`${API}/newApplication/files`}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmAction}
        message="Are you sure you want to approve this application?"
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message="Approved Successfully!"
      />
    </>
  );
}

export default New_records;
