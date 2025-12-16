import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const FormContext = createContext();

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within FormProvider');
  }
  return context;
};

export const FormProvider = ({ children }) => {
  // Load saved data from localStorage on initial render
  const loadSavedData = () => {
    try {
      const savedData = localStorage.getItem('insuranceFormData');
      return savedData ? JSON.parse(savedData) : {
        // Driver Information
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        maritalStatus: '',
        licenseNumber: '',
        yearsLicensed: '',
        
        // Address Information
        address: '',
        city: '',
        province: '',
        postalCode: '',
        
        // Driver History
        hasPreviousClaims: '',
        numberOfClaims: '',
        claimDetails: '',
        hasViolations: '',
        violationDetails: '',
        demeritPoints: '',
        hasSuspensions: '',
        suspensionDetails: '',
        hasTickets: '',
        ticketDetails: '',
        
        // Vehicle Information
        year: '',
        make: '',
        model: '',
        vin: '',
        usage: '',
        annualKilometers: '',
        
        // Coverage Information
        liability: '1000000',
        collision: true,
        comprehensive: true,
        accidentForgiveness: false,
        
        // Contact Information
        email: '',
        phone: '',
        preferredContact: 'email',
        
        // Communication Preferences
        acceptEmailCommunications: false,
        acceptMailCommunications: false,
        acceptPhoneCommunications: false,
      };
    } catch (error) {
      console.error('Error loading saved data:', error);
      return {
        // Driver Information
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        maritalStatus: '',
        licenseNumber: '',
        yearsLicensed: '',
        
        // Address Information
        address: '',
        city: '',
        province: '',
        postalCode: '',
        
        // Driver History
        hasPreviousClaims: '',
        numberOfClaims: '',
        claimDetails: '',
        hasViolations: '',
        violationDetails: '',
        demeritPoints: '',
        hasSuspensions: '',
        suspensionDetails: '',
        hasTickets: '',
        ticketDetails: '',
        
        // Vehicle Information
        year: '',
        make: '',
        model: '',
        vin: '',
        usage: '',
        annualKilometers: '',
        
        // Coverage Information
        liability: '1000000',
        collision: true,
        comprehensive: true,
        accidentForgiveness: false,
        
        // Contact Information
        email: '',
        phone: '',
        preferredContact: 'email',
        
        // Communication Preferences
        acceptEmailCommunications: false,
        acceptMailCommunications: false,
        acceptPhoneCommunications: false,
      };
    }
  };

  const [formData, setFormData] = useState(loadSavedData());
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);

  // Auto-save form data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('insuranceFormData', JSON.stringify(formData));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, [formData]);

  // Map routes to step numbers
  useEffect(() => {
    const routeMap = {
      '/': 0,
      '/driver-info': 0,
      '/vehicle-info': 1,
      '/personal-details': 2,
      '/coverage': 3,
      '/quote-summary': 4,
      '/payment': 5
    };
    
    const step = routeMap[location.pathname] || 0;
    setCurrentStep(step);
  }, [location.pathname]);

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateMultipleFields = (fields) => {
    setFormData(prev => ({
      ...prev,
      ...fields
    }));
  };

  // Function to clear saved data
  const clearSavedData = () => {
    try {
      localStorage.removeItem('insuranceFormData');
      setFormData({
        // Driver Information
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        maritalStatus: '',
        licenseNumber: '',
        yearsLicensed: '',
        
        // Address Information
        address: '',
        city: '',
        province: '',
        postalCode: '',
        
        // Driver History
        hasPreviousClaims: '',
        numberOfClaims: '',
        claimDetails: '',
        hasViolations: '',
        violationDetails: '',
        demeritPoints: '',
        hasSuspensions: '',
        suspensionDetails: '',
        hasTickets: '',
        ticketDetails: '',
        
        // Vehicle Information
        year: '',
        make: '',
        model: '',
        vin: '',
        usage: '',
        annualKilometers: '',
        
        // Coverage Information
        liability: '1000000',
        collision: true,
        comprehensive: true,
        accidentForgiveness: false,
        
        // Contact Information
        email: '',
        phone: '',
        preferredContact: 'email',
        
        // Communication Preferences
        acceptEmailCommunications: false,
        acceptMailCommunications: false,
        acceptPhoneCommunications: false,
      });
    } catch (error) {
      console.error('Error clearing saved data:', error);
    }
  };

  return (
    <FormContext.Provider value={{
      formData,
      updateFormData,
      updateMultipleFields,
      currentStep,
      clearSavedData
    }}>
      {children}
    </FormContext.Provider>
  );
};