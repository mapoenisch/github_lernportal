Groups a process into role "swimlanes" — each lane has a tinted header (badge + role + range) and its steps in a row; lanes stack with ↓ between them. Use when steps belong to distinct owners or phases.

```jsx
<PhaseLane groups={[
  { abbr:'SDR', role:'Sales Development Representative', range:'Phase 1–3', tone:'teal', steps:[
    { num:'01', title:'Prospecting', text:'Potenzielle Kunden identifizieren.' },
    { num:'02', title:'Qualification' }, { num:'03', title:'Discovery' } ] },
  { abbr:'AE', role:'Account Executive', range:'Phase 4–6', tone:'slate', steps:[ /* … */ ] },
  { abbr:'CSM', role:'Customer Success Manager', range:'Phase 7–8', tone:'plum', steps:[ /* … */ ] },
]} />
```

Give each lane a different `tone` so ownership reads at a glance.
