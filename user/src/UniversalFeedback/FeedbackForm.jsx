import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Divider,
  Paper,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";

// Define styles for consistency
const borderStyle = "1px solid #000";
const borderRightStyle = { borderRight: borderStyle };
const cellStyle = {
  borderRight: borderStyle,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  py: 0.5,
  fontSize: "0.7rem",
};
const inputStyle = {
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiInputBase-root": {
    padding: "0 4px",
    height: "100%",
    fontSize: "0.75rem",
  },
  height: "100%",
};

// --- Helper Component for Functional Checkbox ---
const FunctionalCheckbox = ({ rating, rowId, selectedRating, onSelect }) => {
  const isChecked = selectedRating === rating;

  const handleClick = () => {
    onSelect(rowId, isChecked ? null : rating);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Typography
        variant="caption"
        sx={{ fontWeight: "bold", fontSize: "0.7rem" }}
      >
        {rating}
      </Typography>

      <Box
        onClick={handleClick}
        sx={{
          width: "12px",
          height: "12px",
          border: borderStyle,
          bgcolor: isChecked ? "#e0e0e0" : "white",
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "0.6rem",
          fontWeight: "bold",
          color: "black",
          mt: 0.2,
        }}
      >
        {isChecked ? "✓" : ""}
      </Box>
    </Box>
  );
};

// --- Helper Component for Client/Transaction Info Rows ---
const ClientInfoRow = ({ label, id, children, isLast = false }) => (
  <Box
    sx={{
      display: "flex",
      minHeight: "2rem",
      borderBottom: isLast ? "none" : borderStyle,
    }}
  >
    <Typography
      variant="caption"
      component="label"
      htmlFor={id}
      sx={{
        py: 0.5,
        pl: 0.5,
        fontSize: "0.7rem",
        fontWeight: "bold",
        width: "50%",
        borderRight: borderStyle,
        display: "flex",
        alignItems: "center",
      }}
    >
      {label}
    </Typography>

    <Box sx={{ flexGrow: 1, width: "50%" }}>
      {children ? (
        children
      ) : (
        <TextField
          id={id}
          fullWidth
          size="small"
          variant="outlined"
          sx={inputStyle}
          InputProps={{
            sx: { "& .MuiInputBase-input": { padding: "4px 4px" } },
          }}
        />
      )}
    </Box>
  </Box>
);

// --- Helper Component for Rating Table Rows ---
const TableRatingRow = ({
  criteria,
  id,
  selectedRating,
  onSelect,
  isLast = false,
}) => (
  <Box
    sx={{
      display: "flex",
      minHeight: "2.5rem",
      borderBottom: isLast ? "none" : borderStyle,
    }}
  >
    <Box
      sx={{
        width: "40%",
        display: "flex",
        alignItems: "center",
        ...borderRightStyle,
        p: 0.5,
      }}
    >
      <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
        {criteria}
      </Typography>
    </Box>

    {[5, 4, 3, 2, 1].map((rating, index) => (
      <Box
        key={rating}
        sx={{
          width: "12%",
          ...cellStyle,
          borderRight: index < 4 ? borderStyle : "none",
        }}
      >
        <FunctionalCheckbox
          rating={rating}
          rowId={id}
          selectedRating={selectedRating}
          onSelect={onSelect}
        />
      </Box>
    ))}
  </Box>
);

// --- Helper Component for Rating Table ---
const RatingTable = ({ title, items, ratings, setRatings, isLastTable }) => {
  const handleRatingSelect = (id, rating) => {
    setRatings((prev) => ({
      ...prev,
      [id]: rating,
    }));
  };

  return (
    <Box sx={{ border: borderStyle, mb: isLastTable ? 1 : 0.5 }}>
      <Box sx={{ borderBottom: borderStyle, width: "100%" }}>
        <Typography
          variant="caption"
          align="center"
          sx={{
            py: 0.5,
            fontSize: "0.75rem",
            fontWeight: "bold",
            display: "block",
          }}
        >
          {title}
        </Typography>
      </Box>

      {items.map((item, index) => (
        <TableRatingRow
          key={item.id}
          id={item.id}
          criteria={item.criteria}
          selectedRating={ratings[item.id]}
          onSelect={handleRatingSelect}
          isLast={index === items.length - 1}
        />
      ))}
    </Box>
  );
};

// --- Main Component ---
export default function ClientFeedbackForm() {
  const [ratings, setRatings] = useState({});
  const [transactionDate, setTransactionDate] = useState("");
  const [transactionTime, setTransactionTime] = useState("");
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_BASE;
  const [loading, setLoading] = useState(false);

  // Auto fill date and time
  useEffect(() => {
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setTransactionDate(date);
    setTransactionTime(time);
  }, []);

  const clientFields = [
    {
      label: "Name of Client/Pangalan ng kliyente (Optional)",
      id: "clientName",
    },
    { label: "Email Address", id: "emailAddress" },
    { label: "Contact No. (Optional)", id: "contactNo" },
    { label: "Transaction Date/Petsa ng Transaksyon", id: "transactionDate" },
    { label: "Time/Oras", id: "transactionTime" },
    {
      label: "Name of Employee/Pangalan ng Empleyado (Optional)",
      id: "employeeName",
    },
    { label: "Service Availed/Serbisyong natanggap", id: "serviceAvailed" },
  ];

  const qualityOfServiceItems = [
    { id: "q1", criteria: "Courteousness/ Pagiging Magalang" },
    { id: "q2", criteria: "Promptness/Bilis ng Serbisyo" },
    { id: "q3", criteria: "Knowledge and Ability/Kaalaman at Kakayahan" },
  ];

  const facilitiesItems = [
    { id: "f1", criteria: "Comfort/ Kaginhawahan" },
    { id: "f2", criteria: "Cleanliness/ Kalinisan" },
    { id: "f3", criteria: "Sufficiency/Sapat (Pasilidad/ Kagamitan)" },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return; // prevent double submit
    setLoading(true);

    const formData = {
      clientName: document.getElementById("clientName").value,
      emailAddress: document.getElementById("emailAddress").value,
      contactNo: document.getElementById("contactNo").value,
      transactionDate,
      transactionTime,
      employeeName: document.getElementById("employeeName").value,
      serviceAvailed: document.getElementById("serviceAvailed").value,
      comments: document.querySelector("textarea").value,
      ratings: {
        "Quality of Service": qualityOfServiceItems.map((item) => ({
          criteria: item.criteria,
          rating: ratings[item.id] || "Not rated",
        })),
        Facilities: facilitiesItems.map((item) => ({
          criteria: item.criteria,
          rating: ratings[item.id] || "Not rated",
        })),
      },
    };

    try {
      const response = await fetch(`${API}/user-feedback/send-feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Thank you for submitting your feedback!");
        navigate("/");
      } else {
        alert("Error sending feedback. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: "900px", mx: "auto", p: 1 }}>
      <Paper
        elevation={0}
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 1,
          m: 0,
          border: borderStyle,
          bgcolor: "white",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
            p: 0.5,
          }}
        >
          <Box
            component="img"
            src="/spclogo.png"
            alt="San Pablo City Logo"
            sx={{ height: "55px", width: "auto" }}
          />
          <Box
            sx={{ textAlign: "center", lineHeight: 1.1, flexGrow: 1, mx: 1 }}
          >
            <Typography variant="caption" sx={{ fontSize: "0.6rem" }}>
              Republic of the Philippines
            </Typography>
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              sx={{ fontSize: "0.7rem" }}
            >
              City Government of San Pablo
            </Typography>
            <Typography
              variant="caption"
              sx={{ display: "block", fontSize: "0.6rem" }}
            >
              San Pablo City Hall{" "}
            </Typography>
            <Typography
              variant="caption"
              sx={{ display: "block", mb: 0.2, fontSize: "0.6rem" }}
            >
              Tel No. (049) 503-3487 | Email add: bplospc@gmail.com
            </Typography>
            <Divider sx={{ borderBottomWidth: 1, bgcolor: "black", mb: 0.2 }} />
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              sx={{ fontSize: "0.7rem" }}
            >
              BUSINESS PERMITS AND LICENSING OFFICE
            </Typography>
          </Box>
          <Box
            component="img"
            src="/bagongp.png"
            alt="Bagong Pilipinas Logo"
            sx={{ height: "55px", width: "auto" }}
          />
        </Box>

        {/* Title */}
        <Box sx={{ border: borderStyle, py: 0.5, mb: 1, bgcolor: "#144C22" }}>
          <Typography
            variant="body1"
            align="center"
            fontWeight="bold"
            sx={{ color: "white" }}
          >
            Client Feedback Form
          </Typography>
        </Box>

        {/* Client and Transaction Info */}
        <Box sx={{ border: borderStyle, mb: 1 }}>
          {clientFields.map((field, index) => {
            if (field.id === "transactionDate") {
              return (
                <ClientInfoRow key={field.id} label={field.label} id={field.id}>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={transactionDate}
                    InputProps={{ readOnly: true }}
                    sx={inputStyle}
                  />
                </ClientInfoRow>
              );
            }

            if (field.id === "transactionTime") {
              return (
                <ClientInfoRow key={field.id} label={field.label} id={field.id}>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={transactionTime}
                    InputProps={{ readOnly: true }}
                    sx={inputStyle}
                  />
                </ClientInfoRow>
              );
            }

            return (
              <ClientInfoRow
                key={field.id}
                label={field.label}
                id={field.id}
                isLast={index === clientFields.length - 1}
              />
            );
          })}
        </Box>

        {/* Instructions */}
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="caption"
            sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
          >
            Please put a check on the box to your answer./Mangyaring pindutin
            ang box ang inyong sagot.
          </Typography>
          <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
            Ratings: 5 - Excellent, 4 - Very Satisfactory, 3 - Satisfactory, 2 -
            Unsatisfactory, 1 - Poor
          </Typography>
        </Box>

        {/* Rating Tables */}
        <RatingTable
          title="Quality of Service/Kalidad ng Serbisyo"
          items={qualityOfServiceItems}
          ratings={ratings}
          setRatings={setRatings}
        />
        <RatingTable
          title="Facilities/Mga Kagamitan sa Pagtanggap"
          items={facilitiesItems}
          ratings={ratings}
          setRatings={setRatings}
          isLastTable={true}
        />

        {/* Comments */}
        <Box sx={{ border: borderStyle, mb: 1 }}>
          <Typography
            variant="caption"
            component="label"
            sx={{
              p: 0.5,
              borderBottom: borderStyle,
              display: "block",
              fontWeight: "bold",
            }}
          >
            Other Comments, Inputs and Suggestions/Iba pang Kuru-kuro:
          </Typography>
          <TextField
            multiline
            rows={5}
            fullWidth
            size="small"
            sx={inputStyle}
            InputProps={{ sx: { p: 0.5 } }}
          />
        </Box>

        {/* Reminder */}
        <Box sx={{ borderTop: "2px solid red", pt: 0.5 }}>
          <Typography variant="caption" sx={{ fontSize: "0.6rem" }}>
            Important Reminder: The contents shall be kept confidential and
            shall be for internal use only. Mahalagang Paalala: Ang nilalaman ng
            kasulatang ito ay pananatilihing lihim o gagamitin lamang ng
            kinauukulan.
          </Typography>
        </Box>

        {/* Footer */}
        <Typography
          variant="caption"
          sx={{ mt: 0.5, display: "block", fontSize: "0.6rem" }}
        >
          QFM-QMR-002 Rev 0 2022.02.16
        </Typography>
      </Paper>

      {/* Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button
          variant="contained"
          color="inherit"
          onClick={() => window.history.back()}
          sx={{ bgcolor: "#084d05ff", color: "white" }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
          onClick={handleSubmit}
          sx={{ bgcolor: "#144C22", minWidth: "160px" }}
        >
          {loading ? (
            <>
              <CircularProgress size={18} sx={{ color: "white", mr: 1 }} />
              Submitting...
            </>
          ) : (
            "Submit Feedback"
          )}
        </Button>
      </Box>
    </Box>
  );
}
