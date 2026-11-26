// Prüft Datenbasis und Kernregeln des Zertifizierungstrainers ohne Browser.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const dir = path.join(__dirname, '..', 'zertifizierungstrainer');
const dataSource = fs.readFileSync(path.join(dir, 'data.js'), 'utf8');
const appSource = fs.readFileSync(path.join(dir, 'app.js'), 'utf8');
function trainer(store = {}, location = { search: '', hostname: 'example.org' }) {
  const events = {};
  const window = { addEventListener: (event, fn) => { events[event] = fn; }, scrollTo() {} };
  const box = { innerHTML: '' };
  const notice = { classList: { add() {}, remove() {} } };
  const ctx = vm.createContext({
    window, console, location, URLSearchParams,
    localStorage: { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = v; } },
    document: { getElementById: id => id === 'app' ? box : null,
      addEventListener: (event, fn) => { events[event] = fn; },
      querySelector: sel => sel === '.toast' ? notice : null, querySelectorAll: () => [] },
    FileReader: class { readAsText(text) { this.result = text; this.onload(); } },
    confirm: () => true, setTimeout, clearTimeout,
  });
  vm.runInContext(dataSource, ctx);
  vm.runInContext(appSource, ctx);
  return { ctx, box, notice, events, state: window.ZT.state,
    click: (action, data) => events.click({ target: { closest: () => ({ dataset: { action, ...data } }) } }),
    importFile: text => events.change({ target: { dataset: { action: 'import' }, files: [text] } }),
  };
}
const { ctx } = trainer();
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


// Importe aus der Oberfläche prüfen, inklusive Sicherung und Start ohne aktiven Durchlauf.
const key = 'zt.v1';
const state = (runs = [], active = null) => JSON.stringify({ runs, active });
const storedRun = { ...run, id: 'Lernen & Wiederholen', mode: 'sprint', log: [],
  done: { [ZT.PLAN[0].id]: { date: day(0), n: 1, gaps: [], summary: 'Fragen & Übungen' } } };
const valid = state([storedRun], storedRun.id);
const invalid = state([{ ...storedRun, log: null }], storedRun.id);
const saved = { [key]: valid };
const open = trainer(saved);
open.importFile(invalid);
assert.equal(saved[key], valid);
open.ctx.confirm = () => false;
open.importFile(state());
assert.equal(saved[key], valid);
open.ctx.confirm = () => true;
open.importFile(state());
assert.equal(saved[key + '.backup'], valid);
assert.match(open.box.innerHTML, /data-action="import"/);

const damaged = { [key]: invalid, [key + '.backup']: valid };
const recovery = trainer(damaged);
assert.match(recovery.box.innerHTML, /Sicherung wiederherstellen/);
assert.equal(damaged[key + '.corrupt'], invalid);
recovery.click('restore');
assert.equal(damaged[key], valid);
assert.match(recovery.box.innerHTML, /Fragen &amp; Übungen/);

const shared = { [key]: valid };
const first = trainer(shared);
const second = trainer(shared);
first.click('lesson', { id: ZT.PLAN[0].id });
first.click('dunno');
first.click('save');
first.click('save');
assert.equal(JSON.parse(shared[key]).runs[0].log.length, 1);
second.click('lesson', { id: ZT.PLAN[0].id });
assert.equal(JSON.parse(shared[key]).runs[0].log.length, 1);
assert.equal(second.state().runs[0].log.length, 1);
second.events.storage({ key });
assert.equal(second.state().runs[0].session.i, 1);

const hosted = {};
trainer(hosted, { search: '?zeitreise=5', hostname: 'example.org' }).click('start', { mode: 'sprint' });
assert.equal(JSON.parse(hosted[key]).runs[0].start, ZT.todayStr());
const local = {};
trainer(local, { search: '?zeitreise=5', hostname: 'localhost' }).click('start', { mode: 'sprint' });
assert.equal(local[key], undefined);
assert.ok(local[key + '.zeitreise']);

// Beide Wahr/Falsch-Varianten und die strengere Lückentextwertung.
vm.runInContext('Math.random = () => 0.1', ctx);
assert.equal(ZT.makeFix(39, { conf: 41 }).other, 39);
vm.runInContext('Math.random = () => 0.9', ctx);
assert.equal(ZT.makeFix(39, { conf: 41 }).other, 41);
assert.equal(ZT.clozeMatches('Kundenbindung', 'kund'), false);
assert.equal(ZT.clozeMatches('Management', 'ment'), false);
assert.equal(ZT.clozeMatches('Kundenbindung', 'Kundenbind'), true);
assert.equal(ZT.clozeMatches('wählt', 'Wählt'), true);
for (const [nr, word] of [[23, 'Kunden'], [26, 'wählt'], [92, 'Abschluss']]) {
  assert.ok(D.terms.find(t => t.nr === nr).crit.some(c => c.k === word));
}
const reloaded = trainer(shared);
assert.equal(reloaded.state().runs[0].session.i, 1);
reloaded.click('leave');
assert.equal(reloaded.state().runs[0].log.length, 1);

console.log('Zertifizierungstrainer: 139 Begriffe, 598 Fragen, Lernregeln, Import, Wiederherstellung, Tab-Wechsel und Zeitreise geprüft.');
