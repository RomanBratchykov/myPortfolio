import { useEffect, useState } from 'react';
import { 
  Grid, Card, CardMedia, CardContent, Typography, Chip, Box, CircularProgress, 
  Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Divider, Avatar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default function PortfolioGrid() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal States
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetch('https://myportfolio-8tka.onrender.com/api/content')
      .then(res => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedItem(null);
  };

  const renderMedia = (item, isModal = false) => {
    const height = isModal ? "auto" : "250";
    const maxHeight = isModal ? "400px" : "auto";

    if (item.category === 'video') {
      return (
        <CardMedia
          component="video"
          height={height}
          src={item.fileUrl}
          controls
          sx={{ objectFit: 'cover', backgroundColor: '#000', maxHeight }}
        />
      );
    }
    
    if (item.category === 'music') {
      return (
        <Box sx={{ height: isModal ? '100px' : '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2a2a2a', p: 2 }}>
          <audio controls src={item.fileUrl} style={{ width: '100%' }}>
            Your browser does not support the audio element.
          </audio>
        </Box>
      );
    }

    return (
      <CardMedia
        component="img"
        height={height}
        image={item.fileUrl}
        alt={item.title}
        sx={{ objectFit: 'cover', maxHeight }}
      />
    );
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 4 }}>Could not load portfolio: {error}</Alert>;

  return (
    <div>
      {/* --- ABOUT ME SECTION --- */}
      <Box sx={{ mb: 8, mt: 4 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar 
              alt="Roman" 
              src="/romanphoto.png" // Replace with your actual photo URL
              sx={{ width: 250, height: 250, boxShadow: 3 }} 
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Hi, I'm Roman Bratchykov
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              I am a 2nd-year Computer Science student at Chernivtsi National University. 
              I specialize in design and photography and have a deep interest in desing, music, software engineering, mobile game development, and creating cross-platform applications.
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>My Tech Stack:</Typography>
              <Chip label="C#" color="primary" sx={{ mr: 1, mb: 1 }} />
              <Chip label="React & Vite" color="primary" sx={{ mr: 1, mb: 1 }} />
              <Chip label="Node.js" color="primary" sx={{ mr: 1, mb: 1 }} />
              <Chip label="Entity Framework" color="primary" sx={{ mr: 1, mb: 1 }} />
              <Chip label="Adobe Cloud(Photoshop, Illustrator, Premier Pro, After)" color="primary" sx={{ mr: 1, mb: 1 }} />
              <Chip label="Kotlin" color="primary" sx={{ mr: 1, mb: 1 }} />
              <Chip label="Affinity Designer" color="primary" sx={{ mr: 1, mb: 1 }} />
              <Chip label="Figma" color="primary" sx={{ mr: 1, mb: 1 }} />
              <Chip label="FL Studio" color="primary" sx={{ mr: 1, mb: 1 }} />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Soft Skills:</Typography>
              <Chip label="Project Management" color="primary" sx={{ mr: 1, mb: 1 }} />
              <Chip label="Communication" color="primary" sx={{ mr: 1, mb: 1 }} />
              <Chip label="Problem Solving" color="primary" sx={{ mr: 1, mb: 1 }} />
              <Chip label="Teamwork" color="primary" sx={{ mr: 1, mb: 1 }} />
              <Chip label="Adaptability" color="primary" sx={{ mr: 1, mb: 1 }} />
              <Chip label="Leadership" color="primary" sx={{ mr: 1, mb: 1 }} />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" startIcon={<GitHubIcon />} href="https://github.com/RomanBratchykov" target="_blank">
                GitHub
              </Button>
              <Button variant="outlined" startIcon={<LinkedInIcon />} href="https://www.linkedin.com/in/roman-bratchykov-9112b5330" target="_blank">
                LinkedIn
              </Button>
              <Button variant="outlined" startIcon={<LinkedInIcon />} href="https://www.behance.net/romanbratchykov" target="_blank">
                Behance
              </Button>
              <Button variant="outlined" startIcon={<LinkedInIcon />} href="https://www.spotify.com/" target="_blank">
                Spotify
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ mb: 6 }} />

      {/* --- PORTFOLIO GRID --- */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Featured Work
      </Typography>

      {items.length === 0 && <Typography color="text.secondary">No items uploaded yet.</Typography>}

      <Grid container spacing={4}>
        {items.map(item => (
          <Grid item key={item._id} xs={12} sm={6} md={4}>
            <Card 
              onClick={() => handleCardClick(item)}
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                cursor: 'pointer',
                transition: '0.3s', 
                '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } 
              }}
            >
              {renderMedia(item)}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">{item.title}</Typography>
                <Chip label={item.category.toUpperCase()} color={item.category === 'music' ? 'secondary' : 'primary'} size="small" variant="outlined" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* --- PROJECT DETAIL MODAL --- */}
      <Dialog open={openModal} onClose={handleClose} maxWidth="md" fullWidth>
        {selectedItem && (
          <>
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" fontWeight="bold">
                {selectedItem.title}
              </Typography>
              <IconButton onClick={handleClose} sx={{ color: (theme) => theme.palette.grey[500] }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            
            <DialogContent dividers sx={{ p: 0 }}>
              {/* Show the media full size in the modal */}
              <Box sx={{ width: '100%', backgroundColor: '#121212' }}>
                {renderMedia(selectedItem, true)}
              </Box>
              
              <Box sx={{ p: 3 }}>
                <Chip label={selectedItem.category.toUpperCase()} color="primary" sx={{ mb: 2 }} />
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  About this project
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {selectedItem.description || "No description provided for this project."}
                </Typography>
              </Box>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={handleClose} color="primary" variant="contained">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}