require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const routes = require('./backend/routes');
const PORT = process.env.PORT || 3001;
const cookieParser = require('cookie-parser');
const fs = require('fs');
const https = require('https');
const path = require('path');

const { mongouri } = process.env;

const initializeDatabase = async () => {
  try {
    const client = new MongoClient(mongouri);
    await client.connect();
    return { client, masterDb: client.db("customers") };
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
};

const app = express();
if(process.env.NODE_ENV === "development"){
  const corsOptions = {
    origin: 'https://localhost:9000',
    credentials: true,
  };
  app.use(cors(corsOptions));
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

const httpsOptions = process.env.NODE_ENV === "development" ? {
  key: fs.readFileSync('./ssl-dev/localhost.key'),
  cert: fs.readFileSync('./ssl-dev/localhost.crt')
} : {
  key: fs.readFileSync('/root/PowerWatch/ssl/private.key'),
  cert: fs.readFileSync('/root/PowerWatch/ssl/certificate.crt'),
  ca: fs.readFileSync('/root/PowerWatch/ssl/intermediate-certificate.crt')
};

let server;

initializeDatabase().then(({ client, masterDb }) => {

  app.use('/api', routes({ client, masterDb }));
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/public', 'index.html'));
  });
  const listenPort = process.env.NODE_ENV === "production" ? 443 : PORT;
  server = https.createServer(httpsOptions, app).listen(listenPort, '0.0.0.0', () => {
    console.log(`Backend running on https://localhost:${listenPort}`);
  });
});

module.exports = server;
