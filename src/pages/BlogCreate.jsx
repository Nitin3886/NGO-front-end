import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5001/api';

export default function BlogCreate() {
  const navigate = useNavigate();
  const { token, profile } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);

  const handlePublish = async () => {
    if (!title.trim()) return setError('Please add a title.');
    if (!content.trim()) return setError('Please write some content.');
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title, content, imageUrl })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert('Post published successfully! ✅');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-12 mb-12" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <h2>Create New Post</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                Posting as <strong>{profile?.organizationName || 'Your NGO'}</strong>
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>Cancel</button>
                <button className="btn btn-outline" onClick={() => setPreview(!preview)}>
                  {preview ? '✏️ Edit' : '👁 Preview'}
                </button>
                <button className="btn btn-primary" onClick={handlePublish} disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Publishing...' : '🚀 Publish'}
                </button>
            </div>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px' }}>
            <p style={{ color: '#DC2626', fontSize: '0.85rem', fontWeight: 500, margin: 0 }}>⚠️ {error}</p>
          </div>
        )}

        {preview ? (
          /* Preview Mode */
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#1E40AF' }}>
                {profile?.organizationName?.charAt(0)?.toUpperCase() || 'N'}
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>{profile?.organizationName || 'Your NGO'}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>Just now</p>
              </div>
            </div>
            {imageUrl && (
              <div style={{ maxHeight: '400px', overflow: 'hidden', background: '#F1F5F9' }}>
                <img src={imageUrl} alt="" style={{ width: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
            )}
            <div style={{ padding: '20px' }}>
              <h3 style={{ marginBottom: '8px' }}>{title || 'Untitled Post'}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{content || 'No content yet...'}</p>
              <div style={{ display: 'flex', gap: '24px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span>🤍 0</span><span>💬 0</span><span>🔗 0</span>
              </div>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <div className="card">
              <div className="form-group mb-8">
                  <label className="form-label">Post Title</label>
                  <input type="text" className="form-input" placeholder="e.g. Clean Water Well #5 Completed!" value={title} onChange={(e) => setTitle(e.target.value)} style={{ fontSize: '1.5rem', fontWeight: 700, borderRadius: '8px' }} />
              </div>

              <div className="form-group mb-8">
                  <label className="form-label">Cover Image URL</label>
                  <input type="text" className="form-input" placeholder="https://example.com/your-image.jpg" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} style={{ background: '#F8FAFC', borderRadius: '8px' }} />
                  {imageUrl && (
                    <div style={{ marginTop: '12px', maxHeight: '200px', overflow: 'hidden', borderRadius: '8px', background: '#F1F5F9' }}>
                      <img src={imageUrl} alt="Preview" style={{ width: '100%', objectFit: 'cover' }} onError={(e) => { e.target.parentElement.innerHTML = '<p style="padding:20px;color:#94A3B8;text-align:center">Image failed to load</p>'; }} />
                    </div>
                  )}
              </div>
              
              <div className="form-group">
                  <label className="form-label">Content</label>
                  <textarea className="form-input" placeholder="Share your impact story with the community..." value={content} onChange={(e) => setContent(e.target.value)} style={{ minHeight: '250px', fontSize: '1rem', borderRadius: '8px', resize: 'vertical', lineHeight: 1.6 }}></textarea>
              </div>
          </div>
        )}
    </div>
  );
}
