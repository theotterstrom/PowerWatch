let apiUrl;
if (process.env.NODE_ENV === 'development') {
  apiUrl = 'https://localhost:3002';
} else {
  apiUrl = 'https://powerwatch.se/api';
};
module.exports = apiUrl;
