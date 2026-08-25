import React from 'react';

/**
 * DBA Chip — a pill used for hero metadata and in-page section jump links.
 * Renders as <a> when `href` is set.
 */
export function Chip({ children, href, icon, style, ...rest }) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '7px',
    padding: '7px 14px',
    border: '1px solid var(--dba-border)',
    borderRadius: 'var(--radius-pill)',
    background: 'var(--dba-card)',
    color: 'var(--dba-body)',
    fontFamily: href ? 'var(--font-display)' : 'var(--font-body)',
    fontWeight: href ? 700 : 600,
    fontSize: href ? '13.5px' : '12.5px',
    lineHeight: 1,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    ...style,
  };
  const El = href ? 'a' : 'span';
  return (
    <El href={href} style={base} {...rest}>
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </El>
  );
}
