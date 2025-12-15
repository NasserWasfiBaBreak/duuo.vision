import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FormProvider } from './context/FormContext';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import Welcome from './pages/Welcome';
import DriverInfo from './pages/DriverInfo';
import VehicleInfo from './pages/VehicleInfo';
import PersonalDetails from './pages/PersonalDetails';
import CoverageSelection from './pages/CoverageSelection';
import QuoteSummary from './pages/QuoteSummary';
import Payment from './pages/Payment';
import './App.css';

function App() {
  return (
    <Router>
      <FormProvider>
        <div className="App">
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <Header />
          <ProgressBar />
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
        </div>
      </FormProvider>
    </Router>
  );
}

export default App;