import React from 'react';
import { useFormContext } from '../context/FormContext';
import './ProgressBar.css';

const ProgressBar = () => {
  const { currentStep } = useFormContext();
  
  const steps = [
    { id: 0, label: 'Welcome' },
    { id: 1, label: 'Driver Info' },
    { id: 2, label: 'Vehicle Info' },
    { id: 3, label: 'Personal Details' },
    { id: 4, label: 'Coverage' },
    { id: 5, label: 'Review' },
    { id: 6, label: 'Payment' }
  ];
  
  return (
    <div className="progress-bar-container">
      <div className="progress-steps">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className={`progress-step ${currentStep >= step.id ? 'active' : ''} ${currentStep === step.id ? 'current' : ''}`}>
              <div className="step-number">{step.id + 1}</div>
              <div className="step-label">{step.label}</div>
            </div>
            {index < steps.length - 1 && (
              <div className={`progress-line ${currentStep > step.id ? 'active' : ''}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;