import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5001/api';

export default function NGODashboard() {
  const navigate = useNavigate();
  const { user, profile, token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/posts/mine`, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setPosts(data.posts);
    } catch (err) { console.error(err); }
    finally { setLoadingPosts(false); }
  };

  const timeAgo = (date) => {
    const s = Math.floor((Date.now() - new Date(date)) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2>Welcome back, {user?.fullName || 'Manager'}!</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '0.9rem' }}>
              {profile?.organizationName || 'Your Organization'} • {user?.email}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-primary" onClick={() => navigate('/dashboard/blog/create')}>+ New Post</button>
              <button className="btn btn-outline" onClick={() => navigate('/ngo-profile')}>View Public Profile</button>
          </div>
      </div>

      {/* Info Card */}
      <div className="card mb-8" style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%)', border: '1px solid #BFDBFE' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: '#1E40AF' }}>
            {user?.fullName?.charAt(0)?.toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0 }}>{user?.fullName}</h3>
            <p style={{ color: 'var(--text-muted)', margin: '2px 0 0', fontSize: '0.85rem' }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '2px 10px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600 }}>NGO Manager</span>
              <span style={{ background: profile?.isVerified ? '#DCFCE7' : '#FEF3C7', color: profile?.isVerified ? '#166534' : '#92400E', padding: '2px 10px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600 }}>
                {profile?.isVerified ? '✓ Verified' : 'Pending Verification'}
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Member since</p>
            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 mb-8">
          <div className="card">
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>Total Raised</p>
              <h3 style={{ fontSize: '1.75rem' }}>${(profile?.totalRaised || 0).toLocaleString()}</h3>
          </div>
          <div className="card">
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>Organization</p>
              <h3 style={{ fontSize: '1.1rem' }}>{profile?.organizationName || '—'}</h3>
          </div>
          <div className="card">
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>Published Posts</p>
              <h3 style={{ fontSize: '1.75rem' }}>{posts.length}</h3>
          </div>
      </div>

      {/* My Posts */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>📝 Your Posts</h3>
        <button className="btn btn-outline" style={{ fontSize: '0.85rem' }} onClick={() => navigate('/dashboard/blog/create')}>+ Create Post</button>
      </div>

      {loadingPosts ? (
        <div className="card text-center" style={{ padding: '40px' }}><p style={{ color: 'var(--text-muted)' }}>Loading your posts...</p></div>
      ) : posts.length === 0 ? (
        <div className="card text-center" style={{ padding: '50px' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '12px' }}>✏️</span>
          <h3 style={{ marginBottom: '8px' }}>No posts yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Share your impact stories with donors!</p>
          <button className="btn btn-primary" onClick={() => navigate('/dashboard/blog/create')}>Create Your First Post</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {posts.map((post) => (
            <div key={post._id} className="card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              {post.imageUrl && (
                <div style={{ width: '120px', height: '90px', borderRadius: '8px', overflow: 'hidden', background: '#F1F5F9', flexShrink: 0 }}>
                  <img src={post.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.parentElement.style.display = 'none'; }} />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px' }}>{post.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 8px' }}>
                  {post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content}
                </p>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>❤️ {post.likeCount || 0} likes</span>
                  <span>💬 {post.commentCount || 0} comments</span>
                  <span>🔗 {post.shares || 0} shares</span>
                  <span style={{ marginLeft: 'auto' }}>{timeAgo(post.publishedAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
