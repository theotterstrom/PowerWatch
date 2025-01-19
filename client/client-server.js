const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8082;

// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, 'build')));

// Fallback to serve 'index.html' for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
