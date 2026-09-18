import React from 'react';

/**
 * DBA Button — primary action button.
 * Variants: "primary" (deep-teal fill), "secondary" (slate fill), "resource"
 * (slate fill + mint icon tile, for opening supporting material).
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  href,
  disabled = false,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);

  const pads = {
    sm: '8px 14px',
    md: '11px 18px',
    lg: '14px 22px',
  };
  const fontSize = { sm: '12.5px', md: '13.5px', lg: '15px' }[size];

  const fills = {
    primary: { bg: 'var(--dba-teal-deep)', bgHover: '#0E3138', fg: '#fff', shadow: 'var(--shadow-teal-hover)' },
    secondary: { bg: '#33415C', bgHover: '#2A374E', fg: '#fff', shadow: 'var(--shadow-button-hover)' },
    resource: { bg: '#33415C', bgHover: '#2A374E', fg: '#fff', shadow: 'var(--shadow-button-hover)' },
  };
  const f = fills[variant] || fills.primary;

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: variant === 'resource' ? '15px' : '8px',
    padding: variant === 'resource' ? '20px 22px' : pads[size],
    border: '0',
    borderRadius: 'var(--radius-md)',
    background: disabled ? '#B7BDC8' : (hover ? f.bgHover : f.bg),
    color: f.fg,
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize,
    textDecoration: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'transform var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)',
    transform: hover && !disabled ? 'translateY(-2px)' : 'none',
    boxShadow: hover && !disabled ? f.shadow : 'none',
    ...style,
  };

  const El = href ? 'a' : 'button';
  const handlers = disabled
    ? {}
    : { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), onClick };

  return (
    <El href={href} style={base} {...handlers} {...rest}>
      {variant === 'resource' && (
        <span
          style={{
            flex: '0 0 auto',
            width: '46px',
            height: '46px',
            borderRadius: '13px',
            background: '#A9B6D4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '21px',
            color: '#33415C',
          }}
        >
          {icon || '↗'}
        </span>
      )}
      {variant !== 'resource' && icon && <span aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </El>
  );
}
