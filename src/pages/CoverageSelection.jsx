import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import '../pages/FormPage.css';

const CoverageSelection = () => {
  const { formData, updateFormData } = useFormContext();
  const navigate = useNavigate();

  // Set smart defaults based on existing data
  useEffect(() => {
    // Set default values if they haven't been set yet
    if (!formData.liability) {
      updateFormData('liability', '1000000');
    }
  }, []);

  const handleCoverageChange = (field, value) => {
    updateFormData(field, value);
  };

  const handleContinue = () => {
    navigate('/quote-summary');
  };

  const handleBack = () => {
    navigate('/personal-details');
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <h2>Coverage Selection</h2>
          <p>Choose the coverage options that best suit your needs</p>
        </div>
        
        <div className="form-content">
          <div className="coverage-section">
            <h3 className="section-title">Required Coverage</h3>
            <p className="coverage-description">
              These coverages are required by law and provide protection for bodily injury and property damage you may cause to others.
            </p>
            
            <div className="form-group">
              <label>Liability Coverage Limit *</label>
              <select 
                value={formData.liability || '1000000'} 
                onChange={(e) => handleCoverageChange('liability', e.target.value)}
                className="coverage-select"
              >
                <option value="1000000">$1,000,000</option>
                <option value="2000000">$2,000,000</option>
                <option value="5000000">$5,000,000</option>
              </select>
              <p className="help-text">Higher limits provide more protection for your assets in case of a serious accident.</p>
            </div>
          </div>
          
          <div className="coverage-section">
            <h3 className="section-title">Optional Coverages</h3>
            <p className="coverage-description">
              These additional coverages provide extra protection for your vehicle and personal finances.
            </p>
            
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.collision || false}
                  onChange={(e) => handleCoverageChange('collision', e.target.checked)}
                />
                <div className="checkbox-content">
                  <span className="checkbox-title">Collision Coverage</span>
                  <span className="checkbox-desc">Covers damage to your vehicle from collisions with other vehicles or objects.</span>
                </div>
              </label>
              
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.comprehensive || false}
                  onChange={(e) => handleCoverageChange('comprehensive', e.target.checked)}
                />
                <div className="checkbox-content">
                  <span className="checkbox-title">Comprehensive Coverage</span>
                  <span className="checkbox-desc">Covers damage to your vehicle from non-collision events like theft, vandalism, or weather.</span>
                </div>
              </label>
              
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.accidentForgiveness || false}
                  onChange={(e) => handleCoverageChange('accidentForgiveness', e.target.checked)}
                />
                <div className="checkbox-content">
                  <span className="checkbox-title">Accident Forgiveness</span>
                  <span className="checkbox-desc">Protects your driving record and premiums after your first at-fault accident.</span>
                </div>
              </label>
            </div>
          </div>
          
          <div className="coverage-info">
            <h4>Did You Know?</h4>
            <p>
              Choosing higher liability limits can protect your assets in case of a serious accident. 
              Collision and comprehensive coverages are typically required if you have a leased or financed vehicle.
            </p>
          </div>
          
          <div className="form-navigation">
            <button className="btn-secondary" onClick={handleBack}>
              ← Back
            </button>
            <button className="btn-primary" onClick={handleContinue}>
              Continue →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverageSelection;