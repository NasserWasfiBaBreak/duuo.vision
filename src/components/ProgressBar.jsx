import { useFormContext } from '../context/FormContext';
import './ProgressBar.css';

const ProgressBar = () => {
  const { currentStep } = useFormContext();
  
  const steps = [
    { id: 0, label: 'Welcome', description: 'Start your quote' },
    { id: 1, label: 'Driver Info', description: 'Personal & license details' },
    { id: 2, label: 'Vehicle Info', description: 'Car details & VIN' },
    { id: 3, label: 'Personal Details', description: 'Contact & preferences' },
    { id: 4, label: 'Coverage', description: 'Select protections' },
    { id: 5, label: 'Review', description: 'Check & confirm' }
  ];

  return (
    <div className="progress-bar-container">
      <div className="progress-bar">
        {steps.map((step, index) => (
          <div key={step.id} className="progress-step-wrapper">
            <div className={`progress-step ${currentStep >= step.id ? 'active' : ''} ${currentStep === step.id ? 'current' : ''}`}>
              <div className="step-number">{step.id + 1}</div>
              <div className="step-label">{step.label}</div>
              <div className="step-description">{step.description}</div>
              {/* Time display removed */}
            </div>
            {index < steps.length - 1 && (
              <div className={`progress-line ${currentStep > step.id ? 'active' : ''}`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;