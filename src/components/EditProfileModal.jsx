import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function EditProfileModal({ isOpen, onClose }) {
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

  useEffect(() => {
    if (user && isOpen) {
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
  }, [user, profile, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await updateProfile(formData);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '24px'
    }}>
      <div className="card animate-fade-up" style={{
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.5rem' }}>Edit Profile</h2>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            &times;
          </button>
        </div>

        {error && <div style={{ color: '#ef4444', marginBottom: '1rem', padding: '0.75rem', background: '#fef2f2', borderRadius: 'var(--radius-sm)', border: '1px solid #fecaca', fontSize: '0.875rem' }}>{error}</div>}

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
                  rows="3"
                />
              </div>

              <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', color: 'var(--text-dark)', fontSize: '1.1rem' }}>Payment Details (UPI)</h3>
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
