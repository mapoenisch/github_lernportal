import React from 'react';

const TONES = {
  teal: { solid: '#22707B', bg: '#EAF4F1', line: '#CFE6E0' },
  slate: { solid: '#3B4A63', bg: '#EEF1F6', line: '#D7DEE9' },
  plum: { solid: '#7C5680', bg: '#F4EEF4', line: '#E4D6E4' },
  sky: { solid: '#2B6CA3', bg: '#EAF1F8', line: '#CFDEED' },
  rose: { solid: '#A64D5F', bg: '#F7EDEF', line: '#EAD3D8' },
};

/**
 * DBA Cycle — steps evenly placed on a dashed ring with ▶ chevrons between them
 * and a ↻ + label in the middle. For recurring loops (Pomodoro, habit loop).
 */
export function Cycle({ steps = [], center, tone = 'teal', style }) {
  const c = TONES[tone] || TONES.teal;
  const n = Math.max(steps.length, 1);
  const R = 36;
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '520px', margin: '22px auto 4px', aspectRatio: '1 / 1', ...style }}>
      <div style={{ position: 'absolute', left: '12%', top: '12%', width: '76%', height: '76%', borderRadius: '50%', border: `2px dashed ${c.line}` }} />
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '34%', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '30px', color: c.solid, lineHeight: 1 }}>↻</div>
        {center && <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', lineHeight: 1.25, color: 'var(--dba-ink)', marginTop: '6px' }}>{center}</div>}
      </div>
      {steps.map((s, i) => {
        const mid = (i + 0.5) * 360 / n;
        const am = (-90 + mid) * Math.PI / 180;
        return (
          <div key={'ch' + i} style={{ position: 'absolute', left: `${50 + R * Math.cos(am)}%`, top: `${50 + R * Math.sin(am)}%`, transform: `translate(-50%,-50%) rotate(${mid}deg)`, color: c.solid, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', lineHeight: 1 }}>▶</div>
        );
      })}
      {steps.map((s, i) => {
        const a = (-90 + i * 360 / n) * Math.PI / 180;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${50 + R * Math.cos(a)}%`,
              top: `${50 + R * Math.sin(a)}%`,
              transform: 'translate(-50%,-50%)',
              width: '138px',
              background: 'var(--dba-card)',
              border: '1px solid var(--dba-border)',
              borderTop: `3px solid ${c.solid}`,
              borderRadius: 'var(--radius-lg)',
              padding: '11px 12px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-node)',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '25px', height: '25px', padding: '0 8px', borderRadius: '7px', background: c.bg, color: c.solid, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12px', marginBottom: '7px' }}>{s.num || ('0' + (i + 1)).slice(-2)}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13.5px', lineHeight: 1.25, color: 'var(--dba-ink)', marginBottom: '3px' }}>{s.title}</div>
            {s.text && <p style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: '12px', lineHeight: 1.45, color: 'var(--dba-body)', margin: 0 }}>{s.text}</p>}
          </div>
        );
      })}
    </div>
  );
}
