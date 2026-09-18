A circular process: nodes sit clockwise on a dashed ring, ▶ chevrons mark progression, and a ↻ + label anchor the centre. Use for loops that repeat.

```jsx
<Cycle center="25 min + 5 min" steps={[
  { num:'01', title:'Aufgabe wählen', text:'Konkret notieren.' },
  { num:'02', title:'25 Minuten Fokus' },
  { num:'03', title:'5 Minuten Pause' },
  { num:'04', title:'Wiederholen' },
]} />
```

Best with 3–6 steps. For a one-directional process use `ProcessFlow` instead.
