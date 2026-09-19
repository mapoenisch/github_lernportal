import React from 'react';

const TONES = {
  teal: { solid: '#22707B', bg: '#EAF4F1', line: '#CFE6E0' },
  slate: { solid: '#3B4A63', bg: '#EEF1F6', line: '#D7DEE9' },
  plum: { solid: '#7C5680', bg: '#F4EEF4', line: '#E4D6E4' },
  sky: { solid: '#2B6CA3', bg: '#EAF1F8', line: '#CFDEED' },
  rose: { solid: '#A64D5F', bg: '#F7EDEF', line: '#EAD3D8' },
};

/**
 * DBA ProcessFlow — numbered step cards in a snake layout.
 * → between steps in a row, ↓ at row breaks; even rows flow right→left with ←
 * so the path stays continuous. Steps: [{ num?, title, text? }].
 */
export function ProcessFlow({ steps = [], cols = 4, tone = 'teal', style }) {
  const c = TONES[tone] || TONES.teal;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`,
        columnGap: 'var(--gap-flow-col)',
        rowGap: 'var(--gap-flow-row)',
        marginTop: '18px',
        ...style,
      }}
    >
      {steps.map((s, i) => {
        const row = Math.floor(i / cols);
        const posInRow = i % cols;
        const rowEven = row % 2 === 0;
        const rowEnd = posInRow === cols - 1;
        const isLast = i === steps.length - 1;
        const visCol = rowEven ? posInRow + 1 : cols - posInRow;
        const arrow = {
          position: 'absolute',
          color: c.solid,
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: '22px',
          lineHeight: 1,
        };
        return (
          <div key={i} style={{ position: 'relative', minWidth: 0, gridColumn: String(visCol), gridRow: String(row + 1) }}>
            <div
              style={{
                height: '100%',
                boxSizing: 'border-box',
                background: 'var(--dba-card)',
                border: '1px solid var(--dba-border)',
                borderRadius: 'var(--radius-xl)',
                borderTop: `3px solid ${c.solid}`,
                padding: '15px 16px',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '27px',
                  height: '27px',
                  padding: '0 9px',
                  borderRadius: '8px',
                  background: c.bg,
                  color: c.solid,
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '13px',
                  marginBottom: '10px',
                }}
              >
                {s.num || ('0' + (i + 1)).slice(-2)}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', lineHeight: 1.3, color: 'var(--dba-ink)', marginBottom: '4px' }}>{s.title}</div>
              {s.text && <p style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: '13px', lineHeight: 1.5, color: 'var(--dba-body)', margin: 0 }}>{s.text}</p>}
            </div>
            {rowEven && !rowEnd && !isLast && <div style={{ ...arrow, right: '-30px', top: '50%', transform: 'translate(-50%,-50%)' }}>→</div>}
            {!rowEven && !rowEnd && !isLast && <div style={{ ...arrow, left: '-30px', top: '50%', transform: 'translate(-50%,-50%)' }}>←</div>}
            {rowEnd && !isLast && <div style={{ ...arrow, left: '50%', bottom: '-30px', transform: 'translate(-50%,50%)' }}>↓</div>}
          </div>
        );
      })}
    </div>
  );
}
