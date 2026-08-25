The workhorse content card — 16px radius, warm hairline, white or tinted. Optional numbered tile and eyebrow.

```jsx
<Card title="Definition" tone="teal">Semi-fiktive Profile deiner idealen Kunden.</Card>
<Card num="01" title="Prospecting">Potenzielle Kunden identifizieren.</Card>
<Card tone="dark" title="Zeithorizont">B2B-Kunden streben langfristige Partnerschaften an.</Card>
```

Tones: `default` (white), `teal` (tint), `accent` (warm tint), `dark` (deep-teal, light text). Lay several out in a CSS grid with `gap: var(--gap-card)`.
