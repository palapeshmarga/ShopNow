import React, { useState, useEffect } from 'react';
import API from '../api/client';
import { User, Mail, Lock, CheckCircle } from 'lucide-react';

function UserProfile({ user, setUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Populate the fields with the current logged-in user data on load
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      const payload = { name, email };
      if (password) payload.password = password; // Only send password if they typed one

      const { data } = await API.put('/users/profile', payload);
      
      // Update our global React state and browser local storage with new info!
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      setSuccess(true);
      setMessage('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Account Settings</h2>
      <p style={{ color: '#666', marginBottom: '25px' }}>Update your personal information and security credentials.</p>

      {error && <div style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}
      {success && <div style={{ color: '#10b981', backgroundColor: '#d1fae5', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={16}/> {message}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>Full Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '95%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '95%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>New Password</label>
          <input type="password" value={password} placeholder="*******" onChange={(e) => setPassword(e.target.value)} style={{ width: '95%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>Confirm New Password</label>
          <input type="password" value={confirmPassword} placeholder="*******" onChange={(e) => setConfirmPassword(e.target.value)} style={{ width: '95%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
        </div>

        <button type="submit" style={{ backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default UserProfile;