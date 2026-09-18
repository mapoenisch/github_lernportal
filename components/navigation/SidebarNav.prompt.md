The dark, full-height course navigator from the Lernportal — brand tile on top, a collapsible module → group → lesson tree, and a progress footer. Active lesson gets a coral inset stripe; completed lessons show a coral ✓.

```jsx
<SidebarNav
  activeId="1.3.1"
  completed={{ '1.1.1': true, '1.1.2': true }}
  onSelect={id => goTo(id)}
  modules={[
    { label:'Modul 1', weeks:'Woche 1–5', title:'Grundlagen des digitalen Vertriebs', groups:[
      { id:'1.1', code:'1.1', title:'Einführung & Sales Development', lessons:[
        { id:'1.1.1', title:'Einführung & Kennenlernen' },
        { id:'1.1.2', title:'SaaS & Tech-Ökosystem' },
      ] },
    ] },
  ]}
/>
```

Controlled: it owns only group open/close state; pass `activeId`, `completed` and `onSelect`. Fixed 320px wide — place it as the first flex child of a full-height row.
