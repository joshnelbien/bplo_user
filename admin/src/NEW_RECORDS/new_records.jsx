/* New_records.jsx – FULLY RESPONSIVE (no backend changes) */
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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";
import UpdateModal from "./update_modal.jsx";
import TopBar from "../NAVBAR/nav_bar.jsx";

/* ================== CONSTANTS ================== */
const TOP_BAR_HEIGHT = 80;

/* ================== MODALS (unchanged) ================== */
const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm(); // run your process
    setLoading(false); // remove loading if you want (or close modal inside onConfirm)
  };

  return (
    <Modal open={isOpen} onClose={!loading ? onClose : null}>
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
        }}
      >
        <Typography variant="h6" mb={2}>
          {message}
        </Typography>

        <Box display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            color="success"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} /> Processing...
              </>
            ) : (
              "Yes"
            )}
          </Button>

          <Button variant="outlined" onClick={onClose} disabled={loading}>
            No
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const SuccessModal = ({ isOpen, onClose, message }) => (
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <CheckCircleOutline sx={{ color: "green", fontSize: 60 }} />
      <Typography variant="h6">{message}</Typography>
      <Button variant="contained" color="success" onClick={onClose}>
        OK
      </Button>
    </Box>
  </Modal>
);

/* ================== MAIN COMPONENT ================== */
function New_records() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

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

  const recordsPerPage = 20;

  /* ---- FETCH ---- */
  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/newApplication/files`);
      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setApplicants(sorted);
    } catch (e) {
      console.error("Error fetching applicants:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [API]);

  /* ---- FILTER ---- */
  const filteredApplicants = applicants.filter((a) => {
    const bplo = a.BPLO?.toLowerCase();
    const noBplo = a.passtoBusinessTax === "No";
    const businessTax = a.passtoBusinessTax === "Yes";
    const treasurer = a.passtoTreasurer === "Yes";
    const release = a.permitRelease === "Yes";

    switch (filter) {
      case "pending":
        return bplo === "pending";
      case "nobplostatus":
        return noBplo;
      case "businessTax":
        return businessTax;
      case "treasurerOffice":
        return treasurer;
      case "permitRelease":
        return release;
      default:
        return true;
    }
  });

  /* ---- PAGINATION ---- */
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredApplicants.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredApplicants.length / recordsPerPage);

  /* ---- APPROVE ---- */
  const handleApprove = (applicant, businessDetails) => {
    setConfirmationData({ ...applicant, businessDetails });
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmationData) return;

    setLoading(true); // show loading state in modal

    try {
      await axios.post(`${API}/examiners/bplo/approve/${confirmationData.id}`, {
        businessDetails: confirmationData.businessDetails,
      });

      // Ensure minimum 2 seconds processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsConfirmModalOpen(false);
      setIsModalOpen(false);
      setIsSuccessModalOpen(true);
      fetchApplicants();
    } catch (e) {
      console.error("Error approving:", e);
    } finally {
      setLoading(false); // stop loading spinner
    }
  };

  /* ---- MODAL HELPERS ---- */
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

  /* ---- RESPONSIVE BUTTON GROUP ---- */
  const FilterButtons = () => (
    <ButtonGroup
      orientation={isMobile ? "vertical" : "horizontal"}
      variant="contained"
      fullWidth={isMobile}
      sx={{ mb: 2, gap: 1 }}
    >
      {[
        { key: "pending", label: "Pending" },
        { key: "nobplostatus", label: "On Going" },
        { key: "businessTax", label: "Computation" },
        { key: "treasurerOffice", label: "For Payment" },
        { key: "permitRelease", label: "FOR RELEASING PERMIT" },
      ].map((btn) => (
        <Button
          key={btn.key}
          onClick={() => {
            setFilter(btn.key);
            setCurrentPage(1);
          }}
          sx={{
            bgcolor: filter === btn.key ? "#1c541e" : "#fff",
            color: filter === btn.key ? "#fff" : "#000",
            "&:hover": {
              bgcolor: filter === btn.key ? "#174a18" : "#e0e0e0",
            },
            flexGrow: 1,
            whiteSpace: "normal",
          }}
        >
          {btn.label}
        </Button>
      ))}
    </ButtonGroup>
  );

  return (
    <>
      {/* TOP BAR */}
      <TopBar />

      {/* SIDE BAR */}
      <Side_bar />

      {/* MAIN CONTENT */}
      <Box
        sx={{
          minHeight: "100vh", // Fixed typo
          bgcolor: "#fff",
          pt: `${TOP_BAR_HEIGHT + 24}px`,
          px: { xs: 1, sm: 2, md: 3 },
          ml: { xs: 0, md: "250px" },
          width: { xs: "100%", md: "calc(100% - 250px)" },
        }}
      >
        {/* FILTER BUTTONS */}
        <FilterButtons />

        {/* TABLE */}
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, boxShadow: 3, overflowX: "auto" }}
        >
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
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

                {/* Extra columns only when "On Going" */}
                {filter === "nobplostatus" && (
                  <>
                    <TableCell>
                      <strong>BIN</strong>
                    </TableCell>
                    <TableCell>
                      <strong>BPLO</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Examiner</strong>
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
                    colSpan={filter === "nobplostatus" ? 13 : 5}
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
                    colSpan={filter === "nobplostatus" ? 13 : 5}
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
                          <Typography variant="caption" color="text.secondary">
                            {applicant.BPLOtimeStamp}
                          </Typography>
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

        {/* PAGINATION */}
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, v) => setCurrentPage(v)}
            sx={{
              "& .MuiPaginationItem-root.Mui-selected": {
                bgcolor: "#1c541e",
                color: "#fff",
              },
            }}
            shape="rounded"
          />
        </Box>
      </Box>

      {/* MODALS */}
      <ApplicantModal
        applicant={selectedApplicant}
        isOpen={isModalOpen}
        onApprove={handleApprove}
        baseUrl={`${API}/newApplication`}
        onClose={closeModal}
      />
      <UpdateModal
        applicant={updateApplicant}
        isOpen={isUpdateModalOpen}
        onClose={closeUpdateModal}
        baseUrl={`${API}/newApplication`}
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
