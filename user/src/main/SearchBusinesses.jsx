// SearchBusinesses.jsx
import React, { useState, useEffect, useRef } from "react";
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
import ReCAPTCHA from "react-google-recaptcha";

function SearchBusinesses({ open, onClose }) {
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [captchaToken, setCaptchaToken] = useState(null);
  const captchaRef = useRef(null);

  const limit = 100;
  const API = import.meta.env.VITE_API_BASE;
  const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "YOUR_SITE_KEY";

  useEffect(() => {
    if (!open) {
      // Reset everything when modal closes
      setSearchValue("");
      setResults([]);
      setPage(1);
      setTotalPages(1);
      setCaptchaToken(null);
      if (captchaRef.current) captchaRef.current.reset();
    }
  }, [open]);

  const verifyAndSearch = async (
    search,
    pageNumber = 1,
    requireCaptcha = true
  ) => {
    if (!search || !search.trim()) return;

    if (requireCaptcha && !captchaToken) {
      alert("Please complete the captcha before searching.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${API}/businesses2025/businessProfiles`,
        {
          params: { search, page: pageNumber, limit, token: captchaToken },
        }
      );

      const { rows, total } = response.data;
      setResults(rows || []);
      setTotalPages(Math.ceil((total || 0) / limit));
      setPage(pageNumber);

      // Only reset captcha after modal closes, not after each search
      // This allows switching pages without captcha again
    } catch (err) {
      console.error("Search error:", err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Error searching businesses. Please try again.");
      }
      setResults([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (e, value) =>
    verifyAndSearch(searchValue, value, false);
  const handleSearchClick = () => verifyAndSearch(searchValue, 1, true);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchClick();
    }
  };

  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const watermarkArray = Array.from({ length: 50 }, (_, i) => i);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      TransitionProps={{ unmountOnExit: true }}
    >
      <style>{`
        .watermark { display: none; }
        @media print {
          body { -webkit-print-color-adjust: exact; }
          .watermark {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            align-items: center;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.2;
            font-size: 50px;
            font-weight: bold;
            color: black;
            transform: rotate(-45deg);
            z-index: 9999;
            pointer-events: none;
          }
          .watermark span { margin: 60px; }
          .MuiDialogActions-root,
          .MuiIconButton-root,
          .MuiInputBase-root,
          .MuiPagination-root,
          .MuiDialogTitle-root { display: none !important; }
          table { page-break-inside:auto; }
          tr { page-break-inside:avoid; page-break-after:auto; }
          thead { display:table-header-group; }
          tfoot { display:table-footer-group; }
        }
      `}</style>

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
                disabled={loading || !captchaToken}
              >
                <SearchIcon />
              </IconButton>
            </Paper>
          </Stack>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <ReCAPTCHA
              ref={captchaRef}
              sitekey={SITE_KEY}
              onChange={onCaptchaChange}
            />
          </Box>

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
