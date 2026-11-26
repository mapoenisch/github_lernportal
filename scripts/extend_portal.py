#!/usr/bin/env python3
"""Erweitert DC-Quellen und beide HTML-Bundles aus den Kursdaten in content/.

Die HTML-Einstiege enthalten Lektionen und Quizzes. LeadPilot-Projektdateien
werden über relative Links aus assets/leadpilot geladen.
"""
import argparse
import base64
import gzip
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
START = '// BEGIN KURS-FORTSETZUNG\n'
END = '// END KURS-FORTSETZUNG\n'
SCRIPT = re.compile(r'(<script type="text/x-dc"[^>]*>)(.*?)(</script>)', re.S)

def replace_section(doc, kind, value):
    pattern = re.compile(r'(<script type="__bundler/' + kind + r'">)(.*?)(</script>)', re.S)
    payload = json.dumps(value, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\u002F')
    return pattern.sub(lambda m: m[1] + '\n' + payload + '\n  ' + m[3], doc, count=1)

def read_section(doc, kind):
    return json.loads(re.search(r'<script type="__bundler/' + kind + r'">(.*?)</script>', doc, re.S)[1])

# Volltextsuche: durchsucht Lektionen, HubSpot, Unternehmensprojekt, Kompakt und Glossar.
SEARCH_START = '  // BEGIN SUCHE\n'
SEARCH_END = '  // END SUCHE\n'
SEARCH_METHODS = SEARCH_START + r'''  searchFold(text) {
    let out = '';
    const map = [];
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      const f = c < '\u0080' ? c.toLowerCase() : c.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/ß/g, 'ss');
      for (let k = 0; k < f.length; k++) { out += f[k]; map.push(i); }
    }
    return { out, map };
  }
  searchText(value, out) {
    const skip = { t:1, tone:1, icon:1, href:1, src:1, cols:1, maxW:1, id:1, to:1, mono:1, download:1, num:1 };
    if (typeof value === 'string') {
      if (!/^(assets\/|data:|https?:|#)/.test(value)) out.push(value);
    } else if (Array.isArray(value)) {
      value.forEach(v => this.searchText(v, out));
    } else if (value && typeof value === 'object') {
      for (const k of Object.keys(value)) if (!skip[k]) this.searchText(value[k], out);
    }
    return out;
  }
  searchIndex() {
    if (this._searchIndex) return this._searchIndex;
    const entries = [];
    const add = (entry, parts) => {
      const text = parts.filter(Boolean).join(' · ').replace(/\s+/g, ' ');
      entries.push(Object.assign(entry, { text, fold: this.searchFold(text), titleFold: this.searchFold(entry.title + ' ' + entry.code).out }));
    };
    const lessonText = id => { const c = this.CONTENT[id] || {}; return this.searchText([c.hero, c.sections], []); };
    for (const mod of this.CURR) for (const grp of mod.groups) for (const l of grp.lessons) {
      add({ label: mod.label + ' · ' + l.id, code: l.id, title: l.title, lessonId: l.id, go: () => this.select(l.id) }, lessonText(l.id));
    }
    for (const h of this.HUB) {
      add({ label: 'HubSpot · ' + h.code, code: h.code, title: h.title, lessonId: h.id, go: () => this.select(h.id) }, lessonText(h.id));
    }
    if (this.CONTENT.projekt) add({ label: 'Unternehmensprojekt', code: 'LeadPilot', title: 'Meine Geschäftsidee – Entwicklung', go: () => this.select('projekt') }, lessonText('projekt'));
    const kompakt = this.CONTENT.kompakt;
    (kompakt ? kompakt.sections : []).forEach((sec, i) => {
      const sid = 'sec' + i;
      if (sec.title !== 'Glossar') {
        const code = (this.COMPACT[i] || {}).code || '';
        add({ label: 'Kompakt' + (code ? ' · ' + code : ''), code, title: sec.title, go: () => this.selectCompactSection(sid, 0) }, this.searchText(sec.blocks, []));
        return;
      }
      let heading = -1;
      for (const b of sec.blocks) {
        if (b.t === 'heading') { heading++; continue; }
        const hi = Math.max(heading, 0);
        for (const item of (b.items || [])) {
          add({ label: 'Glossar', code: '', title: item.title, go: () => this.selectCompactSection(sid, hi) }, [item.title, item.text]);
        }
      }
    });
    this._searchIndex = entries;
    return entries;
  }
  searchHits(query) {
    const terms = this.searchFold(query).out.split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    const hits = [];
    this.searchIndex().forEach((e, order) => {
      if (!terms.every(t => e.titleFold.includes(t) || e.fold.out.includes(t))) return;
      hits.push({ e, order, score: terms.filter(t => e.titleFold.includes(t)).length });
    });
    hits.sort((a, b) => b.score - a.score || a.order - b.order);
    return hits.map(({ e }) => {
      let pre = e.text.slice(0, 140), hit = '', post = e.text.length > 140 ? '…' : '';
      for (const t of terms) {
        const pos = e.fold.out.indexOf(t);
        if (pos < 0) continue;
        const from = e.fold.map[pos], to = e.fold.map[pos + t.length - 1] + 1;
        const start = Math.max(0, from - 60), end = Math.min(e.text.length, to + 90);
        pre = (start > 0 ? '…' : '') + e.text.slice(start, from);
        hit = e.text.slice(from, to);
        post = e.text.slice(to, end) + (end < e.text.length ? '…' : '');
        break;
      }
      return { entry: e, pre, hit, post };
    });
  }
''' + SEARCH_END

SEARCH_VALS = r'''      searchHasQuery: q.length > 0,
      searchSummary: q.length < 2 ? 'Mindestens zwei Zeichen eingeben' : (searchHits.length ? (searchHits.length === 1 ? '1 Treffer' : searchHits.length + ' Treffer') + (searchHits.length > 40 ? ' · die ersten 40' : '') : 'Keine Treffer für „' + this.state.query.trim() + '“'),
      searchResults: searchHits.slice(0, 40).map((h, i) => ({ key: i, label: h.entry.label, title: h.entry.title, pre: h.pre, hit: h.hit, post: h.post, onClick: () => { this.setState({ query: '' }); h.entry.go(); } })),
      onSearchClear: () => this.setState({ query: '' }),
      onSearchKey: (e) => {
        if (e.key === 'Escape') this.setState({ query: '' });
        if (e.key === 'Enter' && searchHits.length) { this.setState({ query: '' }); searchHits[0].entry.go(); }
      },
'''

def apply_search(code):
    code = re.sub(r'  // BEGIN SUCHE\n.*?  // END SUCHE\n', '', code, flags=re.S)
    anchor = '  select(id) {\n'
    if code.count(anchor) != 1:
        raise ValueError('Such-Anker select(id) fehlt oder ist mehrdeutig')
    code = code.replace(anchor, SEARCH_METHODS + anchor)
    code = re.sub(r'    const searchHits = q\.length >= 2 .*?\n    const searchIds = .*?\n', '', code)
    code = code.replace(
        "    const q = (this.state.query || '').trim().toLowerCase();\n",
        "    const q = (this.state.query || '').trim().toLowerCase();\n"
        "    const searchHits = q.length >= 2 ? this.searchHits(q) : [];\n"
        "    const searchIds = new Set(searchHits.map(h => h.entry.lessonId).filter(Boolean));\n",
    )
    code = code.replace(
        'grp.lessons.filter(l => !q || l.title.toLowerCase().includes(q) || l.id.toLowerCase().includes(q))',
        'grp.lessons.filter(l => q.length < 2 || searchIds.has(l.id))',
    )
    code = code.replace(
        'const hubLessons = this.HUB.map(h => {',
        'const hubLessons = this.HUB.filter(h => q.length < 2 || searchIds.has(h.id)).map(h => {',
    )
    old_vals = '      onSearch: (e) => this.setState({ query: e.target.value }),\n'
    if code.count(old_vals) != 1:
        raise ValueError('Such-Anker onSearch fehlt')
    code = re.sub(r'(      onSearch: \(e\) => this\.setState\(\{ query: e\.target\.value \}\),\n)(?:      searchHasQuery:.*?\n      \},\n)?',
                  lambda m: m[1] + SEARCH_VALS, code, count=1, flags=re.S)
    return code

SEARCH_TEMPLATE = '''        <!-- BEGIN SUCHE -->
        <sc-if value="{{ searchHasQuery }}" hint-placeholder-val="{{ false }}">
          <div>
            <button onClick="{{ onSearchClear }}" title="Suche leeren" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);width:26px;height:26px;border:0;border-radius:7px;background:transparent;color:#9AA0AC;cursor:pointer;font:600 18px/1 'Public Sans',sans-serif" style-hover="background:#F0EEE8;color:#1A1D24">×</button>
            <div style="position:absolute;top:48px;right:0;width:460px;max-width:calc(100vw - 32px);max-height:70vh;overflow-y:auto;background:#fff;border:1px solid #E4E1D9;border-radius:14px;box-shadow:0 18px 40px rgba(20,23,30,.14);padding:8px;z-index:40">
              <div style="padding:8px 10px 6px;font:800 11px/1.3 'Archivo',sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#9AA0AC">{{ searchSummary }}</div>
              <sc-for list="{{ searchResults }}" as="r" hint-placeholder-count="3">
                <button onClick="{{ r.onClick }}" style="display:block;width:100%;text-align:left;border:0;background:transparent;cursor:pointer;padding:10px;border-radius:10px" style-hover="background:#F5F4F0">
                  <span style="display:block;font:800 10.5px/1 'Archivo',sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#E4694B;margin-bottom:6px">{{ r.label }}</span>
                  <span style="display:block;font:700 14px/1.35 'Archivo',sans-serif;color:#14171E">{{ r.title }}</span>
                  <span style="display:block;margin-top:4px;font:400 12.5px/1.5 'Public Sans',sans-serif;color:#565C69">{{ r.pre }}<span style="background:#FBE3DA;color:#14171E;border-radius:3px;padding:0 2px">{{ r.hit }}</span>{{ r.post }}</span>
                </button>
              </sc-for>
            </div>
          </div>
        </sc-if>
        <!-- END SUCHE -->
'''

def apply_search_template(doc):
    doc = re.sub(r'        <!-- BEGIN SUCHE -->\n.*?        <!-- END SUCHE -->\n', '', doc, flags=re.S)
    # Im HTML-Bundle stehen camelCase-Attribute als sc-camel-on-… (z. B. onClick → sc-camel-on-click).
    bundled = 'sc-camel-on-change="{{ onSearch }}"' in doc
    on_change, on_key, on_click = (('sc-camel-on-change', 'sc-camel-on-key-down', 'sc-camel-on-click') if bundled
                                   else ('onChange', 'onKeyDown', 'onClick'))
    doc = doc.replace(
        f'<input value="{{{{ query }}}}" {on_change}="{{{{ onSearch }}}}" placeholder="Lektionen durchsuchen …" style="width:100%;height:40px;padding:0 14px 0 38px;',
        f'<input value="{{{{ query }}}}" {on_change}="{{{{ onSearch }}}}" {on_key}="{{{{ onSearchKey }}}}" placeholder="Alle Inhalte durchsuchen …" style="width:100%;height:40px;padding:0 36px 0 38px;',
    )
    if 'placeholder="Alle Inhalte durchsuchen …"' not in doc:
        raise ValueError('Suchfeld im Template nicht gefunden')
    glyph = '''pointer-events:none">⌕</span>\n'''
    if doc.count(glyph) != 1:
        raise ValueError('Such-Anker im Template fehlt')
    return doc.replace(glyph, glyph + SEARCH_TEMPLATE.replace('onClick=', on_click + '='))

# Glossar: eigener Punkt in der Seitenleiste und hervorgehobener Abschnitt auf der Kompaktseite.
GLOSSARY_NAV = """    // BEGIN GLOSSAR-NAV
    const glossaryEntry = this.COMPACT.find(g => g.glossary);
    const glossaryOpen = !!openGroups['nav-glossar'];
    const glossaryActive = active === 'kompakt' && !!glossaryEntry && !!(this.state.compactOpen || {})[glossaryEntry.id];
    const glossaryNav = {
      open: glossaryOpen,
      caret: glossaryOpen ? '▾' : '▸',
      rowStyle: { display:'flex', alignItems:'center', gap:'9px', width:'100%', textAlign:'left', border:0, cursor:'pointer', padding:'8px 10px', borderRadius:'8px', background: glossaryActive ? 'rgba(255,255,255,0.08)' : 'transparent', boxShadow: glossaryActive ? ('inset 2px 0 0 ' + accent) : 'none' },
      onClick: () => {
        if (!glossaryEntry) return;
        if (glossaryOpen && glossaryActive) { this.toggleNav('nav-glossar'); return; }
        this.setState(s => ({ openGroups: { ...s.openGroups, 'nav-glossar': true } }));
        this.selectCompactSection(glossaryEntry.id, 0);
      },
      subs: (glossaryEntry ? glossaryEntry.subs : []).map((title, si) => ({ title, onClick: () => this.selectCompactSection(glossaryEntry.id, si) })),
    };
    // END GLOSSAR-NAV
"""

GLOSSARY_STYLE = [
    ("      const sid = 'sec' + i;\n      const open = isAcc",
     "      const sid = 'sec' + i;\n      const isGlossary = isAcc && !!s.glossary;\n      const open = isAcc"),
    ("anchorStyle:{ scrollMarginTop:'88px', marginTop: i === 0 ? '56px' : '64px' },",
     "anchorStyle:{ scrollMarginTop:'88px', marginTop: i === 0 ? '56px' : (isGlossary ? '96px' : '64px') },"),
    ("hasEyebrow:!!s.eyebrow, eyebrow:s.eyebrow || '',",
     "hasEyebrow:!!s.eyebrow || isGlossary, eyebrow: isGlossary ? 'Nachschlagewerk · Begriffe von A bis Z' : (s.eyebrow || ''),"),
    ("isAcc ? { font:\"800 22px/1.25 'Archivo',sans-serif\", color:'#14171E',",
     "isAcc ? { font:\"800 22px/1.25 'Archivo',sans-serif\", color: isGlossary ? '#ffffff' : '#14171E',"),
    ("background:'#fff', border:'1px solid #E4E1D9', borderRadius:'16px', padding:'20px 24px' }",
     "background: isGlossary ? '#123E45' : '#fff', border: isGlossary ? '1px solid #123E45' : '1px solid #E4E1D9', borderRadius:'16px', padding: isGlossary ? '24px 24px' : '20px 24px' }"),
    ("borderRadius:'9px', background:'#F5F4F0', color:'#565C69'",
     "borderRadius:'9px', background: isGlossary ? 'rgba(255,255,255,.14)' : '#F5F4F0', color: isGlossary ? '#ffffff' : '#565C69'"),
]

def apply_glossary(code):
    code = re.sub(r'    // BEGIN GLOSSAR-NAV\n.*?    // END GLOSSAR-NAV\n', '', code, flags=re.S)
    anchor = '    const hubLessons = '
    if code.count(anchor) != 1:
        raise ValueError('Glossar-Anker hubLessons fehlt')
    code = code.replace(anchor, GLOSSARY_NAV + anchor)
    code = code.replace('groups: this.COMPACT.map(g => {', 'groups: this.COMPACT.filter(g => !g.glossary).map(g => {')
    if 'glossaryNav,\n' not in code:
        code = code.replace('      compactNav,\n', '      compactNav,\n      glossaryNav,\n')
    for old, new in GLOSSARY_STYLE:
        if new not in code:
            if code.count(old) != 1:
                raise ValueError('Glossar-Stil-Anker fehlt: ' + old[:40])
            code = code.replace(old, new)
    return code

GLOSSARY_TEMPLATE = """      <!-- BEGIN GLOSSAR-NAV -->
      <div style="margin:20px 10px 12px;height:1px;background:rgba(255,255,255,.09)"></div>
      <div style="padding:2px 10px 8px;display:flex;align-items:baseline;gap:8px">
        <span style="font:800 11px/1 'Archivo',sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#E4694B">Glossar</span>
        <span style="font:600 11px/1 'Public Sans',sans-serif;color:#666B79">· Begriffe nachschlagen</span>
      </div>
      <button onClick="{{ glossaryNav.onClick }}" style="{{ glossaryNav.rowStyle }}" style-hover="background:rgba(255,255,255,0.05)">
        <span style="flex:0 0 auto;width:26px;height:26px;border-radius:8px;background:rgba(127,199,185,.16);display:flex;align-items:center;justify-content:center;font:800 10px 'Archivo',sans-serif;color:#7FC7B9;letter-spacing:-.02em">A–Z</span>
        <span style="flex:1;font:700 13px/1.35 'Public Sans',sans-serif;color:#C7CAD2">Alle Begriffe von A bis Z</span>
        <span style="color:#5A5F6B;font-size:10px;flex:0 0 auto">{{ glossaryNav.caret }}</span>
      </button>
      <sc-if value="{{ glossaryNav.open }}" hint-placeholder-val="{{ false }}">
        <div style="padding:2px 0 4px 0;margin:2px 0 4px 22px;border-left:1px solid rgba(255,255,255,.08)">
          <sc-for list="{{ glossaryNav.subs }}" as="gs" hint-placeholder-count="3">
            <button onClick="{{ gs.onClick }}" style="display:flex;align-items:center;width:100%;text-align:left;border:0;background:transparent;cursor:pointer;padding:7px 10px;border-radius:8px;margin-top:1px;font:500 12.5px/1.35 'Public Sans',sans-serif;color:#AEB3BE" style-hover="background:rgba(255,255,255,0.05);color:#fff">
              <span style="flex:1;min-width:0">{{ gs.title }}</span>
            </button>
          </sc-for>
        </div>
      </sc-if>
      <!-- END GLOSSAR-NAV -->
"""

def apply_glossary_template(doc):
    doc = re.sub(r'      <!-- BEGIN GLOSSAR-NAV -->\n.*?      <!-- END GLOSSAR-NAV -->\n', '', doc, flags=re.S)
    anchor = '      <div style="height:12px"></div>\n    </nav>'
    if doc.count(anchor) != 1:
        raise ValueError('Glossar-Anker im Template fehlt')
    bundled = 'sc-camel-on-change="{{ onSearch }}"' in doc
    block = GLOSSARY_TEMPLATE.replace('onClick=', 'sc-camel-on-click=') if bundled else GLOSSARY_TEMPLATE
    return doc.replace(anchor, block + anchor)


# Zertifizierungstrainer: eigene App unter zertifizierungstrainer/, als letzter Eintrag der Seitenleiste.
TRAINER_TEMPLATE = """      <!-- BEGIN TRAINER-NAV -->
      <div style="margin:20px 10px 12px;height:1px;background:rgba(255,255,255,.09)"></div>
      <a href="zertifizierungstrainer/index.html" style="display:flex;align-items:center;gap:9px;width:100%;text-decoration:none;padding:9px 10px;border-radius:8px;background:rgba(255,212,0,.08)" style-hover="background:rgba(255,212,0,.16)">
        <span style="flex:0 0 auto;width:26px;height:26px;border-radius:8px;background:#FFD400;display:flex;flex-direction:column;justify-content:center;gap:3px;padding:0 6px"><span style="display:block;height:2px;background:#111"></span><span style="display:block;height:2px;background:#111"></span><span style="display:block;height:2px;width:60%;background:#111"></span></span>
        <span style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px"><span style="font:700 13px/1.3 'Public Sans',sans-serif;color:#F1F2F4">Zertifizierungstrainer</span><span style="font:500 11.5px/1.3 'Public Sans',sans-serif;color:#8A8F9C">139 Begriffe · Sprint oder 3 Wochen</span></span>
        <span style="color:#FFD400;font:700 13px 'Archivo',sans-serif;flex:0 0 auto">›</span>
      </a>
      <!-- END TRAINER-NAV -->
"""

def apply_trainer_template(doc):
    doc = re.sub(r'      <!-- BEGIN TRAINER-NAV -->\n.*?      <!-- END TRAINER-NAV -->\n', '', doc, flags=re.S)
    anchor = '      <div style="height:12px"></div>\n    </nav>'
    if doc.count(anchor) != 1:
        raise ValueError('Trainer-Anker im Template fehlt')
    return doc.replace(anchor, TRAINER_TEMPLATE + anchor)


def patch_trainer_nav():
    for f in ['Lernportal.dc.html', 'Lernportal-standalone.dc.html']:
        p = ROOT / f
        p.write_text(apply_trainer_template(p.read_text()))
    for f in ['index.html', 'DBA Lernportal (offline).html']:
        p = ROOT / f
        doc = p.read_text()
        p.write_text(replace_section(doc, 'template', apply_trainer_template(read_section(doc, 'template'))))
    print('Trainer-Eintrag in vier HTML-Einstiege gesetzt.')


def build():
    data = json.loads((ROOT / 'content/continuation.json').read_text())
    job = json.loads((ROOT / 'content/job-preparation.json').read_text())
    lessons = data['lessons']
    job_lessons = job['lessons']
    all_lessons = lessons + job_lessons
    content = {l['id']: {k: l[k] for k in ('hero', 'sections')} for l in all_lessons}

    leadpilot = Path('assets/leadpilot')

    def link(href, label):
        suffix = href.suffix.lower()
        if not (ROOT / href).is_file():
            raise ValueError(f'LeadPilot-Projektdatei fehlt: {href}')
        return {'t': 'button', 'label': label, 'href': href.as_posix(),
                'download': suffix in ('.pptx', '.xlsx', '.md'), 'resourceLabel': 'LeadPilot · ' + suffix[1:].upper(),
                'sub': 'Fiktives Unternehmensprojekt'}

    def pitch(filename, label):
        return link(leadpilot / 'pitch' / filename, label)

    customer_links = [
        pitch('LeadPilot Final Pitch-Deck Weidner.pdf', 'Komplettes Kunden-Pitchdeck ansehen · PDF'),
        pitch('pitch-cockpit.html', 'Pitch-Cockpit öffnen'),
    ]
    team_links = [
        pitch('Teampitch-Deck final mit Schlussfolie.pptx', 'Komplettes finales Team-Pitchdeck herunterladen · PowerPoint'),
        pitch('Team-Pitch Dossier LeadPilot1.pdf', 'Vollständiges Team-Pitch-Dossier ansehen · PDF'),
        pitch('Teleprompter LeadPilot.html', 'LeadPilot-Teleprompter öffnen'),
        pitch('Präsentation-Entwurfsskizzen1.pptx', 'Entwurfsskizzen herunterladen · PowerPoint'),
        pitch('LeadPilot Zoom-Hintergrund 1920x1080.png', 'LeadPilot-Zoom-Hintergrund öffnen'),
    ]
    lesson_links = {'2.8.6': customer_links, '2.9.5': team_links}
    lessons_dir = leadpilot / 'lektionen'
    for code in content:
        paths = sorted(p.relative_to(ROOT) for p in (ROOT / lessons_dir / code).iterdir()
                       if p.is_file() and not p.name.startswith('.')) if (ROOT / lessons_dir / code).is_dir() else []
        blocks = lesson_links.get(code, []) + [link(path, path.stem) for path in paths]
        if blocks:
            content[code]['sections'].append({'eyebrow': 'Projektarchiv', 'title': 'LeadPilot-Projektdateien',
                                              'pill': 'Projektarchiv', 'blocks': blocks})

    project_sections = [
        {'eyebrow':'Pitch-Entwicklung · 2.8','title':'Kunden-Pitch: Weidner','pill':'12 · Kunden-Pitch','blocks':[
            {'t':'lead','text':'Die Verkaufspräsentation verdichtet das Projekt auf die Sicht von Jens Hartwig: liegen gebliebene Messekontakte, klare Zuständigkeiten und ein nächster Schritt im CRM. Der vollständige Kunden-Pitch schließt den Abschnitt 2.8 ab.'},
            {'t':'flow','cols':2,'steps':[{'num':'01','title':'Fundament','text':'ICP, Persona und die stärksten Nutzenargumente sammeln.'},{'num':'02','title':'Geschichte','text':'Situation, Complication und Resolution zum Drehbuch verbinden.'},{'num':'03','title':'Deck und Probe','text':'Action Titles, klare Visuals und ein gemessener Probelauf.'},{'num':'04','title':'Pitch-Day 1','text':'Feedback nutzen und das finale Deck ablegen.'}]},
            customer_links[0],
            {'t':'golink','to':'2.8.6','label':'Zu 2.8.6 Pitch-Day 1','sub':'Deck, Pitch-Cockpit und Wissenscheck'}]},
        {'eyebrow':'Pitch-Entwicklung · 2.9','title':'Die gemeinsame Vertriebsstrategie','pill':'13 · Team-Strategie','blocks':[
            {'t':'lead','text':'Im Team-Projekt führen Patrick, André und Marc die Idee mit Content, Outreach, Priorisierung und Erfolgsmessung zusammen. Persona und Zielunternehmen sind Teil der fiktiven Fallstudie Weidner.'},
            {'t':'table','head':['Etappe','Ergebnis im Projekt'],'rows':[['2.9.1 · Kickoff','Gemeinsame B2B-Idee, ICP, Persona Jens Hartwig, Hero Statement und USP.'],['2.9.2 · Content','Infografik für Awareness, Workflow für Consideration, Demo-Angebot für Decision.'],['2.9.3 · Outreach','Sequenz über E-Mail, LinkedIn und Telefon samt Nachrichten, Prioritäten und Stopp-Regeln.'],['2.9.4 · Funnel & KPIs','Definierte Übergänge und Kennzahlen mit Zeitraum, Nenner und Messplan.'],['2.9.5 · Pitch-Day 2','Deck finalisieren, gemeinsam proben und die Strategie vor der Jury erklären.']]},
            {'t':'note','text':'Die Q3-Zahlen im Teamdeck sind Szenariodaten: 650 Leads, 210 MQL, 75 SQL, 36 Angebote und 16 Neukunden. 16/36 ergeben rund 44,4 % Angebotsabschlussquote. 16/58 gestarteten Teamtests ergeben rund 27,6 % Trial-to-Paid. Sie belegen keinen realen Geschäftsbetrieb.'}]},
        {'eyebrow':'Projektarchiv · 2.9','title':'Vollständiges Teamdeck & Dossier','pill':'14 · Team-Pitch','blocks':[
            {'t':'lead','text':'Das finale Deck mit Schlussfolie zeigt die verdichtete Geschichte. Das vollständige Dossier bewahrt die Herleitung zu Persona, Content, Nachrichten, Lead-Priorisierung, Funnel, KPIs und Design. Im Abschluss findest du zusätzlich Teleprompter, Hintergrund und Entwurfsskizzen.'},
            *team_links[:2],
            {'t':'golink','to':'2.9.5','label':'Zu 2.9.5 Pitch-Day 2','sub':'Finalisierung, Generalprobe, vollständige Materialien und Quiz'},
            {'t':'heading','text':'Versionen und Rechenannahmen'},
            {'t':'note','text':'Das finale Teamdeck hat zwölf Folien; im Dossier steht noch die frühere Planung mit 15. Die 150.000-€-Rechnung nutzt ebenfalls verschiedene Annahmen: Kunden-Deck und Dossier rechnen 3 Messen × 2 mögliche Aufträge × 25.000 €, das Teamdeck 60 offene Kontakte × 25 % × 10.000 €. Die Originale bleiben unverändert. Das Ergebnis ist Fallpotenzial, kein nachgewiesener Verlust.'},
            {'t':'note','text':'Preise, Referenzgeschichten und Funktionsbeschreibungen gehören zum jeweiligen historischen Projektstand. Sie bestätigen weder aktuelle Produktpreise noch geprüfte Integrationen.'}]}
    ]
    groups = [
        {'id':'2.8','code':'2.8','title':'Kunden-Pitch','lessons':[{'id':l['id'],'title':l['title']} for l in lessons if l['id'].startswith('2.8.')]},
        {'id':'2.9','code':'2.9','title':'Team-Pitch','lessons':[{'id':l['id'],'title':l['title']} for l in lessons if l['id'].startswith('2.9.')]}
    ]
    job_groups = [
        {'id': code, 'code': code, 'title': title,
         'lessons': [{'id': lesson['id'], 'title': lesson['title']} for lesson in job_lessons
                     if lesson['id'].startswith(code + '.')]}
        for code, title in job['groups'].items()
    ]
    payload = {
        'lessons': content, 'groups': groups,
        'kam': [{'id': l['id'], 'title': l['title']} for l in lessons if l['id'].startswith('2.7.')],
        'bedarf': {'id': '2.5', 'code': '2.5', 'title': 'Bedarfsanalyse Deep Dive',
                   'lessons': [{'id': l['id'], 'title': l['title']} for l in lessons if l['id'].startswith('2.5.')]},
        'recap': [{'id': l['id'], 'title': l['title']} for l in lessons if l['id'].startswith('2.6.')],
        'project': project_sections,
        'job': {'id': 'm4', 'label': 'Modul 4', 'title': 'Arbeitsmarktvorbereitung', 'weeks': '', 'groups': job_groups},
        'compact': job['compact'],
        'glossary': json.loads((ROOT / 'content/glossary.json').read_text()),
    }
    js = '    '+START+'    const continuation = '+json.dumps(payload,ensure_ascii=False,separators=(',',':'))+';\n'
    js += '''    const moduleTwo = this.CURR.find(m => m.id === 'm2');
    moduleTwo.groups.find(g => g.id === '2.7').lessons.push(...continuation.kam);
    moduleTwo.groups.push(...continuation.groups);
    // 2.5 vor die HubSpot-Prüfungsvorbereitung, 2.6.3 zwischen 2.6.2 und 2.6.4 einsortieren.
    const recapIndex = moduleTwo.groups.findIndex(g => g.id === '2.6');
    moduleTwo.groups.splice(recapIndex, 0, continuation.bedarf);
    const recapLessons = moduleTwo.groups[recapIndex + 1].lessons;
    for (const l of continuation.recap) {
      const at = recapLessons.findIndex(x => x.id > l.id);
      recapLessons.splice(at < 0 ? recapLessons.length : at, 0, l);
    }
    Object.assign(this.CONTENT, continuation.lessons);
    this.CONTENT.projekt.sections.push(...continuation.project);
    this.CONTENT.projekt.hero.desc += ' Die abschließenden Projektetappen zeigen den Kunden-Pitch und die gemeinsame Team-Vertriebsstrategie mit vollständigen Decks und Dossier.';
    this.CURR.push(continuation.job);
    const compact = this.CONTENT.kompakt;
    const glossary = compact.sections.pop();
    this.COMPACT.pop();
    for (const { title, blocks } of continuation.compact) {
      const index = compact.sections.length;
      const code = String(index + 1).padStart(2, '0');
      const label = code + ' · ' + title;
      compact.sections.push({ title, blocks, eyebrow: label, pill: label });
      this.COMPACT.push({ id: 'sec' + index, code, title, subs: blocks.filter(b => b.t === 'heading').map(b => b.text) });
    }
    const compactCount = compact.sections.length;
    compact.hero.desc = compactCount + ' aufklappbare Abschnitte und ein Glossar zum Nachschlagen vor Prüfungen und Bewerbungsgesprächen.';
    compact.hero.chips[0] = compactCount + ' Abschnitte + Glossar';
    const glossaryHeadings = glossary.blocks.filter(b => b.t === 'heading');
    const glossaryLists = glossary.blocks.filter(b => b.items);
    for (const [index, [title, entries]] of Object.entries(continuation.glossary).entries()) {
      glossaryHeadings[index].text = title;
      const list = glossaryLists[index];
      list.items.push(...entries.map(([entry, text]) => ({ title: entry, text })));
      list.items.sort((a, b) => a.title.localeCompare(b.title, 'de'));
    }
    compact.sections.push({ ...glossary, title: 'Glossar', eyebrow: '', pill: 'Glossar', glossary: true });
    this.COMPACT.push({ id: 'sec' + compactCount, code: '', title: 'Glossar', glossary: true, subs: glossaryHeadings.map(b => b.text) });
    const overview = compact.sections[0].blocks.find(b => b.t === 'checklist');
    overview.items.push(
      { title: 'Key Accounts, Customer Support & Pitch', text: 'Bestandskunden entwickeln, Support organisieren und eine Vertriebsstrategie präsentieren.' },
      { title: 'Arbeitsmarktvorbereitung', text: 'Sales-Rollen vergleichen, Lebenslauf zuschneiden und Vorstellungsgespräche vorbereiten.' }
    );
    // END KURS-FORTSETZUNG
'''
    def transform(doc):
        def update(m):
            code = re.sub(r'    // BEGIN KURS-FORTSETZUNG\n.*?    // END KURS-FORTSETZUNG\n', '', m[2], flags=re.S)
            code = re.sub(r'  // BEGIN SUCHE\n.*?  // END SUCHE\n', '', code, flags=re.S)
            anchor = '  }\n\n  select(id) {'
            if code.count(anchor)!=1:raise ValueError('Konstruktor-Anker fehlt oder ist mehrdeutig')
            code = code.replace(anchor,js+anchor)
            code = code.replace('onOpen: isPdf ? undefined', 'onOpen: (isPdf || b.download) ? undefined')
            code = code.replace('isButton:true, label:b.label', "isButton:true, resourceLabel:b.resourceLabel || 'Zusatzmaterial · Infografik', label:b.label")
            code = code.replace(
                "flex: i === 0 ? '0 0 34%' : '1 1 0', paddingRight:",
                "flex: i === 0 ? '0 0 34%' : '1 1 0', minWidth:0, overflowWrap:'anywhere', paddingRight:",
            )
            code = apply_search(code)
            code = apply_glossary(code)
            return m[1]+code+m[3]
        # Nur die feste Beschriftung im Template ersetzen, nicht den Default im JS.
        doc=doc.replace('>Zusatzmaterial · Infografik</', '>{{ b.resourceLabel }}</')
        doc=doc.replace('>· {{ mod.weeks }}</', '>{{ mod.weeksLabel }}</')
        doc=doc.replace('weeks:mod.weeks, groups', "weeksLabel: mod.weeks ? '· ' + mod.weeks : '', groups")
        doc=apply_search_template(doc)
        doc=apply_glossary_template(doc)
        doc=apply_trainer_template(doc)
        return SCRIPT.sub(update,doc,count=1)
    for f in ['Lernportal.dc.html','Lernportal-standalone.dc.html']:
        p=ROOT/f;p.write_text(transform(p.read_text()))
    # Die bekannte Grundversion enthält dieselbe DC-Komponente plus eingebettete Runtime und Schriften.
    original=(ROOT/'index.html').read_text()
    manifest=read_section(original,'manifest')
    quiz_path=ROOT/'quizData.js'
    quiz=re.sub(r'\n// BEGIN KURS-QUIZ\n.*?// END KURS-QUIZ\n?', '',quiz_path.read_text(),flags=re.S)
    quiz+='\n// BEGIN KURS-QUIZ\nObject.assign(window.QUIZ_DATA, '+json.dumps({l['id']:l['quiz'] for l in all_lessons},ensure_ascii=False,separators=(',',':'))+');\n// END KURS-QUIZ\n'
    quiz_path.write_text(quiz)
    quiz_id='d3b9f937-d128-463d-851c-f9ea093629b5'
    manifest[quiz_id]['data']=base64.b64encode(gzip.compress(quiz.encode(),mtime=0)).decode()
    template=transform(read_section(original,'template'))
    bundled=replace_section(replace_section(original,'template',template),'manifest',manifest)
    for f in ['index.html','DBA Lernportal (offline).html']:(ROOT/f).write_text(bundled)
    print(f'{len(all_lessons)} Lektionen, {sum(len(l["quiz"]["questions"]) for l in all_lessons)} Quizfragen; vier HTML-Einstiege aktualisiert.')

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--nav-only',action='store_true',help='nur den Trainer-Eintrag der Seitenleiste in die vier HTML-Einstiege setzen, ohne Kursmaterial neu einzulesen')
    args=parser.parse_args()
    if args.nav_only:
        patch_trainer_nav()
    else:
        build()
