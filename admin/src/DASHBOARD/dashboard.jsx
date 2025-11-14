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
const drawerWidth = 270; // Match with side_bar.jsx

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
        pl: { xs: 1, md: 3 },          // responsive left padding
        minWidth: { xs: 130, md: 180 }, // keep it from collapsing
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

/* ================== PESO ICON ================== */
const PesoIcon = () => (
  <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>₱</Typography>
);

/* ================== MAIN DASHBOARD ================== */
function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [openModal, setOpenModal] = useState(false);
  const TOP_BAR_HEIGHT = 80;

  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("adminData");
    if (stored) setAdminData(JSON.parse(stored));
  }, []);

  const userOffice = adminData?.Office?.toUpperCase() || "";
  const isSuperAdmin = userOffice === "SUPERADMIN";

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  // Sample Data
  const metrics = {
    totalApplications: 1245,
    approvedPermits: 890,
    pendingRenewals: 155,
    revenueCollected: 456789,
  };

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

  const barData = {
    categories: ["New Apps", "Renewals", "Permits", "Appeals"],
    values: [450, 300, 290, 205],
  };

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

      {/* MAIN LAYOUT: SIDEBAR + CONTENT */}
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
        {/* SIDEBAR - Always rendered */}
        <Side_bar />

        {/* MAIN CONTENT */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: "100%",
            ml: { md: `${drawerWidth}px` }, // Push content right on md+
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
                chip: "+12% from last month",
                icon: <Description />,
              },
              {
                title: "Approved Permits",
                value: metrics.approvedPermits,
                chip: "+8% from last month",
                icon: <TrendingUp />,
              },
              {
                title: "Pending Renewals",
                value: metrics.pendingRenewals,
                chip: "Urgent: 23",
                chipColor: "warning",
                icon: <AccessTime />,
              },
              {
                title: "Revenue Collected",
                value: `₱${metrics.revenueCollected.toLocaleString()}`,
                chip: "+18% YoY",
                icon: <PesoIcon />,
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
                        <Chip
                          label={item.chip}
                          size="small"
                          color={item.chipColor || "default"}
                          sx={{
                            mt: 2,
                            background: item.chipColor ? undefined : lightGreen,
                            color: item.chipColor ? undefined : primaryGreen,
                          }}
                        />
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

          {/* CHARTS */}
          <Grid container spacing={4} sx={{ width: "100%", mb: 6 }}>
            {/* LINE CHART */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: "#ffffff",
                  border: `1px solid ${lightGreen}`,
                  height: { xs: 300, sm: 350, md: 400 },
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
                <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                  <LineChart
                    series={[
                      {
                        data: revenueValues,
                        label: "Revenue",
                        color: primaryGreen,
                      },
                    ]}
                    xAxis={[{ scaleType: "point", data: xLabels }]}
                    sx={{
                      [`& .${lineElementClasses.root}`]: { strokeWidth: 3 },
                      ".MuiChartsLegend-root": { color: darkGreen },
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </Box>
              </Paper>
            </Grid>

            {/* BAR CHART */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: "#ffffff",
                  border: `1px solid ${lightGreen}`,
                  height: { xs: 300, sm: 350, md: 400 },
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
                <Box sx={{ flexGrow: 1, minHeight: 0 }}>
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
          </Grid>

          {/* MODAL */}
          <AddAdminModal open={openModal} onClose={handleCloseModal} />
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;