import * as React from 'react';

export interface PhaseStep {
  num: string;
  title: React.ReactNode;
  text?: React.ReactNode;
}

export interface PhaseGroup {
  /** Short badge, e.g. "SDR". */
  abbr: string;
  /** Full role / phase name. */
  role: React.ReactNode;
  /** Right-aligned range label, e.g. "Phase 1–3". */
  range?: string;
  tone?: 'teal' | 'slate' | 'plum' | 'sky' | 'rose';
  steps: PhaseStep[];
}

export interface PhaseLaneProps {
  groups: PhaseGroup[];
  style?: React.CSSProperties;
}

/**
 * Grouped process swimlanes — a headed lane per role, its steps in a row (→), ↓ between lanes.
 * @startingPoint section="Process" subtitle="Role swimlanes (SDR / AE / CSM)" viewport="820x420"
 */
export function PhaseLane(props: PhaseLaneProps): JSX.Element;
