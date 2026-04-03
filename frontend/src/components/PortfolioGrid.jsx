import { useEffect, useState } from 'react';
import { 
  Grid, Card, CardMedia, CardContent, Typography, Chip, Box, CircularProgress, 
  Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Divider, Avatar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Link } from '@mui/icons-material';

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
    const maxHeight = isModal ? "85vh" : "auto";

    if (item.category === 'video') {
      return (
        <CardMedia
          component="video"
          height={height}
          src={item.fileUrl}
          controls
          sx={{ objectFit: 'contain', backgroundColor: '#000', maxHeight }}
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

    // FIX 2: Default fallback for Images / Designs
    return (
      <CardMedia
        component="img"
        height={height}
        image={item.fileUrl}
        alt={item.title}
        sx={{ 
          // 'contain' ensures the whole image is visible without cropping!
          objectFit: 'contain', 
          maxHeight: maxHeight,
          // Adds a subtle dark background in the grid if the image doesn't perfectly fit the 250px box
          backgroundColor: isModal ? 'transparent' : '#1a1a1a', 
          p: isModal ? 0 : 1 // Adds a tiny bit of padding in the grid view
        }}
      />
    );
  };


  return (
    <div>
      <Box sx={{ mb: 8, mt: 4 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar 
              alt="Roman" 
              src="/romanphoto.png" 
              sx={{ width: 250, height: 250, boxShadow: 3 }} 
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Hi, I'm Roman Bratchykov
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              I am a 2nd-year Computer Science student at Chernivtsi National University. 
              I specialize in full-stack development and have a deep interest in music production and design.
            </Typography>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Experience:
            </Typography>
            Have no commercial experience yet, but worked on different websites projects by myself. Ready to learn and find new opportunities in this field.
            <Typography variant="h6" color="text.secondary" paragraph>
              
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>My Tech Stack:</Typography>
              <Chip label="HTML/CSS/JS" color="primary" sx={{ mr: 1, mb: 1 }} />
              <Chip label="React" color="primary" sx={{ mr: 1, mb: 1 }} />
              <Chip label="Node.js" color="primary" sx={{ mr: 1, mb: 1 }} />
              <Chip label="Adobe Cloud (Photoshop, Illustrator, Premiere Pro, After Effects)" color="primary" sx={{ mr: 1, mb: 1 }} />
              <Chip label="Kotlin" color="primary" sx={{ mr: 1, mb: 1 }} />
              <Chip label="Affinity" color="primary" sx={{ mr: 1, mb: 1 }} />
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
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Languages:</Typography>
              <Chip label="English:B2" color="primary" sx={{ mr: 1, mb: 1 }} />
              <Chip label="Ukrainian:Fluent" color="primary" sx={{ mr: 1, mb: 1 }} />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button variant="outlined" startIcon={<GitHubIcon />} href="https://github.com/RomanBratchykov" target="_blank">
                GitHub
              </Button>
              <Button variant="outlined" startIcon={<LinkedInIcon />} href="https://www.linkedin.com/in/roman-bratchykov-9112b5330" target="_blank">
                LinkedIn
              </Button>
              <Button variant="outlined" startIcon={<Link />} href="https://www.behance.net/romanbratchykov" target="_blank">
                Behance
              </Button>
              <Button variant="outlined" startIcon={<Link />} href="https://cat-game-iota.vercel.app/" target="_blank">
                Pawland
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ mb: 6 }} />


      <Typography id="my-work-section" variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4, pt: 2 }}>
        Featured Work
      </Typography>

      {/* 🚨 NEW: Conditional rendering just for the grid area! 🚨 */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 4 }}>
          Could not load portfolio: {error}
        </Alert>
      ) : items.length === 0 ? (
        <Typography color="text.secondary">No items uploaded yet.</Typography>
      ) : (
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
      )}

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
              <Box sx={{ width: '100%', backgroundColor: '#5f0f0f' }}>
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