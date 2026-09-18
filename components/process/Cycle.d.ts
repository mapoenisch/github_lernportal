import * as React from 'react';

export interface CycleStep {
  num?: string;
  title: React.ReactNode;
  text?: React.ReactNode;
}

export interface CycleProps {
  steps: CycleStep[];
  /** Label shown under the ↻ in the centre. */
  center?: React.ReactNode;
  /** @default "teal" */
  tone?: 'teal' | 'slate' | 'plum' | 'sky' | 'rose';
  style?: React.CSSProperties;
}

/**
 * Steps arranged clockwise on a dashed ring with ▶ chevrons — a recurring loop.
 * @startingPoint section="Process" subtitle="Circular loop with chevrons" viewport="560x560"
 */
export function Cycle(props: CycleProps): JSX.Element;
