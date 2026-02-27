import { useState } from 'react';

export default function AdminUpload() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('design');
  const [file, setFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    
    // FormData is required when sending files
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('mediaFile', file);

    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <div className="upload-form">
      <h2>Upload New Content</h2>
      <form onSubmit={handleUpload}>
        <input 
          type="text" 
          placeholder="Project Title" 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
        <select onChange={(e) => setCategory(e.target.value)}>
          <option value="design">Design</option>
          <option value="music">Music</option>
          <option value="video">Video</option>
        </select>
        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files[0])} 
          required 
        />
        <button type="submit">Upload to Portfolio</button>
      </form>
    </div>
  );
}