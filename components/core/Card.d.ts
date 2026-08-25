import * as React from 'react';

export interface CardProps {
  /** Surface variant. @default "default" */
  tone?: 'default' | 'teal' | 'accent' | 'dark';
  /** Zero-padded step number, e.g. "01". Renders a deep-teal tile. */
  num?: string;
  /** Small uppercase eyebrow above the title. */
  eyebrow?: string;
  title?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Content-column card: white by default, with teal / accent tint or deep-teal variants.
 * @startingPoint section="Core" subtitle="Content card with tones" viewport="700x220"
 */
export function Card(props: CardProps): JSX.Element;
