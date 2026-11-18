#!/usr/bin/env python3
"""Erweitert DC-Quellen und beide HTML-Bundles aus den Kursdaten in content/.

Originalmaterial liegt unter assets/kurs/<Lektions-ID> und wird beim lokalen
Öffnen sowie beim Hosting über relative Links ausgeliefert. Zum Weitergeben
beide HTML- und assets-Dateien zusammen behalten.
"""
import argparse
import base64
import gzip
import hashlib
import json
import mimetypes
from pathlib import Path
import re
import shutil
import unicodedata

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

def module_four_materials(source_root, lessons, provenance):
    folder = source_root / '4. Modul – Arbeitsmarktvorbereitung'
    files = {}
    for group in folder.iterdir():
        if not group.is_dir():
            continue
        for lesson_dir in group.iterdir():
            match = re.match(r'(4\.\d+\.\d+)\b', lesson_dir.name)
            if match and lesson_dir.is_dir():
                for path in lesson_dir.glob('*.pdf'):
                    files[match[1], unicodedata.normalize('NFC', path.name).strip()] = path

    resources = {}
    for lesson in lessons:
        code = lesson['id']
        resources[code] = []
        for filename in lesson['materials']:
            source = files[code, filename]
            dest = Path('assets/kurs') / code / filename
            contents = source.read_bytes()
            (ROOT / dest).parent.mkdir(parents=True, exist_ok=True)
            if not (ROOT / dest).exists() or (ROOT / dest).read_bytes() != contents:
                (ROOT / dest).write_bytes(contents)
            resources[code].append({
                't': 'button', 'resourceLabel': 'Originalmaterial · PDF', 'label': filename,
                'href': dest.as_posix(), 'sub': 'Vollständige Kursunterlage',
            })
            provenance.append({
                'lesson': code, 'source': str(source.relative_to(source_root)), 'path': dest.as_posix(),
                'sha256': hashlib.sha256(contents).hexdigest(),
            })
    return resources

def build(source_root):
    data = json.loads((ROOT / 'content/continuation.json').read_text())
    job = json.loads((ROOT / 'content/job-preparation.json').read_text())
    lessons = data['lessons']
    job_lessons = job['lessons']
    ids = {l['id'] for l in lessons}
    resources = {}
    provenance = []
    for folder in sorted(source_root.iterdir()):
        if not folder.is_dir():
            continue
        name = unicodedata.normalize('NFC', folder.name)
        match = re.match(r'(2\.[789]\.\d+)\b', name)
        code = '2.8.6' if name == '2.8 Kunden-Pitch' else '2.9.5' if name == '2.9 Team-Pitch' else match[1] if match else None
        if code not in ids:
            continue
        for src in sorted(folder.iterdir()):
            if not src.is_file() or src.name.startswith(('~$', '.')):
                continue
            if src.suffix.lower().strip() not in ('.pdf', '.docx', '.pptx', '.html', '.png', '.jpg', '.xlsx', '.md'):
                continue
            # Der Kunden-Pitch wird auf Wunsch ausschließlich als PDF angeboten.
            if code == '2.8.6' and src.suffix.lower() == '.pptx':
                continue
            filename = unicodedata.normalize('NFC', src.name).strip()
            dest = Path('assets/kurs') / code / filename
            (ROOT / dest).parent.mkdir(parents=True, exist_ok=True)
            if not (ROOT / dest).exists() or (ROOT / dest).read_bytes() != src.read_bytes():
                shutil.copyfile(src, ROOT / dest)
            draft = 'Entwurf' in filename
            label = filename
            # Der Dateiname dieser Lösung ist irreführend; die Zuordnung folgt dem Dokumenttitel.
            if code == '2.9.4' and 'Feedback' in filename:
                label = '2.9.4 Lead Management & Erfolgsmessung – Lösungen.pdf'
            resources.setdefault(code, []).append({'t':'image' if src.suffix.lower()=='.png' and code=='2.9.5' else 'button', 'resourceLabel':'Originalmaterial · '+src.suffix.lower().lstrip('.').upper(),
                **({'src':dest.as_posix(),'caption':'Zoom-Hintergrund · Team-Pitch · Originaldatei','maxW':'640px'} if src.suffix.lower()=='.png' and code=='2.9.5' else {'label':label,'href':dest.as_posix(),'download':src.suffix.lower() not in ('.pdf','.html','.png','.jpg'), 'sub': 'Entwurfsstand · ergänzendes Originalmaterial' if draft else 'Vollständige Originaldatei · '+src.suffix.lower().lstrip('.').upper()})})
            provenance.append({'lesson':code,'source':str(src.relative_to(source_root)), 'path':dest.as_posix(),'sha256':hashlib.sha256(src.read_bytes()).hexdigest()})
    resources.update(module_four_materials(source_root, job_lessons, provenance))
    all_lessons = lessons + job_lessons
    content = {}
    for lesson in all_lessons:
        code = lesson['id']
        content[code] = {k:v for k,v in lesson.items() if k in ('hero','sections')}
        blocks = sorted(resources.get(code, []), key=lambda b: ('Entwurf' in b.get('label',''), b.get('label','')))
        if not blocks:
            raise ValueError('Keine Materialien für '+code)
        originals = blocks if code.startswith('4.') else [
            {'t':'note','text':'Die folgenden Dateien sind die vollständigen Originalunterlagen. Lösungen öffnen sich separat, damit du die Aufgaben zunächst selbst bearbeiten kannst.'}, *blocks]
        content[code]['sections'].append({'eyebrow':'Kursunterlagen','title':'Originalmaterial & Vertiefung','pill':'Originalmaterial','blocks':originals})
    def link(code, ending, label):
        row = next(p for p in provenance if p['lesson']==code and p['path'].endswith(ending))
        return {'t':'button','label':label,'href':row['path'],'download':ending.endswith(('.pptx','.docx')),'resourceLabel':'Projektarchiv · '+Path(ending).suffix.lstrip('.').upper(),'sub':'Vollständiges Original · fiktives Unternehmensprojekt'}
    project_sections = [
        {'eyebrow':'Pitch-Entwicklung · 2.8','title':'Kunden-Pitch: Weidner','pill':'12 · Kunden-Pitch','blocks':[
            {'t':'lead','text':'Die Verkaufspräsentation verdichtet das Projekt auf die Sicht von Jens Hartwig: liegen gebliebene Messekontakte, klare Zuständigkeiten und ein nächster Schritt im CRM. Der vollständige Kunden-Pitch schließt den Abschnitt 2.8 ab.'},
            {'t':'flow','cols':2,'steps':[{'num':'01','title':'Fundament','text':'ICP, Persona und die stärksten Nutzenargumente sammeln.'},{'num':'02','title':'Geschichte','text':'Situation, Complication und Resolution zum Drehbuch verbinden.'},{'num':'03','title':'Deck und Probe','text':'Action Titles, klare Visuals und ein gemessener Probelauf.'},{'num':'04','title':'Pitch-Day 1','text':'Feedback nutzen und das finale Deck ablegen.'}]},
            link('2.8.6','LeadPilot Final Pitch-Deck Weidner.pdf','Komplettes Kunden-Pitchdeck ansehen · PDF'),
            {'t':'golink','to':'2.8.6','label':'Zu 2.8.6 Pitch-Day 1','sub':'Deck, Pitch-Cockpit und Wissenscheck'}]},
        {'eyebrow':'Pitch-Entwicklung · 2.9','title':'Die gemeinsame Vertriebsstrategie','pill':'13 · Team-Strategie','blocks':[
            {'t':'lead','text':'Im Team-Projekt führen Patrick, André und Marc die Idee mit Content, Outreach, Priorisierung und Erfolgsmessung zusammen. Persona und Zielunternehmen sind Teil der fiktiven Fallstudie Weidner.'},
            {'t':'table','head':['Etappe','Ergebnis im Projekt'],'rows':[['2.9.1 · Kickoff','Gemeinsame B2B-Idee, ICP, Persona Jens Hartwig, Hero Statement und USP.'],['2.9.2 · Content','Infografik für Awareness, Workflow für Consideration, Demo-Angebot für Decision.'],['2.9.3 · Outreach','Sequenz über E-Mail, LinkedIn und Telefon samt Nachrichten, Prioritäten und Stopp-Regeln.'],['2.9.4 · Funnel & KPIs','Definierte Übergänge und Kennzahlen mit Zeitraum, Nenner und Messplan.'],['2.9.5 · Pitch-Day 2','Deck finalisieren, gemeinsam proben und die Strategie vor der Jury erklären.']]},
            {'t':'note','text':'Die Q3-Zahlen im Teamdeck sind Szenariodaten: 650 Leads, 210 MQL, 75 SQL, 36 Angebote und 16 Neukunden. 16/36 ergeben rund 44,4 % Angebotsabschlussquote. 16/58 gestarteten Teamtests ergeben rund 27,6 % Trial-to-Paid. Sie belegen keinen realen Geschäftsbetrieb.'}]},
        {'eyebrow':'Projektarchiv · 2.9','title':'Vollständiges Teamdeck & Dossier','pill':'14 · Team-Pitch','blocks':[
            {'t':'lead','text':'Das finale Deck mit Schlussfolie zeigt die verdichtete Geschichte. Das vollständige Dossier bewahrt die Herleitung zu Persona, Content, Nachrichten, Lead-Priorisierung, Funnel, KPIs und Design. Im Abschluss findest du zusätzlich Teleprompter, Hintergrund und Entwurfsskizzen.'},
            link('2.9.5','Teampitch-Deck final mit Schlussfolie.pptx','Komplettes finales Team-Pitchdeck herunterladen · PowerPoint'),
            link('2.9.5','Team-Pitch Dossier LeadPilot.docx','Vollständiges Team-Pitch-Dossier herunterladen · Word'),
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
        'project': project_sections,
        'job': {'id': 'm4', 'label': 'Modul 4', 'title': 'Arbeitsmarktvorbereitung', 'weeks': '', 'groups': job_groups},
        'compact': job['compact'],
    }
    js = '    '+START+'    const continuation = '+json.dumps(payload,ensure_ascii=False,separators=(',',':'))+';\n'
    js += '''    const moduleTwo = this.CURR.find(m => m.id === 'm2');
    moduleTwo.groups.find(g => g.id === '2.7').lessons.push(...continuation.kam);
    moduleTwo.groups.push(...continuation.groups);
    Object.assign(this.CONTENT, continuation.lessons);
    this.CONTENT.projekt.sections.push(...continuation.project);
    this.CONTENT.projekt.hero.desc += ' Die abschließenden Projektetappen zeigen den Kunden-Pitch und die gemeinsame Team-Vertriebsstrategie mit vollständigen Decks und Dossier.';
    this.CURR.push(continuation.job);
    const compact = this.CONTENT.kompakt;
    for (const { title, blocks } of continuation.compact) {
      const index = compact.sections.length;
      const code = String(index + 1).padStart(2, '0');
      const label = code + ' · ' + title;
      compact.sections.push({ title, blocks, eyebrow: label, pill: label });
      this.COMPACT.push({ id: 'sec' + index, code, title, subs: blocks.filter(b => b.t === 'heading').map(b => b.text) });
    }
    const compactCount = compact.sections.length;
    compact.hero.desc = compactCount + ' aufklappbare Abschnitte zum Nachschlagen vor Prüfungen und Bewerbungsgesprächen.';
    compact.hero.chips[0] = compactCount + ' Abschnitte';
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
            anchor = '  }\n\n  select(id) {'
            if code.count(anchor)!=1:raise ValueError('Konstruktor-Anker fehlt oder ist mehrdeutig')
            code = code.replace(anchor,js+anchor)
            code = code.replace('onOpen: isPdf ? undefined', 'onOpen: (isPdf || b.download) ? undefined')
            code = code.replace('isButton:true, label:b.label', "isButton:true, resourceLabel:b.resourceLabel || 'Zusatzmaterial · Infografik', label:b.label")
            return m[1]+code+m[3]
        # Nur die feste Beschriftung im Template ersetzen, nicht den Default im JS.
        doc=doc.replace('>Zusatzmaterial · Infografik</', '>{{ b.resourceLabel }}</')
        doc=doc.replace('>· {{ mod.weeks }}</', '>{{ mod.weeksLabel }}</')
        doc=doc.replace('weeks:mod.weeks, groups', "weeksLabel: mod.weeks ? '· ' + mod.weeks : '', groups")
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
    (ROOT/'content/materials.json').write_text(json.dumps(provenance,ensure_ascii=False,indent=2)+'\n')
    print(f'{len(all_lessons)} Lektionen, {sum(len(l["quiz"]["questions"]) for l in all_lessons)} Quizfragen, {len(provenance)} Originaldateien; vier HTML-Einstiege aktualisiert.')

if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--source-root',type=Path,default=Path('/Users/marcpoenisch/Documents/DBA Batch 8'))
    args=parser.parse_args()
    build(args.source_root)
