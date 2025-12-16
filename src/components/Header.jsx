import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { clearSavedData } = useFormContext();

  const handleLogoClick = () => {
    // Clear all saved form data
    clearSavedData();
    // Navigate to the home page
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="branding">
          <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>DUUO</div>
          <div className="tagline">by cooperators</div>
        </div>
        <nav className="main-nav">
          <a href="#" className="nav-link">Insurance</a>
          <a href="#" className="nav-link">Partners</a>
          <a href="#" className="nav-link">Get Quote</a>
          <a href="#" className="nav-link login">Login</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;