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
        // Başlangıç tarihini otomatik hesapla: son veri - taksit sayısı
        const latestDate = data[0].date;
        const [latestMonth, latestYear] = latestDate.split('-').map(Number);
        const installments = 12;
        let calculatedMonth = latestMonth - installments + 1;
        let calculatedYear = latestYear;
        while (calculatedMonth < 1) {
          calculatedMonth += 12;
          calculatedYear -= 1;
        }
        const autoStartDate = `${String(calculatedMonth).padStart(2, '0')}-${calculatedYear}`;
        
        const result = calculateRealValue(10000, 12, 1000, autoStartDate, data);
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
        
        {/* YouTube Video */}
        <div className="video-container" style={{ 
          margin: '20px auto',
          maxWidth: '800px',
          position: 'relative',
          paddingBottom: '56.25%',
          height: 0,
          overflow: 'hidden'
        }}>
          <iframe
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '8px'
            }}
            src="https://www.youtube.com/embed/3divucVqYhU"
            title="Enflasyon Hesaplayıcı Nasıl Kullanılır?"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
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
