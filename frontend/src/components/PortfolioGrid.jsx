import { useEffect, useState } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Chip, Box, CircularProgress, Alert } from '@mui/material';

export default function PortfolioGrid() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Helper function to decide which HTML element to use based on category
  const renderMedia = (item) => {
    // 1. If Video, render the HTML5 video player
    if (item.category === 'video') {
      return (
        <CardMedia
          component="video"
          height="250"
          src={item.fileUrl}
          controls // This adds play/pause/volume buttons automatically
          sx={{ objectFit: 'cover', backgroundColor: '#000' }}
        />
      );
    }
    
    // 2. If Music, render an audio player inside a dark box
    if (item.category === 'music') {
      return (
        <Box sx={{ 
          height: '250px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          backgroundColor: '#2a2a2a',
          p: 2
        }}>
          <audio controls src={item.fileUrl} style={{ width: '100%' }}>
            Your browser does not support the audio element.
          </audio>
        </Box>
      );
    }

    // 3. Default fallback (Design/Images)
    return (
      <CardMedia
        component="img"
        height="250"
        image={item.fileUrl}
        alt={item.title}
        sx={{ objectFit: 'cover' }}
      />
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        Could not load portfolio: {error}
      </Alert>
    );
  }

  return (
    <div>
      <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Featured Work
      </Typography>

      {items.length === 0 && (
        <Typography color="text.secondary">No items uploaded yet.</Typography>
      )}

      <Grid container spacing={4}>
        {items.map(item => (
          <Grid item key={item.id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
              
              {/* Here is where the magic happens! */}
              {renderMedia(item)}
              
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {item.title}
                </Typography>
                <Chip 
                  label={item.category.toUpperCase()} 
                  color={item.category === 'music' ? 'secondary' : 'primary'} 
                  size="small" 
                  variant="outlined" 
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}