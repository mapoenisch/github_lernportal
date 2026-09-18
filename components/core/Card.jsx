import React from 'react';

/**
 * DBA Card — the content-column card. Supports a numbered step, an eyebrow,
 * a title and body, plus surface tones.
 * tone: "default" (white) | "teal" | "accent" | "dark"
 */
export function Card({ tone = 'default', num, eyebrow, title, children, style, ...rest }) {
  const dark = tone === 'dark';
  const surfaces = {
    default: { bg: 'var(--dba-card)', border: '1px solid var(--dba-border)' },
    teal: { bg: 'var(--surface-teal)', border: '1px solid var(--surface-teal-border)' },
    accent: { bg: 'var(--surface-accent)', border: '1px solid var(--surface-accent-border)' },
    dark: { bg: 'var(--dba-teal-deep)', border: '0' },
  };
  const s = surfaces[tone] || surfaces.default;
  const titleColor = dark ? '#fff' : 'var(--dba-ink)';
  const textColor = dark ? '#D6E7E3' : 'var(--dba-body)';
  const eyebrowColor = tone === 'teal' ? 'var(--dba-teal)' : dark ? 'var(--dba-teal-light)' : 'var(--dba-muted)';

  return (
    <div
      style={{
        position: 'relative',
        background: s.bg,
        border: s.border,
        borderRadius: 'var(--radius-xl)',
        padding: '22px 24px',
        ...style,
      }}
      {...rest}
    >
      {num && (
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '9px',
            background: dark ? 'rgba(255,255,255,.14)' : 'var(--dba-teal-deep)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '14px',
            marginBottom: '14px',
          }}
        >
          {num}
        </div>
      )}
      {eyebrow && (
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '12px',
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            color: eyebrowColor,
            marginBottom: '10px',
          }}
        >
          {eyebrow}
        </div>
      )}
      {title && (
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'var(--fs-card-title)',
            lineHeight: 1.3,
            color: titleColor,
            margin: children ? '0 0 8px' : '0',
          }}
        >
          {title}
        </div>
      )}
      {children && (
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 'var(--fs-card-body)', lineHeight: 1.6, color: textColor }}>
          {children}
        </div>
      )}
    </div>
  );
}
