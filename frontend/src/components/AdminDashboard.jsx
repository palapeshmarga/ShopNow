import React, { useState, useEffect } from 'react';
import API from '../api/client';
import { Package, User, DollarSign, Calendar, PlusCircle, List, Edit2, X } from 'lucide-react';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('orders'); // 'orders' or 'products'
  const [adminTab, setAdminTab] = useState('products'); // 'products' or 'orders'

  // Edit Tracking State
  const [editingProductId, setEditingProductId] = useState(null);

  // Form states for creating/editing a product
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('10');
  const [description, setDescription] = useState('');
  const [formMessage, setFormMessage] = useState('');

  useEffect(() => {
    // Calculate total store revenue and paid order statistics dynamically
    const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
    const paidSalesCount = orders.length;
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders');
        setOrders(data);
      } catch (error) {
        console.error("Error fetching admin orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const { data } = await API.get('/products');
        setProducts(data);
      } catch (error) {
        console.error("Error fetching admin products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchOrders();
    fetchProducts();
  }, []);

  // Triggers when clicking the Edit button on a list item
  const startEditProduct = (prod) => {
    setEditingProductId(prod._id);
    setName(prod.name);
    setPrice(prod.price);
    setImage(prod.image);
    setCategory(prod.category || '');
    setCountInStock(prod.countInStock);
    setDescription(prod.description || '');
    setFormMessage('');
  };

  const cancelEditMode = () => {
    setEditingProductId(null);
    setName('');
    setPrice('');
    setImage('');
    setCategory('');
    setCountInStock('10');
    setDescription('');
  };

  const handleMarkAsDelivered = async (orderId) => {
    try {
      const { data } = await API.put(`/orders/${orderId}/deliver`);
      // Update the local state array immediately so the UI changes instantly
      setOrders(orders.map(o => o._id === orderId ? { ...o, isDelivered: true } : o));
      alert("📦 Order status updated to Delivered/Shipped successfully!");
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update status.");
    }
  };
  
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormMessage('');

    const payload = {
      name,
      price: Number(price),
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      category: category || 'General',
      countInStock: Number(countInStock),
      description
    };

    try {
      if (editingProductId) {
        // Run UPDATE execution
        const { data } = await API.put(`/products/${editingProductId}`, payload);
        // Map updates into the current layout view array smoothly
        setProducts(products.map(p => p._id === editingProductId ? data : p));
        setFormMessage('⚡ Product updated successfully!');
        cancelEditMode();
      } else {
        // Run CREATE execution
        const { data } = await API.post('/products', payload);
        setProducts([data, ...products]);
        setFormMessage('🎉 Product added successfully!');
        cancelEditMode();
      }
    } catch (error) {
      setFormMessage('Operation failed. Check server log data configurations.');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '26px', marginBottom: '5px' }}>Admin Management Panel</h2>
      <p style={{ color: '#666', marginBottom: '25px' }}>Configure store items, change pricing, and monitor active user checkouts.</p>

      {/* Control Tabs inside Admin Panel */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>
        <button 
          onClick={() => setActiveSubTab('orders')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '6px', border: 'none',
            cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeSubTab === 'orders' ? '#3b82f6' : '#e5e7eb',
            color: activeSubTab === 'orders' ? 'white' : '#4b5563'
          }}
        >
          <List size={16} /> Incoming Checkouts ({orders.length})
        </button>
        <button 
          onClick={() => setActiveSubTab('products')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '6px', border: 'none',
            cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeSubTab === 'products' ? '#3b82f6' : '#e5e7eb',
            color: activeSubTab === 'products' ? 'white' : '#4b5563'
          }}
        >
          <PlusCircle size={16} /> Inventory Manager
        </button>
        <button 
          onClick={() => setActiveSubTab('users')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '6px', border: 'none',
            cursor: 'pointer', fontWeight: 'bold', backgroundColor: activeSubTab === 'users' ? '#3b82f6' : '#e5e7eb',
            color: activeSubTab === 'users' ? 'white' : '#4b5563'
          }}
        >
          <User size={16} /> Customer Directory
        </button>
      </div>

      {/* TAB 1: SHOW USER CHECKOUTS */}
      {activeSubTab === 'orders' && (
        <div>
          {loadingOrders ? (
            <p>Loading transaction database logs...</p>
          ) : orders.length === 0 ? (
            <p>No customer checkouts have been placed yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {orders.map((order) => (
                <div key={order._id} style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px', borderBottom: '1px solid #f3f4f6', paddingBottom: '15px' }}>
                    <div>
                      <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 'bold' }}>ORDER ID</span>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>{order._id}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 'bold' }}>CUSTOMER</span>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={14} /> {order.user?.name || 'Guest User'}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 'bold' }}>DATE</span>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 'bold' }}>TOTAL CHARGED</span>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <DollarSign size={16} />{order.totalPrice.toFixed(2)}
                      </div>
                      <div>
                      <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 'bold' }}>FULFILLMENT</span>
                      <div style={{ marginTop: '4px' }}>
                        {order.isDelivered ? (
                          <span style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                            SHIPPED
                          </span>
                        ) : (
                          <button
                            onClick={() => handleMarkAsDelivered(order._id)}
                            style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                          >
                            Mark Shipped
                          </button>
                        )}
                      </div>
                    </div>
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>ITEMS PURCHASED</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {order.orderItems.map((item, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                          <img src={item.image} alt="" style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} />
                          <span>{item.name} <strong style={{ color: '#6b7280' }}>x{item.qty}</strong></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MANAGE AND EDIT PRODUCTS */}
      {activeSubTab === 'products' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
          
          {/* Left Form Panel */}
          <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #e5e7eb', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {editingProductId && (
                  <img 
                    src="https://www.svgrepo.com/show/524802/pen.svg" 
                    alt="Edit Icon" 
                    style={{ width: '20px', height: '20px', objectFit: 'contain' }} 
                  />
                )}
                {editingProductId ? 'Modify Store Item' : 'Add New Store Item'}
              </h3>              {editingProductId && (
                <button onClick={cancelEditMode} style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                  <X size={14} /> Cancel
                </button>
              )}
            </div>
            
            {formMessage && <div style={{ padding: '10px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '6px', marginBottom: '15px', fontSize: '14px', fontWeight: '500' }}>{formMessage}</div>}
            
            <form onSubmit={handleSubmitForm} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', width: '93%' }} />
              <input type="number" step="0.01" placeholder="Price ($ USD)" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', width: '93%' }} />
              <input type="text" placeholder="Image URL link" value={image} onChange={(e) => setImage(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', width: '93%' }} />
              <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', width: '93%' }} />
              <input type="number" placeholder="Inventory Count Stock" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', width: '93%' }} />
              <textarea placeholder="Write item specification details..." value={description} onChange={(e) => setDescription(e.target.value)} rows="4" cols="50" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', width: '93%', fontFamily: 'sans-serif' }}></textarea>
              
              <button type="submit" style={{ backgroundColor: editingProductId ? '#d97706' : '#10b981', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                {editingProductId ? 'Save Modifications' : 'Publish to Live Store'}
              </button>
            </form>
          </div>

          {/* Right Live Inventory List */}
          <div>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>Active Inventory Registry ({products.length})</h3>
            {loadingProducts ? (
              <p>Loading items...</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '550px', overflowY: 'auto' }}>
                {products.map(prod => (
                  <div key={prod._id} style={{ display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <img src={prod.image} alt="" style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 2px 0', fontSize: '14px' }}>{prod.name}</h4>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>Stock: {prod.countInStock} units</span>
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#2563eb', fontSize: '15px', marginRight: '10px' }}>${prod.price.toFixed(2)}</div>
                    
                    {/* Add Edit Click Mechanism Trigger */}
                    <button 
                      onClick={() => startEditProduct(prod)}
                      style={{ border: 'none', background: '#eff6ff', padding: '6px', borderRadius: '6px', cursor: 'pointer', color: '#2563eb', display: 'flex', alignItems: 'center' }}
                      title="Edit Product Details"
                    >
                      <Edit2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
      {/* TAB 3: CUSTOMER VIEW FOR ADMIN */}
      {activeSubTab === 'users' && (
        <AdminUsers API={API} globalOrders={orders} />
      )}
    </div>
  );
}

export default AdminDashboard;