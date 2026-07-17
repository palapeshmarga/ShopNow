import React from 'react';
import { ShoppingCart, User, LogOut, ShoppingBag } from 'lucide-react';

function Navbar({ user, onAuthClick, onLogout, cartCount, setView }) {
  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '15px 30px', backgroundColor: '#ffffff', borderBottom: '2px solid #eaeaea', fontFamily: 'sans-serif'
    }}>
      {/* Brand Logo */}
      <div onClick={() => setView('home')} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '22px', fontWeight: 'bold', color: '#1a1a1a', cursor: 'pointer' }}>
        <ShoppingBag size={24} color="#3b82f6" />
        <span>ShopNow</span>
      </div>

      {/* Navigation Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '25px', fontWeight: '500', color: '#555' }}>
        <span onClick={() => setView('home')} style={{ cursor: 'pointer', color: '#3b82f6' }}>HOME</span>
        <span onClick={() => setView('shop')} style={{ cursor: 'pointer' }}>SHOP</span>
        <span onClick={() => setView('cart')} style={{ cursor: 'pointer' }}>CART</span>
        <span onClick={() => setView('orders')} style={{ cursor: 'pointer' }}>ORDERS</span>
        
        {/* Guarded Admin Button: Only shows if user is logged in AND is an admin */}
        {user && user.isAdmin && (
          <button 
            onClick={() => setView('admin')} 
            style={{ 
              backgroundColor: '#f97316', color: 'white', border: 'none', 
              padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', 
              fontWeight: 'bold', fontSize: '13px' 
            }}
          >
            Admin Panel
          </button>
        )}

      </div>

      {/* Action Icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#555' }}>
        <div onClick={() => setView('cart')} style={{ position: 'relative', cursor: 'pointer' }}>
          <ShoppingCart size={22} />
          {cartCount > 0 && (
            <span style={{
              position: 'absolute', top: '-8px', right: '-10px', backgroundColor: '#ef4444',
              color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '11px', fontWeight: 'bold'
            }}>{cartCount}</span>
          )}
        </div>
        
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* Make the greeting clickable to view profile settings! */}
            <span 
              onClick={() => setView('profile')} 
              style={{ fontWeight: '600', color: '#374151', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Hi, {user.name}
            </span>
            <LogOut size={20} onClick={onLogout} style={{ cursor: 'pointer', color: '#ef4444' }} title="Log Out" />
          </div>
        ) : (
          <User size={22} onClick={onAuthClick} style={{ cursor: 'pointer' }} title="Log In" />
        )}
      </div>
    </nav>
  );
}

export default Navbar;