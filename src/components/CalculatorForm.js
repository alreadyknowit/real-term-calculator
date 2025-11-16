import React, { useState } from 'react';
import './CalculatorForm.css';

function CalculatorForm({ onCalculate, error, inflationData }) {
  const [principalAmount, setPrincipalAmount] = useState(10000);
  const [installment, setInstallment] = useState(12);
  const [monthlyAmount, setMonthlyAmount] = useState(1000);
  const [startingDate, setStartingDate] = useState('');
  const [isStartingDateEnabled, setIsStartingDateEnabled] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if inflation data is available
    if (!inflationData || inflationData.length === 0) {
      return;
    }
    
    let finalStartingDate = startingDate;
    
    // If starting date is not enabled or empty, calculate it automatically
    if (!isStartingDateEnabled || !startingDate) {
      // Find the latest date in inflation data
      const latestDate = inflationData[0].date; // Assuming data is sorted with latest first
      const [latestMonth, latestYear] = latestDate.split('-').map(Number);
      
      // Calculate starting date: latest date - installment count
      let calculatedMonth = latestMonth - parseInt(installment) + 1;
      let calculatedYear = latestYear;
      
      while (calculatedMonth < 1) {
        calculatedMonth += 12;
        calculatedYear -= 1;
      }
      
      finalStartingDate = `${String(calculatedMonth).padStart(2, '0')}-${calculatedYear}`;
    } else {
      // Validate date format if user entered one
      const datePattern = /^\d{2}-\d{4}$/;
      if (!datePattern.test(startingDate)) {
        return;
      }
    }
    
    // Find the latest date in inflation data
    const latestDate = inflationData[0].date; // Assuming data is sorted with latest first
    const [latestMonth, latestYear] = latestDate.split('-').map(Number);
    
    // Parse starting date
    const [startMonth, startYear] = finalStartingDate.split('-').map(Number);
    
    // Calculate end date (starting date + installments)
    let endMonth = startMonth + parseInt(installment) - 1;
    let endYear = startYear;
    
    while (endMonth > 12) {
      endMonth -= 12;
      endYear += 1;
    }
    
    // Compare end date with latest available date
    const endDateValue = endYear * 12 + endMonth;
    const latestDateValue = latestYear * 12 + latestMonth;
    
    if (endDateValue > latestDateValue) {
      const endDateStr = `${String(endMonth).padStart(2, '0')}-${endYear}`;
      alert(`Uyarı: Girdiğiniz taksit planı (${endDateStr} tarihine kadar) mevcut enflasyon verisinin son tarihi (${latestDate}) sonrasına denk geliyor. Lütfen taksit sayısını azaltın veya daha erken bir başlangıç tarihi seçin.`);
      return;
    }
    
    onCalculate(parseFloat(principalAmount), parseInt(installment), parseFloat(monthlyAmount), finalStartingDate);
  };

  return (
    <div className="calculator-card">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="principalAmount"> Kredi Miktarı (TL)</label>
          <input
            type="number"
            id="principalAmount"
            value={principalAmount}
            onChange={(e) => setPrincipalAmount(e.target.value)}
            required
            min="0"
            step="0.01"
          />
          <small>Ne kadar kredi almak istiyorsunuz?</small>
        </div>

        <div className="form-group">
          <label htmlFor="installment">Taksit Sayısı</label>
          <input
            type="number"
            id="installment"
            value={installment}
            onChange={(e) => setInstallment(e.target.value)}
            required
            min="1"
          />
          <small>Kaç ay boyunca ödeme yapacaksınız?</small>
        </div>

        <div className="form-group">
          <label htmlFor="monthlyAmount">Aylık Taksit Tutarı (TL)</label>
          <input
            type="number"
            id="monthlyAmount"
            value={monthlyAmount}
            onChange={(e) => setMonthlyAmount(e.target.value)}
            required
            min="0"
            step="0.01"
          />
          <small>Kredi başvurusu sonrası bankaya ödeyeceğiniz aylık taksit tutarı</small>
        </div>

        <div className="form-group">
          <div className="checkbox-wrapper">
            <input
              type="checkbox"
              id="enableStartingDate"
              checked={isStartingDateEnabled}
              onChange={(e) => setIsStartingDateEnabled(e.target.checked)}
            />
            <label htmlFor="enableStartingDate">Başlangıç tarihini manuel olarak belirle</label>
          </div>
          <small>İşaretlenmezse, son enflasyon verisi - taksit sayısı otomatik hesaplanır</small>
        </div>

        <div className="form-group">
          <label htmlFor="startingDate">Başlangıç Tarihi</label>
          <input
            type="text"
            id="startingDate"
            value={startingDate}
            onChange={(e) => setStartingDate(e.target.value)}
            disabled={!isStartingDateEnabled}
            required={isStartingDateEnabled}
            pattern="\d{2}-\d{4}"
            placeholder="01-2010"
          />
          <small>Format: AA-YYYY (örn: 01-2010)</small>
        </div>

        <button type="submit" className="calculate-btn">
          Hesapla
        </button>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}

export default CalculatorForm;
