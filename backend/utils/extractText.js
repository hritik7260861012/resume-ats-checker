const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

/**
 * Extract text from a resume file (PDF or DOCX)
 * @param {Object} file - The uploaded file object from multer
 * @returns {Promise<string>} - The extracted text content
 */
const extractText = async (file) => {
  if (!file) {
    throw new Error('No file provided');
  }

  const filePath = file.path || file.tempFilePath;
  const fileExtension = path.extname(file.originalname).toLowerCase();

  try {
    let text = '';

    if (fileExtension === '.pdf') {
      text = await extractTextFromPDF(filePath);
    } else if (fileExtension === '.docx') {
      text = await extractTextFromDOCX(filePath);
    } else {
      throw new Error(`Unsupported file format: ${fileExtension}. Only PDF and DOCX are supported.`);
    }

    // Clean up the uploaded file after extraction
    fs.unlinkSync(filePath);

    return text;
  } catch (error) {
    // Ensure file is cleaned up even on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
};

/**
 * Extract text from a PDF file
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<string>} - The extracted text content
 */
const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};

/**
 * Extract text from a DOCX file
 * @param {string} filePath - Path to the DOCX file
 * @returns {Promise<string>} - The extracted text content
 */
const extractTextFromDOCX = async (filePath) => {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    throw new Error(`Failed to extract text from DOCX: ${error.message}`);
  }
};

module.exports = extractText;