Primary action button in the DBA style — deep-teal fill, Archivo 700 label, 11px radius, hover-lift with a soft shadow.

```jsx
<Button onClick={next}>Als erledigt markieren</Button>
<Button variant="secondary" icon="→">Nächste Lektion</Button>
<Button variant="resource" icon="↗" href="infografik.html">SMARKETING · Die perfekte Pipeline</Button>
```

Variants: `primary` (deep-teal `#123E45`), `secondary` (slate `#33415C`), `resource` (slate bar with a mint icon tile, for opening supporting material). Sizes `sm | md | lg`. Pass `href` to render an anchor.
