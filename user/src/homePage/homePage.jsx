import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { useNavigate } from "react-router-dom";

function HomePage
() {

      const navigate = useNavigate();
    
  return (
  <Container 
      maxWidth="sm" 
      sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" 
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          padding: 4, 
          borderRadius: 2, 
          width: "100%", 
          maxWidth: 400,
          textAlign: "center"
        }}
      >
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          noValidate
          autoComplete="off"
        >
          <Button onClick={() => navigate("/newApplicationPage")} variant="contained" color="primary" fullWidth>
            New Application
          </Button>
           <Button variant="contained" color="primary" fullWidth>
            Renew Application
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default HomePage
