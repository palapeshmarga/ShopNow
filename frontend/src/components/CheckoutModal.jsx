import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck } from 'lucide-react';

function CheckoutModal({ isOpen, onClose, onPaymentSuccess, totalPrice }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate bank authorization processing delay (2 seconds)
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess(); // Trigger the backend order placement!
    }, 2000);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center',
      alignItems: 'center', zIndex: 1000, fontFamily: 'sans-serif'
    }}>
      <div style={{
        backgroundColor: '#fff', padding: '30px', borderRadius: '16px',
        width: '100%', maxWidth: '450px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
          <X size={20} />
        </button>

        <h3 style={{ margin: '0 0 5px 0', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CreditCard color="#2563eb" /> Secure Gateway Payment
        </h3>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>Your transaction is fully encrypted.</p>

        <div style={{ backgroundColor: '#f3f4f6', padding: '12px 15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500' }}>Amount to Pay:</span>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>${totalPrice}</span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#374151' }}>CARDHOLDER NAME</label>
            <input type="text" placeholder="John Doe" value={nameOnCard} onChange={(e) => setNameOnCard(e.target.value)} required style={{ width: '93%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#374151' }}>CARD NUMBER</label>
            <input type="text" placeholder="4111 2222 3333 4444" maxLength="19" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required style={{ width: '93%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#374151' }}>EXPIRY DATE</label>
              <input type="text" placeholder="MM/YY" maxLength="5" value={expiry} onChange={(e) => setExpiry(e.target.value)} required style={{ width: '87%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#374151' }}>CVV CODE</label>
              <input type="password" placeholder="123" maxLength="3" value={cvv} onChange={(e) => setCvv(e.target.value)} required style={{ width: '87%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
            </div>
          </div>

          <button type="submit" disabled={isProcessing} style={{
            backgroundColor: isProcessing ? '#9ca3af' : '#2563eb', color: 'white', border: 'none',
            padding: '14px', borderRadius: '8px', cursor: isProcessing ? 'not-allowed' : 'pointer',
            fontWeight: 'bold', fontSize: '16px', marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
          }}>
            {isProcessing ? 'Authorizing Assets...' : `Pay $${totalPrice}`}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#9ca3af', fontSize: '12px', marginTop: '15px' }}>
          <ShieldCheck size={14} /> 256-bit SSL Protection Protocol
        </div>
      </div>
    </div>
  );
}

export default CheckoutModal;