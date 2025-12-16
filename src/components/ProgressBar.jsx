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
    { id: 5, label: 'Review' }
  ];

  return (
    <div className="progress-bar-container">
      <div className="progress-bar">
        {steps.map((step, index) => (
          <div key={step.id} className="progress-step-wrapper">
            <div className={`progress-step ${currentStep >= step.id ? 'active' : ''} ${currentStep === step.id ? 'current' : ''}`}>
              <div className="step-number">{step.id + 1}</div>
              <div className="step-label">{step.label}</div>
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