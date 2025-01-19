let apiUrl;
if (process.env.NODE_ENV === 'development') {
  apiUrl = 'https://localhost:3001'; // Local development API endpoint
} else {
  apiUrl = 'https://localhost:3001'; // Live API endpoint
};
module.exports = apiUrl;
