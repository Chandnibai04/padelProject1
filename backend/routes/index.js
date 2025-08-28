const express = require('express');
const router = express.Router();
const paymentRouter = require('./payment');

// API routes
router.use('/api', paymentRouter);

// Health check
router.get('/', (req, res) => {
  res.json({
    status: "PADELPROJECT API is running",
    routes: {
      payment: "/api/jazzcash",
      test: "/api/jazzcash/test"
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;