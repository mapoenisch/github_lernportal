import * as React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  /** Visual style. @default "primary" */
  variant?: 'primary' | 'secondary' | 'resource';
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Leading glyph (Unicode icon). For "resource" it fills the mint tile. */
  icon?: React.ReactNode;
  /** Render as <a> when set. */
  href?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

/**
 * Primary action button. Deep-teal fill by default; hover lifts with a soft shadow.
 * @startingPoint section="Core" subtitle="Primary / secondary / resource button" viewport="700x150"
 */
export function Button(props: ButtonProps): JSX.Element;
