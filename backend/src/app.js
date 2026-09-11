const express = require('express');
const cors = require('cors');
const itemsRouter = require('./routes/items');

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Health check - used by k8s liveness/readiness probes
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
  });

  app.use('/api/items', itemsRouter);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  // Central error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

module.exports = createApp;
