// src/pages/homePage/homePage.jsx
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sideBar/sideBar";
import { useState, useRef } from "react";

const HomePage = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const iconRef = useRef(null);

  // Filter menu options
  const filters = [
    { label: "News", path: `/news/${userId}` },
    { label: "New Application Requirements", path: `/requirements/new/${userId}` },
    { label: "Renewal Application Requirements", path: `/requirements/renewal/${userId}` },
    { label: "Privacy Notice", path: `/privacyNotice/${userId}` },
  ];

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterClick = () => {
    setOpenFilter((prev) => !prev);
  };

  const handleSelect = (path) => {
    navigate(path);
    setOpenFilter(false);
    setSearch("");
  };

  const handleClickAway = () => {
    setOpenFilter(false);
  };

  return (
    <Box sx={{ display: "flex", height: "30vh", bgcolor: "#f9fafb" }}>
      {/* Sidebar */}
      <Sidebar id={userId} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          color: "text.secondary",
        }}
      >
        {/* 🔍 Search Bar */}
        <TextField
          variant="outlined"
          placeholder="Search..."
          value={search}
          onChange={handleSearchChange}
          sx={{
            width: { xs: "90%", sm: "70%", md: "500px" },
            bgcolor: "white",
            borderRadius: 2,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  color="action"
                  onClick={handleFilterClick}
                  ref={iconRef}
                  style={{ cursor: "pointer" }}
                />
              </InputAdornment>
            ),
          }}
        />

        {/* 📌 Filter Dropdown */}
        <Popper
          open={openFilter}
          anchorEl={iconRef.current}
          placement="bottom-start"
          style={{ zIndex: 1300 }}
        >
          <ClickAwayListener onClickAway={handleClickAway}>
            <Paper sx={{ width: 300, mt: 1 }}>
              <List>
                {filters.map((item, idx) => (
                  <ListItemButton key={idx} onClick={() => handleSelect(item.path)}>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          </ClickAwayListener>
        </Popper>

        {/* ✅ Application Tracker Button */}
        <Button
          variant="contained"
          onClick={() => navigate(`/appTracker/${userId}`)}
          sx={{
            mt: 2,
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            bgcolor: "#2E8B57",
            "&:hover": { bgcolor: "#246b44" },
          }}
        >
          Application Tracker
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
