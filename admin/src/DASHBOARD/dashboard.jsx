import React from 'react';
import { Box, Paper, Typography, Grid, useMediaQuery, useTheme, alpha } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import Side_bar from '../SIDE_BAR/side_bar';
import { PieChart } from '@mui/x-charts/PieChart';

// Animation for card hover effect
const hoverAnimation = keyframes`
  0% { transform: translateY(0); box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
  50% { transform: translateY(-5px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2); }
  100% { transform: translateY(0); box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
`;

// Keyframes for the shaky effect
const shakyEffect = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(2deg); }
  50% { transform: rotate(0deg); }
  75% { transform: rotate(-2deg); }
  100% { transform: rotate(0deg); }
`;

// Keyframes for a pulse effect
const pulseEffect = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

// Keyframes for a bounce effect
const bounceEffect = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
`;

// Styled component for a professional-looking dashboard card with hover animation and fixed size
const DashboardCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: theme.shape.borderRadius * 2,
  textAlign: 'center',
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  minHeight: '200px', // Fixed minimum height for all cards
  minWidth: '200px',  // Fixed minimum width for all cards
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  '&:hover': {
    animation: `${hoverAnimation} 0.8s ease-in-out infinite`,
  },
}));

// Styled component for custom icons with animations
const AnimatedIcon = styled('img')(({ animation }) => ({
  width: '4rem',
  height: '4rem',
  marginRight: '1rem',
  animation: animation,
  '&:hover': {
    animation: 'none',
  }
}));

function Dashboard() {
  const theme = useTheme();
  const sidebarWidth = 270;

  // Sample data for the pie chart
  const businessData = [
    { id: 0, value: 300, label: 'Restaurants' },
    { id: 1, value: 500, label: 'Retail' },
    { id: 2, value: 250, label: 'Services' },
    { id: 3, value: 450, label: 'Manufacturing' },
  ];

  return (
    <Box sx={{
      display: 'flex',
      background: 'linear-gradient(to bottom, #ffffff, #e6ffe6)',
      minHeight: '100vh',
    }}>
      <Side_bar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${sidebarWidth}px)`,
          ml: { sm: `${sidebarWidth}px` },
        }}
      >
        <Grid container spacing={4}>
          {/* Card Section */}
          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard elevation={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <AnimatedIcon src="/totalbusiness.png" alt="Total Businesses" animation={`${shakyEffect} 1s infinite alternate`} />
                <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                  Total Businesses
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#006306', mb: 1 }}>1500</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>As of today</Typography>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard elevation={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <AnimatedIcon src="/totalrev.png" alt="Total Revenue" animation={`${pulseEffect} 2s infinite ease-in-out`} />
                <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                  Total Revenue
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#006306', mb: 1 }}>₱1.2M</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>This Year</Typography>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard elevation={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <AnimatedIcon src="/activeapp.png" alt="Active Applications" animation={`${bounceEffect} 1.5s infinite`} />
                <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                  Active Applications
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#006306', mb: 1 }}>345</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Current count</Typography>
            </DashboardCard>
          </Grid>
          {/* New Grid item for the Pie Chart */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{
              p: 4,
              mt: 4,
              borderRadius: theme.shape.borderRadius * 2,
              textAlign: 'center',
              minHeight: '400px', // Set a minimum height for the chart container
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              background: alpha(theme.palette.background.paper, 0.9), // Add transparency
            }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#006306' }}>
                Business Category Distribution
              </Typography>
              
              {/* Pie Chart Component */}
              <PieChart
                series={[
                  {
                    data: businessData,
                    innerRadius: 30,
                    outerRadius: 120,
                    paddingAngle: 5,
                    cornerRadius: 5,
                    startAngle: -90,
                    endAngle: 180,
                    cx: 150,
                    cy: 150,
                  },
                ]}
                width={820}
                height={300}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Dashboard;