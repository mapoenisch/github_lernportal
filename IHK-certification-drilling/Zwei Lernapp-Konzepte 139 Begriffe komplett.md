<img src="https://frontend-cdn.perplexity.ai/_agi_assets/marketing/hub/brand/logos/2026-10-21/perplexity-horizontal-lockup-offblack.png" style="height:48px;margin-right:32px"/>

# Zwei Lernapp-Konzepte für 139 Begriffe aus dem Digital Sales Management

Die **3‑Wochen‑Version** passt Aufgabenmenge, Wiederholungsabstände und Hilfen an den Lernstand an. Der **7‑Tage‑Sprint** legt dagegen fest, wann alle Begriffe erstmals und erneut offen geprüft werden. Innerhalb dieses Plans reagiert er gezielt auf Schwächen. Beide Versionen prüfen dieselbe Leistung: Kann der Nutzer einen bekannten Begriff vollständig, eindeutig und in eigenen Worten erklären, ohne dass die App ihm die Antwort vorgibt?[^1][^2]

## 1. Gemeinsame Grundlage für beide Versionen

### 1.1 Lernstoff und Fragenbestand

Die erste Veröffentlichung verwendet in beiden Varianten ausschließlich die 139 Begriffe aus dem hochgeladenen Glossar. Erweiterte Begriffslisten bleiben außen vor. Die Excel-Datei enthält 139 Glossareinträge in elf Kategorien sowie 28 Beispielfragen im zweiten Reiter. Die Fragen sind nicht eins zu eins den Begriffen zugeordnet: Manche decken mehrere Begriffe ab, andere sind breiter als eine Definition. Deshalb ist die Datei die Inhaltsbasis, aber noch kein vollständig einsatzfähiger Fragenpool.[^3]

Für den Aufbau des Fragenpools gelten diese Regeln:

- Jeder Begriff erhält eine feste ID, eine kurze Musterantwort und fachliche Pflichtmerkmale. Die vorhandenen Kategorien und Lektionsverweise werden übernommen. Die Reihenfolge im Glossar bestimmt nicht die Reihenfolge im Training.[^3]
- Jeder Begriff bekommt mindestens drei redaktionell geprüfte offene Fragen, die dieselbe Kernleistung verlangen: eine für den Erstabruf, eine für den Wiederholungsabruf und eine für einen weiteren Check nach einem Fehler. Bei häufig verwechselten Begriffen kommen gezielte Vergleichsfragen hinzu.
- Vorhandene Prüfungsfragen bleiben im Originalwortlaut erhalten und werden als solche gekennzeichnet. Neu formulierte Trainingsfragen und Varianten werden getrennt gespeichert. Ein Teil der passenden Originalfragen bleibt für den Abschlusscheck reserviert. Fragen, die zusätzlichen Lernstoff voraussetzen, werden nicht in den Pflichtpfad aufgenommen.
- Pflichtmerkmale stammen aus dem Glossar und werden bei Unklarheiten gegen die Kursunterlagen geprüft. Zwei bis drei Merkmale sind ein guter Standard für kurze Definitionen, aber keine Obergrenze. Wenn beispielsweise ein Framework mit vier Bestandteilen vollständig erklärt werden soll, darf die Bewertungsregel keinen davon unterschlagen.[^1][^3]


### 1.2 Verbindliche Regel: Jede Wiederabfrage hat einen anderen Wortlaut

Bei jeder erneuten Abfrage eines Begriffs wählt die App eine andere Formulierung als beim letzten Auftreten dieses Begriffs. Das gilt auch für Korrekturfragen in derselben Lektion, Nachholaufgaben und den Abschlusscheck. Die App bevorzugt Varianten, die der Nutzer im aktuellen Durchlauf noch nicht gesehen hat. Sind sie ausgeschöpft, darf sie eine ältere Variante wiederverwenden, aber nie die unmittelbar letzte. Änderungen nur an Satzzeichen, Großschreibung oder Formatierung gelten nicht als Umformulierung.

Die Variante soll einen anderen Einstieg bieten, ohne versehentlich die Lösung vorzugeben oder eine völlig andere Leistung zu prüfen. Eine Frage, die nur nach einem Beispiel fragt, ersetzt also keine vollständige Definition. Eine Vergleichsfrage kann für zwei Begriffe zählen, wenn sie tatsächlich beide Erklärungen verlangt und beide getrennt bewertet werden.

Designbeispiel aus dem Glossar: Lead Scoring und Lead Nurturing. Das Glossar unterscheidet die Priorisierung nach Passung und Verhalten von der Pflege eines Leads mit passenden Inhalten bis zur Kaufbereitschaft.[^3]


| Einsatz | Frage |
| :-- | :-- |
| Erstabruf | „Was versteht man unter Lead Scoring?“ |
| Offene Wiederabfrage | „Wie funktioniert Lead Scoring, und welche Entscheidung unterstützt es?“ |
| Gezielte Abgrenzung | „Erkläre den Unterschied zwischen Lead Scoring und Lead Nurturing. Was macht der Vertrieb oder das Marketing jeweils mit dem Lead?“ |
| Rückfrage nach einer unvollständigen Antwort | „Anhand welcher Informationen wird ein Lead beim Scoring priorisiert, und wozu dient diese Priorisierung?“ |

### 1.3 Einheitlicher Aufgaben- und Bewertungsablauf

1. Die App zeigt die Frage ohne Lösungshinweise. Der Nutzer antwortet laut oder in einem kurzen Textfeld und tippt auf „Antwort prüfen“. Lautes Antworten funktioniert ohne Aufnahme oder Spracherkennung.
2. Erst danach erscheinen die Musterantwort und die Pflichtmerkmale. Der Nutzer markiert, welche Merkmale er sinngemäß genannt hat. Ein fachlicher Widerspruch kann nicht durch passende Stichwörter ausgeglichen werden.
3. Die App speichert das Ergebnis als vollständig, teilweise richtig oder falsch/nicht abrufbar. Optional kann der Nutzer markieren: „War geraten.“ Das beeinflusst die Reihenfolge weiterer Fragen, ersetzt aber nicht die fachliche Bewertung.
4. Fehlt ein Merkmal, gibt die App gezieltes Feedback. Ein Lückentext hilft bei einem fehlenden Bestandteil, eine Auswahlfrage bei einer konkreten Verwechslung, eine Wahr/Falsch-Aufgabe beim Korrigieren eines Irrtums. Anschließend kann der Begriff mit neuer Formulierung noch einmal offen erklärt werden.
5. Ein unterstützter Versuch oder eine richtige Antwort direkt nach der Korrektur zählt als Übung, nicht als unabhängiger Nachweis. Dafür muss der Nutzer den Begriff an einem anderen Tag vollständig und ohne Hilfe erklären. Den Nachweis für eine Definition und das Ergebnis einer Fallfrage zeigt die App getrennt an.[^2][^1]

## 2. Version 1: Adaptiver 3‑Wochen‑Trainer

### 2.1 Aufbau und Wochenverlauf

Die App bietet zwei Lernfenster pro Tag an, aber weder eine feste Minutenzahl noch eine feste Zahl von Aufgaben. Entscheidend ist, *was* der Nutzer noch nicht zuverlässig erklären kann. Wer mehrere Begriffe vollständig abruft, kann schneller vorankommen. Wer an einem Thema wiederholt scheitert, erhält mehr Übung und weniger neue Erstabfragen. Das ersetzt Geminis feste Lektionsdramaturgie und die obligatorische Stufenfolge durch eine Planung pro Begriff. Themenblöcke, direktes Feedback und der Verzicht auf einen Countdown bleiben erhalten.[^4][^1]


| Phase | Ziel | Verhalten der App |
| :-- | :-- | :-- |
| Tage 1–7: Wissensstand erfassen | Möglichst viele bekannte Begriffe erstmals offen prüfen und die Art der Lücken erkennen. | In den ersten Einheiten Fragen aus mehreren Kategorien auswählen. Danach fällige Wiederholungen mit noch ungeprüften Begriffen verbinden. |
| Tage 8–14: Abdeckung abschließen | Als Planungsziel alle 139 Begriffe erstmals prüfen, ohne bereits erkannte Lücken liegen zu lassen. | Die Zahl der Erstabrufe nach Rückstand und verbleibenden Tagen steuern. Bei Rückstand anzeigen, wie viele Begriffe noch ungeprüft sind und welche Zusatzlast eine vollständige Abdeckung bedeuten würde. |
| Tage 15–21: Erklärungen absichern | Offene Nachweise nachholen, Verwechslungen beheben und Prüfungsfragen beantworten. | Zuerst Begriffe prüfen, bei denen ein vollständiger Abruf noch nicht bestätigt ist. Danach ausgewählte Originalfragen und Fallvarianten einsetzen. An Tag 21 eine Bilanz ziehen, keine offenen Begriffe automatisch als beherrscht markieren. |

Tag 14 ist ein Steuerungsziel, kein Zwang. Sind beispielsweise am Ende von Tag 10 noch 48 Begriffe ungeprüft, wären im Schnitt zwölf Erstabrufe pro Tag nötig, um das Ziel zu halten. Die App macht diesen Rückstand sichtbar und bietet einen zusätzlichen Block an. Überspringt der Nutzer den Block, wird das Ziel neu geschätzt. Die App meldet den tatsächlichen Stand, statt durch leichtere Fragen künstlich Fortschritt zu erzeugen.

### 2.2 Ablauf der beiden Lektionen

**Lektion 1 – Abrufen und diagnostizieren.** Die App beginnt mit einem kleinen Block fälliger offener Fragen. Danach nimmt sie je nach Rückstand weitere fällige oder bisher ungeprüfte Begriffe auf. Bei einer Teilantwort fragt sie nicht pauschal alles noch einmal ab: Sie zeigt zunächst, *welcher* fachliche Punkt fehlte. Anschließend kann sie genau diesen Punkt üben. Bei einer Verwechslung stellt sie die betroffenen Begriffe gezielt gegenüber.

**Lektion 2 – Reparieren und anwenden.** Die App greift ausgewählte Lücken aus der ersten Lektion mit verändertem Wortlaut auf und ergänzt weitere fällige Wiederholungen. Wenn wenig Reparaturbedarf besteht, nutzt sie die Zeit für zusätzliche Erstabrufe oder einen kurzen Fall. Eine gute Antwort am Abend darf zeigen, dass die Korrektur verstanden wurde; sie zählt aber nicht als zweiter Nachweis für denselben Tag.

Nach einem sinnvollen Aufgabenblock kann der Nutzer aufhören oder weiterlernen. Die App zeigt beispielsweise: „Zwei fällige Wiederholungen offen; die nächste betrifft eine wiederholte Verwechslung.“ Offene Aufgaben bleiben erhalten. Bei verpassten Lektionen werden überfällige Aufgaben neu priorisiert, nicht ungefiltert in die nächste Lektion gestapelt.

### 2.3 Wie die App auf Schwächen reagiert

Die erste Umsetzung braucht nachvollziehbare Regeln, keinen komplexen Vorhersagealgorithmus. Die folgende Taktung ist eine Startkonfiguration, die anhand der Nutzung angepasst werden kann.[^1]


| Ergebnis beim freien Abruf | Reaktion | Nächste unabhängige Abfrage |
| :-- | :-- | :-- |
| Vollständig, erstmals gelungen | Kein Pflicht-Lückentext, keine leichtere Zwischenstufe. | Standardmäßig nach mindestens drei Tagen, mit anderer Formulierung. |
| Vollständig, an einem späteren Tag bestätigt | Begriff aus den häufigen Wiederholungen nehmen. | Bei Bedarf späterer Kontrollabruf, etwa nach weiteren fünf bis sieben Tagen, sofern der Kurszeitraum das zulässt. |
| Teilweise richtig | Fehlendes Pflichtmerkmal speichern; kurze gezielte Übung anbieten. | Meist am nächsten Tag. Gelingt die Erklärung, folgt die Bestätigung frühestens drei Tage nach diesem vollständigen Abruf. |
| Falsch, verwechselt oder nicht abrufbar | Musterantwort zeigen, Verwechslung gezielt bearbeiten und im nächsten Lernfenster erneut üben. | Frühestens am nächsten Tag als unabhängiger Abruf; bei erneutem Fehler weiter priorisieren. |
| Nach Bestätigung wieder unvollständig | Status zurücksetzen und den konkreten Fehler speichern. | Neuer Bestätigungszyklus nach der Korrektur. |

Innerhalb einer Lektion kommen wiederholt falsche und überfällige Begriffe zuerst. Ein Begriff soll die Lektion aber nicht blockieren: Nach einer kurzen Korrektur und höchstens einer unmittelbaren erneuten Erklärung geht es weiter. Wenn nur wenige Begriffe den Rückstand verursachen, bekommen andere Themen trotzdem Platz. Zwei Lernende mit demselben Kursstart können dadurch an Tag 10 sehr unterschiedliche Lektionen sehen.

Ein Begriff gilt im 3‑Wochen‑Trainer als bestätigt, wenn er zweimal ohne Hilfe vollständig erklärt wurde, mit mindestens drei Kalendertagen Abstand und ohne dazwischenliegenden unvollständigen freien Abruf. Die Abschlussansicht zeigt getrennt: erstmals geprüft, bestätigt, erneut unsicher und im Prüfungsstil angewendet. So bleibt erkennbar, ob eine Lücke in der Definition, bei der Abgrenzung oder erst im Fall auftritt.[^1]

## 3. Version 2: 7‑Tage‑Sprint

### 3.1 Was aus Geminis Sprint-Konzept einfließt

Aus `7-tage-sprint.md` übernehme ich die schnelle Einordnung nach Fehlerbild, das laute Antworten statt langer Texte, gezielte Kurzformate und den Schwerpunkt auf Risikobegriffen an Tag 6 und 7. Nicht übernommen werden der starre Deckel von 18 Aufgaben, das Aussortieren eines Begriffs nach einer einzigen richtigen Antwort und ein Erstcheck, bei dem ein Teil der Begriffe nur per Auswahl oder Lückentext geprüft wird. Das wäre ein kürzerer Diagnosesprint, aber nicht der beschlossene Sprint mit einem offenen Erst- und Wiederholungsabruf für alle 139 Begriffe. Die Priorisierung aus Geminis Vorschlag steuert deshalb die *zusätzliche Übung*, nicht die Frage, ob ein Begriff seinen zweiten offenen Check bekommt.[^5][^2]

### 3.2 Ausführbares Skript für alle 14 Lektionen

Die App teilt den Bestand vor Beginn in zehn Gruppen auf: A1/A2 bis D1/D2 mit je 14 Begriffen, E1 mit 14 und E2 mit 13. Die Gruppen mischen Themen, ohne wahllos zu springen. Sinnvolle Kontrastpaare wie ICP und Buyer Persona können in derselben Lektion abgefragt werden, aber die erste Frage soll die zweite Antwort nicht vorwegnehmen.[^3]


| Tag | Lektion 1 | Lektion 2 |
| :-- | :-- | :-- |
| 1 | A1: 14 offene Erstabrufe. Fehler direkt markieren und kurz korrigieren. | A2: 14 offene Erstabrufe. Falls Zeit bleibt, eine oder zwei Lücken aus A1 neu formuliert aufgreifen. |
| 2 | B1: 14 offene Erstabrufe. Kurzer Zusatzcheck für hartnäckige Lücken aus A, wenn Platz ist. | B2: 14 offene Erstabrufe. Fehlerliste nach fehlendem Merkmal und Verwechslung sortieren. |
| 3 | A1: 14 offene Wiederholungen mit neuer Frage. Danach C1: 14 Erstabrufe. | A2: 14 offene Wiederholungen. Danach C2: 14 Erstabrufe. |
| 4 | B1: 14 offene Wiederholungen. Danach D1: 14 Erstabrufe. | B2: 14 offene Wiederholungen. Danach D2: 14 Erstabrufe. |
| 5 | C1: 14 offene Wiederholungen. Danach E1: 14 Erstabrufe. | C2: 14 offene Wiederholungen. Danach E2: 13 Erstabrufe. Sollstand: 139 Begriffe erstmals geprüft. |
| 6 | D1: 14 offene Wiederholungen. Danach ausgewählte offene Lückenchecks aus A bis C. | D2: 14 offene Wiederholungen. Danach offene Vergleichs- oder Fallfragen zu den häufigsten Verwechslungen. |
| 7 | E1: 14 offene Wiederholungen. Danach offene Nachprüfungen für Begriffe, die bisher nur einmal vollständig gelangen. | E2: 13 offene Wiederholungen. Danach kurzer Prüfungscheck mit zurückgehaltenen Fragen und persönlicher Ergebnisübersicht. |

Die Pflichtblöcke ergeben 139 Erstabrufe und 139 Wiederholungsabrufe. Jeder planmäßige Zweitcheck liegt zwei Kalendertage nach dem Erstcheck. Zusatzübungen dürfen diesen Termin weder ersetzen noch einen fehlenden Nachweis verdecken.[^2]

### 3.3 Lektionsskript: Was die App im Sprint anzeigt und tut

1. **Start:** „Heute: 14 Begriffe erneut erklären, danach 14 erstmals prüfen.“ Die App zeigt vorab den Umfang, aber keine Antworten und keinen Countdown.
2. **Pflichtblock:** Bei „vollständig“ geht es direkt weiter. Bei „teilweise“ zeigt die App das fehlende Merkmal. Bei „falsch“ zeigt sie die kurze Musterantwort und legt den Begriff auf die priorisierte Lückenliste. Die ausführlichere Reparatur erfolgt nach dem Pflichtblock, damit mehrere schwierige Begriffe nicht den gesamten Tagesplan verdrängen.
3. **Lückenblock:** Bei freien Kapazitäten folgen kurze Zusatzübungen. Vorrang haben fachliche Verwechslungen, wiederholte Fehler und Begriffe, denen nur noch ein unabhängiger Nachweis fehlt. Lückentext oder Auswahlfrage dienen nur der Korrektur. Die spätere Bewertung erfolgt wieder offen.
4. **Abschluss:** „28 Pflichtfragen abgeschlossen. Drei Begriffe sind noch unsicher; zwei weitere wurden heute erstmals vollständig erklärt.“ Die App zeigt, wann der nächste offene Check geplant ist.

Die 12–15 Minuten pro Lektion sind ein Richtwert für überwiegend mündliche Kurzantworten, keine Garantie. Bei 28 Aufgaben und 25 Sekunden pro Aufgabe sind bereits 11 Minuten und 40 Sekunden verplant; bei 35 Sekunden sind es 16 Minuten und 20 Sekunden, noch ohne Zusatzblock. Deshalb sind die leichten Tage 1 und 2 sowie die freien Blöcke an Tag 6 und 7 wichtig. An den dichten Tagen kürzt die App zuerst Zusatzübungen, nicht die Qualität der Pflichtfragen.[^5][^2]

### 3.4 Sprint-Regeln für Fehler und verpasste Lektionen

- **Vollständig beim Erstabruf:** Keine zusätzliche Übung nötig. Der Begriff bleibt trotzdem für den offenen Zweitcheck zwei Tage später eingeplant.
- **Unvollständig beim Erstabruf, vollständig beim Zweitcheck:** Der Begriff hat erst einen erfolgreichen unabhängigen Abruf. Die App versucht, ihn an einem weiteren Tag zu bestätigen. Gelingt der erste vollständige Abruf erst an Tag 7, endet der Sprint für diesen Begriff mit „einmal vollständig“.
- **Falsch beim Zweitcheck:** Der Begriff bleibt unsicher und rückt im nächsten verfügbaren Lückenblock nach oben. Zwei richtige Antworten am selben Tag ändern daran nichts.
- **Lektion verpasst:** Offene Pflichtfragen bleiben in der Warteschlange. Die App rechnet vom tatsächlichen Erstabruf aus neu. Zwei Tage Abstand bleiben der Sollwert; wenn vor Sprintende nur ein späterer Kalendertag zur Verfügung steht, ist ein verkürzter Nachcheck möglich und wird als solcher angezeigt. Gibt es keinen späteren Tag mehr, bleibt die Bestätigung offen. Statt den Rückstand zu verbergen, zeigt die App, welcher Zusatzblock nötig wäre und was ohne ihn bis Tag 7 offen bleibt.

Die Abschlussansicht beantwortet drei Fragen: *Wurden alle 139 Begriffe erstmals geprüft? Bei welchen Begriffen war die vollständige Erklärung an zwei verschiedenen Tagen möglich? Welche Aufgaben im Prüfungsstil bereiten noch Schwierigkeiten?* Damit bleibt der Sprint auch dann aussagekräftig, wenn nicht alle Begriffe in sieben Tagen bestätigt werden.[^2]

## 4. Umsetzung: Eine App, zwei Planungslogiken

Die beiden Versionen sollten keine getrennten Apps sein. Sie verwenden denselben Fragenbestand, dieselbe Aufgabenansicht und dieselbe Bewertungslogik. Unterschiedlich ist, welche Aufgabe als Nächstes ausgewählt wird und wann ein Abruf als bestätigt gilt. Der Fortschritt wird pro Durchlauf gespeichert: Ein bestätigter Begriff aus dem 3‑Wochen‑Trainer gilt beim Start eines neuen Sprints nicht automatisch als im Sprint bestätigt.


| Baustein | Was gespeichert oder umgesetzt wird |
| :-- | :-- |
| Glossarimport | Begriffs-ID, deutscher und englischer Name, Kategorie, Glossardefinition und Lektionsverweis. Doppeldeutige Bezeichnungen werden redaktionell getrennt, etwa wenn „Buying Signal“ in verschiedenen Glossareinträgen vorkommt. [^3] |
| Fragenbank | Fragen-ID, geprüfte Begriffe, Wortlaut, Format, Musterantwort, Kriterien, Herkunft, Variantenfamilie und Kennzeichnung „für Abschluss reserviert“. |
| Lernprotokoll | Durchlauf, Datum, Frage und Variante, Ergebnis je Begriff, fehlende Kriterien und ob die App vor der Antwort Hilfe gezeigt hat. |
| Aufgabenauswahl | Der 3‑Wochen‑Trainer priorisiert Fälligkeit, Fehler und Abdeckung. Der Sprint führt feste Pflichtgruppen plus eine flexible Lückenliste. Beide nutzen dieselbe Sperre gegen identische Folgefragen. |
| Oberfläche | Moduswahl, Tagesübersicht mit zwei Lektionen, Frage, Rückmeldung, Lernstand nach Thema und Abschlussbilanz. Für die erste Version reichen gesprochenes Antworten ohne Aufnahme und Selbstbewertung nach Kriterien. |

Die aufwendigste Arbeit liegt in der Fragenbank. Drei offene Varianten für 139 Begriffe bedeuten bis zu 417 zu prüfende Fragenzuordnungen; passende vorhandene Fragen können einen Teil davon abdecken. Ich würde zunächst mit 25–30 Begriffen einen internen Testbestand aufbauen, darunter klare Definitionen, ähnliche Begriffspaare, Kennzahlen und Frameworks. Damit lassen sich beide Planungslogiken und die Formulierungsregeln testen, bevor der vollständige Bestand freigeschaltet wird. Der Testbestand ist kein gekürzter Lernmodus: Beide fertigen Versionen enthalten dieselben 139 Begriffe.[^1][^3]

Vor der Freigabe müssen insbesondere diese Fälle funktionieren:

- Derselbe Begriff erscheint zweimal in einer Lektion: Die zweite Frage hat einen anderen Wortlaut.
- Eine Originalfrage taucht als Variantenfrage auf: Die App kennzeichnet sie nicht fälschlich als unveränderte Originalfrage.
- Eine Frage vergleicht zwei Begriffe: Eine vollständige Erklärung des ersten schreibt dem zweiten keinen Erfolg gut.
- Der Nutzer antwortet nach einem Hinweis korrekt: Die App speichert einen Übungserfolg, aber keinen freien Nachweis.
- Ein bestätigter Begriff wird später wieder falsch erklärt: Der Status reagiert darauf.
- Eine Sprintlektion wird ausgelassen: Die App zeigt Nachholbedarf und verbleibende Möglichkeiten, statt Aufgaben oder Nachweise unbemerkt zu streichen.

Damit ist die Rollenverteilung klar: Im 3‑Wochen‑Trainer passt sich der Plan dem Lernstand an. Im Sprint bleibt die Abdeckung fest geplant, und die App passt die knappe zusätzliche Übungszeit den Schwächen an. In beiden Fällen ist nicht die Anzahl geklickter Aufgaben das Ergebnis, sondern die nachweisbar vollständige Erklärung bei einer neu formulierten Frage.

Die editierte Excel-Tabelle ist jetzt in beiden Versionen als verbindliche Inhaltsquelle festgelegt. Die Grenze von 139 gilt für die Begriffe, nicht für die Anzahl der Fragen: Zu den ersten 139 Begriffen können alle passenden vorhandenen Fragen und Antworten übernommen werden. Begriffe ab Position 140 bleiben auch in Zusatzübungen und im Abschlusscheck außen vor.[Anhang]

# Konzept

Was in der überarbeiteten Fassung gilt

# 3‑Wochen‑Trainer
Die App nutzt vorhandene Fragen und Antworten zuerst und wählt Wiederholungen, Hilfen und Aufgabenmenge nach dem individuellen Lernstand aus. 

# 7‑Tage‑Sprint
Das Skript für die 14 Lektionen bleibt bestehen. Für Erst- und Zweitabruf nutzt die App geeignete vorhandene Fragen. Sie ergänzt nur dort eine Variante, wo keine passende Umformulierung vorliegt. 

| Bestand                        | Gesamte Excel-Datei | Für beide Lernmodi                          |
| ------------------------------ | ------------------- | ------------------------------------------- |
| Glossarbegriffe mit Definition | 174                 | 139                                         |
| Zugeordnete Hauptfragen        | 174                 | 139: 22 Originalfragen und 117 Übungsfragen |
| Zusätzliche Originalfragen     | 6                   | 2: zu „Digitaler Vertrieb“ und „Touchpoint“ |
| Fragen insgesamt               | 180                 | 141 vor fachlicher Prüfung                  |

Die Grenze gilt für die Glossar-Nummern 1–139, von „Digitaler Vertrieb“ bis „Datenqualität“, nicht für die Anzahl der Fragen. Die 141 zugeordneten Fragen sind der Ausgangsbestand. Wenn eine Frage für ihre vollständige Beantwortung einen Begriff ab Nr. 140 voraussetzt, bleibt sie in beiden Modi außen vor.[Anhang]
Die Tabelle liefert Definitionen im Glossar, aber keine separate Musterantwortspalte im Fragenreiter. Die Konzepte nutzen deshalb die vorhandenen Definitionen als Grundlage und sehen ergänzende Bewertungskriterien für Fragen vor, die sich nicht allein mit einer Definition beantworten lassen. Auch bei Wiederholungen gilt: zuerst eine passende vorhandene Alternativfrage nutzen und nur bei Bedarf eine neue Formulierung ergänzen.



# Produktkonzept: Adaptiver 3‑Wochen‑Trainer

Fassung auf Basis der verifizierten Excel-Quelldatei. Pflichtstoff: Glossar-Nr. 1–139.

## 1. Gemeinsame Grundlage für beide Versionen

### 1.1 Verbindliche Quelle und Umfang

Verbindliche Inhaltsquelle ist `Glossar_Digital_Sales_Management_mit_Pruefungsfragen.xlsx`. Beide Lernmodi verwenden ausschließlich die Glossar-Nummern **1–139** („Digitaler Vertrieb“ bis „Datenqualität“). Die Nummer ist der Schlüssel, nicht die Excel-Zeilennummer. Die weiteren 35 Begriffe (140–174) bleiben samt ihren Fragen in beiden Modi deaktiviert, auch im Abschlusscheck.

| Bestandteil | Gesamtdatei | Kandidaten für die beiden Lernmodi |
|---|---:|---:|
| Glossarbegriffe mit Definition | 174 | 139 |
| Regulär zugeordnete Prüfungsfragen | 174 | 139 (22 Originalfragen, 117 neue Übungsfragen) |
| Zusätzliche Originalfragen | 6 | 2 (zu Nr. 1 „Digitaler Vertrieb“ und Nr. 27 „Touchpoint“) |
| Fragen insgesamt | 180 | 141 vor fachlicher Prüfung und Ergänzung von Varianten |

**Definition und Musterantwort sind nicht dasselbe.** Die Spalte „Was es bedeutet“ im Glossar enthält die Definitionen. Der Prüfungsfragen-Reiter enthält Nummer, Begriff, Frage, Herkunft und „Auch relevant für“, aber keine separate Antwortspalte. Die vorhandene Definition ist die erste Quelle für eine Musterantwort zur Begriffsabfrage. Für einen Fall oder eine mehrteilige Frage wird ein eigener, redaktionell geprüfter Erwartungshorizont ergänzt, wenn die Glossardefinition die Frage nicht vollständig beantwortet. Ergänzungen werden separat gespeichert und nicht als Originalantwort ausgegeben.

### Import- und Redaktionsregeln

1. Nummer, Glossardefinition, Kategorie und Lektionsverweis übernehmen. Die Haupt- und Zusatzfragen anhand von „Nr.“ zuordnen und „Herkunft“ sowie „Auch relevant für“ auslesen. Originalfragen als solche erhalten; Umformulierungen getrennt kennzeichnen.
2. Die 141 zugeordneten Fragen zuerst fachlich prüfen. Eine Frage bleibt nur dann aktiv, wenn für ihre vollständige Lösung kein Begriff außerhalb der Nummern 1–139 nötig ist. Die Hauptzuordnung allein entscheidet nicht: Fragewortlaut und Lösungskriterien sind ebenfalls maßgeblich.
3. Vorhandene Fragen nach ihrer Funktion einordnen: vollständige Begriffsabfrage, Abgrenzung oder Anwendung. Eine vorhandene Fallfrage wird nicht allein aufgrund ihrer Glossar-Nummer als Definitionsnachweis gewertet. Sie bleibt für Transfertraining oder einen Abschlusscheck nutzbar.
4. Vorhandene offene Formulierungen zuerst verwenden. Für jeden Begriff prüfen, ob zwei fachlich gleichwertige offene Abfragen für Erst- und Zweitabruf verfügbar sind. Fehlende Varianten gezielt aus dem Quellmaterial erstellen. Weitere Varianten für Nachprüfungen werden dort ergänzt, wo der Bestand nicht reicht. Keine pauschale Neuerstellung aller Prüfungsfragen.
5. Für die Bewertung aus den Definitionen und den passenden Kursunterlagen die Pflichtmerkmale ableiten. Zwei bis drei sind ein Richtwert für kurze Definitionen, keine Obergrenze. Geeignete Originalfragen für den Abschluss reservieren, sofern der Pflichtpfad ohne sie abgedeckt ist.

### 1.2 Verbindliche Regel: Jede Wiederabfrage hat einen anderen Wortlaut

Bei jeder erneuten Abfrage eines Begriffs wählt die App eine andere Formulierung als beim letzten Auftreten dieses Begriffs. Das gilt auch für Korrekturfragen in derselben Lektion, Nachholaufgaben und den Abschlusscheck. Die App bevorzugt Varianten, die der Nutzer im aktuellen Durchlauf noch nicht gesehen hat. Sind sie ausgeschöpft, darf sie eine ältere Variante wiederverwenden, aber nie die unmittelbar letzte. Änderungen nur an Satzzeichen, Großschreibung oder Formatierung gelten nicht als Umformulierung.

Die Variante soll einen anderen Einstieg bieten, ohne versehentlich die Lösung vorzugeben oder eine völlig andere Leistung zu prüfen. Eine Frage, die nur nach einem Beispiel fragt, ersetzt also keine vollständige Definition. Eine Vergleichsfrage kann für zwei Begriffe zählen, wenn sie tatsächlich beide Erklärungen verlangt und beide getrennt bewertet werden.

Designbeispiel aus dem Glossar: Lead Scoring und Lead Nurturing. Das Glossar unterscheidet die Priorisierung nach Passung und Verhalten von der Pflege eines Leads mit passenden Inhalten bis zur Kaufbereitschaft.

| Einsatz | Frage |
|---|---|
| Erstabruf | „Was versteht man unter Lead Scoring?“ |
| Offene Wiederabfrage | „Wie funktioniert Lead Scoring, und welche Entscheidung unterstützt es?“ |
| Gezielte Abgrenzung | „Erkläre den Unterschied zwischen Lead Scoring und Lead Nurturing. Was macht der Vertrieb oder das Marketing jeweils mit dem Lead?“ |
| Rückfrage nach einer unvollständigen Antwort | „Anhand welcher Informationen wird ein Lead beim Scoring priorisiert, und wozu dient diese Priorisierung?“ |

### 1.3 Einheitlicher Aufgaben- und Bewertungsablauf

1. Die App zeigt die Frage ohne Lösungshinweise. Der Nutzer antwortet laut oder in einem kurzen Textfeld und tippt auf „Antwort prüfen“. Lautes Antworten funktioniert ohne Aufnahme oder Spracherkennung.
2. Erst danach erscheinen die Musterantwort und die Pflichtmerkmale. Der Nutzer markiert, welche Merkmale er sinngemäß genannt hat. Ein fachlicher Widerspruch kann nicht durch passende Stichwörter ausgeglichen werden.
3. Die App speichert das Ergebnis als vollständig, teilweise richtig oder falsch/nicht abrufbar. Optional kann der Nutzer markieren: „War geraten.“ Das beeinflusst die Reihenfolge weiterer Fragen, ersetzt aber nicht die fachliche Bewertung.
4. Fehlt ein Merkmal, gibt die App gezieltes Feedback. Ein Lückentext hilft bei einem fehlenden Bestandteil, eine Auswahlfrage bei einer konkreten Verwechslung, eine Wahr/Falsch-Aufgabe beim Korrigieren eines Irrtums. Anschließend kann der Begriff mit neuer Formulierung noch einmal offen erklärt werden.
5. Ein unterstützter Versuch oder eine richtige Antwort direkt nach der Korrektur zählt als Übung, nicht als unabhängiger Nachweis. Dafür muss der Nutzer den Begriff an einem anderen Tag vollständig und ohne Hilfe erklären. Den Nachweis für eine Definition und das Ergebnis einer Fallfrage zeigt die App getrennt an.

## 2. Version 1: Adaptiver 3‑Wochen‑Trainer

### 2.1 Aufbau und Wochenverlauf

Die App bietet zwei Lernfenster pro Tag an, aber weder eine feste Minutenzahl noch eine feste Zahl von Aufgaben. Entscheidend ist, *was* der Nutzer noch nicht zuverlässig erklären kann. Wer mehrere Begriffe vollständig abruft, kann schneller vorankommen. Wer an einem Thema wiederholt scheitert, erhält mehr Übung und weniger neue Erstabfragen. Das ersetzt Geminis feste Lektionsdramaturgie und die obligatorische Stufenfolge durch eine Planung pro Begriff. Themenblöcke, direktes Feedback und der Verzicht auf einen Countdown bleiben erhalten.

| Phase | Ziel | Verhalten der App |
|---|---|---|
| Tage 1–7: Wissensstand erfassen | Möglichst viele bekannte Begriffe erstmals offen prüfen und die Art der Lücken erkennen. | In den ersten Einheiten Fragen aus mehreren Kategorien auswählen. Danach fällige Wiederholungen mit noch ungeprüften Begriffen verbinden. |
| Tage 8–14: Abdeckung abschließen | Als Planungsziel alle 139 Begriffe erstmals prüfen, ohne bereits erkannte Lücken liegen zu lassen. | Die Zahl der Erstabrufe nach Rückstand und verbleibenden Tagen steuern. Bei Rückstand anzeigen, wie viele Begriffe noch ungeprüft sind und welche Zusatzlast eine vollständige Abdeckung bedeuten würde. |
| Tage 15–21: Erklärungen absichern | Offene Nachweise nachholen, Verwechslungen beheben und Prüfungsfragen beantworten. | Zuerst Begriffe prüfen, bei denen ein vollständiger Abruf noch nicht bestätigt ist. Danach ausgewählte Originalfragen und Fallvarianten einsetzen. An Tag 21 eine Bilanz ziehen, keine offenen Begriffe automatisch als beherrscht markieren. |

Tag 14 ist ein Steuerungsziel, kein Zwang. Sind beispielsweise am Ende von Tag 10 noch 48 Begriffe ungeprüft, wären im Schnitt zwölf Erstabrufe pro Tag nötig, um das Ziel zu halten. Die App macht diesen Rückstand sichtbar und bietet einen zusätzlichen Block an. Überspringt der Nutzer den Block, wird das Ziel neu geschätzt. Die App meldet den tatsächlichen Stand, statt durch leichtere Fragen künstlich Fortschritt zu erzeugen.

### 2.2 Ablauf der beiden Lektionen

**Lektion 1 – Abrufen und diagnostizieren.** Die App beginnt mit einem kleinen Block fälliger offener Fragen. Danach nimmt sie je nach Rückstand weitere fällige oder bisher ungeprüfte Begriffe auf. Bei einer Teilantwort fragt sie nicht pauschal alles noch einmal ab: Sie zeigt zunächst, *welcher* fachliche Punkt fehlte. Anschließend kann sie genau diesen Punkt üben. Bei einer Verwechslung stellt sie die betroffenen Begriffe gezielt gegenüber.

**Lektion 2 – Reparieren und anwenden.** Die App greift ausgewählte Lücken aus der ersten Lektion mit verändertem Wortlaut auf und ergänzt weitere fällige Wiederholungen. Wenn wenig Reparaturbedarf besteht, nutzt sie die Zeit für zusätzliche Erstabrufe oder einen kurzen Fall. Eine gute Antwort am Abend darf zeigen, dass die Korrektur verstanden wurde; sie zählt aber nicht als zweiter Nachweis für denselben Tag.

Nach einem sinnvollen Aufgabenblock kann der Nutzer aufhören oder weiterlernen. Die App zeigt beispielsweise: „Zwei fällige Wiederholungen offen; die nächste betrifft eine wiederholte Verwechslung.“ Offene Aufgaben bleiben erhalten. Bei verpassten Lektionen werden überfällige Aufgaben neu priorisiert, nicht ungefiltert in die nächste Lektion gestapelt.

### 2.3 Wie die App auf Schwächen reagiert

Die erste Umsetzung braucht nachvollziehbare Regeln, keinen komplexen Vorhersagealgorithmus. Die folgende Taktung ist eine Startkonfiguration, die anhand der Nutzung angepasst werden kann.

| Ergebnis beim freien Abruf | Reaktion | Nächste unabhängige Abfrage |
|---|---|---|
| Vollständig, erstmals gelungen | Kein Pflicht-Lückentext, keine leichtere Zwischenstufe. | Standardmäßig nach mindestens drei Tagen, mit anderer Formulierung. |
| Vollständig, an einem späteren Tag bestätigt | Begriff aus den häufigen Wiederholungen nehmen. | Bei Bedarf späterer Kontrollabruf, etwa nach weiteren fünf bis sieben Tagen, sofern der Kurszeitraum das zulässt. |
| Teilweise richtig | Fehlendes Pflichtmerkmal speichern; kurze gezielte Übung anbieten. | Meist am nächsten Tag. Gelingt die Erklärung, folgt die Bestätigung frühestens drei Tage nach diesem vollständigen Abruf. |
| Falsch, verwechselt oder nicht abrufbar | Musterantwort zeigen, Verwechslung gezielt bearbeiten und im nächsten Lernfenster erneut üben. | Frühestens am nächsten Tag als unabhängiger Abruf; bei erneutem Fehler weiter priorisieren. |
| Nach Bestätigung wieder unvollständig | Status zurücksetzen und den konkreten Fehler speichern. | Neuer Bestätigungszyklus nach der Korrektur. |

Innerhalb einer Lektion kommen wiederholt falsche und überfällige Begriffe zuerst. Ein Begriff soll die Lektion aber nicht blockieren: Nach einer kurzen Korrektur und höchstens einer unmittelbaren erneuten Erklärung geht es weiter. Wenn nur wenige Begriffe den Rückstand verursachen, bekommen andere Themen trotzdem Platz. Zwei Lernende mit demselben Kursstart können dadurch an Tag 10 sehr unterschiedliche Lektionen sehen.

Ein Begriff gilt im 3‑Wochen‑Trainer als bestätigt, wenn er zweimal ohne Hilfe vollständig erklärt wurde, mit mindestens drei Kalendertagen Abstand und ohne dazwischenliegenden unvollständigen freien Abruf. Die Abschlussansicht zeigt getrennt: erstmals geprüft, bestätigt, erneut unsicher und im Prüfungsstil angewendet. So bleibt erkennbar, ob eine Lücke in der Definition, bei der Abgrenzung oder erst im Fall auftritt.

## 3. Umsetzung: Eine App, zwei Planungslogiken

Die beiden Versionen sollten keine getrennten Apps sein. Sie verwenden denselben Fragenbestand, dieselbe Aufgabenansicht und dieselbe Bewertungslogik. Unterschiedlich ist, welche Aufgabe als Nächstes ausgewählt wird und wann ein Abruf als bestätigt gilt. Der Fortschritt wird pro Durchlauf gespeichert: Ein bestätigter Begriff aus dem 3‑Wochen‑Trainer gilt beim Start eines neuen Sprints nicht automatisch als im Sprint bestätigt.

| Baustein | Was gespeichert oder umgesetzt wird |
|---|---|
| Glossarimport | Glossar-Nr. als stabile Begriffs-ID, deutscher und englischer Name, Kategorie, Glossardefinition und Lektionsverweis. Doppeldeutige Bezeichnungen werden redaktionell getrennt, etwa wenn „Buying Signal“ in verschiedenen Glossareinträgen vorkommt.  |
| Fragenbank | Fragen-ID, geprüfte Begriffe, Wortlaut, Format, Musterantwort mit Herkunft, Kriterien, Originalwortlaut, sekundäre Zuordnungen, Variantenfamilie und Kennzeichnung „für Abschluss reserviert“. |
| Lernprotokoll | Durchlauf, Datum, Frage und Variante, Ergebnis je Begriff, fehlende Kriterien und ob die App vor der Antwort Hilfe gezeigt hat. |
| Aufgabenauswahl | Der 3‑Wochen‑Trainer priorisiert Fälligkeit, Fehler und Abdeckung. Der Sprint führt feste Pflichtgruppen plus eine flexible Lückenliste. Beide nutzen dieselbe Sperre gegen identische Folgefragen. |
| Oberfläche | Moduswahl, Tagesübersicht mit zwei Lektionen, Frage, Rückmeldung, Lernstand nach Thema und Abschlussbilanz. Für die erste Version reichen gesprochenes Antworten ohne Aufnahme und Selbstbewertung nach Kriterien. |

Die Redaktion beginnt mit der Prüfung der 141 vorhandenen Fragezuordnungen im Zielbereich. Anschließend werden nur Lücken bei offenen Varianten und Erwartungshorizonten geschlossen. Ein interner Probelauf mit 25–30 Begriffen prüft Planung, Zeitbedarf und Fehlerrückmeldung. Vor Freigabe müssen alle Nummern 1–139 abgedeckt sein. Der Importbericht trennt Definitionen, Bestandsfragen, geprüfte aktive Fragen, redaktionell ergänzte Varianten und noch offene Musterantworten.

Vor der Freigabe müssen insbesondere diese Fälle funktionieren:

- Die Zusatzfragen zu Nr. 1 und Nr. 27 werden als separate Fragen importiert. Fragen ab Nr. 140 bleiben deaktiviert.
- Eine Prüfungssituation mit bloßer Zuordnung ohne Erklärung wird nicht als Definitionsnachweis gezählt.
- Derselbe Begriff erscheint zweimal in einer Lektion: Die zweite Frage hat einen anderen Wortlaut.
- Eine Originalfrage taucht als Variantenfrage auf: Die App kennzeichnet sie nicht fälschlich als unveränderte Originalfrage.
- Eine Frage vergleicht zwei Begriffe: Eine vollständige Erklärung des ersten schreibt dem zweiten keinen Erfolg gut.
- Der Nutzer antwortet nach einem Hinweis korrekt: Die App speichert einen Übungserfolg, aber keinen freien Nachweis.
- Ein bestätigter Begriff wird später wieder falsch erklärt: Der Status reagiert darauf.
- Eine Sprintlektion wird ausgelassen: Die App zeigt Nachholbedarf und verbleibende Möglichkeiten, statt Aufgaben oder Nachweise unbemerkt zu streichen.

Damit ist die Rollenverteilung klar: Im 3‑Wochen‑Trainer passt sich der Plan dem Lernstand an. Im Sprint bleibt die Abdeckung fest geplant, und die App passt die knappe zusätzliche Übungszeit den Schwächen an. In beiden Fällen ist nicht die Anzahl geklickter Aufgaben das Ergebnis, sondern die nachweisbar vollständige Erklärung bei einer neu formulierten Frage.


# Produktkonzept: 7‑Tage‑Sprint

Fassung auf Basis der verifizierten Excel-Quelldatei. Pflichtstoff: Glossar-Nr. 1–139.

## 1. Gemeinsame Grundlage für beide Versionen

### 1.1 Verbindliche Quelle und Umfang

Verbindliche Inhaltsquelle ist `Glossar_Digital_Sales_Management_mit_Pruefungsfragen.xlsx`. Beide Lernmodi verwenden ausschließlich die Glossar-Nummern **1–139** („Digitaler Vertrieb“ bis „Datenqualität“). Die Nummer ist der Schlüssel, nicht die Excel-Zeilennummer. Die weiteren 35 Begriffe (140–174) bleiben samt ihren Fragen in beiden Modi deaktiviert, auch im Abschlusscheck.

| Bestandteil | Gesamtdatei | Kandidaten für die beiden Lernmodi |
|---|---:|---:|
| Glossarbegriffe mit Definition | 174 | 139 |
| Regulär zugeordnete Prüfungsfragen | 174 | 139 (22 Originalfragen, 117 neue Übungsfragen) |
| Zusätzliche Originalfragen | 6 | 2 (zu Nr. 1 „Digitaler Vertrieb“ und Nr. 27 „Touchpoint“) |
| Fragen insgesamt | 180 | 141 vor fachlicher Prüfung und Ergänzung von Varianten |

**Definition und Musterantwort sind nicht dasselbe.** Die Spalte „Was es bedeutet“ im Glossar enthält die Definitionen. Der Prüfungsfragen-Reiter enthält Nummer, Begriff, Frage, Herkunft und „Auch relevant für“, aber keine separate Antwortspalte. Die vorhandene Definition ist die erste Quelle für eine Musterantwort zur Begriffsabfrage. Für einen Fall oder eine mehrteilige Frage wird ein eigener, redaktionell geprüfter Erwartungshorizont ergänzt, wenn die Glossardefinition die Frage nicht vollständig beantwortet. Ergänzungen werden separat gespeichert und nicht als Originalantwort ausgegeben.

### Import- und Redaktionsregeln

1. Nummer, Glossardefinition, Kategorie und Lektionsverweis übernehmen. Die Haupt- und Zusatzfragen anhand von „Nr.“ zuordnen und „Herkunft“ sowie „Auch relevant für“ auslesen. Originalfragen als solche erhalten; Umformulierungen getrennt kennzeichnen.
2. Die 141 zugeordneten Fragen zuerst fachlich prüfen. Eine Frage bleibt nur dann aktiv, wenn für ihre vollständige Lösung kein Begriff außerhalb der Nummern 1–139 nötig ist. Die Hauptzuordnung allein entscheidet nicht: Fragewortlaut und Lösungskriterien sind ebenfalls maßgeblich.
3. Vorhandene Fragen nach ihrer Funktion einordnen: vollständige Begriffsabfrage, Abgrenzung oder Anwendung. Eine vorhandene Fallfrage wird nicht allein aufgrund ihrer Glossar-Nummer als Definitionsnachweis gewertet. Sie bleibt für Transfertraining oder einen Abschlusscheck nutzbar.
4. Vorhandene offene Formulierungen zuerst verwenden. Für jeden Begriff prüfen, ob zwei fachlich gleichwertige offene Abfragen für Erst- und Zweitabruf verfügbar sind. Fehlende Varianten gezielt aus dem Quellmaterial erstellen. Weitere Varianten für Nachprüfungen werden dort ergänzt, wo der Bestand nicht reicht. Keine pauschale Neuerstellung aller Prüfungsfragen.
5. Für die Bewertung aus den Definitionen und den passenden Kursunterlagen die Pflichtmerkmale ableiten. Zwei bis drei sind ein Richtwert für kurze Definitionen, keine Obergrenze. Geeignete Originalfragen für den Abschluss reservieren, sofern der Pflichtpfad ohne sie abgedeckt ist.

### 1.2 Verbindliche Regel: Jede Wiederabfrage hat einen anderen Wortlaut

Bei jeder erneuten Abfrage eines Begriffs wählt die App eine andere Formulierung als beim letzten Auftreten dieses Begriffs. Das gilt auch für Korrekturfragen in derselben Lektion, Nachholaufgaben und den Abschlusscheck. Die App bevorzugt Varianten, die der Nutzer im aktuellen Durchlauf noch nicht gesehen hat. Sind sie ausgeschöpft, darf sie eine ältere Variante wiederverwenden, aber nie die unmittelbar letzte. Änderungen nur an Satzzeichen, Großschreibung oder Formatierung gelten nicht als Umformulierung.

Die Variante soll einen anderen Einstieg bieten, ohne versehentlich die Lösung vorzugeben oder eine völlig andere Leistung zu prüfen. Eine Frage, die nur nach einem Beispiel fragt, ersetzt also keine vollständige Definition. Eine Vergleichsfrage kann für zwei Begriffe zählen, wenn sie tatsächlich beide Erklärungen verlangt und beide getrennt bewertet werden.

Designbeispiel aus dem Glossar: Lead Scoring und Lead Nurturing. Das Glossar unterscheidet die Priorisierung nach Passung und Verhalten von der Pflege eines Leads mit passenden Inhalten bis zur Kaufbereitschaft.

| Einsatz | Frage |
|---|---|
| Erstabruf | „Was versteht man unter Lead Scoring?“ |
| Offene Wiederabfrage | „Wie funktioniert Lead Scoring, und welche Entscheidung unterstützt es?“ |
| Gezielte Abgrenzung | „Erkläre den Unterschied zwischen Lead Scoring und Lead Nurturing. Was macht der Vertrieb oder das Marketing jeweils mit dem Lead?“ |
| Rückfrage nach einer unvollständigen Antwort | „Anhand welcher Informationen wird ein Lead beim Scoring priorisiert, und wozu dient diese Priorisierung?“ |

### 1.3 Einheitlicher Aufgaben- und Bewertungsablauf

1. Die App zeigt die Frage ohne Lösungshinweise. Der Nutzer antwortet laut oder in einem kurzen Textfeld und tippt auf „Antwort prüfen“. Lautes Antworten funktioniert ohne Aufnahme oder Spracherkennung.
2. Erst danach erscheinen die Musterantwort und die Pflichtmerkmale. Der Nutzer markiert, welche Merkmale er sinngemäß genannt hat. Ein fachlicher Widerspruch kann nicht durch passende Stichwörter ausgeglichen werden.
3. Die App speichert das Ergebnis als vollständig, teilweise richtig oder falsch/nicht abrufbar. Optional kann der Nutzer markieren: „War geraten.“ Das beeinflusst die Reihenfolge weiterer Fragen, ersetzt aber nicht die fachliche Bewertung.
4. Fehlt ein Merkmal, gibt die App gezieltes Feedback. Ein Lückentext hilft bei einem fehlenden Bestandteil, eine Auswahlfrage bei einer konkreten Verwechslung, eine Wahr/Falsch-Aufgabe beim Korrigieren eines Irrtums. Anschließend kann der Begriff mit neuer Formulierung noch einmal offen erklärt werden.
5. Ein unterstützter Versuch oder eine richtige Antwort direkt nach der Korrektur zählt als Übung, nicht als unabhängiger Nachweis. Dafür muss der Nutzer den Begriff an einem anderen Tag vollständig und ohne Hilfe erklären. Den Nachweis für eine Definition und das Ergebnis einer Fallfrage zeigt die App getrennt an.

## 2. Version 2: 7‑Tage‑Sprint

### 2.1 Was aus Geminis Sprint-Konzept einfließt

Aus `7-tage-sprint.md` übernehme ich die schnelle Einordnung nach Fehlerbild, das laute Antworten statt langer Texte, gezielte Kurzformate und den Schwerpunkt auf Risikobegriffen an Tag 6 und 7. Nicht übernommen werden der starre Deckel von 18 Aufgaben, das Aussortieren eines Begriffs nach einer einzigen richtigen Antwort und ein Erstcheck, bei dem ein Teil der Begriffe nur per Auswahl oder Lückentext geprüft wird. Das wäre ein kürzerer Diagnosesprint, aber nicht der beschlossene Sprint mit einem offenen Erst- und Wiederholungsabruf für alle 139 Begriffe. Die Priorisierung aus Geminis Vorschlag steuert deshalb die *zusätzliche Übung*, nicht die Frage, ob ein Begriff seinen zweiten offenen Check bekommt.

### 2.2 Ausführbares Skript für alle 14 Lektionen

Die App teilt den Bestand vor Beginn in zehn Gruppen auf: A1/A2 bis D1/D2 mit je 14 Begriffen, E1 mit 14 und E2 mit 13. Die Gruppen mischen Themen, ohne wahllos zu springen. Sinnvolle Kontrastpaare wie ICP und Buyer Persona können in derselben Lektion abgefragt werden, aber die erste Frage soll die zweite Antwort nicht vorwegnehmen.

| Tag | Lektion 1 | Lektion 2 |
|---|---|---|
| 1 | A1: 14 offene Erstabrufe. Fehler direkt markieren und kurz korrigieren. | A2: 14 offene Erstabrufe. Falls Zeit bleibt, eine oder zwei Lücken aus A1 neu formuliert aufgreifen. |
| 2 | B1: 14 offene Erstabrufe. Kurzer Zusatzcheck für hartnäckige Lücken aus A, wenn Platz ist. | B2: 14 offene Erstabrufe. Fehlerliste nach fehlendem Merkmal und Verwechslung sortieren. |
| 3 | A1: 14 offene Wiederholungen mit neuer Frage. Danach C1: 14 Erstabrufe. | A2: 14 offene Wiederholungen. Danach C2: 14 Erstabrufe. |
| 4 | B1: 14 offene Wiederholungen. Danach D1: 14 Erstabrufe. | B2: 14 offene Wiederholungen. Danach D2: 14 Erstabrufe. |
| 5 | C1: 14 offene Wiederholungen. Danach E1: 14 Erstabrufe. | C2: 14 offene Wiederholungen. Danach E2: 13 Erstabrufe. Sollstand: 139 Begriffe erstmals geprüft. |
| 6 | D1: 14 offene Wiederholungen. Danach ausgewählte offene Lückenchecks aus A bis C. | D2: 14 offene Wiederholungen. Danach offene Vergleichs- oder Fallfragen zu den häufigsten Verwechslungen. |
| 7 | E1: 14 offene Wiederholungen. Danach offene Nachprüfungen für Begriffe, die bisher nur einmal vollständig gelangen. | E2: 13 offene Wiederholungen. Danach kurzer Prüfungscheck mit zurückgehaltenen Fragen und persönlicher Ergebnisübersicht. |

Die Pflichtblöcke ergeben 139 Erstabrufe und 139 Wiederholungsabrufe. Jeder planmäßige Zweitcheck liegt zwei Kalendertage nach dem Erstcheck. Zusatzübungen dürfen diesen Termin weder ersetzen noch einen fehlenden Nachweis verdecken.

### 2.3 Lektionsskript: Was die App im Sprint anzeigt und tut

1. **Start:** „Heute: 14 Begriffe erneut erklären, danach 14 erstmals prüfen.“ Die App zeigt vorab den Umfang, aber keine Antworten und keinen Countdown.
2. **Pflichtblock:** Bei „vollständig“ geht es direkt weiter. Bei „teilweise“ zeigt die App das fehlende Merkmal. Bei „falsch“ zeigt sie die kurze Musterantwort und legt den Begriff auf die priorisierte Lückenliste. Die ausführlichere Reparatur erfolgt nach dem Pflichtblock, damit mehrere schwierige Begriffe nicht den gesamten Tagesplan verdrängen.
3. **Lückenblock:** Bei freien Kapazitäten folgen kurze Zusatzübungen. Vorrang haben fachliche Verwechslungen, wiederholte Fehler und Begriffe, denen nur noch ein unabhängiger Nachweis fehlt. Lückentext oder Auswahlfrage dienen nur der Korrektur. Die spätere Bewertung erfolgt wieder offen.
4. **Abschluss:** „28 Pflichtfragen abgeschlossen. Drei Begriffe sind noch unsicher; zwei weitere wurden heute erstmals vollständig erklärt.“ Die App zeigt, wann der nächste offene Check geplant ist.

Die 12–15 Minuten pro Lektion sind ein Richtwert für überwiegend mündliche Kurzantworten, keine Garantie. Bei 28 Aufgaben und 25 Sekunden pro Aufgabe sind bereits 11 Minuten und 40 Sekunden verplant; bei 35 Sekunden sind es 16 Minuten und 20 Sekunden, noch ohne Zusatzblock. Deshalb sind die leichten Tage 1 und 2 sowie die freien Blöcke an Tag 6 und 7 wichtig. An den dichten Tagen kürzt die App zuerst Zusatzübungen, nicht die Qualität der Pflichtfragen.

### 2.4 Sprint-Regeln für Fehler und verpasste Lektionen

- **Vollständig beim Erstabruf:** Keine zusätzliche Übung nötig. Der Begriff bleibt trotzdem für den offenen Zweitcheck zwei Tage später eingeplant.
- **Unvollständig beim Erstabruf, vollständig beim Zweitcheck:** Der Begriff hat erst einen erfolgreichen unabhängigen Abruf. Die App versucht, ihn an einem weiteren Tag zu bestätigen. Gelingt der erste vollständige Abruf erst an Tag 7, endet der Sprint für diesen Begriff mit „einmal vollständig“.
- **Falsch beim Zweitcheck:** Der Begriff bleibt unsicher und rückt im nächsten verfügbaren Lückenblock nach oben. Zwei richtige Antworten am selben Tag ändern daran nichts.
- **Lektion verpasst:** Offene Pflichtfragen bleiben in der Warteschlange. Die App rechnet vom tatsächlichen Erstabruf aus neu. Zwei Tage Abstand bleiben der Sollwert; wenn vor Sprintende nur ein späterer Kalendertag zur Verfügung steht, ist ein verkürzter Nachcheck möglich und wird als solcher angezeigt. Gibt es keinen späteren Tag mehr, bleibt die Bestätigung offen. Statt den Rückstand zu verbergen, zeigt die App, welcher Zusatzblock nötig wäre und was ohne ihn bis Tag 7 offen bleibt.

Die Abschlussansicht beantwortet drei Fragen: *Wurden alle 139 Begriffe erstmals geprüft? Bei welchen Begriffen war die vollständige Erklärung an zwei verschiedenen Tagen möglich? Welche Aufgaben im Prüfungsstil bereiten noch Schwierigkeiten?* Damit bleibt der Sprint auch dann aussagekräftig, wenn nicht alle Begriffe in sieben Tagen bestätigt werden.

## 3. Umsetzung: Eine App, zwei Planungslogiken

Die beiden Versionen sollten keine getrennten Apps sein. Sie verwenden denselben Fragenbestand, dieselbe Aufgabenansicht und dieselbe Bewertungslogik. Unterschiedlich ist, welche Aufgabe als Nächstes ausgewählt wird und wann ein Abruf als bestätigt gilt. Der Fortschritt wird pro Durchlauf gespeichert: Ein bestätigter Begriff aus dem 3‑Wochen‑Trainer gilt beim Start eines neuen Sprints nicht automatisch als im Sprint bestätigt.

| Baustein | Was gespeichert oder umgesetzt wird |
|---|---|
| Glossarimport | Glossar-Nr. als stabile Begriffs-ID, deutscher und englischer Name, Kategorie, Glossardefinition und Lektionsverweis. Doppeldeutige Bezeichnungen werden redaktionell getrennt, etwa wenn „Buying Signal“ in verschiedenen Glossareinträgen vorkommt.  |
| Fragenbank | Fragen-ID, geprüfte Begriffe, Wortlaut, Format, Musterantwort mit Herkunft, Kriterien, Originalwortlaut, sekundäre Zuordnungen, Variantenfamilie und Kennzeichnung „für Abschluss reserviert“. |
| Lernprotokoll | Durchlauf, Datum, Frage und Variante, Ergebnis je Begriff, fehlende Kriterien und ob die App vor der Antwort Hilfe gezeigt hat. |
| Aufgabenauswahl | Der 3‑Wochen‑Trainer priorisiert Fälligkeit, Fehler und Abdeckung. Der Sprint führt feste Pflichtgruppen plus eine flexible Lückenliste. Beide nutzen dieselbe Sperre gegen identische Folgefragen. |
| Oberfläche | Moduswahl, Tagesübersicht mit zwei Lektionen, Frage, Rückmeldung, Lernstand nach Thema und Abschlussbilanz. Für die erste Version reichen gesprochenes Antworten ohne Aufnahme und Selbstbewertung nach Kriterien. |

Die Redaktion beginnt mit der Prüfung der 141 vorhandenen Fragezuordnungen im Zielbereich. Anschließend werden nur Lücken bei offenen Varianten und Erwartungshorizonten geschlossen. Ein interner Probelauf mit 25–30 Begriffen prüft Planung, Zeitbedarf und Fehlerrückmeldung. Vor Freigabe müssen alle Nummern 1–139 abgedeckt sein. Der Importbericht trennt Definitionen, Bestandsfragen, geprüfte aktive Fragen, redaktionell ergänzte Varianten und noch offene Musterantworten.

Vor der Freigabe müssen insbesondere diese Fälle funktionieren:

- Die Zusatzfragen zu Nr. 1 und Nr. 27 werden als separate Fragen importiert. Fragen ab Nr. 140 bleiben deaktiviert.
- Eine Prüfungssituation mit bloßer Zuordnung ohne Erklärung wird nicht als Definitionsnachweis gezählt.
- Derselbe Begriff erscheint zweimal in einer Lektion: Die zweite Frage hat einen anderen Wortlaut.
- Eine Originalfrage taucht als Variantenfrage auf: Die App kennzeichnet sie nicht fälschlich als unveränderte Originalfrage.
- Eine Frage vergleicht zwei Begriffe: Eine vollständige Erklärung des ersten schreibt dem zweiten keinen Erfolg gut.
- Der Nutzer antwortet nach einem Hinweis korrekt: Die App speichert einen Übungserfolg, aber keinen freien Nachweis.
- Ein bestätigter Begriff wird später wieder falsch erklärt: Der Status reagiert darauf.
- Eine Sprintlektion wird ausgelassen: Die App zeigt Nachholbedarf und verbleibende Möglichkeiten, statt Aufgaben oder Nachweise unbemerkt zu streichen.

Damit ist die Rollenverteilung klar: Im 3‑Wochen‑Trainer passt sich der Plan dem Lernstand an. Im Sprint bleibt die Abdeckung fest geplant, und die App passt die knappe zusätzliche Übungszeit den Schwächen an. In beiden Fällen ist nicht die Anzahl geklickter Aufgaben das Ergebnis, sondern die nachweisbar vollständige Erklärung bei einer neu formulierten Frage.
