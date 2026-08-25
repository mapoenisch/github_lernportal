import * as React from 'react';

export interface TaskCardProps {
  /** Uppercase label, e.g. "Aufgabe · Task Sheet 1.3.1". */
  label?: React.ReactNode;
  /** Heading, e.g. "Deine Lernziele" / "Euer Auftrag". */
  title?: React.ReactNode;
  /** Goal lines; auto-numbered 01, 02 … in two columns. */
  goals: React.ReactNode[];
  style?: React.CSSProperties;
}

/**
 * Deep-teal "Task Sheet" block closing a lesson — label, title, numbered goals.
 * @startingPoint section="Content" subtitle="Task-sheet goals block" viewport="820x240"
 */
export function TaskCard(props: TaskCardProps): JSX.Element;
