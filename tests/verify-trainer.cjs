// Prüft Datenbasis und Kernregeln des Zertifizierungstrainers ohne Browser.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const dir = path.join(__dirname, '..', 'zertifizierungstrainer');
const store = {};
const ctx = {
  window: {}, console,
  localStorage: { getItem: k => store[k] || null, setItem: (k, v) => { store[k] = v; } },
  location: { search: '' }, URLSearchParams,
  document: { getElementById: () => ({ set innerHTML(v) {} }), addEventListener: () => {}, querySelector: () => null, querySelectorAll: () => [] },
  confirm: () => true, setTimeout, clearTimeout,
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(dir, 'data.js'), 'utf8'), ctx);
const D = ctx.window.ZT_DATA;

// Umfang: genau Nr. 1–139, nichts ab 140
assert.strictEqual(D.terms.length, 139);
assert.strictEqual(D.terms.map(t => t.nr).join(), Array.from({ length: 139 }, (_, i) => i + 1).join());
D.questions.forEach(q => q.terms.forEach(nr => assert.ok(nr >= 1 && nr <= 139, q.id)));
// Bestand laut Konzept: 141 Fragen aus der Excel, davon die Zusatzfragen zu Nr. 1 und Nr. 27
assert.strictEqual(D.meta.counts.bestand, 141);
assert.ok(D.questions.some(q => q.ref === 'A27') && D.questions.some(q => q.ref === 'A28'));
// Jeder Begriff hat mindestens drei offene Definitionsfragen und Pflichtmerkmale mit Lücke
D.terms.forEach(t => {
  const defs = D.questions.filter(q => q.fn === 'def' && q.terms.length === 1 && q.terms[0] === t.nr);
  assert.ok(defs.length >= 3, 'Varianten ' + t.nr);
  assert.strictEqual(new Set(defs.map(q => q.text)).size, defs.length, 'doppelter Wortlaut ' + t.nr);
  assert.ok(t.crit.length >= 1 && t.crit.every(c => c.t.includes(c.k)), 'Merkmale ' + t.nr);
});
// Sprint-Gruppen: 9 × 14 + 13, jeder Begriff genau einmal
const all = Object.values(D.groups).flat();
assert.strictEqual(all.length, 139); assert.strictEqual(new Set(all).size, 139);

// App laden und Regeln prüfen
vm.runInContext(fs.readFileSync(path.join(dir, 'app.js'), 'utf8'), ctx);
const ZT = ctx.window.ZT;
const today = new Date(); const iso = d => d.toISOString().slice(0, 10);
const day = n => { const d = new Date(today); d.setDate(d.getDate() + n); return iso(d); };
const run = { id: 't', mode: 'adaptiv', start: day(-10), log: [], done: {}, lastQ: { 39: 'r39-1' }, seen: {} };
// Wiederabfrage nie mit der zuletzt gestellten Frage
for (let i = 0; i < 20; i++) assert.notStrictEqual(ZT.pickQuestion(run, 39, {}).id, 'r39-1');
// Bestätigung: zwei vollständige Nachweise mit mindestens drei Tagen Abstand
const e = (d, res, extra) => Object.assign({ d, day: 1, qid: 'r39-1', nr: 39, fn: 'def', kind: 'wdh', res, miss: [], indep: true }, extra);
run.log = [e(day(-6), 'voll'), e(day(-2), 'voll')];
assert.strictEqual(ZT.analyze(run).get(39).status, 'bestaetigt');
run.log = [e(day(-6), 'voll'), e(day(-5), 'voll')];
assert.strictEqual(ZT.analyze(run).get(39).status, 'einmal');
// Übung nach Hinweis zählt nicht als Nachweis
run.log = [e(day(-6), 'voll'), e(day(-1), 'voll', { indep: false, assisted: true })];
assert.strictEqual(ZT.analyze(run).get(39).status, 'einmal');
// Bestätigter Begriff wird wieder falsch erklärt: Status reagiert
run.log = [e(day(-9), 'voll'), e(day(-5), 'voll'), e(day(-1), 'falsch')];
const a = ZT.analyze(run).get(39);
assert.strictEqual(a.status, 'unsicher'); assert.ok(a.reset);
// Vergleichsfrage: zwei Begriffe, je eigene Bewertung (eigene Merkmale)
const v = D.questions.find(q => q.fn === 'abgr' && q.terms.includes(39) && q.terms.includes(41));
assert.ok(v, 'Vergleichsfrage Lead Scoring / Lead Nurturing');

console.log('Zertifizierungstrainer: 139 Begriffe, ' + D.questions.length + ' Fragen, Varianten-, Bestätigungs- und Rücksetzregeln geprüft.');
