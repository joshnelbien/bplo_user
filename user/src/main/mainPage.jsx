import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Button,
    Typography,
    Box,
    Grid,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

function App() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const navItems = [
        { label: "About", path: "/about" },
        { label: "Projects", path: "/projects" },
    ];

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton sx={{ textAlign: "center" }} onClick={() => navigate(item.path)}>
                            <ListItemText primary={item.label} sx={{ '& .MuiListItemText-primary': { fontWeight: 'bold', color: '#09360D' } }} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <Button
                    fullWidth
                    variant="text"
                    sx={{ my: 1, color: '#09360D', fontWeight: 'bold' }}
                    onClick={() => {
                        navigate("/loginPage");
                        setMobileOpen(false);
                    }}
                >
                    Login
                </Button>
                <Button
                    fullWidth
                    variant="contained"
                    sx={{
                        fontWeight: 'bold',
                        backgroundColor: '#09360D',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#07270a',
                        },
                    }}
                    onClick={() => {
                        navigate("/register");
                        setMobileOpen(false);
                    }}
                >
                    Register Account
                </Button>
            </List>
        </Box>
    );

    useEffect(() => {
        document.body.style.overflow = "hidden";
        document.body.style.margin = "0";
        document.body.style.padding = "0";

        return () => {
            document.body.style.overflow = "";
            document.body.style.margin = "";
            document.body.style.padding = "";
        };
    }, []);

    return (
        <Box>
            <AppBar
                position="static"
                sx={{
                    backgroundColor: "#fff",
                    color: "text.primary",
                    boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2)",
                }}
            >
                <Toolbar>
                    {isMobile ? (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, color: '#09360D' }}
                        >
                            <MenuIcon />
                        </IconButton>
                    ) : (
                        <Box sx={{ display: "flex", gap: 2 }}>
                            {navItems.map((item) => (
                                <Button key={item.label} color="inherit" onClick={() => navigate(item.path)} sx={{ fontWeight: 'bold', color: '#09360D' }}>
                                    {item.label}
                                </Button>
                            ))}
                        </Box>
                    )}

                    {!isMobile && (
                        <Box sx={{ ml: "auto", display: "flex", gap: 2 }}>
                            <Button
                                variant="text"
                                sx={{ my: 1, color: '#09360D', fontWeight: 'bold' }}
                                onClick={() => navigate("/loginPage")}
                            >
                                Login
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                    fontWeight: 'bold',
                                    backgroundColor: '#09360D',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#07270a',
                                    },
                                }}
                                onClick={() => navigate("/registerPage")}
                            >
                                Register Account
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer */}
            <nav>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>

            <Grid
                container
                direction="column"
                justifyContent={{ xs: "center", md: "flex-start" }}
                alignItems={{ xs: "center", md: "flex-start" }}
                sx={{
                    height: "calc(100vh - 64px)",
                    p: { xs: 2, md: 4 },
                    mt: { xs: 0, md: 30 },
                    ml: { xs: 0, md: 25 },
                }}
            >
                <Grid item sx={{ textAlign: { xs: "center", md: "left" } }}>
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: "bold",
                            mb: 2,
                            typography: { xs: "h4", sm: "h3" },
                        }}
                    >
                        BPLO SOFTWARE SOLUTIONS
                    </Typography>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{
                            mb: 4,
                            typography: { xs: "body1", sm: "h6" },
                            whiteSpace: 'pre-line', // This is the new, responsive CSS rule
                        }}
                    >
                        {`A streamlined platform designed to simplify the process of applying for, renewing,
and managing business permits. Our system reduces bureaucracy, saves
time, and provides a transparent and efficient experience for
businesses and government agencies alike.`}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
}

export default App;