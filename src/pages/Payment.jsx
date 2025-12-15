import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import './Payment.css';

const Payment = () => {
  const { formData } = useFormContext();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [errors, setErrors] = useState({});

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

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateCardForm = () => {
    const newErrors = {};
    
    if (paymentMethod === 'card') {
      if (!cardData.cardNumber) newErrors.cardNumber = 'Card number is required';
      if (!cardData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
      if (!cardData.cvv) newErrors.cvv = 'CVV is required';
      if (!cardData.cardholderName) newErrors.cardholderName = 'Cardholder name is required';
      
      // Simple card number validation (16 digits)
      if (cardData.cardNumber && !/^\d{16}$/.test(cardData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      
      // Simple expiry date validation (MM/YY)
      if (cardData.expiryDate && !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(cardData.expiryDate)) {
        newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      }
      
      // Simple CVV validation (3 digits)
      if (cardData.cvv && !/^\d{3}$/.test(cardData.cvv)) {
        newErrors.cvv = 'Please enter a valid 3-digit CVV';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'card' && !validateCardForm()) {
      return;
    }
    
    // In a real application, this would process the payment
    alert('Payment processed successfully! Thank you for your purchase.');
    navigate('/');
  };

  const handleApplePay = () => {
    // In a real application, this would initiate Apple Pay
    alert('Apple Pay initiated. In a real application, this would open the Apple Pay interface.');
    navigate('/');
  };

  const handleGooglePay = () => {
    // In a real application, this would initiate Google Pay
    alert('Google Pay initiated. In a real application, this would open the Google Pay interface.');
    navigate('/');
  };

  const handleSamsungPay = () => {
    // In a real application, this would initiate Samsung Pay
    alert('Samsung Pay initiated. In a real application, this would open the Samsung Pay interface.');
    navigate('/');
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h1>Payment Information</h1>
          <p>Securely complete your purchase</p>
        </div>
        
        <div className="payment-content">
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-item">
              <span className="label">Driver:</span>
              <span className="value">{formData.firstName} {formData.lastName}</span>
            </div>
            <div className="summary-item">
              <span className="label">Vehicle:</span>
              <span className="value">{formData.year} {formData.make} {formData.model}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-item total">
              <span className="label">Total:</span>
              <span className="value">${estimatedPremium.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="payment-methods">
            <h2>Payment Method</h2>
            
            <div className="payment-options">
              <button 
                className={`payment-option ${paymentMethod === 'apple' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('apple')}
              >
                <div className="payment-icon"></div>
                <span>Apple Pay</span>
              </button>
              
              <button 
                className={`payment-option ${paymentMethod === 'google' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('google')}
              >
                <div className="payment-icon">G</div>
                <span>Google Pay</span>
              </button>
              
              <button 
                className={`payment-option ${paymentMethod === 'samsung' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('samsung')}
              >
                <div className="payment-icon">S</div>
                <span>Samsung Pay</span>
              </button>
              
              <button 
                className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <div className="payment-icon">💳</div>
                <span>Credit/Debit Card</span>
              </button>
            </div>
            
            {paymentMethod === 'card' && (
              <form className="card-form" onSubmit={handlePayment}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="cardNumber">Card Number *</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={cardData.cardNumber}
                      onChange={handleCardInputChange}
                      placeholder="1234 5678 9012 3456"
                      className={errors.cardNumber ? 'error' : ''}
                    />
                    {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date *</label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={cardData.expiryDate}
                      onChange={handleCardInputChange}
                      placeholder="MM/YY"
                      className={errors.expiryDate ? 'error' : ''}
                    />
                    {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="cvv">CVV *</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={cardData.cvv}
                      onChange={handleCardInputChange}
                      placeholder="123"
                      className={errors.cvv ? 'error' : ''}
                    />
                    {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="cardholderName">Cardholder Name *</label>
                    <input
                      type="text"
                      id="cardholderName"
                      name="cardholderName"
                      value={cardData.cardholderName}
                      onChange={handleCardInputChange}
                      placeholder="John Doe"
                      className={errors.cardholderName ? 'error' : ''}
                    />
                    {errors.cardholderName && <span className="error-message">{errors.cardholderName}</span>}
                  </div>
                </div>
              </form>
            )}
            
            <div className="payment-actions">
              {paymentMethod === 'apple' && (
                <button className="btn-primary" onClick={handleApplePay}>
                  Pay with Apple Pay
                </button>
              )}
              
              {paymentMethod === 'google' && (
                <button className="btn-primary" onClick={handleGooglePay}>
                  Pay with Google Pay
                </button>
              )}
              
              {paymentMethod === 'samsung' && (
                <button className="btn-primary" onClick={handleSamsungPay}>
                  Pay with Samsung Pay
                </button>
              )}
              
              {paymentMethod === 'card' && (
                <button className="btn-primary" onClick={handlePayment}>
                  Complete Payment
                </button>
              )}
              
              <button 
                className="btn-secondary" 
                onClick={() => navigate('/quote-summary')}
              >
                Back to Quote
              </button>
            </div>
          </div>
        </div>
        
        <div className="secure-payment-note">
          <p>🔒 Your payment information is securely encrypted and processed.</p>
        </div>
      </div>
    </div>
  );
};

export default Payment;