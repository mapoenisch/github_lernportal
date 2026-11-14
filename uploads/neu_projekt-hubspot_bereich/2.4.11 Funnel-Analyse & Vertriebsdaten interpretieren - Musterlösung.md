Musterlösung 2.4.11

# **Funnel-Analyse & Vertriebsdaten interpretieren** 

*Die Zahlen beziehen sich auf die Datei* [Deals\_Import\_Funnel-Analyse.csv](https://drive.google.com/file/d/15ghhMWrptcryc8HOKBfcuzsHypgifDYx/view?usp=sharing) *mit 40 Deals. Teilaufgaben, die eine eigene Einschätzung verlangen, sind grau-kursiv als Beispiel gekennzeichnet.*

## Aufgabe 1: Deals importieren

## (45 Minuten)

**Ziel:** Bevor du Vertriebsdaten auswerten kannst, brauchst du Daten im System. In dieser Aufgabe importierst du eine bereitgestellte Deal-Liste in HubSpot.

**1\.  Datei sichten:** Öffne die bereitgestellte Datei **„[Deals Import Funnel-Analyse.csv](https://drive.google.com/file/d/15ghhMWrptcryc8HOKBfcuzsHypgifDYx/view?usp=sharing)"** und verschaffe dir einen Überblick (Spalten: Deal-Name, Deal-Phase, Betrag, Abschlussdatum).

**Lösung:** Die Datei enthält 40 Deals mit den Spalten Deal-Name, Deal-Phase (Deal Stage), Betrag (Amount) und Abschlussdatum (Close Date), alle in der Sales-Pipeline. Es kommen sieben Phasen vor, von Termin vereinbart bis Abgeschlossen und gewonnen beziehungsweise verloren.

**2\.  Import durchführen:** Gehe zu **CRM \> Deal \> Importieren**, lade die Datei hoch und ordne die Spalten den passenden Deal-Eigenschaften zu (Deal-Name, Deal-Phase, Betrag, Abschlussdatum). 

**Lösung:** Unter CRM \> Deals \> Importieren wird die CSV hochgeladen und zugeordnet: Deal Name zu Deal-Name, Deal Stage zu Deal-Phase, Amount zu Betrag, Close Date zu Abschlussdatum. Wichtig ist, dass die Werte der Deal-Phase zu den Stages der Sales-Pipeline passen, sonst landen die Deals in der falschen Phase.

**3\.  Import prüfen:** Kontrolliere stichprobenartig, dass die Deals korrekt in den jeweiligen Stages gelandet sind.

**Lösung:** Nach dem Import stehen 40 Deals im Board, verteilt auf die sieben Phasen. Stichprobe: „Bytewerk Software“ liegt in „Vertrag gesendet“, „TechNova Systems“ in „Abgeschlossen und gewonnen“.

##  Aufgabe 2: Deals auswerten

## (60 Minuten)  **Ziel:** Jetzt wertest du die importierten Deals aus. Die Kennzahlen liest du direkt aus HubSpot ab (Deal-Board, Filter, Summen).

**1\.  Verteilung ermitteln:** Wie viele Deals stehen in welcher Stage? Halte die Verteilung über alle Phasen fest.

Verteilung über alle Phasen:

| Deal-Phase | Anzahl Deals |
| :---- | :---: |
| **Termin vereinbart** | 4 |
| **Für Kauf qualifiziert** | 8 |
| **Präsentation vereinbart** | 3 |
| **Entscheidungsträger hat zugestimmt** | 3 |
| **Vertrag gesendet** | 2 |
| **Abgeschlossen und gewonnen** | 8 |
| **Abgeschlossen und verloren** | 12 |
| **Summe** | **40** |

**2\.  Win Rate berechnen:** Berechne aus den abgeschlossenen Deals die Win Rate: **Gewonnen ÷ (Gewonnen \+ Verloren) × 100**.

**Lösung:** Gewonnen \= 8, Verloren \= 12\. Win Rate \= 8 geteilt durch (8 \+ 12), mal 100 \= 40 Prozent.

**3\.**  Ermittle den **Gesamtwert der offenen Deals** (Pipeline-Wert).

Offen sind alle Deals außer den abgeschlossenen, also 20 Deals mit einem Pipeline-Wert von zusammen 559.000 EUR:

| Offene Phase | Deals | Summe (EUR) |
| :---- | :---: | :---: |
| **Termin vereinbart** | 4 | 110.000 |
| **Für Kauf qualifiziert** | 8 | 201.000 |
| **Präsentation vereinbart** | 3 | 96.000 |
| **Entscheidungsträger hat zugestimmt** | 3 | 100.000 |
| **Vertrag gesendet** | 2 | 52.000 |
| **Gesamt** | **20** | **559.000** |

**Reflexion:** Warum ist das aufwändig, und wie geht es schneller?

Die manuelle Auswertung ist mühsam, weil man je Phase filtern, die Deals zählen und die Beträge von Hand addieren muss. Das kostet Zeit, ist schon bei 40 Deals fehleranfällig und muss bei jeder Aktualisierung der Daten komplett wiederholt werden. Schneller, wiederholbar und automatisch geht es mit einem Bericht in HubSpot, der Anzahl und Summe je Phase selbst berechnet und sich bei neuen Daten von allein aktualisiert, und später mit einem Dashboard, das mehrere solcher Berichte bündelt.

## Aufgabe 3: Interpretieren und Engpass finden

## (45 Minuten)  **Ziel:** Zahlen allein sagen wenig – jetzt liest du heraus, wo es im Funnel klemmt. Diese Aufgabe löst du schriftlich. 

**1\.  Engpass identifizieren:** In welcher Stage stauen sich die meisten offenen Deals? Das ist ein möglicher Engpass (Bottleneck).

**Lösung:** Die meisten offenen Deals stehen in „Für Kauf qualifiziert“ mit 8 offenen Deals. Das ist der mögliche Engpass.

**2\.  Ursachen hypothetisieren:** Nenne 2–3 mögliche Gründe, warum an dieser Stelle so viele Deals hängen bleiben.

Mögliche Gründe: Nach der Qualifizierung wird nicht konsequent nachgefasst, sodass Deals liegen bleiben. Es werden zu wenige oder zu späte Präsentationstermine vereinbart, um die Deals weiterzubewegen. Die nächsten Schritte sind unklar, oder es fehlen Ressourcen, um Angebote und Präsentationen zeitnah zu erstellen.

**3\. Maßnahmen ableiten:** Formuliere 2–3 konkrete Maßnahmen, um genau diesen Engpass zu lösen.

Mögliche Maßnahmen: Eine verbindliche Wiedervorlage und Follow-up-Kadenz nach der Qualifizierung einführen. Die Regel setzen, dass direkt nach der Qualifizierung ein Präsentationstermin vereinbart wird. Diese Phase in einer wöchentlichen Pipeline-Durchsicht gezielt prüfen und Deals ohne Fortschritt entweder aktiv anschieben oder bereinigen.

Musterlösung 2.4.11

# **Bonusaufgaben**

## Aufgabe 4: Nach Wert priorisieren

## (30 Minuten)

Sortiere bzw. filtere die offenen Deals nach Betrag: Welche drei offenen Deals haben den höchsten Wert? Überlege schriftlich, warum es sinnvoll sein kann, diese priorisiert zu bearbeiten – und wo die Grenze dieser Sichtweise liegt.

**Top 3 offene Deals nach Betrag:** 

Die drei wertvollsten offenen Deals sind:

| Deal | Betrag (EUR) | Phase |
| :---- | :---: | :---- |
| **Bytewerk Software** | 45.000 | Vertrag gesendet |
| **Stadtwerk Media** | 43.000 | Termin vereinbart |
| **Druckerei Pfeil** | 42.000 | Präsentation vereinbart |

**Begründung und Grenze:**   
Priorisieren ist sinnvoll, weil die begrenzte Zeit auf die Deals mit dem größten Umsatzhebel gelenkt wird. Die Grenze: Der reine Betrag blendet die Abschlusswahrscheinlichkeit und die Phase aus. Bytewerk mit 45.000 EUR steht bereits bei „Vertrag gesendet“ und ist damit nah am Abschluss, Stadtwerk mit 43.000 EUR dagegen erst bei „Termin vereinbart“ und damit weit unsicherer. Wer nur nach Wert sortiert, übersieht außerdem Aufwand, strategische Bedeutung und Timing.