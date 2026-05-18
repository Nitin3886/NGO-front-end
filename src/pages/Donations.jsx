import React from 'react';

export default function Donations() {
  return (
    <div className="animate-fade-up">
      <h1 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>Donations</h1>
      
      <div className="card text-center" style={{ padding: '60px 20px', marginTop: '2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💰</div>
        <h2 style={{ marginBottom: '1rem' }}>No donations yet</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Your donation history will appear here once you make or receive your first contribution.
        </p>
      </div>
    </div>
  );
}
