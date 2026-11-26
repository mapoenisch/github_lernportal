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
  brand-column: "clamp(220px, 17vw, 260px)"
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

Gilt nur für `zertifizierungstrainer/`. Das Lernportal hat eine eigene Welt (dokumentiert in `readme.md` im Projekt-Root); keine Token oder Regeln zwischen beiden Welten mischen.

## Overview

**Creative North Star: "Aushangfahrplan"**

Der Lernplan ist ein Bahnsteig-Aushang. Jeder Begriff fährt feste Stationen ab (Erstabruf, Zweitcheck, bestätigt), und die Oberfläche zeigt Abfahrten, Verspätungen und Anschlüsse ehrlich, ohne Beschönigung. Die Welt ist gedruckte Verkehrsgrafik: Signalgelb als Fläche, schwarze Schrift und Tabellenlinien, weißes Papier, Rot als einzige Alarmfarbe. Rang entsteht über Gewicht, Versalien und Umkehrung, nicht über viele Schriftgrößen.

Die Dichte ist die einer Abfahrtstafel: viele Zeilen, klare Spalten, tabellarische Ziffern, feste Zellbreiten. Statuswechsel färben eine Zeile oder Zelle um, ohne das Raster zu verschieben. Details (Fahrtverlauf eines Begriffs) klappen erst auf Fokus auf. Tiefe gibt es nicht; die Ebene wird durch Linienstärke (1px vs. 3px) und Flächenfarbe getrennt.

Verworfen ist die zentrierte Karteikarte mit Fortschrittsbalken, wie sie im Direction Contract steht.

**Key Characteristics:**
- Gelbe Kopfleiste über volle Breite, drei Spalten (Marke/Tag, nächste Lektion, Standzahlen)
- Genau drei Schriftgrößen-Stufen
- Haarlinien statt Schatten, eckige Formen; Kreise nur als Haltestellen
- Rot ausschließlich für Verspätung, Unsicherheit und destruktive Aktionen
- Umkehrbalken (Schwarz mit gelber Schrift) als stärkstes Hervorhebungsmittel

## Colors

Ein Verkehrssignal-Dreiklang aus Gelb, Schwarz und Weiß, mit Rot als reserviertem Störungston.

### Primary
- **Signalgelb** (signal-yellow): Kopfleiste, angekreuzte Pflichtmerkmale, Fokus-Halo, Selektion. Bedeutet „offen/fällig/jetzt“.
- **Blasses Signalgelb** (signal-yellow-soft): heutige und aufgeklappte Tafelzeilen, Hover auf Reitern, Segmenten, Merkmalen und Auswahlen, Teilergebnis-Urteil, leere Lückenfelder.

### Secondary
- **Störungsrot** (delay-red): Verspätungsmarke, Zähler „unsicher“, verfehlte Haltestelle, falsche Antwort, Gefahrenknopf.
- **Blasses Störungsrot** (delay-red-soft): Hinweisfläche bei Rückstand, falsch gefülltes Lückenfeld.

### Neutral
- **Tafelschwarz** (ink): Schrift, Tabellenlinien, Rahmen, Umkehrbalken, gefüllte Haltestellen.
- **Graphit** (ink-2): Untertitel in der Kopfleiste, „über“-Spalte, Frage-Metadaten.
- **Ausgeblichenes Grau** (ink-3): Hilfstexte, Platzhalter, Zeilen „angekommen“, Status „ungeprüft“.
- **Papierweiß** (paper): Grundfläche, „angekommen/bestätigt“.
- **Feine Fuge** (rule-soft): Trenner zwischen Reitern und Bilanzspalten, wo eine volle Linie zu laut wäre.
- **Abgefahrenes Grau** (done-grey): Notizfeld der eigenen Stichworte, Hover des leisen Knopfs, Scrollbar-Spur.

### Named Rules
**The Störungsrot Rule.** Rot erscheint nur, wenn etwas verspätet, unsicher, falsch oder unwiderruflich ist. Kein dekoratives Rot, kein Rot für Marke oder Fortschritt.

**The Gelb-heißt-offen Rule.** Gelbe Fläche markiert, was jetzt dran oder gewählt ist; Weiß markiert, was angekommen ist. Eine erledigte Zeile wird nie gelb gefärbt.

## Typography

**Display Font:** Barlow Semi Condensed (mit Arial Narrow, Helvetica Neue)
**Body Font:** Barlow (mit Helvetica Neue, Arial)
**Quelle:** lokal gehostet als woff2 in `fonts/` (Teilmenge latin, eingebunden über `fonts.css`, Lizenz SIL OFL in `fonts/OFL.txt`). Keine externe Schriftquelle, damit die App auch offline ihre Stimme behält.

**Character:** Die halbschmale Barlow trägt Zahlen, Gleise, Spaltenköpfe und Fragen wie eine Fahrplanbeschriftung; die normalbreite Barlow trägt den Lesetext. Alles läuft mit tabellarischen Ziffern.

### Hierarchy
- **Display** (800, Stufe l, 0.95): die nächste Lektion in der Kopfleiste („A1 neu“), Standzahlen, Bilanzzahlen, Abschluss-Überschriften.
- **Title** (700, Stufe m, 1.1): Tafel-Überschrift, Tagesnummer, Gleisnummer, Fragetext (1.22), Musterdefinition und Lückentext in 500.
- **Body** (400, Stufe s, 1.5, max. 70–75ch): Fließtext, Hinweise, Antwortoptionen.
- **Label** (700, Stufe s, 0.1em, Versalien): Spaltenköpfe, Reiter, Feldbeschriftungen, Knöpfe (800, 0.06em), Standbezeichnungen.

### Named Rules
**The Drei-Stufen Rule.** Es gibt genau drei Größen: s (Lesetext), m (Fragen, Zwischentitel), l (monumental). Eine neue Ebene entsteht über Gewicht, Versalien oder Umkehrung, nie über eine vierte Größe.

**The Ziffern-stehen-still Rule.** Tabellarische Ziffern überall, damit sich Zähler beim Umspringen nicht verschieben.

## Layout

Desktop: Die Kopfleiste ist ein Raster aus Markenspalte (brand-column), Hauptspalte und Standspalte (min. 280px, 24vw); Lektions- und Startansichten lassen die Standspalte weg. Reiterleiste und Inhalt rücken um die Markenspalte ein, sodass die Tafel unter der Hauptspalte beginnt; die Reiterleiste klebt oben. Inhalt max. 1500px, Fragekarte max. 980px, Antwortbereich max. 760px.

Tabellenzellen haben 12px/14px Polsterung, die Spaltenbreiten für Tag (104px) und Gleis (128px) sind fest. Abstände zwischen Blöcken wachsen in Stufen von etwa 14, 18, 24–32 und 56–96px (Gefahrenzone ganz unten).

Unter 1100px stapelt die Kopfleiste einspaltig, Marke wird zur Zeile, die vier Standzahlen stehen nebeneinander. Unter 720px wird die Abfahrtstafel zu Zeilenkarten (Tag links über drei Zeilen, Rest rechts), die „über“-Spalte entfällt, Reiter teilen sich die Breite gleichmäßig, Standzahlen gehen auf 2×2.

## Elevation & Depth

Das System ist flach. Ebenen trennen sich über Linienstärke (1px Haarlinie für Zeilen und Spalten, 3px für Kopfleistenkante, Tabellenkopf und Abschnittswechsel) und über Flächenfarbe. Die einzigen box-shadow-Werte sind funktionale Ringe: der gelbe Fokus-Halo und der innere gelbe Ring der Endstation „bestätigt“.

### Named Rules
**The Haarlinie-statt-Schatten Rule.** Kein Schlagschatten, kein Blur, keine Glasfläche. Wer eine Ebene braucht, zieht eine Linie oder kehrt die Fläche um.

## Shapes

Alles ist rechteckig (0px): Knöpfe, Felder, Reiter, Hinweisflächen, Merkmalzeilen, Fortschrittszellen. Die einzige Rundung gehört dem Liniennetz: Haltestellen sind Kreise (50%), verbunden durch 2px-Striche; die Endstation „bestätigt“ ist ein Quadrat. Eine gestrichelte Haltestelle bedeutet „zählt als Übung“, ein diagonal durchgestrichener roter Kreis „verfehlt“.

**The Rund-nur-für-Haltestellen Rule.** Kreise sind Haltestellen und nichts anderes. Keine runden Ecken an Flächen oder Bedienelementen.

## Components

### Buttons
- **Shape:** eckig (0px), 2px Rahmen, Versalien-Label mit Pfeil-Icon (SVG, eckige Linienenden).
- **Primary:** Umkehrbalken, Tafelschwarz mit gelber Schrift. Hover hellt auf Graphit auf.
- **Line:** transparent mit schwarzem Rahmen; Hover kehrt auf Schwarz mit weißer Schrift um.
- **Quiet:** ohne Rahmen, unterstrichen; Hover auf abgefahrenes Grau.
- **Danger:** weiß mit rotem Rahmen und roter Schrift; Hover füllt rot. Nur für Zurücksetzen.
- **Focus:** 3px schwarzer Umriss, 2px Abstand, 6px gelber Halo (global).

### Chips
- **Tags:** kleine Umkehrbalken in Label-Schrift (0.04em). Schwarz/Gelb für „heute“, Aufgabenart, „bestätigt“; Rot/Weiß für „verspätet“ und „verkürzter Nachcheck“. Verspätungszahl als hochgestelltes rotes „+n“.

### Cards / Containers
- **Corner Style:** eckig.
- **Hinweis:** gelbe Fläche mit 2px schwarzem Rahmen; Rückstandsvariante blassrot mit rotem Rahmen.
- **Bilanzzeile:** Kennzahlenspalten nebeneinander, getrennt durch feine Fugen, unten eine Haarlinie.
- **Shadow Strategy:** keine (siehe Elevation & Depth).

### Inputs / Fields
- **Style:** 2px schwarzer Rahmen, weiß, eckig, min. 42px hoch; Select mit eigenem SVG-Winkel.
- **Lückenfeld:** nur Unterlinie (3px) auf blassem Gelb; richtig wird Schwarz/Gelb, falsch blassrot mit roter Linie.
- **Focus:** globaler Fokusring ohne Abstand.

### Navigation
- **Reiter:** Versalien-Labels in einer Leiste mit Haarlinie unten, getrennt durch feine Fugen; Hover blassgelb, aktiv Schwarz mit weißer Schrift. Auf Mobil gleich breit.
- **Rücklink:** Versalien mit Winkel-Icon oben in der Markenspalte.
- **Segmentschalter:** 2px Rahmen, innere 1px Trenner, aktiv Schwarz/Gelb.

### Abfahrtstafel (Signature)
Tabelle mit 3px Kopflinie und 1px Zeilenlinien. Zeilenzustände färben nur den Hintergrund: heute blassgelb, angekommen weiß mit ausgeblichener Schrift, verspätet rote Tagesnummer. Eine fokussierte Zeile klappt darunter den Fahrtverlauf jedes Begriffs auf.

### Fahrtverlauf (Signature)
Pro Begriff eine Linie mit Haltestellen: Kreis, Kreis, Quadrat (Erstabruf, Zweitcheck, bestätigt). Gefüllt schwarz = vollständig, rot = verfehlt, gestrichelt = Übung. In der Detailansicht senkrecht mit Datum und Ergebnis je Halt.

### Fortschrittsschiene
Eine Zelle pro Frage, 14px hoch, 2px Rahmen: leer offen, weiß aktuell, schwarz erledigt, rot verfehlt; eine Lücke trennt Pflicht- und Zusatzfragen. Die gerade erledigte Zelle klappt von links ein (clip-path, 0.45s, ease-out-expo).

### Merkmal-Checkliste
Gestapelte Zeilen mit 1px Rahmen (überlappend, −1px), eigenes eckiges Kästchen, Tastenziffer rechts. Angekreuzt färbt die ganze Zeile gelb, das Kästchen wird Schwarz mit gelbem Haken.

### Urteil und Toast
Urteil als Fläche: vollständig Schwarz/Gelb, teilweise blassgelb, falsch Rot/Weiß; erscheint mit demselben Klapp-Effekt. Toast unten mittig, Schwarz/Gelb mit 3px gelber Oberkante, fährt von unten ein.

## Do's and Don'ts

### Do:
- **Do** Rang über Gewicht, Versalien und den Umkehrbalken (Schwarz mit gelber Schrift) bilden, innerhalb der drei Größenstufen.
- **Do** Statuswechsel als Umfärben von Zeile oder Zelle ausführen, ohne Höhe, Breite oder Position zu ändern.
- **Do** Fortschritt als Haltestellen oder Zellen zeigen, die tatsächliche Ergebnisse abbilden.
- **Do** neue Ebenen mit 1px- oder 3px-Linien in Tafelschwarz trennen.
- **Do** Bewegung bei prefers-reduced-motion vollständig abschalten, wie im Bestand.

### Don't:
- **Don't** Schatten, Rundungen an Flächen oder Bedienelementen, Verläufe oder Glas einsetzen.
- **Don't** Rot für etwas anderes als Verspätung, Unsicherheit, Fehler oder Zurücksetzen verwenden.
- **Don't** eine vierte Schriftgröße einführen.
- **Don't** eine zentrierte Karteikarte mit Prozent-Fortschrittsbalken bauen.
- **Don't** Token oder Komponenten des Lernportals in den Trainer übernehmen oder umgekehrt.
