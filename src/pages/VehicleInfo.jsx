import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import './FormPage.css';

const VehicleInfo = () => {
  const { formData, updateMultipleFields } = useFormContext();
  const [errors, setErrors] = useState({});
  const [entryMethod, setEntryMethod] = useState(''); // 'vin' or 'manual'
  const [vinData, setVinData] = useState(null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [touched, setTouched] = useState({}); // Track which fields have been touched
  const navigate = useNavigate();

  // Set smart defaults based on existing data
  useEffect(() => {
    // If we have some vehicle data already, set the entry method to manual
    if (formData.year || formData.make || formData.model || formData.vin) {
      setEntryMethod('manual');
    }
  }, []);

  const handleMethodChange = (method) => {
    setEntryMethod(method);
    setErrors({});
    
    // Clear form data when switching methods
    if (method === 'manual') {
      updateMultipleFields({
        year: '',
        make: '',
        model: '',
        vin: '',
        usage: '',
        annualKilometers: ''
      });
      setVinData(null);
    }
  };

  const simulateVinLookup = () => {
    setIsLookingUp(true);
    
    // Show VIN lookup guidance
    alert("Please ensure you've entered a valid 17-character VIN. You can typically find this on your dashboard near the windshield or on your vehicle registration.");
    
    // Simulate VIN lookup delay
    setTimeout(() => {
      const mockData = {
        year: '2023',
        make: 'Toyota',
        model: 'Camry',
        vin: '4T1B11HK0JU705506',
        usage: 'commute',
        annualKilometers: '10000-15000'
      };
      
      setVinData(mockData);
      updateMultipleFields(mockData);
      setIsLookingUp(false);
    }, 2000);
  };

  const handleVinSubmit = (e) => {
    e.preventDefault();
    const vin = formData.vin;
    
    if (!vin || vin.length !== 17) {
      setErrors({ vin: 'Please enter a valid 17-character VIN' });
      return;
    }
    
    setErrors({});
    simulateVinLookup();
  };

  // Real-time validation
  const validateField = (name, value) => {
    switch (name) {
      case 'vin':
        if (!value.trim()) return 'VIN is required';
        if (value.trim().length !== 17) return 'VIN must be exactly 17 characters';
        return '';
      case 'year':
        if (!value) return 'Vehicle year is required';
        return '';
      case 'make':
        if (!value.trim()) return 'Vehicle make is required';
        if (value.trim().length < 2) return 'Please enter a valid make';
        return '';
      case 'model':
        if (!value.trim()) return 'Vehicle model is required';
        if (value.trim().length < 1) return 'Please enter a valid model';
        return '';
      case 'usage':
        if (!value) return 'Vehicle usage is required';
        return '';
      case 'annualKilometers':
        if (!value) return 'Annual kilometers is required';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateMultipleFields({ [name]: value });
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Real-time validation on field blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const validate = () => {
    const newErrors = {};
    
    // Validate all fields based on entry method
    if (entryMethod === 'vin' && vinData) {
      const fieldsToValidate = ['usage', 'annualKilometers'];
      fieldsToValidate.forEach(field => {
        const error = validateField(field, formData[field]);
        if (error) newErrors[field] = error;
      });
    } else if (entryMethod === 'manual') {
      const fieldsToValidate = ['year', 'make', 'model', 'vin', 'usage', 'annualKilometers'];
      fieldsToValidate.forEach(field => {
        const error = validateField(field, formData[field]);
        if (error) newErrors[field] = error;
      });
    } else if (entryMethod === 'vin' && !vinData) {
      const error = validateField('vin', formData.vin);
      if (error) newErrors.vin = error;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      navigate('/personal-details');
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <h2>Vehicle Information</h2>
          <p>Please provide details about your vehicle</p>
        </div>
        
        {!entryMethod ? (
          <div className="form-content">
            <div className="method-selection">
              <h3 className="section-title">How would you like to provide vehicle information?</h3>
              <div className="method-options">
                <div 
                  className="method-option" 
                  onClick={() => handleMethodChange('vin')}
                >
                  <div className="method-icon">🔍</div>
                  <h4>VIN Lookup</h4>
                  <p>Automatically fill information by entering your Vehicle Identification Number</p>
                </div>
                
                <div 
                  className="method-option" 
                  onClick={() => handleMethodChange('manual')}
                >
                  <div className="method-icon">✏️</div>
                  <h4>Enter Manually</h4>
                  <p>Fill in vehicle information manually</p>
                </div>
              </div>
              
              {/* Back button to previous page */}
              <div className="form-navigation">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => navigate('/driver-info')}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="form-content">
            {entryMethod === 'vin' && !vinData && (
              <div className="vin-lookup-section">
                <h3 className="section-title">VIN Lookup</h3>
                <p className="vin-instructions">Enter your 17-character Vehicle Identification Number to automatically populate your vehicle details.</p>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="vin">VIN (Vehicle Identification Number) *</label>
                    <input
                      type="text"
                      id="vin"
                      name="vin"
                      value={formData.vin}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="17-character VIN"
                      maxLength="17"
                      className={errors.vin ? 'error' : ''}
                    />
                    {errors.vin && <span className="error-message">{errors.vin}</span>}
                  </div>
                </div>
                
                <div className="form-navigation">
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={() => setEntryMethod('')}
                  >
                    Back to Options
                  </button>
                  <button 
                    type="button" 
                    className="btn-primary"
                    onClick={handleVinSubmit}
                    disabled={isLookingUp}
                  >
                    {isLookingUp ? 'Looking Up...' : 'Lookup Vehicle'}
                  </button>
                </div>
              </div>
            )}
            
            {entryMethod === 'vin' && isLookingUp && (
              <div className="scan-section">
                <h3 className="section-title">VIN Lookup</h3>
                <div className="scan-prompt">
                  <p>Looking up vehicle information...</p>
                  <div className="spinner"></div>
                  <p className="scanning-text">Please wait while we retrieve your vehicle details</p>
                </div>
                
                {/* Back button during lookup */}
                <div className="form-navigation">
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={() => {
                      setIsLookingUp(false);
                      setEntryMethod('');
                    }}
                  >
                    Cancel and Back
                  </button>
                </div>
              </div>
            )}
            
            {entryMethod === 'vin' && vinData && (
              <div className="scan-success">
                <div className="success-icon">✅</div>
                <h4>Vehicle Found!</h4>
                <p>The following information has been retrieved from your VIN:</p>
                <div className="scanned-data-preview">
                  <div className="data-row">
                    <span className="label">Year:</span>
                    <span className="value">{vinData.year}</span>
                  </div>
                  <div className="data-row">
                    <span className="label">Make:</span>
                    <span className="value">{vinData.make}</span>
                  </div>
                  <div className="data-row">
                    <span className="label">Model:</span>
                    <span className="value">{vinData.model}</span>
                  </div>
                  <div className="data-row">
                    <span className="label">VIN:</span>
                    <span className="value">{vinData.vin}</span>
                  </div>
                </div>
                <p className="note">Please review the information below and make any necessary corrections.</p>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="usage">Primary Usage *</label>
                    <select
                      id="usage"
                      name="usage"
                      value={formData.usage}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.usage ? 'error' : ''}
                    >
                      <option value="">Select Usage</option>
                      <option value="pleasure">Pleasure/Personal</option>
                      <option value="commute">Commute to Work/School</option>
                      <option value="business">Business/Commercial</option>
                    </select>
                    {errors.usage && <span className="error-message">{errors.usage}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="annualKilometers">Annual Kilometers *</label>
                    <select
                      id="annualKilometers"
                      name="annualKilometers"
                      value={formData.annualKilometers}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.annualKilometers ? 'error' : ''}
                    >
                      <option value="">Select Range</option>
                      <option value="0-5000">0 - 5,000 km</option>
                      <option value="5000-10000">5,000 - 10,000 km</option>
                      <option value="10000-15000">10,000 - 15,000 km</option>
                      <option value="15000-20000">15,000 - 20,000 km</option>
                      <option value="20000+">20,000+ km</option>
                    </select>
                    {errors.annualKilometers && <span className="error-message">{errors.annualKilometers}</span>}
                  </div>
                </div>
                
                <div className="form-navigation">
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={() => setEntryMethod('')}
                  >
                    Back to Options
                  </button>
                  <button 
                    type="button" 
                    className="btn-primary"
                    onClick={handleSubmit}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
            
            {entryMethod === 'manual' && (
              <div className="form-section">
                <h3 className="section-title">Vehicle Information</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="year">Vehicle Year *</label>
                    <select
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.year ? 'error' : ''}
                    >
                      <option value="">Select Year</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                      <option value="2021">2021</option>
                      <option value="2020">2020</option>
                      <option value="2019">2019</option>
                      <option value="2018">2018</option>
                      <option value="2017">2017</option>
                      <option value="2016">2016</option>
                      <option value="2015">2015</option>
                      <option value="2014">2014</option>
                      <option value="2013">2013</option>
                      <option value="2012">2012</option>
                      <option value="2011">2011</option>
                      <option value="2010">2010</option>
                      <option value="2009">2009</option>
                      <option value="2008">2008</option>
                      <option value="2007">2007</option>
                      <option value="2006">2006</option>
                      <option value="2005">2005</option>
                      <option value="2004">2004</option>
                      <option value="2003">2003</option>
                      <option value="2002">2002</option>
                      <option value="2001">2001</option>
                      <option value="2000">2000</option>
                    </select>
                    {errors.year && <span className="error-message">{errors.year}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="make">Vehicle Make *</label>
                    <input
                      type="text"
                      id="make"
                      name="make"
                      value={formData.make}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g., Toyota, Honda, Ford"
                      className={errors.make ? 'error' : ''}
                    />
                    {errors.make && <span className="error-message">{errors.make}</span>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="model">Vehicle Model *</label>
                    <input
                      type="text"
                      id="model"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g., Camry, Civic, F-150"
                      className={errors.model ? 'error' : ''}
                    />
                    {errors.model && <span className="error-message">{errors.model}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="vin">VIN (Vehicle Identification Number) *</label>
                    <input
                      type="text"
                      id="vin"
                      name="vin"
                      value={formData.vin}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="17-character VIN"
                      maxLength="17"
                      className={errors.vin ? 'error' : ''}
                    />
                    {errors.vin && <span className="error-message">{errors.vin}</span>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="usage">Primary Usage *</label>
                    <select
                      id="usage"
                      name="usage"
                      value={formData.usage}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.usage ? 'error' : ''}
                    >
                      <option value="">Select Usage</option>
                      <option value="pleasure">Pleasure/Personal</option>
                      <option value="commute">Commute to Work/School</option>
                      <option value="business">Business/Commercial</option>
                    </select>
                    {errors.usage && <span className="error-message">{errors.usage}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="annualKilometers">Annual Kilometers *</label>
                    <select
                      id="annualKilometers"
                      name="annualKilometers"
                      value={formData.annualKilometers}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.annualKilometers ? 'error' : ''}
                    >
                      <option value="">Select Range</option>
                      <option value="0-5000">0 - 5,000 km</option>
                      <option value="5000-10000">5,000 - 10,000 km</option>
                      <option value="10000-15000">10,000 - 15,000 km</option>
                      <option value="15000-20000">15,000 - 20,000 km</option>
                      <option value="20000+">20,000+ km</option>
                    </select>
                    {errors.annualKilometers && <span className="error-message">{errors.annualKilometers}</span>}
                  </div>
                </div>
                
                <div className="form-navigation">
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={() => setEntryMethod('')}
                  >
                    Back to Options
                  </button>
                  <button type="submit" className="btn-primary">
                    Continue
                  </button>
                </div>
              </div>
            )}
            
            
          </form>
        )}
      </div>
    </div>
  );
};

export default VehicleInfo;