import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Button, Container, Dialog } from '@mui/material';
import PortfolioGrid from './components/PortfolioGrid';
import AdminUpload from './components/AdminUpload';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#7e45c4' }, 
    background: { default: '#2d2d2d', paper: '#1e1e1e' }
  },
});

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

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
      <CssBaseline />
      <Router>
        <AppBar position="sticky" elevation={3}>
          <Toolbar>
            <Typography variant="h6" fontFamily={"-apple-system"} component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              My Portfolio
            </Typography>
            <Button color="inherit" fontFamily={"-apple-system"} component={RouterLink} to="/">Main</Button>
            <Button color="inherit" onClick={() => scrollToSection('my-work-section')}>
              My Work
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<PortfolioGrid />} />
          </Routes>
        </Container>

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