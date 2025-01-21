require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const app = express();
const PORT = process.env.PORT || 8082;

const httpsOptions = {
  key: fs.readFileSync('/root/PowerWatch/ssl/private.key'),
  cert: fs.readFileSync('/root/PowerWatch/ssl/certificate.crt'),
  ca: fs.readFileSync('/root/PowerWatch/ssl/intermediate-certificate.crt')
};

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (process.env.NODE_ENV === "production") {
  https.createServer(httpsOptions, app).listen(443, '0.0.0.0', () => {
    console.log(`React app running on https://energywatchmortvik.se`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
