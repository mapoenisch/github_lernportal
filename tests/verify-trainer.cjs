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
  let focused = null;
  const focusedElement = id => ({ focus() { focused = id; }, setAttribute() {} });
  const window = { addEventListener: (event, fn) => { events[event] = fn; }, scrollTo() {} };
  const box = { innerHTML: '' };
  const toastClasses = new Set();
  const notice = { classList: {
    add: name => toastClasses.add(name), remove: name => toastClasses.delete(name), contains: name => toastClasses.has(name),
  } };
  const ctx = vm.createContext({
    window, console, location, URLSearchParams,
    localStorage: { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = v; } },
    document: { getElementById: id => {
        if (id === 'app') return box;
        if (id === 'main') return { ...focusedElement(id), insertAdjacentHTML(_, html) { box.innerHTML += html; } };
        return box.innerHTML.includes('id="' + id + '"') ? focusedElement(id) : null;
      },
      addEventListener: (event, fn) => { events[event] = fn; },
      querySelector: sel => sel === '.toast' ? notice : null, querySelectorAll: () => [] },
    FileReader: class { readAsText(text) { this.result = text; this.onload(); } },
    setTimeout: (fn, wait) => setTimeout(fn, wait).unref(), clearTimeout,
  });
  vm.runInContext(dataSource, ctx);
  vm.runInContext(appSource, ctx);
  return { ctx, box, notice, events, state: window.ZT.state,
    click: (action, data) => events.click({ target: { closest: () => ({ dataset: { action, ...data } }) } }),
    importFile: text => events.change({ target: { dataset: { action: 'import' }, files: [text] } }),
    typeNotes: value => events.input({ target: { id: 'notes', dataset: {}, value } }),
    change: (action, attrs = {}, dataset = {}) => events.change({ target: { ...attrs, dataset: { action, ...dataset } } }),
    focused: () => focused,
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
const today = new Date(ZT.todayStr() + 'T12:00');
const iso = d => [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
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
open.importFile(state());
open.click('confirm-no');
assert.equal(saved[key], valid);
open.importFile(state());
open.click('confirm-yes');
assert.equal(saved[key + '.backup'], valid);
assert.match(open.box.innerHTML, /data-action="import"/);

const damaged = { [key]: invalid, [key + '.backup']: valid };
const recovery = trainer(damaged);
assert.match(recovery.box.innerHTML, /Sicherung wiederherstellen/);
assert.equal(damaged[key + '.corrupt'], invalid);
recovery.click('restore');
recovery.click('confirm-yes');
assert.equal(damaged[key], valid);
assert.match(recovery.box.innerHTML, /Fragen &amp; Übungen/);

const shared = { [key]: valid };
const first = trainer(shared);
const second = trainer(shared);
first.click('lesson', { id: ZT.PLAN[0].id });
first.click('dunno');
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

// Frühere Durchläufe bleiben bis zur bestätigten Auswahl vollständig erhalten.
const oldRun = { ...storedRun, endedAt: day(0) };
const oldStorage = { [key]: state([oldRun]) };
const oldTrainer = trainer(oldStorage);
assert.match(oldTrainer.box.innerHTML, /Lernstand exportieren/);
assert.match(oldTrainer.box.innerHTML, /Aus Browser entfernen/);
oldTrainer.click('delete-run', { id: oldRun.id });
oldTrainer.click('confirm-no');
assert.equal(oldTrainer.state().runs.length, 1);
oldTrainer.click('delete-run', { id: oldRun.id });
oldTrainer.click('confirm-yes');
assert.equal(JSON.parse(oldStorage[key]).runs.length, 0);
assert.ok(D.terms.find(t => t.nr === 17).crit.length > 1);
for (const nr of [57, 78]) assert.ok(D.terms.find(t => t.nr === nr).conf.length > 0);


// Vollständig abgehakte, geratene Antworten bleiben Übung, auch nach Neuladen.
const guessStorage = {};
const guessed = trainer(guessStorage);
guessed.click('start', { mode: 'adaptiv' });
assert.equal((guessed.box.innerHTML.match(/class="day(?: day--today)?"/g) || []).length, 21);
assert.match(guessed.box.innerHTML, /L1 · Abrufen[\s\S]+L2 · Lücken und Anwendung/);
assert.match(guessed.box.innerHTML, /einmal vollständig/);
guessed.click('lesson', { id: 'slot1' });
const guessRun = () => guessed.state().runs[0];
const guessTerm = D.terms.find(t => t.nr === guessRun().session.tasks[0].nr);
guessed.click('check');
guessed.click('save');
assert.match(guessed.notice.textContent || '', /^$/);
assert.ok(guessRun().session.ui.confirmEmpty);
guessTerm.crit.forEach((_, i) => guessed.change('mark', { checked: true }, { nr: guessTerm.nr, i }));
guessed.change('guess', { checked: true });
guessed.ctx.window.ZT.render();
assert.match(guessed.box.innerHTML, /Ergebnis: geraten\. Zählt als Übung\./);
assert.doesNotMatch(guessed.box.innerHTML, /Ergebnis: vollständig/);
guessed.click('save');
assert.deepEqual([guessRun().log[0].res, guessRun().log[0].indep], ['geraten', false]);
assert.deepEqual([guessRun().session.results[0].res, guessRun().session.results[0].indep], ['geraten', false]);
assert.equal(ZT.analyze(guessRun()).get(guessTerm.nr).status, 'ungeprueft');
assert.match(trainer(guessStorage).box.innerHTML, /1 geraten, 0 unvollständig/);
guessed.click('dunno');
guessed.click('save');
assert.match(guessed.box.innerHTML, /Korrektur überspringen/);
guessed.click('next');
while (!guessRun().session.over) {
  guessed.click('dunno');
  guessed.click('save');
  guessed.click('next');
}
assert.match(guessed.box.innerHTML, /<h2 class="mono-l">Geraten<\/h2>/);
assert.match(guessed.box.innerHTML, /1 Antwort als Übung gespeichert/);
guessed.click('leave');
guessed.click('tab', { tab: 'begriffe' });
guessed.click('catgroup', { cat: '1' });
guessed.click('catgroup', { cat: '2' });
assert.match(guessed.box.innerHTML, /data-cat="1" aria-expanded="true"/);
assert.match(guessed.box.innerHTML, /data-cat="2" aria-expanded="true"/);

// Tab-Konflikt nach einem Tastendruck und zwischen zwei Bewertungen.
const conflictStorage = {};
const original = trainer(conflictStorage);
original.click('start', { mode: 'adaptiv' });
original.click('lesson', { id: 'slot1' });
const competing = trainer(conflictStorage);
original.typeNotes('Lokaler Entwurf mit <Text>');
competing.typeNotes('Text aus Tab zwei');
competing.click('check');
original.events.storage({ key });
assert.match(original.box.innerHTML, /Lokaler Entwurf mit &lt;Text&gt;/);
assert.match(original.box.innerHTML, /Entwurf in dieser Aufgabe übernehmen/);
assert.equal(original.focused(), 'conflict-title');
original.click('restore-draft');
assert.equal(original.state().runs[0].session.ui.notes, 'Lokaler Entwurf mit <Text>');
assert.equal(original.focused(), 'qtext');
original.click('check');
competing.events.storage({ key });
competing.click('dunno');
competing.click('save');
competing.click('next');
const conflictTerm = original.state().runs[0].session.tasks[0].nr;
original.change('mark', { checked: true }, { nr: conflictTerm, i: 0 });
assert.match(original.box.innerHTML, /abgehakt:/);
assert.doesNotMatch(original.box.innerHTML, /Entwurf in dieser Aufgabe übernehmen/);
assert.equal(original.state().runs[0].log.length, 1);
assert.equal(original.focused(), 'conflict-title');

// Ein fehlgeschlagener Schreibzugriff darf beim Wiederholen keinen Versuch verdoppeln.
let rejectWrite = false;
const retryStore = new Proxy({}, {
  set(target, key, value) {
    if (rejectWrite) throw new Error('Test: Speicher voll');
    target[key] = value;
    return true;
  },
});
const retry = trainer(retryStore);
retry.click('start', { mode: 'adaptiv' });
retry.click('lesson', { id: 'slot1' });
retry.click('dunno');
rejectWrite = true;
retry.click('save');
assert.equal(retry.state().runs[0].log.length, 0);
assert.match(retry.box.innerHTML, /Ergebnis speichern/);
rejectWrite = false;
retry.click('save');
assert.equal(retry.state().runs[0].log.length, 1);

// Alte Sicherungen tragen das Rate-Merkmal separat neben dem ursprünglichen Ergebnis.
const legacyGuess = { ...run, log: [e(day(-2), 'voll', { indep: false, guess: true })] };
assert.equal(ZT.analyze(legacyGuess).get(39).status, 'ungeprueft');

console.log('Zertifizierungstrainer: 139 Begriffe, 598 Fragen, Lernregeln, Import, Wiederherstellung, Rate-Status, Tagesvorschau, Tab-Konflikte, fehlgeschlagene Schreibzugriffe und Zeitreise geprüft.');
