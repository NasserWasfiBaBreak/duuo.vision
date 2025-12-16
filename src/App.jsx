import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { FormProvider } from './context/FormContext';
import { useEffect } from 'react';
import Header from './components/Header';
import ConditionalProgressBar from './components/ConditionalProgressBar';
import AIAssistant from './components/AIAssistant';
import Welcome from './pages/Welcome';
import DriverInfo from './pages/DriverInfo';
import VehicleInfo from './pages/VehicleInfo';
import PersonalDetails from './pages/PersonalDetails';
import CoverageSelection from './pages/CoverageSelection';
import QuoteSummary from './pages/QuoteSummary';
import Payment from './pages/Payment';
import './App.css';

// Custom hook to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <FormProvider>
        <div className="App">
          <ScrollToTop />
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <Header />
          <ConditionalProgressBar />
          <main id="main-content">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/driver-info" element={<DriverInfo />} />
              <Route path="/vehicle-info" element={<VehicleInfo />} />
              <Route path="/personal-details" element={<PersonalDetails />} />
              <Route path="/coverage" element={<CoverageSelection />} />
              <Route path="/quote-summary" element={<QuoteSummary />} />
              <Route path="/payment" element={<Payment />} />
            </Routes>
          </main>
          <AIAssistant />
        </div>
      </FormProvider>
    </Router>
  );
}

export default App;