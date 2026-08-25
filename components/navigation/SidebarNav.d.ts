import * as React from 'react';

export interface NavLesson {
  id: string;
  title: React.ReactNode;
}
export interface NavGroup {
  id: string;
  /** Short code, e.g. "1.3". */
  code: string;
  title: React.ReactNode;
  lessons: NavLesson[];
}
export interface NavModule {
  /** Uppercase eyebrow, e.g. "Modul 1". */
  label: string;
  /** Optional cadence, e.g. "Woche 1–4". */
  weeks?: string;
  title?: React.ReactNode;
  groups: NavGroup[];
}

export interface SidebarNavProps {
  modules: NavModule[];
  /** Currently selected lesson id. */
  activeId?: string;
  /** Map of completed lesson ids. */
  completed?: Record<string, boolean>;
  onSelect?: (lessonId: string) => void;
  brand?: string;
  brandSub?: string;
  accent?: string;
  /** Show the progress footer. @default true */
  progress?: boolean;
  style?: React.CSSProperties;
}

/**
 * Dark course navigator: brand tile, collapsible module/group/lesson tree, progress footer.
 * @startingPoint section="Navigation" subtitle="Dark course sidebar with progress" viewport="320x640"
 */
export function SidebarNav(props: SidebarNavProps): JSX.Element;
