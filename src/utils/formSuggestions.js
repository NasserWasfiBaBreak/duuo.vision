// Utility functions for AI-powered form suggestions

/**
 * Generates smart suggestions for form fields based on user input
 * @param {string} fieldName - The name of the form field
 * @param {string} currentValue - The current value of the field
 * @param {object} formData - The current form data
 * @returns {Array} - Array of suggestion objects
 */
export const generateFieldSuggestions = (fieldName, currentValue, formData) => {
  const suggestions = [];
  
  switch (fieldName) {
    case 'firstName':
    case 'lastName':
      // For name fields, we might suggest common names or corrections
      if (currentValue.length > 0) {
        // This is where you would integrate with an AI service for name suggestions
        // For now, we'll provide some static examples
        suggestions.push({
          value: currentValue.charAt(0).toUpperCase() + currentValue.slice(1).toLowerCase(),
          label: 'Correct capitalization',
          confidence: 0.8
        });
      }
      break;
      
    case 'dateOfBirth':
      // For date of birth, validate format and provide suggestions
      if (currentValue && !isValidDate(currentValue)) {
        suggestions.push({
          value: formatToDate(currentValue),
          label: 'Format as MM/DD/YYYY',
          confidence: 0.9
        });
      }
      break;
      
    case 'email':
      // For email, validate format and suggest corrections
      if (currentValue && !isValidEmail(currentValue)) {
        const corrected = suggestEmailCorrection(currentValue);
        if (corrected) {
          suggestions.push({
            value: corrected,
            label: 'Did you mean?',
            confidence: 0.95
          });
        }
      }
      break;
      
    case 'phone':
      // For phone, format and validate
      if (currentValue) {
        const formatted = formatPhoneNumber(currentValue);
        if (formatted !== currentValue) {
          suggestions.push({
            value: formatted,
            label: 'Format phone number',
            confidence: 0.9
          });
        }
      }
      break;
      
    case 'address':
      // For address, we could integrate with geocoding services
      // For now, we'll just provide formatting suggestions
      if (currentValue && currentValue.length > 10) {
        suggestions.push({
          value: formatAddress(currentValue),
          label: 'Format address',
          confidence: 0.7
        });
      }
      break;
      
    case 'vin':
      // For VIN, validate format and provide suggestions
      if (currentValue) {
        const formatted = formatVIN(currentValue);
        if (formatted !== currentValue) {
          suggestions.push({
            value: formatted,
            label: 'Format VIN',
            confidence: 0.9
          });
        }
        
        if (currentValue.length === 17) {
          suggestions.push({
            value: currentValue.toUpperCase(),
            label: 'Standardize VIN',
            confidence: 0.8
          });
        }
      }
      break;
      
    default:
      // For other fields, we might use ML models to predict likely values
      // based on the current form data and user behavior
      break;
  }
  
  return suggestions;
};

/**
 * Validates if a string is a valid date
 * @param {string} dateStr - Date string to validate
 * @returns {boolean} - True if valid date
 */
const isValidDate = (dateStr) => {
  const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
  return dateRegex.test(dateStr);
};

/**
 * Attempts to format a string as a date
 * @param {string} str - String to format
 * @returns {string} - Formatted date string
 */
const formatToDate = (str) => {
  // Simple date formatting - in a real app, you'd use a more robust library
  const cleaned = str.replace(/\D/g, '');
  if (cleaned.length >= 8) {
    const month = cleaned.substring(0, 2);
    const day = cleaned.substring(2, 4);
    const year = cleaned.substring(4, 8);
    return `${month}/${day}/${year}`;
  }
  return str;
};

/**
 * Validates if a string is a valid email
 * @param {string} email - Email string to validate
 * @returns {boolean} - True if valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Suggests corrections for email addresses
 * @param {string} email - Email to correct
 * @returns {string|null} - Corrected email or null
 */
const suggestEmailCorrection = (email) => {
  // Simple email correction - in a real app, you'd use a more sophisticated approach
  const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
  const parts = email.split('@');
  
  if (parts.length === 2) {
    const domain = parts[1];
    for (const commonDomain of commonDomains) {
      if (levenshteinDistance(domain, commonDomain) <= 2) {
        return `${parts[0]}@${commonDomain}`;
      }
    }
  }
  
  return null;
};

/**
 * Calculates Levenshtein distance between two strings
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} - Distance
 */
const levenshteinDistance = (a, b) => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  
  const matrix = [];
  
  // Increment along the first column of each row
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  
  // Increment each column in the first row
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  // Fill in the rest of the matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
};

/**
 * Formats a phone number
 * @param {string} phone - Phone number to format
 * @returns {string} - Formatted phone number
 */
const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
  }
  return phone;
};

/**
 * Formats an address
 * @param {string} address - Address to format
 * @returns {string} - Formatted address
 */
const formatAddress = (address) => {
  // Simple address formatting - capitalize first letters
  return address.replace(/\b\w/g, char => char.toUpperCase());
};

/**
 * Formats a VIN number
 * @param {string} vin - VIN to format
 * @returns {string} - Formatted VIN
 */
const formatVIN = (vin) => {
  // VINs are typically uppercase and 17 characters
  return vin.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 17);
};

/**
 * Predicts form values based on partial data
 * @param {object} formData - Current form data
 * @returns {object} - Predicted values
 */
export const predictFormValues = (formData) => {
  const predictions = {};
  
  // If we have first and last name, we might predict email
  if (formData.firstName && formData.lastName) {
    const emailPrediction = `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}@example.com`;
    predictions.email = {
      value: emailPrediction,
      confidence: 0.7,
      source: 'name_based_prediction'
    };
  }
  
  // If we have date of birth, we might calculate age-related fields
  if (formData.dateOfBirth) {
    const age = calculateAge(formData.dateOfBirth);
    if (age >= 16 && age < 25) {
      predictions.yearsLicensed = {
        value: Math.max(0, age - 16),
        confidence: 0.9,
        source: 'age_based_prediction'
      };
    }
  }
  
  // If we have address info, we might predict province based on postal code
  if (formData.postalCode) {
    const province = predictProvinceFromPostal(formData.postalCode);
    if (province) {
      predictions.province = {
        value: province,
        confidence: 0.85,
        source: 'postal_code_prediction'
      };
    }
  }
  
  return predictions;
};

/**
 * Calculates age from date of birth
 * @param {string} dob - Date of birth in MM/DD/YYYY format
 * @returns {number} - Age in years
 */
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Predicts Canadian province from postal code
 * @param {string} postalCode - Canadian postal code
 * @returns {string|null} - Province abbreviation or null
 */
const predictProvinceFromPostal = (postalCode) => {
  const firstChar = postalCode.charAt(0).toUpperCase();
  
  const provinceMap = {
    'A': 'NL', // Newfoundland and Labrador
    'B': 'NS', // Nova Scotia
    'C': 'PE', // Prince Edward Island
    'E': 'NB', // New Brunswick
    'G': 'QC', // Quebec
    'H': 'QC', // Quebec
    'J': 'QC', // Quebec
    'K': 'ON', // Ontario
    'L': 'ON', // Ontario
    'M': 'ON', // Ontario
    'N': 'ON', // Ontario
    'P': 'ON', // Ontario
    'R': 'MB', // Manitoba
    'S': 'SK', // Saskatchewan
    'T': 'AB', // Alberta
    'V': 'BC', // British Columbia
    'X': 'NT', // Northwest Territories/Nunavut
    'Y': 'YT'  // Yukon
  };
  
  return provinceMap[firstChar] || null;
};