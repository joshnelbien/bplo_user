import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  Grid,
  useTheme,
  Divider,
  Button,
  Card,
  CardContent,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  alpha,
} from "@mui/material";
import {
  Description,
  TrendingUp,
  AccessTime,
  PersonAdd,
} from "@mui/icons-material";
import Side_bar from "../SIDE_BAR/side_bar";
import { BarChart, barElementClasses } from "@mui/x-charts/BarChart";
import AddAdminModal from "./AddAdminModal";

/* ================== CONSTANTS ================== */
const primaryGreen = "#1d5236";
const lightGreen = alpha(primaryGreen, 0.1);
const darkGreen = "#0f2a1b";
const drawerWidth = 0;

/* ================== LIVE CLOCK ================== */
function LiveClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const date = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        color: "white",
        pl: { xs: 1, md: 3 },
        minWidth: { xs: 130, md: 180 },
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          lineHeight: 1,
          textShadow: "0 1px 3px rgba(0,0,0,0.4)",
        }}
      >
        {time}
      </Typography>
      <Typography
        variant="caption"
        sx={{ opacity: 0.9, fontSize: { xs: "0.65rem", md: "0.75rem" } }}
      >
        {date}
      </Typography>
    </Box>
  );
}

/* ================== TOP BAR ================== */
function TopBar({ onAddAdminClick, isSuperAdmin }) {
  const TOP_BAR_HEIGHT = 80;

  return (
    <Box
      sx={{
        width: "100%",
        height: TOP_BAR_HEIGHT,
        backgroundColor: primaryGreen,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        boxSizing: "border-box",
        color: "white",
        boxShadow: 3,
        zIndex: 1100,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
      }}
    >
      <LiveClock />
      <Typography
        variant="h5"
        sx={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          fontWeight: "light",
          textShadow: `0 0 5px ${alpha("#000000", 0.5)}`,
          display: { xs: "none", sm: "block" },
        }}
      >
        DASHBOARD OVERVIEW
      </Typography>

      {isSuperAdmin && (
        <Button
          variant="contained"
          onClick={onAddAdminClick}
          startIcon={<PersonAdd sx={{ color: primaryGreen }} />}
          sx={{
            background: "#ffffff",
            color: primaryGreen,
            "&:hover": { background: alpha("#ffffff", 0.8) },
            borderRadius: 20,
            py: 1,
            textTransform: "none",
            fontWeight: "bold",
            boxShadow: `0 4px 12px ${alpha(primaryGreen, 0.5)}`,
            mr: 2,
          }}
        >
          Add Admin
        </Button>
      )}
    </Box>
  );
}

/* ================== MAIN DASHBOARD ================== */
function Dashboard() {
  const API = import.meta.env.VITE_API_BASE;
  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const [totalApplications, setTotalApplications] = useState(0);
  const [adminData, setAdminData] = useState(null);
  const [appBreakdown, setAppBreakdown] = useState({
    newApplications: 0,
    renewApplications: 0,
  });
  const [approvedPermits, setApprovedPermits] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]); // full monthly objects [{month, count}]
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("all"); // "all" or "01".."12"
  const TOP_BAR_HEIGHT = 80;

  useEffect(() => {
    const stored = localStorage.getItem("adminData");
    if (stored) setAdminData(JSON.parse(stored));
  }, []);

  const userOffice = adminData?.Office?.toUpperCase() || "";
  const isSuperAdmin = userOffice === "SUPERADMIN";

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  // Fetch application counts
  useEffect(() => {
    const fetchAppData = async () => {
      try {
        const res = await axios.get(`${API}/newApplication/application-counts`);
        setTotalApplications(res.data.totalApplications);
        setAppBreakdown({
          newApplications: res.data.newApplications,
          renewApplications: res.data.renewApplications,
        });
        setMonthlyData(res.data.monthlyApplications || []);
      } catch (err) {
        console.error("Failed to fetch application counts:", err);
        setTotalApplications(0);
        setAppBreakdown({ newApplications: 0, renewApplications: 0 });
        setMonthlyData([]);
      }
    };
    fetchAppData();
  }, []);

  // Fetch approved permits
  useEffect(() => {
    const fetchApprovedPermits = async () => {
      try {
        const res = await axios.get(`${API}/businessProfile/approved-counts`);
        setApprovedPermits(res.data.totalApplications);
      } catch (err) {
        console.error("Failed to fetch approved permits:", err);
        setApprovedPermits(0);
      }
    };
    fetchApprovedPermits();
  }, []);

  const metrics = {
    totalApplications,
    approvedPermits,
    pendingRenewals: totalApplications - approvedPermits,
  };

  const barData = {
    categories: ["New Applications", "Renewals"],
    values: [appBreakdown.newApplications, appBreakdown.renewApplications],
  };

  // Generate all months of the year
  const allMonths = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );

  // Prepare chart data based on selected year and month
  const monthlyCounts = allMonths.map((month) => {
    if (selectedMonth !== "all" && month !== selectedMonth) return 0;
    const item = monthlyData.find(
      (d) =>
        d.month.startsWith(`${selectedYear}-${month}`) ||
        d.month === `${selectedYear}-${month}`
    );
    return item ? parseInt(item.count, 10) : 0;
  });

  return (
    <Box
      sx={{
        display: "flex",
        background: "#f5f5f5",
        minHeight: "100vh",
        flexDirection: "column",
      }}
    >
      {/* TOP BAR */}
      <TopBar onAddAdminClick={handleOpenModal} isSuperAdmin={isSuperAdmin} />

      {/* MAIN LAYOUT */}
      <Box
        sx={{
          display: "flex",
          width: "100%",
          flexGrow: 1,
          pt: `${TOP_BAR_HEIGHT}px`,
          px: { xs: 2, md: 3 },
          pb: 4,
        }}
      >
        <Side_bar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: "100%",
            ml: { md: `${drawerWidth}px` },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 3,
            px: { xs: 1, sm: 2 },
          }}
        >
          {/* METRICS CARDS */}
          <Grid container spacing={3} sx={{ mb: 5, width: "100%" }}>
            {[
              {
                title: "Total Applications",
                value: metrics.totalApplications,
                icon: <Description />,
              },
              {
                title: "Approved Permits",
                value: metrics.approvedPermits,
                icon: <TrendingUp />,
              },
              {
                title: "Pending Renewals",
                value: metrics.pendingRenewals,
                icon: <AccessTime />,
              },
            ].map((item, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card
                  elevation={3}
                  sx={{
                    background: "#ffffff",
                    borderRadius: 3,
                    height: 180,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: `0 12px 24px ${alpha(primaryGreen, 0.2)}`,
                    },
                    border: `1px solid ${lightGreen}`,
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography
                          color="textSecondary"
                          gutterBottom
                          sx={{ fontSize: "1.5rem", color: darkGreen }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          variant="h5"
                          sx={{ fontWeight: "bold", color: primaryGreen }}
                        >
                          {item.value}
                        </Typography>
                      </Box>
                      <Avatar
                        sx={{
                          bgcolor: lightGreen,
                          color: primaryGreen,
                          width: 60,
                          height: 60,
                        }}
                      >
                        {item.icon}
                      </Avatar>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 4, width: "100%", borderColor: lightGreen }} />

          {/* APPLICATIONS BREAKDOWN BAR CHART */}
          <Grid container spacing={3} sx={{ width: "100%", mb: 5 }}>
            {/* APPLICATIONS BREAKDOWN */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: "#ffffff",
                  border: `1px solid ${lightGreen}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontWeight: "bold",
                    color: darkGreen,
                    textAlign: "center",
                  }}
                >
                  Applications Breakdown
                </Typography>
                <Box
                  sx={{
                    width: { xs: "100%", sm: "90%", md: 500 },
                    height: { xs: 250, sm: 300, md: 350 },
                  }}
                >
                  <BarChart
                    series={[{ data: barData.values, color: primaryGreen }]}
                    xAxis={[{ scaleType: "band", data: barData.categories }]}
                    sx={{
                      [`& .${barElementClasses.root}`]: { fill: primaryGreen },
                      ".MuiChartsLegend-root": { color: darkGreen },
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </Box>
              </Paper>
            </Grid>

            {/* MONTHLY CHART WITH YEAR & MONTH FILTER */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: "#ffffff",
                  border: `1px solid ${lightGreen}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontWeight: "bold",
                    color: darkGreen,
                    textAlign: "center",
                  }}
                >
                  Applications per Month
                </Typography>

                {/* YEAR & MONTH DROPDOWNS */}
                <Box
                  sx={{ display: "flex", gap: 1, mb: 0.5, flexWrap: "wrap" }}
                >
                  {/* Year Dropdown */}
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="year-select-label">Year</InputLabel>
                    <Select
                      labelId="year-select-label"
                      value={selectedYear}
                      label="Year"
                      onChange={(e) =>
                        setSelectedYear(parseInt(e.target.value))
                      }
                      sx={{
                        bgcolor: "#f5f5f5",
                        borderRadius: 1,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: primaryGreen,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: darkGreen,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: primaryGreen,
                        },
                      }}
                    >
                      {Array.from(
                        { length: 5 },
                        (_, i) => new Date().getFullYear() - i
                      ).map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Month Dropdown */}
                  <FormControl sx={{ minWidth: 140 }}>
                    <InputLabel id="month-select-label">Month</InputLabel>
                    <Select
                      labelId="month-select-label"
                      value={selectedMonth}
                      label="Month"
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      sx={{
                        bgcolor: "#f5f5f5",
                        borderRadius: 1,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: primaryGreen,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: darkGreen,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: primaryGreen,
                        },
                      }}
                    >
                      <MenuItem value="all">All Months</MenuItem>
                      {[
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ].map((m, idx) => (
                        <MenuItem
                          key={idx}
                          value={(idx + 1).toString().padStart(2, "0")}
                        >
                          {m}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box
                  sx={{
                    width: { xs: "100%", sm: "90%", md: 700 },
                    height: { xs: 300, sm: 400, md: 280 },
                  }}
                >
                  <BarChart
                    series={[{ data: monthlyCounts, color: primaryGreen }]}
                    xAxis={[
                      {
                        scaleType: "band",
                        data: [
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "Jun",
                          "Jul",
                          "Aug",
                          "Sep",
                          "Oct",
                          "Nov",
                          "Dec",
                        ],
                      },
                    ]}
                    sx={{
                      [`& .${barElementClasses.root}`]: { fill: primaryGreen },
                      ".MuiChartsLegend-root": { color: darkGreen },
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* MODAL */}
          <AddAdminModal open={openModal} onClose={handleCloseModal} />
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
