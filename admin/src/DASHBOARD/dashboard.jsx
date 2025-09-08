import React from 'react';
import { Box, Paper, Typography, Grid, useMediaQuery, useTheme, alpha } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import Side_bar from '../SIDE_BAR/side_bar';

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