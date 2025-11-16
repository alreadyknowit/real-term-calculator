import React from 'react';
import './PaymentsTable.css';

function PaymentsTable({ payments }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="table-card">
      <h2>📅 Aylık Detaylar</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Ay</th>
              <th>Tarih</th>
              <th>Nominal Ödeme</th>
              <th>Aylık Enflasyon</th>
              <th>Reel Değer</th>
              <th>Kümülatif Reel Değer</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.month}>
                <td>{payment.month}</td>
                <td>{payment.date}</td>
                <td>{formatCurrency(payment.nominalPayment)}</td>
                <td>
                  {payment.monthlyInflation !== null 
                    ? `${payment.monthlyInflation.toFixed(2)}%` 
                    : 'N/A'}
                </td>
                <td>{formatCurrency(payment.realValue)}</td>
                <td>{formatCurrency(payment.cumulativeRealValue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaymentsTable;
