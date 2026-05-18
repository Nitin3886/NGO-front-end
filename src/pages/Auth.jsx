import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const navigate = useNavigate();
  const { register, login, user, loading: authLoading } = useAuth();
  const [isRegister, setIsRegister] = useState(true);
  const [role, setRole] = useState('NGO_MANAGER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      navigate(user.role === 'DONOR' ? '/dashboard/donor' : '/dashboard');
    }
  }, [user, authLoading, navigate]);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [missionStatement, setMissionStatement] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        // Validate
        if (!fullName || !email || !password) {
          throw new Error('Please fill in all required fields.');
        }
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }

        await register({ fullName, email, password, role, organizationName, missionStatement });
        navigate(role === 'DONOR' ? '/dashboard/donor' : '/dashboard');
      } else {
        // Login
        if (!email || !password) {
          throw new Error('Please enter your email and password.');
        }
        const data = await login({ email, password });
        navigate(data.user.role === 'DONOR' ? '/dashboard/donor' : '/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0' }}>
      <div className="card glass text-center animate-fade-up" style={{ width: '100%', maxWidth: '480px', padding: '48px', borderRadius: 'var(--radius-lg)', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', border: '1px solid var(--glass-border)' }}>
        
        {/* Logo */}
        <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', borderRadius: '16px', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(37,99,235,0.08)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
            </svg>
        </div>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.02em' }}>NGO Connect</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '40px', fontSize: '1rem', fontWeight: 500 }}>Join the ecosystem of impact.</p>

        {/* Segmented Control */}
        <div style={{ background: '#F1F5F9', borderRadius: '8px', padding: '4px', display: 'flex', marginBottom: '32px' }}>
            <button type="button"
              onClick={() => { setIsRegister(true); setError(''); }}
              style={{ flex: 1, padding: '10px', background: isRegister ? 'white' : 'transparent', border: isRegister ? '1px solid #E2E8F0' : 'none', borderRadius: '6px', fontWeight: isRegister ? 600 : 500, color: isRegister ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', boxShadow: isRegister ? '0 1px 3px rgba(0,0,0,0.04)' : 'none' }}>
              Register
            </button>
            <button type="button"
              onClick={() => { setIsRegister(false); setError(''); }}
              style={{ flex: 1, padding: '10px', background: !isRegister ? 'white' : 'transparent', border: !isRegister ? '1px solid #E2E8F0' : 'none', borderRadius: '6px', fontWeight: !isRegister ? 600 : 500, color: !isRegister ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', boxShadow: !isRegister ? '0 1px 3px rgba(0,0,0,0.04)' : 'none' }}>
              Login
            </button>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px', textAlign: 'left' }}>
            <p style={{ color: '#DC2626', fontSize: '0.85rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <span style={{ display: 'inline-flex', width: '18px', height: '18px', background: '#DC2626', color: 'white', borderRadius: '50%', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', flexShrink: 0 }}>!</span>
              {error}
            </p>
          </div>
        )}

        {/* Role Section */}
        {isRegister && (
          <div style={{ textAlign: 'left', marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>I AM JOINING AS</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button"
                    onClick={() => setRole('NGO_MANAGER')}
                    style={{ flex: 1, padding: '14px 12px', background: role === 'NGO_MANAGER' ? 'white' : '#E2E8F0', border: role === 'NGO_MANAGER' ? '2px solid var(--primary)' : '2px solid transparent', borderRadius: '12px', fontWeight: role === 'NGO_MANAGER' ? 600 : 500, color: role === 'NGO_MANAGER' ? 'var(--primary)' : 'var(--text-dark)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: role === 'NGO_MANAGER' ? 1 : 0.8, transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', transform: role === 'NGO_MANAGER' ? 'scale(1.02)' : 'scale(1)', boxShadow: role === 'NGO_MANAGER' ? '0 4px 12px rgba(37,99,235,0.15)' : 'none' }}>
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 21h18M5 21V7l8-4v18M13 21V3l8 4v14M8 11h.01M8 15h.01M16 11h.01M16 15h.01"></path></svg>
                      NGO Manager
                  </button>
                  <button type="button"
                    onClick={() => setRole('DONOR')}
                    style={{ flex: 1, padding: '14px 12px', background: role === 'DONOR' ? 'white' : '#E2E8F0', border: role === 'DONOR' ? '2px solid var(--primary)' : '2px solid transparent', borderRadius: '12px', fontWeight: role === 'DONOR' ? 600 : 500, color: role === 'DONOR' ? 'var(--primary)' : 'var(--text-dark)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: role === 'DONOR' ? 1 : 0.8, transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', transform: role === 'DONOR' ? 'scale(1.02)' : 'scale(1)', boxShadow: role === 'DONOR' ? '0 4px 12px rgba(34,197,94,0.15)' : 'none' }}>
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
                      Donor
                  </button>
              </div>
          </div>
        )}

        <form style={{ textAlign: 'left' }} onSubmit={handleSubmit}>
            {isRegister && (
              <div className="form-group mb-4">
                  <label className="form-label" style={{ fontSize: '0.85rem' }}>Full Name</label>
                  <input type="text" className="form-input" placeholder="Alex Morgan" value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ background: '#F8FAFC', borderRadius: '8px' }} required />
              </div>
            )}

            {/* NGO-specific fields */}
            {isRegister && role === 'NGO_MANAGER' && (
              <>
                <div className="form-group mb-4">
                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Organization Name</label>
                    <input type="text" className="form-input" placeholder="Green Canopy Foundation" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} style={{ background: '#F8FAFC', borderRadius: '8px' }} />
                </div>
                <div className="form-group mb-4">
                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Mission Statement</label>
                    <input type="text" className="form-input" placeholder="Making the world a better place." value={missionStatement} onChange={(e) => setMissionStatement(e.target.value)} style={{ background: '#F8FAFC', borderRadius: '8px' }} />
                </div>
              </>
            )}
            
            <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ fontSize: '0.85rem' }}>Email Address</label>
                <input type="email" className="form-input" placeholder="alex@impact.org" value={email} onChange={(e) => setEmail(e.target.value)} style={{ background: '#F8FAFC', borderRadius: '8px' }} required />
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <div className="form-group" style={{ flex: 1, margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Password</label>
                    <input type="password" className="form-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ background: '#F8FAFC', borderRadius: '8px' }} required />
                </div>
                {isRegister && (
                  <div className="form-group" style={{ flex: 1, margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.85rem' }}>Confirm</label>
                      <input type="password" className="form-input" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ background: '#F8FAFC', borderRadius: '8px' }} required />
                  </div>
                )}
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ padding: '16px', fontSize: '1rem', fontWeight: 600, borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Please wait...' : (isRegister ? 'Create Account' : 'Sign In')}
                {!loading && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
            </button>
        </form>

        <p style={{ marginTop: '32px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {isRegister ? 'Already part of the movement?' : 'Want to join us?'}{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); setIsRegister(!isRegister); setError(''); }} style={{ fontWeight: 700, color: 'var(--primary)' }}>
              {isRegister ? 'Sign In' : 'Register'}
            </a>
        </p>
      </div>
    </div>
  );
}
