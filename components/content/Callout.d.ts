import * as React from 'react';

export interface CalloutItem {
  title: React.ReactNode;
  text: React.ReactNode;
}

export interface CalloutProps {
  /** Coral title above the grid. */
  title?: React.ReactNode;
  items: CalloutItem[];
  /** @default 3 */
  cols?: number;
  style?: React.CSSProperties;
}

/** Warm accent-tinted callout box with a coral title and an item grid — for cautions / contrasts. */
export function Callout(props: CalloutProps): JSX.Element;
