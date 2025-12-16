import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import './FormPage.css';

const PersonalDetails = () => {
  const { formData, updateMultipleFields } = useFormContext();
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({}); // Track which fields have been touched
  const navigate = useNavigate();

  // Set smart defaults based on existing data
  useEffect(() => {
    // Pre-fill email and phone if we have driver info
    if (formData.email && !touched.email) {
      setTouched(prev => ({ ...prev, email: true }));
    }
    if (formData.phone && !touched.phone) {
      setTouched(prev => ({ ...prev, phone: true }));
    }
  }, [formData, touched]);

  // Real-time validation
  const validateField = (name, value) => {
    console.log(`Validating field ${name} with value:`, value);
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      case 'phone':
        if (!value) return 'Phone number is required';
        if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value)) return 'Please enter a valid phone number';
        return '';
      case 'preferredContact':
        if (!value) return 'Preferred contact method is required';
        return '';
      default:
        return '';
    }
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
    
    // Validate all fields
    const fieldsToValidate = ['email', 'phone', 'preferredContact'];
    console.log('=== Starting Validation ===');
    console.log('Fields to validate:', fieldsToValidate);
    console.log('Current form data:', formData);
    
    fieldsToValidate.forEach(field => {
      const fieldValue = formData[field];
      console.log(`Checking field: ${field}`);
      console.log(`Field value:`, fieldValue);
      console.log(`Field type:`, typeof fieldValue);
      
      const error = validateField(field, fieldValue);
      console.log(`Validation result for ${field}:`, error);
      
      if (error) {
        newErrors[field] = error;
        console.log(`Adding error for ${field}:`, error);
      }
    });
    
    console.log('Final validation errors:', newErrors);
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('Is form valid:', isValid);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('=== Personal Details Form Submission ===');
    console.log('Form data:', formData);
    console.log('Validating fields:', ['email', 'phone', 'preferredContact']);
    console.log('Email value:', formData.email);
    console.log('Phone value:', formData.phone);
    console.log('Preferred contact value:', formData.preferredContact);
    
    const isValid = validate();
    console.log('Validation result:', isValid);
    console.log('Validation errors:', errors);
    
    if (isValid) {
      console.log('Validation passed, navigating to /coverage');
      navigate('/coverage');
    } else {
      console.log('Validation failed, errors:', errors);
      // Scroll to first error
      const firstErrorElement = document.querySelector('.error, .error-message');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorElement.focus();
      }
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <h2>Communication Preferences</h2>
          <p>How would you like to be contacted?</p>
        </div>
        
        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-section">
            <h3>Contact Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="your.email@example.com"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="(555) 123-4567"
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
            </div>
            
            <div className="form-group">
              <label>Preferred Contact Method *</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="preferredContact"
                    value="email"
                    checked={formData.preferredContact === 'email'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <span>Email</span>
                </label>
                
                <label className="radio-label">
                  <input
                    type="radio"
                    name="preferredContact"
                    value="phone"
                    checked={formData.preferredContact === 'phone'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <span>Phone</span>
                </label>
                
                <label className="radio-label">
                  <input
                    type="radio"
                    name="preferredContact"
                    value="text"
                    checked={formData.preferredContact === 'text'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <span>Text Message</span>
                </label>
              </div>
              {errors.preferredContact && <span className="error-message">{errors.preferredContact}</span>}
            </div>
          </div>
          
          <div className="form-section">
            <h3>Communication Preferences</h3>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="acceptEmailCommunications"
                  checked={formData.acceptEmailCommunications}
                  onChange={handleChange}
                />
                <span>I agree to receive email communications about my policy</span>
              </label>
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="acceptMailCommunications"
                  checked={formData.acceptMailCommunications}
                  onChange={handleChange}
                />
                <span>I agree to receive mail communications about my policy</span>
              </label>
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="acceptPhoneCommunications"
                  checked={formData.acceptPhoneCommunications}
                  onChange={handleChange}
                />
                <span>I agree to receive phone communications about my policy</span>
              </label>
            </div>
          </div>
          
          <div className="privacy-note">
            <p>We respect your privacy. Your information will only be used to provide your insurance quote and will not be shared without your consent.</p>
          </div>
          
          <div className="form-navigation">
            <button type="button" className="btn-secondary" onClick={() => navigate('/vehicle-info')}>
              Back
            </button>
            <button type="submit" className="btn-primary">
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalDetails;