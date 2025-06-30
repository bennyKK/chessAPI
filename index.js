const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

let latestToken = null;

// OAuth callback route
app.get('/callback', (req, res) => {
  const token = req.query.access_token || req.query.code;

  if (!token) {
    return res.status(400).send('No token or code received.');
  }

  latestToken = token;
  console.log('✅ Token received:', token);

  res.send('✅ Token received. You can now connect your ESP32.');
});

// ESP32 fetches the token here
app.get('/token', (req, res) => {
  if (!latestToken) {
    return res.status(404).send('No token available yet.');
  }

  res.json({ access_token: latestToken });
});

// Optional: clear token after ESP32 fetches it
app.delete('/token', (req, res) => {
  latestToken = null;
  res.send('Token cleared.');
});

app.listen(PORT, () => {
  console.log(`OAuth server running on http://localhost:${PORT}`);
});