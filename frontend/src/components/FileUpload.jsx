import React, { useState, useRef } from 'react';
import './FileUpload.css';

const FileUpload = ({ onFileSelect, error }) => {
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const validExtensions = ['.pdf', '.docx', '.doc'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
        onFileSelect(null, 'Please upload a PDF or DOCX file');
        setFileName('');
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        onFileSelect(null, 'File size should not exceed 10MB');
        setFileName('');
        return;
      }

      setFileName(file.name);
      onFileSelect(file, null);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleRemove = () => {
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileSelect(null, null);
  };

  return (
    <div className="file-upload-container">
      <label className="file-upload-label">
        Upload Resume (PDF or DOCX)
      </label>
      
      <div className="file-upload-area">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.docx,.doc"
          className="file-input"
        />
        
        {!fileName ? (
          <div className="upload-placeholder" onClick={handleClick}>
            <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p>Click to upload or drag and drop</p>
            <span className="file-types">PDF or DOCX (max 10MB)</span>
          </div>
        ) : (
          <div className="file-selected">
            <svg className="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span className="file-name">{fileName}</span>
            <button className="remove-file" onClick={handleRemove} type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default FileUpload;