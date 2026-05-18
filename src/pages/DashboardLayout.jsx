import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout() {
  const location = useLocation();
  const { user } = useAuth();
  const isDonor = user?.role === 'DONOR';

  const linkStyle = (path) => ({
    padding: '12px 16px',
    background: location.pathname === path ? '#EFF6FF' : 'transparent',
    color: location.pathname === path ? 'var(--primary)' : 'var(--text-muted)',
    fontWeight: location.pathname === path ? 600 : 500,
    borderRadius: 'var(--radius-sm)',
    transition: 'background 0.2s',
    display: 'block'
  });

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
        {/* Sidebar */}
        <aside style={{ width: '250px', background: 'white', borderRight: '1px solid var(--border-light)', padding: '24px' }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {isDonor ? (
                  <>
                    <Link to="/dashboard/donor" style={linkStyle('/dashboard/donor')}>📰 Feed</Link>
                    <Link to="/dashboard/ngo-profile" style={linkStyle('/dashboard/ngo-profile')}>🏢 Explore NGOs</Link>
                    <Link to="/dashboard/donations" style={linkStyle('/dashboard/donations')}>📊 Donation History</Link>
                    <Link to="/dashboard/settings" style={linkStyle('/dashboard/settings')}>⚙️ Settings</Link>
                  </>
                ) : (
                  <>
                    <Link to="/dashboard" style={linkStyle('/dashboard')}>Dashboard</Link>
                    <Link to="/dashboard/ngo-profile" style={linkStyle('/dashboard/ngo-profile')}>Profile (Public)</Link>
                    <Link to="/dashboard/blog/create" style={linkStyle('/dashboard/blog/create')}>Blogs</Link>
                    <Link to="/dashboard/donations" style={linkStyle('/dashboard/donations')}>Donations</Link>
                    <Link to="/dashboard/settings" style={linkStyle('/dashboard/settings')}>Settings</Link>
                  </>
                )}
            </nav>
        </aside>
        
        {/* Main Content Area */}
        <div style={{ flex: 1, padding: '40px' }}>
            <Outlet />
        </div>
    </div>
  );
}
