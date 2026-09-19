import React from 'react';

/**
 * DBA SidebarNav — the dark course navigator: brand tile, scrollable module /
 * group / lesson tree, and a progress footer. Self-contained; controlled via
 * activeId + onSelect.
 *
 * modules: [{ label, weeks?, title, groups: [{ id, code, title,
 *   lessons: [{ id, title }] }] }]
 * completed: { [lessonId]: true }
 */
export function SidebarNav({
  modules = [],
  activeId,
  completed = {},
  onSelect,
  brand = 'Digital Sales Academy',
  brandSub = 'Batch 8 · Lernportal',
  accent = 'var(--dba-coral)',
  progress = true,
  style,
}) {
  const [open, setOpen] = React.useState({});
  const toggle = (id) => setOpen((o) => ({ ...o, [id]: o[id] === false ? true : o[id] === undefined ? false : true }));

  let total = 0, done = 0;
  modules.forEach((m) => m.groups.forEach((g) => g.lessons.forEach((l) => { total++; if (completed[l.id]) done++; })));
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <aside style={{ flex: '0 0 var(--sidebar-w)', width: 'var(--sidebar-w)', background: 'var(--dba-shell)', display: 'flex', flexDirection: 'column', height: '100%', borderRight: '1px solid rgba(255,255,255,.05)', ...style }}>
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: 'linear-gradient(140deg,#22707B,#123E45)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '15px', color: '#fff', flex: '0 0 auto' }}>DBA</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', lineHeight: 1.15, color: '#fff', letterSpacing: '-.01em' }}>{brand}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11.5px', lineHeight: 1.2, color: 'var(--dba-on-dark-3)', letterSpacing: '.03em', marginTop: '2px' }}>{brandSub}</div>
        </div>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 8px' }}>
        {modules.map((mod, mi) => (
          <div key={mi}>
            <div style={{ padding: '16px 10px 2px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '11px', letterSpacing: '.12em', textTransform: 'uppercase', color: accent }}>{mod.label}</span>
              {mod.weeks && <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '11px', color: 'var(--dba-on-dark-4)' }}>· {mod.weeks}</span>}
            </div>
            {mod.title && <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '13px', lineHeight: 1.35, color: '#C7CAD2', padding: '0 10px 6px' }}>{mod.title}</div>}
            {mod.groups.map((grp) => {
              const isOpen = open[grp.id] !== false;
              return (
                <div key={grp.id}>
                  <button onClick={() => toggle(grp.id)} style={{ display: 'flex', alignItems: 'center', gap: '9px', width: '100%', textAlign: 'left', border: 0, background: 'transparent', cursor: 'pointer', padding: '8px 10px', borderRadius: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '11px', color: 'var(--dba-on-dark-mint)', minWidth: '24px', flex: '0 0 auto' }}>{grp.code}</span>
                    <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12.5px', lineHeight: 1.35, color: 'var(--dba-on-dark-3)', minWidth: 0 }}>{grp.title}</span>
                    <span style={{ color: '#5A5F6B', fontSize: '10px', flex: '0 0 auto' }}>{isOpen ? '▾' : '▸'}</span>
                  </button>
                  {isOpen && grp.lessons.map((l) => {
                    const isActive = l.id === activeId;
                    const isDone = !!completed[l.id];
                    return (
                      <button
                        key={l.id}
                        onClick={() => onSelect && onSelect(l.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '9px', width: '100%', textAlign: 'left', border: 0, cursor: 'pointer', padding: '8px 10px', borderRadius: '8px', margin: '1px 0', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 500, lineHeight: 1.35, background: isActive ? 'rgba(255,255,255,.08)' : 'transparent', color: isActive ? '#fff' : 'var(--dba-on-dark-2)', boxShadow: isActive ? `inset 2px 0 0 ${accent}` : 'none' }}
                      >
                        <span style={isDone
                          ? { width: '16px', height: '16px', borderRadius: '5px', background: accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', flex: '0 0 auto' }
                          : { width: '16px', height: '16px', borderRadius: '5px', border: `1.5px solid ${isActive ? accent : 'rgba(255,255,255,.16)'}`, flex: '0 0 auto' }}>{isDone ? '✓' : ''}</span>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '10.5px', color: '#6B7080', minWidth: '34px', flex: '0 0 auto' }}>{l.id}</span>
                        <span style={{ flex: 1, minWidth: 0 }}>{l.title}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {progress && (
        <div style={{ flex: '0 0 auto', padding: '15px 18px 18px', borderTop: '1px solid rgba(255,255,255,.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '9px' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '11.5px', color: 'var(--dba-on-dark-2)' }}>Dein Fortschritt</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12px', color: '#fff' }}>{pct}%</span>
          </div>
          <div style={{ height: '6px', borderRadius: '99px', background: 'rgba(255,255,255,.1)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: accent, borderRadius: '99px', transition: 'width var(--dur-med) var(--ease-out)' }} />
          </div>
          <div style={{ marginTop: '9px', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '11.5px', lineHeight: 1.4, color: 'var(--dba-on-dark-4)' }}>{done} von {total} Lektionen abgeschlossen</div>
        </div>
      )}
    </aside>
  );
}
