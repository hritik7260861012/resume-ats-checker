import React from 'react';
import './JobDescription.css';

const JobDescription = ({ value, onChange, error }) => {
  return (
    <div className="job-description-container">
      <label className="job-description-label" htmlFor="job-description">
        Job Description
      </label>
      <textarea
        id="job-description"
        className="job-description-textarea"
        placeholder="Paste the job description here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
      />
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default JobDescription;