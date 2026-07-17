import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, Zap } from 'lucide-react';

function Home({ products, onNavigate }) {
  // Grab just the first 3 items from inventory to show as "Hot Releases"
  const featuredProducts = products.slice(0, 3);

  return (
    <div style={{ fontFamily: 'sans-serif', color: '#111827' }}>
      
      {/* 1. HERO BANNER SECTION */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', 
        color: 'white', 
        padding: '80px 20px', 
        textAlign: 'center',
        borderRadius: '16px',
        marginBottom: '50px',
        boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.3)'
      }}>
        <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '15px', letterSpacing: '-0.5px' }}>
          Welcome to ShopNow
        </h1>
        <p style={{ fontSize: '18px', color: '#bfdbfe', maxWidth: '600px', margin: '0 auto 30px auto', lineHeight: '1.6' }}>
          Discover premium tech gear, high-performance electronics, and everyday essentials curated explicitly for your lifestyle.
        </p>
        <button 
          onClick={() => onNavigate('shop')} 
          style={{ 
            backgroundColor: '#fff', 
            color: '#2563eb', 
            border: 'none', 
            padding: '14px 28px', 
            borderRadius: '8px', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          Explore Full Catalog →
        </button>
      </div>

      {/* 2. VALUE PROPOSITION FEATURES GRID */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '25px', 
        marginBottom: '60px' 
      }}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', backgroundColor: '#eff6ff', p: '10px', padding: '10px', borderRadius: '50%', color: '#2563eb', marginBottom: '12px' }}>
            <Truck size={24} />
          </div>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '16px' }}>Express Delivery</h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: '1.4' }}>Lightning-fast logistics dispatch straight to your doorstep.</p>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', backgroundColor: '#ecfdf5', padding: '10px', borderRadius: '50%', color: '#059669', marginBottom: '12px' }}>
            <ShieldCheck size={24} />
          </div>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '16px' }}>Secure Processing</h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: '1.4' }}>Encrypted checkout systems protecting your structural asset data.</p>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', backgroundColor: '#fef3c7', padding: '10px', borderRadius: '50%', color: '#d97706', marginBottom: '12px' }}>
            <Zap size={24} />
          </div>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '16px' }}>Premium Quality</h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', lineHeight: '1.4' }}>Every product item audited for performance standards.</p>
        </div>
      </div>

      {/* 3. FEATURED PRODUCTS SPOTLIGHT */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>🔥 New & Featured Releases</h2>
          <span 
            onClick={() => onNavigate('shop')} 
            style={{ color: '#2563eb', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
          >
            See All Items
          </span>
        </div>

        {featuredProducts.length === 0 ? (
          <p style={{ color: '#6b7280' }}>Loading featured catalog items...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
            {featuredProducts.map(prod => (
              <div 
                key={prod._id} 
                style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}
              >
                <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                <div style={{ padding: '20px' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>{prod.name}</h3>
                  <p style={{ margin: '0 0 15px 0', fontSize: '13px', color: '#6b7280', height: '36px', overflow: 'hidden' }}>{prod.description || 'Premium gear ready for deployment.'}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>${prod.price.toFixed(2)}</span>
                    <button 
                      onClick={() => onNavigate('shop')}
                      style={{ backgroundColor: '#f3f4f6', border: 'none', color: '#374151', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <ShoppingBag size={14} /> View in Shop
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default Home;