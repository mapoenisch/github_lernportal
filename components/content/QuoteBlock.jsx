import React from 'react';

/**
 * DBA QuoteBlock — a teal-tinted example / quote box with an optional small
 * label and an optional author line.
 */
export function QuoteBlock({ label, children, author, role, style }) {
  return (
    <div style={{ background: 'var(--surface-teal)', border: '1px solid var(--surface-teal-border)', borderRadius: 'var(--radius-xl)', padding: '22px 24px', marginTop: '16px', ...style }}>
      {label && <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '11px', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--dba-teal)', marginBottom: '10px' }}>{label}</div>}
      <p style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: '15.5px', lineHeight: 1.6, color: 'var(--dba-ink-2)', margin: 0 }}>{children}</p>
      {author && (
        <div style={{ marginTop: '12px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px', color: 'var(--dba-ink)' }}>
          {author}{role && <span style={{ fontFamily: 'var(--font-body)', fontWeight: 400, color: 'var(--dba-muted)' }}> · {role}</span>}
        </div>
      )}
    </div>
  );
}
