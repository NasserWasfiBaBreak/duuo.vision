// Utility functions for processing uploaded documents

/**
 * Simulates OCR processing of an image to extract text
 * @param {File} file - The image file to process
 * @returns {Promise<string>} - Extracted text from the image
 */
export const processImageOCR = async (file) => {
  // In a real implementation, this would connect to an OCR service like Tesseract.js or Google Vision API
  // For now, we'll simulate the process with a delay
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate extracted text based on file name
      if (file.name.toLowerCase().includes('license')) {
        resolve(`
          John Smith
          123456789
          123 Main Street
          Toronto, ON M5V 3A8
          1990-05-15
          Male
          Married
          Licensed since 2010
        `);
      } else if (file.name.toLowerCase().includes('registration')) {
        resolve(`
          2020 Toyota Camry
          VIN: 1234567890ABCDEFG
          Registered Owner: John Smith
          Expiry Date: 2025-06-30
        `);
      } else {
        resolve('Sample extracted text from document');
      }
    }, 2000);
  });
};

/**
 * Parses driver's license data from extracted text
 * @param {string} text - Text extracted from driver's license
 * @returns {object} - Parsed driver information
 */
export const parseDriversLicense = (text) => {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
  
  // In a real implementation, this would use more sophisticated parsing
  // For now, we'll use simple pattern matching
  
  const data = {
    firstName: '',
    lastName: '',
    licenseNumber: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    yearsLicensed: ''
  };
  
  // Simple parsing logic
  for (const line of lines) {
    if (/\d{9}/.test(line) && !data.licenseNumber) {
      data.licenseNumber = line.match(/\d{9}/)[0];
    } else if (/[A-Z][a-z]+ [A-Z][a-z]+/.test(line) && !data.firstName) {
      const nameParts = line.split(' ');
      data.firstName = nameParts[0];
      data.lastName = nameParts[1];
    } else if (/\d{4}-\d{2}-\d{2}/.test(line) && !data.dateOfBirth) {
      data.dateOfBirth = line;
    } else if (/Male|Female/i.test(line) && !data.gender) {
      data.gender = line.toLowerCase();
    } else if (/Married|Single|Divorced|Widowed/i.test(line) && !data.maritalStatus) {
      data.maritalStatus = line.toLowerCase();
    } else if (/[A-Z]\d[A-Z] \d[A-Z]\d/.test(line)) {
      // Postal code pattern
      const addressParts = line.split(',');
      if (addressParts.length >= 2) {
        data.address = addressParts[0].trim();
        const cityProv = addressParts[1].trim().split(' ');
        data.city = cityProv[0];
        data.province = cityProv[1];
        data.postalCode = cityProv[2];
      }
    } else if (/Licensed since \d{4}/.test(line)) {
      const year = line.match(/\d{4}/)[0];
      const currentYear = new Date().getFullYear();
      data.yearsLicensed = `${currentYear - parseInt(year)}+`;
    }
  }
  
  return data;
};

/**
 * Parses vehicle registration data from extracted text
 * @param {string} text - Text extracted from vehicle registration
 * @returns {object} - Parsed vehicle information
 */
export const parseVehicleRegistration = (text) => {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
  
  const data = {
    year: '',
    make: '',
    model: '',
    vin: ''
  };
  
  // Simple parsing logic
  for (const line of lines) {
    if (/(\d{4}) ([A-Z][a-z]+) ([A-Z][a-z]+)/.test(line)) {
      const matches = line.match(/(\d{4}) ([A-Z][a-z]+) ([A-Z][a-z]+)/);
      data.year = matches[1];
      data.make = matches[2];
      data.model = matches[3];
    } else if (/VIN: ([A-Z0-9]+)/.test(line)) {
      data.vin = line.match(/VIN: ([A-Z0-9]+)/)[1];
    }
  }
  
  return data;
};

/**
 * Processes an uploaded document and extracts relevant information
 * @param {File} file - The uploaded document file
 * @param {string} documentType - Type of document ('license', 'registration', etc.)
 * @returns {Promise<object>} - Extracted information
 */
export const processDocument = async (file, documentType) => {
  try {
    // Process the image to extract text
    const extractedText = await processImageOCR(file);
    
    // Parse the extracted text based on document type
    switch (documentType) {
      case 'license':
        return parseDriversLicense(extractedText);
      case 'registration':
        return parseVehicleRegistration(extractedText);
      default:
        return { rawText: extractedText };
    }
  } catch (error) {
    console.error('Error processing document:', error);
    throw new Error('Failed to process document. Please try again.');
  }
};

/**
 * Validates extracted document data
 * @param {object} data - Extracted data to validate
 * @param {string} documentType - Type of document
 * @returns {object} - Validation results
 */
export const validateDocumentData = (data, documentType) => {
  const errors = [];
  const warnings = [];
  
  switch (documentType) {
    case 'license':
      if (!data.firstName || !data.lastName) {
        errors.push('Unable to extract full name from license');
      }
      if (!data.licenseNumber) {
        errors.push('Unable to extract license number');
      }
      if (!data.dateOfBirth) {
        errors.push('Unable to extract date of birth');
      }
      if (!data.address || !data.city || !data.province || !data.postalCode) {
        warnings.push('Some address information may be incomplete');
      }
      break;
      
    case 'registration':
      if (!data.vin) {
        errors.push('Unable to extract VIN number');
      }
      if (!data.year || !data.make || !data.model) {
        errors.push('Unable to extract complete vehicle information');
      }
      break;
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};