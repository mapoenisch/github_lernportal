import * as React from 'react';

export interface DataTableProps {
  /** Column headers (uppercase). First column is ~34% wide. */
  head?: React.ReactNode[];
  /** Rows of cells; first cell of each row renders as a bold label. */
  rows: React.ReactNode[][];
  style?: React.CSSProperties;
}

/** Lightweight comparison table — borderless rows, bold first column, uppercase heads. */
export function DataTable(props: DataTableProps): JSX.Element;
