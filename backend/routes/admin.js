const express = require('express');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All routes below require a valid admin session.
router.use(requireAdmin);

// Test endpoint — confirms the token is valid and auth wiring works.
// Product / portfolio / customer / sales routes are added in later steps.
router.get('/me', (req, res) => {
  res.json({
    success: true,
    user: { id: req.user.id, email: req.user.email },
  });
});

module.exports = router;
