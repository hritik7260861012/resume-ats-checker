import React from 'react';
import './Results.css';

const Results = ({ score, matchedKeywords, missingKeywords }) => {
  // Determine score color and message
  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return 'Excellent! Your resume is well-matched.';
    if (score >= 60) return 'Good match. Consider adding more keywords.';
    if (score >= 40) return 'Fair match. Significant improvements needed.';
    return 'Poor match. Major revisions recommended.';
  };

  const scoreColor = getScoreColor(score);

  return (
    <div className="results-container">
      <h2 className="results-title">ATS Analysis Results</h2>
      
      {/* Score Section */}
      <div className="score-section">
        <div className="score-circle" style={{ borderColor: scoreColor }}>
          <span className="score-value" style={{ color: scoreColor }}>
            {score}
          </span>
          <span className="score-max">/100</span>
        </div>
        <p className="score-message" style={{ color: scoreColor }}>
          {getScoreMessage(score)}
        </p>
      </div>

      {/* Keywords Section */}
      <div className="keywords-section">
        {/* Matched Keywords */}
        <div className="keywords-column">
          <h3 className="keywords-title matched">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="check-icon">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Matched Keywords ({matchedKeywords.length})
          </h3>
          <div className="keywords-list">
            {matchedKeywords.length > 0 ? (
              matchedKeywords.map((keyword, index) => (
                <span key={index} className="keyword-tag matched">
                  {keyword}
                </span>
              ))
            ) : (
              <p className="no-keywords">No keywords matched</p>
            )}
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="keywords-column">
          <h3 className="keywords-title missing">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="alert-icon">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Missing Keywords ({missingKeywords.length})
          </h3>
          <div className="keywords-list">
            {missingKeywords.length > 0 ? (
              missingKeywords.map((keyword, index) => (
                <span key={index} className="keyword-tag missing">
                  {keyword}
                </span>
              ))
            ) : (
              <p className="no-keywords">All keywords matched!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;