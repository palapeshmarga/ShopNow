import React, { useEffect, useState } from 'react';

function AdminOrders({ API }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const { data } = await API.get('/orders');
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch global ledger", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllOrders();
  }, [API]);

  // Calculate global store statistics
  const totalRevenue = orders.reduce((acc, item) => acc + (item.isPaid ? item.totalPrice : 0), 0);
  const totalSalesCount = orders.filter(o => o.isPaid).length;

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading global store ledger...</div>;

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '5px' }}>📊 Global Order Management Vault</h2>
      <p style={{ color: '#6b7280', marginBottom: '25px' }}>Welcome back, Admin. Here is the shop's real-time performance.</p>

      {/* Analytics Dashboard Grid */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={{ flex: 1, backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '20px', borderRadius: '12px' }}>
          <div style={{ textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold', color: '#1d4ed8', marginBottom: '5px' }}>Total Revenue</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e3a8a' }}>${totalRevenue.toFixed(2)}</div>
        </div>
        <div style={{ flex: 1, backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '20px', borderRadius: '12px' }}>
          <div style={{ textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold', color: '#047857', marginBottom: '5px' }}>Paid Transactions</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#064e3b' }}>{totalSalesCount} Orders</div>
        </div>
      </div>

      {/* Main Global Ledger Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <thead>
          <tr style={{ backgroundColor: '#f3f4f6', color: '#374151', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.5px' }}>
            <th style={{ padding: '15px', textAlign: 'left' }}>Customer</th>
            <th style={{ padding: '15px', textAlign: 'left' }}>Items Purchased</th>
            <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
            <th style={{ padding: '15px', textAlign: 'left' }}>Total Price</th>
            <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
              {/* Customer Name / Info */}
              <td style={{ padding: '15px' }}>
                <div style={{ fontWeight: 'bold', color: '#111827' }}>{order.user?.name || 'Unknown User'}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>{order.user?.email || 'N/A'}</div>
              </td>

              {/* Items List */}
              <td style={{ padding: '15px' }}>
                {order.orderItems.map((item, idx) => (
                  <div key={idx} style={{ fontSize: '13px', color: '#4b5563' }}>
                    • {item.name} <span style={{ color: '#9ca3af' }}>(x{item.qty})</span>
                  </div>
                ))}
              </td>

              {/* Date */}
              <td style={{ padding: '15px', color: '#4b5563', fontSize: '14px' }}>
                {new Date(order.createdAt).toLocaleDateString()}
              </td>

              {/* Price */}
              <td style={{ padding: '15px', fontWeight: 'bold', color: '#111827' }}>
                ${order.totalPrice.toFixed(2)}
              </td>

              {/* Payment Badge */}
              <td style={{ padding: '15px' }}>
                {order.isPaid ? (
                  <span style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>PAID</span>
                ) : (
                  <span style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>UNPAID</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminOrders;