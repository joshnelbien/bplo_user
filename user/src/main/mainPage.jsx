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
            <Typography variant="h6" sx={{ my: 2 }}>
                BPS
            </Typography>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton sx={{ textAlign: "center" }} onClick={() => navigate(item.path)}>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <Button
                    fullWidth
                    variant="text"
                    sx={{ my: 1, color: '#09360D' }}
                    onClick={() => {
                        navigate("/login");
                        setMobileOpen(false);
                    }}
                >
                    Login
                </Button>
                <Button
                    fullWidth
                    variant="contained"
                    sx={{ my: 1 }}
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
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    ) : (
                        <Box sx={{ display: "flex", gap: 2 }}>
                            {navItems.map((item) => (
                                <Button key={item.label} color="inherit" onClick={() => navigate(item.path)}>
                                    {item.label}
                                </Button>
                            ))}
                        </Box>
                    )}

                    {!isMobile && (
                        <Box sx={{ ml: "auto", display: "flex", gap: 2 }}>
                            <Button
                                variant="text"
                                sx={{ color: "text.secondary" }}
                                onClick={() => navigate("/loginPage")}
                            >
                                Login
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
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
                justifyContent="center"
                alignItems="center"
                sx={{
                    height: "calc(100vh - 64px)",
                    textAlign: "center",
                    p: 4,
                }}
            >
                <Grid item>
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{ fontWeight: "bold", mb: 2 }}
                    >
                        BPLO System
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                        A streamlined platform designed to simplify the process of applying
                        for, renewing, and managing business permits. Our system reduces
                        bureaucracy, saves time, and provides a transparent and efficient
                        experience for businesses and government agencies alike.
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
}

export default App;