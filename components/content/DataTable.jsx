import React from 'react';

/**
 * DBA DataTable — a lightweight comparison table. First column is a bold
 * Archivo label; the rest are body text. head: string[], rows: string[][].
 */
export function DataTable({ head = [], rows = [], style }) {
  const n = head.length || (rows[0] ? rows[0].length : 0);
  const col = (i) => (i === 0 ? { flex: '0 0 34%' } : { flex: '1 1 0' });
  const pr = (i) => (i < n - 1 ? '16px' : '0');
  return (
    <div style={{ marginTop: '16px', ...style }}>
      {head.length > 0 && (
        <div style={{ display: 'flex', padding: '0 0 10px', borderBottom: '1px solid var(--dba-border)' }}>
          {head.map((h, i) => (
            <div key={i} style={{ ...col(i), paddingRight: pr(i), fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '11px', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--dba-muted)' }}>{h}</div>
          ))}
        </div>
      )}
      {rows.map((r, ri) => (
        <div key={ri} style={{ display: 'flex', padding: '13px 0', borderBottom: '1px solid var(--dba-border)' }}>
          {r.map((cell, i) => (
            <div key={i} style={{ ...col(i), paddingRight: pr(i), ...(i === 0 ? { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', lineHeight: 1.4, color: 'var(--dba-ink)' } : { fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: '13.5px', lineHeight: 1.5, color: 'var(--dba-body)' }) }}>{cell}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
