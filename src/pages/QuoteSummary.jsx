import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import './QuoteSummary.css';

const QuoteSummary = () => {
  const { formData, clearSavedData } = useFormContext();
  const navigate = useNavigate();

  // Calculate estimated premium based on form data
  const calculatePremium = () => {
    let baseRate = 1200;
    
    // Adjust based on driver age (simplified)
    const birthYear = new Date(formData.dateOfBirth).getFullYear();
    const age = new Date().getFullYear() - birthYear;
    
    if (age < 25) baseRate *= 1.5;
    if (age > 65) baseRate *= 1.2;
    
    // Adjust based on vehicle year
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - parseInt(formData.year || currentYear);
    
    if (vehicleAge < 2) baseRate *= 1.3;
    if (vehicleAge > 10) baseRate *= 0.8;
    
    // Adjust based on coverage selections
    if (formData.collision) baseRate += 300;
    if (formData.comprehensive) baseRate += 200;
    if (formData.accidentForgiveness) baseRate += 100;
    
    return Math.round(baseRate);
  };

  const estimatedPremium = calculatePremium();

  const handlePurchase = () => {
    // Clear saved data after purchase
    clearSavedData();
    navigate('/payment');
  };

  const handleSaveQuote = () => {
    // In a real application, this would save the quote to a database
    // For now, we'll just show a success message
    alert('Your quote has been saved successfully! You can return to it later.');
  };

  return (
    <div className="quote-summary-page">
      <div className="quote-summary-container">
        <div className="quote-header">
          <h1>Your Insurance Quote</h1>
          <p>Review your information and coverage selections</p>
        </div>
        
        <div className="quote-content">
          <div className="quote-details">
            <div className="summary-section">
              <h2>Driver Information</h2>
              <div className="summary-item">
                <span className="label">Name:</span>
                <span className="value">{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="summary-item">
                <span className="label">Date of Birth:</span>
                <span className="value">{formData.dateOfBirth || 'Not provided'}</span>
              </div>
              <div className="summary-item">
                <span className="label">Gender:</span>
                <span className="value">{formData.gender || 'Not provided'}</span>
              </div>
              <div className="summary-item">
                <span className="label">Marital Status:</span>
                <span className="value">{formData.maritalStatus || 'Not provided'}</span>
              </div>
              <div className="summary-item">
                <span className="label">License Number:</span>
                <span className="value">{formData.licenseNumber || 'Not provided'}</span>
              </div>
            </div>
            
            <div className="summary-section">
              <h2>Vehicle Information</h2>
              <div className="summary-item">
                <span className="label">Year:</span>
                <span className="value">{formData.year || 'Not provided'}</span>
              </div>
              <div className="summary-item">
                <span className="label">Make:</span>
                <span className="value">{formData.make || 'Not provided'}</span>
              </div>
              <div className="summary-item">
                <span className="label">Model:</span>
                <span className="value">{formData.model || 'Not provided'}</span>
              </div>
              <div className="summary-item">
                <span className="label">VIN:</span>
                <span className="value">{formData.vin || 'Not provided'}</span>
              </div>
              <div className="summary-item">
                <span className="label">Usage:</span>
                <span className="value">{formData.usage || 'Not provided'}</span>
              </div>
            </div>
            
            <div className="summary-section">
              <h2>Coverage Selection</h2>
              <div className="summary-item">
                <span className="label">Liability:</span>
                <span className="value">${parseInt(formData.liability || '1000000').toLocaleString()}</span>
              </div>
              <div className="summary-item">
                <span className="label">Collision:</span>
                <span className="value">{formData.collision ? 'Included' : 'Not included'}</span>
              </div>
              <div className="summary-item">
                <span className="label">Comprehensive:</span>
                <span className="value">{formData.comprehensive ? 'Included' : 'Not included'}</span>
              </div>
              <div className="summary-item">
                <span className="label">Accident Forgiveness:</span>
                <span className="value">{formData.accidentForgiveness ? 'Included' : 'Not included'}</span>
              </div>
            </div>
          </div>
          
          <div className="quote-sidebar">
            <div className="premium-box">
              <h3>Estimated Annual Premium</h3>
              <div className="premium-amount">${estimatedPremium.toLocaleString()}</div>
              <div className="premium-disclaimer">* This is an estimate only. Final price may vary.</div>
              
              <button className="btn-primary" onClick={handlePurchase}>
                Purchase Now
              </button>
              
              <button className="btn-secondary" onClick={handleSaveQuote}>
                Save Quote
              </button>
            </div>
            
            <div className="next-steps">
              <h3>Next Steps</h3>
              <ul>
                <li>Review your quote details</li>
                <li>Customize coverage options</li>
                <li>Provide payment information</li>
                <li>Receive policy documents</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="form-navigation">
          <button type="button" className="btn-secondary" onClick={() => navigate('/personal-details')}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteSummary;