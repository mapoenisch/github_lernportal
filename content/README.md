# Lernportal-Erweiterungen

`continuation.json` enthält die 25 zusätzlichen Lektionen aus Modul 2 (2.5.1–2.5.4 Bedarfsanalyse Deep Dive, 2.6.3 Recap Lead Management sowie 2.7.6 bis 2.9.5) mit je vier Quizfragen. Der bestehende Aufbau bleibt erhalten. `quiz-sources.json` nennt die fachlichen Unterrichtsquellen.

In `job-preparation.json` stehen alle 15 Lektionen zu Modul 4. Jede Lektion behandelt vier Themen mit je einer Quizfrage und schließt mit einer Übung. Die vier Einträge unter `compact` erweitern die Übersicht um die Vertiefungen aus 2.7 bis 2.9 und um die drei Themenbereiche aus Modul 4.

Quizfragen beziehen sich auf den Lehrstoff und die Anwendung der Konzepte. Marcs abgegebene Lösungen, Pitchdeck-Zahlen und Portalnummern sind kein Prüfungsstoff. Die beiden Pitch-Abschlüsse wiederholen die vorangegangenen Fachthemen. Zu 2.8.5 liegt nur das Task Sheet mit Feedback und Reflexion vor.

Nach Inhaltsänderungen im Projektordner ausführen:

```sh
python3 scripts/extend_portal.py
node tests/verify-portal.cjs
```

Der Builder fügt außerdem die Volltextsuche oben rechts ein (Lektionen aller Module, HubSpot, Unternehmensprojekt, Kompakt und Glossar; Umlaute werden toleriert, Enter öffnet den ersten Treffer, Escape leert die Suche). Er aktualisiert beide DC-Quellen, die zentrale Quizdatei, `index.html` und die Offline-HTML-Datei. Er übernimmt die vorhandene eingebettete Runtime und Schriften aus `index.html`; diese Grunddatei wird daher weiterhin benötigt. Der Portal-Build verwendet die Inhalte und Dateien aus diesem Repository.

Das Kunden-Pitchdeck liegt als PDF vor. Die Dateien zum Team-Pitch und das Pitch-Cockpit befinden sich ebenfalls unter `assets/leadpilot/pitch/`. Weitere LeadPilot-Unterlagen sind unter `assets/leadpilot/lektionen/` den jeweiligen Lektionen zugeordnet. Office-Dateien öffnen als Download, lokale HTML-Hilfsmittel im Overlay. Lektionen und Quizdaten sind in den HTML-Bundles eingebettet. Die DBA-Originalunterlagen sind lokal außerhalb des Repositorys archiviert.
