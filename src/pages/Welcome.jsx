import { useNavigate } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/driver-info');
  };

  return (
    <div className="welcome-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Auto Insurance</h1>
            <p className="hero-subtitle">Get your quote in minutes</p>
            <p className="hero-description">
              Secure your vehicle with competitive rates from Duuo, backed by Co-operators' 80 years of insurance expertise.
            </p>
            <button className="cta-button" onClick={handleGetStarted}>
              Get Your Quote
            </button>
          </div>
          <div className="hero-image">
            <div className="placeholder-image">
              <span>Auto Insurance Graphic</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="section-title">Why Choose Duuo?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <span className="icon">⏱️</span>
              </div>
              <h3 className="feature-title">Fast & Easy</h3>
              <p className="feature-description">Complete your quote in 5 minutes or less with our streamlined process.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <span className="icon">💰</span>
              </div>
              <h3 className="feature-title">Great Rates</h3>
              <p className="feature-description">Competitive pricing backed by Co-operators' trusted reputation.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <span className="icon">🛡️</span>
              </div>
              <h3 className="feature-title">Full Protection</h3>
              <p className="feature-description">Comprehensive coverage options to keep you and your vehicle safe.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="benefits-container">
          <div className="benefits-content">
            <h2 className="section-title">Our Promise To You</h2>
            <ul className="benefits-list">
              <li className="benefit-item">✔ Accident forgiveness guarantee</li>
              <li className="benefit-item">✔ 24/7 claims support</li>
              <li className="benefit-item">✔ Flexible payment options</li>
              <li className="benefit-item">✔ No hidden fees</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Welcome;