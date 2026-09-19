import React from 'react';

const TONES = {
  teal: { solid: '#22707B', bg: '#EAF4F1', line: '#CFE6E0' },
  slate: { solid: '#3B4A63', bg: '#EEF1F6', line: '#D7DEE9' },
  plum: { solid: '#7C5680', bg: '#F4EEF4', line: '#E4D6E4' },
  sky: { solid: '#2B6CA3', bg: '#EAF1F8', line: '#CFDEED' },
  rose: { solid: '#A64D5F', bg: '#F7EDEF', line: '#EAD3D8' },
};

/**
 * DBA PhaseLane — grouped process "swimlanes". Each group has a coloured header
 * (abbr + role + range) and its steps in a row with → between; ↓ between lanes.
 * groups: [{ abbr, role, range?, tone, steps: [{ num, title, text? }] }].
 */
export function PhaseLane({ groups = [], style }) {
  return (
    <div style={{ marginTop: '16px', ...style }}>
      {groups.map((g, gi) => {
        const c = TONES[g.tone] || TONES.teal;
        const steps = g.steps || [];
        return (
          <React.Fragment key={gi}>
            <div style={{ background: 'var(--dba-card)', border: '1px solid var(--dba-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '13px', padding: '13px 18px', background: c.bg, borderBottom: `1px solid ${c.line}` }}>
                <span style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '50px', height: '32px', padding: '0 11px', borderRadius: '9px', background: c.solid, color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13.5px', letterSpacing: '.03em' }}>{g.abbr}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', lineHeight: 1.2, color: 'var(--dba-ink)' }}>{g.role}</span>
                {g.range && <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '11.5px', letterSpacing: '.07em', textTransform: 'uppercase', color: c.solid }}>{g.range}</span>}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', padding: '6px' }}>
                {steps.map((s, i) => (
                  <React.Fragment key={i}>
                    <div style={{ flex: '1 1 0', minWidth: '150px', padding: '11px 13px' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12px', letterSpacing: '.04em', color: c.solid, marginBottom: '7px' }}>{s.num}</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', lineHeight: 1.3, color: 'var(--dba-ink)', marginBottom: '4px' }}>{s.title}</div>
                      {s.text && <p style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: '13.5px', lineHeight: 1.5, color: 'var(--dba-body)', margin: 0 }}>{s.text}</p>}
                    </div>
                    {i < steps.length - 1 && <div style={{ display: 'flex', alignItems: 'center', flex: '0 0 auto', padding: '0 2px', color: c.solid, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px' }}>→</div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
            {gi < groups.length - 1 && <div style={{ display: 'flex', justifyContent: 'center', color: c.solid, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', margin: '2px 0' }}>↓</div>}
          </React.Fragment>
        );
      })}
    </div>
  );
}
