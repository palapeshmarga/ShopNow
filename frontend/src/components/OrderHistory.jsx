import React, { useEffect, useState } from 'react';

function OrderHistory({ API }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const { data } = await API.get('/orders/myorders');
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch personal orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, [API]);

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading your order vault...</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '20px', color: '#1a1a1a' }}>📜 My Purchase Ledger</h2>
      
      {orders.length === 0 ? (
        <p style={{ color: '#6b7280' }}>You haven't placed any orders yet!</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6', color: '#374151', fontWeight: 'bold' }}>
              <th style={{ padding: '15px' }}>PRODUCTS</th>
              <th style={{ padding: '15px' }}>ORDER ID</th>
              <th style={{ padding: '15px' }}>DATE</th>
              <th style={{ padding: '15px' }}>TOTAL PRICE</th>
              <th style={{ padding: '15px' }}>PAYMENT STATUS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '15px', color: '#4b5563' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {order.orderItems.map((item, index) => (
                      <div key={index} style={{ fontSize: '14px' }}>
                        <span style={{ fontWeight: '600', color: '#1a1a1a' }}>{item.name}</span> 
                        <span style={{ color: '#717171', fontSize: '12px' }}> (x{item.qty})</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td style={{ padding: '15px', fontFamily: 'monospace', fontSize: '13px', color: '#4b5563' }}>{order._id}</td>
                <td style={{ padding: '15px', color: '#4b5563' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '15px', fontWeight: 'bold', color: '#111827' }}>${order.totalPrice.toFixed(2)}</td>
                <td style={{ padding: '15px' }}>
                  {order.isPaid ? (
                    <span style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                      PAID
                    </span>
                  ) : (
                    <span style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                      UNPAID
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrderHistory;