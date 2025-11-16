import React, { useState, useEffect } from 'react';
import './App.css';
import CalculatorForm from './components/CalculatorForm';
import ResultsSummary from './components/ResultsSummary';
import PaymentsTable from './components/PaymentsTable';
import { calculateRealValue } from './utils/calculator';

function App() {
  const [inflationData, setInflationData] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load inflation data
    fetch(`${process.env.PUBLIC_URL}/inflation-data.json`)
      .then(response => response.json())
      .then(data => {
        setInflationData(data);
        console.log('Inflation data loaded successfully');
        // İlk yüklemede otomatik hesapla
        const result = calculateRealValue(10000, 12, 1000, '06-2024', data);
        setResults(result);
      })
      .catch(error => {
        console.error('Error loading inflation data:', error);
        setError('Enflasyon verileri yüklenemedi. Lütfen sayfayı yenileyin.');
      });
  }, []);

  const handleCalculate = (principalAmount, installment, term, startingDate) => {
    setError('');
    setLoading(true);

    setTimeout(() => {
      try {
        const result = calculateRealValue(principalAmount, installment, term, startingDate, inflationData);
        setResults(result);
        setLoading(false);
      } catch (err) {
        setError('Hesaplama sırasında bir hata oluştu: ' + err.message);
        setLoading(false);
      }
    }, 300);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>💰 Enflasyon Hesaplayıcı</h1>
        <p>Taksit ödemelerinizin reel değerini hesaplayın</p>
      </div>

      <CalculatorForm 
        onCalculate={handleCalculate}
        error={error}
        inflationData={inflationData}
      />

      {loading && (
        <div className="loading">
          <h3>Hesaplanıyor...</h3>
        </div>
      )}

      {results && !loading && (
        <div className="results-section">
          <ResultsSummary summary={results.summary} />
          <PaymentsTable payments={results.payments} />
        </div>
      )}
    </div>
  );
}

export default App;
