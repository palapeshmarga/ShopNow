import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import ProductDetailModal from './components/ProductDetailModal';
import API from './api/client';
import { CartProvider, CartContext } from './context/CartContext';
import { ShoppingCart, Trash2 } from 'lucide-react';
import AdminDashboard from './components/AdminDashboard';
import UserProfile from './components/UserProfile';
import CheckoutModal from './components/CheckoutModal';
import OrderHistory from './components/OrderHistory';
import Home from './components/Home';
import Shop from './components/Shop';

function App() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [view, setView] = useState('home'); // Tracks views: 'home', 'cart', or 'admin'
  const { cartItems, removeFromCart } = useContext(CartContext);
  

  // 1. Triggers when clicking "Proceed to Checkout" in the basket view
  const handleOpenCheckout = () => {
    if (!user) {
      alert("Please log in to complete your checkout purchase!");
      setShowAuth(true); 
      return;
    }
    setShowCheckout(true); // Open the checkout modal card window!
  };

  // 2. Triggers after the 2-second bank simulation finishes inside the checkout modal
  const handlePaymentSuccessExecution = async () => {
    try {
      // Map the cart items so the backend receives the exact field names it expects
      const formattedOrderItems = cartItems.map(item => ({
        name: item.name,
        qty: Number(item.qty),
        image: item.image,
        price: Number(item.price),
        product: item._id // <-- This maps your item ID to the "product" path the backend requires!
      }));

      const orderData = {
        orderItems: formattedOrderItems,
        totalPrice: Number(totalPrice),
        isPaid: true,
        paidAt: new Date().toISOString()
      };

      const { data } = await API.post('/orders', orderData);
      
      alert(`🎉 Payment Approved! Order ID: ${data._id}`);
      localStorage.removeItem('cartItems'); 
      setShowCheckout(false);
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Order registration failed. Check your backend console!");
    }
  };


  useEffect(() => {
    const savedUser = localStorage.getItem('userInfo');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get('/products');
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out of your account?");
    if (confirmLogout) {
      localStorage.removeItem('userInfo');
      setUser(null);
    }
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);

  // Helper function to handle rendering the current view dynamically
  const renderMainContent = () => {
    if (view === 'home') {
      return <Home products={products} onNavigate={setView} />;
    } 
    
    else if (view === 'shop') {
      // Clean and simple component call!
      return (
        <Shop 
          products={products} 
          loading={loading} 
          onSelectProduct={setSelectedProduct} 
        />
      );
    } 
    
    else if (view === 'cart') {
      return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '26px', marginBottom: '24px' }}>Your Shopping Basket</h2>
          {cartItems.length === 0 ? (
            <p>Your basket is empty. Head back to the store to add some products!</p>
          ) : (
            <div>
              {cartItems.map(item => (
                <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: '#fff', padding: '15px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '15px' }}>
                  <img src={item.image} alt={item.name} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px' }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 5px 0' }}>{item.name}</h4>
                    <p style={{ margin: 0, color: '#666' }}>${item.price} x {item.qty}</p>
                  </div>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>${(item.price * item.qty).toFixed(2)}</div>
                  <Trash2 size={20} color="#ef4444" onClick={() => removeFromCart(item._id)} style={{ cursor: 'pointer' }} />
                </div>
              ))}
              
              <div style={{ marginTop: '30px', borderTop: '2px solid #e5e7eb', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Total Cost:</span>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>${totalPrice}</span>
              </div>
              
              <button
                onClick={handleOpenCheckout}
                style={{ width: '100%', backgroundColor: '#10b981', color: 'white', border: 'none', padding: '15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px', marginTop: '20px' }}>
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      );
    } else if (view === 'admin') {
      return <AdminDashboard />;
    } else if (view === 'profile') {
      return <UserProfile user={user} setUser={setUser} />;
    } else if (view === 'orders') {
      if (!user) {
        setShowAuth(true);
        setView('home');
        return <Shop products={products} loading={loading} onSelectProduct={setSelectedProduct} />;
      }
      return <OrderHistory API={API} />;
    }
  };


  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', margin: 0, padding: 0, fontFamily: 'sans-serif' }}>
      <Navbar 
        user={user} 
        onAuthClick={() => setShowAuth(true)} 
        onLogout={handleLogout} 
        cartCount={totalItems}
        setView={setView}
      />
      
      <main style={{ padding: '40px max(4vw, 20px)' }}>
        {renderMainContent()}
      </main>

      {showAuth && <AuthModal setUser={setUser} onClose={() => setShowAuth(false)} />}
      {selectedProduct && <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
        <CheckoutModal 
        isOpen={showCheckout} 
        onClose={() => setShowCheckout(false)} 
        onPaymentSuccess={handlePaymentSuccessExecution} 
        totalPrice={totalPrice}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
);