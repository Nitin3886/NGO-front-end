import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isLocal ? 'http://localhost:5001/api' : (import.meta.env.VITE_API_URL || 'https://ngo-back-end.onrender.com/api');

export default function NGODashboard() {
  const navigate = useNavigate();
  const { user, profile, token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // AI Chat State
  const [chatQuery, setChatQuery] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isChatting, setIsChatting] = useState(false);

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

  const handleAIQuery = async (e) => {
    e.preventDefault();
    if (!chatQuery.trim()) return;
    
    setIsChatting(true);
    setChatResponse('');
    
    try {
      const res = await fetch(`${API_URL}/ngo/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query: chatQuery })
      });
      const data = await res.json();
      if (res.ok) {
        setChatResponse(data.answer);
      } else {
        setChatResponse('Sorry, there was an error processing your query.');
      }
    } catch (error) {
      setChatResponse('Failed to connect to the AI service.');
    } finally {
      setIsChatting(false);
    }
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
      <div className="card mb-8" style={{ background: 'linear-gradient(135deg, #FFF7ED 0%, #F0FDF4 100%)', border: '1px solid #FED7AA' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #FFEDD5, #FED7AA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: '#9A3412' }}>
            {user?.fullName?.charAt(0)?.toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0 }}>{user?.fullName}</h3>
            <p style={{ color: 'var(--text-muted)', margin: '2px 0 0', fontSize: '0.85rem' }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <span style={{ background: '#FFEDD5', color: '#9A3412', padding: '2px 10px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600 }}>NGO Manager</span>
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

      {/* AI Assistant (RAG Query) */}
      <div className="card mb-8" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899)' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <span style={{ fontSize: '1.5rem' }}>✨</span>
          <h3 style={{ margin: 0, color: '#1E293B' }}>Chat with your NGO Data</h3>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
          Ask natural language questions about your posts, donors, and engagement. (Powered by Gemini AI)
        </p>

        {/* Suggestions */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {[
            "Which of my posts has the most likes?",
            "Summarize my latest posts",
            "What is my total raised amount?",
            "How many active donors do I have?"
          ].map((suggestion, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setChatQuery(suggestion)}
              style={{
                background: 'white',
                border: '1px solid #CBD5E1',
                borderRadius: '99px',
                padding: '6px 12px',
                fontSize: '0.8rem',
                color: '#475569',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.color = '#3B82F6'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.color = '#475569'; }}
            >
              {suggestion}
            </button>
          ))}
        </div>
        
        <form onSubmit={handleAIQuery} style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <input 
            type="text" 
            className="input" 
            placeholder='e.g., "Which of my posts has the most likes?"'
            value={chatQuery}
            onChange={(e) => setChatQuery(e.target.value)}
            style={{ flex: 1, padding: '12px 16px' }}
            disabled={isChatting}
          />
          <button type="submit" className="btn btn-primary" disabled={isChatting || !chatQuery.trim()} style={{ whiteSpace: 'nowrap', padding: '0 24px', background: 'linear-gradient(135deg, #3B82F6, #6366F1)', border: 'none' }}>
            {isChatting ? 'Thinking...' : 'Ask AI'}
          </button>
        </form>

        {chatResponse && (
          <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: '0.8rem', flexShrink: 0 }}>
                AI
              </div>
              <div style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.6' }}>
                {chatResponse.split('\n').map((line, i) => (
                  <p key={i} style={{ margin: '0 0 8px 0' }}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        )}
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
