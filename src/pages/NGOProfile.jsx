import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NGOProfile() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const orgName = profile?.organizationName || 'Your NGO Name';
  const mission = profile?.missionStatement || 'Your mission statement goes here.';
  const totalRaised = profile?.totalRaised || 0;

  return (
    <div className="container mt-12 mb-12">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, #FFEDD5, #FED7AA)', borderRadius: '50%', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, color: '#9A3412' }}>
                {orgName.charAt(0).toUpperCase()}
            </div>
            <h2>{orgName}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{mission}</p>
        </div>
        
        <div className="grid grid-cols-3" style={{ gridTemplateColumns: '2fr 1fr' }}>
            <div>
                <div className="card mb-8">
                    <h3 className="mb-4">Urgent Appeal: Support Our Cause</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>We are raising funds to support our ongoing initiatives. Every dollar makes a massive difference in helping us achieve our goals.</p>
                    <div className="mt-8">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontWeight: 500 }}>${totalRaised.toLocaleString()} raised</span>
                            <span style={{ color: 'var(--text-muted)' }}>Target ongoing</span>
                        </div>
                        <div style={{ height: '12px', background: '#E2E8F0', borderRadius: '99px', overflow: 'hidden' }}>
                            <div style={{ width: '45%', height: '100%', background: 'var(--secondary)' }}></div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <h3 className="mb-4">Recent Updates</h3>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                        <div style={{ width: '100px', height: '80px', background: '#F1F5F9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>📰</div>
                        <div>
                            <h4 style={{ marginBottom: '4px' }}>Welcome to our page!</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>We will post updates about our activities here.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div>
                <div className="card mb-8" style={{ background: 'linear-gradient(to bottom, #ffffff, #f8fafc)', border: '2px solid var(--primary)' }}>
                    <h3 className="mb-4 text-center">Make a Donation</h3>
                    <div className="form-group">
                        <input type="number" className="form-input text-center" placeholder="Amount ($)" style={{ fontSize: '1.5rem', fontWeight: 600, height: '60px' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                        <button className="btn btn-outline" style={{ flex: 1 }}>$10</button>
                        <button className="btn btn-outline" style={{ flex: 1 }}>$50</button>
                        <button className="btn btn-outline" style={{ flex: 1 }}>$100</button>
                    </div>
                    <button className="btn btn-primary w-full" style={{ padding: '16px', fontSize: '1.1rem' }} onClick={() => navigate('/checkout')}>Donate via Stripe</button>
                </div>
                
                <div className="card text-center">
                    <h4 className="mb-4">Scan to Donate</h4>
                    
                    {(profile?.upiQrImage || profile?.upiId) ? (
                        <div style={{ margin: '0 auto 16px', display: 'inline-block' }}>
                            <img 
                                src={
                                    profile?.upiQrImage
                                        ? (profile.upiQrImage.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/) 
                                            ? `https://drive.google.com/thumbnail?id=${profile.upiQrImage.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)[1]}&sz=w800`
                                            : profile.upiQrImage)
                                        : `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=${profile.upiId}&pn=${encodeURIComponent(orgName)}`)}`
                                } 
                                alt="UPI QR Code" 
                                style={{ width: '150px', height: '150px', objectFit: 'contain' }} 
                                onError={(e) => { 
                                    if (profile?.upiId && !e.target.src.includes('qrserver.com')) {
                                        e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=${profile.upiId}&pn=${encodeURIComponent(orgName)}`)}`;
                                    } else {
                                        e.target.style.display = 'none'; 
                                    }
                                }} 
                            />
                        </div>
                    ) : (
                        <div style={{ width: '150px', height: '150px', background: '#E2E8F0', margin: '0 auto 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                            <span style={{ fontSize: '2rem', marginBottom: '8px' }}>💳</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No QR Available</span>
                        </div>
                    )}
                    
                    {profile?.upiId && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-dark)', marginBottom: '16px', fontWeight: 500 }}>
                            UPI: {profile.upiId}
                        </p>
                    )}
                    <button className="btn btn-outline w-full" onClick={() => {
                        if (profile?.upiId) {
                            navigator.clipboard.writeText(profile.upiId);
                            alert('UPI ID copied!');
                        } else {
                            alert('No donation link available.');
                        }
                    }}>Copy Donation Link</button>
                </div>
            </div>
        </div>
    </div>
  );
}
