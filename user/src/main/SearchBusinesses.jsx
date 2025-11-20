import React, { useState } from "react";
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
  const [lastSearch, setLastSearch] = useState(""); // store last search
  const limit = 100;

  const API = import.meta.env.VITE_API_BASE;

  const fetchResults = async (search, pageNumber) => {
    if (!search.trim()) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${API}/existing-businesses/businessProfiles`,
        {
          params: { search, page: pageNumber, limit },
        }
      );
      setResults(response.data);
      setTotalPages(Math.ceil(response.data.length / limit));
      setLastSearch(search); // remember search term
    } catch (error) {
      console.error("Error fetching business profiles:", error);
      setResults([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (e, value) => {
    setPage(value);
    fetchResults(lastSearch, value); // fetch results for last search term
  };

  const handleSearchClick = () => {
    setPage(1); // reset page to 1
    fetchResults(searchValue, 1);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      TransitionProps={{ unmountOnExit: true }}
    >
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
              component="form"
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                maxWidth: 500,
                border: "1px solid #09360D",
                borderRadius: 2,
                px: 1,
              }}
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchClick();
              }}
            >
              <InputBase
                placeholder="Enter Business Name"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value.toUpperCase())}
                sx={{ ml: 2, flex: 1 }}
              />
              <IconButton
                type="button"
                onClick={handleSearchClick}
                sx={{ color: "#09360D" }}
              >
                <SearchIcon />
              </IconButton>
            </Paper>
          </Stack>

          <Box sx={{ mt: 4 }}>
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
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {results.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.business_name}</TableCell>
                          <TableCell>
                            {item.incharge_last_name} {item.incharge_first_name}{" "}
                            {item.incharge_middle_name}
                          </TableCell>
                          <TableCell>{item.incharge_barangay}</TableCell>
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
