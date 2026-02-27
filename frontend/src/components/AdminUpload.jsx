import { useState } from 'react';
import { Paper, Typography, TextField, MenuItem, Button, Box, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function AdminUpload() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('design');
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    setStatus({ type: 'info', msg: 'Uploading...' });
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('mediaFile', file);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: { 'x-admin-password': password },
        body: formData,
      });
      const data = await response.json();
      
      if (response.ok) {
        setStatus({ type: 'success', msg: data.message });
      } else {
        setStatus({ type: 'error', msg: data.error });
      }
    } catch (error) {
      setStatus({ type: 'error', msg: 'Upload failed' });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Admin Dashboard
      </Typography>
      
      {status && <Alert severity={status.type} sx={{ mb: 3 }}>{status.msg}</Alert>}

      <Box component="form" onSubmit={handleUpload} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        
        <TextField 
          label="Admin Password" 
          type="password" 
          variant="outlined" 
          fullWidth 
          required 
          onChange={(e) => setPassword(e.target.value)} 
        />
        
        <TextField 
          label="Project Title" 
          variant="outlined" 
          fullWidth 
          required 
          onChange={(e) => setTitle(e.target.value)} 
        />
        
        <TextField
          select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          fullWidth
        >
          <MenuItem value="design">Design</MenuItem>
          <MenuItem value="music">Music</MenuItem>
          <MenuItem value="video">Video</MenuItem>
        </TextField>

        <Button
          variant="outlined"
          component="label"
          startIcon={<CloudUploadIcon />}
          sx={{ py: 1.5 }}
        >
          {file ? file.name : "Select Media File"}
          <input type="file" hidden required onChange={(e) => setFile(e.target.files[0])} />
        </Button>
        
        <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
          Upload to Portfolio
        </Button>
      </Box>
    </Paper>
  );
}