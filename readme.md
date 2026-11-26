# DBA Lernportal und Zertifizierungstrainer

Das Lernportal begleitet die Weiterbildung zum Digital Sales Manager im DBA Batch 8. Du kannst Lektionen nacharbeiten, mit Wissenschecks üben und im angeschlossenen Zertifizierungstrainer gezielt Begriffe für die Prüfung wiederholen.

[Zum Lernportal](https://mapoenisch.github.io/github_lernportal/) · [Direkt zum Zertifizierungstrainer](https://mapoenisch.github.io/github_lernportal/zertifizierungstrainer/)

Im Portal findest du den **Zertifizierungstrainer** unten in der Seitenleiste. Auf schmalen Bildschirmen öffnest du die Navigation über **Lektionen**. Die Online-Links führen zum jeweils veröffentlichten Stand.

## Lernportal

| Bereich | Inhalt |
| --- | --- |
| Modul 1 · Einführung Digital Sales | 24 Lektionen, unter anderem zu SaaS, B2B-Einkauf, Vertriebsrollen und Selbstorganisation |
| Modul 2 · Spezialisierung digitale Sales Tools | 72 Lektionen, unter anderem zu Lead Management, Reporting, Bedarfsanalyse, Key Account Management, Customer Support und Pitch |
| Modul 4 · Arbeitsmarktvorbereitung | 15 Lektionen zu Sales-Rollen, Lebenslauf, Stellenanzeigen und Bewerbungsgesprächen |
| HubSpot | 15 Einträge mit Übungen und Klickpfaden zu CRM, Workflows, Reporting und Kundenbetreuung |
| LeadPilot | Fiktives Unternehmensprojekt mit Dashboard, Landingpage, Kunden- und Team-Pitch sowie eigenen Projektdateien |
| Kompakt und Glossar | 17 Themenübersichten und ein Glossar mit Definitionen, Modellen und Kennzahlen |

Die Suche durchsucht Lektionen, HubSpot, LeadPilot, Kompaktübersichten und Glossar. Sie findet Begriffe auch ohne Umlaute. **Enter** öffnet den ersten Treffer, **Escape** leert das Suchfeld.

Du kannst Lektionen als erledigt markieren und deinen Fortschritt in der Seitenleiste sehen. Für 107 Einträge sind insgesamt 376 Quizfragen hinterlegt. Die Wissenschecks zeigen nach der Abgabe die Auswertung und speichern das letzte Ergebnis pro Lektion. Über **Quiz wiederholen** startest du einen neuen Versuch. Vorschauen für Projektdateien lassen sich mit **Escape** schließen.

## Zertifizierungstrainer

Der Trainer deckt **139 Begriffe in 11 Kategorien** ab. Der Fragenbestand umfasst **598 Aufgaben**. Die App kennzeichnet die Herkunft der 24 Originalfragen, 117 Übungsfragen und 457 redaktionell ergänzten Fragen. Geübt werden Definition, Abgrenzung und Anwendung.

| Modus | Ablauf |
| --- | --- |
| **7-Tage-Sprint** | 14 Lektionen in einer festen Reihenfolge. Neue Begriffe und Wiederholungen sind in zehn Gruppen organisiert. Der Zweitcheck folgt regulär mit zwei Tagen Abstand. Am Ende steht ein Prüfungscheck mit Fallfragen. |
| **Adaptiver 3-Wochen-Trainer** | Zwei Lernfenster pro Tag. Fällige Wiederholungen, unsichere Begriffe und offene Erstabrufe bestimmen die Reihenfolge. Bei zwei vollständigen Nachweisen liegen mindestens drei Tage zwischen den Antworten. |

1. Beantworte die offene Frage laut oder halte deine Antwort in Stichworten fest.
2. Öffne **Antwort prüfen**. Vergleiche deine Antwort mit der Musterantwort und hake die genannten Pflichtmerkmale ab. Die App leitet daraus „vollständig“, „teilweise“ oder „falsch“ ab.
3. Bearbeite bei Bedarf eine Kurzkorrektur als Lückentext, Auswahlfrage oder Wahr/Falsch-Aufgabe. Eine Erklärung nach einem Hinweis zählt als Übung.
4. Nutze **Fahrplan** für die nächste Lektion, **Begriffe** für Definitionen und den Verlauf, **Lücken** für unsichere Themen und **Bilanz** für den Stand deines Durchlaufs.

Für einen Nachweis beantwortest du eine Definitions- oder Abgrenzungsfrage eigenständig. Der Trainer bestätigt einen Begriff nach zwei vollständigen Nachweisen an verschiedenen Tagen mit dem Abstand des gewählten Modus. Anwendungsfragen wertet die Bilanz separat aus. Eine versehentliche Bewertung kannst du über **Letzte Bewertung korrigieren** zurücknehmen. Für die Selbstbewertung gibt es die Tastenkürzel **1–9** und **Strg/⌘ + Enter**.

### Lernstand sichern

Portal und Trainer speichern den Lernstand im jeweiligen Browserprofil. Die beiden Apps verwenden getrennte Speicher. Für den Wechsel auf einen anderen Browser oder ein anderes Gerät kannst du den Trainer-Lernstand unter **Bilanz** als JSON-Datei exportieren und wieder importieren. Der Import prüft die Datei und fragt nach, bevor er den aktuellen Stand ersetzt. Vor dem Ersetzen sichert der Trainer den bisherigen Stand. Bei beschädigten Daten bietet er die Wiederherstellung an, sofern eine gültige Sicherung vorliegt.

Beendete Durchläufe kannst du auf der Startseite wieder aufnehmen oder nach Bestätigung aus dem Browser entfernen. Sichere sie bei Bedarf vorher als JSON. Bei Änderungen in einem anderen Tab lädt der Trainer den neueren Stand.

## Lokal starten

Entpacke oder klone das Repository und öffne `index.html`. Die Seite enthält die Lektionen, das Quiz und die eingebettete Laufzeit. Lege für Projektdateien `assets/` und für den Trainer `zertifizierungstrainer/` neben die Datei. Die früheren HTML-Dateinamen leiten auf die entsprechenden Einstiege weiter.

Für eine feste lokale Adresse, unter der dein Browser den Lernstand wiederfindet, starte im Projektordner einen einfachen HTTP-Server.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Öffne [das lokale Lernportal](http://127.0.0.1:8000/) oder [den lokalen Trainer](http://127.0.0.1:8000/zertifizierungstrainer/). Beide Apps kommen ohne Anmeldung und ohne Backend aus. Die DBA-Originalunterlagen liegen außerhalb des Repositorys.

## Inhalte pflegen und prüfen

| Pfad | Aufgabe |
| --- | --- |
| `Lernportal.dc.html` und `content/` | Portalquelle, ergänzte Lektionen, Quiz- und Glossardaten |
| `index.html` | Gebündeltes Portal für GitHub Pages und Offline-Nutzung |
| `zertifizierungstrainer/` | Eigenständige App mit Lernlogik, Datenbestand und lokalen Schriften |
| `assets/leadpilot/` | Eigene Dateien zum LeadPilot-Projekt |

Nach Änderungen an den datengetriebenen Portalinhalten erzeugt das Skript die aktualisierten HTML- und Quizdateien. Trainer-Daten lassen sich mit `zertifizierungstrainer/tools/build_data.py` aus der lokalen Excel-Quelle und den redaktionellen Ergänzungen neu erzeugen. Für diesen Schritt brauchst du `openpyxl`. Die ausgelieferte App liest direkt aus `zertifizierungstrainer/data.js`.

```sh
python3 scripts/extend_portal.py
node tests/verify-portal.cjs
node tests/verify-trainer.cjs
```

[Hinweise zum Portal-Build](content/README.md) · [Trainerkonzept](PRODUCT.md) · [Designleitfaden des Lernportals](docs/designsystem-lernportal.md) · [Trainer-Design](zertifizierungstrainer/DESIGN.md)
