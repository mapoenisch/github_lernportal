import * as React from 'react';

export interface FunnelStage {
  /** Single letter (e.g. "A" for AIDA). */
  letter?: string;
  num?: string;
  title: React.ReactNode;
  text?: React.ReactNode;
}

export interface FunnelProps {
  stages: FunnelStage[];
  /** @default "teal" */
  tone?: 'teal' | 'slate' | 'plum' | 'sky' | 'rose';
  style?: React.CSSProperties;
}

/**
 * Stacked stages that narrow top→bottom with ↓ connectors — AIDA-style funnels.
 * @startingPoint section="Process" subtitle="Narrowing stage funnel" viewport="700x360"
 */
export function Funnel(props: FunnelProps): JSX.Element;
