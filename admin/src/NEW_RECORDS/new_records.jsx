import axios from "axios";
import { useEffect, useState } from "react";
import Side_bar from "../SIDE_BAR/side_bar.jsx";
import ApplicantModal from "./newApp_modal.jsx";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { CircularProgress } from "@mui/material";
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
  alpha,
} from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";
import UpdateModal from "./update_modal.jsx";
import TopBar from "../NAVBAR/nav_bar.jsx";

/* ================== CONSTANTS ================== */
const TOP_BAR_HEIGHT = 80; // Define height constant

/* ================== LIVE CLOCK ================== */

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

  const [loading, setLoading] = useState(false);

  // REMOVED: [isAddAdminModalOpen, setIsAddAdminModalOpen] state

  const recordsPerPage = 20;

  /* ✅ Fetch applicants */
  const fetchApplicants = async () => {
    setLoading(true); // start loading
    try {
      const res = await axios.get(`${API}/newApplication/files`);
      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setApplicants(sorted);
    } catch (error) {
      console.error("❌ Error fetching applicants:", error);
    } finally {
      setLoading(false); // stop loading
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [API]);

  /* ✅ Filter logic */
  const filteredApplicants = applicants.filter((a) => {
    const bploStatus = a.BPLO?.toLowerCase();
    const nobplostatus = a.passtoBusinessTax === "No";
    const businessTax = a.passtoBusinessTax === "Yes";
    const treasurerOffice = a.passtoTreasurer === "Yes";
    const permitRelease = a.permitRelease === "Yes";

    if (filter === "pending") {
      return bploStatus === "pending";
    }

    if (filter === "nobplostatus") {
      return nobplostatus;
    }
    if (filter === "treasurerOffice") {
      return treasurerOffice;
    }

    if (filter === "permitRelease") {
      return permitRelease;
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
      {/* 1. TOP BAR */}
      <TopBar />

      {/* 2. SIDE BAR */}
      <Side_bar />

      {/* 3. MAIN CONTENT (Background changed to white) */}
      <Box
        sx={{
          p: 3,
          minHeight: "100vh",
          background: "white", // CHANGED: Set background to plain white
          marginLeft: { xs: 0, sm: "250px" },
          width: { xs: "100%", sm: "calc(100% - 250px)" },
          pt: `${TOP_BAR_HEIGHT + 24}px`, // Padding top to clear the fixed TopBar
        }}
      >
        {/* ✅ Filter Buttons */}
        <Box mb={2}>
          <ButtonGroup variant="contained">
            <Button
              onClick={() => {
                setFilter("pending");
                setCurrentPage(1);
              }}
              sx={{
                bgcolor: filter === "pending" ? "#1c541e" : "#ffff", // ✅ gray when inactive
                color: filter === "pending" ? "white" : "black",
                "&:hover": {
                  bgcolor: filter === "pending" ? "#174a18" : "#bdbdbd", // darker hover effect
                },
              }}
            >
              Pending
            </Button>

            <Button
              onClick={() => {
                setFilter("nobplostatus");
                setCurrentPage(1);
              }}
              sx={{
                bgcolor: filter === "nobplostatus" ? "#1c541e" : "#ffff",
                color: filter === "nobplostatus" ? "white" : "black",
                "&:hover": {
                  bgcolor: filter === "nobplostatus" ? "#174a18" : "#bdbdbd",
                },
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
                bgcolor: filter === "businessTax" ? "#1c541e" : "#ffff",
                color: filter === "businessTax" ? "white" : "black",
                "&:hover": {
                  bgcolor: filter === "businessTax" ? "#174a18" : "#bdbdbd",
                },
              }}
            >
              Computation
            </Button>

            <Button
              onClick={() => {
                setFilter("treasurerOffice");
                setCurrentPage(1);
              }}
              sx={{
                bgcolor: filter === "treasurerOffice" ? "#1c541e" : "#ffff",
                color: filter === "treasurerOffice" ? "white" : "black",
                "&:hover": {
                  bgcolor: filter === "treasurerOffice" ? "#174a18" : "#bdbdbd",
                },
              }}
            >
              For Payment
            </Button>

            <Button
              onClick={() => {
                setFilter("permitRelease");
                setCurrentPage(1);
              }}
              sx={{
                bgcolor: filter === "permitRelease" ? "#1c541e" : "#ffff",
                color: filter === "permitRelease" ? "white" : "black",
                "&:hover": {
                  bgcolor: filter === "permitRelease" ? "#174a18" : "#bdbdbd",
                },
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
                {filter === "nobplostatus" && (
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
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={filter === "nobplostatus" ? 12 : 5}
                    align="center"
                    sx={{ py: 4 }}
                  >
                    <CircularProgress size={40} thickness={4} />
                    <Typography mt={1}>Loading data...</Typography>
                  </TableCell>
                </TableRow>
              ) : currentRecords.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={filter === "nobplostatus" ? 12 : 5}
                    align="center"
                  >
                    <Typography sx={{ py: 3 }}>No records found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                currentRecords.map((applicant) => (
                  <TableRow key={applicant.id} hover>
                    <TableCell>{applicant.businessName}</TableCell>
                    <TableCell>{applicant.firstName}</TableCell>
                    <TableCell>{applicant.lastName}</TableCell>
                    <TableCell>{applicant.application}</TableCell>

                    {filter === "nobplostatus" && (
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
                ))
              )}
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
        onApprove={handleApprove}
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
