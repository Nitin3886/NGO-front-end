import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user, profile, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    organizationName: '',
    missionStatement: '',
    upiId: '',
    upiQrImage: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        organizationName: profile?.organizationName || '',
        missionStatement: profile?.missionStatement || '',
        upiId: profile?.upiId || '',
        upiQrImage: profile?.upiQrImage || ''
      });
      setError(null);
    }
  }, [user, profile]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await updateProfile(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-up">
      <h1 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>Account Settings</h1>

      <div className="card" style={{ maxWidth: '600px' }}>
        {error && <div style={{ color: '#ef4444', marginBottom: '1rem', padding: '0.75rem', background: '#fef2f2', borderRadius: 'var(--radius-sm)', border: '1px solid #fecaca', fontSize: '0.875rem' }}>{error}</div>}
        {success && <div style={{ color: '#166534', marginBottom: '1rem', padding: '0.75rem', background: '#dcfce7', borderRadius: 'var(--radius-sm)', border: '1px solid #bbf7d0', fontSize: '0.875rem' }}>Profile updated successfully!</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              name="fullName" 
              value={formData.fullName} 
              onChange={handleChange} 
              className="form-input" 
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              className="form-input" 
              required
            />
          </div>

          {user?.role === 'NGO_MANAGER' && (
            <>
              <div className="form-group">
                <label className="form-label">Organization Name</label>
                <input 
                  type="text" 
                  name="organizationName" 
                  value={formData.organizationName} 
                  onChange={handleChange} 
                  className="form-input" 
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mission Statement</label>
                <textarea 
                  name="missionStatement" 
                  value={formData.missionStatement} 
                  onChange={handleChange} 
                  className="form-input" 
                  rows="4"
                />
              </div>

              <h3 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--text-dark)', fontSize: '1.25rem' }}>Payment Details (UPI)</h3>
              <div className="form-group">
                <label className="form-label">UPI ID</label>
                <input 
                  type="text" 
                  name="upiId" 
                  value={formData.upiId} 
                  onChange={handleChange} 
                  className="form-input" 
                  placeholder="e.g. ngo@okhdfcbank"
                />
              </div>
              <div className="form-group">
                <label className="form-label">UPI QR Image URL</label>
                <input 
                  type="url" 
                  name="upiQrImage" 
                  value={formData.upiQrImage} 
                  onChange={handleChange} 
                  className="form-input" 
                  placeholder="https://example.com/qr-code.png"
                />
              </div>
            </>
          )}

          <div style={{ marginTop: '32px' }}>
            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
