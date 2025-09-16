import axios from "axios";
import { useEffect, useState } from "react";
import Side_bar from "../SIDE_BAR/side_bar.jsx";
import ApplicantModal from "./newApp_modal.jsx";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import UpdateModal from "./update_modal.jsx";

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

import { CheckCircleOutline } from "@mui/icons-material";

// ✅ Confirmation Modal
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

// ✅ Success Modal
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

function New_records() {
  const API = import.meta.env.VITE_API_BASE;
  const [pendingApplicants, setPendingApplicants] = useState([]);
  const [approvedApplicants, setApprovedApplicants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("pending");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateApplicant, setUpdateApplicant] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState({
    action: "",
    applicant: null,
  });

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const recordsPerPage = 20;

  const openUpdateModal = (applicant) => {
    setUpdateApplicant(applicant);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setUpdateApplicant(null);
    setIsUpdateModalOpen(false);
  };

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        // ✅ Pending applicants (filter only pending)
        const pendingRes = await axios.get(
          `${API}/newApplication/files`
        );
        const onlyPending = pendingRes.data
          .filter((a) => a.status?.toLowerCase() === "pending")
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // oldest first, newest last
        setPendingApplicants(onlyPending);

        // ✅ Approved applicants
        const approvedRes = await axios.get(
          `${API}/backroom/backrooms`
        );
        const sortedApproved = approvedRes.data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt) // oldest first, newest last
        );
        setApprovedApplicants(sortedApproved);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    fetchApplicants();
  }, []);

  const applicants =
    filter === "pending" ? pendingApplicants : approvedApplicants;

  const totalPages = Math.ceil(applicants.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = applicants.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const handleApprove = (applicant) => {
    setConfirmationData({ action: "approve", applicant });
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAction = async () => {
    setIsConfirmModalOpen(false);
    const { action, applicant } = confirmationData;

    if (!applicant || !applicant.id) {
      console.error(`No applicant selected for ${action}!`);
      return;
    }

    try {
      if (action === "approve") {
        await axios.post(
          `${API}/examiners/bplo/approve/${applicant.id}`
        );
        setPendingApplicants((prev) =>
          prev.filter((a) => a.id !== applicant.id)
        );
        setIsSuccessModalOpen(true);
      }
      closeModal();
    } catch (error) {
      console.error(`Error ${action}ing applicant:`, error);
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
          marginLeft: { xs: 0, sm: "250px" }, // 0 on mobile, 250px on larger screens
          width: { xs: "100%", sm: "calc(100% - 250px)" }, // full width on mobile
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "darkgreen", fontWeight: "bold" }}
        >
          NEW RECORDS
        </Typography>

        {/* ✅ Filter buttons */}
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

                {/* ✅ New Actions column */}
                <TableCell align="center">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentRecords.map((applicant) => (
                <TableRow key={applicant.id} hover>
                  <TableCell>{applicant.BIN}</TableCell>
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

                  {/* ✅ Actions column with icons */}
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

                    <Tooltip title="Delete">
                      <IconButton color="error">
                        <DeleteIcon />
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
            onChange={handlePageChange}
            sx={{
              "& .MuiPaginationItem-root.Mui-selected": {
                bgcolor: "#1c541eff",
                color: "white",
                "&:hover": { bgcolor: "#1c541eff" },
              },
            }}
            shape="rounded"
          />
        </Box>
      </Box>

      {/* ✅ Applicant Modal */}
      <ApplicantModal
        applicant={selectedApplicant}
        isOpen={isModalOpen}
        onClose={closeModal}
        onApprove={() => {
          handleApprove(selectedApplicant);
          closeModal();
        }}
        baseUrl={
          filter === "pending"
            ? `${API}/newApplication/files`
            : `${API}/backroom/backroom`
        }
      />

      {/* ✅ Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmAction}
        message={`Are you sure you want to ${confirmationData.action}?`}
      />

      {/* ✅ Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message="Approved Successfully!"
      />

      <UpdateModal
        applicant={updateApplicant}
        isOpen={isUpdateModalOpen}
        onClose={closeUpdateModal}
        baseUrl={
          filter === "pending"
            ? `${API}/newApplication/files`
            : `${API}/backroom/backroom`
        }
      />
    </>
  );
}

export default New_records;
