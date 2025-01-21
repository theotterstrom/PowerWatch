require('dotenv').config();
const path = require('path');
const fs = require('fs');

const [keyPath, certPath] = process.env.NODE_ENV === "production" ? 
['../ssl/private.key', '../ssl/certificate.crt'] : ['../ssl-dev/localhost.key', '../ssl-dev/localhost.crt'];

module.exports = {
  entry: './src/index.js', // Entry file for your app
  output: {
    path: path.resolve(__dirname, 'build'), // Change output directory to 'build'
    filename: 'bundle.js', // Name of the output bundle
    publicPath: '/', // Public URL of the output directory when referenced in the browser
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // To process .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/, // To process .css files
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'), // Serve static files from 'public'
    },
    server: {
      type: 'https',
      options: {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      }
    },
    compress: true,
    port: 9000,
    historyApiFallback: true, // Support client-side routing (React Router)
    open: true, // Automatically open the browser
  },
};
