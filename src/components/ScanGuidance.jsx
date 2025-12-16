import React from 'react';
import './ScanGuidance.css';

const ScanGuidance = ({ onCancel }) => {
  return (
    <div className="scan-guidance-overlay">
      <div className="scan-guidance-modal">
        <div className="scan-animation">
          <div className="scanner-frame">
            <div className="scanner-line"></div>
          </div>
          <div className="document-graphic">
            <div className="document-shape"></div>
            <div className="document-details">
              <div className="document-line"></div>
              <div className="document-line short"></div>
              <div className="document-line"></div>
              <div className="document-photo"></div>
            </div>
          </div>
        </div>
        
        <h3>Position Your Driver's License</h3>
        <ul className="instructions">
          <li>Hold your license flat and steady</li>
          <li>Ensure all corners are visible</li>
          <li>Keep the license well-lit</li>
          <li>Avoid glare or shadows</li>
        </ul>
        
        <div className="scan-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <p>Preparing scanner...</p>
        </div>
        
        <button className="btn-secondary" onClick={onCancel}>
          Cancel Scan
        </button>
      </div>
    </div>
  );
};

export default ScanGuidance;