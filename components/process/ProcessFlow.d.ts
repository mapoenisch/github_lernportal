import * as React from 'react';

export interface ProcessStep {
  /** Zero-padded number; falls back to position (01, 02 …). */
  num?: string;
  title: React.ReactNode;
  text?: React.ReactNode;
}

export interface ProcessFlowProps {
  steps: ProcessStep[];
  /** Columns before wrapping. @default 4 */
  cols?: number;
  /** Tone family. @default "teal" */
  tone?: 'teal' | 'slate' | 'plum' | 'sky' | 'rose';
  style?: React.CSSProperties;
}

/**
 * Numbered process steps in a continuous snake path (→ across, ↓ at row break, ← back).
 * @startingPoint section="Process" subtitle="Snake step flow with arrows" viewport="820x300"
 */
export function ProcessFlow(props: ProcessFlowProps): JSX.Element;
