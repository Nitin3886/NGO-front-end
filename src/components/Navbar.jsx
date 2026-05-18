import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EditProfileModal from './EditProfileModal';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
    <nav className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderBottom: '1px solid var(--glass-border)',
      background: 'rgba(255, 255, 255, 0.65)'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '72px' }}>
        <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
          NGO Connect
        </Link>
        <div style={{ display: 'flex', gap: '32px' }}>
          {isAuthenticated && (
            <Link to={user?.role === 'DONOR' ? '/dashboard/donor' : '/dashboard'} style={{ color: location.pathname.includes('/dashboard') ? 'var(--text-dark)' : 'var(--text-muted)', fontWeight: 500 }}>
              Dashboard
            </Link>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {isAuthenticated ? (
            <>
              {/* User Avatar + Name */}
              <div 
                className="hover-scale" 
                style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                onClick={() => setIsEditModalOpen(true)}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: user?.role === 'DONOR' ? '#DCFCE7' : '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', color: user?.role === 'DONOR' ? '#166534' : '#1E40AF' }}>
                  {user?.fullName?.charAt(0)?.toUpperCase()}
                </div>
                <div style={{ lineHeight: 1.2 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.85rem', margin: 0 }}>{user?.fullName}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>{user?.role === 'NGO_MANAGER' ? 'NGO Manager' : 'Donor'}</p>
                </div>
              </div>
              <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '6px 14px' }} onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn btn-primary">Login / Register</Link>
          )}
        </div>
      </div>
    </nav>
    <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </>
  );
}
