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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

function SearchBusinesses({ open, onClose }) {
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API_BASE;

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      alert("⚠️ Please enter a business name.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${API}/existing-businesses/businessProfiles?search=${encodeURIComponent(
          searchValue
        )}`
      );
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching business profiles:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      TransitionProps={{ unmountOnExit: true }}
    >
      {/* Header */}
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

      {/* Content */}
      <DialogContent dividers>
        <Box sx={{ py: 3 }}>
          <Typography
            variant="h6"
            sx={{ textAlign: "center", mb: 3, color: "#09360D" }}
          >
            Business Search Portal
          </Typography>

          {/* Search Bar */}
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            alignItems="center"
          >
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
                handleSearch();
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
                onClick={handleSearch}
                sx={{ color: "#09360D" }}
              >
                <SearchIcon />
              </IconButton>
            </Paper>
          </Stack>

          {/* Results */}
          <Box sx={{ mt: 4 }}>
            {loading ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <CircularProgress sx={{ color: "#09360D" }} />
                <Typography sx={{ mt: 2 }}>Searching...</Typography>
              </Box>
            ) : results.length > 0 ? (
              <TableContainer sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Business Name
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Owner</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
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

      {/* Footer */}
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
