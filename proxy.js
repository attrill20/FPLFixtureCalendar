const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(
  '/api',
  createProxyMiddleware({
    target: 'https://fantasy.premierleague.com',
    changeOrigin: true,
    pathRewrite: {
      '^/api': '/',
    },
  })
);

const port = 3001; // Choose any available port number

app.listen(port, () => {
  console.log(`Proxy server is running on http://localhost:${port}`);
});
