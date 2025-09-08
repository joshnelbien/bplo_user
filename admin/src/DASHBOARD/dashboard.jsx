import React from 'react';
import { Box, Paper, Typography, Grid, useMediaQuery, useTheme, alpha } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import Side_bar from '../SIDE_BAR/side_bar';

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
          {/* The "Total Businesses" card was removed from here. */}
        </Grid>
      </Box>
    </Box>
  );
}

export default Dashboard;