import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function DonorDashboard() {
  const { user, profile, token } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [activeTab, setActiveTab] = useState('feed'); // feed | experiences
  
  // Comment states
  const [openComments, setOpenComments] = useState({}); // { postId: true/false }
  const [commentTexts, setCommentTexts] = useState({}); // { postId: 'text' }
  const [postComments, setPostComments] = useState({}); // { postId: [comments] }
  const [loadingComments, setLoadingComments] = useState({});

  // Experience form
  const [expForm, setExpForm] = useState({ ngoName: '', rating: 5, text: '' });
  const [expLoading, setExpLoading] = useState(false);
  const [allNGOs, setAllNGOs] = useState([]);
  const [ngoSuggestions, setNgoSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Donate Modal
  const [selectedDonateNgo, setSelectedDonateNgo] = useState(null);

  useEffect(() => {
    fetchFeed();
    fetchExperiences();
    fetchAllNGOs();
  }, []);

  const fetchAllNGOs = async () => {
    try {
      const res = await fetch(`${API_URL}/ngos`);
      const data = await res.json();
      if (res.ok) setAllNGOs(data.ngos || []);
    } catch (err) { console.error('Failed to fetch NGOs:', err); }
  };

  const headers = () => token ? { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } : { 'Content-Type': 'application/json' };

  const fetchFeed = async () => {
    try {
      const res = await fetch(`${API_URL}/posts`, { headers: token ? { 'Authorization': `Bearer ${token}` } : {} });
      const data = await res.json();
      if (res.ok) setPosts(data.posts);
    } catch (err) { console.error(err); }
    finally { setLoadingPosts(false); }
  };

  const fetchExperiences = async () => {
    try {
      const res = await fetch(`${API_URL}/experiences`);
      const data = await res.json();
      if (res.ok) setExperiences(data.experiences);
    } catch (err) { console.error(err); }
  };

  const handleLike = async (postId) => {
    if (!token) { navigate('/auth'); return; }
    try {
      const res = await fetch(`${API_URL}/posts/${postId}/like`, { method: 'PATCH', headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) {
        setPosts(prev => prev.map(p => p._id === postId ? { ...p, likeCount: data.likeCount, isLiked: data.isLiked } : p));
      }
    } catch (err) { console.error(err); }
  };

  const handleShare = async (postId) => {
    try {
      const res = await fetch(`${API_URL}/posts/${postId}/share`, { method: 'PATCH' });
      const data = await res.json();
      if (res.ok) {
        setPosts(prev => prev.map(p => p._id === postId ? { ...p, shares: data.shares } : p));
        alert('Post shared! 🔗');
      }
    } catch (err) { console.error(err); }
  };

  const toggleComments = async (postId) => {
    const isOpen = openComments[postId];
    setOpenComments(prev => ({ ...prev, [postId]: !isOpen }));
    if (!isOpen && !postComments[postId]) {
      setLoadingComments(prev => ({ ...prev, [postId]: true }));
      try {
        const res = await fetch(`${API_URL}/posts/${postId}/comments`);
        const data = await res.json();
        if (res.ok) setPostComments(prev => ({ ...prev, [postId]: data.comments }));
      } catch (err) { console.error(err); }
      finally { setLoadingComments(prev => ({ ...prev, [postId]: false })); }
    }
  };

  const addComment = async (postId) => {
    const text = commentTexts[postId]?.trim();
    if (!text || !token) return;
    try {
      const res = await fetch(`${API_URL}/posts/${postId}/comments`, {
        method: 'POST', headers: headers(), body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (res.ok) {
        setPostComments(prev => ({ ...prev, [postId]: [data.comment, ...(prev[postId] || [])] }));
        setCommentTexts(prev => ({ ...prev, [postId]: '' }));
        setPosts(prev => prev.map(p => p._id === postId ? { ...p, commentCount: (p.commentCount || 0) + 1 } : p));
      }
    } catch (err) { console.error(err); }
  };

  const submitExperience = async () => {
    if (!expForm.ngoName || !expForm.text) return;
    setExpLoading(true);
    try {
      const res = await fetch(`${API_URL}/experiences`, {
        method: 'POST', headers: headers(), body: JSON.stringify(expForm)
      });
      const data = await res.json();
      if (res.ok) {
        setExperiences(prev => [data.experience, ...prev]);
        setExpForm({ ngoName: '', rating: 5, text: '' });
      }
    } catch (err) { console.error(err); }
    finally { setExpLoading(false); }
  };

  const handleNgoNameChange = (val) => {
    setExpForm(prev => ({ ...prev, ngoName: val }));
    if (val.trim()) {
      const filtered = allNGOs.filter(n => 
        n.organizationName.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 5);
      setNgoSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setNgoSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectNgo = (name) => {
    setExpForm(prev => ({ ...prev, ngoName: name }));
    setShowSuggestions(false);
  };

  const timeAgo = (date) => {
    const s = Math.floor((Date.now() - new Date(date)) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  };

  const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

  return (
    <div className="container mt-12 mb-12">
      <div className="grid" style={{ gridTemplateColumns: '280px 1fr', gap: '32px' }}>
        
        {/* LEFT SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card text-center" style={{ alignSelf: 'start' }}>
              <div style={{ width: '90px', height: '90px', background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)', borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', fontWeight: 700, color: '#166534' }}>
                {user?.fullName?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <h3 style={{ marginBottom: '4px' }}>{user?.fullName || 'Donor'}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>{user?.email}</p>
              <span style={{ background: '#DCFCE7', color: '#166534', padding: '3px 12px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 600, display: 'inline-block', marginBottom: '12px' }}>Donor</span>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '20px' }}>
                Since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}
              </p>
          </div>
          <div className="card">
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>Total Donated</p>
              <h3>${(profile?.totalDonated || 0).toLocaleString()}</h3>
          </div>
          <div className="card">
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>NGOs Supported</p>
              <h3>{profile?.savedNGOs?.length || 0}</h3>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div>
          {/* Tab Bar */}
          <div style={{ display: 'flex', gap: '0', marginBottom: '24px', background: '#F1F5F9', borderRadius: '10px', padding: '4px' }}>
            <button onClick={() => setActiveTab('feed')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: activeTab === 'feed' ? 600 : 500, background: activeTab === 'feed' ? 'white' : 'transparent', color: activeTab === 'feed' ? 'var(--primary)' : 'var(--text-muted)', boxShadow: activeTab === 'feed' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none' }}>
              📰 NGO Feed
            </button>
            <button onClick={() => setActiveTab('experiences')} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: activeTab === 'experiences' ? 600 : 500, background: activeTab === 'experiences' ? 'white' : 'transparent', color: activeTab === 'experiences' ? 'var(--primary)' : 'var(--text-muted)', boxShadow: activeTab === 'experiences' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none' }}>
              ✍️ Donor Experiences
            </button>
          </div>

          {/* ===== FEED TAB ===== */}
          {activeTab === 'feed' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>{posts.length} {posts.length === 1 ? 'post' : 'posts'} from NGOs</p>
              </div>

              {loadingPosts ? (
                <div className="card text-center" style={{ padding: '60px' }}><p style={{ color: 'var(--text-muted)' }}>Loading feed...</p></div>
              ) : posts.length === 0 ? (
                <div className="card text-center" style={{ padding: '60px' }}>
                  <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>📭</span>
                  <h3 style={{ marginBottom: '8px' }}>No posts yet</h3>
                  <p style={{ color: 'var(--text-muted)' }}>NGOs haven't published any stories yet. Check back soon!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {posts.map((post) => (
                    <div key={post._id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                      
                      {/* Post Header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: '1px solid var(--border-light)' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', color: '#1E40AF' }}>
                          {post.ngoId?.organizationName?.charAt(0)?.toUpperCase() || 'N'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>
                            {post.ngoId?.organizationName || 'Unknown NGO'}
                            {post.ngoId?.isVerified && <span style={{ marginLeft: '6px', color: '#2563EB', fontSize: '0.85rem' }} title="Verified">✓</span>}
                          </p>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>
                            {post.authorId?.fullName} • {timeAgo(post.publishedAt)}
                          </p>
                        </div>
                        <button className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '6px 16px', borderRadius: '8px' }} onClick={() => setSelectedDonateNgo(post.ngoId)}>
                          💰 Donate
                        </button>
                      </div>

                      {/* Post Image */}
                      {post.imageUrl && (
                        <div style={{ width: '100%', maxHeight: '450px', overflow: 'hidden', background: '#F1F5F9' }}>
                          <img src={post.imageUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                        </div>
                      )}

                      {/* Post Body */}
                      <div style={{ padding: '20px' }}>
                        <h3 style={{ marginBottom: '8px', fontSize: '1.1rem' }}>{post.title}</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.9rem', marginBottom: '16px' }}>
                          {post.content.length > 300 ? post.content.substring(0, 300) + '...' : post.content}
                        </p>
                        
                        {/* Action Bar */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                          <button onClick={() => handleLike(post._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: post.isLiked ? '#EF4444' : 'var(--text-muted)', fontWeight: 500, fontSize: '0.9rem' }}>
                            {post.isLiked ? '❤️' : '🤍'} {post.likeCount || 0}
                          </button>
                          <button onClick={() => toggleComments(post._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.9rem' }}>
                            💬 {post.commentCount || 0}
                          </button>
                          <button onClick={() => handleShare(post._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.9rem' }}>
                            🔗 {post.shares || 0}
                          </button>
                        </div>

                        {/* Comments Section */}
                        {openComments[post._id] && (
                          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                            {/* Add Comment */}
                            {token && (
                              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#166534', flexShrink: 0 }}>
                                  {user?.fullName?.charAt(0)?.toUpperCase()}
                                </div>
                                <input type="text" className="form-input" placeholder="Write a comment..." value={commentTexts[post._id] || ''} onChange={(e) => setCommentTexts(prev => ({ ...prev, [post._id]: e.target.value }))} onKeyDown={(e) => e.key === 'Enter' && addComment(post._id)} style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', borderRadius: '20px', background: '#F8FAFC' }} />
                                <button className="btn btn-primary" style={{ borderRadius: '20px', padding: '8px 16px', fontSize: '0.8rem' }} onClick={() => addComment(post._id)}>Post</button>
                              </div>
                            )}

                            {/* Comments List */}
                            {loadingComments[post._id] ? (
                              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading comments...</p>
                            ) : (postComments[post._id] || []).length === 0 ? (
                              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No comments yet. Be the first!</p>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {(postComments[post._id] || []).map((c) => (
                                  <div key={c._id} style={{ display: 'flex', gap: '10px' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: c.userId?.role === 'DONOR' ? '#DCFCE7' : '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: c.userId?.role === 'DONOR' ? '#166534' : '#1E40AF', flexShrink: 0 }}>
                                      {c.userId?.fullName?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div style={{ background: '#F8FAFC', padding: '8px 14px', borderRadius: '12px', flex: 1 }}>
                                      <p style={{ fontWeight: 600, fontSize: '0.8rem', margin: 0 }}>
                                        {c.userId?.fullName}
                                        <span style={{ fontWeight: 400, color: 'var(--text-muted)', marginLeft: '8px', fontSize: '0.7rem' }}>{timeAgo(c.createdAt)}</span>
                                      </p>
                                      <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-dark)' }}>{c.text}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ===== EXPERIENCES TAB ===== */}
          {activeTab === 'experiences' && (
            <>
              {/* Post Experience Form */}
              <div className="card mb-8" style={{ border: '2px solid var(--primary)', background: 'linear-gradient(to bottom, #ffffff, #F8FAFC)' }}>
                <h4 style={{ marginBottom: '16px' }}>✍️ Share Your Experience with an NGO</h4>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', position: 'relative' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>NGO Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Green Canopy" 
                      value={expForm.ngoName} 
                      onChange={(e) => handleNgoNameChange(e.target.value)}
                      onFocus={() => expForm.ngoName.trim() && setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      style={{ background: '#F8FAFC', borderRadius: '8px' }} 
                    />
                    
                    {/* Suggestions Dropdown */}
                    {showSuggestions && ngoSuggestions.length > 0 && (
                      <div className="glass" style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        zIndex: 100,
                        marginTop: '4px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                        border: '1px solid var(--border-light)'
                      }}>
                        {ngoSuggestions.map((ngo) => (
                          <div 
                            key={ngo._id}
                            onClick={() => selectNgo(ngo.organizationName)}
                            style={{
                              padding: '10px 16px',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              background: 'rgba(255, 255, 255, 0.8)'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#EFF6FF'}
                            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.8)'}
                          >
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.65rem', color: '#1E40AF' }}>
                              {ngo.organizationName.charAt(0).toUpperCase()}
                            </div>
                            <span>{ngo.organizationName}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ width: '120px' }}>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Rating</label>
                    <select className="form-input" value={expForm.rating} onChange={(e) => setExpForm(p => ({ ...p, rating: Number(e.target.value) }))} style={{ background: '#F8FAFC', borderRadius: '8px' }}>
                      <option value={5}>⭐⭐⭐⭐⭐</option>
                      <option value={4}>⭐⭐⭐⭐</option>
                      <option value={3}>⭐⭐⭐</option>
                      <option value={2}>⭐⭐</option>
                      <option value={1}>⭐</option>
                    </select>
                  </div>
                </div>
                <textarea className="form-input" placeholder="Share your experience..." value={expForm.text} onChange={(e) => setExpForm(p => ({ ...p, text: e.target.value }))} style={{ minHeight: '80px', background: '#F8FAFC', borderRadius: '8px', resize: 'vertical', marginBottom: '12px' }}></textarea>
                <button className="btn btn-primary" onClick={submitExperience} disabled={expLoading} style={{ opacity: expLoading ? 0.7 : 1 }}>
                  {expLoading ? 'Posting...' : 'Post Experience'}
                </button>
              </div>

              {/* Experience List */}
              {experiences.length === 0 ? (
                <div className="card text-center" style={{ padding: '40px' }}>
                  <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '12px' }}>💭</span>
                  <p style={{ color: 'var(--text-muted)' }}>No experiences shared yet. Be the first to share!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {experiences.map((exp) => (
                    <div key={exp._id} className="card" style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#166534', fontSize: '0.9rem', flexShrink: 0 }}>
                        {exp.donorId?.fullName?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>{exp.donorId?.fullName || 'Donor'}</p>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{timeAgo(exp.createdAt)}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '2px 10px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 600 }}>{exp.ngoName}</span>
                          <span style={{ color: '#F59E0B', fontSize: '0.85rem', letterSpacing: '1px' }}>{stars(exp.rating)}</span>
                        </div>
                        <p style={{ color: 'var(--text-dark)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>{exp.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Donate Modal */}
      {selectedDonateNgo && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setSelectedDonateNgo(null)}>
          <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '30px', animation: 'fade-up 0.3s ease-out' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-dark)' }}>Donate to {selectedDonateNgo.organizationName}</h3>
              <button onClick={() => setSelectedDonateNgo(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>
            </div>
            
            {(selectedDonateNgo.upiId || selectedDonateNgo.upiQrImage) ? (
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>Scan the QR code or use the UPI ID below to make a direct donation.</p>
                
                {selectedDonateNgo.upiQrImage && (
                  <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)', marginBottom: '20px', display: 'inline-block' }}>
                    <img 
                      src={selectedDonateNgo.upiQrImage.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/) 
                        ? `https://drive.google.com/thumbnail?id=${selectedDonateNgo.upiQrImage.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)[1]}&sz=w800`
                        : selectedDonateNgo.upiQrImage} 
                      alt="UPI QR Code" 
                      style={{ width: '200px', height: '200px', objectFit: 'contain' }} 
                      onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.style.display = 'none'; }} 
                    />
                  </div>
                )}
                
                {selectedDonateNgo.upiId && (
                  <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <div style={{ textAlign: 'left' }}>
                      <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>UPI ID</p>
                      <p style={{ margin: 0, fontSize: '1rem', fontWeight: 500, color: 'var(--text-dark)' }}>{selectedDonateNgo.upiId}</p>
                    </div>
                    <button 
                      className="btn btn-outline" 
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      onClick={() => {
                        navigator.clipboard.writeText(selectedDonateNgo.upiId);
                        alert('UPI ID copied to clipboard!');
                      }}
                    >
                      Copy
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💳</div>
                <p style={{ color: 'var(--text-dark)', fontWeight: 500, marginBottom: '8px' }}>No UPI details provided.</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>This NGO hasn't set up direct UPI payments yet.</p>
                <button className="btn btn-primary w-full" onClick={() => navigate('/checkout')}>
                  Donate via Stripe instead
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
