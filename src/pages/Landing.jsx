import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isLocal ? 'http://localhost:5001/api' : (import.meta.env.VITE_API_URL || 'https://ngo-back-end.onrender.com/api');

export default function Landing() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [ngos, setNgos] = useState([]);
  const [loadingNgos, setLoadingNgos] = useState(true);

  useEffect(() => {
    if (!loading && user) {
      navigate(user.role === 'DONOR' ? '/dashboard/donor' : '/dashboard');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/posts`);
        const data = await res.json();
        if (res.ok) setPosts(data.posts || []);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      } finally {
        setLoadingPosts(false);
      }
    };
    const fetchNgos = async () => {
      try {
        const res = await fetch(`${API_URL}/ngos`);
        const data = await res.json();
        if (res.ok) setNgos(data.ngos || []);
      } catch (err) {
        console.error('Failed to fetch NGOs:', err);
      } finally {
        setLoadingNgos(false);
      }
    };
    fetchPosts();
    fetchNgos();
  }, []);

  const timeAgo = (date) => {
    const s = Math.floor((Date.now() - new Date(date)) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  };

  return (
    <>
      {/* Hero */}
      <div className="container mt-12 mb-24 animate-fade-in" style={{ display: 'flex', gap: '60px', alignItems: 'center', minHeight: '600px' }}>
          <div style={{ flex: 1.2 }}>
              <div className="animate-fade-up" style={{ display: 'inline-flex', padding: '6px 12px', background: 'rgba(37,99,235,0.08)', borderRadius: '100px', marginBottom: '24px', border: '1px solid rgba(37,99,235,0.1)' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>✨ Trusted by 10,000+ Verified Donors</span>
              </div>
              <h1 className="animate-fade-up" style={{ fontSize: '4.5rem', lineHeight: 1.1, marginBottom: '24px' }}>
                Join the <span style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Movement</span>.<br/>Direct Impact.
              </h1>
              <p className="animate-fade-up delay-100" style={{ fontSize: '1.4rem', color: 'var(--text-muted)', marginBottom: '40px', maxWidth: '90%' }}>
                  We bridge the gap between world-changing NGOs and people like you. Experience transparency, track real impact, and donate with total confidence.
              </p>
              <div className="animate-fade-up delay-200" style={{ display: 'flex', gap: '20px' }}>
                  <button className="btn btn-primary" style={{ fontSize: '1.15rem', padding: '16px 32px' }} onClick={() => navigate('/ngo-profile')}>Donate Now</button>
                  <button className="btn btn-outline" style={{ fontSize: '1.15rem', padding: '16px 32px' }} onClick={() => navigate('/auth')}>Learn More</button>
              </div>
          </div>
          <div style={{ flex: 1 }} className="animate-fade-up delay-300">
              <div className="card glass" style={{ padding: '0', overflow: 'hidden', position: 'relative', borderRadius: 'var(--radius-lg)', boxShadow: '0 32px 64px -12px rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.4)' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.6))', zIndex: 5 }}></div>
                  <img src="/feeding1.jpg" alt="Volunteers serving children" style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', display: 'block' }} />
                  <img src="/feeding2.jpg" alt="Happy children eating" className="animate-crossfade" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', top: 0, left: 0 }} />
                  <div style={{ position: 'absolute', bottom: '32px', left: '32px', right: '32px', zIndex: 10, color: 'white' }}>
                      <p style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '4px' }}>Feeding India Drive</p>
                      <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>100% transparency. verified high-impact project.</p>
                  </div>
              </div>
          </div>
      </div>

      {/* Stats Section */}
      <div className="container mb-24 animate-fade-up delay-400">
          <div className="grid grid-cols-3" style={{ background: 'var(--white)', padding: '48px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
              <div className="text-center">
                  <h3 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '8px' }}>120+</h3>
                  <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Verified NGOs</p>
              </div>
              <div className="text-center" style={{ borderLeft: '1px solid var(--border-light)', borderRight: '1px solid var(--border-light)' }}>
                  <h3 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '8px' }}>$4.2M</h3>
                  <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Total Impacts</p>
              </div>
              <div className="text-center">
                  <h3 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '8px' }}>85k</h3>
                  <p style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Happy Families</p>
              </div>
          </div>
      </div>

      {/* Live NGO Partners */}
      <div style={{ backgroundColor: '#F1F5F9', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', padding: '100px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
            <div className="animate-fade-up">
              <h2 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>Our Impact Partners</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                Real organizations making a difference — registered and verified on NGO Connect.
              </p>
            </div>
            <div className="animate-fade-up" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {!loadingNgos && (
                <span style={{ background: 'rgba(37,99,235,0.08)', color: 'var(--primary)', padding: '6px 14px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 600, border: '1px solid rgba(37,99,235,0.15)' }}>
                  {ngos.length} Partners
                </span>
              )}
              <button className="btn btn-primary" onClick={() => navigate('/auth')}>Join as an NGO</button>
            </div>
          </div>

          {loadingNgos ? (
            /* Skeleton */
            <div className="grid grid-cols-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="card" style={{ padding: '28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#E2E8F0' }}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ height: '14px', background: '#E2E8F0', borderRadius: '6px', marginBottom: '8px', width: '60%' }}></div>
                      <div style={{ height: '11px', background: '#E2E8F0', borderRadius: '6px', width: '40%' }}></div>
                    </div>
                  </div>
                  <div style={{ height: '12px', background: '#E2E8F0', borderRadius: '6px', marginBottom: '8px' }}></div>
                  <div style={{ height: '12px', background: '#E2E8F0', borderRadius: '6px', width: '75%' }}></div>
                </div>
              ))}
            </div>
          ) : ngos.length === 0 ? (
            /* Empty state */
            <div className="card text-center" style={{ padding: '80px 40px', border: '2px dashed var(--border-light)' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🏢</div>
              <h3 style={{ marginBottom: '12px', fontSize: '1.5rem' }}>No NGOs Registered Yet</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '28px' }}>Be the first organization to join our platform and start making an impact.</p>
              <button className="btn btn-primary" onClick={() => navigate('/auth')} style={{ padding: '14px 32px', fontSize: '1rem' }}>
                Register Your NGO
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3">
              {ngos.map((ngo, idx) => {
                const colors = [
                  { bg: 'linear-gradient(135deg, #FFEDD5, #FED7AA)', text: '#9A3412', light: '#FFF7ED' },
                  { bg: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)', text: '#166534', light: '#F0FDF4' },
                  { bg: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', text: '#92400E', light: '#FFFBEB' },
                  { bg: 'linear-gradient(135deg, #EDE9FE, #DDD6FE)', text: '#5B21B6', light: '#F5F3FF' },
                  { bg: 'linear-gradient(135deg, #FCE7F3, #FBCFE8)', text: '#9D174D', light: '#FDF2F8' },
                  { bg: 'linear-gradient(135deg, #CCFBF1, #99F6E4)', text: '#134E4A', light: '#F0FDFA' },
                ];
                const color = colors[idx % colors.length];
                const initials = ngo.organizationName
                  ? ngo.organizationName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
                  : 'NG';

                return (
                  <div
                    key={ngo._id}
                    className={`card animate-fade-up delay-${Math.min(idx * 100, 400)}`}
                    style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '56px', height: '56px', borderRadius: '16px',
                        background: color.bg, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem',
                        color: color.text, flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                      }}>
                        {initials}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <h3 style={{ fontSize: '1rem', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {ngo.organizationName}
                          {ngo.isVerified && (
                            <span title="Verified" style={{ marginLeft: '6px', color: '#22C55E', fontSize: '0.9rem' }}>✓</span>
                          )}
                        </h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>
                          Managed by {ngo.managerId?.fullName || 'NGO Manager'}
                        </p>
                      </div>
                    </div>

                    {/* Badges */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.68rem', padding: '3px 10px', background: 'rgba(34,197,94,0.1)', color: '#16A34A', borderRadius: '4px', fontWeight: 700 }}>
                        ✓ REGISTERED
                      </span>
                      {ngo.isVerified && (
                        <span style={{ fontSize: '0.68rem', padding: '3px 10px', background: 'rgba(37,99,235,0.08)', color: 'var(--primary)', borderRadius: '4px', fontWeight: 700 }}>
                          VERIFIED
                        </span>
                      )}
                    </div>

                    {/* Mission Statement */}
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, flex: 1, margin: 0 }}>
                      {ngo.missionStatement
                        ? ngo.missionStatement.length > 100
                          ? ngo.missionStatement.substring(0, 100) + '…'
                          : ngo.missionStatement
                        : 'Working towards a better world through community-driven impact.'}
                    </p>

                    {/* CTA */}
                    <button
                      className="btn btn-outline w-full"
                      style={{ marginTop: 'auto', fontSize: '0.9rem' }}
                      onClick={() => navigate('/auth')}
                    >
                      💰 Donate to this NGO
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ===== LIVE NGO POSTS SECTION ===== */}
      <div style={{ padding: '100px 0', background: 'var(--bg-color)' }}>
        <div className="container">
          {/* Section Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
            <div className="animate-fade-up">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', background: 'rgba(37,99,235,0.08)', borderRadius: '100px', marginBottom: '16px', border: '1px solid rgba(37,99,235,0.12)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E', display: 'inline-block', animation: 'pulse-soft 2s infinite' }}></span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live from the Field</span>
              </div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>Latest from NGOs</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Real stories and updates posted directly by verified organizations.</p>
            </div>
            <button className="btn btn-primary animate-fade-up" onClick={() => navigate('/auth')} style={{ whiteSpace: 'nowrap' }}>
              Join to See All Posts →
            </button>
          </div>

          {/* Posts Grid */}
          {loadingPosts ? (
            /* Skeleton Loader */
            <div className="grid grid-cols-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ height: '200px', background: 'linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }}></div>
                  <div style={{ padding: '20px' }}>
                    <div style={{ height: '12px', background: '#F1F5F9', borderRadius: '6px', marginBottom: '10px', width: '60%' }}></div>
                    <div style={{ height: '18px', background: '#F1F5F9', borderRadius: '6px', marginBottom: '10px' }}></div>
                    <div style={{ height: '14px', background: '#F1F5F9', borderRadius: '6px', width: '80%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            /* Empty State */
            <div className="card text-center" style={{ padding: '80px 40px', border: '2px dashed var(--border-light)' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📰</div>
              <h3 style={{ marginBottom: '12px', fontSize: '1.5rem' }}>No Posts Yet</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '28px' }}>
                NGO managers haven't published any stories yet. Be the first to register your organization and share your impact!
              </p>
              <button className="btn btn-primary" onClick={() => navigate('/auth')} style={{ padding: '14px 32px', fontSize: '1rem' }}>
                Register Your NGO
              </button>
            </div>
          ) : (
            /* Posts Grid — show latest 6 */
            <div className="grid grid-cols-3">
              {posts.slice(0, 6).map((post, idx) => (
                <div
                  key={post._id}
                  className={`card animate-fade-up delay-${Math.min(idx * 100, 500)}`}
                  style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                >
                  {/* Post Image */}
                  {post.imageUrl ? (
                    <div style={{ width: '100%', height: '200px', overflow: 'hidden', background: '#F1F5F9', flexShrink: 0 }}>
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                        onError={e => { e.target.parentElement.style.display = 'none'; }}
                      />
                    </div>
                  ) : (
                    <div style={{ width: '100%', height: '120px', background: 'linear-gradient(135deg, #FFEDD5 0%, #EDE9FE 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', flexShrink: 0 }}>
                      📋
                    </div>
                  )}

                  {/* Post Body */}
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* NGO Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #FFEDD5, #FED7AA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', color: '#9A3412', flexShrink: 0 }}>
                        {post.ngoId?.organizationName?.charAt(0)?.toUpperCase() || 'N'}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: '0.85rem', margin: 0, color: 'var(--primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {post.ngoId?.organizationName || 'NGO'}
                          {post.ngoId?.isVerified && <span style={{ marginLeft: '5px', color: '#22C55E', fontSize: '0.8rem' }}>✓</span>}
                        </p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', margin: 0 }}>{timeAgo(post.publishedAt)}</p>
                      </div>
                    </div>

                    {/* Title & Content */}
                    <h3 style={{ fontSize: '1rem', marginBottom: '8px', lineHeight: 1.4 }}>{post.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, flex: 1, marginBottom: '16px' }}>
                      {post.content.length > 120 ? post.content.substring(0, 120) + '…' : post.content}
                    </p>

                    {/* Stats Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        🤍 {post.likeCount || 0}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        💬 {post.commentCount || 0}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                        🔗 {post.shares || 0}
                      </span>
                      <button
                        className="btn btn-primary"
                        style={{ marginLeft: 'auto', fontSize: '0.75rem', padding: '5px 14px', borderRadius: '8px' }}
                        onClick={() => navigate('/auth')}
                      >
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA below posts */}
          {posts.length > 0 && (
            <div className="text-center" style={{ marginTop: '48px' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
                Showing {Math.min(posts.length, 6)} of {posts.length} posts — <strong>Login to see all, like, comment & donate</strong>
              </p>
              <button className="btn btn-primary" onClick={() => navigate('/auth')} style={{ padding: '14px 36px', fontSize: '1rem' }}>
                Create Free Account →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* How It Works */}
      <div className="container my-12 text-center pt-8 pb-8 animate-fade-up delay-400">
          <h2 className="mb-12" style={{ fontSize: '2.5rem' }}>How It Works</h2>
          
          <div style={{ display: 'flex', gap: '64px', alignItems: 'center', marginBottom: '64px' }}>
              <div style={{ flex: 1 }}>
                  <img src="/illustration1.jpg" alt="Donating items" style={{ width: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '8px' }}>STEP 1</div>
                  <h3 className="mb-4" style={{ fontSize: '1.75rem' }}>Discover & Connect</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>Browse vetted organizations aligned with your passions. Make secure one-time or recurring contributions directly through our transparent ecosystem.</p>
              </div>
          </div>

          <div style={{ display: 'flex', gap: '64px', alignItems: 'center', flexDirection: 'row-reverse', marginBottom: '32px' }}>
              <div style={{ flex: 1 }}>
                  <img src="/illustration2.jpg" alt="Donation center" style={{ width: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '8px' }}>STEP 2</div>
                  <h3 className="mb-4" style={{ fontSize: '1.75rem' }}>Track the Impact</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>Receive live updates, track distribution of funds and material, and view transparent impact reports directly on your dashboard.</p>
              </div>
          </div>
      </div>
      
      <footer style={{ background: 'white', borderTop: '1px solid var(--border-light)', padding: '40px 0' }}>
          <div className="container text-center text-muted">
              <p>&copy; 2026 NGO Connect Platform. All rights reserved.</p>
          </div>
      </footer>
    </>
  );
}