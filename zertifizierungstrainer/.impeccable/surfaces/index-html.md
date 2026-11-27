---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: ["app.js","app.css"]
---

# Zertifizierungstrainer

Scope: `zertifizierungstrainer/` – eigenständige App, verlinkt als unterster Eintrag der Lernportal-Seitenleiste. Mode: Operate.

Audience/job: Batch-8-Lernende trainieren am Laptop die 139 Pflichtbegriffe frei abzurufen, in zwei Lernfenstern pro Tag. Task: nächste Lektion starten, Frage frei beantworten, gegen Pflichtmerkmale selbst bewerten, Lernstand ablesen. Constraints: kein Countdown, Frage verrät nie die Antwort, Herkunft sichtbar, localStorage.

## Direction contract

THESIS: Der Lernplan ist ein Aushangfahrplan. Jeder Begriff fährt feste Stationen ab (Erstabruf → Zweitcheck → bestätigt); die App zeigt Abfahrten, Verspätungen und Anschlüsse ehrlich. Verweigert die zentrierte Karteikarte mit Fortschrittsbalken.

OWN-WORLD: Signalgelb #FFD400 als Kopfleiste und Fläche für „offen/fällig“, Weiß für „angekommen/bestätigt“, Schwarz #111 für Schrift und Tabellenlinien, Rot für Verspätung, Unsicherheit und Fehler. Auf roten Flächen mit weißer Schrift kommt das dunkle Rot #B8000C zum Einsatz. Barlow Semi Condensed für Zahlen, Gleise, Spaltenköpfe; Barlow für Fließtext. Nur drei Schriftgrößen-Stufen, Rang über Gewicht, Versalien und Umkehrung (schwarzer Balken mit gelber Schrift). Haarlinien statt Schatten, keine Rundungen.

STORY: Der Lernende sieht sofort, was heute fährt, was verspätet ist und wie viele Begriffe wirklich bestätigt sind; er glaubt dem Stand, weil nichts geschönt wird; er startet die nächste Lektion.

FIRST VIEWPORT: Gelbe Kopfleiste über volle Breite, dreispaltig: links Marke + Modus + Tag, Mitte die nächste Lektion monumental mit „über“-Liste und schwarzem Startbutton, rechts die Summe der erstmals geprüften Begriffe und die vier Standkategorien. Darunter Reiter (Fahrplan, Begriffe, Lücken, Bilanz) und der Fahrplan. Im Sprint stehen die Begriffe direkt unter der Lektion, deren Fahrtverlauf sich aufklappen lässt. Im 3‑Wochen‑Trainer öffnet der jeweilige Tag beide Lernfenster mit Begriffen und einer als vorläufig markierten Vorschau.

FORM: Aushangfahrplan, Position 3 meiner geordneten Liste. seed:ebfc2b1f5abcab75. Raises: drei Schriftstufen (slide rack), Details auf Fokus (streaming), isolierter Reset (console), feste Stationszellen (folio), eine monumentale nächste Entscheidung (airport), Statuswechsel färbt Zeile ohne Rasterverschiebung (split-flap).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Signature move: Fahrtverlauf pro Begriff als Linie mit Haltestellen (Datum + Ergebnis je Halt).
