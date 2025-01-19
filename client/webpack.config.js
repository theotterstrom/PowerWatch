const path = require('path');
const fs = require('fs');

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
        key: fs.readFileSync('./ssl/localhost.key'),
        cert: fs.readFileSync('./ssl/localhost.crt'),
      }
    },
    compress: true,
    port: 9000,
    historyApiFallback: true, // Support client-side routing (React Router)
    open: true, // Automatically open the browser
  },
};
