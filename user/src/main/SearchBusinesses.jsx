import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  InputBase,
  IconButton,
  Stack,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

function SearchBusinesses({ open, onClose }) {
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 100;

  const API = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    if (!open) {
      setSearchValue("");
      setResults([]);
      setPage(1);
    }
  }, [open]);

  const fetchResults = async (search, pageNumber = 1) => {
    if (!search.trim()) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${API}/businesses2025/businessProfiles`,
        { params: { search, page: pageNumber, limit } }
      );
      const { rows, total } = response.data;
      setResults(rows || []);
      setTotalPages(Math.ceil((total || 0) / limit));
      setPage(pageNumber);
    } catch (error) {
      console.error("Error fetching business profiles:", error);
      setResults([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (e, value) => fetchResults(searchValue, value);
  const handleSearchClick = () => fetchResults(searchValue, 1);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchClick();
    }
  };

  // Generate multiple watermark spans to cover the page
  const watermarkArray = Array.from({ length: 50 }, (_, i) => i);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      TransitionProps={{ unmountOnExit: true }}
    >
      {/* Inject print CSS */}
      <style>{`
      .watermark {
  display: none;
}

        @media print {
          body {
            -webkit-print-color-adjust: exact;
          }

          /* watermark across entire page */
          .watermark {
            position: fixed;
            top: 0%;
            left: 0%;
            width: 100%;
            height: 100%;
            z-index: 9999;
            pointer-events: none;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            align-items: center;
            opacity: 0.2;
            font-size: 50px;
            font-weight: bold;
            color: black;
            transform: rotate(-45deg);
          }
          .watermark span {
            margin: 60px;
          }

          /* hide non-print elements */
          .MuiDialogActions-root,
          .MuiIconButton-root,
          .MuiInputBase-root,
          .MuiPagination-root,
          .MuiDialogTitle-root {
            display: none !important;
          }

          /* table page break handling */
          table { page-break-inside:auto }
          tr { page-break-inside:avoid; page-break-after:auto }
          thead { display:table-header-group }
          tfoot { display:table-footer-group }
        }
      `}</style>

      {/* Watermark for print only */}
      <div className="watermark print-only">
        {watermarkArray.map((i) => (
          <span key={i}>GOVERNMENT PROPERTY</span>
        ))}
      </div>

      <DialogTitle
        sx={{
          fontWeight: "bold",
          color: "#09360D",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Search Businesses
        <Button
          onClick={onClose}
          color="inherit"
          startIcon={<CloseIcon />}
          sx={{ textTransform: "none" }}
        >
          Close
        </Button>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ py: 3 }}>
          <Typography
            variant="h6"
            sx={{ textAlign: "center", mb: 3, color: "#09360D" }}
          >
            Business Search Portal
          </Typography>

          <Stack direction="row" spacing={1} justifyContent="center">
            <Paper
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                maxWidth: 500,
                border: "1px solid #09360D",
                borderRadius: 2,
                px: 1,
              }}
            >
              <InputBase
                placeholder="Enter Business Name"
                value={searchValue.toLocaleUpperCase()}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyPress}
                sx={{ ml: 2, flex: 1 }}
              />
              <IconButton
                type="button"
                onClick={handleSearchClick}
                sx={{ color: "#09360D" }}
                disabled={loading}
              >
                <SearchIcon />
              </IconButton>
            </Paper>
          </Stack>

          <Box className="printable" sx={{ mt: 4 }}>
            {loading ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <CircularProgress sx={{ color: "#09360D" }} />
                <Typography sx={{ mt: 2 }}>Searching...</Typography>
              </Box>
            ) : results.length > 0 ? (
              <>
                <TableContainer sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Business Name
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Owner</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Address
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Application Type
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {results.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.business_name}</TableCell>
                          <TableCell>
                            {item.last_name} {item.first_name}{" "}
                            {item.middle_name}
                          </TableCell>
                          <TableCell>{item.business_address}</TableCell>
                          <TableCell>{item.application_type}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              </>
            ) : (
              <Typography
                variant="body2"
                sx={{ textAlign: "center", color: "gray", mt: 3 }}
              >
                No business records found.
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            backgroundColor: "#09360D",
            "&:hover": { backgroundColor: "#07270a" },
          }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SearchBusinesses;
