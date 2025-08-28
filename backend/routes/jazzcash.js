const express = require('express');
const router = express.Router();

/**
 * Mock JazzCash Payment Initiation
 * @route POST /jazzcash/initiate
 */
router.post('/initiate', (req, res) => {
  console.log('[MOCK] JazzCash Payment Initiated:', {
    amount: req.body.amount,
    bookingId: req.body.bookingId,
    phone: req.body.phoneNumber,
    date: new Date().toISOString()
  });

  // Simulate API processing delay
  setTimeout(() => {
    res.status(200).json({
      success: true,
      message: "TEST MODE: JazzCash payment simulation",
      mock: true,
      data: {
        transactionRef: `JCMOCK${Date.now()}`,
        amount: req.body.amount,
        currency: "PKR",
        paymentUrl: "/mock-jazzcash-payment" // Frontend will handle this
      }
    });
  }, 800);
});

/**
 * Mock JazzCash Payment Callback
 * @route POST /jazzcash/callback
 */
router.post('/callback', (req, res) => {
  console.log('[MOCK] JazzCash Callback Received:', req.body);
  
  // Always return success in mock mode
  res.status(200).json({
    success: true,
    pp_ResponseCode: '000',
    pp_ResponseMessage: 'Mock payment successful',
    pp_TxnRefNo: req.body.pp_TxnRefNo || `JCMOCK${Date.now()}`,
    pp_Amount: req.body.pp_Amount || '120000', // in paisa
    pp_BillReference: req.body.pp_BillReference || 'BK' + Math.floor(Math.random() * 1000000),
    mock: true
  });
});

/**
 * Test Endpoint
 * @route GET /jazzcash/test
 */
router.get('/test', (req, res) => {
  res.json({
    status: "JazzCash Mock API is working",
    endpoints: {
      initiate: "POST /jazzcash/initiate",
      callback: "POST /jazzcash/callback"
    },
    mock: true
  });
});

module.exports = router;