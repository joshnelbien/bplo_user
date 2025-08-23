import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {

    const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // you can add validation / API call here
    navigate("/dashboard"); // navigate to dashboard
  };


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
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>

        <Box
         onSubmit={handleLogin}
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          noValidate
          autoComplete="off"
        >
          <TextField 
            id="username" 
            label="Username" 
            variant="outlined" 
            fullWidth 
          />
          <TextField 
            id="password" 
            label="Password" 
            type="password" 
            variant="outlined" 
            fullWidth 
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
