# ATS Resume Checker

A full-stack MERN application that analyzes resumes against job descriptions to generate an ATS (Applicant Tracking System) compatibility score.

## Features

- **Resume Upload**: Upload resumes in PDF or DOCX format
- **Job Description Input**: Paste job descriptions for analysis
- **ATS Scoring**: Get a score from 0-100 based on keyword matching
- **Keyword Analysis**: See matched and missing keywords
- **Clean UI**: Modern, responsive interface

## Tech Stack

### Backend
- Node.js
- Express.js
- Multer (file upload)
- pdf-parse (PDF text extraction)
- mammoth (DOCX text extraction)

### Frontend
- React (Vite)
- Axios (HTTP client)
- CSS3 (responsive design)

## Project Structure

```
resume-checker/
├── backend/
│   ├── server.js           # Express server entry point
│   ├── .env                # Environment variables
│   ├── package.json
│   ├── controllers/
│   │   └── checkController.js   # Resume check logic
│   ├── routes/
│   │   └── checkRoute.js        # API routes
│   ├── middleware/
│   │   └── uploadMiddleware.js  # Multer configuration
│   └── utils/
│       ├── extractText.js       # PDF/DOCX text extraction
│       └── calculateScore.js    # ATS scoring algorithm
│
└── frontend/
    ├── src/
    │   ├── App.jsx              # Main application component
    │   ├── App.css
    │   ├── index.css
    │   ├── main.jsx
    │   └── components/
    │       ├── FileUpload.jsx    # File upload component
    │       ├── FileUpload.css
    │       ├── JobDescription.jsx # Job description input
    │       ├── JobDescription.css
    │       ├── Results.jsx        # Results display
    │       ├── Results.css
    │       ├── LoadingSpinner.jsx # Loading indicator
    │       └── LoadingSpinner.css
    ├── .env
    ├── package.json
    └── vite.config.js
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd resume-checker
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```
The backend will run on `http://localhost:5000`

2. In a new terminal, start the frontend:
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`

3. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### POST /api/check

Analyzes a resume against a job description.

**Request:**
- Content-Type: multipart/form-data
- Fields:
  - `resume`: PDF or DOCX file (max 10MB)
  - `jobDescription`: Text of the job description

**Response:**
```json
{
  "success": true,
  "data": {
    "score": 75,
    "matchedKeywords": ["javascript", "react", "node.js"],
    "missingKeywords": ["typescript", "aws", "docker"]
  }
}
```

## How It Works

1. **File Upload**: User uploads a resume (PDF or DOCX)
2. **Text Extraction**: The backend extracts text from the uploaded file
3. **Keyword Extraction**: Keywords are extracted from the job description
4. **Matching**: The resume text is compared against the extracted keywords
5. **Scoring**: A score is calculated based on the percentage of matched keywords
6. **Results**: The frontend displays the score and keyword analysis

## Scoring Algorithm

The ATS score is calculated by:
1. Extracting important keywords from the job description
2. Checking which keywords appear in the resume
3. Calculating: `(matchedKeywords / totalKeywords) * 100`

The algorithm recognizes:
- Technical terms (programming languages, frameworks, tools)
- Soft skills (communication, leadership, teamwork)
- Industry-specific terminology
- Multi-word phrases

## Error Handling

The application handles various error cases:
- Invalid file formats (only PDF and DOCX accepted)
- File size limits (max 10MB)
- Missing job description
- Empty or unreadable resume files
- Server connection errors

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT License