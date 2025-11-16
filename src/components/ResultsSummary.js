import React from 'react';
import './ResultsSummary.css';

function ResultsSummary({ summary }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="summary-card">
      <h2>📊 Özet</h2>
      <div className="summary-grid">
        <div className="summary-item">
          <div className="label">Taksit Sayısı</div>
          <div className="value">{summary.totalInstallments}</div>
        </div>
        <div className="summary-item">
          <div className="label">Aylık Ödeme</div>
          <div className="value">{formatCurrency(summary.monthlyPayment)}</div>
        </div>
        <div className="summary-item">
          <div className="label">Bankaya Ödenen Toplam Nominal Değer</div>
          <div className="value">{formatCurrency(summary.totalNominalValue)}</div>
        </div>
        <div className="summary-item">
          <div className="label">Bankaya Ödenen Toplam Reel Değer</div>
          <div className="value">{formatCurrency(summary.totalRealValue)}</div>
        </div>
        <div className="summary-item">
          <div className="label">Reel Değer Kaybı</div>
          <div className="value loss-indicator">{formatCurrency(summary.realValueLoss)}</div>
        </div>
        <div className="summary-item">
          <div className="label">Kayıp Yüzdesi</div>
          <div className="value loss-indicator">{summary.lossPercentage.toFixed(2)}%</div>
        </div>
      </div>

      <div className="info-section">
        <h3>💡 Basit Bir Anlatım</h3>
        
        <div className="info-item">
          <p>
            <strong>Kredi Aldınız:</strong> Diyelim ki kredi ile bir ev aldınız ve bugün elinize <strong>{formatCurrency(summary.principalAmount)}</strong> geçti.
          </p>
          <p>
            <strong>Geri Ödeme:</strong> <strong>{summary.totalInstallments} ay</strong> boyunca her ay <strong>{formatCurrency(summary.monthlyPayment)}</strong> ödüyorsunuz. 
            Toplam cebinizden <strong>{formatCurrency(summary.totalNominalValue)}</strong> çıkıyor.
          </p>
          <p>
            <strong>Bugünün Değeriyle:</strong> Ödediğiniz bu {formatCurrency(summary.totalNominalValue)} paranın, 
            krediyi çektiğiniz tarihteki satın alma gücüyle değeri <strong>{formatCurrency(summary.totalRealValue)}</strong>'dir.
          </p>
          <p>
            {summary.realValueLoss > 0 ? (
              <span>
                <strong className="highlight-negative">❌ Zarar Ettiniz:</strong> Çektiğiniz krediden daha fazla değerde para geri ödediniz. 
                Enflasyon sizin lehinize değil, bankanın lehine çalıştı. 
                Reel olarak <strong>{formatCurrency(Math.abs(summary.realValueLoss))}</strong> ({Math.abs(summary.lossPercentage).toFixed(2)}%) daha fazla ödeme yaptınız.
              </span>
            ) : (
              <span>
                <strong className="highlight-positive">✅ Kar Ettiniz:</strong> Enflasyon sayesinde, geri ödediğiniz paranın gerçek değeri 
                aldığınız krediden daha az. <strong>{formatCurrency(Math.abs(summary.realValueLoss))}</strong> ({Math.abs(summary.lossPercentage).toFixed(2)}%) kazandınız!
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResultsSummary;
