---
name: Zertifizierungstrainer
description: Prüfungstraining für 139 Pflichtbegriffe, gesetzt als Aushangfahrplan.
colors:
  signal-yellow: "#FFD400"
  signal-yellow-soft: "#FFF3B0"
  ink: "#111111"
  ink-2: "#3A3A36"
  ink-3: "#5E5D55"
  paper: "#FFFFFF"
  rule-soft: "#D9D7CC"
  done-grey: "#F4F3EE"
  delay-red: "#E30613"
  delay-red-ink: "#B8000C"
  delay-red-soft: "#FDE6E7"
typography:
  display:
    fontFamily: "Barlow Semi Condensed, Arial Narrow, Helvetica Neue, sans-serif"
    fontSize: "clamp(44px, 2rem + 3vw, 84px)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Barlow Semi Condensed, Arial Narrow, Helvetica Neue, sans-serif"
    fontSize: "clamp(22px, 1.25rem + 0.6vw, 30px)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.005em"
  body:
    fontFamily: "Barlow, Helvetica Neue, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tnum"
  label:
    fontFamily: "Barlow Semi Condensed, Arial Narrow, Helvetica Neue, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.1em"
rounded:
  none: "0px"
  station: "50%"
spacing:
  pad: "clamp(16px, 2.2vw, 32px)"
  cell: "14px"
  brand-column: "clamp(238px, 18.5vw, 276px)"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.signal-yellow}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "13px 22px 12px"
  button-primary-hover:
    backgroundColor: "{colors.ink-2}"
  button-line:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "13px 22px 12px"
  button-line-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-danger:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.delay-red}"
    rounded: "{rounded.none}"
    padding: "13px 22px 12px"
  button-danger-hover:
    backgroundColor: "{colors.delay-red}"
    textColor: "{colors.paper}"
  tab:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "14px 24px 13px"
  tab-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  tag-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.signal-yellow}"
    padding: "3px 6px 2px"
  tag-red:
    backgroundColor: "{colors.delay-red}"
    textColor: "{colors.paper}"
    padding: "3px 6px 2px"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "9px 12px"
    height: "42px"
  criterion-row:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "11px 12px"
  criterion-row-checked:
    backgroundColor: "{colors.signal-yellow}"
---

# Design System: Zertifizierungstrainer

<!-- impeccable:design-map -->
Name: Zertifizierungstrainer
Colors: primary: signal-yellow #FFD400; secondary: delay-red #E30613; neutral: ink #111111; primary: signal-yellow-soft #FFF3B0; secondary: delay-red-ink #B8000C; secondary: delay-red-soft #FDE6E7; neutral: ink-2 #3A3A36 (+4 more in the sidecar)
Fonts: Barlow Semi Condensed (display, title, label); Barlow (body)
Spacing: pad clamp(16px, 2.2vw, 32px), cell 14px, brand-column clamp(238px, 18.5vw, 276px)
Radius: none 0px, station 50%
North Star: "Aushangfahrplan"
Rules:
- The Störungsrot Rule. Rot erscheint nur, wenn etwas verspätet, unsicher, falsch oder unwiderruflich ist.
- The Gelb-heißt-offen Rule. Gelbe Fläche markiert, was jetzt dran oder gewählt ist; Weiß markiert, was angekommen ist.
- The Drei-Stufen Rule. Es gibt genau drei Größen: s (Lesetext), m (Fragen, Zwischentitel), l (monumental).
- The Ziffern-stehen-still Rule. Tabellarische Ziffern überall, damit sich Zähler beim Umspringen nicht verschieben.
- The Haarlinie-statt-Schatten Rule. Kein Schlagschatten, kein Blur, keine Glasfläche.
- The Rund-nur-für-Haltestellen Rule. Kreise sind Haltestellen und nichts anderes.
Don't:
- Don't Schatten, Rundungen an Flächen oder Bedienelementen, weiche Verläufe oder Glas einsetzen (Ausnahme: harte diagonale Fehler-Schraffuren per `linear-gradient` mit harten Farbstopps an Haltestellen und Fortschrittszellen).
- Don't Rot für etwas anderes als Verspätung, Unsicherheit, Fehler oder Zurücksetzen verwenden.
- Don't eine vierte Schriftgröße einführen.
- Don't eine zentrierte Karteikarte mit Prozent-Fortschrittsbalken bauen.
- Don't Token oder Komponenten des Lernportals in den Trainer übernehmen oder umgekehrt.
Do:
- Do Rang über Gewicht, Versalien und den Umkehrbalken (Schwarz mit gelber Schrift) bilden, innerhalb der drei Größenstufen.
- Do Statuswechsel als Umfärben von Zeile oder Zelle ausführen, ohne Höhe, Breite oder Position zu ändern.
- Do Fortschritt als Haltestellen oder Zellen zeigen, die tatsächliche Ergebnisse abbilden.
- Do neue Ebenen mit 1px- oder 3px-Linien in Tafelschwarz trennen.
- Do Bewegung bei prefers-reduced-motion vollständig abschalten, wie im Bestand.
Map: fonts/
Map: fonts.css
Map: fonts/OFL.txt
Full: .impeccable/design-full.md (read a section when you need its detail)
