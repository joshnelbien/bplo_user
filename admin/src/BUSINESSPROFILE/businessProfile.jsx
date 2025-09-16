import axios from "axios";
import { useEffect, useState } from "react";
import Side_bar from "../SIDE_BAR/side_bar";

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

function BusinessProfile() {
  const [applicants, setApplicants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all"); // ✅ default to all
  const recordsPerPage = 20;

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/businessProfile/businessProfiles"
        );

        // Sort by createdAt ascending (oldest first)
        const sortedData = res.data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        setApplicants(sortedData);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    fetchApplicants();
  }, []);

  // ✅ Filter applicants
  const filteredApplicants =
    filter === "all"
      ? applicants
      : filter === "new"
      ? applicants.filter((a) => a.application === "New")
      : applicants.filter((a) => a.application === "Renew");

  const totalPages = Math.ceil(filteredApplicants.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredApplicants.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // ✅ Export CSV function
  const handleExportCSV = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/businessProfile/businessProfiles/export"
      );

      if (res.data.success) {
        console.log(res.data.message); // ✅ "CSV exported and email sent successfully"

        // ✅ Download CSV
        const blob = new Blob([res.data.csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", res.data.filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error("❌ Error downloading CSV or sending email:", err);
    }
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
          marginLeft: { xs: 0, sm: "250px" },
          width: { xs: "100%", sm: "calc(100% - 250px)" },
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "darkgreen", fontWeight: "bold" }}
        >
          Business Profile
        </Typography>

        {/* ✅ Filter & Export */}
        <Box
          mb={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          {/* Left side: filter buttons */}
          <ButtonGroup variant="contained">
            <Button
              sx={{
                bgcolor: filter === "all" ? "darkgreen" : "white",
                color: filter === "all" ? "white" : "darkgreen",
                "&:hover": {
                  bgcolor: filter === "all" ? "#004d00" : "#f0f0f0",
                },
              }}
              onClick={() => {
                setFilter("all");
                setCurrentPage(1);
              }}
            >
              All
            </Button>
            <Button
              sx={{
                bgcolor: filter === "new" ? "darkgreen" : "white",
                color: filter === "new" ? "white" : "darkgreen",
                "&:hover": {
                  bgcolor: filter === "new" ? "#004d00" : "#f0f0f0",
                },
              }}
              onClick={() => {
                setFilter("new");
                setCurrentPage(1);
              }}
            >
              New
            </Button>
            <Button
              sx={{
                bgcolor: filter === "renew" ? "darkgreen" : "white",
                color: filter === "renew" ? "white" : "darkgreen",
                "&:hover": {
                  bgcolor: filter === "renew" ? "#004d00" : "#f0f0f0",
                },
              }}
              onClick={() => {
                setFilter("renew");
                setCurrentPage(1);
              }}
            >
              Renew
            </Button>
          </ButtonGroup>

          {/* Right side: Export button */}
          <Button variant="outlined" color="success" onClick={handleExportCSV}>
            Export to CSV
          </Button>
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
                  <TableCell>{applicant.BIN}</TableCell>
                  <TableCell>{applicant.businessName}</TableCell>
                  <TableCell>{applicant.firstName}</TableCell>
                  <TableCell>{applicant.lastName}</TableCell>
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
    </>
  );
}

export default BusinessProfile;
