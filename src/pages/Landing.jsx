import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate(user.role === 'DONOR' ? '/dashboard/donor' : '/dashboard');
    }
  }, [user, loading, navigate]);

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

      {/* Featured NGOs */}
      <div style={{ backgroundColor: '#F1F5F9', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', padding: '100px 0' }}>
          <div className="container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
                  <div className="animate-fade-up">
                      <h2 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>Featured Impact Partners</h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Support high-growth organizations solving local problems globally.</p>
                  </div>
                  <button className="btn btn-outline animate-fade-up">View All NGO Partners</button>
              </div>
              <div className="grid grid-cols-3">
                  <div className="card animate-fade-up delay-100" style={{ padding: '0', overflow: 'hidden' }}>
                      <img src="/ngo1.png" alt="Nature conservation" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                      <div style={{ padding: '24px' }}>
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                              <span style={{ fontSize: '0.7rem', padding: '4px 8px', background: 'rgba(34, 197, 94, 0.1)', color: '#16A34A', borderRadius: '4px', fontWeight: 700 }}>VERIFIED</span>
                              <span style={{ fontSize: '0.7rem', padding: '4px 8px', background: '#F1F5F9', color: 'var(--text-muted)', borderRadius: '4px', fontWeight: 700 }}>ENVIRONMENT</span>
                          </div>
                          <h3 className="mb-2">Green Canopy</h3>
                          <p className="mb-6" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Restoring native forests in the Amazon through community-led conservation programs.</p>
                          <button className="btn btn-outline w-full" onClick={() => navigate('/ngo-profile')}>View Impact Profile</button>
                      </div>
                  </div>
                  <div className="card animate-fade-up delay-200" style={{ padding: '0', overflow: 'hidden' }}>
                      <img src="/ngo2.png" alt="Digital education" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                      <div style={{ padding: '24px' }}>
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                              <span style={{ fontSize: '0.7rem', padding: '4px 8px', background: 'rgba(34, 197, 94, 0.1)', color: '#16A34A', borderRadius: '4px', fontWeight: 700 }}>VERIFIED</span>
                              <span style={{ fontSize: '0.7rem', padding: '4px 8px', background: '#F1F5F9', color: 'var(--text-muted)', borderRadius: '4px', fontWeight: 700 }}>EDUCATION</span>
                          </div>
                          <h3 className="mb-2">EduFuture</h3>
                          <p className="mb-6" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Providing digital literacy and high-speed internet to rural schools globally.</p>
                          <button className="btn btn-outline w-full" onClick={() => navigate('/ngo-profile')}>View Impact Profile</button>
                      </div>
                  </div>
                  <div className="card animate-fade-up delay-300" style={{ padding: '0', overflow: 'hidden' }}>
                      <img src="/ngo3.png" alt="Solar water filtration" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                      <div style={{ padding: '24px' }}>
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                              <span style={{ fontSize: '0.7rem', padding: '4px 8px', background: 'rgba(34, 197, 94, 0.1)', color: '#16A34A', borderRadius: '4px', fontWeight: 700 }}>VERIFIED</span>
                              <span style={{ fontSize: '0.7rem', padding: '4px 8px', background: '#F1F5F9', color: 'var(--text-muted)', borderRadius: '4px', fontWeight: 700 }}>WATER</span>
                          </div>
                          <h3 className="mb-2">ClearFlow Int.</h3>
                          <p className="mb-6" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sustainable solar-powered water filtration systems for sub-Saharan communities.</p>
                          <button className="btn btn-outline w-full" onClick={() => navigate('/ngo-profile')}>View Impact Profile</button>
                      </div>
                  </div>
              </div>
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