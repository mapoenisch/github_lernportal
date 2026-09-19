import * as React from 'react';

export interface QuoteBlockProps {
  /** Small uppercase label, e.g. "Beispiel-SLA". */
  label?: React.ReactNode;
  children: React.ReactNode;
  /** Optional attribution name. */
  author?: React.ReactNode;
  /** Optional role after the author. */
  role?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Teal-tinted quote / worked-example box with an optional label and author line. */
export function QuoteBlock(props: QuoteBlockProps): JSX.Element;
