import * as React from 'react';

export interface ChipProps {
  children: React.ReactNode;
  /** Render as an anchor (section jump link). */
  href?: string;
  /** Optional leading glyph. */
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Pill for hero metadata and in-page section jump links. */
export function Chip(props: ChipProps): JSX.Element;
