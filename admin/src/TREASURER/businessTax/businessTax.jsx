import axios from "axios";
import { useEffect, useState } from "react";
import Side_bar from "../../SIDE_BAR/side_bar";
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
  alpha, // 🛑 Added for TopBar styling (text shadow)
} from "@mui/material";
import BusinessTaxApplicantModal from "./businessTax_modal";
import TopBar from "../../NAVBAR/nav_bar";

const TOP_BAR_HEIGHT = 80;
const SIDE_BAR_WIDTH = 250;

function BusinessTax() {
  const [applicants, setApplicants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("pending"); // ✅ pending by default
  const recordsPerPage = 20;
  const [selectedFiles, setSelectedFiles] = useState({});
  const API = import.meta.env.VITE_API_BASE;
  const [loading, setLoading] = useState(false);

  const handleFileChange = (name, file) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [name]: file,
    }));
  };

  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/businessTax/businessTax`);
        const sortedData = res.data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setApplicants(sortedData);
        // Removed the duplicate setApplicants(res.data);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      } finally {
        setLoading(false); // stop loading
      }
    };

    fetchApplicants();
  }, [API]); // Added API to dependency array for best practice

  // ✅ Filter applicants based on button selection
  const filteredApplicants =
    filter === "pending"
      ? applicants.filter((a) => a.BUSINESSTAX !== "Approved")
      : applicants.filter((a) => a.BUSINESSTAX === "Approved");

  const totalPages = Math.ceil(filteredApplicants.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredApplicants.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const handleApprove = async (id, selectedFiles) => {
    try {
      const formData = new FormData();
      if (selectedFiles?.businessTaxComputation) {
        formData.append(
          "businessTaxComputation",
          selectedFiles.businessTaxComputation
        );
      }

      // 2. Retrieve all collection amounts from sessionStorage
      const map = {
        "BUSINESS TAX": "businessTaxFee",
        "MAYOR’S PERMIT": "mayorsPermit",
        "BARANGAY FEE": "barangayFee",
        "OCCUPATIONAL TAX": "occupationalTax",
        "HEALTH, CER & SSF": "choFee",
        "SWM GARBAGE FEE": "csmwoFee",
        OBO: "oboTotal",
        "SANITARY INSPECTION": "sanitaryInspection",
        "BUILDING INSPECTION": "buildingInspection",
        "MECHANICAL INSPECTION": "mechanicalInspection",
        "ELECTRICAL INSPECTION": "electricalInspection",
        "SIGNBOARD/BILLBOARD": "signage",
        "ELECTRONIC INSPECTION": "electronics",
        "DELIVERY VEHICLE": "deliveryVehicle",
        SURCHARGE: "surcharge",
        INTEREST: "interest",
        "TINPLATE/STICKER FEE": "tinplateStickerFee",
        "VERIFICATION FEE": "verificationFee",
        "ZONING FEE": "zoningFee",
        CENRO: "cenroFee",
        "SWMO CERT": "swmoCert",
        "VETERNARY FEE": "veterinaryFee",
        "FIXED TAX": "fixedTax",
        "VIDEOKE CARABET DANCEHALL": "videokeFee",
        CIGARETTES: "cigarettes",
        LIQUOR: "liquor",
        BILLIARDS: "billiards",
        "BOARD AND LOGGING": "boardAndLogging",
        "FSIC FEE": "fsicFee",
      };

      // Append all collection items from sessionStorage
      Object.entries(map).forEach(([label, key]) => {
        const storageKey = label
          .replace(/\s+/g, "")
          .replace(/[^a-zA-Z0-9]/g, "");
        const value = sessionStorage.getItem(storageKey) || "0";
        formData.append(key, value);
      });

      // Append totals
      const businessTaxTotal =
        sessionStorage.getItem("businessTaxTotal") || "0";
      const otherChargesTotal =
        sessionStorage.getItem("otherChargesTotal") || "0";
      formData.append("businessTaxTotal", businessTaxTotal);
      formData.append("otherChargesTotal", otherChargesTotal);

      // 3. Send to backend
      await axios.post(`${API}/businessTax/business/approve/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 4. Update UI
      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant.id === id
            ? { ...applicant, BUSINESSTAX: "Approved", total: businessTaxTotal }
            : applicant
        )
      );

      // 5. Clear session storage for these items after success
      Object.keys(map).forEach((label) => {
        const storageKey = label
          .replace(/\s+/g, "")
          .replace(/[^a-zA-Z0-9]/g, "");
        sessionStorage.removeItem(storageKey);
      });
      sessionStorage.removeItem("businessTaxTotal");
      sessionStorage.removeItem("otherChargesTotal");
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
      <TopBar />
      <Side_bar />
      <Box
        id="main_content"
        sx={{
          p: 3,
          minHeight: "100vh",
          background: "white",
          marginLeft: { xs: 0, sm: `${SIDE_BAR_WIDTH}px` },
          width: { xs: "100%", sm: `calc(100% - ${SIDE_BAR_WIDTH}px)` },
          pt: `${TOP_BAR_HEIGHT + 24}px`,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: "darkgreen",
            fontWeight: "bold",
            display: { xs: "block", sm: "none" },
          }}
        >
          BUSINESS TAX OFFICE
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
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, boxShadow: 3 }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>
                  <strong>Application Type</strong>
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
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={40} thickness={4} />
                    <Typography mt={1}>Loading data...</Typography>
                  </TableCell>
                </TableRow>
              ) : currentRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography>No records found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                currentRecords.map((applicant) => (
                  <TableRow
                    key={applicant.id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => openModal(applicant)}
                  >
                    <TableCell>{applicant.application}</TableCell>
                    <TableCell>{applicant.bin}</TableCell>
                    <TableCell>{applicant.businessName}</TableCell>
                    <TableCell>{applicant.firstName}</TableCell>
                    <TableCell>{applicant.lastName}</TableCell>
                    <TableCell>{applicant.BUSINESSTAX}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
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
      <BusinessTaxApplicantModal
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

export default BusinessTax;
