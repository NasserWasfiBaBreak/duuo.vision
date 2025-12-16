import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import { generateFieldSuggestions, predictFormValues } from '../utils/formSuggestions';
import Tooltip from '../components/Tooltip';
import ScanGuidance from '../components/ScanGuidance';
import './FormPage.css';

const DriverInfo = () => {
  const { formData, updateMultipleFields } = useFormContext();
  const [errors, setErrors] = useState({});
  const [entryMethod, setEntryMethod] = useState(''); // 'scan' or 'manual'
  const [scannedData, setScannedData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [touched, setTouched] = useState({}); // Track which fields have been touched
  const [suggestions, setSuggestions] = useState({}); // AI suggestions for form fields
  const [predictions, setPredictions] = useState({}); // AI predictions for form values
  const navigate = useNavigate();

  // Set smart defaults based on existing data
  useEffect(() => {
    console.log('DriverInfo useEffect triggered, formData:', formData, 'entryMethod:', entryMethod);
    // If we have some data already, but no entry method is set, set the entry method to manual
    if ((formData.firstName || formData.lastName || formData.licenseNumber) && !entryMethod) {
      console.log('Setting entryMethod to manual because we have existing data');
      setEntryMethod('manual');
    }
  }, [formData, entryMethod]);

  // Generate AI predictions when form data changes
  useEffect(() => {
    const newPredictions = predictFormValues(formData);
    setPredictions(newPredictions);
  }, [formData]);

  // Automatically initiate scanning when scan option is selected
  useEffect(() => {
    if (entryMethod === 'scan' && !scannedData && !isScanning) {
      simulateScan();
    }
  }, [entryMethod]);

  const handleMethodChange = (method) => {
    console.log('Setting entry method to:', method);
    setEntryMethod(method);
    setErrors({});
    
    // Clear form data when switching methods
    if (method === 'manual') {
      updateMultipleFields({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        maritalStatus: '',
        licenseNumber: '',
        yearsLicensed: '',
        address: '',
        city: '',
        province: '',
        postalCode: '',
        hasPreviousClaims: '',
        numberOfClaims: '',
        claimDetails: '',
        hasViolations: '',
        violationDetails: '',
        demeritPoints: '',
        hasSuspensions: '',
        suspensionDetails: '',
        hasTickets: '',
        ticketDetails: ''
      });
      setScannedData(null);
      setShowConfirmation(false);
    }
  };

  const simulateScan = () => {
    setIsScanning(true);
    // Scanning guidance is now shown via the ScanGuidance component
    // Simulate scanning delay
    setTimeout(() => {
      const mockData = {
        firstName: 'John',
        lastName: 'Smith',
        dateOfBirth: '1990-05-15',
        gender: 'male',
        maritalStatus: 'married',
        licenseNumber: 'S12345678',
        yearsLicensed: '10+',
        address: '123 Main Street',
        city: 'Toronto',
        province: 'ON',
        postalCode: 'M5V 3A8',
        hasPreviousClaims: 'yes',
        numberOfClaims: '1',
        claimDetails: 'Rear-end collision in 2022 - $2,500 in damages',
        hasViolations: 'yes',
        violationDetails: 'Speeding violation (15km/h over limit) - March 2023, Running red light - August 2023',
        demeritPoints: '6',
        hasSuspensions: 'no',
        suspensionDetails: '',
        hasTickets: 'yes',
        ticketDetails: 'Parking ticket - Downtown Toronto - January 2024, Expired registration - February 2024'
      };
      
      setScannedData(mockData);
      updateMultipleFields(mockData);
      setIsScanning(false);
      setShowConfirmation(true);
    }, 2000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    updateMultipleFields({ [name]: newValue });
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Generate AI suggestions for the field
    const fieldSuggestions = generateFieldSuggestions(name, newValue, formData);
    setSuggestions(prev => ({
      ...prev,
      [name]: fieldSuggestions
    }));
    
    // Handle conditional fields
    if (name === 'hasPreviousClaims' && value === 'no') {
      updateMultipleFields({ numberOfClaims: '', claimDetails: '' });
    }
    if (name === 'hasViolations' && value === 'no') {
      updateMultipleFields({ violationDetails: '' });
    }
    if (name === 'hasSuspensions' && value === 'no') {
      updateMultipleFields({ suspensionDetails: '' });
    }
    if (name === 'hasTickets' && value === 'no') {
      updateMultipleFields({ ticketDetails: '' });
    }
  };

  // Apply AI suggestion to a field
  const applySuggestion = (fieldName, suggestionValue) => {
    updateMultipleFields({ [fieldName]: suggestionValue });
    setSuggestions(prev => ({
      ...prev,
      [fieldName]: []
    }));
  };

  // Apply AI prediction to a field
  const applyPrediction = (fieldName, predictionValue) => {
    updateMultipleFields({ [fieldName]: predictionValue });
  };

  // Real-time validation
  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
        if (!value.trim()) return 'First name is required';
        if (value.trim().length < 2) return 'First name must be at least 2 characters';
        return '';
      case 'lastName':
        if (!value.trim()) return 'Last name is required';
        if (value.trim().length < 2) return 'Last name must be at least 2 characters';
        return '';
      case 'dateOfBirth':
        if (!value) return 'Date of birth is required';
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 16) return 'You must be at least 16 years old';
        if (age > 120) return 'Please enter a valid date of birth';
        return '';
      case 'gender':
        if (!value) return 'Gender is required';
        return '';
      case 'maritalStatus':
        if (!value) return 'Marital status is required';
        return '';
      case 'licenseNumber':
        if (!value.trim()) return 'License number is required';
        if (value.trim().length < 5) return 'Please enter a valid license number';
        return '';
      case 'yearsLicensed':
        if (!value) return 'Years licensed is required';
        return '';
      case 'address':
        if (!value.trim()) return 'Address is required';
        if (value.trim().length < 5) return 'Please enter a valid address';
        return '';
      case 'city':
        if (!value.trim()) return 'City is required';
        if (value.trim().length < 2) return 'Please enter a valid city';
        return '';
      case 'province':
        if (!value) return 'Province is required';
        return '';
      case 'postalCode':
        if (!value.trim()) return 'Postal code is required';
        if (!/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(value)) return 'Please enter a valid Canadian postal code';
        return '';
      case 'numberOfClaims':
        if (formData.hasPreviousClaims === 'yes' && !value) return 'Number of claims is required';
        return '';
      case 'claimDetails':
        if (formData.hasPreviousClaims === 'yes' && !value.trim()) return 'Claim details are required';
        return '';
      case 'violationDetails':
        if (formData.hasViolations === 'yes' && !value.trim()) return 'Violation details are required';
        return '';
      case 'demeritPoints':
        if (value && isNaN(value)) return 'Demerit points must be a number';
        return '';
      case 'suspensionDetails':
        if (formData.hasSuspensions === 'yes' && !value.trim()) return 'Suspension details are required';
        return '';
      case 'ticketDetails':
        if (formData.hasTickets === 'yes' && !value.trim()) return 'Ticket details are required';
        return '';
      default:
        return '';
    }
  };

  // Validate all fields
  const validate = () => {
    const newErrors = {};
    
    // Validate all fields
    const fieldsToValidate = [
      'firstName', 'lastName', 'dateOfBirth', 'gender', 'maritalStatus',
      'licenseNumber', 'yearsLicensed', 'address', 'city', 'province', 
      'postalCode', 'numberOfClaims', 'claimDetails', 'violationDetails',
      'demeritPoints', 'suspensionDetails', 'ticketDetails'
    ];
    
    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      navigate('/vehicle-info');
    }
  };

  const handleConfirmAndContinue = () => {
    if (validate()) {
      navigate('/vehicle-info');
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <h2>Driver Information</h2>
          <p>Please provide details about the primary driver</p>
        </div>
        
        {!entryMethod ? (
          <div className="form-content">
            <div className="method-selection">
              <h3 className="section-title">How would you like to provide driver information?</h3>
              <div className="method-options">
                <div 
                  className="method-option" 
                  onClick={() => handleMethodChange('scan')}
                >
                  <div className="method-icon">📷</div>
                  <h4>Scan Driver's License</h4>
                  <p>Automatically fill information by scanning your driver's license</p>
                </div>
                
                <div 
                  className="method-option" 
                  onClick={() => handleMethodChange('manual')}
                >
                  <div className="method-icon">✏️</div>
                  <h4>Enter Manually</h4>
                  <p>Fill in driver information manually</p>
                </div>
              </div>
              
              <div className="form-navigation">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => navigate('/')}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        ) : entryMethod === 'scan' && isScanning ? (
          <>
            <ScanGuidance onCancel={() => {
              setIsScanning(false);
              setEntryMethod('');
            }} />
            <div className="form-content">
              <div className="scan-section">
                <h3 className="section-title">Scanning Driver's License</h3>
                <div className="scan-prompt">
                  <p>Scanning your driver's license...</p>
                  <div className="spinner"></div>
                  <p className="scanning-text">Processing license data</p>
                </div>
              </div>
            </div>
          </>
        ) : entryMethod === 'scan' && showConfirmation && scannedData ? (
          <div className="form-content">
            <div className="scan-section">
              <div className="scan-success">
                <div className="success-icon">✅</div>
                <h3>License Scanned Successfully!</h3>
                <p>Please review the information below and make any necessary corrections.</p>
                
                <div className="scanned-data-preview">
                  <div className="data-section">
                    <h4>Personal Information</h4>
                    <div className="data-row">
                      <span className="label">Name:</span>
                      <span className="value">{scannedData.firstName} {scannedData.lastName}</span>
                    </div>
                    <div className="data-row">
                      <span className="label">Date of Birth:</span>
                      <span className="value">{scannedData.dateOfBirth}</span>
                    </div>
                    <div className="data-row">
                      <span className="label">Gender:</span>
                      <span className="value">{scannedData.gender}</span>
                    </div>
                    <div className="data-row">
                      <span className="label">Marital Status:</span>
                      <span className="value">{scannedData.maritalStatus}</span>
                    </div>
                  </div>
                  
                  <div className="data-section">
                    <h4>License Information</h4>
                    <div className="data-row">
                      <span className="label">License Number:</span>
                      <span className="value">{scannedData.licenseNumber}</span>
                    </div>
                    <div className="data-row">
                      <span className="label">Years Licensed:</span>
                      <span className="value">{scannedData.yearsLicensed}</span>
                    </div>
                  </div>
                  
                  <div className="data-section">
                    <h4>Address Information</h4>
                    <div className="data-row">
                      <span className="label">Street:</span>
                      <span className="value">{scannedData.address}</span>
                    </div>
                    <div className="data-row">
                      <span className="label">City:</span>
                      <span className="value">{scannedData.city}</span>
                    </div>
                    <div className="data-row">
                      <span className="label">Province:</span>
                      <span className="value">{scannedData.province}</span>
                    </div>
                    <div className="data-row">
                      <span className="label">Postal Code:</span>
                      <span className="value">{scannedData.postalCode}</span>
                    </div>
                  </div>
                  
                  {scannedData.hasPreviousClaims === 'yes' && (
                    <div className="data-section">
                      <h4>Insurance Claims History</h4>
                      <div className="data-row">
                        <span className="label">Number of Claims:</span>
                        <span className="value">{scannedData.numberOfClaims}</span>
                      </div>
                      <div className="data-row">
                        <span className="label">Claim Details:</span>
                        <span className="value long-text">{scannedData.claimDetails}</span>
                      </div>
                    </div>
                  )}
                  
                  {scannedData.hasViolations === 'yes' && (
                    <div className="data-section">
                      <h4>Traffic Violations</h4>
                      <div className="data-row">
                        <span className="label">Demerit Points:</span>
                        <span className="value">{scannedData.demeritPoints}</span>
                      </div>
                      <div className="data-row">
                        <span className="label">Violation Details:</span>
                        <span className="value long-text">{scannedData.violationDetails}</span>
                      </div>
                    </div>
                  )}
                  
                  {scannedData.hasTickets === 'yes' && (
                    <div className="data-section">
                      <h4>Traffic Tickets</h4>
                      <div className="data-row">
                        <span className="label">Ticket Details:</span>
                        <span className="value long-text">{scannedData.ticketDetails}</span>
                      </div>
                    </div>
                  )}
                  
                  {scannedData.hasSuspensions === 'yes' && (
                    <div className="data-section">
                      <h4>License Suspensions</h4>
                      <div className="data-row">
                        <span className="label">Suspension Details:</span>
                        <span className="value long-text">{scannedData.suspensionDetails}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="review-note">
                  All information will be securely stored and used only for your insurance quote.
                  <br />
                  <strong>Double-check the details above to ensure accuracy.</strong>
                </div>
                
                <div className="confirmation-buttons">
                  <button 
                    className="btn-secondary" 
                    onClick={() => {
                      setShowConfirmation(false);
                      setEntryMethod('');
                    }}
                  >
                    🔄 Rescan License
                  </button>
                  <button 
                    className="btn-primary" 
                    onClick={handleConfirmAndContinue}
                  >
                    ✅ Confirm and Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="form-content">
            <div className="form-section">
              <h3 className="section-title">Personal Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g., John"
                    className={errors.firstName ? 'error' : ''}
                  />
                  {/* AI Suggestions */}
                  {suggestions.firstName && suggestions.firstName.length > 0 && (
                    <div className="ai-suggestions">
                      {suggestions.firstName.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          className="suggestion-item"
                          onClick={() => applySuggestion('firstName', suggestion.value)}
                        >
                          {suggestion.label}: {suggestion.value}
                        </button>
                      ))}
                    </div>
                  )}
                  {/* AI Predictions */}
                  {predictions.email && (
                    <div className="ai-prediction">
                      <button
                        type="button"
                        className="prediction-item"
                        onClick={() => applyPrediction('email', predictions.email.value)}
                      >
                        Predicted email: {predictions.email.value}
                      </button>
                    </div>
                  )}
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g., Smith"
                    className={errors.lastName ? 'error' : ''}
                  />
                  {/* AI Suggestions */}
                  {suggestions.lastName && suggestions.lastName.length > 0 && (
                    <div className="ai-suggestions">
                      {suggestions.lastName.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          className="suggestion-item"
                          onClick={() => applySuggestion('lastName', suggestion.value)}
                        >
                          {suggestion.label}: {suggestion.value}
                        </button>
                      ))}
                    </div>
                  )}
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date of Birth *</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.dateOfBirth ? 'error' : ''}
                  />
                  {/* AI Suggestions */}
                  {suggestions.dateOfBirth && suggestions.dateOfBirth.length > 0 && (
                    <div className="ai-suggestions">
                      {suggestions.dateOfBirth.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          className="suggestion-item"
                          onClick={() => applySuggestion('dateOfBirth', suggestion.value)}
                        >
                          {suggestion.label}: {suggestion.value}
                        </button>
                      ))}
                    </div>
                  )}
                  {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="gender">Gender *</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.gender ? 'error' : ''}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                  {errors.gender && <span className="error-message">{errors.gender}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="maritalStatus">Marital Status *</label>
                  <select
                    id="maritalStatus"
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.maritalStatus ? 'error' : ''}
                  >
                    <option value="">Select Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="common-law">Common Law</option>
                    <option value="separated">Separated</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                  {errors.maritalStatus && <span className="error-message">{errors.maritalStatus}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="yearsLicensed">Years Licensed *</label>
                  <select
                    id="yearsLicensed"
                    name="yearsLicensed"
                    value={formData.yearsLicensed}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.yearsLicensed ? 'error' : ''}
                  >
                    <option value="">Select Years</option>
                    <option value="0-1">Less than 1 year</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                  {errors.yearsLicensed && <span className="error-message">{errors.yearsLicensed}</span>}
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h3 className="section-title">Address Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="address">Street Address *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g., 123 Main Street"
                    className={errors.address ? 'error' : ''}
                  />
                  {/* AI Suggestions */}
                  {suggestions.address && suggestions.address.length > 0 && (
                    <div className="ai-suggestions">
                      {suggestions.address.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          className="suggestion-item"
                          onClick={() => applySuggestion('address', suggestion.value)}
                        >
                          {suggestion.label}: {suggestion.value}
                        </button>
                      ))}
                    </div>
                  )}
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g., Toronto"
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="province">Province *</label>
                  <select
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.province ? 'error' : ''}
                  >
                    <option value="">Select Province</option>
                    <option value="AB">Alberta</option>
                    <option value="BC">British Columbia</option>
                    <option value="MB">Manitoba</option>
                    <option value="NB">New Brunswick</option>
                    <option value="NL">Newfoundland and Labrador</option>
                    <option value="NS">Nova Scotia</option>
                    <option value="NT">Northwest Territories</option>
                    <option value="NU">Nunavut</option>
                    <option value="ON">Ontario</option>
                    <option value="PE">Prince Edward Island</option>
                    <option value="QC">Quebec</option>
                    <option value="SK">Saskatchewan</option>
                    <option value="YT">Yukon</option>
                  </select>
                  {/* AI Predictions */}
                  {predictions.province && (
                    <div className="ai-prediction">
                      <button
                        type="button"
                        className="prediction-item"
                        onClick={() => applyPrediction('province', predictions.province.value)}
                      >
                        Predicted from postal code: {predictions.province.value}
                      </button>
                    </div>
                  )}
                  {errors.province && <span className="error-message">{errors.province}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="postalCode">Postal Code *</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g., M5V 3A8"
                    className={errors.postalCode ? 'error' : ''}
                  />
                  {/* AI Suggestions */}
                  {suggestions.postalCode && suggestions.postalCode.length > 0 && (
                    <div className="ai-suggestions">
                      {suggestions.postalCode.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          className="suggestion-item"
                          onClick={() => applySuggestion('postalCode', suggestion.value)}
                        >
                          {suggestion.label}: {suggestion.value}
                        </button>
                      ))}
                    </div>
                  )}
                  {errors.postalCode && <span className="error-message">{errors.postalCode}</span>}
                </div>
              </div>
            </div>
            
            <div className="driver-history-section">
              <h3 className="section-title">Driver History</h3>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="hasPreviousClaims"
                    checked={formData.hasPreviousClaims === 'yes'}
                    onChange={(e) => handleChange({ target: { name: 'hasPreviousClaims', value: e.target.checked ? 'yes' : 'no' } })}
                  />
                  <span>I have had previous insurance claims</span>
                </label>
              </div>
              
              {formData.hasPreviousClaims === 'yes' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="numberOfClaims">Number of Claims *</label>
                      <select
                        id="numberOfClaims"
                        name="numberOfClaims"
                        value={formData.numberOfClaims}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={errors.numberOfClaims ? 'error' : ''}
                      >
                        <option value="">Select Number</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5+">5 or more</option>
                      </select>
                      {errors.numberOfClaims && <span className="error-message">{errors.numberOfClaims}</span>}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="claimDetails">Brief Description of Claims *</label>
                    <textarea
                      id="claimDetails"
                      name="claimDetails"
                      value={formData.claimDetails}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Please describe the nature of the claims (e.g., fender bender, theft, weather damage)"
                      className={errors.claimDetails ? 'error' : ''}
                      rows="3"
                    />
                    {errors.claimDetails && <span className="error-message">{errors.claimDetails}</span>}
                  </div>
                </>
              )}
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="hasViolations"
                    checked={formData.hasViolations === 'yes'}
                    onChange={(e) => handleChange({ target: { name: 'hasViolations', value: e.target.checked ? 'yes' : 'no' } })}
                  />
                  <span>I have traffic violations</span>
                </label>
              </div>
              
              {formData.hasViolations === 'yes' && (
                <div className="form-group">
                  <label htmlFor="violationDetails">Brief Description of Violations *</label>
                  <textarea
                    id="violationDetails"
                    name="violationDetails"
                    value={formData.violationDetails}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Please describe the violations (e.g., speeding, running red light)"
                    className={errors.violationDetails ? 'error' : ''}
                    rows="3"
                  />
                  {errors.violationDetails && <span className="error-message">{errors.violationDetails}</span>}
                </div>
              )}
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="demeritPoints">
                    Demerit Points (if applicable)
                    <Tooltip text="Demerit points are penalties added to your driving record for traffic violations. They can affect your insurance rates.">
                      <span className="tooltip-icon">?</span>
                    </Tooltip>
                  </label>
                  <input
                    type="number"
                    id="demeritPoints"
                    name="demeritPoints"
                    value={formData.demeritPoints}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g., 4"
                    className={errors.demeritPoints ? 'error' : ''}
                  />
                  {errors.demeritPoints && <span className="error-message">{errors.demeritPoints}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="hasSuspensions"
                    checked={formData.hasSuspensions === 'yes'}
                    onChange={(e) => handleChange({ target: { name: 'hasSuspensions', value: e.target.checked ? 'yes' : 'no' } })}
                  />
                  <span>I have had license suspensions</span>
                </label>
              </div>
              
              {formData.hasSuspensions === 'yes' && (
                <div className="form-group">
                  <label htmlFor="suspensionDetails">Brief Description of Suspensions *</label>
                  <textarea
                    id="suspensionDetails"
                    name="suspensionDetails"
                    value={formData.suspensionDetails}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Please describe the suspensions (e.g., DUI, reckless driving)"
                    className={errors.suspensionDetails ? 'error' : ''}
                    rows="3"
                  />
                  {errors.suspensionDetails && <span className="error-message">{errors.suspensionDetails}</span>}
                </div>
              )}
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="hasTickets"
                    checked={formData.hasTickets === 'yes'}
                    onChange={(e) => handleChange({ target: { name: 'hasTickets', value: e.target.checked ? 'yes' : 'no' } })}
                  />
                  <span>I have received traffic tickets</span>
                </label>
              </div>
              
              {formData.hasTickets === 'yes' && (
                <div className="form-group">
                  <label htmlFor="ticketDetails">Brief Description of Tickets *</label>
                  <textarea
                    id="ticketDetails"
                    name="ticketDetails"
                    value={formData.ticketDetails}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Please describe the tickets (e.g., parking, speeding, expired registration)"
                    className={errors.ticketDetails ? 'error' : ''}
                    rows="3"
                  />
                  {errors.ticketDetails && <span className="error-message">{errors.ticketDetails}</span>}
                </div>
              )}
            </div>
            
            <div className="form-navigation">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => setEntryMethod('')}
              >
                Back
              </button>
              <button type="submit" className="btn-primary">
                Continue
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DriverInfo;