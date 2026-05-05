import React, { useState } from 'react';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import JobDescription from './components/JobDescription';
import Results from './components/Results';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [jobDescriptionError, setJobDescriptionError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const handleFileSelect = (selectedFile, error) => {
    setFile(selectedFile);
    setFileError(error);
    if (error) {
      setError(error);
    }
  };

  const handleJobDescriptionChange = (value) => {
    setJobDescription(value);
    if (jobDescriptionError && value.trim()) {
      setJobDescriptionError(null);
    }
  };

  const validateForm = () => {
    let isValid = true;
    setError(null);

    if (!file) {
      setFileError('Please upload a resume file');
      isValid = false;
    }

    if (!jobDescription.trim()) {
      setJobDescriptionError('Please provide a job description');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobDescription', jobDescription);

      const response = await axios.post(`${API_URL}/check`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setResults(response.data.data);
      } else {
        setError(response.data.message || 'An error occurred');
      }
    } catch (err) {
      console.error('Error:', err);
      if (err.response) {
        setError(err.response.data.message || err.response.data.error || 'An error occurred');
      } else if (err.request) {
        setError('Unable to connect to the server. Please make sure the backend is running.');
      } else {
        setError('An error occurred while processing your request');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setFileError(null);
    setJobDescription('');
    setJobDescriptionError(null);
    setResults(null);
    setError(null);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <h1 className="logo-text">ATS Resume Checker</h1>
        </div>
        <p className="subtitle">Optimize your resume for Applicant Tracking Systems</p>
      </header>

      <main className="main">
        <div className="container">
          <form onSubmit={handleSubmit} className="form">
            <div className="form-grid">
              <FileUpload onFileSelect={handleFileSelect} error={fileError} />
              <JobDescription
                value={jobDescription}
                onChange={handleJobDescriptionChange}
                error={jobDescriptionError}
              />
            </div>

            {error && (
              <div className="error-banner">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="button-group">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="btn-spinner"></span>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Check Resume
                  </>
                )}
              </button>
              {results && (
                <button type="button" className="reset-btn" onClick={handleReset}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                  New Check
                </button>
              )}
            </div>
          </form>

          {results && (
            <Results
              score={results.score}
              matchedKeywords={results.matchedKeywords}
              missingKeywords={results.missingKeywords}
            />
          )}
        </div>
      </main>

      {loading && <LoadingSpinner message="Analyzing your resume..." />}
    </div>
  );
}

export default App;
