const extractText = require('../utils/extractText');
const calculateScore = require('../utils/calculateScore');

/**
 * Controller to handle resume checking
 * POST /api/check
 */
const checkResume = async (req, res) => {
  try {
    // Check if file is provided
    if (!req.file) {
      return res.status(400).json({
        error: 'No resume file uploaded',
        message: 'Please upload a resume file (PDF or DOCX)'
      });
    }

    // Check if job description is provided
    const { jobDescription } = req.body;
    if (!jobDescription || jobDescription.trim() === '') {
      // Clean up the uploaded file
      if (req.file.path) {
        const fs = require('fs');
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }
      return res.status(400).json({
        error: 'No job description provided',
        message: 'Please provide a job description'
      });
    }

    // Extract text from the resume
    const resumeText = await extractText(req.file);

    if (!resumeText || resumeText.trim() === '') {
      return res.status(400).json({
        error: 'Could not extract text from resume',
        message: 'The uploaded file appears to be empty or unreadable'
      });
    }

    // Calculate ATS score
    const result = calculateScore(resumeText, jobDescription);

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error in checkResume:', error);
    
    // Clean up file if it exists
    if (req.file && req.file.path) {
      const fs = require('fs');
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    }

    // Handle specific error types
    if (error.message.includes('Unsupported file format')) {
      return res.status(400).json({
        error: 'Unsupported file format',
        message: error.message
      });
    }

    if (error.message.includes('Failed to extract text')) {
      return res.status(400).json({
        error: 'File processing error',
        message: error.message
      });
    }

    return res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while processing your request'
    });
  }
};

module.exports = {
  checkResume
};