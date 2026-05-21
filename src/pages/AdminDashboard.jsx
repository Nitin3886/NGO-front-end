import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams, useNavigate } from 'react-router-dom';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API = isLocal ? 'http://localhost:5001/api' : (import.meta.env.VITE_API_URL || 'https://ngo-back-end.onrender.com/api');

const MONTHLY = [
  { m:'Jun',v:18},{ m:'Jul',v:32},{ m:'Aug',v:25},{ m:'Sep',v:41},
  { m:'Oct',v:38},{ m:'Nov',v:52},{ m:'Dec',v:47},{ m:'Jan',v:63},
  { m:'Feb',v:58},{ m:'Mar',v:72},{ m:'Apr',v:67},{ m:'May',v:84},
];
const PROGRAMS = [
  { label:'Education',  pct:42, color:'#F97316' },
  { label:'Healthcare', pct:28, color:'#22C55E' },
  { label:'Nutrition',  pct:16, color:'#F59E0B' },
  { label:'Shelter',    pct:10, color:'#8B5CF6' },
  { label:'Skill Dev.', pct:4,  color:'#06B6D4' },
];
const DONATIONS = [
  { donor:'Vikram S.',  amount:'₹5,000',  prog:'Education',  status:'Received',   sc:'#22C55E' },
  { donor:'Priya M.',   amount:'₹2,500',  prog:'Healthcare', status:'Pending',    sc:'#F59E0B' },
  { donor:'Arjun K.',   amount:'₹10,000', prog:'Nutrition',  status:'Received',   sc:'#22C55E' },
  { donor:'Sneha R.',   amount:'₹1,200',  prog:'Shelter',    status:'Received',   sc:'#22C55E' },
  { donor:'Rahul D.',   amount:'₹3,800',  prog:'Skill Dev.', status:'Processing', sc:'#F97316' },
];
const PENDING = [
  { name:'Kavya NGO',  type:'New',     tc:'#F59E0B' },
  { name:'Hope Trust', type:'Update',  tc:'#F97316' },
  { name:'GreenEarth', type:'New',     tc:'#F59E0B' },
  { name:'Care India', type:'Verified',tc:'#22C55E' },
];

function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.v), 1);
  return (
    <svg viewBox="0 0 600 180" style={{ width:'100%' }}>
      {[0,0.5,1].map(f => (
        <line key={f} x1={0} y1={140-140*f} x2={600} y2={140-140*f}
          stroke="rgba(226,232,240,0.6)" strokeWidth="1" strokeDasharray="4 4" />
      ))}
      {data.map((d, i) => {
        const x = 10 + i * 49;
        const bh = Math.max(4, Math.round((d.v/max)*130));
        const isLast = i === data.length - 1;
        return (
          <g key={i}>
            <rect x={x} y={140-bh} width={32} height={bh} rx="6"
              fill={isLast ? 'url(#grad)' : 'rgba(37,99,235,0.15)'}
              style={{ transition: 'all 0.4s ease' }} />
            <text x={x+16} y={158} textAnchor="middle" fontSize="9" fill="#94A3B8">{d.m}</text>
            {isLast && <text x={x+16} y={140-bh-6} textAnchor="middle" fontSize="10" fill="#F97316" fontWeight="700">{d.v}</text>}
          </g>
        );
      })}
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function StatCard({ icon, label, value, sub, subColor, delay }) {
  return (
    <div className="animate-fade-up" style={{
      background:'white', borderRadius:'20px', padding:'24px',
      border:'1px solid rgba(226,232,240,0.6)',
      boxShadow:'0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)',
      transition:'all 0.35s cubic-bezier(0.16,1,0.3,1)',
      animationDelay: delay,
    }}
      onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(37,99,235,0.12)'; }}
      onMouseLeave={e=>{ e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)'; }}
    >
      <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'14px' }}>
        <div style={{ width:'38px', height:'38px', borderRadius:'10px', background:'linear-gradient(135deg,#FFF7ED,#FFEDD5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem' }}>{icon}</div>
        <p style={{ fontSize:'0.68rem', fontWeight:700, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.08em', margin:0 }}>{label}</p>
      </div>
      <p style={{ fontSize:'2.4rem', fontWeight:800, color:'#0F172A', margin:0, lineHeight:1, fontFamily:"'Outfit',sans-serif" }}>{value}</p>
      {sub && <p style={{ fontSize:'0.78rem', color:subColor||'#94A3B8', marginTop:'8px', fontWeight:600 }}>{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [ngoCount,  setNgoCount]  = useState('—');
  const [postCount, setPostCount] = useState('—');
  const [ngoList,   setNgoList]   = useState([]);
  const [loading,   setLoading]   = useState(true);

  // Sync tab with URL param
  const tab = searchParams.get('tab') || 'overview';
  const setTab = (t) => navigate(t === 'overview' ? '/dashboard/admin' : `/dashboard/admin?tab=${t}`, { replace: true });

  useEffect(() => {
    Promise.all([
      fetch(`${API}/ngos`).then(r=>r.json()).catch(()=>({})),
      fetch(`${API}/posts`).then(r=>r.json()).catch(()=>({})),
    ]).then(([nd, pd]) => {
      const ngos  = nd.ngos  || [];
      const posts = pd.posts || [];
      setNgoCount(ngos.length);
      setPostCount(posts.length);
      setNgoList(ngos.map(n => ({
        ...n,
        postCount: posts.filter(p => (p.ngoId?._id||p.ngoId) === n._id).length,
      })));
    }).finally(() => setLoading(false));
  }, []);

  const today = new Date().toLocaleDateString('en-US',{ weekday:'long', day:'numeric', month:'long', year:'numeric' });
  const COLORS = ['#F97316','#22C55E','#F59E0B','#EF4444','#8B5CF6','#06B6D4'];

  const tabBtn = (id, label) => (
    <button onClick={()=>setTab(id)} style={{
      padding:'9px 20px', borderRadius:'8px', border:'none', cursor:'pointer',
      fontWeight: tab===id ? 700 : 500, fontSize:'0.85rem',
      background: tab===id ? 'linear-gradient(135deg,var(--primary),#1D4ED8)' : 'transparent',
      color: tab===id ? 'white' : 'var(--text-muted)',
      boxShadow: tab===id ? '0 4px 12px rgba(37,99,235,0.3)' : 'none',
      transition:'all 0.25s cubic-bezier(0.16,1,0.3,1)',
    }}>{label}</button>
  );

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>

      {/* Header */}
      <div className="animate-fade-in" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'32px' }}>
        <div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'5px 14px', background:'rgba(37,99,235,0.08)', borderRadius:'99px', marginBottom:'12px', border:'1px solid rgba(37,99,235,0.12)' }}>
            <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#22C55E', display:'inline-block', animation:'pulse-soft 2s infinite' }}/>
            <span style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--primary)', textTransform:'uppercase', letterSpacing:'0.05em' }}>Admin Panel</span>
          </div>
          <h1 style={{ fontSize:'2rem', fontWeight:800, margin:0, color:'var(--text-dark)' }}>Dashboard</h1>
          <p style={{ color:'var(--text-muted)', margin:'4px 0 0', fontSize:'0.875rem' }}>Welcome back, {user?.fullName||'Admin'} · {today}</p>
        </div>
        <button onClick={() => {
          const rows = ngoList.map(n=>`${n.organizationName},${n.managerId?.fullName||''},${n.managerId?.email||''},${n.postCount},${n.isVerified?'Yes':'No'}`).join('\n');
          const blob = new Blob([`Organization,Manager,Email,Posts,Verified\n${rows}`],{type:'text/csv'});
          const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='ngo_report.csv'; a.click();
        }} className="btn btn-primary" style={{ gap:'8px', borderRadius:'12px', padding:'12px 24px' }}>
          📥 Export Report
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'28px' }}>
        <StatCard icon="🏢" label="NGO Managers"      value={loading?'…':ngoCount}  sub="Registered on platform"  delay="0ms"   />
        <StatCard icon="📝" label="Posts Published"   value={loading?'…':postCount} sub="Total stories shared"    delay="80ms"  />
        <StatCard icon="💰" label="Total Donations"   value="₹48.2L"               sub="↑ +₹3.1L this month"    subColor="#22C55E" delay="160ms" />
        <StatCard icon="⏳" label="Pending Approvals" value="23"                    sub="↑ 8 new today"          subColor="#EF4444" delay="240ms" />
      </div>

      {/* Tab Bar */}
      <div style={{ display:'flex', gap:'4px', marginBottom:'24px', background:'rgba(241,245,249,0.8)', borderRadius:'12px', padding:'4px', width:'fit-content', backdropFilter:'blur(8px)' }}>
        {tabBtn('overview', '📊 Overview')}
        {tabBtn('managers', '🏢 NGO Managers')}
        {tabBtn('posts','📰 All Posts')}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'overview' && (
        <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:'20px' }}>

          {/* Bar Chart */}
          <div className="card animate-fade-up" style={{ padding:'28px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
              <h3 style={{ margin:0, fontSize:'1rem', fontWeight:700 }}>Monthly Activity</h3>
              <span style={{ background:'rgba(37,99,235,0.08)', color:'var(--primary)', padding:'4px 12px', borderRadius:'99px', fontSize:'0.75rem', fontWeight:600, border:'1px solid rgba(37,99,235,0.12)' }}>Last 12 months</span>
            </div>
            <BarChart data={MONTHLY} />
          </div>

          {/* Programs */}
          <div className="card animate-fade-up" style={{ padding:'28px', animationDelay:'80ms' }}>
            <h3 style={{ margin:'0 0 20px', fontSize:'1rem', fontWeight:700 }}>Donations by Program</h3>
            {PROGRAMS.map((p,i) => (
              <div key={p.label} style={{ marginBottom:'16px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
                  <span style={{ fontSize:'0.875rem', color:'var(--text-dark)', fontWeight:500 }}>{p.label}</span>
                  <span style={{ fontSize:'0.875rem', fontWeight:700, color:p.color }}>{p.pct}%</span>
                </div>
                <div style={{ height:'8px', background:'#F1F5F9', borderRadius:'99px', overflow:'hidden' }}>
                  <div style={{ width:`${p.pct}%`, height:'100%', background:p.color, borderRadius:'99px', transition:'width 1.2s cubic-bezier(0.16,1,0.3,1)', transitionDelay:`${i*100}ms` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Live DB card */}
          <div className="animate-fade-up" style={{ background:'linear-gradient(135deg,#9A3412,#F97316,#0EA5E9)', borderRadius:'20px', padding:'28px', color:'white', boxShadow:'0 8px 32px rgba(37,99,235,0.35)', animationDelay:'160ms' }}>
            <p style={{ fontSize:'0.72rem', fontWeight:700, opacity:0.7, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'20px' }}>📡 Live Database Stats</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'24px' }}>
              {[['🏢',loading?'…':ngoCount,'NGO Managers'],['📰',loading?'…':postCount,'Posts']].map(([ic,v,l]) => (
                <div key={l}>
                  <p style={{ fontSize:'0.85rem', opacity:0.75, marginBottom:'6px' }}>{ic} {l}</p>
                  <p style={{ fontSize:'2.5rem', fontWeight:800, margin:0, lineHeight:1 }}>{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pending */}
          <div className="card animate-fade-up" style={{ padding:'28px', animationDelay:'160ms' }}>
            <h3 style={{ margin:'0 0 16px', fontSize:'1rem', fontWeight:700 }}>Pending Approvals</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {PENDING.map((p,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', background:'#F8FAFC', borderRadius:'10px', border:'1px solid var(--border-light)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:`${p.tc}18`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'0.72rem', color:p.tc }}>
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p style={{ margin:0, fontWeight:600, fontSize:'0.85rem' }}>{p.name}</p>
                      <span style={{ background:`${p.tc}18`, color:p.tc, padding:'1px 8px', borderRadius:'99px', fontSize:'0.68rem', fontWeight:700 }}>{p.type}</span>
                    </div>
                  </div>
                  <button className="btn btn-outline" style={{ padding:'5px 14px', fontSize:'0.78rem', borderRadius:'8px' }}>Review</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── NGO MANAGERS ── */}
      {tab === 'managers' && (
        <div className="card animate-fade-in" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'20px 28px', borderBottom:'1px solid var(--border-light)', display:'flex', justifyContent:'space-between', alignItems:'center', background:'linear-gradient(to right,#F8FAFC,white)' }}>
            <h3 style={{ margin:0, fontWeight:700 }}>NGO Managers — <span style={{ color:'var(--primary)' }}>{ngoCount}</span> total</h3>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <span style={{ background:'rgba(34,197,94,0.1)', color:'#166534', padding:'4px 14px', borderRadius:'99px', fontSize:'0.78rem', fontWeight:700, border:'1px solid rgba(34,197,94,0.2)' }}>
                {ngoList.filter(n=>n.isVerified).length} Verified
              </span>
              <span style={{ background:'rgba(245,158,11,0.1)', color:'#92400E', padding:'4px 14px', borderRadius:'99px', fontSize:'0.78rem', fontWeight:700, border:'1px solid rgba(245,158,11,0.2)' }}>
                {ngoList.filter(n=>!n.isVerified).length} Pending
              </span>
            </div>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#F8FAFC' }}>
                {['#','Organization','Manager','Email','Posts','Status','Joined'].map(h=>(
                  <th key={h} style={{ padding:'12px 20px', textAlign:'left', fontSize:'0.68rem', fontWeight:700, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan="7" style={{ padding:'48px', textAlign:'center', color:'var(--text-muted)' }}>Loading…</td></tr>}
              {!loading && ngoList.length === 0 && <tr><td colSpan="7" style={{ padding:'48px', textAlign:'center', color:'var(--text-muted)' }}>No NGOs registered yet.</td></tr>}
              {ngoList.map((n,i) => {
                const col = COLORS[i % COLORS.length];
                const initials = n.organizationName?.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()||'NG';
                return (
                  <tr key={n._id} style={{ borderTop:'1px solid var(--border-light)', transition:'background 0.15s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(239,246,255,0.5)'}
                    onMouseLeave={e=>e.currentTarget.style.background='white'}>
                    <td style={{ padding:'14px 20px', fontSize:'0.85rem', color:'#94A3B8', fontWeight:600 }}>{i+1}</td>
                    <td style={{ padding:'14px 20px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                        <div style={{ width:'38px', height:'38px', borderRadius:'10px', background:`${col}18`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'0.8rem', color:col, flexShrink:0 }}>{initials}</div>
                        <span style={{ fontWeight:600, fontSize:'0.875rem' }}>{n.organizationName}</span>
                      </div>
                    </td>
                    <td style={{ padding:'14px 20px', fontSize:'0.875rem', color:'var(--text-dark)' }}>{n.managerId?.fullName||'—'}</td>
                    <td style={{ padding:'14px 20px', fontSize:'0.8rem', color:'var(--text-muted)' }}>{n.managerId?.email||'—'}</td>
                    <td style={{ padding:'14px 20px', textAlign:'center' }}>
                      <span style={{ background:'rgba(37,99,235,0.08)', color:'var(--primary)', padding:'3px 12px', borderRadius:'99px', fontWeight:700, fontSize:'0.8rem', border:'1px solid rgba(37,99,235,0.12)' }}>{n.postCount}</span>
                    </td>
                    <td style={{ padding:'14px 20px' }}>
                      <span style={{ background:n.isVerified?'rgba(34,197,94,0.1)':'rgba(245,158,11,0.1)', color:n.isVerified?'#166534':'#92400E', padding:'3px 12px', borderRadius:'99px', fontWeight:700, fontSize:'0.72rem', border:`1px solid ${n.isVerified?'rgba(34,197,94,0.2)':'rgba(245,158,11,0.2)'}` }}>
                        {n.isVerified ? '✓ Verified' : '● Pending'}
                      </span>
                    </td>
                    <td style={{ padding:'14px 20px', fontSize:'0.78rem', color:'var(--text-muted)' }}>
                      {n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── DONATIONS ── */}
      {tab === 'posts' && (
        <div className="card animate-fade-in" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'20px 28px', borderBottom:'1px solid var(--border-light)', background:'linear-gradient(to right,#F8FAFC,white)' }}>
            <h3 style={{ margin:0, fontWeight:700 }}>Recent Donations</h3>
            <p style={{ margin:'4px 0 0', fontSize:'0.85rem', color:'var(--text-muted)' }}>Sample donation records for visualization</p>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#F8FAFC' }}>
                {['Donor','Amount','Program','Status'].map(h=>(
                  <th key={h} style={{ padding:'12px 24px', textAlign:'left', fontSize:'0.68rem', fontWeight:700, color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DONATIONS.map((d,i) => (
                <tr key={i} style={{ borderTop:'1px solid var(--border-light)', transition:'background 0.15s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(239,246,255,0.5)'}
                  onMouseLeave={e=>e.currentTarget.style.background='white'}>
                  <td style={{ padding:'16px 24px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                      <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'linear-gradient(135deg,#FFEDD5,#FED7AA)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'0.8rem', color:'#9A3412' }}>{d.donor.charAt(0)}</div>
                      <span style={{ fontWeight:600, fontSize:'0.875rem' }}>{d.donor}</span>
                    </div>
                  </td>
                  <td style={{ padding:'16px 24px', fontWeight:700, fontSize:'0.95rem', color:'var(--text-dark)' }}>{d.amount}</td>
                  <td style={{ padding:'16px 24px', fontSize:'0.875rem', color:'var(--text-muted)' }}>{d.prog}</td>
                  <td style={{ padding:'16px 24px' }}>
                    <span style={{ background:`${d.sc}18`, color:d.sc, padding:'4px 14px', borderRadius:'99px', fontWeight:600, fontSize:'0.78rem', border:`1px solid ${d.sc}30` }}>{d.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
