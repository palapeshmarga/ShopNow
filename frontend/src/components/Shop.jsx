import React from 'react';

function Shop({ products, loading, onSelectProduct }) {
  return (
    <>
      <h2 style={{ fontSize: '24px', marginBottom: '24px', color: '#111827', fontFamily: 'sans-serif' }}>
        Full Shop Catalog
      </h2>
      
      {loading ? (
        <p style={{ fontFamily: 'sans-serif', color: '#6b7280' }}>Loading the latest store items...</p>
      ) : products.length === 0 ? (
        <p style={{ fontFamily: 'sans-serif', color: '#6b7280' }}>
          No products found in the database. Run your backend test endpoint to add some!
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px', fontFamily: 'sans-serif' }}>
          {products.map(product => (
            <div 
              key={product._id} 
              onClick={() => onSelectProduct(product)} 
              style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', cursor: 'pointer', maxWidth: '320px' }}
            >
              <img src={product.image} alt={product.name} style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#374151', fontWeight: 'bold' }}>{product.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                  <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>${product.price}</span>
                  <button style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                    View Item
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Shop;