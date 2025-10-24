import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  useTheme,
  Divider,
  useMediaQuery,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Avatar,
  alpha,
  IconButton,
} from "@mui/material";
import {
  Description,
  TrendingUp,
  AccessTime,
  PersonAdd,
} from "@mui/icons-material";
import Side_bar from "../SIDE_BAR/side_bar";
import { LineChart, lineElementClasses } from "@mui/x-charts/LineChart";
import { BarChart, barElementClasses } from "@mui/x-charts/BarChart";
import AddAdminModal from "./AddAdminModal";

/* ================== CONSTANTS ================== */
const primaryGreen = "#1d5236";
const lightGreen = alpha(primaryGreen, 0.1);
const darkGreen = "#0f2a1b";

/* ================== NEW COMPONENT: LIVE CLOCK ================== */

function LiveClock() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Update the date and time every second (1000 milliseconds)
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(timer);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Format time (HH:MM:SS) and date (Day, Month DD, YYYY)
  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // 24-hour format
  };

  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const timeString = currentDateTime.toLocaleTimeString("en-US", timeOptions);
  const dateString = currentDateTime.toLocaleDateString("en-US", dateOptions);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start", // Left-align text
        color: "white",
        pl: 2, // Added padding on the left to space it from the edge
        ml: 33,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          lineHeight: 1, // Tighter line height
          textShadow: `0 0 5px ${alpha("#000000", 0.5)}`, // Subtle shadow for contrast
        }}
      >
        {timeString}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: "0.8rem", opacity: 0.8 }}>
        {dateString}
      </Typography>
    </Box>
  );
}

/* ================== TOP BAR COMPONENTS ================== */

// The TopBar component itself
function TopBar({ onAddAdminClick, isSuperAdmin }) {
  const TOP_BAR_HEIGHT = 80;

  return (
    <Box
      sx={{
        width: "100%",
        height: TOP_BAR_HEIGHT,
        backgroundColor: primaryGreen,
        display: "flex",
        flexDirection: "row",
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
      {/* 1. LEFT ALIGNED: LIVE CLOCK */}
      <LiveClock />

      {/* 2. CENTERED: DASHBOARD TITLE */}
      <Typography
        variant="h5"
        component="div"
        sx={{
          fontWeight: "light",
          textShadow: `0 0 5px ${alpha("#000000", 0.5)}`,
          // This allows the title to be centered while the other items are at the edges
          position: "absolute",
          ml: 8,
          left: "50%",
          transform: "translateX(-50%)",
          display: { xs: "none", sm: "block" }, // Hide on extra small screens if needed
        }}
      >
        DASHBOARD OVERVIEW
      </Typography>

      {/* 3. RIGHT ALIGNED: ADD ADMIN BUTTON (Replaced 'ml: 215' with alignment) */}
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
            ml: "auto",
            mr: 2,
          }}
        >
          Add Admin
        </Button>
      )}
    </Box>
  );
}

/* ================== DASHBOARD COMPONENTS ================== */

// Custom Peso Icon
const PesoIcon = () => (
  <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>₱</Typography>
);

function Dashboard() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [openModal, setOpenModal] = useState(false);
  const TOP_BAR_HEIGHT = 80;
  const primaryGreen = "#034d06ff";

  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminData");
    if (storedAdmin) {
      setAdminData(JSON.parse(storedAdmin));
    }
  }, []);
  const userOffice = adminData?.Office?.toUpperCase() || "";
  const isSuperAdmin = userOffice === "SUPERADMIN";

  const onAddAdminClick = () => {
    if (!isSuperAdmin) {
      alert("Only SuperAdmin can add new admins.");
      return;
    }
    console.log("Opening Add Admin dialog...");
    // your dialog or navigation logic here
  };

  // Sample data for metrics
  const metrics = {
    totalApplications: 1245,
    approvedPermits: 890,
    pendingRenewals: 155,
    revenueCollected: 456789,
  };

  // Sample revenue data for line chart
  const revenueData = [
    { month: "Jan", revenue: 30000 },
    { month: "Feb", revenue: 45000 },
    { month: "Mar", revenue: 38000 },
    { month: "Apr", revenue: 52000 },
    { month: "May", revenue: 48000 },
    { month: "Jun", revenue: 61000 },
    { month: "Jul", revenue: 55000 },
    { month: "Aug", revenue: 67000 },
    { month: "Sep", revenue: 72000 },
    { month: "Oct", revenue: 78000 },
    { month: "Nov", revenue: 82000 },
    { month: "Dec", revenue: 91000 },
  ];

  const xLabels = revenueData.map((d) => d.month);
  const revenueValues = revenueData.map((d) => d.revenue);

  // Sample data for bar chart (e.g., applications breakdown by category)
  const barData = {
    categories: ["New Apps", "Renewals", "Permits", "Appeals"],
    values: [450, 300, 290, 205],
  };

  // Handlers for modal
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <Box
      sx={{
        display: "flex",
        background: "#f5f5f5",
        minHeight: "100vh",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      {/* 1. TOP BAR (Fixed at the top) */}
      <TopBar onAddAdminClick={handleOpenModal} isSuperAdmin={isSuperAdmin} />

      {/* 2. SIDE BAR AND MAIN CONTENT WRAPPER */}
      <Box
        sx={{
          display: "flex",
          width: "100%",
          flexGrow: 1,
          flexDirection: isSmallScreen ? "column" : "row",
          pt: `${TOP_BAR_HEIGHT}px`, // Add padding to push content down below fixed TopBar
          px: isSmallScreen ? 2 : 4,
          pb: 4,
        }}
      >
        {/* SIDE BAR */}
        {!isSmallScreen && <Side_bar />}

        {/* MAIN CONTENT */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            maxWidth: 1400,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            ml: isSmallScreen ? 0 : 2,
            mt: 4,
          }}
        >
          {/* Summary Metrics Grid */}
          <Grid
            container
            spacing={4}
            sx={{
              mb: 6,
              width: "100%",
            }}
          >
            <Grid item xs={12} sm={6} md={3}>
              <Card
                elevation={3}
                sx={{
                  background: "#ffffff",
                  borderRadius: 3,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: `0 12px 24px ${alpha(primaryGreen, 0.2)}`,
                  },
                  border: `1px solid ${lightGreen}`,
                  // === HEIGHT ADJUSTMENT HERE ===
                  height: 180, // Increased height for a taller card
                  width: 325,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                  >
                    <Box>
                      <Typography
                        color="textSecondary"
                        gutterBottom
                        sx={{ fontSize: "1.5rem", color: darkGreen }}
                      >
                        Total Applications
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", color: primaryGreen }}
                      >
                        {metrics.totalApplications.toLocaleString()}
                      </Typography>
                      <Chip
                        label="+12% from last month"
                        size="small"
                        sx={{
                          mt: 3,
                          background: lightGreen,
                          color: primaryGreen,
                        }}
                      />
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: lightGreen,
                        color: primaryGreen,
                        width: 65,
                        height: 65,
                      }}
                    >
                      <Description />
                    </Avatar>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                elevation={3}
                sx={{
                  background: "#ffffff",
                  borderRadius: 3,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: `0 12px 24px ${alpha(primaryGreen, 0.2)}`,
                  },
                  border: `1px solid ${lightGreen}`,
                  // === HEIGHT ADJUSTMENT HERE ===
                  height: 180, // Increased height for a taller
                  width: 325,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                  >
                    <Box>
                      <Typography
                        color="textSecondary"
                        gutterBottom
                        sx={{ fontSize: "1.5rem", color: darkGreen }}
                      >
                        Approved Permits
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", color: primaryGreen }}
                      >
                        {metrics.approvedPermits.toLocaleString()}
                      </Typography>
                      <Chip
                        label="+8% from last month"
                        size="small"
                        sx={{
                          mt: 3,
                          background: lightGreen,
                          color: primaryGreen,
                        }}
                      />
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: lightGreen,
                        color: primaryGreen,
                        width: 65,
                        height: 65,
                      }}
                    >
                      <TrendingUp />
                    </Avatar>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                elevation={3}
                sx={{
                  background: "#ffffff",
                  borderRadius: 3,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: `0 12px 24px ${alpha(primaryGreen, 0.2)}`,
                  },
                  border: `1px solid ${lightGreen}`,
                  // === HEIGHT ADJUSTMENT HERE ===
                  height: 180, // Increased height for a taller card
                  width: 325,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                  >
                    <Box>
                      <Typography
                        color="textSecondary"
                        gutterBottom
                        sx={{ fontSize: "1.5rem", color: darkGreen }}
                      >
                        Pending Renewals
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", color: primaryGreen }}
                      >
                        {metrics.pendingRenewals.toLocaleString()}
                      </Typography>
                      <Chip
                        label="Urgent: 23"
                        size="small"
                        color="warning"
                        sx={{ mt: 3 }}
                      />
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: lightGreen,
                        color: primaryGreen,
                        width: 65,
                        height: 65,
                      }}
                    >
                      <AccessTime />
                    </Avatar>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                elevation={3}
                sx={{
                  background: "#ffffff",
                  borderRadius: 3,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: `0 12px 24px ${alpha(primaryGreen, 0.2)}`,
                  },
                  border: `1px solid ${lightGreen}`,
                  // === HEIGHT ADJUSTMENT HERE ===
                  height: 180, // Increased height for a taller card
                  width: 320,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                  >
                    <Box>
                      <Typography
                        color="textSecondary"
                        gutterBottom
                        sx={{ fontSize: "1.5rem", color: darkGreen }}
                      >
                        Revenue Collected
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", color: primaryGreen }}
                      >
                        ₱{metrics.revenueCollected.toLocaleString()}
                      </Typography>
                      <Chip
                        label="+18% YoY"
                        size="small"
                        sx={{
                          mt: 3,
                          background: lightGreen,
                          color: primaryGreen,
                        }}
                      />
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: lightGreen,
                        color: primaryGreen,
                        width: 65,
                        height: 65,
                      }}
                    >
                      <PesoIcon />
                    </Avatar>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, width: "100%", borderColor: lightGreen }} />

          {/* Charts Section: Line Chart on left, Bar Chart on right in a new Grid */}
          <Grid container spacing={4} sx={{ width: "100%", mb: 6 }}>
            {/* Line Chart - Stays at 50% width on md+ screens */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                sx={{
                  // width: "100%", // Retain 100% width to fill the grid column
                  p: 3,
                  borderRadius: 3,
                  background: "#ffffff",
                  border: `1px solid ${lightGreen}`,
                  // === HEIGHT ADJUSTMENT HERE ===
                  height: 400, // Increased height for a taller chart container
                  display: "flex",
                  flexDirection: "column",
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
                  Revenue Trend (Annual)
                </Typography>
                <Box
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    justifyContet: "center",
                    alignItems: "center",
                  }}
                >
                  <LineChart
                    // === WIDTH/HEIGHT ADJUSTMENT ON CHART COMPONENT ===
                    width={600} // Set a new default width (though parent's styles override if set to 100% in sx)
                    height={300} // Set a new default height
                    series={[
                      {
                        data: revenueValues,
                        label: "Revenue",
                        color: primaryGreen,
                      },
                    ]}
                    xAxis={[{ scaleType: "point", data: xLabels }]}
                    sx={{
                      [`& .${lineElementClasses.root}`]: {
                        strokeWidth: 3,
                        strokeDasharray: "0",
                      },
                      ".MuiChartsLegend-root": {
                        color: darkGreen,
                      },
                      // This ensures the chart fills the width of its parent box
                      width: "100% !important",
                      maxWidth: "100% !important",
                    }}
                  />
                </Box>
              </Paper>
            </Grid>

            {/* Bar Chart - **ADJUSTED HERE** to align the entire item/paper to the right */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                // Using margin-left: auto effectively pushes the item to the right edge
                marginLeft: { xs: 0, md: "auto" },
                // Ensure it's a flex container for auto-margin to work on the item
                display: "flex",
                // Ensure the Paper fills the space if it has content, and aligns to the end of the Grid cell
                justifyContent: { xs: "center", md: "flex-end" },
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  // Retain 100% width to fill the grid column
                  width: "100%",
                  p: 3,
                  borderRadius: 3,
                  background: "#ffffff",
                  border: `1px solid ${lightGreen}`,
                  // === HEIGHT ADJUSTMENT HERE ===
                  height: 400, // Increased height for a taller chart container
                  display: "flex",
                  flexDirection: "column",
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
                {/* We keep the BarChart aligned right inside the Paper as well */}
                <Box
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <BarChart
                    // === WIDTH/HEIGHT ADJUSTMENT ON CHART COMPONENT ===
                    width={600} // Set a new default width
                    height={350} // Set a new default height
                    series={[{ data: barData.values, color: primaryGreen }]}
                    xAxis={[{ scaleType: "band", data: barData.categories }]}
                    sx={{
                      [`& .${barElementClasses.root}`]: {
                        fill: primaryGreen,
                      },
                      ".MuiChartsLegend-root": {
                        color: darkGreen,
                      },
                      // This ensures the chart fills the width of its parent box
                      width: "100% !important",
                      maxWidth: "100% !important",
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <AddAdminModal open={openModal} onClose={handleCloseModal} />
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
