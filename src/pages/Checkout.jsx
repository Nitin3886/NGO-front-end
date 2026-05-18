import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const navigate = useNavigate();

  const handleDonate = () => {
    alert('Payment Successful! ❤️');
    navigate('/');
  };

  return (
    <div className="container" style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
      <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '40px' }}>
          <div className="text-center mb-8">
              <div style={{ width: '60px', height: '60px', background: '#DBEAFE', borderRadius: '50%', margin: '0 auto 12px' }}></div>
              <h2 style={{ fontSize: '1.5rem' }}>Support Water for All</h2>
          </div>
          
          <div className="form-group mb-8">
              <label className="form-label text-center">Donation Amount</label>
              <input type="text" className="form-input text-center" defaultValue="$50.00" readOnly style={{ fontSize: '2rem', fontWeight: 700, border: 'none', borderBottom: '2px solid var(--border-light)', borderRadius: 0, background: 'transparent' }} />
          </div>

          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', marginBottom: '24px' }}>
              <label className="form-label">Card Information</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border-light)', border: '1px solid var(--border-light)', borderRadius: '8px', overflow: 'hidden' }}>
                  <input type="text" className="form-input" placeholder="Card number" style={{ border: 'none', borderRadius: 0 }} />
                  <div style={{ display: 'flex', gap: '1px' }}>
                      <input type="text" className="form-input" placeholder="MM / YY" style={{ border: 'none', borderRadius: 0, flex: 1 }} />
                      <input type="text" className="form-input" placeholder="CVC" style={{ border: 'none', borderRadius: 0, flex: 1 }} />
                  </div>
              </div>
          </div>
          
          <button 
            className="btn btn-primary w-full" 
            style={{ padding: '16px', fontSize: '1.1rem', boxShadow: '0 4px 14px 0 rgba(37,99,235,0.39)' }} 
            onClick={handleDonate}>
              Securely Donate $50.00
          </button>
          <p className="text-center mt-4" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Powered by Stripe Integration Demo</p>
      </div>
    </div>
  );
}
