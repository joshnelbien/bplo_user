import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  useTheme,
  Divider,
  useMediaQuery,
  Button,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import Side_bar from "../SIDE_BAR/side_bar";
import { LineChart } from "@mui/x-charts/LineChart";

import BusinessIcon from "@mui/icons-material/Business";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AddAdminModal from "./AddAdminModal";

/* ================== STYLES ================== */
const hoverAnimation = keyframes`
  0% { transform: translateY(0); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
  50% { transform: translateY(-6px); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
  100% { transform: translateY(0); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
`;

const DashboardCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  textAlign: "center",
  transition: "all 0.3s ease-in-out",
  cursor: "pointer",
  minHeight: "200px",
  minWidth: "250px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  "&:hover": {
    animation: `${hoverAnimation} 0.8s ease-in-out`,
    transform: "translateY(-6px)",
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "3rem",
}));

/* ================== UTILITY FUNCTIONS ================== */
const sumArray = (arr) => arr.reduce((a, b) => a + b, 0);

const calculateGrowth = (currentArr, previousArr) => {
  const currentSum = sumArray(currentArr);
  const previousSum = sumArray(previousArr);
  if (previousSum === 0) return 0;
  return ((currentSum - previousSum) / previousSum) * 100;
};

// ✅ Fixed filtering function
const filterByMonth = (dataArr, monthsArr, selectedMonth) => {
  if (selectedMonth === "All") {
    return { data: dataArr, labels: monthsArr };
  } else {
    const idx = monthsArr.indexOf(selectedMonth);
    return {
      data: idx >= 0 ? [dataArr[idx]] : [],
      labels: idx >= 0 ? [monthsArr[idx]] : [],
    };
  }
};

/* ================== COMPONENTS ================== */
const GrowthIndicator = ({ growth }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      mt: 1,
    }}
  >
    {growth >= 0 ? (
      <ArrowUpwardIcon color="success" fontSize="small" />
    ) : (
      <ArrowDownwardIcon color="error" fontSize="small" />
    )}
    <Typography
      variant="subtitle2"
      color={growth >= 0 ? "success.main" : "error.main"}
      sx={{ ml: 0.5 }}
    >
      {Math.abs(growth).toFixed(1)}%
    </Typography>
  </Box>
);

const renderCard = (Icon, label, value, growth, color) => (
  <Grid item xs={12} md={4}>
    <DashboardCard>
      <IconWrapper>
        <Icon color={color} fontSize="large" />
      </IconWrapper>
      <Typography variant="h6" color="textSecondary">
        {label}
      </Typography>
      <Typography variant="h4" color={`${color}.main`} fontWeight="bold">
        {sumArray(value).toLocaleString()}
      </Typography>
      <GrowthIndicator growth={growth} />
    </DashboardCard>
  </Grid>
);

/* ================== DASHBOARD ================== */
function Dashboard() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [openModal, setOpenModal] = useState(false);

  const months = [
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
  ];
  const years = [2024, 2025, 2026];

  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedYear, setSelectedYear] = useState(2025);

  /* ================== HARD CODED DATA ================== */
  const businesses = [
    { year: 2025, month: "Jan", type: "Renewal", amount: 120 },
    { year: 2025, month: "Jan", type: "New", amount: 80 },
    { year: 2025, month: "Feb", type: "Renewal", amount: 150 },
    { year: 2025, month: "Feb", type: "New", amount: 90 },
    { year: 2025, month: "Mar", type: "Renewal", amount: 180 },
    { year: 2025, month: "Mar", type: "New", amount: 110 },
    { year: 2024, month: "Jan", type: "Renewal", amount: 100 },
    { year: 2024, month: "Jan", type: "New", amount: 70 },
    { year: 2024, month: "Feb", type: "Renewal", amount: 130 },
    { year: 2024, month: "Feb", type: "New", amount: 60 },
    { year: 2024, month: "Mar", type: "Renewal", amount: 160 },
    { year: 2024, month: "Mar", type: "New", amount: 90 },
  ];

  /* ================== PROCESS DATA ================== */
  // Filter by year
  const businessesByYear = businesses.filter(
    (b) => parseInt(b.year) === selectedYear
  );

  // Map monthly sums
  const renewalData = months.map((month) =>
    sumArray(
      businessesByYear
        .filter((b) => b.type === "Renewal" && b.month === month)
        .map((b) => parseInt(b.amount || 0))
    )
  );

  const newBusinessesData = months.map((month) =>
    sumArray(
      businessesByYear
        .filter((b) => b.type === "New" && b.month === month)
        .map((b) => parseInt(b.amount || 0))
    )
  );

  const registeredData = renewalData.map(
    (val, i) => val + newBusinessesData[i]
  );

  // Previous year data for growth
  const businessesPrevYear = businesses.filter(
    (b) => parseInt(b.year) === selectedYear - 1
  );
  const prevRenewal = months.map((month) =>
    sumArray(
      businessesPrevYear
        .filter((b) => b.type === "Renewal" && b.month === month)
        .map((b) => parseInt(b.amount || 0))
    )
  );
  const prevNewBusinesses = months.map((month) =>
    sumArray(
      businessesPrevYear
        .filter((b) => b.type === "New" && b.month === month)
        .map((b) => parseInt(b.amount || 0))
    )
  );
  const prevRegistered = prevRenewal.map(
    (val, i) => val + prevNewBusinesses[i]
  );

  /* ================== CALCULATIONS ================== */
  const growthRenewal = calculateGrowth(renewalData, prevRenewal);
  const growthNew = calculateGrowth(newBusinessesData, prevNewBusinesses);
  const growthRegistered = calculateGrowth(registeredData, prevRegistered);

  const renewalFiltered = filterByMonth(renewalData, months, selectedMonth);
  const newFiltered = filterByMonth(newBusinessesData, months, selectedMonth);
  const registeredFiltered = filterByMonth(
    registeredData,
    months,
    selectedMonth
  );

  const chartRenewal = renewalFiltered.data;
  const chartNew = newFiltered.data;
  const chartRegistered = registeredFiltered.data;
  const chartMonths = renewalFiltered.labels;

  return (
    <Box
      sx={{
        display: "flex",
        background: "linear-gradient(to bottom, #ffffff, #e6ffe6)",
        minHeight: "100vh",
        flexDirection: isSmallScreen ? "column" : "row",
        justifyContent: "center",
        alignItems: "flex-start",
        px: isSmallScreen ? 2 : 4,
      }}
    >
      {!isSmallScreen && <Side_bar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          maxWidth: 1200,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Filters */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            gap: 2,
            justifyContent: "center",
          }}
        >
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ padding: "8px", borderRadius: "4px" }}
          >
            <option value="All">All Months</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            style={{ padding: "8px", borderRadius: "4px" }}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </Box>

        {/* Cards Section */}
        <Grid container spacing={15.7} justifyContent="center">
          {renderCard(
            BusinessIcon,
            "Renewal",
            chartRenewal,
            growthRenewal,
            "success"
          )}
          {renderCard(
            PersonAddIcon,
            "New Businesses",
            chartNew,
            growthNew,
            "error"
          )}
          {renderCard(
            HowToRegIcon,
            "Registered Businesses",
            chartRegistered,
            growthRegistered,
            "primary"
          )}
        </Grid>

        <Divider sx={{ my: 4, width: "100%" }} />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)}
        >
          Add Admin
        </Button>

        <AddAdminModal open={openModal} onClose={() => setOpenModal(false)} />
        {/* Data Analytics Graph */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 4,
            boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
            height: isSmallScreen ? 350 : 520,
            width: "100%",
            maxWidth: 1200,
            marginTop: 4,
          }}
        >
          <Typography variant="h6" gutterBottom textAlign="center">
            Overview
          </Typography>
          <LineChart
            height={isSmallScreen ? 300 : 440}
            xAxis={[{ scaleType: "point", data: chartMonths }]}
            series={[
              {
                data: chartRenewal,
                label: "Renewal",
                color: theme.palette.success.main,
                showMark: true,
              },
              {
                data: chartNew,
                label: "New Businesses",
                color: theme.palette.error.main,
                showMark: true,
              },
              {
                data: chartRegistered,
                label: "Registered Businesses",
                color: theme.palette.primary.main,
                showMark: true,
              },
            ]}
            grid={{ vertical: true, horizontal: true }}
          />
        </Paper>
      </Box>
    </Box>
  );
}

export default Dashboard;
