# Lernportal-Erweiterungen

`continuation.json` enthält die 20 zusätzlichen Lektionen und je vier Quizfragen bis einschließlich 2.9.5. Der bestehende Aufbau bleibt erhalten. `materials.json` ordnet die unveränderten Originaldateien per SHA-256 zu; `quiz-sources.json` nennt die fachlichen Unterrichtsquellen.

In `job-preparation.json` stehen alle 15 Lektionen zu Modul 4. Jede Lektion behandelt vier Themen mit je einer Quizfrage und schließt mit einer Übung. Die Liste `materials` nennt die Kurs-PDFs, die der Builder als Originalunterlagen einbindet. Die vier Einträge unter `compact` erweitern die Übersicht um die Vertiefungen aus 2.7 bis 2.9 und um die drei Themenbereiche aus Modul 4.

Quizfragen beziehen sich auf den Lehrstoff und die Anwendung der Konzepte. Marcs abgegebene Lösungen, Pitchdeck-Zahlen und Portalnummern sind kein Prüfungsstoff. Die beiden Pitch-Abschlüsse wiederholen die vorangegangenen Fachthemen. Zu 2.8.5 liegt nur das Task Sheet mit Feedback und Reflexion vor.

Nach Inhaltsänderungen im Projektordner ausführen:

```sh
python3 scripts/extend_portal.py
node tests/verify-portal.cjs
```

Der Builder aktualisiert beide DC-Quellen, die zentrale Quizdatei, `index.html` und die Offline-HTML-Datei. Er übernimmt die vorhandene eingebettete Runtime und Schriften aus `index.html`; diese Grunddatei wird daher weiterhin benötigt. Originalunterlagen werden aus „DBA Batch 8“ kopiert; ein anderer Quellordner kann mit `--source-root` angegeben werden.

Das Kunden-Pitchdeck wird ausschließlich als PDF eingebunden. Das vollständige Teamdeck liegt als PPTX vor; das Dossier als DOCX. Office-Dateien öffnen als Download, lokale HTML-Hilfsmittel im Overlay. Neue Materialien liegen unter `assets/kurs/` und müssen beim Hosting oder lokalen Weitergeben zusammen mit der HTML-Datei erhalten bleiben. Lektionen und Quizdaten sind auch in den HTML-Bundles eingebettet.
