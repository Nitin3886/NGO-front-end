import { useNavigate } from 'react-router-dom';

export default function NGOProfile() {
  const navigate = useNavigate();

  return (
    <div className="container mt-12 mb-12">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ width: '80px', height: '80px', background: '#DBEAFE', borderRadius: '50%', margin: '0 auto 16px' }}></div>
            <h2>Water for All</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Bringing clean water to remote villages.</p>
        </div>
        
        <div className="grid grid-cols-3" style={{ gridTemplateColumns: '2fr 1fr' }}>
            <div>
                <div className="card mb-8">
                    <h3 className="mb-4">Urgent Appeal: Clean Wells for Uganda</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>We are raising funds to build 5 deep water wells in communities that currently walk 4 miles daily for clean water. Every dollar counts.</p>
                    <div className="mt-8">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontWeight: 500 }}>$45,000 raised</span>
                            <span style={{ color: 'var(--text-muted)' }}>of $50,000 goal</span>
                        </div>
                        <div style={{ height: '12px', background: '#E2E8F0', borderRadius: '99px', overflow: 'hidden' }}>
                            <div style={{ width: '90%', height: '100%', background: 'var(--secondary)' }}></div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <h3 className="mb-4">Recent Updates</h3>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                        <div style={{ width: '100px', height: '80px', background: '#F1F5F9', borderRadius: '8px' }}></div>
                        <div>
                            <h4 style={{ marginBottom: '4px' }}>Well #1 Successfully Operational</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Thanks to your donations, the first well is now providing clean water.</p>
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
                    <div style={{ width: '150px', height: '150px', background: '#E2E8F0', margin: '0 auto 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: 'var(--text-muted)' }}>QR Code</span>
                    </div>
                    <button className="btn btn-outline w-full">Copy Donation Link</button>
                </div>
            </div>
        </div>
    </div>
  );
}
