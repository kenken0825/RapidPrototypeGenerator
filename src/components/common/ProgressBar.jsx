import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ currentPhase, totalPhases, phases }) => {
  const progress = (currentPhase / totalPhases) * 100;

  return (
    <div className="progress-container">
      <div className="progress-bar" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="progress-steps">
        {phases.map((phase, index) => (
          <div 
            key={index} 
            className={`progress-step ${index + 1 <= currentPhase ? 'active' : ''} ${index + 1 === currentPhase ? 'current' : ''}`}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-label">{phase}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;