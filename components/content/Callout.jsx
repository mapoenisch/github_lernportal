import React from 'react';

/**
 * DBA Callout — a warm accent-tinted box with a coral title and a grid of items.
 * items: [{ title, text }].
 */
export function Callout({ title, items = [], cols = 3, style }) {
  return (
    <div style={{ background: 'var(--surface-callout)', border: '1px solid var(--surface-callout-border)', borderRadius: 'var(--radius-xl)', padding: '24px 26px', marginTop: '16px', ...style }}>
      {title && <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', lineHeight: 1.3, color: 'var(--dba-coral-deep)', margin: '0 0 14px' }}>{title}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '18px' }}>
        {items.map((it, i) => (
          <div key={i}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px', lineHeight: 1.3, color: 'var(--dba-ink)', margin: '0 0 5px' }}>{it.title}</p>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: '13.5px', lineHeight: 1.55, color: '#6B5C55', margin: 0 }}>{it.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
