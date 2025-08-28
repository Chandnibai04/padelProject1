const express = require('express');
const router = express.Router();
const jazzcashRouter = require('./jazzcash');

// Payment routes
router.use('/jazzcash', jazzcashRouter);

/**
 * Process other payment methods
 * @route POST /payment/process
 */
router.post('/process', (req, res) => {
  const { paymentMethod, amount, bookingId } = req.body;
  
  console.log(`Processing ${paymentMethod} payment for booking ${bookingId}`);
  
  // Mock processing for other payment methods
  setTimeout(() => {
    res.json({
      success: true,
      paymentMethod,
      amount,
      bookingId,
      transactionId: `MOCK-${paymentMethod.toUpperCase()}-${Date.now()}`,
      mock: true
    });
  }, 500);
});

module.exports = router;