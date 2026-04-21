import React from 'react';
import './StepProgress.css';

const steps = [
  'Building Selection',
  'Room Selection',
  'Confirmation'
];

export default function StepProgress({ currentStepIndex, onStepClick, isConfirmed = false }) {
  return (
    <div className="step-progress-container">
      {steps.map((step, index) => (
        <div 
          key={step} 
          className={`step-item ${index === currentStepIndex ? 'active' : ''} ${index < currentStepIndex ? 'completed' : ''}`}
          onClick={!isConfirmed ? () => onStepClick(index) : undefined}
          style={{ cursor: isConfirmed ? 'default' : 'pointer' }}
        >
          <div className="step-number">{index + 1}</div>
          <div className="step-label">{step}</div>
          {index < steps.length - 1 && <div className="step-connector"></div>}
        </div>
      ))}
    </div>
  );
}