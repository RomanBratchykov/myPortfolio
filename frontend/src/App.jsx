import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
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
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> {/* This resets basic browser margins and applies the dark background */}
      <Router>
        {/* Material Design Top Navigation */}
        <AppBar position="sticky" elevation={3}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              My Creative Portfolio
            </Typography>
            <Button color="inherit" component={RouterLink} to="/">Gallery</Button>
            <Button color="inherit" component={RouterLink} to="/admin">Admin</Button>
          </Toolbar>
        </AppBar>

        {/* Main Content Area */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<PortfolioGrid />} />
            <Route path="/admin" element={<AdminUpload />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}