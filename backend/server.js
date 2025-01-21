require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const routes = require('./routes');
const PORT = process.env.PORT || 3001;
const cookieParser = require('cookie-parser');
const fs = require('fs');
const https = require('https');
const { mongouri, dbname, shellytoken, shellyurl } = process.env;
let db;
// Initialize MongoDB connection once
const initializeDatabase = async () => {
  try {
    const client = new MongoClient(mongouri);
    await client.connect();
    db = client.db(dbname); // Assign the database instance
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1); // Exit if database connection fails
  }
};
const corsOptions = {
  origin: 'https://localhost:9000',
  credentials: true,
};
const app = express();
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
initializeDatabase().then(() => {
  app.use(routes(db));
  const listenPort = process.env.NODE_ENV === "production" ? 443 : PORT;
  server = https.createServer(httpsOptions, app).listen(listenPort, '0.0.0.0', () => {
    console.log(`Backend running on https://localhost:${listenPort}`);
  });
});
module.exports = server;