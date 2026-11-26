#!/usr/bin/env python3
"""Baut zertifizierungstrainer/data.js aus der Excel-Quelle und den redaktionellen Ergänzungen.

Aufruf (braucht openpyxl):
  python3 zertifizierungstrainer/tools/build_data.py [Pfad zur Excel-Datei]
"""
import json, re, sys
from pathlib import Path
import openpyxl

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from redaktion import TERMS, ABGRENZUNG, TEMPLATES  # noqa: E402

DEFAULT_XLSX = Path('/Users/marcpoenisch/Documents/DBA Batch 8/Glossar_Digital_Sales_Management_mit_Pruefungsfragen.xlsx')
OUT = HERE.parent / 'data.js'
LIMIT = 139

# Funktion vorhandener Fragen (Konzept 1.1, Regel 3): Definition, Abgrenzung oder Anwendung.
# Nur Definition und Abgrenzung zählen als Nachweis; Anwendung wird getrennt ausgewiesen.
FUNCTION_OVERRIDES = {
    'A27': ('def', [1]), 'A23': ('def', [23]), 'A3': ('def', [27]), 'A17': ('def', [65]),
    'A13': ('def', [93]), 'A20': ('def', [95]),
    'A18': ('abgr', [8, 9]), 'A7': ('abgr', [23, 28]), 'A2': ('abgr', [33, 35]), 'A22': ('abgr', [84, 85]),
}


def crit(text):
    m = re.search(r'\[(.+?)\]', text)
    if not m:
        raise ValueError('Lücke fehlt: ' + text)
    return {'t': text.replace('[', '').replace(']', ''), 'k': m[1]}


def main():
    xlsx = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_XLSX
    wb = openpyxl.load_workbook(xlsx, data_only=True)
    glossary = [r for r in wb['Glossar'].iter_rows(min_row=2, values_only=True) if isinstance(r[0], int)]
    rows = list(wb['Beispiel Prüfungsfragen'].iter_rows(min_row=2, values_only=True))
    split = next(i for i, r in enumerate(rows) if r[0] and not isinstance(r[0], int))
    main_q = [r for r in rows[:split] if isinstance(r[0], int)]
    extra_q = [r for r in rows[split + 1:] if isinstance(r[0], int)]

    terms = []
    for nr, cat, de, en, definition, lesson in glossary:
        if nr > LIMIT:
            continue
        name, crits, conf = TERMS[nr]
        cat_no, cat_name = cat.split('. ', 1)
        terms.append({
            'nr': nr, 'de': de.strip(), 'en': (en or '').strip(), 'name': name,
            'cat': int(cat_no), 'catName': cat_name.strip(), 'def': definition.strip(),
            'lesson': str(lesson).strip(), 'crit': [crit(c) for c in crits], 'conf': conf,
        })
    assert len(terms) == LIMIT, len(terms)
    by_nr = {t['nr']: t for t in terms}

    questions = []
    for kind, source in (('haupt', main_q), ('zusatz', extra_q)):
        for nr, _term, text, origin, also in source:
            if nr > LIMIT or also:  # Fragen, die Begriffe ab Nr. 140 brauchen, bleiben deaktiviert
                continue
            original = origin.startswith('Original')
            ref = origin.split('·')[-1].strip() if original else None
            fn, involved = FUNCTION_OVERRIDES.get(ref, ('anw', [nr]))
            questions.append({
                'id': f'x{ref or nr}' if original else f'u{nr}', 'terms': involved, 'text': text.strip(),
                'fn': fn, 'src': 'original' if original else 'uebung', 'ref': ref, 'sheet': kind,
                # Original-Anwendungsfragen bleiben für den Prüfungscheck reserviert.
                'reserved': original and fn == 'anw',
            })

    for t in terms:
        nr = t['nr']
        picks = []
        k = nr
        while len(picks) < 3:
            idx = k % len(TEMPLATES)
            if idx not in picks:
                picks.append(idx)
            k += 3
        for j, idx in enumerate(picks):
            questions.append({'id': f'r{nr}-{j + 1}', 'terms': [nr], 'text': TEMPLATES[idx].format(n=t['name']),
                              'fn': 'def', 'src': 'ergaenzt', 'ref': None, 'sheet': None, 'reserved': False})

    for i, (pair, text) in enumerate(ABGRENZUNG):
        for nr in pair:
            assert nr in by_nr, nr
        questions.append({'id': f'v{i + 1}', 'terms': list(pair), 'text': text, 'fn': 'abgr', 'src': 'ergaenzt',
                          'ref': None, 'sheet': None, 'reserved': False})

    # Sprint-Gruppen: nach Kategorie sortiert und reihum verteilt, damit jede Gruppe Themen mischt.
    order = sorted(terms, key=lambda t: (t['cat'], t['nr']))
    names = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2', 'E1', 'E2']
    groups = {n: [] for n in names}
    for i, t in enumerate(order):
        groups[names[i % 10]].append(t['nr'])
    assert [len(groups[n]) for n in names] == [14] * 9 + [13], [len(groups[n]) for n in names]

    cats = {}
    for t in terms:
        cats[t['cat']] = t['catName']

    meta = {
        'source': xlsx.name, 'terms': len(terms),
        'counts': {
            'original': sum(q['src'] == 'original' for q in questions),
            'uebung': sum(q['src'] == 'uebung' for q in questions),
            'ergaenzt': sum(q['src'] == 'ergaenzt' for q in questions),
            'bestand': sum(q['src'] != 'ergaenzt' for q in questions),
        },
    }
    payload = {'meta': meta, 'categories': cats, 'terms': terms, 'questions': questions, 'groups': groups}
    OUT.write_text('// Automatisch erzeugt von tools/build_data.py. Nicht von Hand bearbeiten.\n'
                   'window.ZT_DATA = ' + json.dumps(payload, ensure_ascii=False, separators=(',', ':')) + ';\n')
    print(f"{len(terms)} Begriffe, {len(questions)} Fragen ({meta['counts']}), Gruppen ok → {OUT}")


if __name__ == '__main__':
    main()
