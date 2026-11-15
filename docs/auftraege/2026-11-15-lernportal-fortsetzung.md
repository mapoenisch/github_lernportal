# Lernportal bis zum Team-Pitch fortführen

Bestätigter Umfang: neue Lektionen nach 2.7.4 bis einschließlich 2.9 mit eigenem Quiz; Modul 4 folgt später. Die bestehende Gestaltung und gespeicherte Lernfortschritte bleiben erhalten.

- [x] Neun vorhandene Lektionen aus 2.7.6–2.7.15 ergänzen (keine erfundenen 2.7.5/2.7.10).
- [x] Abschnitt „2.8 Kunden-Pitch“: 2.8.1–2.8.5 sowie 2.8.6 Pitch-Day 1, mit vollständigem finalem Deck und Pitch-Cockpit.
- [x] Abschnitt „2.9 Team-Pitch“: 2.9.1–2.9.4 sowie 2.9.5 Pitch-Day 2; Finalisierung und Generalprobe darin integrieren.
- [x] Unternehmensprojekt um Entwicklungsschritte, beide vollständigen Decks und Team-Dossier erweitern; Szenariodaten und abweichende Rechenannahmen sichtbar machen.
- [x] Quellen in das Projekt kopieren, nachvollziehbar zuordnen und neben den HTML-Einstiegen offline verfügbar halten. DOCX/PPTX als Originaldatei öffnen/herunterladen, HTML-Werkzeuge im Overlay.
- [x] Alle vier HTML-Einstiege synchronisieren; Quiz, Navigation, Materialien, Offline-Nutzung und bestehende Fortschritte prüfen.

Umsetzung: Inhalt als separate JSON-Quelle, kleiner wiederholbarer Builder für die bestehende DC-Komponente und HTML-Bundles. Keine neue UI-Bibliothek und kein Umbau des Portals.

Quellen: lokale Kursunterlagen in „DBA Batch 8“. Die fehlenden Folien zu 2.8.5 werden nicht nachgebildet; die Lektion beruht auf dem vollständigen Task Sheet. Der Lösungstext unter 2.9.4 heißt in der Datei „Pitch Day Präsentieren & Feedback“, behandelt im Dokument aber „Lead Management und Erfolgsmessung“ und wird entsprechend zugeordnet. Originale bleiben unverändert.

## Korrekturen von Marc

- Quizfragen prüfen Unterrichtsinhalte und deren Anwendung. Keine Fragen zur Portalnummerierung, zur Ablage oder zu Marcs konkreten abgegebenen Decks, Zahlen und Lösungen. Die 44 Fragen zu 2.8 und 2.9 wurden daraufhin überarbeitet. Quellenzuordnung: `content/quiz-sources.json`.
- Kunden-Pitchdeck nur als vollständiges PDF anbieten. Den PPTX-Link aus Lektion und Unternehmensbereich entfernt; die importierte Kopie entfernt, das Original im Kursordner unverändert gelassen. Teamdeck bleibt als PPTX verfügbar, da dort kein PDF vorliegt.

## Prüfung

- `node tests/verify-portal.cjs`: DC-Quelle und HTML-Bundle, 20 neue Lektionen, 80 Fragen, Quizabgabe/Reset, Renderer, Navigation, vorhandene Fortschritte und SHA-256 der 79 Originaldateien geprüft.
- Browser: alle 20 neuen Quiz durchlaufen; nach der inhaltlichen Korrektur alle elf Quiz aus 2.8 und 2.9 erneut vollständig mit Auswertung geprüft.
- Alle importierten Materialpfade erfolgreich per HTTP geprüft; Download von vollständigem Teamdeck und DOCX-Dossier bestätigt. Teleprompter lädt im Overlay.
- Lokale Offline-Datei bei ausgeschaltetem Netzwerk geöffnet; Pitch-Day 2 und 16 Antwortoptionen dargestellt. Der Ordner `assets/kurs` gehört zur lokalen Weitergabe dazu.
- Sichtprüfung von Materialbereich und Projektarchiv. Keine Veröffentlichung oder Git-Übertragung vorgenommen.
