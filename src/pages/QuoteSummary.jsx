import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import { calculateDriverRiskScore, calculateVehicleRiskScore, generateInsuranceRecommendations, estimatePremium } from '../utils/riskAssessment';
import './QuoteSummary.css';

const QuoteSummary = () => {
  const { formData, clearSavedData } = useFormContext();
  const navigate = useNavigate();

  // Calculate risk assessments
  const driverRisk = calculateDriverRiskScore(formData);
  const vehicleRisk = calculateVehicleRiskScore(formData);
  
  // Generate AI recommendations
  const recommendations = generateInsuranceRecommendations(driverRisk, vehicleRisk);
  
  // Estimate premium using AI model
  const premiumEstimate = estimatePremium(driverRisk.score, vehicleRisk.score, {
    collision: formData.collision,
    comprehensive: formData.comprehensive,
    accidentForgiveness: formData.accidentForgiveness
  });

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
            
            {/* AI Risk Assessment Section */}
            <div className="summary-section">
              <h2>AI Risk Assessment</h2>
              <div className="risk-assessment">
                <div className="risk-card">
                  <h3>Driver Risk Profile</h3>
                  <div className={`risk-score ${driverRisk.riskLevel}`}>
                    <span className="score-value">{driverRisk.score}/100</span>
                    <span className="risk-level">{driverRisk.riskDescription}</span>
                  </div>
                  <div className="risk-factors">
                    <h4>Key Factors:</h4>
                    <ul>
                      {driverRisk.factors.slice(0, 3).map((factor, index) => (
                        <li key={index}>
                          <strong>{factor.factor}:</strong> {factor.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="risk-card">
                  <h3>Vehicle Risk Profile</h3>
                  <div className={`risk-score ${vehicleRisk.riskLevel}`}>
                    <span className="score-value">{vehicleRisk.score}/100</span>
                    <span className="risk-level">{vehicleRisk.riskDescription}</span>
                  </div>
                  <div className="risk-factors">
                    <h4>Key Factors:</h4>
                    <ul>
                      {vehicleRisk.factors.slice(0, 3).map((factor, index) => (
                        <li key={index}>
                          <strong>{factor.factor}:</strong> {factor.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* AI Recommendations Section */}
            {recommendations.recommendations.length > 0 && (
              <div className="summary-section">
                <h2>AI Recommendations</h2>
                <div className="recommendations">
                  {recommendations.recommendations.map((rec, index) => (
                    <div key={index} className={`recommendation-card ${rec.priority}`}>
                      <h3>{rec.title}</h3>
                      <p>{rec.description}</p>
                      <div className="benefit">
                        <strong>Benefit:</strong> {rec.benefit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="quote-sidebar">
            <div className="premium-box">
              <h3>Estimated Annual Premium</h3>
              <div className="premium-amount">${premiumEstimate.annual.toLocaleString()}</div>
              <div className="monthly-rate">or ${premiumEstimate.monthly}/month</div>
              <div className="premium-disclaimer">* This is an AI-generated estimate. Final price may vary.</div>
              
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
          <button type="button" className="btn-secondary" onClick={() => navigate('/coverage')}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteSummary;