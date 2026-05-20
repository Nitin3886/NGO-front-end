import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout() {
  const location = useLocation();
  const { user } = useAuth();
  const isDonor = user?.role === 'DONOR';
  const isAdmin = user?.role === 'ADMIN';
  const searchParams = new URLSearchParams(location.search);
  const activeAdminTab = searchParams.get('tab') || 'overview';

  const linkStyle = (path, tab) => {
    const isActive = tab
      ? location.pathname === path && activeAdminTab === tab
      : location.pathname === path && !searchParams.get('tab');
    return {
      padding: '12px 16px',
      background: isActive ? '#EFF6FF' : 'transparent',
      color: isActive ? 'var(--primary)' : 'var(--text-muted)',
      fontWeight: isActive ? 600 : 500,
      borderRadius: 'var(--radius-sm)',
      transition: 'background 0.2s',
      display: 'block'
    };
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)' }}>
        {/* Sidebar */}
        <aside style={{ width: '250px', background: 'white', borderRight: '1px solid var(--border-light)', padding: '24px' }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {isAdmin ? (
                  <>
                    <Link to="/dashboard/admin" style={linkStyle('/dashboard/admin', null)}>📊 Overview</Link>
                    <Link to="/dashboard/admin?tab=managers" style={linkStyle('/dashboard/admin', 'managers')}>🏢 NGO Managers</Link>
                    <Link to="/dashboard/admin?tab=posts" style={linkStyle('/dashboard/admin', 'posts')}>📰 All Posts</Link>
                  </>
                ) : isDonor ? (
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
