import { useEffect, useState } from 'react';

export default function PortfolioGrid() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Fetch content from backend when component loads
    fetch('http://localhost:5000/api/content')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="portfolio-gallery">
      <h2>My Work</h2>
      <div className="grid">
        {items.map(item => (
          <div key={item.id} className="card">
            <h3>{item.title}</h3>
            <p>Category: {item.category}</p>
            {/* If it's an image, show it. If audio/video, you'd use <audio> or <video> tags */}
            <img src={item.fileUrl} alt={item.title} style={{ width: '100%', maxWidth: '300px' }} />
          </div>
        ))}
      </div>
    </div>
  );
}