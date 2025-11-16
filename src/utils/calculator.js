/**
 * Calculates the real value of installment payments adjusted for inflation
 * @param {number} principalAmount - Principal loan amount
 * @param {number} installment - Number of monthly installments
 * @param {number} monthlyAmount - Monthly installment amount
 * @param {string} startingDate - Starting date in format "MM-YYYY" (e.g., "01-2010")
 * @param {Array} inflationData - Array of inflation data objects
 * @returns {Object} Object containing detailed breakdown of real values
 */
export function calculateRealValue(principalAmount, installment, monthlyAmount, startingDate, inflationData) {
  // Create a map for quick lookup
  const inflationMap = new Map();
  inflationData.forEach(item => {
    inflationMap.set(item.date, item.monthly);
  });
  
  // Parse starting date
  const [startMonth, startYear] = startingDate.split('-').map(Number);
  
  // Use the provided monthly payment amount
  const monthlyPayment = monthlyAmount;
  
  // Calculate real value for each month
  const payments = [];
  let cumulativeRealValue = 0;
  let referenceValue = monthlyPayment; // Starting reference value
  
  for (let i = 0; i < installment; i++) {
    // Calculate current month and year
    let currentMonth = startMonth + i;
    let currentYear = startYear;
    
    while (currentMonth > 12) {
      currentMonth -= 12;
      currentYear += 1;
    }
    
    const dateKey = `${String(currentMonth).padStart(2, '0')}-${currentYear}`;
    const monthlyInflation = inflationMap.get(dateKey);
    
    if (monthlyInflation === undefined) {
      console.warn(`Warning: No inflation data found for ${dateKey}`);
    }
    
    // Calculate real value
    let realValue = monthlyPayment;
    
    if (i > 0 && monthlyInflation !== undefined) {
      // Adjust the reference value by inflation
      referenceValue = referenceValue * (1 + monthlyInflation / 100);
    }
    
    // Real value in terms of first month's purchasing power
    const realValueAdjusted = monthlyPayment / (referenceValue / monthlyPayment);
    
    cumulativeRealValue += realValueAdjusted;
    
    payments.push({
      month: i + 1,
      date: dateKey,
      nominalPayment: monthlyPayment,
      monthlyInflation: monthlyInflation !== undefined ? monthlyInflation : null,
      realValue: realValueAdjusted,
      cumulativeRealValue: cumulativeRealValue
    });
  }
  
  const totalNominalValue = monthlyPayment * installment;
  const totalRealValue = cumulativeRealValue;
  const realValueLoss = totalRealValue - principalAmount;
  const lossPercentage = ((realValueLoss / principalAmount) * 100);
  
  return {
    summary: {
      principalAmount: principalAmount,
      totalInstallments: installment,
      monthlyPayment: monthlyPayment,
      totalNominalValue: totalNominalValue,
      totalRealValue: totalRealValue,
      realValueLoss: realValueLoss,
      lossPercentage: lossPercentage
    },
    payments: payments
  };
}
