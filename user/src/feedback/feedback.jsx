import React, { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Paper,
  TextField,
  Grid,
  Button, // Added Button component
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
  // Removes the border from the TextField input itself, relying on the parent Box border
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  // Ensure the input base takes full height/padding is minimal
  "& .MuiInputBase-root": {
    padding: "0 4px", // Minimal horizontal padding
    height: "100%",
    fontSize: "0.75rem", // Smaller font size for mobile view
  },
  height: "100%",
};

// --- Helper Component for Functional Checkbox (now includes the rating number) ---
const FunctionalCheckbox = ({ rating, rowId, selectedRating, onSelect }) => {
  const isChecked = selectedRating === rating;

  // Function to handle the click (toggling selection)
  const handleClick = () => {
    // If the currently selected rating is clicked, deselect it (set to null)
    // Otherwise, select the new rating
    onSelect(rowId, isChecked ? null : rating);
  };

  return (
    // Box containing both the number (5, 4, 3, 2, 1) and the checkbox, stacked vertically
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      {/* 1. Rating Number (e.g., 5) */}
      <Typography
        variant="caption"
        sx={{ fontWeight: "bold", fontSize: "0.7rem" }}
      >
        {rating}
      </Typography>

      {/* 2. Checkbox */}
      <Box
        onClick={handleClick}
        sx={{
          width: "12px",
          height: "12px",
          border: borderStyle,
          bgcolor: isChecked ? "#e0e0e0" : "white", // Slight background change when checked
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "0.6rem",
          fontWeight: "bold",
          lineHeight: 1,
          color: "black",
          mt: 0.2, // Small margin top to separate number and box
        }}
      >
        {/* Display a checkmark if this rating is selected for the row */}
        {isChecked ? "✓" : ""}
      </Box>
    </Box>
  );
};

// --- Helper Component for Client/Transaction Info Rows ---
const ClientInfoRow = ({ label, id, isLast = false }) => (
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
    </Box>
  </Box>
);

// --- Helper Component for Rating Table Rows (Criteria + Checkboxes) ---
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
    {/* Criteria Column */}
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

    {/* Rating Checkbox Columns (5 columns, 12% each) */}
    {[5, 4, 3, 2, 1].map((rating, index) => (
      <Box
        key={rating}
        sx={{
          width: "12%", // 5 columns * 12% = 60% of the width
          ...cellStyle,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRight: index < 4 ? borderStyle : "none",
        }}
      >
        {/* FunctionalCheckbox now renders the number AND the checkbox stacked */}
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

// --- Helper Component for Rating Table Container ---
const RatingTable = ({
  title,
  items,
  ratings,
  setRatings,
  isLastTable = false,
}) => {
  // Handler passed down to the individual checkbox to update state
  const handleRatingSelect = (id, rating) => {
    setRatings((prev) => ({
      ...prev,
      [id]: rating,
    }));
  };

  // Used only to create 5 empty columns in the header for alignment
  const ratingPlaceholders = [1, 2, 3, 4, 5];

  return (
    <Box sx={{ border: borderStyle, mb: isLastTable ? 1 : 0.5 }}>
      {/* Table Title/Header Row (One Centered Cell) */}
      <Box sx={{ borderBottom: borderStyle, width: "100%" }}>
        <Typography
          variant="caption"
          align="center" // Centering the text
          sx={{
            py: 0.5,
            fontSize: "0.75rem",
            fontWeight: "bold",
            display: "block", // Ensures Typography takes full width for alignment
          }}
        >
          {title}
        </Typography>
      </Box>

      {/* Table Rows */}
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
  // State to hold the selected ratings for the two tables
  const [ratings, setRatings] = useState({});

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
    {
      id: "q3",
      criteria:
        "Knowledge and Ability/Kaalaman at kakayahan sa Pagbibigay Serbisyo",
    },
  ];

  const facilitiesItems = [
    { id: "f1", criteria: "Comfort/ Kaginhawahan" },
    { id: "f2", criteria: "Cleanliness/ Kalinisan" },
    { id: "f3", criteria: "Sufficiency/Sapat (Pasilidad/ Kagamitan)" },
  ];

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted. Ratings:", ratings);
    // Add your form submission logic here (e.g., API call)
    alert("Thank you for submitting your feedback. It means a lot to us and helps us improve your experience.");
  };

  return (
    // Outer container to hold the form and the buttons
    <Box sx={{ maxWidth: "900px", mx: "auto", p: 1 }}>
      {/* The Main Form Content */}
      <Paper
        elevation={0}
        component="form" // Use Box as a form element for submission handling
        onSubmit={handleSubmit}
        sx={{
          p: 1,
          m: 0,
          border: borderStyle,
          bgcolor: "white",
        }}
      >
        {/* 1. Header Section - Kept */}
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
              San Pablo Mega Complex, Brgy. San Jose, San Pablo City 4000
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

        {/* 2. Title Box - STYLED BACKGROUND/FONT */}
        <Box sx={{ border: borderStyle, py: 0.5, mb: 1, bgcolor: "#144C22" }}>
          <Typography
            variant="body1"
            align="center"
            fontWeight="bold"
            sx={{ color: "white" }} // White text color
          >
            Client Feedback Form
          </Typography>
        </Box>

        {/* 3. Input Fields - Client and Transaction Info */}
        <Box sx={{ border: borderStyle, mb: 1 }}>
          {clientFields.map((field, index) => (
            <ClientInfoRow
              key={field.id}
              label={field.label}
              id={field.id}
              isLast={index === clientFields.length - 1}
            />
          ))}
        </Box>

        {/* 4. Instructions - Kept */}
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="caption"
            component="p"
            sx={{ fontSize: "0.7rem", fontWeight: "bold" }}
          >
            Please put a check on the box to your answer./Mangyaring pindutin
            ang box ang inyong sagot.
          </Typography>
          <Typography
            variant="caption"
            component="p"
            sx={{ fontSize: "0.7rem" }}
          >
            Ratings (shown above each box): 5 - Excellent, 4 - Very
            Satisfactory, 3 - Satisfactory, 2 - Unsatisfactory, 1 - Poor
          </Typography>
        </Box>

        {/* 5. Quality of Service Table */}
        <RatingTable
          title="Quality of Service/Kalidad ng Serbisyo"
          items={qualityOfServiceItems}
          ratings={ratings}
          setRatings={setRatings}
        />

        {/* 6. Facilities Table */}
        <RatingTable
          title="Facilities/Mga Kagamitan sa Pagtanggap"
          items={facilitiesItems}
          ratings={ratings}
          setRatings={setRatings}
          isLastTable={true}
        />

        {/* 7. Other Comments - Kept */}
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

        {/* 8. Important Reminder - Kept */}
        <Box sx={{ borderTop: "2px solid red", pt: 0.5 }}>
          <Typography
            variant="caption"
            lineHeight={1.2}
            sx={{ fontSize: "0.6rem" }}
          >
            Important Reminder: The contents shall be kept confidential and
            shall be for internal use/evaluation
            <span>
              only. Mahalagang Paalala: Ang nilalaman ng kasulatang ito ay
              pananatilihing lihim o gagamitin
            </span>
            <span>
              &nbsp;tanging ng kinauukulan sa pagsukalo paglilimbag ng
              serbisyong natanggap.
            </span>
          </Typography>
        </Box>

        {/* 9. Footer - Kept */}
        <Typography
          variant="caption"
          sx={{ mt: 0.5, display: "block", fontSize: "0.6rem" }}
        >
          QFM-QMR-002 Rev 0 2022.02.16
        </Typography>
      </Paper>

      {/* --- BACK AND SUBMIT BUTTONS --- */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 2, // Margin top to separate buttons from the form
        }}
      >
        <Button
          variant="contained"
          color="inherit"
          onClick={() => window.history.back()} // Basic browser back functionality
          sx={{ bgcolor: "#084d05ff", color: "white" }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          onClick={handleSubmit}
          sx={{ bgcolor: "#144C22" }} // Matching the form title color
        >
          Submit Feedback
        </Button>
      </Box>
    </Box>
  );
}
