import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Button, Container, Dialog } from '@mui/material';
import PortfolioGrid from './components/PortfolioGrid';
import AdminUpload from './components/AdminUpload';

// Create a modern dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#bb86fc' }, // A nice deep purple accent
    background: { default: '#121212', paper: '#1e1e1e' }
  },
});

export default function App() {
  // --- NEW: State for the Admin Modal ---
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // --- NEW: Hotkey Listener (Ctrl + M) ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> {/* This resets basic browser margins and applies the dark background */}
      <Router>
        {/* Material Design Top Navigation */}
        <AppBar position="sticky" elevation={3}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              My Portfolio
            </Typography>
            <Button color="inherit" component={RouterLink} to="/">Main</Button>
            <Button color="inherit" onClick={() => scrollToSection('my-work-section')}>
              My Work
            </Button>
            {/* UPDATED: Admin button now opens the modal instead of routing */}
            {/* <Button color="inherit" onClick={() => setIsAdminOpen(true)}>
              Admin
            </Button> */}
          </Toolbar>
        </AppBar>

        {/* Main Content Area */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<PortfolioGrid />} />
            {/* The /admin Route was removed because it is now a modal */}
          </Routes>
        </Container>

        {/* --- NEW: The Admin Dialog Modal --- */}
        <Dialog 
          open={isAdminOpen} 
          onClose={() => setIsAdminOpen(false)} 
          maxWidth="sm" 
          fullWidth
        >
          <AdminUpload onClose={() => setIsAdminOpen(false)} />
        </Dialog>

      </Router>
    </ThemeProvider>
  );
}