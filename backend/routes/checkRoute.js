const express = require('express');
const router = express.Router();
const { checkResume } = require('../controllers/checkController');
const { upload, handleMulterError } = require('../middleware/uploadMiddleware');

/**
 * @route   POST /api/check
 * @desc    Check resume against job description
 * @access  Public
 */
router.post('/check', 
  upload.single('resume'), 
  handleMulterError, 
  checkResume
);

module.exports = router;