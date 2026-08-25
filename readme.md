

# **Lernportal – Digital Sales Management**

Interaktives Lernportal für den Kurs **Digital Sales Management** der Digital Business Akademie (DBA).

Das Projekt bündelt Lerninhalte, interaktive Übungen, Prozessdarstellungen, Design-System-Komponenten und begleitende Materialien in einer webbasierten Lernumgebung.

## **Überblick**

Das Lernportal ist als eigenständige Web-Anwendung aufgebaut und enthält sowohl die eigentliche Lernoberfläche als auch die dafür verwendeten Komponenten, Design-Tokens, Guidelines und Assets.

Der aktuelle Stand des Repositories umfasst unter anderem:

* interaktive Lernportal-Seiten  
* Quiz- und Lerndaten  
* HTML-basierte Infografiken  
* wiederverwendbare UI-Komponenten  
* Design-System-Guidelines  
* zentrale CSS-Tokens  
* begleitende PDF-, Bild- und HTML-Assets  
* eine eigenständige UI-Kit-Version des Lernportals  
* verschiedene Standalone- und Print-Versionen

## **Projektstruktur**

.  
├── index.html  
├── DBA Lernportal (offline).html  
├── Lernportal.dc.html  
├── Lernportal-standalone.dc.html  
├── Lernportal-print-1ihrpx6.dc.html  
│  
├── quizData.js  
├── styles.css  
├── support.js  
├── SKILL.md  
│  
├── assets/  
│   └── Bilder, PDFs und weitere Materialien  
│  
├── components/  
│   ├── core/  
│   ├── content/  
│   ├── navigation/  
│   └── process/  
│  
├── guidelines/  
│   └── Design-System- und Styleguides  
│  
├── tokens/  
│   ├── colors.css  
│   ├── fonts.css  
│   ├── spacing.css  
│   └── typography.css  
│  
└── ui\_kits/  
    └── lernportal/

## **Zentrale Dateien**

### **`index.html`**

Einstiegspunkt des Webprojekts.

### **`Lernportal.dc.html`**

Eine zentrale Version des Lernportals mit der vollständigen Lernoberfläche.

### **`Lernportal-standalone.dc.html`**

Standalone-Variante des Lernportals.

### **`Lernportal-print-1ihrpx6.dc.html`**

Für die Ausgabe bzw. Nutzung in einem Print-orientierten Kontext vorbereitete Version.

### **`DBA Lernportal (offline).html`**

Offline-Variante des Lernportals.

### **`quizData.js`**

Enthält die Daten für die im Lernportal verwendeten Quiz- bzw. interaktiven Lerninhalte.

### **`styles.css`**

Zentrale Styles des Projekts.

### **`support.js`**

Unterstützende JavaScript-Funktionen für das Lernportal.

### **`SKILL.md`**

Portable Beschreibung bzw. Skill-Wrapper für die Arbeit mit dem Projekt.

---

## **Components**

Der Ordner `components/` enthält wiederverwendbare UI- und Prozesskomponenten.

### **Core**

components/core/  
├── Button  
├── Card  
└── Chip

Grundlegende UI-Bausteine für Buttons, Karten und Chips.

### **Content**

components/content/  
├── Callout  
├── DataTable  
├── QuoteBlock  
└── TaskCard

Komponenten zur Darstellung von Lern- und Inhaltsblöcken.

### **Navigation**

components/navigation/  
└── SidebarNav

Komponente für die Navigation innerhalb des Lernportals.

### **Process**

components/process/  
├── Cycle  
├── Funnel  
├── PhaseLane  
└── ProcessFlow

Komponenten zur visuellen Darstellung von Prozessen, Funnels, Zyklen und Prozessphasen.

Zu den Komponenten gehören neben den Implementierungen teilweise auch `.d.ts`\-Dateien sowie zugehörige `.prompt.md`\-Dateien.

---

## **Design System**

Das Projekt enthält ein eigenes Design System, das über `guidelines/` und `tokens/` dokumentiert und technisch umgesetzt wird.

### **Guidelines**

Der Ordner `guidelines/` enthält unter anderem Vorgaben für:

* Brand Icons  
* Brand Wordmark  
* Brand Colors  
* Dark Colors  
* Light Colors  
* Surface Colors  
* Tone Colors  
* Spacing  
* Radien  
* Typografie

### **Design Tokens**

tokens/  
├── colors.css  
├── fonts.css  
├── spacing.css  
└── typography.css

Die Tokens bündeln zentrale Designentscheidungen für Farben, Schriftarten, Abstände und Typografie.

---

## **UI Kit**

Unter

ui\_kits/lernportal/

befindet sich eine eigenständige Rekonstruktion der Lernportal-Oberfläche.

Dazu gehören unter anderem:

ui\_kits/lernportal/  
├── README.md  
└── index.html

Das UI Kit dient als kompakte, wiederverwendbare Darstellung der zentralen Lernportal-Oberfläche.

---

## **Assets**

Der Ordner `assets/` enthält begleitende Materialien, die innerhalb des Lernportals bzw. der zugehörigen Inhalte verwendet werden.

Dazu gehören beispielsweise:

* Logos  
* Grafiken  
* Illustrationen  
* Portraits  
* Business-Model-Canvas-Dateien  
* Buyer-Persona-Materialien  
* Geschäftsberichte  
* Landingpages  
* Dashboard-Darstellungen  
* weitere HTML-, PNG-, JPG- und PDF-Dateien

Ein Teil der Assets befindet sich zusätzlich im Unterordner:

assets/leadpilot/  
---

## **Infografiken**

Das Repository enthält eigenständige HTML-basierte Infografiken, unter anderem:

smarketing-infografik-bundled.html  
smarketing-pipeline-infografik.html

Diese Dateien können unabhängig vom eigentlichen Lernportal verwendet bzw. betrachtet werden.

---

## **Technischer Aufbau**

Das Projekt besteht überwiegend aus:

* HTML  
* CSS  
* JavaScript  
* JSX  
* TypeScript-Definitionen (`.d.ts`)  
* Markdown  
* PDF- und Bild-Assets

Die aktuelle Projektstruktur ist dabei nicht als klassisches Framework-Projekt mit einem zentralen Package-Manager aufgebaut. Mehrere Bestandteile sind als eigenständige HTML-Dateien direkt nutzbar.

---

## **Lokale Nutzung**

Da verschiedene HTML-Versionen des Lernportals im Repository vorhanden sind, können die entsprechenden Dateien direkt im Browser geöffnet werden.

Für die zentrale Anwendung ist insbesondere relevant:

index.html

Weitere Varianten können entsprechend ihrer jeweiligen Funktion geöffnet werden, beispielsweise:

DBA Lernportal (offline).html  
Lernportal-standalone.dc.html  
Lernportal-print-1ihrpx6.dc.html

Je nach verwendeten Browserfunktionen kann für einzelne Bestandteile ein lokaler Webserver erforderlich sein.

---

## **Design-Grundlagen**

Die visuelle Sprache des Lernportals orientiert sich an einer ruhigen, editorialen Lernumgebung.

Zu den zentralen Gestaltungselementen gehören:

* dunkle Navigation und Header-Bereiche  
* helle Inhaltsflächen  
* klare typografische Hierarchien  
* großzügige Abstände  
* Kartenbasierte Inhaltsdarstellung  
* Prozess- und Flow-Darstellungen  
* dezente Farbakzente  
* wiederverwendbare Komponenten und Design Tokens

Die konkrete Ausgestaltung ist in den Dateien unter `guidelines/`, `tokens/` und `components/` dokumentiert.

---

## **Projektziel**

Das Repository dient als zentrale technische Sammlung für die Weiterentwicklung des **DBA Lernportals für Digital Sales Management**.

Dabei werden Lerninhalte, UI-Komponenten, Design-System-Elemente, interaktive Funktionen und begleitende Materialien in einem gemeinsamen Projekt strukturiert.

---

## **Hinweis**

Das Repository befindet sich in laufender Entwicklung. Dateien und Strukturen können sich während der Weiterentwicklung des Lernportals verändern.

**Das ist jetzt wesentlich näher an dem, was tatsächlich in deinem Repo liegt.** Die bisherige README behauptete beispielsweise, `Lernportal.dc.html` sei die alleinige Ground-Truth-Referenz und `DBA Batch 8/` sei Bestandteil der Quellenstruktur readme.md – das passt zu deinem aktuellen Repository so nicht mehr.

Wenn du diese Version als `readme.md` übernimmst, müssen wir danach nur noch **einen normalen Commit \+ Push** machen – diesmal **ohne `git init` und ohne `--force`**.

