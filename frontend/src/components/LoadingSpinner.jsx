import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Analyzing your resume...' }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-message">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;