import React, { useState, useContext } from 'react'; // <-- Import useContext!
import { CartContext } from '../context/CartContext'; // <-- Import CartContext!
import { ShoppingCart, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

function ProductDetailModal({ product, onClose }) {
  const [qty, setQty] = useState(1);
  const { addToCart } = useContext(CartContext);

  // Default description if none is provided by the DB item yet
  const descriptionText = product.description || 
    "This premium item is crafted from high-quality materials, engineered for maximum durability, and styled to elevate your everyday look. Designed with absolute comfort and modern performance in mind.";

  // Check if item is in stock (assuming database uses countInStock property, defaults to true)
  const countInStock = product.countInStock !== undefined ? product.countInStock : 10;
  const isAvailable = countInStock > 0;

  const handleAddToCart = () => {
    // We will wire this function up to our real basket in the next step!
    addToCart(product, qty);
    alert(`Added ${qty} x ${product.name} to your basket!`);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
      backdropFilter: 'blur(4px)', fontFamily: 'sans-serif'
    }}>
      <div style={{
        backgroundColor: '#fff', padding: '30px', borderRadius: '16px',
        width: 'min(800px, 90vw)', maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)', position: 'relative'
      }}>
        
        {/* Back/Close Button */}
        <button onClick={onClose} style={{
          display: 'flex', alignItems: 'center', gap: '6px', background: 'none',
          border: 'none', color: '#4b5563', cursor: 'pointer', fontWeight: '600', marginBottom: '20px', padding: 0
        }}>
          <ArrowLeft size={18} /> Back to Products
        </button>

        {/* Two-Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '40px'
        }}>
          {/* Left Column: Image */}
          <div>
            <img src={product.image} alt={product.name} style={{
              width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'cover', borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }} />
          </div>

          {/* Right Column: Info & Purchase Card */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: '28px', margin: '0 0 10px 0', color: '#111827' }}>{product.name}</h1>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6', display: 'block', marginBottom: '20px' }}>
                ${product.price}
              </span>
              
              <hr style={{ border: '0', borderTop: '1px solid #e5e7eb', marginBottom: '20px' }} />
              
              <h3 style={{ fontSize: '16px', margin: '0 0 8px 0', color: '#374151' }}>Description</h3>
              <p style={{ color: '#4b5563', lineHeight: '1.6', margin: '0 0 25px 0', fontSize: '15px' }}>
                {descriptionText}
              </p>
            </div>

            {/* Purchase Action Box */}
            <div style={{
              backgroundColor: '#f3f4f6', padding: '20px', borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ color: '#4b5563', fontWeight: '500' }}>Status:</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', color: isAvailable ? '#10b981' : '#ef4444' }}>
                  {isAvailable ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  {isAvailable ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {isAvailable && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <span style={{ color: '#4b5563', fontWeight: '500' }}>Quantity:</span>
                    <select value={qty} onChange={(e) => setQty(Number(e.target.value))} style={{
                      padding: '6px 12px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#fff', fontSize: '15px', fontWeight: '600'
                    }}>
                      {[...Array(countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                      ))}
                    </select>
                  </div>

                  <button onClick={handleAddToCart} style={{
                    width: '100%', backgroundColor: '#3b82f6', color: 'white', border: 'none',
                    padding: '14px', borderRadius: '8px', cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold', fontSize: '16px'
                  }}>
                    <ShoppingCart size={18} /> Add to Basket
                  </button>
                </>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default ProductDetailModal;