import React from 'react';

/**
 * DBA TaskCard — the "Aufgabe / Task Sheet" block: an uppercase label, a title,
 * and a 2-column grid of numbered goals. goals: string[].
 */
export function TaskCard({ label, title, goals = [], style }) {
  return (
    <div style={{ background: 'var(--dba-teal-deep)', borderRadius: 'var(--radius-xl)', padding: '26px 28px', marginTop: '20px', ...style }}>
      {label && <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '11px', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--dba-teal-light)', marginBottom: '8px' }}>{label}</div>}
      {title && <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '21px', letterSpacing: '-.01em', color: '#fff', margin: '0 0 18px' }}>{title}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '14px' }}>
        {goals.map((g, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span style={{ flex: '0 0 auto', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: 'var(--dba-teal-light)', lineHeight: 1.5 }}>{('0' + (i + 1)).slice(-2)}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: '14px', lineHeight: 1.5, color: '#D6E7E3' }}>{g}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
