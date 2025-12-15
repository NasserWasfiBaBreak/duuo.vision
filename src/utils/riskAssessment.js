// Utility functions for risk assessment and insurance recommendations

/**
 * Calculates a risk score based on driver information
 * @param {object} driverData - Driver information
 * @returns {object} - Risk assessment results
 */
export const calculateDriverRiskScore = (driverData) => {
  let score = 0;
  const factors = [];
  
  // Age factor (younger and older drivers are higher risk)
  if (driverData.dateOfBirth) {
    const birthDate = new Date(driverData.dateOfBirth);
    const age = Math.floor((new Date() - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
    
    if (age < 25) {
      score += 20;
      factors.push({ factor: 'Young Driver', impact: 'high', description: 'Drivers under 25 are statistically higher risk' });
    } else if (age > 65) {
      score += 15;
      factors.push({ factor: 'Experienced Driver', impact: 'medium', description: 'Drivers over 65 may have slower reaction times' });
    } else {
      factors.push({ factor: 'Prime Age', impact: 'low', description: 'Drivers aged 25-65 are generally lower risk' });
    }
  }
  
  // Driving experience factor
  if (driverData.yearsLicensed) {
    const years = parseInt(driverData.yearsLicensed);
    if (years < 2) {
      score += 15;
      factors.push({ factor: 'Limited Experience', impact: 'high', description: 'New drivers have higher accident rates' });
    } else if (years < 5) {
      score += 10;
      factors.push({ factor: 'Moderate Experience', impact: 'medium', description: 'Some driving experience reduces risk' });
    } else {
      score -= 5;
      factors.push({ factor: 'Experienced Driver', impact: 'low', description: 'Extensive driving experience reduces risk' });
    }
  }
  
  // Claims history factor
  if (driverData.hasPreviousClaims === 'yes') {
    const numClaims = parseInt(driverData.numberOfClaims) || 1;
    score += numClaims * 10;
    factors.push({ factor: 'Claims History', impact: 'high', description: `Previous claims indicate higher risk (${numClaims} claim${numClaims > 1 ? 's' : ''})` });
  } else {
    score -= 5;
    factors.push({ factor: 'Clean Record', impact: 'low', description: 'No previous claims indicate lower risk' });
  }
  
  // Violations factor
  if (driverData.hasViolations === 'yes') {
    score += 15;
    factors.push({ factor: 'Traffic Violations', impact: 'high', description: 'Traffic violations indicate higher risk behavior' });
  }
  
  // Demerit points factor
  if (driverData.demeritPoints) {
    const points = parseInt(driverData.demeritPoints);
    if (points > 5) {
      score += points * 2;
      factors.push({ factor: 'Demerit Points', impact: 'high', description: `High demerit points (${points}) indicate risky driving` });
    } else if (points > 0) {
      score += points;
      factors.push({ factor: 'Demerit Points', impact: 'medium', description: `Some demerit points (${points}) indicate minor infractions` });
    }
  }
  
  // License suspensions factor
  if (driverData.hasSuspensions === 'yes') {
    score += 25;
    factors.push({ factor: 'License Suspensions', impact: 'very high', description: 'Previous suspensions indicate serious risk' });
  }
  
  // Tickets factor
  if (driverData.hasTickets === 'yes') {
    score += 10;
    factors.push({ factor: 'Traffic Tickets', impact: 'medium', description: 'Multiple tickets indicate higher risk' });
  }
  
  // Normalize score to 0-100 range
  score = Math.max(0, Math.min(100, score));
  
  // Determine risk level
  let riskLevel = 'low';
  let riskDescription = 'Low Risk';
  
  if (score >= 70) {
    riskLevel = 'high';
    riskDescription = 'High Risk';
  } else if (score >= 40) {
    riskLevel = 'medium';
    riskDescription = 'Medium Risk';
  }
  
  return {
    score,
    riskLevel,
    riskDescription,
    factors
  };
};

/**
 * Calculates vehicle risk score
 * @param {object} vehicleData - Vehicle information
 * @returns {object} - Vehicle risk assessment
 */
export const calculateVehicleRiskScore = (vehicleData) => {
  let score = 0;
  const factors = [];
  
  // Vehicle age factor
  if (vehicleData.year) {
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - parseInt(vehicleData.year);
    
    if (vehicleAge > 15) {
      score += 15;
      factors.push({ factor: 'Old Vehicle', impact: 'medium', description: `Vehicle is ${vehicleAge} years old` });
    } else if (vehicleAge > 10) {
      score += 10;
      factors.push({ factor: 'Aged Vehicle', impact: 'low', description: `Vehicle is ${vehicleAge} years old` });
    } else {
      score -= 5;
      factors.push({ factor: 'New Vehicle', impact: 'low', description: `Vehicle is ${vehicleAge} years old` });
    }
  }
  
  // Vehicle type factor (simplified)
  if (vehicleData.make && vehicleData.model) {
    const vehicleName = `${vehicleData.make} ${vehicleData.model}`.toLowerCase();
    
    if (vehicleName.includes('sports') || vehicleName.includes('mustang') || vehicleName.includes('camaro')) {
      score += 20;
      factors.push({ factor: 'Performance Vehicle', impact: 'high', description: 'Sports cars are statistically higher risk' });
    } else if (vehicleName.includes('truck') || vehicleName.includes('suv')) {
      score += 10;
      factors.push({ factor: 'Large Vehicle', impact: 'medium', description: 'Larger vehicles may have higher repair costs' });
    } else {
      factors.push({ factor: 'Standard Vehicle', impact: 'low', description: 'Standard passenger vehicle' });
    }
  }
  
  // Normalize score
  score = Math.max(0, Math.min(100, score));
  
  // Determine risk level
  let riskLevel = 'low';
  let riskDescription = 'Low Risk';
  
  if (score >= 70) {
    riskLevel = 'high';
    riskDescription = 'High Risk';
  } else if (score >= 40) {
    riskLevel = 'medium';
    riskDescription = 'Medium Risk';
  }
  
  return {
    score,
    riskLevel,
    riskDescription,
    factors
  };
};

/**
 * Generates personalized insurance recommendations
 * @param {object} driverRisk - Driver risk assessment
 * @param {object} vehicleRisk - Vehicle risk assessment
 * @returns {object} - Insurance recommendations
 */
export const generateInsuranceRecommendations = (driverRisk, vehicleRisk) => {
  const recommendations = [];
  
  // Overall risk level
  const overallRisk = Math.max(driverRisk.score, vehicleRisk.score);
  let overallRiskLevel = 'low';
  
  if (overallRisk >= 70) {
    overallRiskLevel = 'high';
  } else if (overallRisk >= 40) {
    overallRiskLevel = 'medium';
  }
  
  // Coverage recommendations
  const coverage = {
    liability: '1000000', // Default high liability
    collision: true,
    comprehensive: true,
    accidentForgiveness: false
  };
  
  // Adjust recommendations based on risk
  if (overallRiskLevel === 'high') {
    coverage.accidentForgiveness = true;
    recommendations.push({
      type: 'coverage',
      priority: 'high',
      title: 'Accident Forgiveness Recommended',
      description: 'Given your risk profile, accident forgiveness can protect your rates after your first at-fault accident.',
      benefit: 'Protects your premium from rate increases after first accident'
    });
    
    recommendations.push({
      type: 'discount',
      priority: 'medium',
      title: 'Safe Driver Course Discount',
      description: 'Consider taking a defensive driving course to reduce your premiums.',
      benefit: 'Up to 10% discount on your premium'
    });
  } else if (overallRiskLevel === 'medium') {
    recommendations.push({
      type: 'discount',
      priority: 'medium',
      title: 'Loyalty Discount',
      description: 'Stay with us for multiple policies to receive loyalty discounts.',
      benefit: 'Up to 15% discount for multiple policies'
    });
  } else {
    coverage.liability = '2000000'; // Higher liability for low-risk drivers
    recommendations.push({
      type: 'coverage',
      priority: 'low',
      title: 'Higher Liability Coverage',
      description: 'As a low-risk driver, consider increasing your liability coverage.',
      benefit: 'Better protection in case of major accidents'
    });
    
    recommendations.push({
      type: 'discount',
      priority: 'high',
      title: 'Paperless Billing Discount',
      description: 'Switch to paperless billing to save money and help the environment.',
      benefit: '5% discount on your premium'
    });
  }
  
  // Specific recommendations based on factors
  driverRisk.factors.forEach(factor => {
    if (factor.impact === 'high') {
      recommendations.push({
        type: 'improvement',
        priority: 'high',
        title: `Improve Your ${factor.factor}`,
        description: factor.description,
        benefit: 'Reducing risk factors can lower your insurance costs'
      });
    }
  });
  
  vehicleRisk.factors.forEach(factor => {
    if (factor.impact === 'high') {
      recommendations.push({
        type: 'improvement',
        priority: 'medium',
        title: `Vehicle ${factor.factor}`,
        description: factor.description,
        benefit: 'Safer vehicles or driving habits can reduce your premiums'
      });
    }
  });
  
  return {
    coverage,
    recommendations
  };
};

/**
 * Estimates premium based on risk scores
 * @param {number} driverRiskScore - Driver risk score (0-100)
 * @param {number} vehicleRiskScore - Vehicle risk score (0-100)
 * @param {object} coverage - Selected coverage options
 * @returns {object} - Premium estimate
 */
export const estimatePremium = (driverRiskScore, vehicleRiskScore, coverage) => {
  // Base premium
  let basePremium = 1200; // Base annual premium
  
  // Adjust for driver risk
  const driverMultiplier = 1 + (driverRiskScore / 100) * 2; // Up to 3x for highest risk
  basePremium *= driverMultiplier;
  
  // Adjust for vehicle risk
  const vehicleMultiplier = 1 + (vehicleRiskScore / 100) * 1.5; // Up to 2.5x for highest risk
  basePremium *= vehicleMultiplier;
  
  // Adjust for coverage
  if (coverage.collision) basePremium *= 1.2;
  if (coverage.comprehensive) basePremium *= 1.15;
  if (coverage.accidentForgiveness) basePremium *= 1.1;
  
  // Convert to monthly
  const annualPremium = Math.round(basePremium);
  const monthlyPremium = Math.round(annualPremium / 12);
  
  return {
    monthly: monthlyPremium,
    annual: annualPremium,
    breakdown: {
      base: 1200,
      driverRiskAdjustment: Math.round(1200 * (driverMultiplier - 1)),
      vehicleRiskAdjustment: Math.round(1200 * driverMultiplier * (vehicleMultiplier - 1)),
      coverageAdjustments: Math.round(1200 * driverMultiplier * vehicleMultiplier * 
        ((coverage.collision ? 0.2 : 0) + 
         (coverage.comprehensive ? 0.15 : 0) + 
         (coverage.accidentForgiveness ? 0.1 : 0)))
    }
  };
};