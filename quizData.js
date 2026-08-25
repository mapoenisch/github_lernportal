// Zentrale Quiz-Datenquelle, ein Eintrag pro Lektions-ID.
// Schema:
// LessonQuiz = { title?: string, intro?: string, questions: QuizQuestion[] }
// QuizQuestion = { question: string, options: {id:'A'|'B'|'C'|'D', text:string}[], correctAnswer: 'A'|'B'|'C'|'D', hint: string }
export const QUIZ_DATA = {
  '1.1.2': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu SaaS und dem Tech-Ökosystem.',
    questions: [
      {
        question: 'Was ist das grundlegende Konzept von Software-as-a-Service (SaaS)?',
        options: [
          { id: 'A', text: 'Software, die physisch auf Datenträgern geliefert und lokal installiert wird' },
          { id: 'B', text: 'Software, die in der Cloud gehostet und über das Internet als Service bereitgestellt wird' },
          { id: 'C', text: 'Ein Modell, bei dem Hardware-Komponenten gemietet werden' },
          { id: 'D', text: 'Eine Programmiersprache zur Entwicklung von Datenbanken' },
        ],
        correctAnswer: 'B',
        hint: 'Denke an den Unterschied zu Programmen, die du auf deinem eigenen Computer installieren musst.',
      },
      {
        question: 'Wer übernimmt beim Software-as-a-Service (SaaS)-Modell standardmäßig die Aufgaben für Updates, Wartung und Speicherplatz?',
        options: [
          { id: 'A', text: 'Der Benutzer selbst auf seinem PC' },
          { id: 'B', text: 'Der IT-Leiter des Kundenunternehmens' },
          { id: 'C', text: 'Der Anbieter der Software über die Cloud' },
          { id: 'D', text: 'Ein externer IT-Dienstleister vor Ort' },
        ],
        correctAnswer: 'C',
        hint: 'Einer der größten Vorteile von SaaS ist, dass der Kunde keine administrative Verantwortung für die Infrastruktur tragen muss.',
      },
      {
        question: 'Welche drei Geschäftsmodelle sind im SaaS-Bereich am weitesten verbreitet?',
        options: [
          { id: 'A', text: 'Einmalkauf, Tauschgeschäft und Hardware-Leasing' },
          { id: 'B', text: 'Freemium, Abonnement (Abo) und nutzungsbasierte Abrechnung' },
          { id: 'C', text: 'Barzahlung, Ratenzahlung und Miete von Serverräumen' },
          { id: 'D', text: 'Kostenlose Nutzung mit permanenter Fremdwerbung' },
        ],
        correctAnswer: 'B',
        hint: 'Überlege, wie moderne Software-Dienste im Internet ihre regelmäßigen Einnahmen generieren.',
      },
    ],
  },
  '1.1.3': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Was ist laut Definition das übergeordnete Ziel im modernen Verkauf?',
        options: [
          { id: 'A', text: 'Produkte um jeden Preis an den Kunden zu bringen' },
          { id: 'B', text: 'Die Bedürfnisse, Probleme und Wünsche des Kunden zu verstehen und passende Lösungen anzubieten' },
          { id: 'C', text: 'Den Kunden durch Verkaufsdruck zu einer schnellen Entscheidung zu zwingen' },
          { id: 'D', text: 'Ausschließlich den eigenen Provisionsanspruch zu maximieren' },
        ],
        correctAnswer: 'B',
        hint: 'Ein nachhaltiger Verkaufsprozess basiert auf dem Lösen von echten Herausforderungen des Kunden.',
      },
      {
        question: 'Was unterscheidet Inbound Sales im Kern von Outbound Sales?',
        options: [
          { id: 'A', text: 'Inbound Sales nutzt ausschließlich Kaltakquise und persönliche Vor-Ort-Treffen' },
          { id: 'B', text: 'Inbound Sales zieht Kunden durch nützlichen Content an, während Outbound Sales aktiv auf potenzielle Kunden zugeht' },
          { id: 'C', text: 'Inbound Sales ist nur für B2C geeignet, Outbound Sales ausschließlich für B2B' },
          { id: 'D', text: 'Inbound Sales verzichtet vollständig auf die Nutzung von CRM-Systemen' },
        ],
        correctAnswer: 'B',
        hint: 'Überlege, wer den ersten Schritt zur Kontaktaufnahme macht – der Kunde oder der Vertriebler.',
      },
      {
        question: 'Welche Rolle hat die Marketing-Abteilung in der Zusammenarbeit mit dem Vertrieb?',
        options: [
          { id: 'A', text: 'Sie führt die finalen Vertragsverhandlungen und das Closing durch' },
          { id: 'B', text: 'Sie schafft Interesse und Bewusstsein für das Produkt, um Leads anzuziehen' },
          { id: 'C', text: 'Sie kümmert sich ausschließlich um Beschwerden nach dem Kauf' },
          { id: 'D', text: 'Sie installiert die Software beim Kunden vor Ort' },
        ],
        correctAnswer: 'B',
        hint: 'Denke an den Verkaufstrichter – das Marketing bereitet das Interesse vor, bevor der Vertrieb übernimmt.',
      },
    ],
  },
  '1.1.4': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Welcher Punkt gilt im digitalen Vertrieb als zentraler Erfolgsfaktor für eine langfristige Kundenbeziehung?',
        options: [
          { id: 'A', text: 'Technische Merkmale auflisten statt echten Nutzen zu erklären' },
          { id: 'B', text: 'Dem Kunden individuelle Lösungen für seine Probleme zu verkaufen statt nur nackte Produkte zu erklären' },
          { id: 'C', text: 'Kundenbedürfnisse im Gespräch zu ignorieren, um schneller zu pitchen' },
          { id: 'D', text: 'Verträge ausschließlich über den günstigsten Preis abzuschließen' },
        ],
        correctAnswer: 'B',
        hint: 'Kunden kaufen selten reine technische Spezifikationen, sondern die Beseitigung ihrer Schmerzpunkte.',
      },
      {
        question: 'Was beschreibt den wesentlichen Unterschied zwischen den Aufgaben eines SDR und eines BDR im Vertrieb?',
        options: [
          { id: 'A', text: 'SDRs arbeiten nur im Außendienst, BDRs ausschließlich im Innendienst' },
          { id: 'B', text: 'SDRs konzentrieren sich auf Inbound-Leads (eingehende Kontakte), während BDRs proaktiv neue Kontakte via Outbound (Kaltakquise) suchen und ansprechen' },
          { id: 'C', text: 'SDRs verhandeln Verträge, während BDRs die technische Implementierung leiten' },
          { id: 'D', text: 'BDRs übernehmen erst nach dem Verkaufsabschluss die langfristige Kundenbetreuung' },
        ],
        correctAnswer: 'B',
        hint: 'Der eine reagiert auf Marketing-Aktivitäten, der andere sucht selbständig nach neuen Segmenten im Markt.',
      },
      {
        question: 'Wer ist im modernen Vertriebsteam für die langfristige Betreuung, Kundenzufriedenheit und das Up-/Cross-Selling nach dem Kauf verantwortlich?',
        options: [
          { id: 'A', text: 'Der Sales Development Representative (SDR)' },
          { id: 'B', text: 'Der Account Executive (AE)' },
          { id: 'C', text: 'Der Customer Success Manager (CSM)' },
          { id: 'D', text: 'Der IT-Support-Mitarbeiter des Anbieters' },
        ],
        correctAnswer: 'C',
        hint: 'Diese Rolle sichert die Kundentreue ab, damit Abonnements verlängert und ausgebaut werden.',
      },
    ],
  },
  '1.2.1': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Was bedeutet "Resilienz" im Kontext des Vertriebsalltags?',
        options: [
          { id: 'A', text: 'Die Fähigkeit, Kunden ununterbrochen telefonisch zu kontaktieren' },
          { id: 'B', text: 'Die Fähigkeit, sich schnell von Rückschlägen und Ablehnungen zu erholen und sich anzupassen' },
          { id: 'C', text: 'Die starre Haltung, niemals von bestehenden Verkaufsskripten abzuweichen' },
          { id: 'D', text: 'Das Ignorieren von Feedback der Kollegen im Team' },
        ],
        correctAnswer: 'B',
        hint: 'Denke an psychologische Widerstandskraft und Flexibilität bei einem "Nein" des Kunden.',
      },
      {
        question: 'Welcher Glaubenssatz beschreibt ein "Growth Mindset" (Wachstums-Mindset)?',
        options: [
          { id: 'A', text: 'Meine Fähigkeiten sind angeboren und können nicht verändert werden' },
          { id: 'B', text: 'Meine Fähigkeiten und meine Intelligenz lassen sich durch kontinuierliche Anstrengung, Übung und Lernen entwickeln' },
          { id: 'C', text: 'Wenn ich in etwas nicht sofort gut bin, sollte ich es lieber lassen' },
          { id: 'D', text: 'Der Erfolg meiner Kollegen ist eine Bedrohung für mich' },
        ],
        correctAnswer: 'B',
        hint: 'Es ist die Überzeugung, dass man durch Training und Disziplin fast alles lernen kann.',
      },
      {
        question: 'Warum ist ein Growth Mindset für einen SDR im Vertrieb besonders wichtig?',
        options: [
          { id: 'A', text: 'Weil er dadurch garantiert jeden Kaltanruf erfolgreich abschließt' },
          { id: 'B', text: 'Weil er in einer schnelllebigen Industrie arbeitet, in der Ablehnung zum Alltag gehört und kontinuierliche Lernbereitschaft gefordert ist' },
          { id: 'C', text: 'Weil es ihm erlaubt, ohne Absprache mit dem AE Verträge abzuschließen' },
          { id: 'D', text: 'Weil es die Notwendigkeit von CRM-Einträgen überflüssig macht' },
        ],
        correctAnswer: 'B',
        hint: 'cold outreach bringt viel Ablehnung mit sich – wie geht man konstruktiv damit um?',
      },
    ],
  },
  '1.2.2': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Was beschreibt das Konzept der "Selbstwirksamkeit" nach Albert Bandura?',
        options: [
          { id: 'A', text: 'Die Erwartung, dass alle Erfolge im Vertrieb rein auf Zufall und Glück basieren' },
          { id: 'B', text: 'Das Vertrauen in die eigenen Fähigkeiten, Handlungen erfolgreich zu planen und auszuführen, um gewünschte Ergebnisse zu erzielen' },
          { id: 'C', text: 'Die Unfähigkeit, kritisches Feedback von Kollegen anzunehmen' },
          { id: 'D', text: 'Die Angewohnheit, schwierige Aufgaben an andere zu delegieren' },
        ],
        correctAnswer: 'B',
        hint: 'Es geht um den inneren Glauben an die eigene Kompetenz bei der Bewältigung von Herausforderungen.',
      },
      {
        question: 'Was ist der erste wichtige Teilschritt in der Vorbereitung eines Feedbackgesprächs?',
        options: [
          { id: 'A', text: 'Dem Mitarbeiter direkt alle seine Fehler aufzuzählen' },
          { id: 'B', text: 'Sich einen objektiven Überblick über die Situation zu verschaffen und die eigene Motivation zu klären' },
          { id: 'C', text: 'Das Feedback sofort schriftlich an die Personalabteilung zu senden' },
          { id: 'D', text: 'Einen unruhigen Zeitpunkt zwischen zwei Kundentelefonaten zu wählen' },
        ],
        correctAnswer: 'B',
        hint: 'Ein konstruktives Gespräch beginnt mit einer objektiven Selbstreflexion und der Prüfung der eigenen Absichten.',
      },
      {
        question: 'Was beschreibt das "SARA-Modell" im Kontext von Feedback?',
        options: [
          { id: 'A', text: 'Die Phasen der Kundengewinnung im B2B-Vertrieb' },
          { id: 'B', text: 'Die emotionalen Reaktionen (Schock, Ärger, Widerstand, Akzeptanz) auf kritisches Feedback' },
          { id: 'C', text: 'Die vier Schritte einer erfolgreichen Produktpräsentation' },
          { id: 'D', text: 'Ein System zur Bewertung von CRM-Datenqualität' },
        ],
        correctAnswer: 'B',
        hint: 'Überlege, welche Phasen ein Mensch emotional durchläuft, wenn er mit unerwarteter Kritik konfrontiert wird.',
      },
    ],
  },
  '1.2.3': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Was bedeutet "Metrik-Orientierung" im Berufsalltag eines Vertrieblers?',
        options: [
          { id: 'A', text: 'Seine Arbeitsleistung ausschließlich nach Bauchgefühl zu bewerten' },
          { id: 'B', text: 'Erfolge, Aktivitäten und Fortschritte durch konkrete, messbare Zahlen zu bewerten und zu steuern' },
          { id: 'C', text: 'Die Arbeitszeit möglichst minutengenau abzusitzen' },
          { id: 'D', text: 'Nur die Anzahl der gesendeten E-Mails zu zählen, ohne auf Ergebnisse zu achten' },
        ],
        correctAnswer: 'B',
        hint: 'Denke an datenbasierte Steuerung und wie man Erfolge im Lebenslauf überzeugend darstellt.',
      },
      {
        question: 'In welcher Phase des Tages sinkt die Konzentration und Produktivität der meisten Menschen natürlicherweise ab ("Schnitzelkoma")?',
        options: [
          { id: 'A', text: 'Am frühen Vormittag (8-11 Uhr)' },
          { id: 'B', text: 'Am späten Nachmittag (15-17 Uhr)' },
          { id: 'C', text: 'Direkt nach der Mittagspause (12-14 Uhr)' },
          { id: 'D', text: 'Am späten Abend (20-22 Uhr)' },
        ],
        correctAnswer: 'C',
        hint: 'Es ist das typische Leistungstief nach dem Mittagessen, in dem der Körper Energie für die Verdauung benötigt.',
      },
      {
        question: 'Wie ist ein einzelner Arbeitszyklus der "Pomodoro-Technik" aufgebaut?',
        options: [
          { id: 'A', text: '50 Minuten konzentrierte Arbeit, gefolgt von 10 Minuten Pause' },
          { id: 'B', text: '25 Minuten konzentrierte Arbeit, gefolgt von 5 Minuten Pause' },
          { id: 'C', text: '90 Minuten Arbeit, gefolgt von 15 Minuten Pause' },
          { id: 'D', text: '15 Minuten Arbeit, gefolgt von 15 Minuten Pause' },
        ],
        correctAnswer: 'B',
        hint: 'Es ist ein kurzes, hochfokussiertes Intervall, das den Geist schont und Ablenkungen minimiert.',
      },
    ],
  },
  '1.2.4': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Was besagt das 80:20-Prinzip (Pareto-Prinzip) im Vertriebsalltag?',
        options: [
          { id: 'A', text: '80% des Aufwands führen immer zu genau 80% des Ergebnisses' },
          { id: 'B', text: 'Mit 20% des fokussierten Aufwands werden oft 80% der Ergebnisse erzielt' },
          { id: 'C', text: '80% der Verkäufer erzielen nur 20% des Umsatzes' },
          { id: 'D', text: 'Man sollte 80% seiner Arbeitszeit mit Pausen verbringen' },
        ],
        correctAnswer: 'B',
        hint: 'Es beschreibt das Ungleichgewicht von Aufwand und Ertrag und hilft bei der Effizienzsteigerung.',
      },
      {
        question: 'Wie sollten Aufgaben, die laut Eisenhower-Matrix "wichtig, aber nicht dringend" sind (z. B. Sport, Strategieplanung), behandelt werden?',
        options: [
          { id: 'A', text: 'Sofort selbst erledigen' },
          { id: 'B', text: 'Konsequent terminieren (einen festen Zeitpunkt im Kalender einplanen)' },
          { id: 'C', text: 'An ein Teammitglied delegieren' },
          { id: 'D', text: 'Sofort eliminieren oder ignorieren' },
        ],
        correctAnswer: 'B',
        hint: 'Da die Aufgabe wichtig ist, muss sie erledigt werden, aber da sie keine sofortige Deadline hat, benötigt sie einen festen Platz im Zeitplan.',
      },
      {
        question: 'Wie ist die klassische Gewohnheitsschleife (Kreislauf der Routine) nach Gerald Zaltman aufgebaut?',
        options: [
          { id: 'A', text: 'Ziel, Plan, Umsetzung, Kontrolle' },
          { id: 'B', text: 'Auslöser (Trigger), Handlung (Routine), Belohnung' },
          { id: 'C', text: 'Problem, Analyse, Lösung, Feedback' },
          { id: 'D', text: 'Absicht, Disziplin, Gewohnheit, Erfolg' },
        ],
        correctAnswer: 'B',
        hint: 'Es beginnt mit einem Reiz (Signal) und endet mit einem positiven Gefühl im Gehirn, das die Schleife speichert.',
      },
    ],
  },
  '1.3.1': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Was unterscheidet den B2B-Kaufprozess im Kern vom B2C-Kaufprozess bezüglich der Entscheidungsträger?',
        options: [
          { id: 'A', text: 'Im B2B entscheidet immer nur eine einzelne Person rein emotional' },
          { id: 'B', text: 'Im B2B sind meist mehrere Entscheidungsträger (Buying Center) mit rationalen Abwägungen beteiligt' },
          { id: 'C', text: 'Im B2B entscheidet ausschließlich die IT-Abteilung eines Unternehmens' },
          { id: 'D', text: 'Im B2B gibt es keine festen Entscheidungsträger oder formellen Abläufe' },
        ],
        correctAnswer: 'B',
        hint: 'In Unternehmen müssen Investitionen meist von verschiedenen Rollen und Abteilungen freigegeben werden.',
      },
      {
        question: 'Welcher Schritt beschreibt die erste Phase des B2B-Kaufprozesses nach Gartner?',
        options: [
          { id: 'A', text: 'Lösungsfindung' },
          { id: 'B', text: 'Problemidentifikation' },
          { id: 'C', text: 'Anforderungserstellung' },
          { id: 'D', text: 'Lieferantenauswahl' },
        ],
        correctAnswer: 'B',
        hint: 'Bevor ein Unternehmen nach Anbietern sucht, muss es erst merken, dass eine operative Lücke oder ein Bedarf besteht.',
      },
      {
        question: 'Welche spezifische Rolle im "Buying Center" kontrolliert und steuert den Informationsfluss zu den eigentlichen Entscheidungsträgern?',
        options: [
          { id: 'A', text: 'Der User (Nutzer)' },
          { id: 'B', text: 'Der Gatekeeper' },
          { id: 'C', text: 'Der Initiator' },
          { id: 'D', text: 'Der Buyer (Einkäufer)' },
        ],
        correctAnswer: 'B',
        hint: 'Diese Person filtert Informationen und entscheidet oft, ob ein Verkäufer überhaupt Gehör findet.',
      },
    ],
  },
  '1.3.2': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Wie unterscheidet sich der digitale B2B-Vertrieb im Kern vom traditionellen Vertrieb?',
        options: [
          { id: 'A', text: 'Er ist auf physische Standorte und persönliche Netzwerke beschränkt' },
          { id: 'B', text: 'Er nutzt digitale Kanäle (Video-Calls, E-Mail, Social Media) für weltweiten Zugriff und schnellere Prozesse' },
          { id: 'C', text: 'Er kommt vollständig ohne menschliche Verkäufer aus' },
          { id: 'D', text: 'Er verzichtet auf jegliche Strukturierung des Verkaufsprozesses' },
        ],
        correctAnswer: 'B',
        hint: 'Denke an die ortsunabhängige Kommunikation über das Internet und die Beschleunigung des Kaufprozesses.',
      },
      {
        question: 'Was ist das primäre Ziel des "Lead Scorings" im CRM-System?',
        options: [
          { id: 'A', text: 'Die automatische Berechnung der Provision für den Vertriebler' },
          { id: 'B', text: 'Die automatisierte Bewertung und Priorisierung von Leads nach festgelegten Kriterien' },
          { id: 'C', text: 'Das sofortige Löschen von inaktiven E-Mail-Adressen' },
          { id: 'D', text: 'Die Erstellung von ansprechenden Präsentationsfolien' },
        ],
        correctAnswer: 'B',
        hint: 'Es hilft dem SDR, schnell zu erkennen, welche Leads am kaufbereitesten sind und zuerst kontaktiert werden sollten.',
      },
      {
        question: 'Welcher vertriebliche Schritt folgt im 8-stufigen B2B-Verkaufsprozess unmittelbar auf den "Pitch"?',
        options: [
          { id: 'A', text: 'Discovery (Bedarfsanalyse)' },
          { id: 'B', text: 'Objection Handling (Einwandbehandlung)' },
          { id: 'C', text: 'Closing (Abschluss)' },
          { id: 'D', text: 'Follow-up (Kundennachbetreuung)' },
        ],
        correctAnswer: 'B',
        hint: 'Nachdem die Lösung präsentiert wurde, äußert der Kunde meist Bedenken oder Fragen, die gelöst werden müssen.',
      },
    ],
  },
  '1.3.3': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Was untersucht das NLP-Konzept (Neurolinguistisches Programmieren) im Verkaufskontext?',
        options: [
          { id: 'A', text: 'Wie man Computerprogramme für den Vertrieb schreibt' },
          { id: 'B', text: 'Wie Denkprozesse durch Sprache strukturiert werden und wie sich diese Muster im Verkauf nutzen lassen' },
          { id: 'C', text: 'Die mathematische Berechnung von Verkaufsstatistiken im CRM' },
          { id: 'D', text: 'Die juristischen Richtlinien bei Verträgen' },
        ],
        correctAnswer: 'B',
        hint: 'Denke an die Verbindung zwischen Wahrnehmung, Wortwahl und unbewussten Mustern im Gespräch.',
      },
      {
        question: 'Was besagt der "Golden Circle" von Simon Sinek bezüglich erfolgreicher Kommunikation?',
        options: [
          { id: 'A', text: 'Man sollte immer mit dem "What" (Was tun wir) beginnen' },
          { id: 'B', text: 'Menschen kaufen nicht, was du tust, sondern warum du es tust' },
          { id: 'C', text: 'Jedes Kundengespräch sollte genau 30 Sekunden dauern' },
          { id: 'D', text: 'Der Preis steht immer im absoluten Mittelpunkt' },
        ],
        correctAnswer: 'B',
        hint: 'Werte und die tiefere Motivation überzeugen Menschen nachhaltiger als reine Produktmerkmale.',
      },
      {
        question: 'Warum spielen Emotionen im B2B-Verkaufsprozess eine wichtige Rolle, obwohl Entscheidungen oft rational begründet werden?',
        options: [
          { id: 'A', text: 'Weil B2B-Entscheider niemals rationale Daten analysieren' },
          { id: 'B', text: 'Weil auch B2B-Entscheider Menschen sind, deren Entscheidungen oft emotional (z.B. Sicherheitsbedürfnis) gelenkt und später rational begründet werden' },
          { id: 'C', text: 'Weil der Gesetzgeber emotionale Argumente vorschreibt' },
          { id: 'D', text: 'Weil emotionale Argumente die Notwendigkeit von Angeboten aufheben' },
        ],
        correctAnswer: 'B',
        hint: 'Denke an die Psychologie des Käufers, der Risiken für das Unternehmen vermeiden und seine eigene Position sichern möchte.',
      },
    ],
  },
  '1.3.4': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Was beschreibt das VAK-Modell im Kontext der Verkaufspsychologie?',
        options: [
          { id: 'A', text: 'Ein System zur Berechnung von Vertriebsumsätzen' },
          { id: 'B', text: 'Die Klassifizierung von Kunden nach ihren drei primären Sinnespräferenzen (Visuell, Auditiv, Kinästhetisch)' },
          { id: 'C', text: 'Eine Methode zur Einwandbehandlung am Telefon' },
          { id: 'D', text: 'Die Strukturierung von Verträgen für SaaS-Modelle' },
        ],
        correctAnswer: 'B',
        hint: 'Es geht darum, wie Menschen Informationen über ihre verschiedenen Sinneskanäle wahrnehmen.',
      },
      {
        question: 'Welche Sinnespräferenz zeigt ein Kunde, der im Gespräch vorzugsweise Formulierungen wie „Das klingt interessant“ oder „Ich möchte mehr darüber hören“ nutzt?',
        options: [
          { id: 'A', text: 'Visuelle Präferenz' },
          { id: 'B', text: 'Auditive Präferenz' },
          { id: 'C', text: 'Kinästhetische Präferenz' },
          { id: 'D', text: 'Rationale Präferenz' },
        ],
        correctAnswer: 'B',
        hint: 'Achte auf die Wörter, die sich direkt auf das Hören beziehen.',
      },
      {
        question: 'Welche drei Mechanismen beschreiben die unbewussten Kommunikationsfilter, die die Wahrnehmung des Kunden beeinflussen?',
        options: [
          { id: 'A', text: 'BANT, CHAMP und MEDDIC' },
          { id: 'B', text: 'Löschung, Generalisierung und Verzerrung' },
          { id: 'C', text: 'Pacing, Leading und Mirroring' },
          { id: 'D', text: 'Vision, Ziel und Umsatzziel' },
        ],
        correctAnswer: 'B',
        hint: 'Menschen neigen dazu, Informationen auszublenden, zu verallgemeinern oder unbewusst abzuändern.',
      },
    ],
  },
  '1.3.6': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Was bedeutet der Begriff „Rapport“ im Vertrieb?',
        options: [
          { id: 'A', text: 'Den Kunden mit technischen Spezifikationen zu überfordern' },
          { id: 'B', text: 'Der Aufbau einer harmonischen, vertrauensvollen Beziehungsbasis zwischen Verkäufer und Kunde' },
          { id: 'C', text: 'Das sofortige Anbieten von hohen Rabatten beim Erstkontakt' },
          { id: 'D', text: 'Die Erstellung eines schriftlichen Sitzungsprotokolls nach jedem Meeting' },
        ],
        correctAnswer: 'B',
        hint: 'Vertrauen und gegenseitiges Verständnis sind der Schlüssel für diese zwischenmenschliche Brücke.',
      },
      {
        question: 'Was beschreibt die Methode des „Spiegelns“ (Mirroring)?',
        options: [
          { id: 'A', text: 'Das laute Wiederholen der Gegenargumente des Kunden' },
          { id: 'B', text: 'Das subtile, zeitversetzte Nachahmen der Körpersprache, Tonalität und Sprechgeschwindigkeit des Kunden' },
          { id: 'C', text: 'Die aggressive Argumentation gegen Bedenken des Kunden' },
          { id: 'D', text: 'Die ausschließliche Präsentation von Video-Inhalten im Call' },
        ],
        correctAnswer: 'B',
        hint: 'Es ist ein nonverbales Signal, das unbewusst Symmetrie und Sympathie herstellt.',
      },
      {
        question: 'Welcher Zuhör-Typ gilt laut den Unterlagen als ideal für eine tiefgehende Bedarfsanalyse im Vertrieb?',
        options: [
          { id: 'A', text: 'Der Weghörer' },
          { id: 'B', text: 'Der bewertende Zuhörer' },
          { id: 'C', text: 'Der selektive Zuhörer' },
          { id: 'D', text: 'Der aktive Zuhörer' },
        ],
        correctAnswer: 'D',
        hint: 'Dieser Typ stoppt den inneren Monolog und schenkt dem Gesprächspartner die volle, empathische Aufmerksamkeit.',
      },
    ],
  },
  '1.3.7': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Warum sollte das einschränkende Wort „aber“ in Verkaufsgesprächen nach Möglichkeit vermieden oder ersetzt werden?',
        options: [
          { id: 'A', text: 'Weil es grammatikalisch unhöflich ist' },
          { id: 'B', text: 'Weil es den positiven Teil der Aussage davor psychologisch auslöscht und das Negative betont' },
          { id: 'C', text: 'Weil es die Gesprächsdauer unnötig verlängert' },
          { id: 'D', text: 'Weil es nur im B2C-Bereich zulässig ist' },
        ],
        correctAnswer: 'B',
        hint: 'Überlege, welcher Teil eines Satzes im Gedächtnis haften bleibt, wenn du sagst: "Das ist eine gute Idee, aber..."',
      },
      {
        question: 'Welchen psychologischen Vorteil hat es, im Vertrieb das Wort „Herausforderung“ anstelle von „Problem“ zu verwenden?',
        options: [
          { id: 'A', text: '„Herausforderung“ klingt komplexer und teurer' },
          { id: 'B', text: '„Herausforderung“ ist lösungsorientiert und wirkt motivierend, während „Problem“ Unsicherheit wecken kann' },
          { id: 'C', text: 'Es gibt absolut keinen Unterschied in der Wahrnehmung' },
          { id: 'D', text: '„Problem“ ist rechtlich geschützt und darf im B2B nicht genutzt werden' },
        ],
        correctAnswer: 'B',
        hint: 'Sprache beeinflusst das Denken – ein Hindernis, das überwunden werden kann, spornt eher an.',
      },
      {
        question: 'Was ist der Kernunterschied zwischen den Techniken „Bedeutungsreframing“ und „Kontextreframing“?',
        options: [
          { id: 'A', text: 'Bedeutungsreframing verändert das physische Produkt, Kontextreframing nur den Preis' },
          { id: 'B', text: 'Bedeutungsreframing gibt einer Situation eine neue Interpretation; Kontextreframing zeigt, dass ein Verhalten je nach Rahmenbedingung vorteilhaft sein kann' },
          { id: 'C', text: 'Kontextreframing ist gesetzlich verboten, Bedeutungsreframing nicht' },
          { id: 'D', text: 'Es gibt keinen Unterschied, beide Begriffe beschreiben dieselbe Methode' },
        ],
        correctAnswer: 'B',
        hint: 'Beim einen fragen wir „Was kann das noch bedeuten?“, beim anderen „Wo wäre dieses Verhalten nützlich?“.',
      },
    ],
  },
  '1.3.8': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Was beschreibt das Prinzip des „Pacing und Leading“ in der Gesprächsführung?',
        options: [
          { id: 'A', text: 'Den Kunden mit Informationen zu überhäufen, um ihn müde zu machen' },
          { id: 'B', text: 'Erstes Angleichen an die aktuelle Realität und Sprache des Kunden (Pacing), um ihn dann sanft zu einer Entscheidung zu führen (Leading)' },
          { id: 'C', text: 'Den Kunden sofort nach der Begrüßung nach seiner Kreditkartennummer zu fragen' },
          { id: 'D', text: 'Das Telefonat nach genau 5 Minuten ohne Ergebnis zu beenden' },
        ],
        correctAnswer: 'B',
        hint: 'Erst Vertrauens-Symmetrie herstellen, dann die Führung übernehmen.',
      },
      {
        question: 'Welche der folgenden Optionen beschreibt ein klassisches verbales Kaufsignal des Kunden?',
        options: [
          { id: 'A', text: 'Der Kunde fragt nach Lieferzeiten, Zahlungsmodalitäten oder zukünftiger Ersatzteilversorgung' },
          { id: 'B', text: 'Der Kunde lehnt sich verschränkt zurück und schaut auf die Uhr' },
          { id: 'C', text: 'Der Kunde bittet um das Zusenden von allgemeinen Flyern' },
          { id: 'D', text: 'Der Kunde schildert ein Problem mit einem Konkurrenzprodukt' },
        ],
        correctAnswer: 'A',
        hint: 'Achte darauf, ob der Kunde gedanklich bereits mit der Nutzung oder Abwicklung des Produkts beschäftigt ist.',
      },
      {
        question: 'Welche goldene Regel gilt für den Verkäufer unmittelbar nach dem Stellen der Abschlussfrage?',
        options: [
          { id: 'A', text: 'Weitere Produktvorteile aufzählen, um den Kunden zu überzeugen' },
          { id: 'B', text: 'Bewusst schweigen (Stille aushalten) und dem Kunden Zeit zum Nachdenken und Antworten geben' },
          { id: 'C', text: 'Den Kunden bitten, sich innerhalb von 10 Sekunden zu entscheiden' },
          { id: 'D', text: 'Die Tonalität ins Aggressive ändern, um Druck aufzubauen' },
        ],
        correctAnswer: 'B',
        hint: 'Wer jetzt zuerst spricht, unterbricht den Denkprozess des Kunden und verliert oft das Momentum.',
      },
    ],
  },
  '1.3.9': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Was ist das primäre Ziel des 15-minütigen Erstgesprächs (Cold Call) von Pedro Suzan in den Clarity-Flow-Skripten?',
        options: [
          { id: 'A', text: 'Der direkte, sofortige Verkauf der Software am Telefon' },
          { id: 'B', text: 'Die Vereinbarung eines konkreten Folgetermins für einen tiefergehenden Austausch' },
          { id: 'C', text: 'Die Durchführung einer einstündigen technischen Live-Demo' },
          { id: 'D', text: 'Die Einholung einer rechtsverbindlichen Unterschrift auf dem Vertrag' },
        ],
        correctAnswer: 'B',
        hint: 'Bei der Kaltakquise am Telefon geht es im ersten Schritt ausschließlich darum, qualifizierte Zeit im Kalender des Leads zu sichern.',
      },
      {
        question: 'Mit welchem geschickten Satz eröffnet Pedro im zweiten Skript das Gespräch, um direkt eine professionelle und bedarfsorientierte Tonalität zu setzen?',
        options: [
          { id: 'A', text: '„Ich möchte Sie als strategischen Kunden gewinnen, aber nur wenn es für Sie relevant ist.“' },
          { id: 'B', text: '„Haben Sie gerade 5 Minuten Zeit, um über unsere Software zu sprechen?“' },
          { id: 'C', text: '„Unsere Software ist die beste auf dem Markt und Sie müssen sie unbedingt kaufen.“' },
          { id: 'D', text: '„Ich rufe an, weil Ihre aktuelle Software veraltet ist und nicht funktioniert.“' },
        ],
        correctAnswer: 'A',
        hint: 'Der Satz verbindet das klare Ziel der Kundengewinnung mit einer fairen Relevanz-Einschränkung.',
      },
      {
        question: 'Welches klassische Marketingmodell wird im Clarity Flow Fallbeispiel als Struktur für den Kunden-Funnel im Gruppen-Workshop vorgegeben?',
        options: [
          { id: 'A', text: 'Das BANT-Modell' },
          { id: 'B', text: 'Das AIDA-Modell' },
          { id: 'C', text: 'Das SARA-Modell' },
          { id: 'D', text: 'Die FORD-Methode' },
        ],
        correctAnswer: 'B',
        hint: 'Es handelt sich um ein stufenweises Werbewirkungsmodell: Attention, Interest, Desire, Action.',
      },
    ],
  },
  '1.4.1': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Was beschreibt das Grundprinzip von Cloud Computing laut den Unterlagen?',
        options: [
          { id: 'A', text: 'Der Kauf von physischer Server-Hardware für den eigenen Keller' },
          { id: 'B', text: 'Die bedarfsgerechte Miete von IT-Ressourcen (Speicher, Rechenleistung) über das Internet statt lokaler Installation' },
          { id: 'C', text: 'Die Programmierung von eigenen Betriebssystemen ohne Internetzugang' },
          { id: 'D', text: 'Ein rein mobiles App-Geschäft für Smartphones' },
        ],
        correctAnswer: 'B',
        hint: 'Denke an das Mietmodell im Gegensatz zum Eigentum von Hardware.',
      },
      {
        question: 'Welchen zentralen Nutzen bietet Cloud Computing speziell für moderne Vertriebsteams?',
        options: [
          { id: 'A', text: 'Es erhöht die Anschaffungskosten für lokale Server-Hardware' },
          { id: 'B', text: 'Es ermöglicht ortsunabhängiges Remote Selling, CRM-Echtzeitanalysen und den zentralen Zugriff auf aktuelle Kundeninformationen von überall' },
          { id: 'C', text: 'Es macht das Vertriebsteam vollständig unabhängig vom Internet' },
          { id: 'D', text: 'Es automatisiert den eigentlichen Produktverkauf, sodass kein Vertriebsmitarbeiter mehr nötig ist' },
        ],
        correctAnswer: 'B',
        hint: 'Denke an die Flexibilität für Mitarbeiter, die viel unterwegs sind oder im Homeoffice arbeiten.',
      },
      {
        question: 'Welches IT-Bereitstellungsmodell entspricht im „Pizza as a Service“-Vergleich der Option, eine Tiefkühlpizza zu Hause selbst im eigenen Ofen zuzubereiten?',
        options: [
          { id: 'A', text: 'Infrastructure as a Service (IaaS)' },
          { id: 'B', text: 'Platform as a Service (PaaS)' },
          { id: 'C', text: 'Software as a Service (SaaS)' },
          { id: 'D', text: 'Traditionelles On-Premises (On Prem)' },
        ],
        correctAnswer: 'A',
        hint: 'Einige Zutaten und der Ofen sind vorhanden, aber die eigentliche Fertigstellung und Energie (Ofen anheizen) liegen in deiner Hand.',
      },
    ],
  },
  '1.4.2': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Was unterscheidet eine Public Cloud im Kern von einer Private Cloud?',
        options: [
          { id: 'A', text: 'Public Clouds sind nur für Regierungen zugänglich' },
          { id: 'B', text: 'In der Public Cloud teilt man sich Ressourcen mit anderen Mandanten; in der Private Cloud gehören die Ressourcen exklusiv einem Unternehmen' },
          { id: 'C', text: 'Die Private Cloud ist immer kostenlos' },
          { id: 'D', text: 'Die Public Cloud erfordert die lokale Installation von Serverräumen' },
        ],
        correctAnswer: 'B',
        hint: 'Denke an den Unterschied zwischen einer öffentlichen Bibliothek und einem privaten Bücherregal zu Hause.',
      },
      {
        question: 'Was ist eine Hybrid Cloud?',
        options: [
          { id: 'A', text: 'Eine Cloud, die nur mit Hybrid-Fahrzeugen verbunden werden kann' },
          { id: 'B', text: 'Eine Kombination aus Public und Private Cloud, bei der Daten und Apps flexibel hin- und herbewegt werden können' },
          { id: 'C', text: 'Ein veraltetes System aus den 1980er-Jahren' },
          { id: 'D', text: 'Eine Cloud, die ohne Internetverbindung arbeitet' },
        ],
        correctAnswer: 'B',
        hint: 'Es ist ein Mischsystem, das Flexibilität und Sicherheit optimal kombiniert.',
      },
      {
        question: 'Wie wird der Unterschied zwischen hybridem Arbeiten und flexiblem Arbeiten in den Unterlagen beschrieben?',
        options: [
          { id: 'A', text: 'Hybrides Arbeiten bezieht sich nur auf den Arbeitsort (Büro/Homeoffice), während flexibles Arbeiten auch Arbeitszeiten und den Zeitpunkt der Arbeit umfasst' },
          { id: 'B', text: 'Flexibles Arbeiten beschreibt unbezahlte Überstunden, hybrides Arbeiten geregelte Schichten' },
          { id: 'C', text: 'Es gibt keinen Unterschied, beide Begriffe beschreiben exakt denselben Sachverhalt' },
          { id: 'D', text: 'Hybrides Arbeiten ist nur für Manager erlaubt, flexibles Arbeiten für alle Mitarbeiter' },
        ],
        correctAnswer: 'A',
        hint: 'Der eine Begriff betrifft nur den physischen Ort, der andere gibt dem Mitarbeiter weitreichendere zeitliche Freiheiten.',
      },
    ],
  },
  '1.4.3': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Welche App der Microsoft 365 Suite ist im Vertriebsalltag primär für die E-Mail-Verwaltung und die Kalenderintegration zuständig?',
        options: [
          { id: 'A', text: 'Microsoft Excel' },
          { id: 'B', text: 'Microsoft Outlook' },
          { id: 'C', text: 'Microsoft PowerPoint' },
          { id: 'D', text: 'Microsoft OneNote' },
        ],
        correctAnswer: 'B',
        hint: 'Dieses Tool ist dein täglicher Begleiter für Posteingang und Terminplanung.',
      },
      {
        question: 'Was unterscheidet Microsoft OneDrive von Microsoft SharePoint im Vertriebsalltag?',
        options: [
          { id: 'A', text: 'OneNote ist ein Server-System, SharePoint eine reine Desktop-App' },
          { id: 'B', text: 'OneDrive dient primär der persönlichen Dateispeicherung; SharePoint ist eine umfassende Plattform für gemeinsame Dateiablage und Teamwork im Unternehmen' },
          { id: 'C', text: 'SharePoint ist ausschließlich für das Versenden von E-Mails gedacht' },
          { id: 'D', text: 'OneDrive funktioniert nur auf Apple-Geräten, SharePoint nur auf Windows' },
        ],
        correctAnswer: 'B',
        hint: 'Das eine ist deine persönliche Cloud-Festplatte, das andere das gemeinschaftliche Dokumentenmanagement des Teams.',
      },
      {
        question: 'Welches Microsoft-Tool ist der Standard für Tabellenkalkulationen, Datenanalysen und die Auswertung von Verkaufszahlen in größeren Unternehmen?',
        options: [
          { id: 'A', text: 'Microsoft Word' },
          { id: 'B', text: 'Microsoft PowerPoint' },
          { id: 'C', text: 'Microsoft Excel' },
          { id: 'D', text: 'Microsoft Access' },
        ],
        correctAnswer: 'C',
        hint: 'Denke an Pivot-Tabellen, mathematische Formeln und Daten-Diagramme.',
      },
    ],
  },
  '1.4.4': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Wie wird die funktionelle Arbeitsteilung zwischen Microsoft Exchange und Microsoft Outlook beschrieben?',
        options: [
          { id: 'A', text: 'Outlook ist der zentrale Server; Exchange ist die Benutzeroberfläche auf dem Desktop' },
          { id: 'B', text: 'Exchange ist der E-Mail- und Kalenderserver im Hintergrund; Outlook ist die Client-App für den Endbenutzer' },
          { id: 'C', text: 'Beide Tools erfüllen exakt die gleichen Aufgaben und können nicht gemeinsam genutzt werden' },
          { id: 'D', text: 'Exchange ist ein Videokonferenz-Tool, Outlook ein reines Textverarbeitungsprogramm' },
        ],
        correctAnswer: 'B',
        hint: 'Eines der Systeme verwaltet die Daten zentral, das andere stellt sie dir auf dem Bildschirm visuell dar.',
      },
      {
        question: 'Welches Arbeitsverwaltungstool innerhalb von Microsoft 365 dient dazu, Aufgaben im Team visuell und kollaborativ (Karten-basiert) zu verteilen und zu managen?',
        options: [
          { id: 'A', text: 'Microsoft Bookings' },
          { id: 'B', text: 'Microsoft Project' },
          { id: 'C', text: 'Microsoft Planner' },
          { id: 'D', text: 'Microsoft Aufgaben (To-Do)' },
        ],
        correctAnswer: 'C',
        hint: 'Mit diesem Tool lassen sich Aufgaben in verschiedene Spalten ("Buckets") einsortieren und im Team verschieben (Kanban-Prinzip).',
      },
      {
        question: 'Für welche Aufgaben können Vertriebsmitarbeiter den integrierten KI-Assistenten „Microsoft Copilot“ im Sales-Alltag einsetzen?',
        options: [
          { id: 'A', text: 'Zur Programmierung von komplexen Netzwerkschnittstellen im Serverraum' },
          { id: 'B', text: 'Zum automatisierten Durchführen von Kaltakquise-Anrufen ohne Mitarbeiter' },
          { id: 'C', text: 'Zur schnellen Erstellung personalisierter Angebote, E-Mail-Entwürfe und zur Analyse von Kundeninformationen' },
          { id: 'D', text: 'Zur automatischen Kündigung von unprofitablen Verträgen' },
        ],
        correctAnswer: 'C',
        hint: 'Es ist ein smarter Schreib- und Analyse-Assistent direkt in Word, Outlook und Excel.',
      },
    ],
  },
  '1.5.1': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Was ist die Kernphilosophie von „Social Selling“ auf LinkedIn im Vergleich zur traditionellen telefonischen Kaltakquise?',
        options: [
          { id: 'A', text: 'Potenzielle Kunden mit Werbebotschaften im ersten Satz zu überreden' },
          { id: 'B', text: 'Durch den systematischen Aufbau von Vertrauen und Beziehungen digitale Kontakte in „warme“ Leads zu verwandeln' },
          { id: 'C', text: 'Möglichst viele Kontakte zu adden, um eine gigantische Liste zu haben' },
          { id: 'D', text: 'LinkedIn ausschließlich zur passiven Jobsuche zu nutzen' },
        ],
        correctAnswer: 'B',
        hint: 'Es geht darum, eine vertrauensvolle Beziehungsbrücke zu bauen, bevor man ein Verkaufsgespräch führt.',
      },
      {
        question: 'Welche Interaktionsform auf LinkedIn gilt als der stärkste Hebel für den Algorithmus, um die Reichweite von Beiträgen zu steigern?',
        options: [
          { id: 'A', text: 'Reine Klicks auf „Gefällt mir“ (Likes)' },
          { id: 'B', text: 'Echte Kommentare und fachliche Diskussionen unter dem Beitrag' },
          { id: 'C', text: 'Das Teilen des Beitrags ohne eigenen Text' },
          { id: 'D', text: 'Das Hinzufügen von mehr als 20 Hashtags' },
        ],
        correctAnswer: 'B',
        hint: 'Der Algorithmus belohnt echten Austausch und Dialog im Kommentarbereich deutlich stärker als ein schnelles "Like".',
      },
      {
        question: 'Was besagt das „Give First“-Prinzip im Rahmen einer erfolgreichen Netzwerkstrategie auf LinkedIn?',
        options: [
          { id: 'A', text: 'Direkt beim ersten Kontakt ein kostenloses Produkt verschenken' },
          { id: 'B', text: 'Zuerst wertvolles Wissen, nützliche Kontakte oder Unterstützung anbieten, bevor man eine eigene geschäftliche Anfrage stellt' },
          { id: 'C', text: 'Dem Kunden alle Verhandlungspunkte sofort bedingungslos nachgeben' },
          { id: 'D', text: 'Alle Profilinformationen für Nicht-Kontakte sperren' },
        ],
        correctAnswer: 'B',
        hint: 'Beziehungen im Netzwerk basieren auf Gegenseitigkeit – säen kommt vor dem Ernten.',
      },
    ],
  },
  '1.5.2': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Wie lautet die empfohlene Formel, um das eigene Nutzenversprechen im LinkedIn-Profil prägnant darzustellen?',
        options: [
          { id: 'A', text: '„Ich verkaufe Produkt X an Firma Y, weil wir die Besten sind“' },
          { id: 'B', text: '„Ich helfe X bei Y durch Z“ (Zielgruppe, gelöstes Problem, Methode)' },
          { id: 'C', text: 'Eine chronologische Auflistung aller historischen Jobtitel' },
          { id: 'D', text: '„Ich suche nach neuen Herausforderungen im Vertrieb“' },
        ],
        correctAnswer: 'B',
        hint: 'Besucher des Profils müssen in 3 Sekunden verstehen, wem du hilfst, welches Problem du löst und wie deine Methode aussieht.',
      },
      {
        question: 'Welcher Bereich deines LinkedIn-Profils hat für den Such-Algorithmus (LinkedIn-SEO) und die Auffindbarkeit durch Recruiter das allerhöchste Gewicht?',
        options: [
          { id: 'A', text: 'Die About-Sektion (Info)' },
          { id: 'B', text: 'Die Headline (Profilslogan direkt unter dem Namen)' },
          { id: 'C', text: 'Die Berufserfahrung' },
          { id: 'D', text: 'Die Bestätigung von Fähigkeiten (Skills)' },
        ],
        correctAnswer: 'B',
        hint: 'Dieser kurze Textbereich steht direkt neben deinem Namen und ist das Erste, was in jeder Suchergebnisliste ins Auge fällt.',
      },
      {
        question: 'Was gilt als stärkste Form von „Social Proof“ (digitalem Vertrauen) auf einem optimierten LinkedIn-Profil?',
        options: [
          { id: 'A', text: 'Eine hohe Anzahl von Beiträgen im Feed' },
          { id: 'B', text: 'Konkrete Kundenempfehlungen, sichtbare Projektnachweise und offizielle Zertifikate' },
          { id: 'C', text: 'Ein hochauflösendes, kreatives Hintergrundbanner ohne Text' },
          { id: 'D', text: 'Das tägliche Liken von 100 fremden Beiträgen' },
        ],
        correctAnswer: 'B',
        hint: 'Vertrauen entsteht, wenn nicht du dich selbst lobst, sondern ehemalige Kunden, Kollegen oder Prüfstellen deine Leistung belegen.',
      },
    ],
  },
  '1.5.3': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Welche Netzwerkstrategie führt auf LinkedIn langfristig zu besseren Vertriebsergebnissen?',
        options: [
          { id: 'A', text: 'Quantität vor Qualität – je schneller du die Grenze von 30.000 Kontakten erreichst, desto besser' },
          { id: 'B', text: 'Qualität vor Quantität – ein fokussiertes Netzwerk mit relevanten Entscheidern und echtem Mehrwert' },
          { id: 'C', text: 'Nur Kontakte aus dem eigenen Unternehmen hinzufügen' },
          { id: 'D', text: 'Alle Anfragen von Personen außerhalb des eigenen Standorts ablehnen' },
        ],
        correctAnswer: 'B',
        hint: 'Ein unkontrolliertes Massennetzwerk führt zu inaktiven Kontakten; ein handverlesenes Branchennetzwerk führt zu echten Chancen.',
      },
      {
        question: 'Welches Beitragsformat erzielt auf LinkedIn laut Algorithmus-Forschung eine besonders hohe Reichweite (bis zu 2,3-mal mehr Reichweite)?',
        options: [
          { id: 'A', text: 'Kurze reine Textbeiträge ohne Bild' },
          { id: 'B', text: 'Dokumenten-Posts (PDF-Slides mit Checklisten oder Step-by-Step-Anleitungen)' },
          { id: 'C', text: 'Kurze YouTube-Link-Teilungen' },
          { id: 'D', text: 'Umfragen mit nur einer Antwortoption' },
        ],
        correctAnswer: 'B',
        hint: 'Es handelt sich um mehrseitige Dokumente, die der Nutzer direkt im Feed durchblättern kann und die hohen Nutzwert bieten.',
      },
      {
        question: 'Was ist das Ziel von Konsistenz (Themen, Stil) beim Aufbau einer Personal Brand auf LinkedIn?',
        options: [
          { id: 'A', text: 'Den LinkedIn-Algorithmus auszutricksen, um automatische Likes zu generieren' },
          { id: 'B', text: 'Wiedererkennbarkeit und Vertrauensaufbau bei der Zielgruppe zu fördern, um als Experte wahrgenommen zu werden' },
          { id: 'C', text: 'Jeden Tag ein neues, völlig anderes Fachgebiet abzudecken' },
          { id: 'D', text: 'Private Urlaubsbilder professionell zu vermarkten' },
        ],
        correctAnswer: 'B',
        hint: 'Menschen müssen dich und dein Profil sofort mit einem bestimmten Fachthema verknüpfen, wenn sie deinen Namen sehen.',
      },
    ],
  },
  '1.5.4': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Wie ist eine personalisierte Erstnachricht auf LinkedIn idealerweise aufgebaut?',
        options: [
          { id: 'A', text: 'Produktvorstellung -> Preisliste -> Rabattangebot' },
          { id: 'B', text: 'Bezugspunkt (z. B. Profil- oder Beitragsreferenz) -> Kontext (Branchenproblem) -> Gesprächseinstieg (offene Frage)' },
          { id: 'C', text: 'Ausführlicher Lebenslauf -> Zeugnisse -> Bitte um ein Vorstellungsgespräch' },
          { id: 'D', text: 'Kompliment -> Produktpitch -> Direktes Senden eines Meeting-Links' },
        ],
        correctAnswer: 'B',
        hint: 'Beginne mit dem Empfänger und seiner Welt, stelle eine logische Brücke her und schließe mit einer simplen Frage, die das Gespräch startet.',
      },
      {
        question: 'Warum scheitern aggressive Produkt-Pitches in der allerersten LinkedIn-Nachricht im B2B-Vertrieb fast immer?',
        options: [
          { id: 'A', text: 'Weil Verkaufs-Pitches auf LinkedIn technisch blockiert werden' },
          { id: 'B', text: 'Weil sie sofortigen Verkaufsdruck erzeugen, noch bevor eine persönliche Beziehung oder Vertrauen aufgebaut wurde' },
          { id: 'C', text: 'Weil Direktnachrichten auf LinkedIn immer kostenpflichtig sind' },
          { id: 'D', text: 'Weil Pitches nur in englischer Sprache erfolgreich sein können' },
        ],
        correctAnswer: 'B',
        hint: 'Kaltakquise im ersten Satz ist wie ein Heiratsantrag beim ersten Blickkontakt – es wirkt aufdringlich.',
      },
      {
        question: 'Welche Kennzahl (KPI) im LinkedIn-Outreach zeigt dir an, ob dein Formulierungskonzept und deine Personalisierungsstrategie bei der Zielgruppe ankommen?',
        options: [
          { id: 'A', text: 'Die Anzahl deiner gesamten Profilaufrufe' },
          { id: 'B', text: 'Die Antwortrate (Reply Rate) auf deine gesendeten Nachrichten' },
          { id: 'C', text: 'Die Anzahl deiner wöchentlichen Feed-Impressionen' },
          { id: 'D', text: 'Die reine Anzahl deiner gesendeten Kontaktanfragen' },
        ],
        correctAnswer: 'B',
        hint: 'Wenn du viele Nachrichten verschickst, aber niemand zurückschreibt, stimmt der Bezugspunkt oder der Mehrwert deines Textes nicht.',
      },
    ],
  },
  '2.1.1': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Was beschreibt die Kernphilosophie des modernen „Inbound Sales“-Ansatzes?',
        options: [
          { id: 'A', text: 'Potenzielle Kunden durch unaufgeforderte Massen-E-Mails zum Kauf drängen' },
          { id: 'B', text: 'Potenzielle Kunden durch wertvollen, nützlichen Content und SEO anzuziehen, sodass sie bei Bedarf von selbst auf das Unternehmen zukommen' },
          { id: 'C', text: 'Den Vertrieb vollständig auf persönliche Treffen vor Ort und Messen zu beschränken' },
          { id: 'D', text: 'Adresslisten von Branchenverzeichnissen zu kaufen und systematisch abzutelefonieren' },
        ],
        correctAnswer: 'B',
        hint: 'Anstatt Werbebotschaften laut in den Markt zu rufen (Outbound), baut man beim Inbound-Ansatz digitale Magnete auf, die interessierte Leads anlocken.',
      },
      {
        question: 'Was ist ein wesentlicher Vorteil von Outbound Sales gegenüber Inbound-Methoden?',
        options: [
          { id: 'A', text: 'Es ist völlig kostenlos und benötigt keine Arbeitszeit' },
          { id: 'B', text: 'Es ermöglicht die präzise Kontrolle über die Zielgruppenansprache und liefert schnelle, messbare Ergebnisse' },
          { id: 'C', text: 'Es zieht nur Kunden an, die bereits perfekt vorinformiert sind' },
          { id: 'D', text: 'Es erfordert keinerlei Kaltakquise oder proaktive Kontaktaufnahme' },
        ],
        correctAnswer: 'B',
        hint: 'Beim Outbound bestimmst du selbst, wen du wann kontaktierst, statt darauf zu warten, dass sich jemand bei dir meldet.',
      },
      {
        question: 'Welchen Ansatz wählen erfolgreiche B2B-Unternehmen in der Praxis bezüglich Inbound und Outbound?',
        options: [
          { id: 'A', text: 'Sie nutzen ausschließlich Inbound, da Outbound gesetzlich verboten ist' },
          { id: 'B', text: 'Sie kombinieren beide Ansätze parallel, um Synergieeffekte zu nutzen und verschiedene Marktsegmente optimal zu erreichen' },
          { id: 'C', text: 'Sie wechseln alle zwei Wochen die Strategie komplett' },
          { id: 'D', text: 'Sie verzichten auf beide Methoden und verlassen sich rein auf Mundpropaganda' },
        ],
        correctAnswer: 'B',
        hint: 'Die Kombination der schnellen Outbound-Ergebnisse mit den qualitativ hochwertigen Inbound-Leads bietet die beste Absicherung.',
      },
    ],
  },
  '2.1.2': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Wie definieren die Unterlagen den Begriff „Sales Enablement“ (Vertriebsförderung)?',
        options: [
          { id: 'A', text: 'Die Erteilung von hohen Rabatten im Verkaufsgespräch zur schnellen Umsatzgenerierung' },
          { id: 'B', text: 'Die Bereitstellung von Prozessen, Inhalten und Technologien, die es Vertriebsteams ermöglichen, effizienter und schneller zu verkaufen' },
          { id: 'C', text: 'Die automatische Provisionsabrechnung für die Vertriebsmitarbeiter am Monatsende' },
          { id: 'D', text: 'Das Erstellen von reinen Kaltakquise-Anruflisten für das Callcenter' },
        ],
        correctAnswer: 'B',
        hint: 'Es geht darum, das Vertriebsteam systematisch zu befähigen und mit Materialien, Wissen und Tools auszustatten.',
      },
      {
        question: 'Welches sind die drei Säulen (Bestandteile) einer ganzheitlichen Sales Enablement-Strategie?',
        options: [
          { id: 'A', text: 'Rekrutierung, Training, Gehaltsabrechnung' },
          { id: 'B', text: 'Kaltakquise, Preisnachlässe, Closing' },
          { id: 'C', text: 'Prozesse, Inhalte (Content), Technologien' },
          { id: 'D', text: 'Leads, Opportunities, Kunden' },
        ],
        correctAnswer: 'C',
        hint: 'Du benötigst klar definierte Abläufe, zielgerichtete Informationsmaterialien für den Kunden und die unterstützende CRM- und Automatisierungs-Software.',
      },
      {
        question: 'Warum ist eine enge Verzahnung von Marketing und Vertrieb im Rahmen des Sales Enablement heute so erfolgskritisch?',
        options: [
          { id: 'A', text: 'Weil Vertriebsmitarbeiter keine Präsentationen mehr selbst erstellen dürfen' },
          { id: 'B', text: 'Weil die Customer Journey heute komplexer ist und Käufer sich intensiv online vorinformieren, bevor sie den Vertrieb kontaktieren' },
          { id: 'C', text: 'Weil das Marketing-Team direkt die Preisverhandlungen mit den Kunden führt' },
          { id: 'D', text: 'Weil dadurch die Kosten für CRM-Lizenzen vollständig entfallen' },
        ],
        correctAnswer: 'B',
        hint: 'Da der Kunde rund 70% des Weges alleine geht, müssen die Inhalte des Marketings perfekt auf die Fragen abgestimmt sein, die der Vertrieb später klärt.',
      },
    ],
  },
  '2.1.3': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Was beschreibt die Hauptaufgabe der Lead-Qualifizierung im Vertrieb?',
        options: [
          { id: 'A', text: 'Möglichst viele E-Mail-Adressen von der Website zu sammeln' },
          { id: 'B', text: 'Zu bewerten, ob ein potenzieller Kunde einen echten Bedarf, das Budget und die Entscheidungsbefugnis für das Angebot hat' },
          { id: 'C', text: 'Dem Kunden direkt beim ersten Anruf ein Angebot zu schicken' },
          { id: 'D', text: 'Den Kunden in die Marketing-Datenbank für Newsletter einzutragen' },
        ],
        correctAnswer: 'B',
        hint: 'Es ist ein Filterprozess, der sicherstellt, dass die wertvolle Zeit des Vertriebs nicht an aussichtslose Kontakte verschwendet wird.',
      },
      {
        question: 'Welcher grundlegende Unterschied bezüglich der Zuständigkeit im Unternehmen besteht zwischen einem MQL und einem SQL?',
        options: [
          { id: 'A', text: 'Für MQLs ist der CEO zuständig, für SQLs das Produkt-Team' },
          { id: 'B', text: 'MQLs werden vom Marketing-Team generiert und übergeben; SQLs werden vom Vertriebsteam aktiv geprüft, qualifiziert und weitergeführt' },
          { id: 'C', text: 'Es gibt keine unterschiedlichen Zuständigkeiten, beide werden komplett von Werbeagenturen betreut' },
          { id: 'D', text: 'SQLs sind rechtlich bindende Kundenverträge, MQLs bloße Newsletter-Anmeldungen' },
        ],
        correctAnswer: 'B',
        hint: 'Das Marketing zieht den Lead an (MQL) und der Vertrieb prüft und übernimmt ihn in die aktive Pipeline (SQL).',
      },
      {
        question: 'Für welche vier harten Qualifizierungskriterien steht das klassische Framework-Akronym „BANT“?',
        options: [
          { id: 'A', text: 'Business, Activity, Network, Technology' },
          { id: 'B', text: 'Budget, Authority (Entscheidungsbefugnis), Need (Bedarf), Timeline (Zeitrahmen)' },
          { id: 'C', text: 'Buyer, Agent, Negotiator, Transaction' },
          { id: 'D', text: 'Brand, Awareness, Nurturing, Team' },
        ],
        correctAnswer: 'B',
        hint: 'Das Modell klärt ab, ob Geld vorhanden ist, wer entscheidet, ob ein echter Schmerz vorliegt und bis wann die Lösung stehen muss.',
      },
    ],
  },
  '2.1.4': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Was regelt ein Service Level Agreement (SLA) zwischen den Marketing- und Vertriebsteams?',
        options: [
          { id: 'A', text: 'Den Urlaubsanspruch und die Kernarbeitszeiten der Mitarbeiter' },
          { id: 'B', text: 'Eine verbindliche Vereinbarung über die Anzahl der vom Marketing gelieferten Leads und die Nachfass-Geschwindigkeit (Speed to Lead) des Vertriebs' },
          { id: 'C', text: 'Die technischen Schnittstellen zwischen Mailserver und CRM-System' },
          { id: 'D', text: 'Die genaue farbliche Gestaltung von Broschüren und Präsentationen' },
        ],
        correctAnswer: 'B',
        hint: 'Es handelt sich um ein vertragsähnliches Abkommen, das die gegenseitigen Verpflichtungen zur Pipeline-Füllung regelt.',
      },
      {
        question: 'Was beschreibt die Kennzahl „Speed to Lead“?',
        options: [
          { id: 'A', text: 'Die Geschwindigkeit, mit der das Marketing-Team neue Werbekampagnen erstellt' },
          { id: 'B', text: 'Die Zeitspanne, die vergeht, bis der Vertrieb auf das Interesse eines neuen Inbound-Leads reagiert' },
          { id: 'C', text: 'Die durchschnittliche Dauer eines erfolgreichen Verkaufsgesprächs' },
          { id: 'D', text: 'Die Zeit, die ein Entwickler für die Implementierung der Software benötigt' },
        ],
        correctAnswer: 'B',
        hint: 'Hier tickt die Uhr – je schneller reagiert wird, desto frischer ist das Interesse des Leads.',
      },
      {
        question: 'Wofür stehen die Buchstaben im Smarketing-Besprechungsmodell „POP“, welches für hocheffiziente Meetings zwischen Marketing und Sales sorgt?',
        options: [
          { id: 'A', text: 'Plan, Organize, Perform' },
          { id: 'B', text: 'Purpose (Zweck), Outcomes (Ergebnisse), Process (Prozess)' },
          { id: 'C', text: 'Product, Offer, Pitch' },
          { id: 'D', text: 'People, Operations, Profit' },
        ],
        correctAnswer: 'B',
        hint: 'Jedes Smarketing-Meeting benötigt einen klaren Grund (Zweck), messbare Resultate am Ende (Ergebnisse) und eine exakt getaktete Agenda (Prozess).',
      },
    ],
  },
  '2.1.6': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Was ist eine „Käufer-Persona“ laut Definition?',
        options: [
          { id: 'A', text: 'Eine gesetzliche Richtlinie für die Durchführung von Verkaufsgesprächen' },
          { id: 'B', text: 'Ein detailliertes, semi-fiktives Profil eines idealen Kundentyps basierend auf echten Daten und Marktforschung' },
          { id: 'C', text: 'Das Organigramm des Einkaufsabteilung eines Großkunden' },
          { id: 'D', text: 'Ein System zur automatischen Sortierung von Leads im CRM' },
        ],
        correctAnswer: 'B',
        hint: 'Es gibt deinem idealen Kunden einen Namen, ein Gesicht und konkrete demografische und psychografische Merkmale.',
      },
      {
        question: 'Welchen wesentlichen Vorteil bietet die Entwicklung von Käufer-Personas für das Marketing- und Vertriebsteam?',
        options: [
          { id: 'A', text: 'Es reduziert die Lizenzkosten für das CRM-System' },
          { id: 'B', text: 'Es ermöglicht eine maßgeschneiderte, hochgradig zielgerichtete Ansprache und verbessert die Kundenbindung' },
          { id: 'C', text: 'Es macht Kaltakquise-Anrufe rechtlich vollkommen unbedenklich' },
          { id: 'D', text: 'Es verkürzt die Einarbeitungszeit neuer Softwareentwickler' },
        ],
        correctAnswer: 'B',
        hint: 'Wenn du weißt, was dein Gegenüber nachts wachhält, kannst du seine Sprache sprechen und seine echten Schmerzen adressieren.',
      },
      {
        question: 'Was unterscheidet eine Käufer-Persona von einem Ideal Customer Profile (ICP)?',
        options: [
          { id: 'A', text: 'Personas sind nur für B2C relevant, das ICP nur für B2B' },
          { id: 'B', text: 'Das ICP beschreibt allgemeine Unternehmensmerkmale (z.B. Umsatz, Branche); eine Käufer-Persona fokussiert sich auf individuelle Merkmale der Personen in diesem Zielmarkt' },
          { id: 'C', text: 'Es gibt keinen Unterschied, beide Begriffe beschreiben dieselben Merkmale' },
          { id: 'D', text: 'Personas werden ausschließlich von externen Werbeagenturen gepflegt' },
        ],
        correctAnswer: 'B',
        hint: 'Das eine beschreibt die Ziel-Firma als Ganzes, das andere das menschliche Wesen darin, an das man letztlich verkauft.',
      },
    ],
  },
  '2.1.7': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Was ist die Kernannahme des „Jobs to be Done“ (JTBD) Frameworks?',
        options: [
          { id: 'A', text: 'Kunden kaufen Produkte ausschließlich wegen deren technischer Features' },
          { id: 'B', text: 'Kunden „heuern“ Produkte an, um eine spezifische Aufgabe (Job) in ihrem Leben oder Geschäft zu erledigen' },
          { id: 'C', text: 'Unternehmen sollten nur noch Mitarbeiter einstellen, die bereits Erfahrung im Vertrieb haben' },
          { id: 'D', text: 'Jede Aufgabe im Vertrieb sollte vollständig automatisiert werden' },
        ],
        correctAnswer: 'B',
        hint: 'Denke an den tieferen funktionalen oder emotionalen Grund, warum jemand Geld für ein Produkt ausgibt.',
      },
      {
        question: 'Welchen überraschenden „Job“ (Aufgabe) hatten die morgendlichen Milchshake-Käufer in der berühmten McDonald\'s-Fallstudie?',
        options: [
          { id: 'A', text: 'Sie suchten nach einem gesunden, kalorienarmen Frühstück für ihre Kinder' },
          { id: 'B', text: 'Sie wollten die langweilige Autofahrt zur Arbeit angenehmer gestalten und sich bis zum Mittag satt fühlen' },
          { id: 'C', text: 'Sie wollten den günstigsten verfügbaren Nachtisch auf der Karte kaufen' },
          { id: 'D', text: 'Sie suchten nach einem schnellen Geschenk für Kollegen' },
        ],
        correctAnswer: 'B',
        hint: 'Der Shake war dickflüssig, hielt eine Hand am Steuer frei und beschäftigte den Pendler während der gesamten Fahrtzeit.',
      },
      {
        question: 'Welche drei Dimensionen eines „Jobs“ müssen laut dem JTBD-Framework analysiert werden?',
        options: [
          { id: 'A', text: 'Technische, finanzielle und operative Anforderungen' },
          { id: 'B', text: 'Funktionale, emotionale und soziale Anforderungen' },
          { id: 'C', text: 'Marketing-, Sales- und Support-Herausforderungen' },
          { id: 'D', text: 'Vergangene, gegenwärtige und zukünftige Trends' },
        ],
        correctAnswer: 'B',
        hint: 'Ein Produkt muss eine praktische Aufgabe lösen, dem Käufer ein gutes Gefühl geben, und bestimmen, wie er von anderen wahrgenommen werden möchte.',
      },
    ],
  },
  '2.1.8': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Was ist ein „Hero Statement“?',
        options: [
          { id: 'A', text: 'Eine detaillierte Aufzählung aller geschäftlichen Erfolge des Vertrieblers' },
          { id: 'B', text: 'Ein kurzer, kraftvoller Satz, der zeigt, wie dein Produkt den wichtigsten Bedarf deiner Zielgruppe erfüllt, indem er Persona und JTBD kombiniert' },
          { id: 'C', text: 'Ein rechtlich bindender Vertrag zwischen zwei SaaS-Unternehmen' },
          { id: 'D', text: 'Ein Leitfaden zur Programmierung von CRM-Dashboards' },
        ],
        correctAnswer: 'B',
        hint: 'Es ist die messerscharfe Positionierung, die in einem Satz erklärt, für wen du mit welcher Methode ein „Held“ bist.',
      },
      {
        question: 'Warum warnen die Unterlagen ausdrücklich davor, im Vertrieb „für jeden ein Held sein zu wollen“?',
        options: [
          { id: 'A', text: 'Weil man dadurch zu schnell alle Produktbestände ausverkauft' },
          { id: 'B', text: 'Weil es zu Verzettelung, Qualitätsverlust und unzufriedenen Kunden führt, da man keine maßgeschneiderte Expertise mehr liefert' },
          { id: 'C', text: 'Weil B2B-Kunden keine selbstbewussten Verkäufer mögen' },
          { id: 'D', text: 'Weil dadurch die gesetzlichen DSGVO-Richtlinien verletzt werden' },
        ],
        correctAnswer: 'B',
        hint: 'Wer versucht, alles für jeden zu sein, ist am Ende nichts für niemanden. Spezialisierung schafft Vertrauen.',
      },
      {
        question: 'Wie lautet die empfohlene Strukturformel für den Aufbau eines Hero Statements?',
        options: [
          { id: 'A', text: '„Wir sind die Marktführer in der Branche X und verkaufen das beste Produkt Y“' },
          { id: 'B', text: '„Für [Käufer-Persona], die [Job to Be Done] benötigen, bieten wir [Produkt], damit [konkreter Nutzen]“' },
          { id: 'C', text: '„Als [Kunden-Rolle] möchte ich [Software-Funktion] nutzen, um [Umsatz] zu generieren“' },
          { id: 'D', text: '„Kaufen Sie [Produkt] heute und erhalten Sie [Rabatt]“' },
        ],
        correctAnswer: 'B',
        hint: 'Ein wirksames Hero Statement verbindet die Zielperson mit ihrer konkreten Aufgabe und deinem Produktnutzen in einem einzigen Satz.',
      },
    ],
  },
  '2.1.9': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Was ist laut den Unterlagen das primäre Ziel des modernen Verkaufsansatzes bezüglich der Kundeninteraktion?',
        options: [
          { id: 'A', text: 'Den Kunden durch psychologische Tricks zum sofortigen Kauf zu drängen' },
          { id: 'B', text: 'Den Fokus mehr auf die Bildung und Unterstützung (Education) des Kunden zu legen als auf den direkten Verkauf' },
          { id: 'C', text: 'Die manuelle Datenpflege im CRM-System vollständig zu minimieren' },
          { id: 'D', text: 'Den Kundenwert künstlich aufzublähen' },
        ],
        correctAnswer: 'B',
        hint: 'Der moderne Verkäufer agiert als beratender Guide. Ein informierter Kunde kauft dort, wo er die kompetenteste Unterstützung erfährt.',
      },
      {
        question: 'Wie kann ein Vertriebsmitarbeiter nützlichen Content gezielt einsetzen, um ein „stockendes Gespräch“ (wenn der Kunde sich nicht mehr meldet) professionell wiederzubeleben?',
        options: [
          { id: 'A', text: 'Indem er täglich eine E-Mail mit der Frage „Haben Sie sich mein Angebot schon überlegt?“ schickt' },
          { id: 'B', text: 'Indem er dem Kunden wertvolle, thematisch passende Fachinformationen (z. B. einen Blogartikel mit Lösungsansätzen) ohne direkten Verkaufsdruck zusendet' },
          { id: 'C', text: 'Indem er dem Kunden ein unaufgefordertes Rabattangebot per SMS schickt' },
          { id: 'D', text: 'Indem er den Lead im CRM sofort als „verloren“ schließt' },
        ],
        correctAnswer: 'B',
        hint: 'Statt mit nervigen Nachfragen Druck aufzubauen, liefert man neuen Mehrwert, der das Vertrauen stärkt.',
      },
      {
        question: 'Welches Inbound-Content-Format eignet sich am besten, um hohe Autorität und fachliche Tiefe bei anspruchsvollen Entscheidungsträgern zu etablieren?',
        options: [
          { id: 'A', text: 'Kurze Social Media Posts' },
          { id: 'B', text: 'Whitepapers (Detaillierte Berichte zu Trends)' },
          { id: 'C', text: 'Infografiken zur visuellen Anziehung' },
          { id: 'D', text: 'Kurze Blog-Posts zu allgemeinen Themen' },
        ],
        correctAnswer: 'B',
        hint: 'Dieses Format hat zwar einen hohen Erstellungsaufwand, liefert dafür aber detaillierte Daten, Branchenanalysen und tiefe Analysen.',
      },
    ],
  },
  '2.1.11': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Warum sollten Marketing und Vertrieb bei der Content-Erstellung im Unternehmen eine enge Einheit bilden?',
        options: [
          { id: 'A', text: 'Weil der Vertrieb sonst keine Erlaubnis hat, die Website zu besuchen' },
          { id: 'B', text: 'Damit der Content auf den tatsächlichen Fragen, Problemen und Bedürfnissen der Kunden aus dem Vertriebsalltag basiert' },
          { id: 'C', text: 'Um die Kosten für Marketing-Lizenzen vollständig einzusparen' },
          { id: 'D', text: 'Weil der Vertrieb die Blog-Artikel im HTML-Format selbst programmieren muss' },
        ],
        correctAnswer: 'B',
        hint: 'Der Vertrieb spricht täglich mit echten Interessenten und kennt deren Schmerzpunkte am besten.',
      },
      {
        question: 'Wie funktioniert der praxisnahe „BCC-Marketing“-Ansatz zur einfachen Gewinnung von Content-Ideen im Unternehmen?',
        options: [
          { id: 'A', text: 'Der Vertrieb sendet unaufgefordert Werbe-Mails an Tausende Kontakte im BCC-Feld' },
          { id: 'B', text: 'Vertriebsmitarbeiter setzen das Marketing bei E-Mails mit typischen Kundenfragen in BCC, damit das Marketing diese realen Fragen in Blog-Artikel umwandeln kann' },
          { id: 'C', text: 'Der Geschäftsführer wird bei allen Kundenbeschwerden heimlich in BCC gesetzt' },
          { id: 'D', text: 'Es handelt sich um ein automatisiertes Löschverfahren für Spam-E-Mails' },
        ],
        correctAnswer: 'B',
        hint: 'Auf diese Weise erfährt das Marketing direkt, welche echten Fragen die Kundschaft im Alltag beschäftigen.',
      },
      {
        question: 'Welche Bedingung muss laut Marcus Sheridan erfüllt sein, um im Unternehmen kontinuierlich hervorragenden Content in großen Mengen zu produzieren?',
        options: [
          { id: 'A', text: 'Die Erstellung muss als unbezahlte Überstunde an Praktikanten ausgelagert werden' },
          { id: 'B', text: 'Jemand muss die volle Verantwortung für den Content als Hauptaufgabe (Vollzeit-Rolle, z. B. Content Manager) übernehmen' },
          { id: 'C', text: 'Es darf kein festes Budget für Marketing eingeplant werden' },
          { id: 'D', text: 'Der Content muss ausschließlich durch künstliche Intelligenz generiert werden' },
        ],
        correctAnswer: 'B',
        hint: 'Sheridan betont: „Ohne volle Verantwortung wird keine großartige Arbeit geleistet“. Es braucht eine dedizierte Person dafür.',
      },
    ],
  },
  '2.1.12': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Aus welchen drei Hauptteilen besteht der logische Aufbau eines Beitrags oder Blogartikels?',
        options: [
          { id: 'A', text: 'Titelblatt, Inhaltsverzeichnis, Literaturverzeichnis' },
          { id: 'B', text: 'Einleitung, Hauptteil und Schlussfolgerung' },
          { id: 'C', text: 'Einwandbehandlung, Pitch, Closing' },
          { id: 'D', text: 'Problemidentifikation, BANT-Prüfung, Unterschrift' },
        ],
        correctAnswer: 'B',
        hint: 'Denke an den klassischen Dreischritt: Leser fesseln, Argumente mit Belegen ausführen, und mit einer Zusammenfassung oder Handlungsaufforderung abschließen.',
      },
      {
        question: 'Welcher einfache Schreib-Tipp verbessert die Lesbarkeit und Dynamik von Vertriebs-Texten enorm?',
        options: [
          { id: 'A', text: 'Sätze konsequent im Passiv formulieren, um besonders distanziert zu wirken' },
          { id: 'B', text: 'Sätze in die aktive Stimme umwandeln, um direkt und überzeugend zu kommunizieren' },
          { id: 'C', text: 'Ausschließlich sehr lange Schachtelsätze mit vielen Adjektiven verwenden' },
          { id: 'D', text: 'Den Leser immer in der unpersönlichen dritten Person („Man“) anreisen' },
        ],
        correctAnswer: 'B',
        hint: 'Vergleiche „Der Vertrag wird von uns gesendet“ mit „Wir senden Ihnen den Vertrag“. Die aktive Variante transportiert mehr Energie.',
      },
      {
        question: 'Warum ist das bewusste Einfügen des Worts „weil“ in deinen Argumentationen psychologisch so wirkungsvoll?',
        options: [
          { id: 'A', text: 'Es verkürzt die Lesezeit um die Hälfte' },
          { id: 'B', text: 'Es liefert dem Gehirn eine sofortige, logische Begründung, was die Akzeptanz einer Behauptung stark erhöht' },
          { id: 'C', text: 'Es sorgt für ein besseres Suchmaschinen-Ranking bei Google' },
          { id: 'D', text: 'Es filtert automatisch grammatikalische Fehler aus dem Entwurf' },
        ],
        correctAnswer: 'B',
        hint: 'Menschen verlangen unbewusst nach Gründen. Eine Aussage wie „Unser Produkt ist ideal, weil es Ihnen Zeit spart...“ befriedigt dieses Bedürfnis sofort.',
      },
    ],
  },
  '2.1.13': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Was bedeutet „Customer Enablement“ nach dem Verkaufsabschluss?',
        options: [
          { id: 'A', text: 'Die sofortige Preiserhöhung nach der Vertragsunterschrift' },
          { id: 'B', text: 'Die kontinuierliche Unterstützung und Bereitstellung von Ressourcen, damit der Kunde den größtmöglichen Nutzen aus dem Produkt zieht' },
          { id: 'C', text: 'Die automatische Kündigung von Kunden, die zu viele Fragen stellen' },
          { id: 'D', text: 'Das Auslagern des Kundenservice an externe Callcenter' },
        ],
        correctAnswer: 'B',
        hint: 'Es geht darum, den Kunden aktiv zu befähigen, mit deiner Software maximal erfolgreich zu werden, um Kündigungen zu verhindern.',
      },
      {
        question: 'Warum ist die Kundenbetreuung nach dem Verkauf im SaaS-Bereich finanziell so entscheidend?',
        options: [
          { id: 'A', text: 'Weil nach dem Kauf keine technischen Updates mehr nötig sind' },
          { id: 'B', text: 'Weil der größte Umsatz nach dem ersten Abschluss durch wiederkehrende Monatsabonnements (Abonnements) generiert wird' },
          { id: 'C', text: 'Weil Neukundenakquise im SaaS-Bereich völlig kostenlos ist' },
          { id: 'D', text: 'Weil dadurch der einmalige Deal-Wert (Deal Value) künstlich aufgebläht wird' },
        ],
        correctAnswer: 'B',
        hint: 'Im Abo-Modell verdient man Geld durch die Treue des Kunden über Monate und Jahre hinweg.',
      },
      {
        question: 'Was ist der Unterschied zwischen dem einmaligen Deal-Wert (Deal Value, DV) und dem Kundenlebenszeitwert (Customer Lifetime Value, CLV)?',
        options: [
          { id: 'A', text: 'Der DV ist immer deutlich höher als der CLV' },
          { id: 'B', text: 'Der DV beschreibt den einmaligen Vertragswert einer festen Laufzeit; der CLV erfasst den gesamten Umsatz über die komplette Dauer der Kundenbeziehung inklusive Up- und Cross-Selling' },
          { id: 'C', text: 'Der CLV misst nur die Kosten für das Marketing, während der DV den Reingewinn erfasst' },
          { id: 'D', text: 'Es gibt keinen Unterschied; beide Begriffe sind absolut identisch' },
        ],
        correctAnswer: 'B',
        hint: 'Ein Vertrag über 12 Monate für monatlich 100 Euro hat einen DV von 1.200 Euro. Bleibt der Kunde länger und kauft Upgrades, steigt der CLV.',
      },
    ],
  },
  '2.1.14': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Was sind „digitale Tools“ im Vertrieb laut Definition?',
        options: [
          { id: 'A', text: 'Mechanische Werkzeuge für den Aufbau von Serverräumen' },
          { id: 'B', text: 'Digitale Werkzeuge, die einzelne Schritte im Verkaufsprozess übernehmen oder erleichtern, um die Produktivität zu steigern' },
          { id: 'C', text: 'Ausschließlich Social-Media-Plattformen für den privaten Gebrauch' },
          { id: 'D', text: 'No-Code-Datenbanken, die offline auf Papier geführt werden' },
        ],
        correctAnswer: 'B',
        hint: 'Sie optimieren den Vertriebszyklus und entlasten die Mitarbeiter von manueller Routinearbeit.',
      },
      {
        question: 'Wie funktionieren Workflow-Automatisierungstools wie Zapier oder Make?',
        options: [
          { id: 'A', text: 'Sie schreiben automatisch Code in Python, um Server abzusichern' },
          { id: 'B', text: 'Sie verbinden verschiedene Anwendungen über Auslöser (Trigger) und Aktionen (Actions) ganz ohne Programmierkenntnisse' },
          { id: 'C', text: 'Sie rufen Kunden automatisch mit synthetischen Stimmen an' },
          { id: 'D', text: 'Sie löschen inaktive Kontakte im CRM-System nach 30 Tagen' },
        ],
        correctAnswer: 'B',
        hint: 'Sie arbeiten im Hintergrund nach einer einfachen "Wenn-Dann-Logik" und übertragen Daten fehlerfrei von einer App in die andere.',
      },
      {
        question: 'In welchem Anwendungsszenario ist das Tool „Make“ gegenüber dem einfacheren Konkurrenten „Zapier“ im Vorteil?',
        options: [
          { id: 'A', text: 'Wenn man nur einen einzigen, simplen Zwischenschritt ohne Bedingungen automatisieren möchte' },
          { id: 'B', text: 'Bei komplexeren Workflows mit mehreren logischen Verzweigungen, Bedingungen und Schleifen, die visuell dargestellt werden sollen' },
          { id: 'C', text: 'Make ist das einzige Tool, das direkt offline auf dem Desktop-PC läuft' },
          { id: 'D', text: 'Make benötigt im Gegensatz zu Zapier zwingend Programmierkenntnisse in Python' },
        ],
        correctAnswer: 'B',
        hint: 'Zapier ist ideal für schnelle, einfache Kettenschritte; das andere Tool glänzt bei verschachtelten, grafisch gemappten Logikpfaden.',
      },
    ],
  },
  '2.2.3': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Wie unterscheidet die „Nutzenbrücke“ zwischen den Begriffen Merkmal, Vorteil und Nutzen?',
        options: [
          { id: 'A', text: 'Es gibt keinen Unterschied; alle drei Wörter bedeuten das Gleiche' },
          { id: 'B', text: 'Merkmal ist die technische Eigenschaft (Fakt), Vorteil ist die funktionale Auswirkung, und Nutzen ist der persönliche Wert, der den spezifischen Kundenwunsch erfüllt' },
          { id: 'C', text: 'Nutzen ist nur der Preisnachlass, Vorteil das Produktfeature' },
          { id: 'D', text: 'Merkmal beschreibt das Firmenlogo, Vorteil die Konkurrenz, Nutzen den Vertrag' },
        ],
        correctAnswer: 'B',
        hint: '„Fahrrad mit starrer Gabel“ (Merkmal) -> „Fährt wartungsarm“ (Vorteil) -> „Bedeutet für Sie weniger Aufwand und mehr Abenteuerzeit“ (Nutzen).',
      },
      {
        question: 'Welche Rolle spielen emotionale Kaufmotive wie Sicherheit, Status oder Angst vor Verlusten bei B2B-Kaufentscheidungen?',
        options: [
          { id: 'A', text: 'Emotionen spielen im B2B-Bereich absolut keine Rolle, da Firmen rein rational nach Zahlen entscheiden' },
          { id: 'B', text: 'Eine weitreichende Rolle, da auch B2B-Entscheider Menschen sind, die Risiken vermeiden, Anerkennung suchen und Sicherheit anstreben' },
          { id: 'C', text: 'Emotionen sind gesetzlich nur im B2C-Verkauf zulässig' },
          { id: 'D', text: 'Sie dienen ausschließlich dazu, Preisverhandlungen komplett zu umgehen' },
        ],
        correctAnswer: 'B',
        hint: 'Rationale Argumente informieren zwar, aber die eigentliche Entscheidung wird auch im B2B-Bereich emotional getroffen und erst im Nachgang rational begründet.',
      },
      {
        question: 'Welchen Mindestanteil an Argumenten im Verkaufsgespräch muss sich laut der wissenschaftlichen Huthwaite-Studie auf den echten Kundennutzen fokussieren, damit Verkäufer signifikant erfolgreicher abschließen?',
        options: [
          { id: 'A', text: 'Mindestens 4%' },
          { id: 'B', text: 'Mindestens 9%' },
          { id: 'C', text: 'Mindestens 25%' },
          { id: 'D', text: 'Mindestens 50%' },
        ],
        correctAnswer: 'B',
        hint: 'Schon ein relativ kleiner, aber präziser Fokus auf den echten Nutzen (knapp unter 10%) entscheidet über den Erfolg. Sinkt der Anteil unter 4%, droht fast immer der Auftragsverlust.',
      },
    ],
  },
  '2.2.5': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Welchen psychologischen Effekt nutzt die Abschlusstechnik der „Ja-Kette“?',
        options: [
          { id: 'A', text: 'Sie bringt den Kunden dazu, den Hörer aus Frustration aufzulegen' },
          { id: 'B', text: 'Mehrere kleine Zusagen („Ja“) im Gespräch schaffen ein starkes psychologisches Commitment und erleichtern das finale „Ja“ zum Abschluss ohne Druck' },
          { id: 'C', text: 'Sie beweist dem Kunden die logische Überlegenheit des Verkäufers' },
          { id: 'D', text: 'Sie umgeht die rechtliche Notwendigkeit einer schriftlichen Unterschrift' },
        ],
        correctAnswer: 'B',
        hint: 'Wenn der Kunde im Vorfeld bereits mehrfach zugestimmt hat (z. B. zu wichtigen Funktionen), ist die Hemmschwelle für die finale Kaufentscheidung gering.',
      },
      {
        question: 'Wie lautet die „goldene Regel“ des Schweigens (Stille) direkt nach dem Stellen der Abschlussfrage?',
        options: [
          { id: 'A', text: 'Sofort weiterreden, um peinliche Pausen im Gespräch zu vermeiden' },
          { id: 'B', text: 'Die Stille absolut aushalten, dem Kunden Zeit zum Nachdenken geben und geduldig auf seine Antwort warten' },
          { id: 'C', text: 'Den Kunden sofort bitten, sich innerhalb von 5 Sekunden zu entscheiden' },
          { id: 'D', text: 'Dem Kunden eine weitere E-Mail mit Produktvorteilen vorlesen' },
        ],
        correctAnswer: 'B',
        hint: 'Wer nach der Abschlussfrage zuerst spricht, verliert. Lass dem Käufer den Raum, seine Gedanken zu ordnen.',
      },
      {
        question: 'Wie verhält sich ein Verkäufer beim „Alternativabschluss“ taktisch klug?',
        options: [
          { id: 'A', text: 'Er bietet dem Kunden das Produkt eines Konkurrenten als Alternative an' },
          { id: 'B', text: 'Statt der Ja-Nein-Frage „Kaufen Sie?“ stellt er zwei konkrete Umsetzungs-Alternativen zur Auswahl, die beide zum Kauf führen' },
          { id: 'C', text: 'Er bietet dem Kunden das Produkt völlig kostenlos an' },
          { id: 'D', text: 'Er verlangt vom Kunden, sich zwischen Kauf und Kündigung zu entscheiden' },
        ],
        correctAnswer: 'B',
        hint: 'Mit Fragen wie „Bevorzugen Sie das Standard- oder Premium-Paket?“ lenkst du den Fokus weg von der Hürde des Kaufens hin zur konkreten Implementierung.',
      },
    ],
  },
  '2.3.2': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Was zeichnet einen echten „Inbound Lead“ laut den Kernaussagen der Inbound-Lead-Strategie aus?',
        options: [
          { id: 'A', text: 'Er wurde kalt aus einem Branchenverzeichnis kopiert und hat kein Interesse gezeigt' },
          { id: 'B', text: 'Er kommt aktiv auf das Unternehmen zu (z. B. durch Downloads oder Formulare) und gibt freiwillig seine Kontaktdaten an' },
          { id: 'C', text: 'Er hat bereits das teurere Produkt eines direkten Wettbewerbers gekauft' },
          { id: 'D', text: 'Er ist ein anonymer Besucher der Website, der keine Daten hinterlässt' },
        ],
        correctAnswer: 'B',
        hint: 'Inbound-Leads zeigen Eigeninitiative, da sie durch hilfreiche Inhalte auf dich aufmerksam geworden sind.',
      },
      {
        question: 'Warum ist es für den Vertrieb so wertvoll, Inbound-Leads nach ihren konkreten „Käuferinteressen“ zu segmentieren?',
        options: [
          { id: 'A', text: 'Um die Lizenzgebühren des CRM-Systems zu senken' },
          { id: 'B', text: 'Um die echten Probleme des Kunden besser zu verstehen und den Outreach mit maßgeschneiderten Inhalten vorzubereiten' },
          { id: 'C', text: 'Um Leads automatisch an externe Callcenter auszulagern' },
          { id: 'D', text: 'Um unpassende Leads sofort und unwiderruflich zu löschen' },
        ],
        correctAnswer: 'B',
        hint: 'Eine personalisierte, interessenspezifische Ansprache erzielt deutlich höhere Antwortraten als eine Einheitslösung.',
      },
      {
        question: 'Welche Kanäle gelten laut den Marketing-Statistiken der Unterlagen als die effektivsten Quellen für Inbound-Leads?',
        options: [
          { id: 'A', text: 'Gekaufte E-Mail-Adressen und unaufgeforderte Briefpost' },
          { id: 'B', text: 'Die eigene Unternehmenswebsite, informative Blogs, Landing Pages und SEO' },
          { id: 'C', text: 'Telefonbücher und Branchenverzeichnisse vor Ort' },
          { id: 'D', text: 'Fernsehwerbung und Plakatwände an der Straße' },
        ],
        correctAnswer: 'B',
        hint: 'Denke an digitale Kanäle, auf denen potenzielle Kunden eigenständig recherchieren und nach Lösungen suchen.',
      },
    ],
  },
  '2.3.3': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Welche Empfehlung geben die Unterlagen für den ersten Schritt bei der Erstellung eines Ideal Customer Profiles (ICP)?',
        options: [
          { id: 'A', text: 'Direkt 50 komplexe Kriterien definieren, um den Markt maximal einzuschränken' },
          { id: 'B', text: 'Es einfach halten und klein beginnen, indem man sich zunächst auf 2-3 Schlüsselmerkmale fokussiert' },
          { id: 'C', text: 'Eine teure externe Marktforschungsagentur mit der Analyse beauftragen' },
          { id: 'D', text: 'Firmengrafische Daten (wie Umsatz oder Mitarbeiterzahl) komplett ignorieren' },
        ],
        correctAnswer: 'B',
        hint: 'Beginne mit einem soliden Basisprofil (z. B. Branche und Unternehmensgröße) und verfeinere die Kriterien schrittweise.',
      },
      {
        question: 'Was ist der wesentliche Unterschied zwischen einem Ideal Customer Profile (ICP) und einer Buyer Persona?',
        options: [
          { id: 'A', text: 'Das ICP ist nur für Großkonzerne relevant, die Persona für Startups' },
          { id: 'B', text: 'Das ICP definiert ideale Unternehmensmerkmale; eine Buyer Persona beschreibt ein semi-fiktives Profil einer konkreten Person im Buying Center' },
          { id: 'C', text: 'Es gibt keinen Unterschied, beide Begriffe beschreiben dieselben Merkmale' },
          { id: 'D', text: 'Personas werden ausschließlich von externen Werbeagenturen gepflegt' },
        ],
        correctAnswer: 'B',
        hint: 'Das eine betrifft firmengrafische Daten der Firma, das andere die Ziele, Herausforderungen und demografischen Daten des menschlichen Entscheiders.',
      },
      {
        question: 'Warum sollten Unternehmen laut der Recap-Lektion mit einer geringen Anzahl an Personas (z. B. 1 bis 2) starten?',
        options: [
          { id: 'A', text: 'Weil HubSpot CRM technisch nicht mehr als zwei Personas verwalten kann' },
          { id: 'B', text: 'Weil zu viele Personas von Anfang an unübersichtlich sind und zu Unfokussiertheit im Team führen' },
          { id: 'C', text: 'Weil der Gesetzgeber die Anzahl der Personas streng begrenzt' },
          { id: 'D', text: 'Weil Personas nur für B2C-Kunden mit geringem Budget erstellt werden dürfen' },
        ],
        correctAnswer: 'B',
        hint: 'Fokussierung ist der Schlüssel – es ist besser, ein oder zwei Kundentypen perfekt anzusprechen, als sich zu verzetteln.',
      },
    ],
  },
  '2.3.4': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Wie wird ein „Deal“ im HubSpot CRM definiert?',
        options: [
          { id: 'A', text: 'Ein rechtsgültig unterschriebener und bezahlter Kundenvertrag' },
          { id: 'B', text: 'Eine konkrete Verkaufschance (mögliches Geschäft) verknüpft mit einem Kontakt, mit eigenem Wert und Fortschritt' },
          { id: 'C', text: 'Ein einfaches Formularfeld auf der Website des Anbieters' },
          { id: 'D', text: 'Ein statistischer Bericht über die Marketingkosten der Kampagne' },
        ],
        correctAnswer: 'B',
        hint: 'Ein Deal repräsentiert das eigentliche wirtschaftliche Projekt in deiner Pipeline, das verschiedene Stufen durchläuft.',
      },
      {
        question: 'Was beschreibt die „Sales Pipeline“ im CRM-System?',
        options: [
          { id: 'A', text: 'Den logistischen Transportweg physischer Produkte zum Kunden' },
          { id: 'B', text: 'Die Abfolge von definierten Phasen, die ein Deal von der Erstellung bis zum Abschluss durchläuft' },
          { id: 'C', text: 'Das E-Mail-Postfach des zuständigen Vertriebsmitarbeiters' },
          { id: 'D', text: 'Eine Liste mit den Telefonnummern aller inaktiven Kontakte' },
        ],
        correctAnswer: 'B',
        hint: 'Sie zeigt dir visuell auf einen Blick, in welcher Stufe (z. B. „Termin vereinbart“, „Vertrag gesendet“) jede Verkaufschance gerade steht.',
      },
      {
        question: 'Was ist der funktionale Unterschied zwischen „Lifecycle-Phase“ und „Deal-Stage“ im CRM?',
        options: [
          { id: 'A', text: 'Deal-Stage ist nur für Marketing-Inhalte relevant, Lifecycle-Phase nur für Sales-Pitches' },
          { id: 'B', text: 'Die Lifecycle-Phase beschreibt die allgemeine Beziehung eines Kontakts zu deiner Firma; die Deal-Stage misst den Fortschritt eines konkreten Deals' },
          { id: 'C', text: 'Es gibt keinen Unterschied; beide Werte bewegen sich immer im absoluten Gleichschritt' },
          { id: 'D', text: 'Die Lifecycle-Phase läuft nur auf mobilen Endgeräten, die Deal-Stage nur am Desktop' },
        ],
        correctAnswer: 'B',
        hint: 'Ein Kontakt kann über Jahre hinweg ein „Kunde“ (Lifecycle-Phase) sein, während ein neues Upgrade-Geschäft dafür in der Stufe „Vertrag gesendet“ (Deal-Stage) steht.',
      },
    ],
  },
  '2.3.6': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Wie viele Wörter sollte eine hochgradig effektive Cold E-Mail laut den Best Practices maximal umfassen?',
        options: [
          { id: 'A', text: 'Maximal 120 Wörter' },
          { id: 'B', text: 'Genau 250 Wörter' },
          { id: 'C', text: 'Mindestens 500 Wörter' },
          { id: 'D', text: 'Es gibt keine Begrenzung für B2B-Mails' },
        ],
        correctAnswer: 'B',
        hint: 'Halte deine Ansprache extrem prägnant, komm sofort auf den Punkt und vermeide unnötige Einleitungsschleifen.',
      },
      {
        question: 'Welcher Baustein steht am Ende einer starken Cold E-Mail, um die Antwortwahrscheinlichkeit zu maximieren?',
        options: [
          { id: 'A', text: 'Eine detaillierte Preisliste aller angebotenen Pakete' },
          { id: 'B', text: 'Genau eine konkrete, offene Call-to-Action-Frage zur Einleitung eines Gesprächs' },
          { id: 'C', text: 'Ein Link zur kompletten technischen Produktdokumentation' },
          { id: 'D', text: 'Drei verschiedene Terminvorschläge für ein einstündiges Meeting' },
        ],
        correctAnswer: 'B',
        hint: 'Wer am Ende der Mail zu viele Optionen bietet, verwirrt den Empfänger. Eine einfache, neugierig machende Frage startet den Dialog.',
      },
      {
        question: 'Was ist ein „Snippet“ in HubSpot CRM?',
        options: [
          { id: 'A', text: 'Ein Programm zur Erkennung von Spam-E-Mails' },
          { id: 'B', text: 'Ein vordefinierter Textbaustein zur schnellen, fehlerfreien Beantwortung wiederkehrender Kundenanfragen' },
          { id: 'C', text: 'Eine automatisierte E-Mail-Kampagne an Kaltlisten' },
          { id: 'D', text: 'Eine Grafik zur Verschönerung der E-Mail-Signatur' },
        ],
        correctAnswer: 'B',
        hint: 'Diese kleinen Bausteine lassen sich über Shortcuts (z. B. Hashtags) in Mails oder Notizen blitzschnell einfügen.',
      },
    ],
  },
  '2.3.7': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Was ist das primäre, übergeordnete Ziel eines ersten Cold Calls (Kaltanrufs) am Telefon?',
        options: [
          { id: 'A', text: 'Der direkte Verkauf des Produkts im ersten Telefongespräch' },
          { id: 'B', text: 'Die Vereinbarung eines konkreten nächsten Schritts (z. B. eines Folgetermins)' },
          { id: 'C', text: 'Den Kunden vom Wechsel seines aktuellen Anbieters zu überzeugen' },
          { id: 'D', text: 'Das CRM-System auf Funktionsfähigkeit zu prüfen' },
        ],
        correctAnswer: 'B',
        hint: 'Ein Cold Call dauert meist weniger als 5 Minuten – es geht nur darum, Zeit im Kalender des Leads zu sichern, nicht das Geschäft abzuschließen.',
      },
      {
        question: 'Welche drei Schritte sollten in den ersten 20 Sekunden eines Kaltanrufs erfolgen, um eine professionelle Tonalität zu setzen?',
        options: [
          { id: 'A', text: 'Direkt pitchen, Preis nennen, nach dem Budget fragen' },
          { id: 'B', text: 'Klar sagen, wer man ist, die Erlaubnis für das Gespräch einholen, und einen konkreten Bezugspunkt nennen' },
          { id: 'C', text: 'Eine fiktive Person verlangen, Zeit schinden, die Sekretärin ablenken' },
          { id: 'D', text: 'Dem Kunden direkt die Unzuverlässigkeit seiner aktuellen Software vorwerfen' },
        ],
        correctAnswer: 'B',
        hint: 'Transparenz schafft Vertrauen – nenne Name und Firma, hole das erste „Ja“ mit einer Erlaubnisfrage ab und zeige, warum du anrufst.',
      },
      {
        question: 'Wie lautet die Elevator-Pitch-Formel laut den Kaltakquise-Unterlagen?',
        options: [
          { id: 'A', text: '„Wir sind das beste Unternehmen auf dem Markt und verkaufen Software X“' },
          { id: 'B', text: '„Ich helfe [Zielgruppe], die [Problem] hat, [Ergebnis] zu erreichen – mit [Angebot]“' },
          { id: 'C', text: '„Möchten Sie heute unsere Software kaufen, um 50% Zeit einzusparen?“' },
          { id: 'D', text: '„Ich bin seit 10 Jahren im Vertrieb und möchte Ihnen heute unsere Software vorstellen“' },
        ],
        correctAnswer: 'B',
        hint: 'Ein wirksamer Pitch nennt in 30 Sekunden die Zielgruppe, deren konkreten Schmerz, den messbaren Nutzen und deine Methode.',
      },
    ],
  },
  '2.3.8': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Was ist eine „Sequenz“ im HubSpot CRM?',
        options: [
          { id: 'A', text: 'Ein Tool zur automatischen Generierung von E-Mails aus Google-Suchergebnissen' },
          { id: 'B', text: 'Eine geplante Abfolge von Schritten (E-Mails, Call-Tasks, To-dos, Wartezeiten), die HubSpot automatisch pro Kontakt steuert' },
          { id: 'C', text: 'Ein automatisches Wählsystem, das Telefonnummern im Hintergrund wählt' },
          { id: 'D', text: 'Ein Übersetzungsprogramm für eingehende Kunden-Mails' },
        ],
        correctAnswer: 'B',
        hint: 'Es ist deine in Software gegossene Kontaktstrecke, die dafür sorgt, dass kein Lead durch vergessenes Nachfassen verloren geht.',
      },
      {
        question: 'Welche kritische Funktion erfüllt die „Auto-Stopp“-Regel bei HubSpot-Sequenzen?',
        options: [
          { id: 'A', text: 'Sie sperrt das CRM-Konto bei Inaktivität des Mitarbeiters' },
          { id: 'B', text: 'Sie beendet die Sequenz für einen Kontakt sofort automatisch, sobald dieser antwortet oder ein Meeting bucht' },
          { id: 'C', text: 'Sie begrenzt die Anzahl gesendeter E-Mails pro Tag auf maximal 10 Stück' },
          { id: 'D', text: 'Sie verhindert das Anlegen von Duplikaten im System' },
        ],
        correctAnswer: 'B',
        hint: 'Diese Funktion verhindert den peinlichen Fehler, dass ein Lead eine automatisierte Nachfass-Mail erhält, obwohl er gerade zugesagt hat.',
      },
      {
        question: 'Wie reagiert ein Verkäufer in der Praxis professionell auf den Antworttyp „Melden Sie sich später“ (z. B. erst im Herbst)?',
        options: [
          { id: 'A', text: 'Er schließt den Lead sofort als verloren und löscht den Datensatz' },
          { id: 'B', text: 'Er vereinbart einen konkreten Termin (Wiedervorlage), holt das Einverständnis ein und legt sofort einen Task im CRM mit diesem Datum an' },
          { id: 'C', text: 'Er sendet dem Kunden weiterhin wöchentlich automatische E-Mails' },
          { id: 'D', text: 'Er ruft den Kunden am nächsten Tag erneut an, um nachzubohren' },
        ],
        correctAnswer: 'B',
        hint: 'Ein „Später“ ist ein „Ja mit Datum“. Vereinbare den konkreten Tag und lass dich vom CRM daran erinnern.',
      },
    ],
  },
  '2.3.9': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu diesem Thema.',
    questions: [
      {
        question: 'Wofür stehen die drei Buchstaben „C“, „G“ und „P“ im modernen Qualifizierungs-Framework für B2B-Sales?',
        options: [
          { id: 'A', text: 'Contact, Greeting, Pitch (Erstkontakt, Begrüßung, Präsentation)' },
          { id: 'B', text: 'Challenge (Herausforderung), Goal (Ziel), Plan (Plan)' },
          { id: 'C', text: 'Customer, Growth, Profit (Kunde, Wachstum, Reingewinn)' },
          { id: 'D', text: 'Closing, Guarantee, Payment (Abschluss, Garantie, Bezahlung)' },
        ],
        correctAnswer: 'B',
        hint: 'Dieses Framework erforscht zuerst den genauen Schmerz des Kunden, das gewünschte messbare Ergebnis und seine bisherigen eigenen Lösungsansätze.',
      },
      {
        question: 'Welche zentralen Aspekte verbergen sich hinter den Buchstaben „C“ und „I“ im Teilbereich „TCI“ dieses Frameworks?',
        options: [
          { id: 'A', text: 'Company, Industry (Unternehmensdaten und Branche)' },
          { id: 'B', text: 'Consequences (Konsequenzen von Untätigkeit) und Implications (Implikationen von Erfolg)' },
          { id: 'C', text: 'Cost, Investment (Einführungskosten und Gesamteinsatz)' },
          { id: 'D', text: 'Compliance, Integration (Gesetzeskonformität und technische Einbindung)' },
        ],
        correctAnswer: 'B',
        hint: 'Es geht um die Dringlichkeit: Was passiert Negatives, wenn das Problem ungelöst bleibt, und welche positiven Effekte entstehen bei schnellem Erfolg?',
      },
      {
        question: 'Welche spezifische Rolle im rollenbasierten Buying Center trifft laut den Unterlagen die endgültige Kaufentscheidung und besitzt die formelle Befugnis, Verträge zu unterzeichnen?',
        options: [
          { id: 'A', text: 'Gatekeeper' },
          { id: 'B', text: 'User (Nutzer)' },
          { id: 'C', text: 'Decider (Entscheider)' },
          { id: 'D', text: 'Initiator' },
        ],
        correctAnswer: 'B',
        hint: 'Diese Person trägt die ultimative Budgetverantwortung im Unternehmen. Oft handelt es sich um Abteilungsleiter, IT-Leiter oder Geschäftsführer.',
      },
    ],
  },
  '2.3.11': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu Solution Selling.',
    questions: [
      {
        question: 'Was unterscheidet Solution Selling vom klassischen Verkaufen?',
        options: [
          { id: 'A', text: 'Solution Selling beginnt mit der Frage „Wie kann ich helfen?" statt „Was kann ich verkaufen?"' },
          { id: 'B', text: 'Solution Selling verzichtet komplett auf Produktpräsentationen' },
          { id: 'C', text: 'Solution Selling richtet sich nur an Bestandskunden' },
          { id: 'D', text: 'Solution Selling ist nur bei sehr teuren Produkten sinnvoll' },
        ],
        correctAnswer: 'A',
        hint: 'Der Ausgangspunkt ist das Problem des Kunden, nicht das eigene Produkt.',
      },
      {
        question: 'Wozu dient die Recherche über LinkedIn, Unternehmenswebseiten oder ChatGPT vor einem Verkaufsgespräch?',
        options: [
          { id: 'A', text: 'Um die Telefonnummer des Kunden zu finden' },
          { id: 'B', text: 'Um Hintergrundwissen zu Branche, Projekten und Herausforderungen zu sammeln und das Gespräch gezielt vorzubereiten' },
          { id: 'C', text: 'Um den Preis der Konkurrenz zu ermitteln' },
          { id: 'D', text: 'Um die Recherche komplett zu ersetzen' },
        ],
        correctAnswer: 'B',
        hint: 'Je besser du die Ausgangslage des Kunden kennst, desto gezielter kannst du fragen.',
      },
      {
        question: 'Woran erkennst du ein Kaufsignal im Gespräch?',
        options: [
          { id: 'A', text: 'Der Kunde stellt konkrete Nachfragen, z. B. „Wie lange dauert die Einführung?"' },
          { id: 'B', text: 'Der Kunde beendet das Gespräch abrupt' },
          { id: 'C', text: 'Der Kunde bittet um einen späteren Termin ohne Begründung' },
          { id: 'D', text: 'Der Kunde stellt keine Fragen mehr' },
        ],
        correctAnswer: 'A',
        hint: 'Konkrete Nachfragen zeigen echtes Interesse – jetzt kannst du sanft in den Abschluss überleiten.',
      },
    ],
  },
  '2.3.12': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu personalisierten Verkaufspräsentationen.',
    questions: [
      {
        question: 'Wie viel Prozent der Käufer möchten laut der Präsentation personalisierte Interaktionen von Unternehmen?',
        options: [
          { id: 'A', text: '21 %' },
          { id: 'B', text: '45 %' },
          { id: 'C', text: '71 %' },
          { id: 'D', text: '99 %' },
        ],
        correctAnswer: 'C',
        hint: 'Die Zahl stammt aus einer Erhebung zu Käufererwartungen (wisernotify.com).',
      },
      {
        question: 'Wofür steht die SCQA-Methode beim Aufbau einer kundenfokussierten Agenda?',
        options: [
          { id: 'A', text: 'Sales, Contact, Quality, Action' },
          { id: 'B', text: 'Situation, Complication, Question, Answer' },
          { id: 'C', text: 'Score, Check, Quote, Approve' },
          { id: 'D', text: 'Segment, Campaign, Qualify, Analyze' },
        ],
        correctAnswer: 'B',
        hint: 'Die Methode führt von der Ausgangssituation über das Problem und die Schlüsselfrage zur Lösung.',
      },
      {
        question: 'Welcher Handlungstipp wird für den Call-to-Action am Ende einer personalisierten Präsentation genannt?',
        options: [
          { id: 'A', text: 'Immer einen generischen Satz wie „Demo anfordern" verwenden' },
          { id: 'B', text: 'Auf einen Call-to-Action ganz verzichten' },
          { id: 'C', text: 'Einen konkreten, zum Kunden passenden nächsten Schritt vorschlagen' },
          { id: 'D', text: 'Den Call-to-Action erst nach dem Termin per E-Mail nachreichen' },
        ],
        correctAnswer: 'C',
        hint: 'Ein spezifischer nächster Schritt passt besser zum Anliegen des Kunden als eine generische Aufforderung.',
      },
    ],
  },
  '2.3.13': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu Abschlusstechniken.',
    questions: [
      {
        question: 'Was ist eine Abschlusstechnik laut Definition?',
        options: [
          { id: 'A', text: 'Ein Druckmittel, um den Kunden zum Kauf zu zwingen' },
          { id: 'B', text: 'Eine gezielte Frage oder Aussage, die den Kunden aktiv zur Kaufentscheidung führt' },
          { id: 'C', text: 'Ein Rabatt, der am Ende des Gesprächs angeboten wird' },
          { id: 'D', text: 'Eine automatisierte E-Mail nach dem Gespräch' },
        ],
        correctAnswer: 'B',
        hint: 'Der richtige Moment und gutes Timing sind entscheidend – nicht Druck.',
      },
      {
        question: 'Welchen psychologischen Effekt nutzt die Abschlusstechnik der „Ja-Kette"?',
        options: [
          { id: 'A', text: 'Sie verwirrt den Kunden absichtlich' },
          { id: 'B', text: 'Mehrere kleine Zusagen im Gespräch schaffen ein psychologisches Commitment und erleichtern das finale „Ja"' },
          { id: 'C', text: 'Sie ersetzt jede weitere Bedarfsanalyse' },
          { id: 'D', text: 'Sie funktioniert nur am Telefon' },
        ],
        correctAnswer: 'B',
        hint: 'Kleine Zusagen bauen im Gesprächsverlauf ein Gefühl der Konsistenz auf.',
      },
      {
        question: 'Was solltest du direkt nach dem Stellen der Abschlussfrage tun?',
        options: [
          { id: 'A', text: 'Sofort ein neues Argument nachschieben' },
          { id: 'B', text: 'Die Stille aushalten und dem Kunden Raum zur Antwort lassen' },
          { id: 'C', text: 'Das Thema wechseln' },
          { id: 'D', text: 'Den Preis noch einmal senken' },
        ],
        correctAnswer: 'B',
        hint: 'Stille nach der Abschlussfrage ist ein einfaches, aber wirksames psychologisches Werkzeug.',
      },
    ],
  },
  '2.3.14': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu KI-Tools im Vertrieb.',
    questions: [
      {
        question: 'Wie heißt die KI, unter der HubSpot seit 2024 seine KI-Funktionen bündelt?',
        options: [
          { id: 'A', text: 'Breeze' },
          { id: 'B', text: 'Copilot' },
          { id: 'C', text: 'Gamma' },
          { id: 'D', text: 'Fathom' },
        ],
        correctAnswer: 'A',
        hint: 'Breeze umfasst unter anderem einen Assistant, Agents und Intelligence – direkt an den CRM-Daten.',
      },
      {
        question: 'Was unterscheidet einen starken von einem schwachen KI-Prompt im Vertrieb?',
        options: [
          { id: 'A', text: 'Ein starker Prompt ist immer kürzer' },
          { id: 'B', text: 'Ein starker Prompt enthält Rolle, konkrete Aufgabe und Kontext statt einer vagen Anweisung' },
          { id: 'C', text: 'Ein starker Prompt braucht keine Angaben zum Empfänger' },
          { id: 'D', text: 'Es gibt keinen Unterschied' },
        ],
        correctAnswer: 'B',
        hint: 'Vergleiche „Schreib eine Mail" mit einem Prompt, der Rolle, Empfänger und Ziel benennt.',
      },
      {
        question: 'Welche Grenze von KI wird in der Lektion explizit genannt?',
        options: [
          { id: 'A', text: 'KI kann keine Texte schreiben' },
          { id: 'B', text: 'KI kann halluzinieren – also plausibel klingende, aber falsche Fakten erfinden' },
          { id: 'C', text: 'KI funktioniert nur auf Englisch' },
          { id: 'D', text: 'KI darf laut DSGVO im Vertrieb nicht eingesetzt werden' },
        ],
        correctAnswer: 'B',
        hint: 'Ergebnisse von KI-Tools sollten deshalb immer geprüft werden.',
      },
    ],
  },
  '2.4.1': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zur Einführung in das Lead Management.',
    questions: [
      {
        question: 'In welcher Reihenfolge laufen die Phasen des Lead Managements laut der Lektion ab?',
        options: [
          { id: 'A', text: 'Scoring → Nurturing → Qualifizierung → Generierung → Übergabe → Abschluss' },
          { id: 'B', text: 'Lead-Generierung → Qualifizierung → Lead Nurturing → Scoring → Übergabe an Sales → Abschluss' },
          { id: 'C', text: 'Abschluss → Übergabe → Scoring → Nurturing → Qualifizierung → Generierung' },
          { id: 'D', text: 'Qualifizierung → Abschluss → Generierung → Scoring → Nurturing → Übergabe' },
        ],
        correctAnswer: 'B',
        hint: 'Der Prozess führt einen Lead systematisch vom ersten Kontakt bis zum zahlenden Kunden.',
      },
      {
        question: 'Wofür steht die Staffellauf-Analogie im Lead Management?',
        options: [
          { id: 'A', text: 'Der Lead ist der Staffelstab, der gezielt durch jede Station bis zum Abschluss geführt wird' },
          { id: 'B', text: 'Jeder Vertriebler arbeitet komplett unabhängig' },
          { id: 'C', text: 'Der schnellste Anruf gewinnt automatisch den Deal' },
          { id: 'D', text: 'Leads werden zufällig verteilt' },
        ],
        correctAnswer: 'A',
        hint: 'Wie beim Staffellauf übergibt eine Station den „Stab" gezielt an die nächste.',
      },
      {
        question: 'Was änderte sich im Praxisbeispiel „ACME Cloud" nach der Einführung strukturierten Lead Managements mit HubSpot?',
        options: [
          { id: 'A', text: 'Es wurden keine neuen Leads mehr generiert' },
          { id: 'B', text: 'Jeder Lead wurde zentral erfasst, automatisch bewertet und schnellstmöglich weiterbetreut' },
          { id: 'C', text: 'Das Marketing-Team wurde abgeschafft' },
          { id: 'D', text: 'Alle Leads wurden ausschließlich telefonisch bearbeitet' },
        ],
        correctAnswer: 'B',
        hint: 'Klare Phasen und Zuständigkeiten im CRM lösten den vorherigen Frust im Team ab.',
      },
    ],
  },
  '2.4.2': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zur Übergabe und Qualifizierung von Leads.',
    questions: [
      {
        question: 'Was regelt ein Service Level Agreement (SLA) zwischen Marketing und Vertrieb?',
        options: [
          { id: 'A', text: 'Ausschließlich das Gehalt der Vertriebsmitarbeitenden' },
          { id: 'B', text: 'Wer welche Leistung liefert, wann und wie – z. B. Lead-Menge und Reaktionszeit' },
          { id: 'C', text: 'Die technische Konfiguration des CRM' },
          { id: 'D', text: 'Nur die Preisgestaltung für Kunden' },
        ],
        correctAnswer: 'B',
        hint: 'Ein SLA schafft eine gemeinsame Sprache und messbare Erwartungen zwischen beiden Teams.',
      },
      {
        question: 'Was unterscheidet einen MQL von einem SQL?',
        options: [
          { id: 'A', text: 'Ein MQL ist bereits ein zahlender Kunde' },
          { id: 'B', text: 'Ein MQL passt zur Zielgruppe und zeigt Interesse, ein SQL wurde vom Vertrieb geprüft und ist bereit für den aktiven Verkaufsprozess' },
          { id: 'C', text: 'Es gibt keinen Unterschied, beide Begriffe sind austauschbar' },
          { id: 'D', text: 'Ein SQL kommt ausschließlich aus Kaltakquise' },
        ],
        correctAnswer: 'B',
        hint: 'MQL steht für Marketing Qualified Lead, SQL für Sales Qualified Lead.',
      },
      {
        question: 'Innerhalb welcher Zeit sollte laut Beispiel-SLA ein neuer MQL kontaktiert werden?',
        options: [
          { id: 'A', text: 'Innerhalb von 1 Werktag' },
          { id: 'B', text: 'Innerhalb von 1 Monat' },
          { id: 'C', text: 'Nur bei Nachfrage des Kunden' },
          { id: 'D', text: 'Es gibt keine zeitliche Vorgabe' },
        ],
        correctAnswer: 'A',
        hint: 'Eine längere Wartezeit senkt die Erfolgschance eines Kontaktversuchs drastisch.',
      },
    ],
  },
  '2.4.3': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu Lead Nurturing & segmentbezogenen Inhalten.',
    questions: [
      {
        question: 'Was ist das Ziel von Lead Nurturing?',
        options: [
          { id: 'A', text: 'Leads werden systematisch mit passenden Inhalten an die Kaufentscheidung herangeführt' },
          { id: 'B', text: 'Alle Leads erhalten sofort ein Verkaufsangebot' },
          { id: 'C', text: 'Leads werden nach dem Erstkontakt gelöscht' },
          { id: 'D', text: 'Nurturing ersetzt die Qualifizierung komplett' },
        ],
        correctAnswer: 'A',
        hint: 'Es geht darum, Vertrauen aufzubauen, bevor verkauft wird.',
      },
      {
        question: 'Welcher Inhaltstyp passt laut der Lektion zur Awareness-Phase der Buyer’s Journey?',
        options: [
          { id: 'A', text: 'Case Studies und Vertragsangebote' },
          { id: 'B', text: 'Edukative Inhalte wie Blogartikel, Infografiken und Whitepaper' },
          { id: 'C', text: 'Ausschließlich Rabattaktionen' },
          { id: 'D', text: 'Persönliche Vertragsverhandlungen' },
        ],
        correctAnswer: 'B',
        hint: 'In der Awareness-Phase sucht der Lead allgemeine Informationen zu seinem Problem.',
      },
      {
        question: 'Was passiert laut der Lektion, wenn Leads nicht genurturt werden?',
        options: [
          { id: 'A', text: 'Sie konvertieren garantiert trotzdem' },
          { id: 'B', text: 'Bis zu 80 % der Leads konvertieren nie, wenn keine weitere Betreuung erfolgt' },
          { id: 'C', text: 'Sie werden automatisch zu SQLs' },
          { id: 'D', text: 'Es gibt keinen messbaren Effekt' },
        ],
        correctAnswer: 'B',
        hint: 'Ohne Nurturing „versanden" viele Interessenten – ein großer Verlust an Potenzial.',
      },
    ],
  },
  '2.4.4': {
    title: 'Wissenscheck',
    intro: 'Teste dein Wissen zu Lead Scoring in HubSpot.',
    questions: [
      {
        question: 'Wonach bewertet Lead Scoring einen Lead?',
        options: [
          { id: 'A', text: 'Ausschließlich nach dem Zufallsprinzip' },
          { id: 'B', text: 'Objektiv nach Profil und Verhalten' },
          { id: 'C', text: 'Nur nach der Unternehmensgröße' },
          { id: 'D', text: 'Nur nach dem Bauchgefühl des Vertrieblers' },
        ],
        correctAnswer: 'B',
        hint: 'Demografische Merkmale und Verhalten/Engagement ergeben zusammen den Score.',
      },
      {
        question: 'Wie viel mehr ROI erzielen Unternehmen mit Lead Scoring laut der Lektion im Schnitt bei der Lead-Generierung?',
        options: [
          { id: 'A', text: '10 %' },
          { id: 'B', text: '35 %' },
          { id: 'C', text: '77 %' },
          { id: 'D', text: '150 %' },
        ],
        correctAnswer: 'C',
        hint: 'Die Zahl wird direkt als Beleg genannt, warum sich Lead Scoring lohnt.',
      },
      {
        question: 'Wie lässt sich Lead-Priorisierung in HubSpot Free/Starter näherungsweise umsetzen, obwohl kein automatisches Scoring verfügbar ist?',
        options: [
          { id: 'A', text: 'Gar nicht – Free/Starter bietet keine Möglichkeit zur Priorisierung' },
          { id: 'B', text: 'Über aktive Listen und gespeicherte Filter, z. B. „3+ Seitenbesuche & Branche X"' },
          { id: 'C', text: 'Durch ein verpflichtendes Upgrade auf Enterprise' },
          { id: 'D', text: 'Durch tägliches manuelles Neu-Sortieren aller Kontakte' },
        ],
        correctAnswer: 'B',
        hint: 'Das ist der genannte Workaround, bevor ein Upgrade auf HubSpot Pro sinnvoll wird.',
      },
    ],
  },
};
