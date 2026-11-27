# Product

<!-- impeccable:product-schema 1 -->

Scope: Dieses Repository enthält zwei Oberflächen. Das **DBA Lernportal** (Root: `index.html`, `Lernportal.dc.html`) und den **Zertifizierungstrainer** (`zertifizierungstrainer/`), eine eigenständige App mit eigenem Design, die über den untersten Eintrag der Portal-Seitenleiste erreichbar ist. Dieser Produktrecord beschreibt vor allem den Zertifizierungstrainer; die visuelle Welt des Portals ist in `docs/designsystem-lernportal.md` dokumentiert und gilt nicht für den Trainer.

## Platform

web

## Stack

Statisches HTML/CSS/JavaScript ohne Build-Schritt und ohne Framework, wie das bestehende Portal (GitHub Pages, `.nojekyll`). Lernstand liegt in `localStorage`, kein Server, kein Login.

## Users

Teilnehmende der Weiterbildung „Digital Sales Manager“ (DBA, Batch 8), zuerst Marc, aber ausdrücklich auch Mitlernende. Jede Person nutzt die App im eigenen Browser mit eigenem Lernstand. Sie bereiten sich auf die Zertifizierungsprüfung vor und lernen überwiegend am Laptop, in zwei Lernfenstern pro Tag, oft mit laut gesprochenen Antworten.

## Product Purpose

Prüfungstraining für die 139 Pflichtbegriffe (Glossar-Nr. 1–139) des Digital Sales Managements. Erfolg ist nicht die Zahl geklickter Aufgaben, sondern der Nachweis: ein Begriff wurde bei neu formulierter Frage frei, vollständig und ohne Hilfe erklärt, an zwei verschiedenen Tagen.

## Positioning

Eine App, zwei Planungslogiken über demselben Fragenbestand: der adaptive 3‑Wochen‑Trainer (Plan folgt dem Lernstand) und der 7‑Tage‑Sprint (feste 14 Lektionen, Gruppen A1–E2, Zweitcheck zwei Tage nach Erstabruf). Jede Wiederabfrage hat einen anderen Wortlaut. Die Lernenden bewerten ihre Antworten anhand der Pflichtmerkmale selbst. Geratene und unterstützte Antworten zählen als Übung. Für einen Nachweis ist ein eigenständiger Abruf erforderlich.

## Operating Context

- Ablauf je Aufgabe: Frage ohne Hinweise → laut oder schriftlich antworten → „Antwort prüfen“ → Musterantwort + Pflichtmerkmale → Merkmale abhaken → Ergebnis vollständig, teilweise, falsch oder geraten → bei Bedarf gezielte Korrektur (Lückentext, Auswahl, Wahr/Falsch) → bei Bedarf erneute offene Erklärung. Wer „War geraten“ auswählt, sieht „geraten“ auch in der Auswertung und erhält für diesen Versuch keinen Nachweis.
- Der 3‑Wochen‑Trainer zeigt in einer aufklappbaren Tagesvorschau die Inhalte beider Lernfenster. Kommende Inhalte ändern sich mit dem Lernstand.
- Kein Countdown, keine Aufnahme, keine Spracherkennung.
- Fortschritt pro Durchlauf; ein neuer Sprint erbt keine Bestätigungen aus dem 3‑Wochen‑Trainer.
- Verpasste Lektionen werden neu priorisiert und sichtbar gemacht, nie still gestrichen.

## Capabilities and Constraints

- Verbindliche Quelle: `Glossar_Digital_Sales_Management_mit_Pruefungsfragen.xlsx` (Reiter „Glossar“ und „Beispiel Prüfungsfragen“). Nur Nr. 1–139; Nr. 140–174 bleiben deaktiviert, auch im Abschlusscheck.
- 141 Bestandsfragen im Zielbereich (22 Original, 117 Übungsfragen, 2 Zusatz-Originalfragen zu Nr. 1 und Nr. 27). Originalfragen bleiben im Wortlaut und werden als solche gekennzeichnet.
- Entscheidung (Marc, 26.11.2026): Pflichtmerkmale und zusätzliche Fragevarianten werden redaktionell ergänzt und sichtbar als „redaktionell ergänzt“ markiert, getrennt von Originalinhalten.
- Konzeptquelle: `IHK-certification-drilling/Zwei Lernapp-Konzepte 139 Begriffe komplett.md`.

## Brand Commitments

Deutsch, durchgehend „du“. Der Trainer hat ausdrücklich ein eigenes Design, unabhängig vom Portal. Kein erfundenes DBA-Logo.

## Evidence on Hand

Glossar mit Definitionen, Kategorien (11) und Lektionsverweisen; Prüfungsfragen mit Herkunft („Original · A9“ usw.) und „Auch relevant für“. Keine echten Nutzerzahlen, Bestehensquoten oder Testimonials; nichts davon erfinden.

## Product Principles

1. Nachweis vor Fortschrittsgefühl: die App meldet den echten Stand, auch wenn er unbequem ist.
2. Die Frage verrät nie die Antwort; Hilfe kommt erst nach dem eigenen Abruf.
3. Ein schwieriger Begriff blockiert nie die Lektion.
4. Herkunft ist sichtbar: Original, Übungsfrage oder redaktionell ergänzt.

## Accessibility & Inclusion

Vollständig per Tastatur bedienbar (lange Sessions am Laptop), ausreichende Kontraste, `prefers-reduced-motion` respektieren.
