The signature DBA diagram: numbered step cards laid out as a continuous snake — arrows connect every step, wrapping rows reverse direction so the path never breaks.

```jsx
<ProcessFlow cols={4} tone="teal" steps={[
  { num:'01', title:'Prospecting', text:'Potenzielle Kunden identifizieren.' },
  { num:'02', title:'Qualification', text:'Passgenauigkeit bewerten.' },
  /* … up to 8 */
]} />
```

Use for any ordered, non-cyclical process (the 8-step B2B sales process, "In 8 Schritten zum Growth Mindset", Verkaufsführung). For cyclical processes use `Cycle`; for narrowing stages use `Funnel`.
