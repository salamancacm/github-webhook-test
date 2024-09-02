const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();

// Secret for verifying GitHub signatures (set this in GitHub webhook settings)
const secret = 'your-webhook-secret';

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Middleware to verify the GitHub signature
app.use((req, res, next) => {
  const signature = req.headers['x-hub-signature-256'];
  const hash = `sha256=${crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex')}`;

  if (signature !== hash) {
    return res.status(401).send('Invalid signature');
  }
  next();
});

// Route to handle the webhook
app.post('/webhook', (req, res) => {
  console.log('Webhook received!');
  console.log(req.body); // Log the payload for debugging


  res.status(200).send('Webhook received and processed');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
