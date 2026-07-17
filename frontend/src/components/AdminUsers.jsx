import React, { useState, useEffect } from 'react';
import { User, Calendar, ShoppingBag, Mail } from 'lucide-react';

function AdminUsers({ API, globalOrders }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await API.get('/users');
        setUsers(data);
      } catch (error) {
        console.error("Failed to load user registry:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [API]);

  // Helper to filter all purchases made by a specific user ID
  const getUserPurchaseHistory = (userId) => {
    return globalOrders.filter(order => order.user?._id === userId || order.user === userId);
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading registered member profiles...</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', fontFamily: 'sans-serif' }}>
      
      {/* Left Box: Total Registered User List */}
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', maxHeight: '600px', overflowY: 'auto' }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#111827' }}>👥 Registered Customer Directory</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {users.map(u => (
            <div 
              key={u._id}
              onClick={() => setSelectedUser(u)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', 
                border: selectedUser?._id === u._id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                cursor: 'pointer', backgroundColor: selectedUser?._id === u._id ? '#f0f6ff' : '#fff',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ backgroundColor: u.isAdmin ? '#fee2e2' : '#f3f4f6', p: '8px', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center' }}>
                <User size={18} color={u.isAdmin ? '#ef4444' : '#4b5563'} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#111827' }}>
                  {u.name} {u.isAdmin && <span style={{ fontSize: '10px', backgroundColor: '#fca5a5', color: '#991b1b', padding: '2px 6px', borderRadius: '4px', marginLeft: '5px' }}>ADMIN</span>}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <Mail size={12} /> {u.email}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Box: Deep Profile Ledger & Cart Purchase Tracking */}
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', minHeight: '300px' }}>
        {selectedUser ? (
          <div>
            <h3 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px', color: '#111827' }}>
              🎯 Purchase Audit: {selectedUser.name}
            </h3>
            
            <h4 style={{ fontSize: '13px', color: '#4b5563', textTransform: 'uppercase', marginBottom: '12px', marginTop: '15px' }}>
              Historical Ledger
            </h4>

            {getUserPurchaseHistory(selectedUser._id).length === 0 ? (
              <p style={{ color: '#5b5b5b', fontSize: '14px' }}>This customer hasn't checked out any orders yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '450px', overflowY: 'auto' }}>
                {getUserPurchaseHistory(selectedUser._id).map((order) => (
                  <div key={order._id} style={{ border: '1px solid #f3f4f6', backgroundColor: '#fafafa', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#414141', marginBottom: '8px' }}>
                      <span style={{ fontFamily: 'monospace' }}>ID: {order._id.substring(0, 8)}...</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {/* Maps items from this individual checkout block */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '6px' }}>
                      {order.orderItems.map((item, idx) => (
                        <div key={idx} style={{ fontSize: '13px', color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ShoppingBag size={12} color="#6b7280" />
                          <span>{item.name} <strong style={{ color: '#4b5563' }}>x{item.qty}</strong></span>
                        </div>
                      ))}
                    </div>
                    
                    <div style={{ textAlign: 'right', fontSize: '13px', fontWeight: 'bold', color: '#10b981', borderTop: '1px dashed #727273', paddingTop: '6px' }}>
                      Paid: ${order.totalPrice.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#9ca3af', fontSize: '14px', textAlign: 'center', padding: '4px' }}>
            Select a profile from the registry directory to inspect their checkout records.
          </div>
        )}
      </div>

    </div>
  );
}

export default AdminUsers;