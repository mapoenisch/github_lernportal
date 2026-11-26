# Tiefenanalyse: DBA Lernportal und Zertifizierungstrainer

Stand: 26.11.2026 · Commit `532ecaf` · Analyse mit REA (statisch + Live-Browser), ergänzt um Playwright, Datenprüfskript und die vorhandenen Test-Suites.

---

## 1. Kurzfazit

Beide Apps laufen stabil im normalen Gebrauch. Die vorhandenen Tests sind grün, der Trainer erzeugt im Lernablauf keinen einzigen Konsolenfehler, und die Datenbasis (139 Begriffe, 598 Fragen) ist sauber.

Die Schwachstellen liegen an den Rändern: beim **Import eines Lernstands**, bei **zwei gleichzeitig offenen Tabs** und bei der **Veröffentlichung** (öffentliches GitHub-Repo mit Kursmaterial). Das Portal ist außerdem **auf dem Handy praktisch nicht nutzbar**.

| Bereich | Bewertung | Wichtigster Punkt |
|---|---|---|
| Veröffentlichung / Recht | 🔴 kritisch | Repo und GitHub Pages sind öffentlich, inkl. Lösungen und Musterlösungen |
| Trainer: Datensicherheit | 🔴 hoch | Kaputte Import-Datei legt die App dauerhaft lahm; Tabs überschreiben sich gegenseitig |
| Trainer: Sicherheit | 🟠 hoch | Eingeschleuster Code aus einer JSON-Datei wird ausgeführt |
| Portal: Mobil | 🟠 mittel | Seitenleiste belegt 320 von 390 px |
| Portal: Ladefehler | 🟡 mittel | 3 unnötige 404-Fehler bei jedem Seitenaufruf |
| Trainer: Didaktik | 🟡 mittel | Wahr/Falsch-Korrektur hat immer dieselbe Lösung |
| Datenbasis | 🟢 gut | Vollständig, keine Dubletten, ausgewogene Antwortpositionen |
| Tests | 🟢 gut | Beide Suites grün |

---

## 2. Was untersucht wurde

| Prüfung | Werkzeug | Evidence-ID (REA) |
|---|---|---|
| Statische Code-Analyse Trainer (`app.js`, `data.js`, HTML, CSS) | REA `analyze_javascript_application` | `ev_6485596c…` |
| Statische Code-Analyse Portal (`index.html`, `Lernportal.dc.html`, `quizData.js`, `support.js`) | REA `analyze_javascript_application` | `ev_a111308b…` |
| Portal laden, Netzwerk und Konsole mitschneiden | REA `capture_browser_scenario` | `ev_ba55b2f3…` |
| Trainer: kompletter Lernablauf (Start → Lektion → Bewerten → Leerspeichern → Undo → Verlassen) | REA `capture_browser_scenario` | `ev_6c120af8…` |
| Trainer: manipulierter Lernstand (Code-Einschleusung) | REA `capture_browser_scenario` | `ev_c3b1d90a…` |
| Trainer: unvollständiger Lernstand (Absturz) | REA `capture_browser_scenario` | `ev_47dcc4b0…` |
| Portal-Bedienung, Mobilansicht, Barrierefreiheit | Playwright | – |
| Trainer: zwei Tabs gleichzeitig, Screenshots | Playwright | – |
| Datenbasis 139 Begriffe / 598 Fragen | eigenes Prüfskript | – |
| Regressionstests | `tests/verify-trainer.cjs`, `tests/verify-portal.cjs` | – |

**Grenzen der Analyse**
- Die `index.html` des Portals ist ein selbstentpackendes Bundle (9 MB Base64 in einer Zeile). REA kann den eingebetteten Code statisch nicht lesen. Deshalb wurde die Quelldatei `Lernportal.dc.html` analysiert und das Bundle live im Browser geprüft.
- REAs semantischer Graph ist laut eigener Angabe „partial“: Er zeigt Kandidaten, keine Beweise. Alle Befunde unten mit 🔴/🟠 wurden deshalb **live im Browser bestätigt**.
- Ein REA-Durchlauf am Portal brach mit einem Client-Timeout ab (der Locator wartete nach dem Dokument-Austausch des Bundles endlos). Dieser Teil wurde mit Playwright wiederholt.

---

## 3. Architektur in einem Bild

```
GitHub Pages (öffentlich)
│
├── index.html  ──────────────  10 MB, selbstentpackendes Bundle
│     └─ entpackt zur Laufzeit: React 18, DC-Runtime, Schriften, Bilder, PDFs als blob:-URLs
│     └─ Quelle: Lernportal.dc.html (8 458 Zeilen) + support.js + quizData.js
│     └─ gebaut von scripts/extend_portal.py
│     └─ Speicher: localStorage „dba_completed_v1“ (erledigte Lektionen)
│
└── zertifizierungstrainer/   eigenständige App, kein Framework, kein Build
      ├─ index.html   (Hülle)
      ├─ data.js      (175 KB: 139 Begriffe, 598 Fragen, aus Excel erzeugt)
      ├─ app.js       (1 150 Zeilen: Planung, Bewertung, Ansichten)
      ├─ app.css + lokale Barlow-Schriften
      └─ Speicher: localStorage „zt.v1“ (alle Durchläufe + Protokoll)
```

Kein Server, kein Login, keine externen Aufrufe im Betrieb des Trainers. Das ist für ein Lernwerkzeug eine gute, robuste Wahl.

---

## 4. Lernportal: Befunde

### 4.1 🔴 Öffentliches Repo mit Kursmaterial
Das Repo `mapoenisch/github_lernportal` ist **öffentlich**, GitHub Pages ist aktiv (`https://mapoenisch.github.io/github_lernportal/`). Unter `assets/kurs/` liegen rund 185 MB Material der Akademie: Präsentationen, Task Sheets, **Lösungen und Musterlösungen**, dazu Porträtfotos.

**Warum relevant:** Das Material gehört der DBA. Musterlösungen öffentlich zu stellen kann gegen die Teilnahmebedingungen verstoßen, und spätere Batches finden sie per Suchmaschine.

**Empfehlung:** Bei der DBA nachfragen, ob das erlaubt ist. Falls nicht: Repo auf privat stellen (GitHub Pages für private Repos braucht ein kostenpflichtiges Konto) oder die Kursdateien aus dem öffentlichen Teil entfernen. Achtung: Dateien bleiben auch nach dem Löschen in der Git-Historie, das braucht einen eigenen Bereinigungsschritt.

### 4.2 🟡 Drei 404-Fehler bei jedem Laden
Beim Start fordert der Browser diese Adressen an, alle mit Fehler 404:

```
/{{ dashboardSrc }}
/{{ landingpageSrc }}
/{{ overlaySrc }}
```

**Ursache:** In `Lernportal.dc.html:567`, `:571`, `:594` und `:598` stehen `<iframe src="{{ … }}">`. Der Browser liest diese Platzhalter als echte Adresse und lädt sie, bevor die Laufzeit sie ersetzt.
**Folge:** Rote Fehler in der Konsole, unnötige Anfragen. Bei Nutzung als lokale Datei (`file://`) entstehen ebenfalls Fehlermeldungen. Kein Funktionsverlust.
**Lösung:** Die iframes erst innerhalb der zugehörigen `sc-if`-Bedingung erzeugen oder das `src` per Bindung setzen statt als roher Text.

Dazu fehlt ein `favicon.ico` (vierter 404).

### 4.3 🟠 Auf dem Handy kaum nutzbar
Live gemessen bei 390 px Breite (iPhone-Größe): Die dunkle Seitenleiste ist fest 320 px breit. Für den Inhalt bleiben etwa 70 px, die Überschrift bricht nach jedem Buchstaben um. Im gesamten Portal gibt es **keine einzige `@media`-Regel**.

**Empfehlung:** Unter etwa 900 px die Seitenleiste ausblenden und per Menü-Knopf einblenden. Der Trainer zeigt, dass das gut geht: Er ist mobil sauber.

### 4.4 🟡 Barrierefreiheit
| Punkt | Befund |
|---|---|
| Sprache | Nach dem Entpacken ist `<html lang>` leer. Screenreader lesen deutschen Text dann mit englischer Aussprache. |
| Seitentitel | Nach dem Entpacken leer (vorher „Bundled Page“). Im Browser-Tab steht nichts Sinnvolles. |
| Tastatur | 5 klickbare `div`-Elemente (z. B. Kopfzeilen der Kompaktabschnitte, `Lernportal.dc.html:263`; Overlay-Hintergrund `:588`) sind nicht per Tastatur erreichbar. |
| Overlay | Lässt sich nicht mit Escape schließen. |
| ARIA | Insgesamt nur 7 ARIA-Attribute im ganzen Portal. Positiv: Quiz-Antworten sind korrekt als `radiogroup`/`radio` ausgezeichnet. |
| Bilder | Alle Bilder haben `alt`-Texte. ✔ |

### 4.5 Weitere Punkte
- **Doppelte Großdateien:** `index.html` und `DBA Lernportal (offline).html` sind byte-identisch (je 10 MB), ebenso `Lernportal.dc.html` und `Lernportal-standalone.dc.html`. Bei jedem Build wachsen damit zwei 10-MB-Dateien in der Git-Historie (`.git` ist bereits 247 MB groß).
- **CDN-Abhängigkeit der Quellversion:** `Lernportal.dc.html` lädt React und Babel von `unpkg.com`, mit Integritätsprüfung (SRI). Das ist gut abgesichert, funktioniert aber nur online. Die Bundle-Version `index.html` bringt alles selbst mit.
- **Quiz:** Ergebnisse werden nicht gespeichert, und nach dem Absenden gibt es keinen „Nochmal“-Knopf (nur durch Lektionswechsel).
- **Fortschritt:** Speicherung in `localStorage` funktioniert (live bestätigt: `{"1.1.2":true}`), Lesefehler werden abgefangen. ✔
- **Suche:** Faltet Umlaute und ß sauber, Escape leert das Feld (live bestätigt). ✔
- **Ladezeit:** Rund 250 ms bis zur Bedienbarkeit (lokal). ✔

---

## 5. Zertifizierungstrainer: Befunde

### 5.1 🔴 Kaputter Lernstand legt die App dauerhaft lahm
**Live bestätigt** (`ev_47dcc4b0…`): Ein Lernstand, dem ein Feld fehlt (z. B. `log`), führt beim Start zu

```
TypeError: Cannot read properties of undefined (reading 'forEach')
    at analyze (app.js:79)
```

Die Seite bleibt weiß, nur „Zum Inhalt springen“ ist sichtbar. Weil der kaputte Stand im Browser gespeichert bleibt, ist die App **auch nach dem Neuladen** kaputt. In der App gibt es keinen Weg zurück.

**Wie das passiert:** Der Import (`app.js:1042–1055`) prüft nur, ob `runs` eine Liste ist. Danach wird der **bisherige Lernstand ohne Rückfrage und ohne Sicherung überschrieben**.

**Lösung:**
1. Vor dem Import fragen: „Aktuellen Lernstand ersetzen?“
2. Den alten Stand vorher unter einem Sicherungsschlüssel ablegen.
3. Jeden Durchlauf vollständig prüfen (`mode`, `start`, `log`, `done`, `lastQ`, `seen`).
4. `render()` in `try/catch` packen und im Fehlerfall eine Notfall-Ansicht zeigen („Lernstand beschädigt, Sicherung wiederherstellen?“).

### 5.2 🔴 Zwei offene Tabs überschreiben sich
**Live bestätigt:** Tab A speichert 2 Antworten. Ein zweiter, vorher geöffneter Tab B startet eine Lektion → im Speicher stehen danach **0 Antworten**.

**Ursache:** Jeder Tab hält den kompletten Stand im Arbeitsspeicher und schreibt ihn bei jeder Aktion vollständig zurück (`save()`, `app.js:33`). Wer zuletzt speichert, gewinnt.
**Realistisch?** Ja. Portal und Trainer laufen oft parallel, und ein vergessener Tab vom Vortag reicht.
**Lösung:** Auf das `storage`-Ereignis hören und den Stand neu laden, oder vor jedem Speichern den aktuellen Stand frisch lesen. Mindestens: im zweiten Tab einen Hinweis „In einem anderen Tab geöffnet“ zeigen.

### 5.3 🟠 Eingeschleuster Code aus einer JSON-Datei wird ausgeführt
**Live bestätigt** (`ev_c3b1d90a…`): Ein präparierter Lernstand mit `<img src=x onerror="…">` im Feld `summary` führt den Code aus (Konsole: `XSS-AUSGEFUEHRT`).

**Ungeschützte Stellen** (Werte aus dem Speicher ohne `esc()` ins HTML):

| Stelle | Feld |
|---|---|
| `app.js:518` | `done.summary` |
| `app.js:406` | `past.id` (im Attribut `data-id`) |
| `app.js:615` | `e.kind` (Rückfallwert) |
| `app.js:406`, `:438` | `MODES[past.mode]` → bei unbekanntem Modus zusätzlich Absturz |

**Warum das zählt:** Die App ist für die ganze Batch 8 gedacht, und die Export-/Import-Funktion lädt dazu ein, Lernstände weiterzugeben. Eine manipulierte Datei könnte den Lernstand der Empfängerin löschen oder verändern. Daten an Dritte gehen kaum verloren, weil die App keine Server-Daten kennt.
**Lösung:** Alle Werte aus dem Speicher durch `esc()` schicken, nicht nur die aus `data.js`. Zusammen mit 5.1 (Schema-Prüfung beim Import) ist das Problem erledigt.

### 5.4 🟡 Wahr/Falsch-Korrektur hat immer dieselbe Lösung
`fixPanel` (`app.js:790`) zeigt immer: „Begriff X bedeutet: *Definition von Begriff Y*“. Die richtige Antwort ist **immer „Stimmt nicht“** (`app.js:1015`). Nach zwei, drei Durchgängen merkt man das und klickt, ohne nachzudenken. Die Übung verliert ihren Lerneffekt.
**Lösung:** In etwa der Hälfte der Fälle die echte Definition zeigen (richtige Antwort „Stimmt“).

### 5.5 🟡 Lückentext ist sehr nachsichtig
Die Bewertung (`app.js:1012`) zählt eine Eingabe als richtig, wenn **4 beliebige zusammenhängende Buchstaben** im Lösungswort vorkommen. Beispiel: „kund“ für „Kundenbindung“, „ment“ für „Management“.
Dazu sind drei Lückenwörter reine Füllwörter, die nichts abfragen:

| Nr. | Begriff | Merkmal | Lücke |
|---|---|---|---|
| 26 | Decision-Phase | „und wählt einen **aus**“ | aus |
| 92 | Negotiation | „**vor** dem Abschluss“ | vor |
| 23 | Customer Journey | „kompletter **Weg** des Kunden“ | Weg |

**Lösung:** Mindestens 60–70 % des Lösungsworts verlangen oder gegen den Wortanfang prüfen. Die drei Lücken auf das Fachwort legen (z. B. „wählt“, „Abschluss“, „Kunden“).

### 5.6 🟡 Testparameter `?zeitreise=` ist im Live-Betrieb aktiv
`app.js:40–41`: Mit `?zeitreise=5` in der Adresse rechnet die App fünf Tage in die Zukunft. Antworten in diesem Modus landen **mit falschem Datum im echten Lernstand** und verfälschen Bestätigungen und Abstände dauerhaft. Für Mitlernende ist der Parameter unsichtbar, für dich als Tester aber eine Falle.
**Lösung:** Nur auf `localhost` erlauben oder Antworten im Zeitreise-Modus nicht speichern.

### 5.7 Datenbasis (geprüft mit eigenem Skript)
| Prüfung | Ergebnis |
|---|---|
| Begriffe in Gruppen A1–E2 | 139 von 139, keine doppelt ✔ |
| Fragen gesamt | 598 (24 Original, 117 Übung, 457 redaktionell ergänzt) ✔ deckt sich mit PRODUCT.md |
| Jede Definition mindestens 3 Fragevarianten | ja ✔ |
| Doppelte Fragen-IDs oder Fragetexte | keine ✔ |
| Frage verrät die Definition wörtlich | keine ✔ |
| Lückenwort steht im Merkmalstext | alle ✔ |
| Ungültige Begriffsverweise | keine ✔ |
| Position der richtigen Antwort bei Auswahlaufgaben | 47 / 46 / 46, also ausgewogen ✔ |
| Begriff mit nur 1 Pflichtmerkmal | **Nr. 17 Decision Maker**: „teilweise“ ist dort unmöglich, nur alles oder nichts |
| Begriffe ohne Verwechslungspartner | Nr. 57 Pareto-Prinzip, Nr. 78 Rapport |
| Einseitige Verwechslungen (A→B, aber nicht B→A) | 31 Fälle, inhaltlich vermutlich oft gewollt, aber prüfenswert |

### 5.8 Live-Ablauf: was gut funktioniert
Im REA-Durchlauf (`ev_6c120af8…`) ohne einen einzigen Konsolenfehler bestätigt:
- Sprint starten → Lektion → „Antwort prüfen“ → Merkmal abhaken → speichern ✔
- „Weiß ich nicht“ → leeres Speichern verlangt einen zweiten Klick (Schutz vor Versehen) ✔
- „Letzte Bewertung korrigieren“ (Undo) stellt den Zustand korrekt wieder her ✔
- „Fahrplan“ während der Lektion fragt nach, bevor abgebrochen wird ✔
- Fortschrittsanzeige für Screenreader („0 vollständig, 2 unsicher oder offen“) ✔
- Toast-Meldung als `role="status"` ✔
- Mobilansicht ohne horizontales Scrollen ✔

### 5.9 Kleinere Punkte
- **Desktop-Kopfzeile:** „ZERTIFIZIERUNGSTRAINER“ ist bei 1280 px zu breit für die linke Spalte und stößt an die Trennlinie.
- **Nullwerte in Ergebnissen:** `L.results` kann durch „Noch einmal erklären“ kurzzeitig `null` enthalten (`app.js:1024`). An zwei Stellen (`:810`, `:239`) fehlt dafür die Absicherung. Im normalen Ablauf wird die Lücke immer gefüllt; ein Absturz ist nur in seltenen Abbruch-Konstellationen denkbar.
- **Speicher-Wachstum:** Das Protokoll wächst unbegrenzt mit jedem Durchlauf. Bei 139 Begriffen über 21 Tage sind das grob 100–300 KB, unkritisch für `localStorage` (≈5 MB).

### 5.10 Was handwerklich stark ist
- Durchgehend `esc()` für alle Inhalte aus `data.js` (nur die Speicherwerte fehlen, siehe 5.3).
- Beschädigter Speicher wird beim Laden erkannt und unter `zt.v1.corrupt` gesichert statt gelöscht (`app.js:29`). Das deckt allerdings nur kaputtes JSON ab, nicht unvollständige Daten (5.1).
- Lokale Schriften, keine externen Anfragen, `prefers-reduced-motion`, sichtbarer Tastaturfokus, Tastenkürzel 1–9 und ⌘/Strg+Enter, `lang="de"`.
- Saubere Trennung von Nachweis und Übung im Protokoll. Die Regeln aus PRODUCT.md („Hilfe kommt erst nach dem eigenen Abruf“, „unterstützte Versuche zählen nie als Nachweis“) sind im Code konsequent umgesetzt (`record`, `app.js:337`).

---

## 6. Empfohlene Reihenfolge

| # | Maßnahme | Aufwand | Wirkung |
|---|---|---|---|
| 1 | Mit der DBA klären, ob Kursmaterial öffentlich sein darf; ggf. Repo privat stellen | Organisatorisch | Rechtliche Absicherung |
| 2 | Trainer-Import absichern: Rückfrage, Sicherung, Schema-Prüfung, Notfall-Ansicht | ca. 1 Std. | Kein Totalausfall mehr |
| 3 | `esc()` für alle Speicherwerte | 15 Min. | Code-Einschleusung behoben |
| 4 | Mehrere Tabs erkennen (`storage`-Ereignis) | ca. 30 Min. | Kein stiller Datenverlust |
| 5 | Wahr/Falsch zufällig richtig/falsch, Lückentext strenger, 3 Lückenwörter tauschen | ca. 45 Min. | Echter Lerneffekt |
| 6 | `?zeitreise` nur lokal erlauben | 5 Min. | Kein verfälschter Lernstand |
| 7 | Portal: Platzhalter-iframes, `lang`/`title`, Escape am Overlay | ca. 1 Std. | Saubere Konsole, bessere Zugänglichkeit |
| 8 | Portal mobil: einklappbare Seitenleiste | 2–3 Std. | Nutzbar am Handy |
| 9 | Doppelte 10-MB-Dateien abschaffen (eine Datei + Weiterleitung) | 30 Min. | Kleineres Repo |

Punkte 2–6 betreffen nur `zertifizierungstrainer/app.js` und lassen sich mit Tests in `tests/verify-trainer.cjs` absichern.

---

## 7. Anhang: Prüfstatus der Fragen

| Frage | Status |
|---|---|
| Läuft das Portal fehlerfrei? | Beantwortet: ja, bis auf 4 harmlose 404-Fehler |
| Läuft der Trainer im Normalablauf fehlerfrei? | Beantwortet: ja, live ohne Konsolenfehler |
| Ist der Lernstand sicher? | Beantwortet: nein, bei Import und mehreren Tabs (live bestätigt) |
| Ist die App gegen manipulierte Daten geschützt? | Beantwortet: nein (live bestätigt) |
| Ist die Datenbasis konsistent? | Beantwortet: ja, mit 3 inhaltlichen Hinweisen |
| Ist das Portal mobil und barrierearm? | Beantwortet: mobil nein; Barrierefreiheit teilweise |
| Ist der Code im Portal-Bundle vollständig statisch analysiert? | Teilweise: Bundle nicht statisch lesbar, Quelldatei analysiert, Bundle live geprüft |
