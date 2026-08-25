import React from 'react';

const TONES = {
  teal: { solid: '#22707B', bg: '#EAF4F1', line: '#CFE6E0' },
  slate: { solid: '#3B4A63', bg: '#EEF1F6', line: '#D7DEE9' },
  plum: { solid: '#7C5680', bg: '#F4EEF4', line: '#E4D6E4' },
  sky: { solid: '#2B6CA3', bg: '#EAF1F8', line: '#CFDEED' },
  rose: { solid: '#A64D5F', bg: '#F7EDEF', line: '#EAD3D8' },
};

/**
 * DBA Funnel — stacked stages narrowing top→bottom with ↓ between them, a
 * letter/number tile on the left. For models like AIDA.
 * stages: [{ letter?, num?, title, text? }].
 */
export function Funnel({ stages = [], tone = 'teal', style }) {
  const c = TONES[tone] || TONES.teal;
  const n = Math.max(stages.length, 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', ...style }}>
      {stages.map((s, i) => {
        const wPct = 100 - i * (46 / n);
        const isLast = i === stages.length - 1;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                width: `${wPct}%`,
                minWidth: '260px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                background: 'var(--dba-card)',
                border: '1px solid var(--dba-border)',
                borderLeft: `4px solid ${c.solid}`,
                borderRadius: 'var(--radius-md)',
                padding: '14px 20px',
              }}
            >
              <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '10px', background: c.solid, color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '19px' }}>
                {s.letter || s.num || ('0' + (i + 1)).slice(-2)}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', lineHeight: 1.25, color: 'var(--dba-ink)' }}>{s.title}</div>
                {s.text && <p style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: '13px', lineHeight: 1.5, color: 'var(--dba-body)', margin: '2px 0 0' }}>{s.text}</p>}
              </div>
            </div>
            {!isLast && <div style={{ color: c.solid, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', lineHeight: 1, margin: '3px 0' }}>↓</div>}
          </React.Fragment>
        );
      })}
    </div>
  );
}
