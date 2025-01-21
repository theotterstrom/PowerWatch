let apiUrl;
if (process.env.NODE_ENV === 'development') {
  apiUrl = 'https://localhost:3001'; // Local development API endpoint
} else {
  apiUrl = 'https://energywatchmortvik.se/api'; // Live API endpoint
};
const devUrl = 'https://localhost:3001';
const liveUrl = 'http://194.180.176.212:9000'
module.exports = apiUrl;
