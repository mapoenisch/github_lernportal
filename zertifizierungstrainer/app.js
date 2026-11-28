/* Zertifizierungstrainer · eine App, zwei Planungslogiken (7‑Tage‑Sprint, adaptiver 3‑Wochen‑Trainer). */
(function () {
  'use strict';

  const D = window.ZT_DATA;
  const TERMS = D.terms;
  const TERM = new Map(TERMS.map(t => [t.nr, t]));
  const Q = new Map(D.questions.map(q => [q.id, q]));
  const QBY = new Map(TERMS.map(t => [t.nr, []]));
  D.questions.forEach(q => q.terms.forEach(nr => QBY.get(nr).push(q)));

  const MODES = {
    sprint: { name: '7‑Tage‑Sprint', days: 7, gap: 2 },
    adaptiv: { name: '3‑Wochen‑Trainer', days: 21, gap: 3 },
  };
  const RES = { voll: 'vollständig', teil: 'teilweise', falsch: 'falsch / nicht abrufbar', geraten: 'geraten' };
  const KIND = { erst: 'Erstabruf', wdh: 'Wiederholung', luecke: 'Lückencheck', pruef: 'Prüfungsstil', uebung: 'Übung' };

  // Zeitreise nur auf Loopback und mit eigenem, vom Lernstand getrennten Speicher.
  const params = new URLSearchParams(location.search);
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  const offset = local ? Number(params.get('zeitreise')) : 0;
  const timeOffset = Number.isInteger(offset) && Math.abs(offset) <= 365 ? offset : 0;
  const KEY = 'zt.v1' + (timeOffset ? '.zeitreise' : '');

  const isGuess = x => x.guess || x.res === 'geraten';
  const resultLabel = x => isGuess(x) ? RES.geraten : RES[x.res];

  /* ---------- Speicher ---------- */
  const empty = () => ({ runs: [], active: null });
  const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
  const text = v => typeof v === 'string';
  const date = v => text(v) && /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(v)) &&
    new Date(v).toISOString().slice(0, 10) === v;
  const number = v => Number.isSafeInteger(v);
  const list = (v, check) => Array.isArray(v) && v.every(check);
  const lessonId = v => text(v) && /^(s[1-7][12]|a-?\d+(l[12]|x\d+)|g\d+)$/.test(v);
  const knownTerm = nr => TERM.has(nr);
  const question = id => Q.has(id);
  const optionalFlag = v => v == null || typeof v === 'boolean';
  const indices = (v, nr) => list(v, i => number(i) && i >= 0 && i < TERM.get(nr).crit.length);
  const result = v => object(v) && knownTerm(v.nr) && Object.hasOwn(RES, v.res) &&
    (v.miss == null || indices(v.miss, v.nr)) && (v.conf == null || knownTerm(v.conf)) &&
    optionalFlag(v.indep) && optionalFlag(v.guess);
  const entry = e => result(e) && date(e.d) && number(e.day) && question(e.qid) &&
    Q.get(e.qid).terms.includes(e.nr) && e.fn === Q.get(e.qid).fn && Object.hasOwn(KIND, e.kind) &&
    optionalFlag(e.assisted);
  const taskValid = t => object(t) && question(t.qid) && knownTerm(t.nr) &&
    list(t.terms, knownTerm) && t.terms.join() === Q.get(t.qid).terms.join() &&
    t.terms.includes(t.nr) && Object.hasOwn(KIND, t.kind) && optionalFlag(t.assisted);

  function fixValid(f, t) {
    if (!object(f) || !t.terms.includes(f.nr) || !optionalFlag(f.done) || !optionalFlag(f.ok)) return false;
    if (f.type === 'tf') return knownTerm(f.other);
    if (f.type === 'cloze') return indices([f.i], f.nr) && (f.value == null || text(f.value));
    return f.type === 'choice' && list(f.opts, knownTerm) && f.opts.includes(f.nr) &&
      (!f.done || (number(f.pick) && knownTerm(f.opts[f.pick])));
  }

  function sessionValid(l, mode) {
    if (!object(l) || l.mode !== mode || !lessonId(l.id) || !text(l.title) ||
        !list(l.tasks, taskValid) || !list(l.results, x => x === null || result(x)) ||
        !number(l.i) || l.i < 0 || l.i > l.tasks.length || l.results.length > l.tasks.length ||
        !['pflicht', 'luecke'].includes(l.phase) || !optionalFlag(l.over) || !optionalFlag(l.paused) ||
        !list(l.gleis, g => Object.hasOwn(D.groups, g)) ||
        (l.held != null && !list(l.held, h => object(h) && knownTerm(h.nr) && date(h.from))) ||
        (l.extra != null && !['fix', 'luecke', 'vergleich', 'nachpruef', 'pruefcheck'].includes(l.extra)) ||
        (l.extraCap != null && (!number(l.extraCap) || l.extraCap < 0)) ||
        (l.extraGroups != null && !list(l.extraGroups, g => Object.hasOwn(D.groups, g))) ||
        (l.pflichtN != null && (!number(l.pflichtN) || l.pflichtN < 0 || l.pflichtN > l.tasks.length))) return false;
    const t = l.tasks[l.i];
    if (!t || l.over || l.ui == null) return true;
    const u = l.ui;
    return object(u) && ['ask', 'rate', 'fix'].includes(u.stage) && text(u.notes) && object(u.marks) &&
      t.terms.every(nr => {
        const mark = u.marks[nr];
        return object(mark) && object(mark.has) && optionalFlag(mark.contra) &&
          (mark.conf === '' || TERM.get(nr).conf.some(other => String(other) === mark.conf));
      }) && (u.stage !== 'fix' || fixValid(u.fix, t));
  }

  function parseState(raw) {
    if (raw === null) return empty();
    try {
      const s = JSON.parse(raw);
      const validRun = r => object(r) && text(r.id) && r.id.length > 0 && Object.hasOwn(MODES, r.mode) &&
        date(r.start) && (r.endedAt == null || date(r.endedAt)) && list(r.log, entry) &&
        object(r.done) && Object.entries(r.done).every(([id, d]) => lessonId(id) && object(d) && date(d.date) &&
          number(d.n) && d.n >= 0 && text(d.summary) && list(d.gaps, knownTerm)) &&
        object(r.lastQ) && Object.values(r.lastQ).every(question) &&
        object(r.seen) && Object.values(r.seen).every(v => v === true) &&
        (r.session == null || sessionValid(r.session, r.mode));
      if (!object(s) || !list(s.runs, validRun) || new Set(s.runs.map(r => r.id)).size !== s.runs.length ||
          (s.active !== null && !s.runs.some(r => r.id === s.active))) return null;
      return { runs: s.runs, active: s.active };
    } catch {
      return null;
    }
  }

  function read(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }
  let snapshot = read(KEY);
  let S = parseState(snapshot);
  let storageCorrupt = !S;
  if (storageCorrupt) rememberCorrupt();
  S ||= empty();

  function rememberCorrupt() {
    if (snapshot === null || read(KEY + '.corrupt') === snapshot) return;
    try { localStorage.setItem(KEY + '.corrupt', snapshot); } catch { /* Der Stand bleibt unter KEY erhalten. */ }
  }

  function save(next = S, backup = false, draft = null) {
    try {
      if (localStorage.getItem(KEY) !== snapshot) {
        refresh(true, draft || currentDraft(true));
        return false;
      }
      if (backup && snapshot !== null && !storageCorrupt) localStorage.setItem(KEY + '.backup', snapshot);
      if (storageCorrupt && snapshot !== null) localStorage.setItem(KEY + '.corrupt', snapshot);
      const raw = JSON.stringify(next);
      localStorage.setItem(KEY, raw);
      snapshot = raw;
      return true;
    } catch {
      const unsaved = draft || currentDraft(true);
      const previous = parseState(snapshot);
      if (previous && next === S) {
        S = previous;
        ui = run()?.session?.ui || {};
        if (unsaved && canRestoreDraft(unsaved)) run().session.ui = ui = unsaved.ui;
        lastUndo = null;
        render(true);
      }
      toast('Speichern fehlgeschlagen. Prüfe, ob Browserspeicher verfügbar ist.');
      return false;
    }
  }
  const run = () => S.runs.find(r => r.id === S.active) || null;

  /* ---------- Datum ---------- */
  function todayStr() {
    const d = new Date();
    d.setDate(d.getDate() + timeOffset);
    return iso(d);
  }
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function diffDays(a, b) { return Math.round((Date.parse(b + 'T12:00') - Date.parse(a + 'T12:00')) / 864e5); }
  function addDays(a, n) { const d = new Date(a + 'T12:00'); d.setDate(d.getDate() + n); return iso(d); }
  const dayOf = (r, date) => diffDays(r.start, date || todayStr()) + 1;
  function fmtDate(s) { const [y, m, d] = s.split('-'); return d + '.' + m + '.'; }
  const WD = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  function wd(s) { return WD[new Date(s + 'T12:00').getDay()]; }

  /* ---------- Hilfen ---------- */
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const plural = (n, one, many) => n + ' ' + (n === 1 ? one : many);
  function shuffle(a, seed) {
    const x = a.slice(); let s = seed || 1;
    for (let i = x.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor(s / 233280 * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; }
    return x;
  }
  const ICON = {
    back: '<svg class="ic" viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4 6.5 10l6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square"/></svg>',
    go: '<svg class="ic" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M10.5 5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square"/></svg>',
    down: '<svg class="ic ic--turn" viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square"/></svg>',
    check: '<svg class="ic" viewBox="0 0 20 20" aria-hidden="true"><path d="m4 10.5 4 4 8-9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="square"/></svg>',
  };

  /* ---------- Lernstand je Begriff ---------- */
  // Unabhängiger Nachweis: offen, ohne Hilfe, Definition oder Abgrenzung, erster solcher Versuch des Tages.
  function analyze(r) {
    const gap = MODES[r.mode].gap;
    const today = todayStr();
    const out = new Map();
    TERMS.forEach(t => out.set(t.nr, {
      nr: t.nr, status: 'ungeprueft', indep: [], first: null, second: null, confirmed: null, shortened: false,
      reset: false, wrong: 0, lastRes: null, due: null, practice: 0, anw: [], miss: {}, conf: {},
    }));
    r.log.forEach(e => {
      const a = out.get(e.nr);
      if (e.fn === 'anw') { a.anw.push(isGuess(e) ? 'geraten' : e.res); return; }
      if (!e.indep || isGuess(e)) { a.practice++; return; }
      a.indep.push(e);
      if (e.res !== 'voll') a.wrong++;
      (e.miss || []).forEach(i => { a.miss[i] = (a.miss[i] || 0) + 1; });
      if (e.conf) a.conf[e.conf] = (a.conf[e.conf] || 0) + 1;
    });
    out.forEach(a => {
      if (!a.indep.length) return;
      a.first = a.indep[0];
      a.second = a.indep.find(e => e.d > a.first.d) || null;
      let streakStart = null, confirmed = null, shortened = false, reset = false;
      a.indep.forEach(e => {
        if (e.res === 'voll') {
          if (confirmed) return;
          if (!streakStart) { streakStart = e; return; }
          const g = diffDays(streakStart.d, e.d);
          if (g >= gap) { confirmed = e; shortened = false; }
          else if (r.mode === 'sprint' && g >= 1 && dayOf(r, e.d) >= 7) { confirmed = e; shortened = true; }
        } else {
          if (confirmed) reset = true;
          confirmed = null; streakStart = null;
        }
      });
      const last = a.indep[a.indep.length - 1];
      a.lastRes = last.res; a.confirmed = confirmed; a.shortened = shortened; a.reset = reset;
      if (confirmed) a.status = 'bestaetigt';
      else if (last.res === 'voll') a.status = 'einmal';
      else a.status = 'unsicher';
      if (confirmed) a.due = addDays(confirmed.d, 6);
      else if (last.res === 'voll') a.due = addDays(streakStart ? streakStart.d : last.d, gap);
      else a.due = addDays(last.d, 1);
      a.dueDays = diffDays(a.due, today);
      a.todayIndep = a.indep.some(e => e.d === today);
    });
    return out;
  }
  const STATUS = {
    ungeprueft: 'noch kein eigener Abruf', unsicher: 'unsicher', einmal: 'einmal vollständig', bestaetigt: 'bestätigt',
  };

  function stats(r, A) {
    const c = { ungeprueft: 0, unsicher: 0, einmal: 0, bestaetigt: 0 };
    A.forEach(a => c[a.status]++);
    c.geprueft = TERMS.length - c.ungeprueft;
    return c;
  }

  /* ---------- Fragenauswahl: jede Wiederabfrage mit anderem Wortlaut ---------- */
  function pickQuestion(r, nr, opts) {
    opts = opts || {};
    const fns = opts.fns || ['def'];
    let pool = QBY.get(nr).filter(q => fns.includes(q.fn) && (opts.reserved || !q.reserved) && (q.terms.length === 1 || opts.pairs));
    if (opts.preferExisting) {
      const existing = pool.filter(q => q.src !== 'ergaenzt');
      if (existing.length && !existing.every(q => r.seen[q.id])) pool = existing.concat(pool.filter(q => q.src === 'ergaenzt'));
    }
    const last = r.lastQ[nr];
    const notLast = pool.filter(q => q.id !== last && !(opts.avoid || []).includes(q.id));
    const unseen = notLast.filter(q => !r.seen[q.id]);
    const cand = unseen.length ? unseen : notLast.length ? notLast : pool;
    if (!cand.length) return null;
    if (opts.preferExisting) { const ex = cand.find(q => q.src !== 'ergaenzt'); if (ex) return ex; }
    return cand[(nr + r.log.length) % cand.length];
  }

  /* ---------- Sprint-Plan ---------- */
  const PLAN = [
    { day: 1, l: 1, wdh: null, erst: 'A1', extra: 'fix', note: 'Fehler direkt markieren und kurz korrigieren.' },
    { day: 1, l: 2, wdh: null, erst: 'A2', extra: 'luecke', groups: ['A1'], cap: 2, note: 'Falls Zeit bleibt: ein, zwei Lücken aus A1 neu formuliert.' },
    { day: 2, l: 1, wdh: null, erst: 'B1', extra: 'luecke', groups: ['A1', 'A2'], cap: 3, note: 'Kurzer Zusatzcheck für hartnäckige Lücken aus A.' },
    { day: 2, l: 2, wdh: null, erst: 'B2', extra: 'luecke', groups: ['A1', 'A2', 'B1'], cap: 3, note: 'Fehlerliste nach fehlendem Merkmal und Verwechslung sortiert.' },
    { day: 3, l: 1, wdh: 'A1', erst: 'C1', extra: 'luecke', cap: 3 },
    { day: 3, l: 2, wdh: 'A2', erst: 'C2', extra: 'luecke', cap: 3 },
    { day: 4, l: 1, wdh: 'B1', erst: 'D1', extra: 'luecke', cap: 3 },
    { day: 4, l: 2, wdh: 'B2', erst: 'D2', extra: 'luecke', cap: 3 },
    { day: 5, l: 1, wdh: 'C1', erst: 'E1', extra: 'luecke', cap: 3 },
    { day: 5, l: 2, wdh: 'C2', erst: 'E2', extra: 'luecke', cap: 3, note: 'Sollstand danach: alle 139 Begriffe eigenständig versucht.' },
    { day: 6, l: 1, wdh: 'D1', erst: null, extra: 'luecke', groups: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], cap: 10, note: 'Danach offene Lückenchecks aus A bis C.' },
    { day: 6, l: 2, wdh: 'D2', erst: null, extra: 'vergleich', cap: 8, note: 'Danach Vergleichs- und Fallfragen zu den häufigsten Verwechslungen.' },
    { day: 7, l: 1, wdh: 'E1', erst: null, extra: 'nachpruef', cap: 12, note: 'Danach Nachprüfungen für Begriffe, die erst einmal vollständig gelangen.' },
    { day: 7, l: 2, wdh: 'E2', erst: null, extra: 'pruefcheck', cap: 8, note: 'Danach kurzer Prüfungscheck mit zurückgehaltenen Originalfragen.' },
  ].map(p => Object.assign(p, { id: 's' + p.day + p.l }));

  function sprintRows(r, A) {
    const today = dayOf(r);
    return PLAN.map(p => {
      const done = r.done[p.id];
      const state = done ? 'angekommen' : p.day < today ? 'verspaetet' : p.day === today ? 'heute' : 'geplant';
      const wdhTerms = p.wdh ? D.groups[p.wdh] : [];
      const erstTerms = p.erst ? D.groups[p.erst] : [];
      return { p, done, state, wdhTerms, erstTerms };
    });
  }
  function nextSprint(r) {
    const today = dayOf(r);
    const p = PLAN.find(x => !r.done[x.id]);
    if (!p) return null;
    return { p, ready: p.day <= today, late: p.day < today };
  }
  // Zweitcheck fällig: Erstabruf erledigt, noch kein unabhängiger Abruf an einem späteren Tag.
  function secondPending(a) { return a.first && !a.second; }
  function eligible(r, a) {
    const g = diffDays(a.first.d, todayStr());
    if (g >= 2) return { ok: true };
    if (g >= 1 && dayOf(r) >= 7) return { ok: true, short: true };
    return { ok: false, from: addDays(a.first.d, 2) };
  }

  function buildSprintLesson(r, p) {
    const A = analyze(r);
    const tasks = [], held = [];
    const used = new Set();
    // Nachholen: Zweitchecks anderer Gruppen, deren Wiederholungslektion schon vorbei ist.
    const pastWdh = PLAN.filter(x => x.wdh && r.done[x.id]).map(x => x.wdh);
    pastWdh.forEach(g => D.groups[g].forEach(nr => {
      const a = A.get(nr);
      if (a.first && secondPending(a) && eligible(r, a).ok && !a.todayIndep) { tasks.push(task(r, nr, 'wdh', { carried: true, short: eligible(r, a).short })); used.add(nr); }
    }));
    if (p.wdh) D.groups[p.wdh].forEach(nr => {
      if (used.has(nr)) return;
      const a = A.get(nr);
      if (!a.first) { tasks.push(task(r, nr, 'erst', { carried: true })); used.add(nr); return; }
      if (!secondPending(a)) return;
      const el = eligible(r, a);
      if (el.ok && !a.todayIndep) { tasks.push(task(r, nr, 'wdh', { short: el.short })); used.add(nr); }
      else held.push({ nr, from: el.from });
    });
    if (p.erst) D.groups[p.erst].forEach(nr => {
      if (used.has(nr)) return;
      const a = A.get(nr);
      if (!a.first) { tasks.push(task(r, nr, 'erst')); used.add(nr); }
    });
    return { id: p.id, mode: 'sprint', title: 'Tag ' + p.day + ' · Lektion ' + p.l, gleis: [p.wdh, p.erst].filter(Boolean), tasks, held, extra: p.extra, extraCap: p.cap || 0, extraGroups: p.groups || null, i: 0, phase: 'pflicht', results: [], startedDay: dayOf(r) };
  }

  function priorityList(r, A, opts) {
    opts = opts || {};
    const list = [];
    A.forEach(a => {
      if (!a.first) return;
      if (opts.groups && !opts.groups.some(g => D.groups[g].includes(a.nr))) return;
      if ((opts.exclude || new Set()).has(a.nr)) return;
      let score = 0;
      if (a.status === 'unsicher') score += 50 + a.wrong * 10;
      if (Object.keys(a.conf).length) score += 25;
      if (a.status === 'einmal' && !secondPending(a)) score += 15;
      if (a.reset) score += 20;
      if (score) list.push({ a, score });
    });
    return list.sort((x, y) => y.score - x.score || x.a.nr - y.a.nr);
  }

  function extraTasks(r, L) {
    const A = analyze(r);
    const pflicht = new Set(L.tasks.map(t => t.nr));
    const cap = L.extraCap;
    if (L.extra === 'fix') {
      return L.results.filter(x => x && x.res !== 'voll').slice(0, 3).map(x => task(r, x.nr, 'luecke', { correctFirst: true }));
    }
    if (L.extra === 'vergleich') {
      const out = [];
      const weak = priorityList(r, A).map(x => x.a.nr);
      D.questions.filter(q => q.fn === 'abgr').forEach(q => {
        const hit = q.terms.some(nr => weak.includes(nr) || Object.keys(A.get(nr).conf).map(Number).some(c => q.terms.includes(c)));
        if (hit && out.length < Math.ceil(cap / 2) && !out.some(t => t.terms.some(n => q.terms.includes(n)))) out.push(taskQ(r, q, 'luecke'));
      });
      D.questions.filter(q => q.fn === 'anw' && !q.reserved && q.terms.some(nr => weak.includes(nr))).slice(0, cap - out.length).forEach(q => out.push(taskQ(r, q, 'pruef')));
      return out;
    }
    if (L.extra === 'nachpruef') {
      const list = [];
      A.forEach(a => { if (a.status === 'einmal' && !a.todayIndep && !pflicht.has(a.nr)) list.push(a.nr); });
      return list.slice(0, cap).map(nr => task(r, nr, 'luecke'));
    }
    if (L.extra === 'pruefcheck') {
      const weak = new Set(priorityList(r, A).map(x => x.a.nr));
      const qs = D.questions.filter(q => q.reserved);
      qs.sort((a, b) => (weak.has(b.terms[0]) - weak.has(a.terms[0])));
      return qs.slice(0, cap).map(q => taskQ(r, q, 'pruef'));
    }
    const pl = priorityList(r, A, { groups: L.extraGroups, exclude: pflicht }).filter(x => !x.a.todayIndep || x.a.lastRes !== 'voll');
    return pl.slice(0, cap).map(x => task(r, x.a.nr, 'luecke', { correctFirst: x.a.todayIndep }));
  }

  /* ---------- Adaptiver Plan ---------- */
  function interleaved(nrs) {
    const byCat = new Map();
    nrs.forEach(nr => { const c = TERM.get(nr).cat; if (!byCat.has(c)) byCat.set(c, []); byCat.get(c).push(nr); });
    const lanes = [...byCat.values()]; const out = [];
    while (lanes.some(l => l.length)) lanes.forEach(l => { if (l.length) out.push(l.shift()); });
    return out;
  }
  function adaptivePlanInfo(r, A, today = todayStr(), reserved = new Set(), plannedToday = 0) {
    const day = dayOf(r, today);
    const c = stats(r, A);
    c.ungeprueft -= [...reserved].filter(nr => !A.get(nr).first).length;
    const newToday = [...A.values()].filter(a => a.first && a.first.d === today).length;
    const daysLeft = Math.max(1, 14 - day + 1);
    const perDay = day <= 14 ? Math.ceil((c.ungeprueft + newToday + plannedToday) / daysLeft) : c.ungeprueft;
    const due = [...A.values()].filter(a => a.first && a.due <= today && !reserved.has(a.nr) && !a.indep.some(e => e.d === today) && a.status !== 'bestaetigt');
    const control = [...A.values()].filter(a => a.status === 'bestaetigt' && a.due <= today && !reserved.has(a.nr) && !a.indep.some(e => e.d === today) && day <= 21);
    const phase = day <= 7 ? 1 : day <= 14 ? 2 : 3;
    return { day, c, newToday, perDay, quotaLeft: Math.max(0, perDay - newToday - plannedToday), due, control, phase, daysLeft };
  }
  function buildAdaptiveLesson(r, slot, extraBlock, { A = analyze(r), date = todayStr(), reserved = new Set(), plannedToday = 0, plannedCases = new Set() } = {}) {
    const info = adaptivePlanInfo(r, A, date, reserved, plannedToday);
    const tasks = []; const used = new Set();
    const dueSorted = info.due.slice().sort((x, y) => (y.lastRes === 'falsch') - (x.lastRes === 'falsch') || y.wrong - x.wrong || x.due.localeCompare(y.due));
    if (slot === 2 && !extraBlock) {
      // Lektion 2: Lücken aus Lektion 1 mit neuem Wortlaut aufgreifen (zählt als Übung).
      const l1 = (r.done['a' + info.day + 'l1'] || {}).gaps || [];
      l1.slice(0, 4).forEach(nr => { tasks.push(task(r, nr, 'uebung', { assisted: true, correctFirst: false })); used.add(nr); });
    }
    const pushDue = n => dueSorted.forEach(a => { if (n > 0 && !used.has(a.nr)) { tasks.push(task(r, a.nr, 'wdh')); used.add(a.nr); n--; } });
    pushDue(slot === 1 ? 6 : 4);
    const unchecked = interleaved(TERMS.filter(t => !A.get(t.nr).first && !reserved.has(t.nr)).map(t => t.nr));
    let quota = extraBlock ? 6 : info.phase === 3 ? Math.min(unchecked.length, 6) : Math.ceil(info.quotaLeft / (slot === 1 && !r.done['a' + info.day + 'l1'] ? 2 : 1));
    if (info.phase === 1 && !extraBlock) quota = Math.max(quota, 6);
    unchecked.slice(0, quota).forEach(nr => { tasks.push(task(r, nr, 'erst')); used.add(nr); });
    pushDue(12 - tasks.length);
    if (tasks.length < 12) info.control.slice(0, 12 - tasks.length).forEach(a => { if (!used.has(a.nr)) { tasks.push(task(r, a.nr, 'wdh', { control: true })); used.add(a.nr); } });
    if (info.phase >= 2 || (slot === 2 && tasks.length < 8)) {
      const solid = [...A.values()].filter(a => a.status !== 'ungeprueft' && a.lastRes === 'voll').map(a => a.nr);
      const cases = D.questions.filter(q => q.fn === 'anw' && (info.phase === 3 || !q.reserved) && q.terms.some(nr => solid.includes(nr)) && !r.seen[q.id] && !plannedCases.has(q.id));
      cases.slice(0, info.phase === 3 ? 3 : 1).forEach(q => tasks.push(taskQ(r, q, 'pruef')));
    }
    const id = 'a' + info.day + 'l' + slot;
    return { id, mode: 'adaptiv', title: 'Tag ' + info.day + ' · Lektion ' + slot + (extraBlock ? ' · Zusatzblock' : ''), gleis: [], tasks, held: [], extra: null, i: 0, phase: 'pflicht', results: [], extraBlock: !!extraBlock, startedDay: info.day };
  }
  function adaptiveSlot(r) {
    const day = dayOf(r);
    if (!r.done['a' + day + 'l1']) return 1;
    if (!r.done['a' + day + 'l2']) return 2;
    return 0;
  }

  /* ---------- Aufgaben ---------- */
  function task(r, nr, kind, o) {
    o = o || {};
    const q = pickQuestion(r, nr, { preferExisting: kind === 'erst' });
    if (!q) return null;
    return Object.assign({ nr, qid: q.id, terms: q.terms, kind, assisted: !!o.assisted }, o);
  }
  function taskQ(r, q, kind) { return { nr: q.terms[0], qid: q.id, terms: q.terms, kind, assisted: false }; }

  /* ---------- Protokoll ---------- */
  function record(r, t, perTerm, extra) {
    const today = todayStr();
    const q = Q.get(t.qid);
    const A = analyze(r);
    t.terms.forEach(nr => {
      const pt = perTerm[nr];
      const a = A.get(nr);
      const indep = !t.assisted && !extra.guess && q.fn !== 'anw' && !a.todayIndep;
      r.log.push({ d: today, day: dayOf(r), slot: (r.session && r.session.id) || null, qid: q.id, nr, fn: q.fn, kind: t.kind,
        res: extra.guess ? 'geraten' : pt.res, miss: pt.miss, guess: !!extra.guess, assisted: !!t.assisted, indep, conf: pt.conf || null });
      r.lastQ[nr] = q.id;
    });
    r.seen[q.id] = true;
  }

  /* ---------- Ansicht & Routing ---------- */
  const app = document.getElementById('app');
  let view = { tab: 'fahrplan', filter: 'alle', cat: '0', query: '', open: null, openRow: undefined, openCats: new Set(), confirm: null };
  let ui = {}; // Zustand der aktuellen Aufgabe
  let lastUndo = null;
  let pendingImport = null;
  let conflictDraft = null;

  function confirmBar(type, msg, okLabel, danger, id) {
    if (!view.confirm || view.confirm.type !== type || (id !== undefined && view.confirm.id !== id)) return '';
    return `<div class="confirm-bar${danger ? ' confirm-bar--danger' : ''}" role="alertdialog" aria-labelledby="confirm-msg">
  <p id="confirm-msg">${esc(msg)}</p>
  <div class="actions">
    <button class="btn ${danger ? 'btn--danger' : 'btn--ink'}" data-action="confirm-yes">${esc(okLabel)}</button>
    <button class="btn btn--quiet" data-action="confirm-no">Abbrechen</button>
  </div>
</div>`;
  }
  const escSel = s => (window.CSS?.escape ? window.CSS.escape(s) : String(s).replace(/["\\]/g, '\\$&'));
  function openConfirm(type, focusSel, id) {
    view.confirm = id === undefined ? { type, focusSel } : { type, id, focusSel };
    render();
    document.querySelector('[data-action="confirm-no"]')?.focus();
  }

  function canUndo(r, L) {
    return !!(lastUndo && r && L && lastUndo.runId === r.id && lastUndo.sessionId === L.id);
  }
  function adopt(next) {
    clearTimeout(nTimer);
    clearTimeout(qTimer);
    S = next || empty();
    storageCorrupt = !next;
    ui = run()?.session?.ui || {};
    lastUndo = null;
    view = { tab: 'fahrplan', filter: 'alle', cat: '0', query: '', open: null, openRow: undefined, openCats: new Set(), confirm: null };
    pendingImport = null;
  }

  function currentDraft(force = false) {
    const r = run();
    const L = r?.session;
    const t = L?.tasks[L.i];
    if (!t || L.over || !ui.stage) return null;
    const savedRun = parseState(snapshot)?.runs.find(past => past.id === r.id);
    const saved = savedRun?.session;
    if (saved?.id !== L.id || saved.i !== L.i || saved.tasks[saved.i]?.qid !== t.qid) return null;
    const content = ui.notes || ui.touched || ui.guess || ui.confirmEmpty || ui.stage === 'fix';
    if (!content || (!force && JSON.stringify(ui) === JSON.stringify(saved?.ui))) return null;
    return { runId: r.id, sessionId: L.id, index: L.i, qid: t.qid,
      log: JSON.stringify(savedRun.log), result: JSON.stringify(saved.results[L.i] ?? null),
      ui: JSON.parse(JSON.stringify(ui)) };
  }

  function canRestoreDraft(draft) {
    const r = run();
    const L = r?.session;
    return r?.id === draft.runId && L?.id === draft.sessionId && !L.over && L.i === draft.index &&
      L.tasks[L.i]?.qid === draft.qid && JSON.stringify(r.log) === draft.log &&
      JSON.stringify(L.results[L.i] ?? null) === draft.result;
  }

  function refresh(notify, draft = null) {
    const latest = read(KEY);
    if (latest === snapshot) return false;
    conflictDraft = draft || currentDraft() || conflictDraft;
    snapshot = latest;
    const previousView = view;
    const previousRun = run()?.id;
    const keepView = !inLesson(run());
    adopt(parseState(latest));
    if (keepView && run()?.id === previousRun && !inLesson(run())) view = { ...previousView, confirm: null };
    if (storageCorrupt) rememberCorrupt();
    render(true);
    if (notify && !conflictDraft) toast('Der Lernstand wurde in einem anderen Tab geändert. Der aktuelle Stand ist geladen.');
    return true;
  }

  function conflictNotice() {
    if (!conflictDraft) return '';
    const draft = conflictDraft;
    const q = Q.get(draft.qid);
    const lines = [q.text, draft.ui.notes];
    q.terms.forEach(nr => {
      const mark = draft.ui.marks[nr];
      const term = TERM.get(nr);
      const checked = term.crit.filter((_, i) => mark.has[i]).map(c => c.t);
      if (checked.length) lines.push(term.name + ' – abgehakt: ' + checked.join(', '));
      if (mark.contra) lines.push(term.name + ' – fachlicher Widerspruch markiert');
      if (mark.conf) lines.push(term.name + ' – verwechselt mit ' + TERM.get(+mark.conf).name);
    });
    if (draft.ui.guess) lines.push('War geraten');
    if (draft.ui.fix?.value) lines.push('Lückentext: ' + draft.ui.fix.value);
    if (draft.ui.fix?.done && draft.ui.fix.type !== 'cloze') lines.push('Korrektur: ' + (draft.ui.fix.ok ? 'richtig' : 'falsch'));
    return `<section class="conflict" aria-labelledby="conflict-title">
  <h2 class="mono-l" id="conflict-title" tabindex="-1">Lernstand in anderem Tab geändert</h2>
  <p>Der neuere Lernstand ist geladen. Dein Entwurf steht hier zum Kopieren bereit.</p>
  <details><summary>Entwurf anzeigen</summary><pre>${esc(lines.filter(Boolean).join('\n'))}</pre></details>
  <div class="actions">${canRestoreDraft(draft) ? '<button class="btn btn--ink" data-action="restore-draft">Entwurf in dieser Aufgabe übernehmen</button>' : ''}
  <button class="btn btn--quiet" data-action="dismiss-draft">Hinweis schließen</button></div>
</section>`;
  }

  function insertConflictNotice() {
    if (conflictDraft) document.getElementById('main')?.insertAdjacentHTML('afterbegin', conflictNotice());
  }

  function backupState() {
    const raw = read(KEY + '.backup');
    return raw === null ? null : parseState(raw);
  }

  function importControl() {
    return '<label class="btn btn--line">Lernstand importieren<input type="file" accept="application/json,.json" data-action="import" class="sr-only"></label>';
  }

  function storageControls(full = true) {
    return `<section class="storage-tools" aria-label="Lernstand sichern">
  <p><b>Nur in diesem Browser gespeichert.</b> Sichere deinen Lernstand als Datei.</p>
  <div class="actions">
    ${S.runs.length ? '<button class="btn btn--line" data-action="export">Lernstand exportieren</button>' : ''}
    ${full ? importControl() : ''}
  </div>
  ${full ? confirmBar('import', 'Aktuellen Lernstand durch die ausgewählte Datei ersetzen?', 'Importieren', false) : ''}
</section>`;
  }

  function recoveryView() {
    return `<main id="main" class="wrap">
      <h1 class="mono-xl">Lernstand beschädigt</h1>
      <p>Der gespeicherte Lernstand lässt sich nicht öffnen. Du kannst eine Sicherung laden oder einen neuen Lernstand beginnen.</p>
      <div class="actions">
        ${backupState() ? '<button class="btn btn--ink" data-action="restore">Sicherung wiederherstellen</button>' : ''}
        ${importControl()}
        <button class="btn btn--line" data-action="restart">Neuen Lernstand beginnen</button>
      </div>
      ${confirmBar('restore', 'Gesicherten Lernstand wiederherstellen?', 'Wiederherstellen', false)}
      ${confirmBar('restart', 'Einen neuen Lernstand beginnen? Der beschädigte Stand wird überschrieben.', 'Neu beginnen', true)}
      ${confirmBar('import', 'Aktuellen Lernstand durch die ausgewählte Datei ersetzen?', 'Importieren', false)}
    </main>`;
  }

  const inLesson = r => !!r?.session && !r.session.paused;

  function render(moveFocus) {
    try {
      if (storageCorrupt) {
        app.innerHTML = recoveryView();
      } else {
        const r = run();
        if (inLesson(r)) {
          const t = r.session.tasks[r.session.i];
          if (!ui.stage && t) newTaskUi(t, r);
          app.innerHTML = lessonView(r);
          tableRegions();
          insertConflictNotice();
          if (moveFocus) {
            const warning = document.getElementById('conflict-title');
            if (warning) warning.focus();
            else focusQ();
          }
          return;
        }
        app.innerHTML = r ? homeView(r) : startView();
      }
    } catch (error) {
      console.error('Lernstand konnte nicht angezeigt werden.', error);
      storageCorrupt = true;
      rememberCorrupt();
      app.innerHTML = recoveryView();
    }
    tableRegions();
    insertConflictNotice();
    if (moveFocus && conflictDraft) document.getElementById('conflict-title')?.focus();
    else focusMain(moveFocus);
  }
  function focusMain(move) {
    if (!move) return;
    const m = document.getElementById('main');
    if (m) { m.setAttribute('tabindex', '-1'); m.focus({ preventScroll: true }); }
  }

  /* ---------- Start / Moduswahl ---------- */
  function startView() {
    const bestand = D.meta.counts;
    return `
<header class="band band--start">
  <div class="band__brand">${brand()}</div>
  <div class="band__main">
    <h1 class="mono-xl">Wähle deinen Lernplan</h1>
    <p class="lead">Beide Lernpläne trainieren dieselben ${TERMS.length} Pflichtbegriffe mit offenen Fragen.</p>
  </div>
</header>
<main id="main" class="wrap">
  <div class="lines">
    ${lineCard('sprint', 'Für deine Prüfung in etwa einer Woche', '14 Lektionen nach festem Plan.')}
    ${lineCard('adaptiv', 'Für deine Prüfung in etwa drei Wochen', 'Zwei Lernfenster pro Tag. Der Plan folgt deinem Lernstand.')}
  </div>
  <details class="legend"><summary>${ICON.down}<span>Lernpläne und Bewertung im Detail</span></summary>
    <p class="legend__rules"><b>Sprint:</b> 10 Lerngruppen (A1–E2). Zweitcheck meist nach zwei Tagen. Am siebten Tag folgt ein Prüfungscheck.</p>
    <p class="legend__rules"><b>3‑Wochen‑Trainer:</b> Wiederholungen und Lücken gehen vor. Für die Bestätigung brauchst du zwei vollständige Erklärungen an unterschiedlichen Tagen mit mindestens drei Tagen Abstand.</p>
    ${learningGuide(false)}
  </details>
  <table class="board board--facts board--stack">
    <caption>Fragenbestand</caption>
    <thead><tr><th scope="col">Quelle</th><th scope="col" class="num">Fragen</th><th scope="col">Einsatz</th></tr></thead>
    <tbody>
      <tr><td data-label="Quelle">Originalfragen aus der Prüfungsvorbereitung</td><td class="num" data-label="Fragen">${bestand.original}</td><td data-label="Einsatz">Definitionen im Pflichtpfad, Fallfragen reserviert für den Prüfungscheck</td></tr>
      <tr><td data-label="Quelle">Übungsfragen aus der Excel-Datei</td><td class="num" data-label="Fragen">${bestand.uebung}</td><td data-label="Einsatz">Fall- und Transfertraining, getrennt ausgewiesen</td></tr>
      <tr><td data-label="Quelle">Redaktionell ergänzt</td><td class="num" data-label="Fragen">${bestand.ergaenzt}</td><td data-label="Einsatz">Umformulierungen und Vergleichsfragen, damit jede Wiederabfrage anders lautet</td></tr>
    </tbody>
  </table>
  ${S.runs.length ? `<table class="board board--runs board--stack">
    <caption>Gespeicherte Durchläufe</caption>
    <thead><tr><th scope="col">Linie</th><th scope="col">Gestartet</th><th scope="col" class="num">Eigenständig versucht</th><th scope="col" class="num">Bestätigt</th><th scope="col">Aktion</th></tr></thead>
    <tbody>${S.runs.slice().reverse().map(past => {
      const pStats = stats(past, analyze(past));
      return `<tr><td data-label="Linie">${MODES[past.mode].name}${past.endedAt ? ' (beendet ' + fmtDate(past.endedAt) + ')' : ''}</td><td data-label="Gestartet">${fmtDate(past.start)}</td><td class="num" data-label="Eigenständig versucht">${pStats.geprueft}/139</td><td class="num" data-label="Bestätigt">${pStats.bestaetigt}</td><td data-label="Aktion"><button class="link" data-action="resume" data-id="${esc(past.id)}">Wieder aufnehmen</button>${past.endedAt ? ` <button class="link" data-action="delete-run" data-id="${esc(past.id)}">Aus Browser entfernen</button>` : ''}</td></tr>`;
    }).join('')}</tbody>
  </table>` : ''}
  ${storageControls()}
  ${confirmBar('delete-run', 'Diesen beendeten Durchlauf aus dem Browser entfernen? Exportierte Sicherungen bleiben erhalten.', 'Aus Browser entfernen', true)}
  ${S.runs.some(past => past.endedAt) ? '<p class="fine">Exportiere deinen Lernstand, bevor du einen beendeten Durchlauf aus dem Browser entfernst.</p>' : ''}
  <p class="fine">Quelle: ${esc(D.meta.source)}, Glossar‑Nr. 1–139.</p>
</main>`;
  }
  function lineCard(mode, sub, detail) {
    return `<section class="line">
  <h2 class="mono-l">${MODES[mode].name}</h2>
  <p class="line__sub">${sub}</p>
  <p>${detail}</p>
  <button class="btn btn--ink" data-action="start" data-mode="${mode}">${MODES[mode].name} starten ${ICON.go}</button>
</section>`;
  }
  function brand() {
    return `<a class="portal-link" href="../index.html"><span>Zum Lernportal</span>${ICON.go}</a>
<p class="brand__name">Zertifizierungstrainer</p>
<p class="brand__sub">Digital Sales Management · ${TERMS.length} Begriffe</p>`;
  }

  /* ---------- Startseite eines Durchlaufs ---------- */
  function homeView(r) {
    const A = analyze(r);
    const c = stats(r, A);
    const day = dayOf(r);
    const M = MODES[r.mode];
    const over = day > M.days;
    const next = r.session?.paused ? pausedLessonView(r.session)
      : r.mode === 'sprint' ? sprintNext(r) : adaptiveNext(r, A);
    const gapsCount = priorityList(r, A).length;
    const tabs = [['fahrplan', 'Fahrplan'], ['begriffe', 'Begriffe'], ['luecken', gapsCount ? `Lücken (${gapsCount})` : 'Lücken'], ['bilanz', 'Bilanz']];
    return `
<header class="band">
  <div class="band__brand">${brand()}
    <div class="band__day"><span class="mono-l">${over ? 'Beendet' : 'Tag ' + Math.max(1, day) + ' von ' + M.days}</span><span class="fine-ink">${M.name} · gestartet ${wd(r.start)}, ${fmtDate(r.start)}</span></div>
  </div>
  <div class="band__main">${next}</div>
  <dl class="band__stand">
    <div class="band__total"><dt>eigenständig versucht</dt><dd class="mono-xl">${c.geprueft}<small> / ${TERMS.length}</small></dd>
      <dd class="band__explain">Definition oder Abgrenzung ohne Hilfe. Pro Begriff zählt der erste eigene Abruf des Tages. Raten zählt als Übung.</dd></div>
    <div><dt>einmal vollständig</dt><dd class="mono-xl">${c.einmal}</dd></div>
    <div><dt>bestätigt</dt><dd class="mono-xl">${c.bestaetigt}</dd></div>
    <div${c.unsicher ? ' class="is-red"' : ''}><dt>unsicher</dt><dd class="mono-xl">${c.unsicher}</dd></div>
    <div><dt>noch kein eigener Abruf</dt><dd class="mono-xl">${c.ungeprueft}</dd></div>
  </dl>
</header>
<div class="tabs" role="tablist" aria-label="Bereiche">
  ${tabs.map(([k, l]) => `<button class="tab${view.tab === k ? ' is-on' : ''}" id="tab-${k}" role="tab" aria-controls="main" aria-selected="${view.tab === k}" tabindex="${view.tab === k ? '0' : '-1'}" data-action="tab" data-tab="${k}">${l}</button>`).join('')}
</div>
<main id="main" class="wrap" role="tabpanel" aria-labelledby="tab-${view.tab}">
  ${view.tab === 'fahrplan' || view.tab === 'bilanz' ? storageControls() : ''}
  ${view.tab === 'fahrplan' ? (r.mode === 'sprint' ? sprintBoard(r, A) : adaptiveBoard(r, A)) : ''}
  ${view.tab === 'begriffe' ? termsBoard(r, A) : ''}
  ${view.tab === 'luecken' ? gapsBoard(r, A) : ''}
  ${view.tab === 'bilanz' ? balance(r, A) : ''}
</main>`;
  }

  function pausedLessonView(L) {
    return `<h1 class="mono-xl">Lektion pausiert</h1>
<p class="via">${esc(L.title)} · Frage ${L.i + 1} von ${L.tasks.length}. Deine Eingaben sind gespeichert.</p>
<button class="btn btn--ink" data-action="resume-lesson">Frage ${L.i + 1} fortsetzen ${ICON.go}</button>
<button class="backlink discard-lesson" data-action="discard-lesson">Diese Lektion abbrechen</button>
${confirmBar('discard-lesson', 'Lektion abbrechen? Deine bisherigen Bewertungen bleiben gespeichert. Der Entwurf der aktuellen Frage wird verworfen.', 'Lektion abbrechen', true)}`;
  }

  function sprintNext(r) {
    const n = nextSprint(r);
    if (!n) return `<h1 class="mono-xl">Sprint abgeschlossen</h1><p class="via">Alle 14 Lektionen sind gefahren. Die Bilanz zeigt, was bestätigt ist und was offen bleibt.</p><button class="btn btn--ink" data-action="tab" data-tab="bilanz">Bilanz ansehen ${ICON.go}</button>`;
    const { p, ready, late } = n;
    const L = buildSprintLesson(r, p);
    const names = L.tasks.slice(0, 5).map(t => TERM.get(t.nr).name);
    const wd_ = L.tasks.filter(t => t.kind === 'wdh').length, er = L.tasks.filter(t => t.kind === 'erst').length;
    const umfang = [wd_ && plural(wd_, 'Begriff erneut erklären', 'Begriffe erneut erklären'), er && plural(er, 'Begriff erstmals abrufen', 'Begriffe erstmals abrufen')].filter(Boolean).join(', danach ');
    const route = [p.wdh && 'Gruppe ' + p.wdh + ' wiederholen', p.erst ? 'Gruppe ' + p.erst + ' neu' : { luecke: 'Lückencheck', vergleich: 'Vergleich', nachpruef: 'Nachprüfung', pruefcheck: 'Prüfungscheck' }[p.extra]].filter(Boolean).join(' · ');
    return `<h1 class="mono-xl">${route}</h1>
<p class="via">${late ? '<strong class="tag-red">Verspätet</strong> ' : ''}<strong>Tag ${p.day} · Lektion ${p.l}.</strong> ${umfang ? 'Heute: ' + umfang + '.' : 'Keine Pflichtfragen offen.'} ${names.length ? 'Über ' + names.map(esc).join(', ') + (L.tasks.length > 5 ? ' und ' + (L.tasks.length - 5) + ' weitere' : '') + '.' : ''}${late ? ' Verpasste Lektionen bleiben in der Warteschlange.' : ''}</p>
${L.held.length ? `<p class="via">${plural(L.held.length, 'Zweitcheck wartet', 'Zweitchecks warten')} noch auf den Abstand von zwei Tagen.</p>` : ''}
${ready ? `<button class="btn btn--ink" data-action="lesson" data-id="${p.id}">${L.tasks.length ? 'Lektion starten' : 'Lektion abschließen'} ${ICON.go}</button>` : `<p class="via"><strong>Nächste Abfahrt Tag ${p.day}</strong> (${wd(addDays(r.start, p.day - 1))}, ${fmtDate(addDays(r.start, p.day - 1))}). Heute ist alles erledigt.</p>`}`;
  }

  function adaptiveNext(r, A) {
    const info = adaptivePlanInfo(r, A);
    if (info.day > 21) return `<h1 class="mono-xl">21 Tage vorbei</h1><p class="via">Zeit für die Bilanz. Offene Begriffe werden nicht automatisch als beherrscht markiert.</p><button class="btn btn--ink" data-action="tab" data-tab="bilanz">Bilanz ansehen ${ICON.go}</button>`;
    const slot = adaptiveSlot(r);
    const phaseName = ['', 'Wissensstand erfassen', 'Abdeckung abschließen', 'Erklärungen absichern'][info.phase];
    const dueN = info.due.length;
    const lines = [];
    if (dueN) lines.push(plural(dueN, 'Wiederholung fällig', 'Wiederholungen fällig'));
    if (info.c.ungeprueft) lines.push(info.phase < 3 ? `${info.quotaLeft} neue Begriffe heute eingeplant` : `${info.c.ungeprueft} Begriffe ohne eigenen Abruf`);
    if (!slot) {
      const more = buildAdaptiveLesson(r, 1, true).tasks.some(Boolean);
      return `<h1 class="mono-xl">Beide Lektionen erledigt</h1><p class="via">Dein Tagesplan ist abgeschlossen.${lines.length ? ' ' + lines.join(' · ') + '.' : ''}</p>
${more ? '<button class="btn btn--line" data-action="lesson" data-id="extra">Optionalen Zusatzblock starten</button>' : ''}`;
    }
    return `<h1 class="mono-xl">Lektion ${slot} <span class="gleis-tag">${slot === 1 ? 'Begriffe abrufen' : 'Lücken üben'}</span></h1>
<p class="via">Phase ${info.phase}: ${phaseName}.${lines.length ? ' ' + lines.join(' · ') + '.' : ''}</p>
<button class="btn btn--ink" data-action="lesson" data-id="slot${slot}">Lektion ${slot} starten ${ICON.go}</button>`;
  }

  function learningGuide(sprint) {
    return `<section class="guide" aria-label="So wird bewertet">
  <p><b>Definition:</b> Erkläre den Begriff aus dem Kopf.</p>
  <p><b>Abgrenzung:</b> Nenne auch den Unterschied zum Vergleichsbegriff.</p>
  <p><b>Anwendung:</b> Übertrage die Merkmale auf den Fall. Fälle zählen separat.</p>
  <p>Als Nachweis zählt höchstens der erste eigenständige Abruf pro Tag. Raten zählt als Übung.</p>
  ${sprint === false ? '' : '<p><b>Sprint:</b> A1 bis E2 sind die zehn fest eingeplanten Lerngruppen. Ab Tag 7 kann ein vollständiger zweiter Abruf schon nach einem Tag als verkürzter Nachcheck zählen.</p>'}
</section>`;
  }

  function updateTableScrollHints() {
    app.querySelectorAll?.('.board-scroll').forEach(region => {
      const prev = region.previousElementSibling;
      if (prev?.classList?.contains('table-scroll-hint')) {
        prev.classList.toggle('is-overflow', region.scrollWidth > region.clientWidth + 1);
      }
    });
  }

  function tableRegions() {
    app.querySelectorAll?.('.board').forEach(table => {
      const region = document.createElement('div');
      region.className = 'board-scroll';
      region.setAttribute('role', 'region');
      region.setAttribute('aria-label', table.caption.textContent.trim());
      table.before(region);
      region.appendChild(table);
      region.tabIndex = 0;
    });
    updateTableScrollHints();
  }

  function legendBox() {
    return `<details class="legend"><summary>${ICON.down}<span>Legende: Stationen &amp; Nachweisregeln</span></summary>
  <div class="legend__grid">
    <span class="legend__item"><span class="stations" aria-hidden="true"><i class="st st--open"></i></span> offen</span>
    <span class="legend__item"><span class="stations" aria-hidden="true"><i class="st st--full"></i></span> vollständig</span>
    <span class="legend__item"><span class="stations" aria-hidden="true"><i class="st st--miss"></i></span> nicht vollständig</span>
    <span class="legend__item"><span class="stations" aria-hidden="true"><i class="st st--full st--end"></i></span> bestätigt (2× vollständig an verschiedenen Tagen)</span>
  </div>
  <p class="legend__rules"><b>Nachweis</b> ist der erste unabhängige Abruf eines Begriffs pro Tag ohne Hilfe. Lückenchecks und Wiederholungen nach Hinweis zählen als <b>Übung</b>. Im 7‑Tage‑Sprint genügt ab Tag 7 ein Abstand von einem Tag als <b>verkürzter Nachcheck</b>.</p>
</details>`;
  }

  function sprintBoard(r, A) {
    const rows = sprintRows(r, A).map(row => {
      const { p, done, state, wdhTerms, erstTerms } = row;
      const day = addDays(r.start, p.day - 1);
      const terms = [...wdhTerms, ...erstTerms];
      const preview = terms.slice(0, 4).map(nr => esc(TERM.get(nr).name)).join(', ') + (terms.length > 4 ? ' …' : '');
      const amount = [
        wdhTerms.length && plural(wdhTerms.length, 'Wiederholung', 'Wiederholungen'),
        erstTerms.length && plural(erstTerms.length, 'Erstabruf', 'Erstabrufe'),
      ].filter(Boolean);
      const groups = [
        p.wdh && `Gruppe ${p.wdh} wiederholen`,
        p.erst && `Gruppe ${p.erst} neu`,
        !p.erst && { luecke: 'Lückencheck', vergleich: 'Vergleich', nachpruef: 'Nachprüfung', pruefcheck: 'Prüfungscheck' }[p.extra],
      ].filter(Boolean);
      const late = state === 'verspaetet' ? dayOf(r) - p.day : 0;
      const badge = late ? `<strong class="tag-red">Verspätet · ${plural(late, 'Tag', 'Tage')}</strong>`
        : state === 'heute' ? '<strong class="tag-ink">Heute</strong>'
        : done ? '<strong class="sprint-status">Abgeschlossen</strong>' : '';
      return { ...row, dateLabel: wd(day) + ' ' + fmtDate(day), preview, amount, groups, badge,
        note: esc(done?.summary || p.note || '') };
    });
    return `${learningGuide(true)}${stationKey()}
<section class="sprint-small" aria-labelledby="sprint-small-title">
  <h2 class="mono-l" id="sprint-small-title">Abfahrtstafel <span class="cap-sub">· ${rows.length} Lektionen</span></h2>
  ${rows.map(row => {
      const { p, state, dateLabel, amount, badge, preview, groups, note, wdhTerms, erstTerms } = row;
      return `<details class="day sprint-departure${state === 'heute' ? ' day--today' : ''}">
    <summary><span class="day__date"><b>Tag ${p.day}</b><span>${dateLabel}</span></span>
      <span class="sprint-departure__main"><b>Lektion ${p.l}</b>${badge}<span class="fine-ink">${amount.join(' · ')}</span>
        ${preview ? `<span class="cell-via"><b>Über</b> ${preview}</span>` : ''}</span>
      ${ICON.down}</summary>
    <div class="sprint-departure__detail">
      <p>${groups.join(' · ')}</p>
      ${note ? `<p>${note}</p>` : ''}
      ${lessonRoute(r, A, wdhTerms, erstTerms)}
    </div>
  </details>`;
    }).join('')}
</section>
<table class="board board--plan">
<caption>Abfahrtstafel <span class="cap-sub">· ${rows.length} Lektionen</span></caption>
<thead><tr><th scope="col">Tag</th><th scope="col">Lektion</th><th scope="col">Lerngruppe</th><th scope="col">Umfang</th><th scope="col">Hinweis</th></tr></thead>
<tbody>${rows.map(row => {
      const { p, state, dateLabel, amount, badge, preview, groups, note, wdhTerms, erstTerms } = row;
      const open = view.openRow === p.id;
      return `<tr class="row--${state}${open ? ' is-open' : ''}">
  <td class="cell-day"><span class="mono-l">${p.day}</span><span class="fine-ink">${dateLabel}</span></td>
  <td><button class="rowbtn" data-action="openrow" data-id="${p.id}" aria-expanded="${open}"${open ? ` aria-controls="sroute-${p.id}"` : ''}><b>Lektion ${p.l}</b><span class="fine-ink">Lernverlauf ${open ? 'zuklappen' : 'zeigen'}</span></button>${preview ? `<p class="cell-via"><b>Über</b> ${preview}</p>` : ''}</td>
  <td class="cell-gleis">${groups.map(group => `<span>${group}</span>`).join('')}</td>
  <td class="cell-umfang">${amount.join('<br>')}</td>
  <td class="cell-note">${badge} ${note}</td>
</tr>${open ? `<tr class="route-row" id="sroute-${p.id}"><td></td><td colspan="4">${lessonRoute(r, A, wdhTerms, erstTerms)}</td></tr>` : ''}`;
    }).join('')}</tbody></table>
${legendBox()}
<p class="fine">Der Sprint plant 139 Erstabrufe und 139 Wiederholungen ein. Der Zweitcheck folgt in der Regel nach zwei Tagen. Verpasste Lektionen kannst du nachholen.</p>`;
  }

  function stationKey() {
    return `<p class="fine legend-inline"><span>Stationen:</span><span><span class="stations stations--sm" aria-hidden="true"><i class="st st--open"></i></span> offen</span><span><span class="stations stations--sm" aria-hidden="true"><i class="st st--full"></i></span> vollständig</span><span><span class="stations stations--sm" aria-hidden="true"><i class="st st--miss"></i></span> nicht vollständig</span><span><span class="stations stations--sm" aria-hidden="true"><i class="st st--full st--end"></i></span> bestätigt</span></p>`;
  }

  function lessonRoute(r, A, wdh, erst) {
    const block = (title, list) => list.length ? `<div class="lroute"><p class="lbl">${title}</p><ul>${list.map(nr => { const a = A.get(nr); return `<li>${stationCells(r, a, true)}<span><b>${esc(TERM.get(nr).name)}</b> <span class="stand stand--${a.status}">${STATUS[a.status]}</span></span></li>`; }).join('')}</ul></div>` : '';
    return `<div class="lroutes">${block('Wiederholung', wdh)}${block('Erstabruf', erst)}</div>`;
  }

  function adaptiveBoard(r, A) {
    const info = adaptivePlanInfo(r, A);
    const today = todayStr();
    const days = [];
    const reserved = new Set();
    const plannedCases = new Set();
    for (let n = Math.max(1, info.day); n <= MODES.adaptiv.days; n++) {
      const date = addDays(r.start, n - 1);
      let plannedToday = 0;
      const windows = [1, 2].map(slot => {
        const id = 'a' + n + 'l' + slot;
        const done = r.done[id];
        const completed = done && r.log.filter(e => e.slot === id).map(e => ({ nr: e.nr, kind: e.kind, fn: e.fn, guess: isGuess(e) }));
        if (done) return { slot, done, items: completed };
        const paused = r.session?.paused && r.session.id === id ? r.session : null;
        const tasks = paused ? paused.tasks.slice(paused.i)
          : buildAdaptiveLesson(r, slot, false, { A, date, reserved, plannedToday, plannedCases }).tasks.filter(Boolean);
        tasks.forEach(t => {
          if (t.kind === 'erst') plannedToday++;
          if (t.kind === 'erst' || t.kind === 'wdh') reserved.add(t.nr);
          if (t.kind === 'pruef') plannedCases.add(t.qid);
        });
        return { slot, done: null, paused: !!paused, exact: date === today && (slot === 1 || !!r.done['a' + n + 'l1']), items: tasks.flatMap(t => t.terms.map(nr => ({ nr, kind: t.kind, fn: Q.get(t.qid).fn }))) };
      });
      days.push({ n, date, windows });
    }
    const behind = !r.session?.paused && info.day <= 14 && info.c.ungeprueft > 0 ? `<div class="notice ${info.perDay > 14 ? 'notice--red' : ''}">
  <p><strong>${info.c.ungeprueft} Begriffe ohne eigenen Abruf.</strong> Bis Tag 14 sind das im Schnitt ${info.perDay} Erstabrufe pro Tag${info.perDay > 14 ? ', mehr als üblich' : ''}.</p>
  <button class="btn btn--line" data-action="lesson" data-id="extra">Zusatzblock mit 6 neuen Begriffen</button></div>` : '';
    return `${learningGuide(false)}${behind}
<section class="daily-plan" aria-labelledby="daily-title">
  <h2 class="mono-l" id="daily-title">Tägliche Lerninhalte</h2>
  <p class="fine">Öffne einen Tag, um beide Lernfenster zu sehen. Deine Antworten ändern die Vorschau.</p>
  ${days.map(({ n, date, windows }) => {
      const isToday = date === today;
      const phase = n <= 7 ? 'Wissensstand erfassen' : n <= 14 ? 'Abdeckung abschließen' : 'Erklärungen absichern';
      const done = windows.filter(w => w.done).length;
      const planned = windows.filter(w => !w.done).flatMap(w => w.items);
      const newTerms = planned.filter(t => t.kind === 'erst').length;
      const reviews = planned.filter(t => t.kind === 'wdh' || t.kind === 'uebung').length;
      const info = done === 2 ? 'Beide Lernfenster abgeschlossen' : [done ? '1 Lernfenster abgeschlossen' : '',
        `${newTerms} neu`, plural(reviews, 'Wiederholung', 'Wiederholungen')].filter(Boolean).join(' · ');
      return `<details class="day${isToday ? ' day--today' : ''}">
    <summary id="day-${n}"><span class="day__date"><b>Tag ${n}</b><span>${wd(date)} ${fmtDate(date)}</span></span>
      <span><b>${phase}</b><span class="fine-ink">${info}</span></span>
      <span class="day__marker">${isToday ? '<span class="tag-ink">heute</span>' : ''}${ICON.down}</span></summary>
    <div class="day__windows">${windows.map(w => adaptiveWindow(w, n)).join('')}</div>
  </details>`;
    }).join('') || '<p class="fine">Die 21 Tage sind vorbei. Deinen Lernstand findest du in der Bilanz.</p>'}
</section>
${legendBox()}`;
  }

  function adaptiveWindow({ slot, done, items, exact, paused }, day) {
    const type = t => t.fn === 'anw' ? 'Falltraining' : t.kind === 'erst' ? 'Neue Begriffe' :
      t.kind === 'wdh' ? 'Fällige Wiederholungen' : 'Lücken üben';
    const groups = new Map();
    items.forEach(item => {
      const label = type(item);
      if (!groups.has(label)) groups.set(label, []);
      groups.get(label).push(item);
    });
    return `<section class="day-window" aria-labelledby="day-window-${day}-${slot}">
  <h3 id="day-window-${day}-${slot}">Lektion ${slot} · ${slot === 1 ? 'Abrufen' : 'Lücken und Anwendung'}</h3>
  <p class="fine-ink">${done ? 'Abgeschlossen' : paused ? 'Pausiert · verbleibende Aufgaben' : exact ? 'Heutiger Plan' : 'Vorschau'}</p>
  ${[...groups].map(([label, terms]) => `<div class="day-window__group"><b>${label}</b><ul>${terms.map(t => `<li>${esc(TERM.get(t.nr).name)}${t.guess ? ' · geraten' : ''}</li>`).join('')}</ul></div>`).join('') || '<p class="fine-ink">Derzeit keine festen Inhalte eingeplant.</p>'}
  ${!done && !paused && !exact && slot === 2 ? '<p class="fine-ink">Bis zu vier Lücken aus Lektion 1 können hinzukommen.</p>' : ''}
</section>`;
  }

  /* ---------- Begriffe ---------- */
  function stationCells(r, a, small) {
    const s1 = a.first ? (a.first.res === 'voll' ? 'full' : 'miss') : 'open';
    const sec = a.indep.find(e => a.first && e.d > a.first.d);
    const s2 = sec ? (sec.res === 'voll' ? 'full' : 'miss') : 'open';
    const s3 = a.status === 'bestaetigt' ? 'full' : 'open';
    const lab = { full: 'vollständig', miss: 'nicht vollständig', open: 'offen' };
    return `<span class="stations${small ? ' stations--sm' : ''}" role="img" aria-label="1. Abruf ${lab[s1]}, 2. Abruf ${lab[s2]}, Bestätigung ${lab[s3]}"><i class="st st--${s1}"></i><i class="st st--${s2}"></i><i class="st st--${s3} st--end"></i></span>`;
  }
  function termsRows(r, A) {
    const q = view.query.trim().toLowerCase();
    const list = TERMS.filter(t => {
      const a = A.get(t.nr);
      if (view.filter === 'offen' && a.status === 'bestaetigt') return false;
      else if (view.filter !== 'alle' && view.filter !== 'offen' && a.status !== view.filter) return false;
      if (view.cat !== '0' && String(t.cat) !== view.cat) return false;
      if (q && !(t.name + ' ' + t.de + ' ' + t.en).toLowerCase().includes(q)) return false;
      return true;
    });
    const unfiltered = !q && view.filter === 'alle' && view.cat === '0';
    let bodyHtml = '';
    if (!list.length) {
      bodyHtml = `<tr><td colspan="6" class="empty">Kein Begriff passt zu diesem Filter. <button class="link" data-action="resetfilters">Filter zurücksetzen</button></td></tr>`;
    } else if (unfiltered) {
      bodyHtml = Object.entries(D.categories).map(([k, name]) => {
        const items = list.filter(t => String(t.cat) === k);
        const catOpen = view.openCats.has(k);
        const counts = { bestaetigt: 0, unsicher: 0, einmal: 0, ungeprueft: 0 };
        items.forEach(t => counts[A.get(t.nr).status]++);
        const breakdown = Object.entries(counts).filter(([, n]) => n).map(([k, n]) => n + ' ' + STATUS[k]).join(' · ');
        return `<tr class="cat-head"><td colspan="6"><button class="rowbtn" data-action="catgroup" data-cat="${k}" aria-expanded="${catOpen}"><span><b>${k}. ${esc(name)}</b></span><span class="fine-ink">${plural(items.length, 'Begriff', 'Begriffe')} · ${breakdown} · ${catOpen ? 'zuklappen' : 'zeigen'}</span></button></td></tr>${catOpen ? items.map(t => termRow(r, A.get(t.nr), t)).join('') : ''}`;
      }).join('');
    } else {
      bodyHtml = list.map(t => termRow(r, A.get(t.nr), t)).join('');
    }
    return { countText: `${list.length} von ${TERMS.length} Begriffen`, bodyHtml };
  }
  function termsBoard(r, A) {
    const filters = [['alle', 'Alle'], ['offen', 'offen'], ['einmal', '1× voll'], ['unsicher', 'unsicher'], ['bestaetigt', 'bestätigt']];
    const { countText, bodyHtml } = termsRows(r, A);
    return `<div class="filters">
  <label class="field field--grow"><span class="lbl">Suchen</span><input type="search" data-action="query" value="${esc(view.query)}" placeholder="Begriff, deutsch oder englisch"></label>
  <label class="field"><span class="lbl">Stand</span><select data-action="filter">${filters.map(([k, l]) => `<option value="${k}"${view.filter === k ? ' selected' : ''}>${l}</option>`).join('')}</select></label>
  <label class="field"><span class="lbl">Kategorie</span><select data-action="cat">${['<option value="0">Alle Kategorien</option>', ...Object.entries(D.categories).map(([k, v]) => `<option value="${k}"${view.cat === k ? ' selected' : ''}>${k}. ${esc(v)}</option>`)].join('')}</select></label>
</div>
${stationKey()}
<table class="board board--terms board--stack">
<caption aria-live="polite">${countText}</caption>
<thead><tr><th scope="col" class="num">Nr.</th><th scope="col">Begriff</th><th scope="col">Kategorie</th><th scope="col">Stationen</th><th scope="col">Stand</th><th scope="col">Nächster Check</th></tr></thead>
<tbody>${bodyHtml}</tbody></table>
${legendBox()}`;
  }
  function termRow(r, a, t) {
    const open = view.open === t.nr;
    const due = a.due ? (a.status === 'bestaetigt' ? 'Kontrolle ab ' : '') + fmtDate(a.due) + (a.dueDays > 0 && a.status !== 'bestaetigt' ? ` <strong class="tag-red">+${a.dueDays}</strong>` : '') : '–';
    return `<tr class="row--st-${a.status}${open ? ' is-open' : ''}">
<td class="num" data-label="Nr.">${t.nr}</td>
<td data-label="Begriff"><button class="rowbtn" data-action="open" data-nr="${t.nr}" aria-expanded="${open}"${open ? ` aria-controls="troute-${t.nr}"` : ''}><b>${esc(t.name)}</b><span class="fine-ink">${esc(t.de)}${t.en && t.en !== t.name ? ' · ' + esc(t.en) : ''}</span></button></td>
<td class="cell-muted" data-label="Kategorie">${esc(t.catName)}</td>
<td data-label="Stationen">${stationCells(r, a)}</td>
<td data-label="Stand"><span class="stand stand--${a.status}">${STATUS[a.status]}${a.shortened ? ' (verkürzt)' : ''}${a.reset ? ' · zurückgesetzt' : ''}</span></td>
<td data-label="Nächster Check">${due}</td>
</tr>${open ? `<tr class="route-row" id="troute-${t.nr}"><td></td><td colspan="5">${routeView(r, a, t)}</td></tr>` : ''}`;
  }
  function routeView(r, a, t) {
    const entries = r.log.filter(e => e.nr === t.nr);
    const stops = entries.map(e => {
      const q = Q.get(e.qid);
      const miss = (e.miss || []).map(i => t.crit[i] && t.crit[i].t).filter(Boolean);
      const cls = e.res === 'voll' ? 'full' : 'miss';
      return `<li class="stop stop--${e.indep && !isGuess(e) ? cls : 'practice'}">
  <span class="stop__when"><b>Tag ${esc(e.day)}</b> ${fmtDate(e.d)}</span>
  <span class="stop__what">${esc(KIND[e.kind] || e.kind)}${isGuess(e) ? ' · Übung' : e.indep ? ' · Nachweis' : e.fn === 'anw' ? ' · Fall' : ' · Übung'}</span>
  <span class="stop__res">${resultLabel(e)}</span>
  <span class="stop__q">${esc(q?.text || '')}</span>
  ${miss.length ? `<span class="stop__miss">fehlte: ${miss.map(esc).join('; ')}</span>` : ''}
  ${e.conf ? `<span class="stop__miss">verwechselt mit ${esc(TERM.get(e.conf).name)}</span>` : ''}
</li>`;
    }).join('');
    return `<div class="route">
  <ol class="line-route">${stops || '<li class="stop stop--open"><span class="stop__what">Noch nicht abgefragt.</span></li>'}</ol>
  <details class="def"><summary>${ICON.down}<span>Glossardefinition und Pflichtmerkmale</span></summary>
    <p>${esc(t.def)}</p><p class="fine-ink">Glossar Nr. ${t.nr} · Lektion ${esc(t.lesson)}</p>
    <ul class="crits-plain">${t.crit.map(c => `<li>${esc(c.t)}</li>`).join('')}</ul>
    <p class="fine-ink">Pflichtmerkmale redaktionell aus der Definition abgeleitet.</p>
  </details>
</div>`;
  }

  /* ---------- Lücken ---------- */
  function gapsBoard(r, A) {
    const list = priorityList(r, A);
    const btn = r.mode === 'sprint' || r.session?.paused ? '' : `<button class="btn btn--line" data-action="lesson" data-id="gaps">Lückenblock starten</button>`;
    if (!list.length) return `<div class="empty-state"><h2 class="mono-l">Keine offenen Lücken</h2><p>Sobald ein Begriff unvollständig erklärt wurde, steht er hier, sortiert nach Fehlerbild.</p></div>`;
    return `<div class="filters"><p class="fine">Sortiert nach Dringlichkeit: wiederholte Fehler und Verwechslungen zuerst. ${r.mode === 'sprint' ? 'Im Sprint werden Lücken nach den Pflichtfragen jeder Lektion bearbeitet.' : ''}</p>${btn}</div>
<table class="board board--gaps board--stack">
<caption>${plural(list.length, 'Lücke', 'Lücken')}</caption>
<thead><tr><th scope="col" class="num">Nr.</th><th scope="col">Begriff</th><th scope="col">Fehlerbild</th><th scope="col" class="num">Fehler</th><th scope="col">Stand</th></tr></thead>
<tbody>${list.map(({ a }) => {
      const t = TERM.get(a.nr);
      const miss = Object.entries(a.miss).sort((x, y) => y[1] - x[1]).map(([i]) => t.crit[i] && t.crit[i].t).filter(Boolean);
      const conf = Object.keys(a.conf).map(n => TERM.get(+n).name);
      const bild = [conf.length && 'verwechselt mit ' + conf.map(esc).join(', '), miss.length && 'fehlt: ' + esc(miss[0]), a.status === 'einmal' && 'braucht zweiten Nachweis', a.reset && 'nach Bestätigung wieder unvollständig'].filter(Boolean).join(' · ') || 'nicht abrufbar';
      const open = view.open === a.nr;
      return `<tr class="row--st-${a.status}${open ? ' is-open' : ''}"><td class="num" data-label="Nr.">${a.nr}</td><td data-label="Begriff"><button class="rowbtn" data-action="open" data-nr="${a.nr}" aria-expanded="${open}"${open ? ` aria-controls="groute-${a.nr}"` : ''}><b>${esc(t.name)}</b><span class="fine-ink">Lernverlauf &amp; Definition ${open ? 'zuklappen' : 'zeigen'}</span></button></td><td data-label="Fehlerbild">${bild}</td><td class="num" data-label="Fehler">${a.wrong}</td><td data-label="Stand"><span class="stand stand--${a.status}">${STATUS[a.status]}</span></td></tr>${open ? `<tr class="route-row" id="groute-${a.nr}"><td></td><td colspan="4">${routeView(r, a, t)}</td></tr>` : ''}`;
    }).join('')}</tbody></table>`;
  }

  /* ---------- Bilanz ---------- */
  function balance(r, A) {
    const c = stats(r, A);
    const cats = Object.entries(D.categories).map(([k, name]) => {
      const ts = TERMS.filter(t => String(t.cat) === k).map(t => A.get(t.nr));
      const anw = ts.flatMap(a => a.anw);
      return { k, name, n: ts.length, ge: ts.filter(a => a.first).length, be: ts.filter(a => a.status === 'bestaetigt').length, un: ts.filter(a => a.status === 'unsicher').length, anwOk: anw.filter(x => x === 'voll').length, anwN: anw.filter(x => x !== 'geraten').length };
    });
    const allAnw = [...A.values()].flatMap(a => a.anw);
    const guessed = r.log.filter(isGuess);
    const anwGuessed = allAnw.filter(x => x === 'geraten').length;
    const anwFails = allAnw.filter(x => x !== 'voll' && x !== 'geraten').length;
    const twoDays = [...A.values()].filter(a => a.status === 'bestaetigt').length;
    const qs = r.mode === 'sprint' ? `
<ol class="answers">
  <li><span class="lbl">Begriffe mit eigenständigem Abrufversuch</span><span class="mono-xl">${c.geprueft}<small>/139</small></span><span>${c.geprueft === 139 ? 'Alle Begriffe versucht.' : 'Noch nicht: ' + c.ungeprueft + ' offen.'}</span></li>
  <li><span class="lbl">An zwei verschiedenen Tagen vollständig erklärt</span><span class="mono-xl">${twoDays}</span><span>${c.einmal} weitere bisher nur einmal vollständig.</span></li>
  <li${anwFails ? ' class="is-red"' : ''}><span class="lbl">Aufgaben im Prüfungsstil mit Schwierigkeiten</span><span class="mono-xl">${anwFails}</span><span>von ${allAnw.length - anwGuessed} selbst beantworteten Fällen. ${anwGuessed ? anwGuessed + ' geraten.' : ''}</span></li>
</ol>` : `
<ol class="answers">
  <li><span class="lbl">eigenständig versucht</span><span class="mono-xl">${c.geprueft}</span><span>von 139</span></li>
  <li><span class="lbl">bestätigt</span><span class="mono-xl">${c.bestaetigt}</span><span>zweimal vollständig, mindestens drei Tage Abstand</span></li>
  <li${c.unsicher ? ' class="is-red"' : ''}><span class="lbl">erneut unsicher</span><span class="mono-xl">${c.unsicher}</span><span>${[...A.values()].filter(a => a.reset).length} davon nach Bestätigung</span></li>
  <li><span class="lbl">im Prüfungsstil angewendet</span><span class="mono-xl">${allAnw.filter(x => x === 'voll').length}</span><span>von ${allAnw.length - anwGuessed} selbst beantworteten Fällen vollständig${anwGuessed ? ' · ' + anwGuessed + ' geraten' : ''}</span></li>
</ol>`;
    return `${qs}
${guessed.length ? `<p class="fine"><b>Geraten:</b> ${plural(guessed.length, 'Begriffsbewertung als Übung erfasst', 'Begriffsbewertungen als Übung erfasst')}. Details findest du im Lernverlauf des Begriffs.</p>` : ''}
<p class="fine table-scroll-hint" id="balance-scroll-hint">Tabelle seitwärts scrollen für alle Kennzahlen. Die Kategoriespalte bleibt stehen.</p>
<table class="board board--balance" aria-describedby="balance-scroll-hint">
<caption>Lernstand nach Thema</caption>
<thead><tr><th scope="col">Kategorie</th><th scope="col" class="num">Begriffe</th><th scope="col" class="num">Eigenständig versucht</th><th scope="col" class="num">bestätigt</th><th scope="col" class="num">unsicher</th><th scope="col" class="num">Fälle vollständig</th></tr></thead>
<tbody>${cats.map(x => `<tr><td data-label="Kategorie">${x.k}. ${esc(x.name)}</td><td class="num" data-label="Begriffe">${x.n}</td><td class="num" data-label="Eigenständig versucht">${x.ge}</td><td class="num" data-label="bestätigt">${x.be}</td><td class="num${x.un ? ' red' : ''}" data-label="unsicher">${x.un}</td><td class="num" data-label="Fälle vollständig">${x.anwN ? x.anwOk + '/' + x.anwN : '–'}</td></tr>`).join('')}</tbody></table>
<p class="fine">Der Nachweis einer Definition und das Ergebnis einer Fallfrage werden getrennt gezählt. Übungen nach einem Hinweis zählen nie als Nachweis.</p>
<section class="danger">
  <h2 class="mono-l">Durchlauf beenden</h2>
  <p>Startet eine neue Linie. Bestätigungen aus diesem Durchlauf werden nicht übernommen.</p>
  <div class="danger__row"><button class="btn btn--danger" data-action="reset">Durchlauf beenden und neu wählen</button></div>
  ${confirmBar('reset', 'Durchlauf wirklich beenden? Der bisherige Lernstand bleibt gespeichert, wird aber nicht in die neue Linie übernommen.', 'Durchlauf beenden', true)}
</section>`;
  }

  /* ---------- Lektion ---------- */
  function lessonGuess(r, L, x, i) {
    if (!x) return false;
    if (isGuess(x)) return true;
    if (x.guess === false) return false;
    const task = L.tasks[i];
    return !!r.log.findLast(e => e.slot === L.id && e.qid === task?.qid && e.nr === x.nr && e.kind === task?.kind)?.guess;
  }

  function lessonView(r) {
    const L = r.session;
    const t = L.tasks[L.i];
    const total = L.tasks.length;
    if (L.over || !t) return lessonEnd(r, L);
    const q = Q.get(t.qid);
    const srcName = q.src === 'original' ? 'Originalfrage ' + q.ref : q.src === 'uebung' ? 'Übungsfrage aus der Excel' : 'redaktionell ergänzt';
    const fnName = { def: 'Definition', abgr: 'Abgrenzung', anw: 'Anwendung' }[q.fn];
    const pflichtN = L.pflichtN || total;
    const guesses = L.tasks.map((_, i) => lessonGuess(r, L, L.results[i], i));
    const complete = L.results.filter((x, i) => x && !guesses[i] && x.res === 'voll').length;
    const incomplete = L.results.filter((x, i) => x && !guesses[i] && x.res !== 'voll').length;
    return `
<header class="band band--lesson">
  <div class="band__brand"><button class="backlink" data-action="leave">${ICON.back}<span>Zurück zum Fahrplan</span></button>
    <p class="brand__name">${esc(L.title)}</p>
    <p class="brand__sub">${L.phase === 'pflicht' ? 'Pflichtblock' : 'Lückenblock'}${L.gleis && L.gleis.length ? ' · Lerngruppe ' + L.gleis.map(esc).join(' · ') : ''}</p></div>
  <div class="band__main band__main--progress">
    <p class="lbl">Frage ${L.i + 1} von ${total}</p>
    <p class="via">Später im Fahrplan fortsetzen.</p>
    <span class="sr-only">${complete} vollständig, ${guesses.filter(Boolean).length} geraten, ${incomplete} unvollständig</span>
    <ol class="rail" aria-hidden="true">${L.tasks.map((x, k) => `<li class="rail__t${k < L.i ? ' is-done' : ''}${k === L.i - 1 ? ' is-just' : ''}${k === L.i ? ' is-now' : ''}${guesses[k] ? ' is-guess' : (L.results[k] && L.results[k].res !== 'voll') ? ' is-miss' : ''}${k === pflichtN ? ' is-split' : ''}"></li>`).join('')}</ol>
  </div>
</header>
<main id="main" class="lesson">
  <article class="qcard">
    <h1 class="question" tabindex="-1" id="qtext">${ui.stage === 'fix' ? fixTitle() : esc(q.text)}</h1>
    ${ui.stage === 'fix' ? `<p class="qref">Ausgangsfrage: ${esc(q.text)}</p>` : ''}
    <p class="qmeta"><span class="tag-ink">${ui.stage === 'fix' ? 'Korrektur' : KIND[t.kind]}</span><span>${fnName}</span><span>${srcName}</span>${t.short ? '<span class="tag-red">verkürzter Nachcheck</span>' : ''}${t.assisted ? '<span>zählt als Übung</span>' : ''}</p>
    ${q.fn === 'anw' ? '<p class="qref">Wende die Merkmale auf den konkreten Fall an. Fallfragen werden separat ausgewertet.</p>' : ''}
    ${t.short ? '<p class="qref">Ab Tag 7 genügt bei zwei vollständigen Erklärungen ein Tag Abstand für die Sprintbestätigung.</p>' : ''}
    ${ui.stage === 'ask' ? askPanel(r, t) : ''}
    ${ui.stage === 'rate' ? ratePanel(r, t, q) : ''}
    ${ui.stage === 'fix' && isGuess(L.results[L.i] || {}) ? '<p class="verdict verdict--guess">Ergebnis: geraten. Zählt als Übung.</p>' : ''}
    ${ui.stage === 'fix' ? fixPanel(r, t) : ''}
    ${storageControls(false)}
  </article>
</main>`;
  }
  function fixTitle() {
    const f = ui.fix; const name = esc(TERM.get(f.nr).name);
    if (f.type === 'cloze') return `Ergänze das fehlende Merkmal von „${name}“.`;
    if (f.type === 'tf') return `Stimmt diese Aussage über „${name}“?`;
    return `Welche Beschreibung passt zu „${name}“?`;
  }
  function askPanel(r, t) {
    return `<div class="answer">
  <label for="notes" class="lbl">Stichworte (optional, du kannst auch laut antworten)</label>
  <textarea id="notes" rows="4" placeholder="Was fällt dir dazu ein?">${esc(ui.notes || '')}</textarea>
  <div class="actions"><button class="btn btn--ink" data-action="check">Antwort prüfen ${ICON.go}</button><span class="fine-ink kbd">⌘/Strg + Enter</span>
  <button class="btn btn--quiet" data-action="dunno" aria-keyshortcuts="Alt+W">Weiß ich nicht <kbd>Alt+W</kbd></button>${canUndo(r, r.session) ? '<button class="btn btn--quiet" data-action="undo">Letzte Bewertung korrigieren</button>' : ''}</div>
</div>`;
  }
  function ratePanel(r, t, q) {
    const step = Math.min(ui.step || 0, t.terms.length - 1);
    const activeTerms = t.terms.length > 1 ? [t.terms[step]] : t.terms;
    let kIdx = 0;
    const blocks = activeTerms.map(nr => {
      const term = TERM.get(nr);
      const st = ui.marks[nr];
      const verdict = rateVerdict(nr);
      return `<section class="model">
  ${t.terms.length > 1 ? `<p class="lbl">Begriff ${step + 1} von ${t.terms.length}</p>` : ''}
  <h2 class="mono-l" tabindex="-1">${esc(term.name)}</h2>
  <p class="model__def">${esc(term.def)}</p>
  <p class="fine-ink">Musterantwort aus dem Glossar (Nr. ${term.nr}). <span class="lesson-ref">Lektion ${esc(term.lesson)}.</span>${q.fn === 'anw' ? ' Für die Fallfrage prüfst du zusätzlich, ob du die Merkmale auf den Fall angewendet hast.' : q.fn === 'abgr' ? ' Bei Abgrenzungsfragen zählt, ob du den Unterschied zum Vergleichsbegriff klar benannt hast.' : ''}</p>
  <fieldset class="crits"><legend class="lbl">Was hast du sinngemäß genannt? <span class="fine-ink">Kernaussage zählt, nicht Wortlaut · Tasten 1–9 bei Fokus in dieser Liste</span></legend>
    ${term.crit.map((c, i) => { kIdx++; return `<label class="crit"><input type="checkbox" data-action="mark" data-nr="${nr}" data-i="${i}"${kIdx <= 9 ? ` aria-keyshortcuts="${kIdx}"` : ''}${st.has[i] ? ' checked' : ''}><span class="crit__box">${ICON.check}</span><span>${esc(c.t)}</span><kbd>${kIdx <= 9 ? kIdx : ''}</kbd></label>`; }).join('')}
  </fieldset>
  <details class="rate-flags"${st.contra || st.conf ? ' open' : ''}><summary>Widerspruch oder Verwechslung angeben</summary>
    <label class="opt"><input type="checkbox" data-action="contra" data-nr="${nr}"${st.contra ? ' checked' : ''}><span class="crit__box">${ICON.check}</span><span>Meine Antwort enthielt einen fachlichen Widerspruch</span><span class="fine-ink">Überschreibt abgehakte Merkmale → falsch</span></label>
    ${term.conf.length ? `<label class="field field--inline"><span class="lbl">Verwechselt mit</span><select data-action="conf" data-nr="${nr}"><option value="">nichts verwechselt</option>${term.conf.map(c => `<option value="${c}"${String(st.conf) === String(c) ? ' selected' : ''}>${esc(TERM.get(c).name)}</option>`).join('')}</select></label>` : ''}
  </details>
  <label class="opt rate-guess"><input type="checkbox" data-action="guess" aria-keyshortcuts="Alt+G"${ui.guess ? ' checked' : ''}><span class="crit__box">${ICON.check}</span><span>War geraten ${t.terms.length > 1 ? '(ganze Antwort)' : ''} <kbd>Alt+G</kbd></span></label>
  <p class="verdict verdict--${verdict.style}" aria-live="polite" aria-atomic="true">${verdict.text}</p>
</section>`;
    }).join('');
    const notes = (ui.notes || '').trim();
    const isLast = step >= t.terms.length - 1;
    const footer = isLast ? `<div class="actions actions--split">
  <div class="actions">${step > 0 ? '<button class="btn btn--quiet" data-action="ratestep" data-dir="-1">Zurück</button>' : ''}<span class="fine-ink kbd">⌘/Strg + Enter</span><button class="btn btn--ink" data-action="save">Ergebnis speichern ${ICON.go}</button></div>
</div>` : `<div class="actions actions--split">
  ${step > 0 ? '<button class="btn btn--quiet" data-action="ratestep" data-dir="-1">Zurück</button>' : '<span></span>'}
  <div class="actions"><span class="fine-ink kbd">⌘/Strg + Enter</span><button class="btn btn--ink" data-action="ratestep" data-dir="1">Nächster Begriff ${ICON.go}</button></div>
</div>`;
    return `${notes ? `<section class="mine"><p class="lbl">Deine Stichworte</p><p>${esc(notes).replace(/\n/g, '<br>')}</p></section>` : ''}${blocks}${footer}`;
  }
  function rateVerdict(nr) {
    if (ui.guess) return { style: 'guess', text: 'Ergebnis: geraten. Zählt als Übung.' };
    if (ui.confirmEmpty) return { style: 'hint', text: 'Du hast keine Merkmale bewertet. Erneut speichern, um „falsch / nicht abrufbar“ zu erfassen.' };
    const res = derive(nr);
    if (!ui.touched && res === 'falsch') return { style: 'hint', text: 'Hake die Merkmale ab, die du genannt hast.' };
    return { style: res, text: 'Ergebnis: ' + RES[res] };
  }

  function derive(nr) {
    const st = ui.marks[nr];
    const term = TERM.get(nr);
    const n = term.crit.filter((c, i) => st.has[i]).length;
    if (st.contra || n === 0) return 'falsch';
    return n === term.crit.length ? 'voll' : 'teil';
  }

  // Gezieltes Feedback: Lückentext bei fehlendem Merkmal, Wahr/Falsch bei Verwechslung, Auswahl bei falsch.
  function fixPanel(r, t) {
    const f = ui.fix;
    const term = TERM.get(f.nr);
    let body = '';
    if (f.type === 'cloze') {
      const c = term.crit[f.i];
      const index = c.t.toLocaleLowerCase('de').indexOf(c.k.toLocaleLowerCase('de'));
      const before = index === -1 ? 'Gesuchter Begriff: ' : c.t.slice(0, index);
      const after = index === -1 ? '' : c.t.slice(index + c.k.length);
      body = `<p class="fix__lead">Dir fehlte dieses Merkmal.</p>
<p class="cloze">${esc(before)}<input id="cloze" class="cloze__in${f.done ? (f.ok ? ' is-ok' : ' is-no') : ''}" size="${Math.min(26, Math.max(6, c.k.length + 2))}" value="${esc(f.value || '')}" aria-label="Lücke" ${f.done ? 'readonly' : ''}>${esc(after)}</p>
${f.done ? `<p class="verdict verdict--${f.ok ? 'voll' : 'falsch'}" aria-live="polite">${f.ok ? 'Richtig.' : 'Gesucht war: <b>' + esc(c.k) + '</b>'}</p>` : `<div class="actions"><button class="btn btn--ink" data-action="cloze">Lücke prüfen</button><span class="fine-ink kbd">Enter</span></div>`}`;
    } else if (f.type === 'tf') {
      const other = TERM.get(f.other);
      body = `
<blockquote class="claim">„${esc(term.name)}“ bedeutet: ${esc(other.def)}</blockquote>
${f.done ? `<p class="verdict verdict--${f.ok ? 'voll' : 'falsch'}" aria-live="polite">${f.ok ? 'Richtig erkannt: Das' : 'Falsch: Das'} ist die Definition von <b>${esc(other.name)}</b>.</p>` : `<div class="actions fix-tf" role="group" aria-label="Aussage bewerten"><button class="btn btn--line" data-action="tf" data-v="1" aria-keyshortcuts="1">Stimmt <kbd>1</kbd></button><button class="btn btn--line" data-action="tf" data-v="0" aria-keyshortcuts="2">Stimmt nicht <kbd>2</kbd></button></div>`}`;
    } else {
      body = `<div class="choices" role="group" aria-label="Antwortmöglichkeiten">${f.opts.map((nr, k) => {
        const cls = f.done ? (nr === f.nr ? ' is-ok' : k === f.pick ? ' is-no' : '') : '';
        return `<button class="choice${cls}" data-action="choose" data-k="${k}" aria-keyshortcuts="${k + 1}" ${f.done ? 'disabled' : ''}><span>${esc(TERM.get(nr).def)}</span><kbd>${k + 1}</kbd></button>`;
      }).join('')}</div>
${f.done ? `<p class="verdict verdict--${f.ok ? 'voll' : 'falsch'}" aria-live="polite">${f.ok ? 'Richtig.' : 'Die markierte Beschreibung gehört zu ' + esc(TERM.get(f.opts[f.pick]).name) + '.'}</p>` : ''}`;
    }
    const canRetry = f.done && !ui.retried;
    const undoBtn = canUndo(r, r.session) ? `<button class="btn btn--quiet" data-action="undo">Letzte Bewertung korrigieren</button>` : '';
    return `<section class="fix">${body}
${f.done ? `<div class="actions actions--split"><div class="actions">${canRetry ? `<button class="btn btn--line" data-action="retry">Noch einmal offen erklären (neue Formulierung)</button>` : ''}${undoBtn}</div><div class="actions"><span class="fine-ink kbd">⌘/Strg + Enter</span><button class="btn btn--ink" data-action="next">Weiter ${ICON.go}</button></div></div>
${canRetry ? '<p class="fine-ink">Die erneute Erklärung zählt als Übung. Den Nachweis holst du an einem anderen Tag.</p>' : ''}` : `<div class="actions"><button class="btn btn--quiet" data-action="next" aria-keyshortcuts="Alt+S">Korrektur überspringen <kbd>Alt+S</kbd></button>${undoBtn}</div><p class="fine-ink">Deine Bewertung bleibt gespeichert.</p>`}
</section>`;
  }

  function lessonEnd(r, L) {
    const res = L.results.map((x, i) => x && { ...x, guess: lessonGuess(r, L, x, i) }).filter(Boolean);
    const guessed = res.filter(x => x.guess);
    const guessedNames = new Set();
    L.results.forEach((x, i) => {
      if (lessonGuess(r, L, x, i)) L.tasks[i].terms.forEach(nr => guessedNames.add(TERM.get(nr).name));
    });
    const A = analyze(r);
    const pflicht = L.results.slice(0, L.pflichtN || L.results.length).filter(Boolean);
    const unsure = [...new Set(res.filter(x => !x.guess && x.res !== 'voll').map(x => x.nr))].filter(nr => A.get(nr).status === 'unsicher');
    const firstFull = [...new Set(res.filter(x => !x.guess && x.res === 'voll' && x.indep && A.get(x.nr).first && A.get(x.nr).first.d === todayStr() && A.get(x.nr).first.res === 'voll').map(x => x.nr))];
    const canExtra = L.phase === 'pflicht' && L.mode === 'sprint' && L.extra;
    const extras = canExtra ? extraTasks(r, L) : [];
    let nextLine = '';
    const adaptiveToday = r.mode === 'adaptiv' && dayOf(r) <= MODES.adaptiv.days;
    const slot = adaptiveToday ? adaptiveSlot(r) : 0;
    const moreAdaptive = adaptiveToday && buildAdaptiveLesson(r, 1, true).tasks.some(Boolean);
    if (r.mode === 'sprint') {
      const n = nextSprint(r);
      nextLine = n ? (n.p.day <= dayOf(r) ? `Nächste Lektion: Tag ${n.p.day}, Lektion ${n.p.l}.` : `Nächster offener Check: Tag ${n.p.day}, ${wd(addDays(r.start, n.p.day - 1))} ${fmtDate(addDays(r.start, n.p.day - 1))}`) : 'Alle Lektionen gefahren.';
    } else {
      const dues = [...A.values()].filter(a => a.due && a.status !== 'bestaetigt').map(a => a.due).sort();
      nextLine = dues.length ? `Nächster offener Check: ${wd(dues[0])} ${fmtDate(dues[0])}` : '';
      const open = [...A.values()].filter(a => a.first && a.due <= todayStr() && !a.todayIndep && a.status !== 'bestaetigt');
      if (open.length) nextLine += ` ${plural(open.length, 'fällige Wiederholung', 'fällige Wiederholungen')} offen${open.some(a => Object.keys(a.conf).length) ? '; darunter eine wiederholte Verwechslung' : ''}.`;
      if (slot) nextLine += ` Lektion ${slot} ist heute noch offen.`;
    }
    const extraName = { fix: 'Kurzkorrektur', luecke: 'Lückenblock', vergleich: 'Vergleichs- und Fallfragen', nachpruef: 'Nachprüfungen', pruefcheck: 'Prüfungscheck' }[L.extra];
    return `
<header class="band band--lesson">
  <div class="band__brand"><button class="backlink" data-action="leave">${ICON.back}<span>Zurück zum Fahrplan</span></button><p class="brand__name">${esc(L.title)}</p><p class="brand__sub">angekommen</p></div>
  <div class="band__main"><h1 class="mono-xl" tabindex="-1" id="qtext">${pflicht.length ? plural(pflicht.length, L.phase === 'pflicht' ? 'Pflichtfrage' : 'Frage', L.phase === 'pflicht' ? 'Pflichtfragen' : 'Fragen') + ' abgeschlossen' : 'Keine Aufgaben fällig'}</h1>
  <p class="via">${unsure.length ? plural(unsure.length, 'Begriff ist', 'Begriffe sind') + ' noch unsicher' : 'Keine neue Unsicherheit aus eigenständigen Antworten'}. ${nextLine}</p></div>
</header>
<main id="main" class="wrap">
  ${unsure.length ? `<table class="board board--unsure board--stack"><caption>Noch unsicher</caption><thead><tr><th scope="col" class="num">Nr.</th><th scope="col">Begriff</th><th scope="col">Fehlerbild</th></tr></thead><tbody>${unsure.map(nr => {
      const x = res.filter(y => !y.guess && y.nr === nr).pop(); const term = TERM.get(nr);
      return `<tr class="row--st-unsicher"><td class="num" data-label="Nr.">${nr}</td><td data-label="Begriff"><b>${esc(term.name)}</b></td><td data-label="Fehlerbild">${x.conf ? 'verwechselt mit ' + esc(TERM.get(x.conf).name) : (x.miss || []).length ? 'fehlt: ' + esc(term.crit[x.miss[0]].t) : 'nicht abrufbar'}</td></tr>`;
    }).join('')}</tbody></table>` : ''}
  ${firstFull.length ? `<p class="milestone"><span aria-hidden="true">${ICON.check}</span><span><b>Erster Nachweis gesichert.</b> ${plural(firstFull.length, 'Begriff', 'Begriffe')} heute erstmals vollständig und ohne Hilfe erklärt.</span></p>` : ''}
  ${guessed.length ? `<section class="result-note"><h2 class="mono-l">Geraten</h2><p>${plural(guessed.length, 'Antwort als Übung gespeichert', 'Antworten als Übung gespeichert')}. Der Zähler „eigenständig versucht“ bleibt für diese Versuche unverändert. ${[...guessedNames].map(esc).join(', ')}.</p></section>` : ''}
  ${L.held && L.held.length ? `<p class="fine">${plural(L.held.length, 'Zweitcheck', 'Zweitchecks')} noch nicht möglich, weil der Erstabruf weniger als zwei Tage zurückliegt. Sie rücken automatisch in die nächste passende Lektion nach.</p>` : ''}
  <div class="actions">
    ${extras.length ? `<button class="btn btn--ink" data-action="extra">${extraName}: ${plural(extras.length, 'Aufgabe', 'Aufgaben')} ${ICON.go}</button>` : ''}
    ${slot ? `<button class="btn btn--ink" data-action="lesson" data-id="slot${slot}">Lektion ${slot} starten ${ICON.go}</button>` : ''}
    <button class="btn ${slot || extras.length ? 'btn--line' : 'btn--ink'}" data-action="leave">Zum Fahrplan</button>
    ${moreAdaptive ? '<button class="btn btn--quiet" data-action="lesson" data-id="extra">Optionalen Zusatzblock starten</button>' : ''}
    ${canUndo(r, L) ? '<button class="btn btn--quiet" data-action="undo">Letzte Bewertung korrigieren</button>' : ''}
  </div>
  ${canExtra && !extras.length ? '<p class="fine">Für diese Lektion gibt es keine offenen Lücken.</p>' : ''}
  ${storageControls(false)}
</main>`;
  }

  /* ---------- Ablauf einer Aufgabe ---------- */
  function syncUi(r, draft = null) {
    if (!r?.session) return false;
    r.session.ui = ui;
    return save(S, false, draft);
  }
  function newTaskUi(t, r) {
    ui = { stage: 'ask', notes: '', marks: {}, guess: false, retried: false, touched: false };
    t.terms.forEach(nr => { ui.marks[nr] = { has: {}, contra: false, conf: '' }; });
    if (r && r.session) r.session.ui = ui;
  }
  function startLesson(r, L) {
    L.tasks = L.tasks.filter(Boolean);
    L.pflichtN = L.tasks.length;
    clearTimeout(nTimer);
    lastUndo = null;
    r.session = L;
    if (L.tasks[0]) newTaskUi(L.tasks[0], r);
    else finishBlock(r);
    if (save()) { render(); focusQ(); }
  }
  function focusQ() { const el = document.getElementById('qtext'); if (el) el.focus({ preventScroll: false }); window.scrollTo(0, 0); }
  function focusRate() { const el = document.querySelector('.model h2'); if (el) { el.focus({ preventScroll: true }); el.scrollIntoView({ block: 'nearest' }); } }
  function focusFix() { const el = document.querySelector('#cloze, .fix [data-action="tf"], .fix .choice'); if (el) el.focus({ preventScroll: false }); }
  function focusAfterFix() { const el = document.querySelector('.fix [data-action="next"]'); if (el) el.focus({ preventScroll: false }); }

  function saveResult(r) {
    const draft = currentDraft(true);
    const L = r.session; const t = L.tasks[L.i]; const q = Q.get(t.qid);
    lastUndo = {
      runId: r.id, sessionId: L.id, i: L.i, logLen: r.log.length,
      prevLastQ: Object.assign({}, r.lastQ), prevSeen: Object.assign({}, r.seen),
      prevResult: L.results[L.i] || null,
      hadDone: L.id in r.done, prevDone: L.id in r.done ? Object.assign({}, r.done[L.id]) : null,
      prevUi: JSON.parse(JSON.stringify({ notes: ui.notes, marks: ui.marks, guess: ui.guess, touched: true })),
    };
    const perTerm = {};
    t.terms.forEach(nr => {
      const st = ui.marks[nr];
      const term = TERM.get(nr);
      perTerm[nr] = { res: derive(nr), miss: term.crit.map((c, i) => i).filter(i => !st.has[i]), conf: st.conf ? +st.conf : null };
    });
    const A0 = analyze(r);
    record(r, t, perTerm, { guess: ui.guess });
    // Erstes nicht vollständiges Ergebnis entscheidet, ob korrigiert wird.
    const bad = t.terms.find(nr => perTerm[nr].res !== 'voll');
    const shown = bad || t.terms[0];
    L.results[L.i] = { ...perTerm[shown], nr: shown, guess: !!ui.guess,
      res: ui.guess ? 'geraten' : perTerm[shown].res,
      indep: !ui.guess && !t.assisted && q.fn !== 'anw' && !A0.get(shown).todayIndep };
    const inPflichtSprint = L.mode === 'sprint' && L.phase === 'pflicht';
    if (bad && q.fn !== 'anw' && !inPflichtSprint) {
      ui.fix = makeFix(bad, perTerm[bad]);
      ui.stage = 'fix';
      if (syncUi(r, draft)) { render(); focusFix(); }
      return;
    }
    if (ui.guess) toast('Als geraten und als Übung erfasst.');
    else if (bad && inPflichtSprint) toast(perTerm[bad].res === 'teil' ? 'Auf die Lückenliste: ' + TERM.get(bad).crit[perTerm[bad].miss[0]].t : 'Auf die Lückenliste gesetzt. Reparatur folgt nach dem Pflichtblock.');
    nextTask(r, draft);
  }
  function makeFix(nr, pt) {
    const term = TERM.get(nr);
    if (pt.conf) return { nr, type: 'tf', other: Math.random() < 0.5 ? nr : pt.conf };
    if (pt.res === 'teil' && pt.miss.length) return { nr, type: 'cloze', i: pt.miss[0] };
    const pool = term.conf.length ? term.conf.slice(0, 2) : TERMS.filter(x => x.cat === term.cat && x.nr !== nr).slice(0, 2).map(x => x.nr);
    while (pool.length < 2) pool.push(TERMS[(nr + pool.length * 17) % TERMS.length].nr);
    return { nr, type: 'choice', opts: shuffle([nr, ...pool], nr) };
  }
  function nextTask(r, draft = currentDraft(true)) {
    const L = r.session;
    L.i++;
    if (L.i >= L.tasks.length) finishBlock(r);
    else newTaskUi(L.tasks[L.i], r);
    if (save(S, false, draft)) { render(); focusQ(); }
  }
  function finishBlock(r) {
    const L = r.session;
    L.over = true;
    const gaps = new Set();
    let guesses = 0;
    let incomplete = 0;
    L.results.forEach((x, i) => {
      if (!x) return;
      if (lessonGuess(r, L, x, i)) {
        guesses++;
        L.tasks[i].terms.forEach(nr => gaps.add(nr));
      } else if (x.res !== 'voll') {
        gaps.add(x.nr);
        incomplete++;
      }
    });
    const prev = r.done[L.id];
    if (!L.extraBlock || !prev) {
      r.done[L.id] = Object.assign({}, prev || {}, { date: todayStr(), n: L.results.length, gaps: [...new Set([...(prev?.gaps || []), ...gaps])], summary: `${L.results.filter(Boolean).length} Fragen · ${incomplete} unvollständig${guesses ? ' · ' + guesses + ' geraten' : ''}` });
    }
  }

  /* ---------- Ereignisse ---------- */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-action]');
    if (!b) return;
    const a = b.dataset.action;
    if (refresh(true)) return;
    const r = run();
    if (a === 'dismiss-draft') {
      conflictDraft = null;
      render(true);
      return;
    }
    if (a === 'restore-draft') {
      if (!conflictDraft || !canRestoreDraft(conflictDraft)) return;
      const draft = conflictDraft;
      ui = draft.ui;
      if (!syncUi(run(), draft)) return;
      conflictDraft = null;
      render(true);
      return;
    }
    if (a === 'confirm-no') {
      const c = view.confirm;
      view.confirm = null;
      pendingImport = null;
      render();
      if (c?.focusSel) document.querySelector(c.focusSel)?.focus();
      return;
    }
    if (a === 'confirm-yes') {
      const c = view.confirm;
      view.confirm = null;
      if (!c) return;
      if (c.type === 'restore') { const backup = backupState(); if (backup) replaceState(backup); return; }
      if (c.type === 'restart') { replaceState(empty()); return; }
      if (c.type === 'import') {
        const parsed = pendingImport; pendingImport = null;
        if (parsed && replaceState(parsed, true)) toast('Lernstand importiert.');
        return;
      }
      if (c.type === 'delete-run') {
        const target = S.runs.find(past => past.id === c.id);
        if (target?.endedAt && !r) replaceState({ ...S, runs: S.runs.filter(past => past.id !== target.id) });
        return;
      }
      if (c.type === 'reset' && r) {
        r.endedAt = todayStr(); S.active = null; lastUndo = null; if (save()) render(true); return;
      }
      if (c.type === 'discard-lesson' && r?.session?.paused) {
        r.session = null;
        lastUndo = null;
        if (save()) {
          render(true);
          document.querySelector('[data-action="lesson"]')?.focus();
        }
        return;
      }
      return;
    }
    if (a === 'restore') {
      if (backupState()) openConfirm('restore', '[data-action="restore"]');
      return;
    }
    if (a === 'restart') {
      openConfirm('restart', '[data-action="restart"]');
      return;
    }
    if (storageCorrupt) return;
    if (a === 'start') {
      const id = 'r' + (window.crypto?.randomUUID?.() || Date.now() + '-' + Math.random().toString(36).slice(2));
      S.runs.push({ id, mode: b.dataset.mode, start: todayStr(), log: [], done: {}, lastQ: {}, seen: {}, session: null });
      S.active = id; view.tab = 'fahrplan'; if (save()) render(true); return;
    }
    if (a === 'resume') {
      const target = S.runs.find(x => x.id === b.dataset.id);
      if (target) {
        delete target.endedAt;
        S.active = target.id;
        ui = target.session?.ui || {};
        view.tab = 'fahrplan';
        if (save()) render(true);
      }
      return;
    }
    if (a === 'export') {
      const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = `lernstand-${todayStr()}.json`;
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast('Lernstand exportiert.'); return;
    }
    if (a === 'delete-run') {
      const target = S.runs.find(past => past.id === b.dataset.id);
      if (!target?.endedAt || r) return;
      openConfirm('delete-run', `[data-action="delete-run"][data-id="${escSel(target.id)}"]`, target.id);
      return;
    }
    if (!r) return;
    if (a === 'resume-lesson' && r.session?.paused) {
      ui = r.session.ui || {};
      r.session.paused = false;
      if (save()) {
        render(true);
        if (!conflictDraft && ui.stage === 'rate') focusRate();
        if (!conflictDraft && ui.stage === 'fix' && !ui.fix.done) focusFix();
      }
      return;
    }
    if (a === 'discard-lesson' && r.session?.paused) {
      openConfirm('discard-lesson', '[data-action="discard-lesson"]');
      return;
    }
    if (a === 'tab') { view.tab = b.dataset.tab; render(); document.querySelector('.tab.is-on')?.focus(); return; }
    if (a === 'resetfilters') { clearTimeout(qTimer); view.filter = 'alle'; view.cat = '0'; view.query = ''; render(); document.querySelector('[data-action="query"]')?.focus(); return; }
    if (a === 'catgroup') { const k = b.dataset.cat; if (!view.openCats.delete(k)) view.openCats.add(k); render(); document.querySelector(`[data-action="catgroup"][data-cat="${k}"]`)?.focus(); return; }
    if (a === 'openrow') { const id = b.dataset.id; const cur = view.openRow === undefined ? null : view.openRow; view.openRow = cur === id ? null : id; render(); document.querySelector(`[data-action="openrow"][data-id="${id}"]`)?.focus(); return; }
    if (a === 'open') { const nr = +b.dataset.nr; view.open = view.open === nr ? null : nr; render(); document.querySelector(`[data-action="open"][data-nr="${nr}"]`)?.focus(); return; }
    if (a === 'lesson') {
      if (r.session && !r.session.over) return;
      const id = b.dataset.id;
      let L;
      if (r.mode === 'sprint') L = buildSprintLesson(r, PLAN.find(p => p.id === id));
      else if (id === 'extra') L = Object.assign(buildAdaptiveLesson(r, 1, true), { id: 'a' + dayOf(r) + 'x' + Date.now() });
      else if (id === 'gaps') {
        const A = analyze(r);
        const tasks = priorityList(r, A).slice(0, 8).map(x => task(r, x.a.nr, x.a.todayIndep ? 'uebung' : 'luecke', { assisted: x.a.todayIndep })).filter(Boolean);
        L = { id: 'g' + Date.now(), mode: 'adaptiv', title: 'Lückenblock', gleis: [], tasks, held: [], i: 0, phase: 'luecke', results: [], extraBlock: true };
      } else L = buildAdaptiveLesson(r, +id.replace('slot', ''));
      startLesson(r, L); return;
    }
    if (a === 'reset') {
      openConfirm('reset', '[data-action="reset"]');
      return;
    }
    const L = r.session;
    if (!inLesson(r)) return;
    if (a === 'leave') {
      clearTimeout(nTimer);
      view.tab = 'fahrplan';
      if (L.over) {
        r.session = null;
        lastUndo = null;
      } else {
        L.ui = ui;
        L.paused = true;
      }
      if (save()) {
        render(true);
        if (!conflictDraft) document.querySelector('[data-action="resume-lesson"]')?.focus();
      }
      return;
    }
    if (a === 'undo') {
      if (!canUndo(r, L)) return;
      const draft = currentDraft(true);
      r.log.length = lastUndo.logLen;
      r.lastQ = lastUndo.prevLastQ;
      r.seen = lastUndo.prevSeen;
      L.i = lastUndo.i;
      L.over = false;
      if (lastUndo.prevResult) L.results[L.i] = lastUndo.prevResult;
      else L.results.splice(L.i, 1);
      if (lastUndo.hadDone) r.done[L.id] = lastUndo.prevDone;
      else delete r.done[L.id];
      ui = { stage: 'rate', notes: lastUndo.prevUi.notes, marks: lastUndo.prevUi.marks, guess: lastUndo.prevUi.guess, retried: false, touched: true };
      r.session.ui = ui;
      lastUndo = null; if (save(S, false, draft)) { render(); focusQ(); } return;
    }
    if (a === 'check') { ui.stage = 'rate'; if (syncUi(r)) { render(); focusRate(); } return; }
    if (a === 'dunno') { ui.stage = 'rate'; ui.touched = true; if (syncUi(r)) { render(); focusRate(); } return; }
    if (a === 'mark') return; // über change
    if (a === 'ratestep') { const t = L.tasks[L.i]; if (t) { ui.step = Math.max(0, Math.min(t.terms.length - 1, (ui.step || 0) + (+b.dataset.dir || 1))); if (syncUi(r)) { render(); focusRate(); } } return; }
    if (a === 'save') {
      if (ui.stage !== 'rate') return;
      if (!ui.touched && !ui.guess && !ui.confirmEmpty) {
        ui.confirmEmpty = true;
        L.tasks[L.i].terms.forEach(updateVerdict);
        syncUi(r);
        return;
      }
      saveResult(r); return;
    }
    if (a === 'cloze') {
      const v = (document.getElementById('cloze') || {}).value || '';
      if (!norm(v)) { toast('Bitte erst das fehlende Wort eintragen.'); document.getElementById('cloze')?.focus(); return; }
      const k = TERM.get(ui.fix.nr).crit[ui.fix.i].k;
      ui.fix.value = v; ui.fix.done = true; ui.fix.ok = clozeMatches(k, v);
      if (syncUi(r)) { render(); focusAfterFix(); } return;
    }
    if (a === 'tf') { ui.fix.done = true; ui.fix.ok = (b.dataset.v === '1') === (ui.fix.other === ui.fix.nr); if (syncUi(r)) { render(); focusAfterFix(); } return; }
    if (a === 'choose') { const k = +b.dataset.k; ui.fix.pick = k; ui.fix.done = true; ui.fix.ok = ui.fix.opts[k] === ui.fix.nr; if (syncUi(r)) { render(); focusAfterFix(); } return; }
    if (a === 'retry') {
      // Eine unmittelbare erneute Erklärung mit neuem Wortlaut, als Übung.
      const draft = currentDraft(true);
      const t = L.tasks[L.i];
      const q = pickQuestion(r, ui.fix.nr, { avoid: [t.qid] });
      if (!q) { toast('Keine weitere Frage verfügbar.'); return; }
      const nt = { nr: ui.fix.nr, qid: q.id, terms: q.terms, kind: 'uebung', assisted: true };
      L.tasks.splice(L.i + 1, 0, nt);
      L.results.splice(L.i + 1, 0, null);
      L.i++; newTaskUi(nt, r); ui.retried = true; lastUndo = null; if (save(S, false, draft)) { render(); focusQ(); } return;
    }
    if (a === 'next') { nextTask(r); return; }
    if (a === 'extra') {
      const tasks = extraTasks(r, L).filter(Boolean);
      if (!tasks.length) { toast('Keine weiteren Aufgaben verfügbar.'); return; }
      L.tasks = L.tasks.concat(tasks); L.results.length = L.i; L.phase = 'luecke'; L.over = false;
      L.pflichtN = L.i; newTaskUi(L.tasks[L.i], r); if (save()) { render(); focusQ(); } return;
    }
  });
  function clozeMatches(solution, answer) {
    const expected = norm(solution);
    const actual = norm(answer);
    return expected === actual || (expected.startsWith(actual) &&
      actual.length >= Math.max(5, Math.ceil(expected.length * 0.7)));
  }

  function norm(s) { return String(s || '').toLowerCase().replace(/[^a-zäöüß0-9]/g, ''); }

  function updateTermsResults() {
    if (refresh(true)) return true;
    const r = run();
    if (!r || inLesson(r) || view.tab !== 'begriffe') return true;
    const table = document.querySelector('.board--terms');
    const tbody = table?.querySelector?.('tbody');
    const caption = table?.querySelector?.('caption');
    if (tbody && caption) {
      const { countText, bodyHtml } = termsRows(r, analyze(r));
      caption.textContent = countText;
      tbody.innerHTML = bodyHtml;
      return true;
    }
    return false;
  }

  document.addEventListener('change', e => {
    const el = e.target;
    const a = el.dataset && el.dataset.action;
    if (!a) return;
    if (a !== 'import' && storageCorrupt) return;
    if (a === 'cat' || a === 'filter') {
      if (refresh(true)) return;
      clearTimeout(qTimer);
      view[a] = el.value;
      if (!updateTermsResults()) {
        render();
        document.querySelector(`[data-action="${a}"]`)?.focus();
      }
      return;
    }
    if (a === 'import') {
      const f = el.files && el.files[0];
      if (!f) return;
      const before = snapshot;
      const reader = new FileReader();
      reader.onerror = () => toast('Die Datei konnte nicht gelesen werden.');
      reader.onload = () => {
        const parsed = parseState(reader.result);
        if (!parsed) { toast('Ungültiger Lernstand. Dein bisheriger Stand bleibt erhalten.'); return; }
        if (refresh(true) || before !== snapshot) {
          toast('Der Lernstand hat sich geändert. Wähle die Importdatei erneut.');
          return;
        }
        pendingImport = parsed;
        openConfirm('import', '[data-action="import"]');
      };
      el.value = '';
      reader.readAsText(f);
      return;
    }
    const r = run();
    const task = r?.session?.tasks[r.session.i];
    if (!inLesson(r) || !task || ui.stage !== 'rate' || !['mark', 'contra', 'conf', 'guess'].includes(a)) return;
    const nr = +el.dataset.nr;
    if (a === 'guess') ui.guess = el.checked;
    else {
      ui.touched = true;
      if (a === 'mark') ui.marks[nr].has[+el.dataset.i] = el.checked;
      if (a === 'contra') ui.marks[nr].contra = el.checked;
      if (a === 'conf') ui.marks[nr].conf = el.value;
    }
    ui.confirmEmpty = false;
    if (syncUi(r)) task.terms.forEach(updateVerdict);
  });
  function updateVerdict(nr) {
    const sec = document.querySelector(`[data-action="mark"][data-nr="${nr}"]`)?.closest('.model');
    const v = sec && sec.querySelector('.verdict');
    if (!v) return;
    const verdict = rateVerdict(nr);
    const cls = 'verdict verdict--' + verdict.style;
    if (v.className !== cls) v.className = cls;
    if (v.textContent !== verdict.text) v.textContent = verdict.text;
  }
  let qTimer, nTimer;
  document.addEventListener('input', e => {
    if (storageCorrupt) return;
    if (e.target.dataset.action === 'query') {
      if (refresh(true)) return;
      view.query = e.target.value;
      clearTimeout(qTimer);
      qTimer = setTimeout(() => {
        if (!updateTermsResults()) {
          const active = document.activeElement;
          const queryEl = document.querySelector('[data-action="query"]');
          const pos = queryEl && queryEl === active ? queryEl.selectionStart : null;
          render();
          if (pos !== null) {
            const inp = document.querySelector('[data-action="query"]');
            if (inp) { inp.focus(); inp.setSelectionRange(pos, pos); }
          }
        }
      }, 120);
    }
    if (e.target.id === 'notes' || (e.target.id === 'cloze' && ui.fix && !ui.fix.done)) {
      if (e.target.id === 'notes') ui.notes = e.target.value;
      else ui.fix.value = e.target.value;
      if (refresh(true)) return;
      clearTimeout(nTimer);
      nTimer = setTimeout(() => syncUi(run()), 250);
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && view.confirm) {
      e.preventDefault();
      const c = view.confirm;
      view.confirm = null;
      pendingImport = null;
      render();
      if (c.focusSel) document.querySelector(c.focusSel)?.focus();
      return;
    }
    const r = run();
    if (!r) return;
    if (!inLesson(r)) {
      if (e.key === 'Escape') {
        if (view.openRow) { const id = view.openRow; view.openRow = null; render(); document.querySelector(`[data-action="openrow"][data-id="${id}"]`)?.focus(); }
        else if (view.open) { const nr = view.open; view.open = null; render(); document.querySelector(`[data-action="open"][data-nr="${nr}"]`)?.focus(); }
      }
      if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Home' || e.key === 'End') && document.activeElement && document.activeElement.getAttribute('role') === 'tab') {
        const tabs = [...document.querySelectorAll('[role="tab"]')];
        const idx = tabs.indexOf(document.activeElement);
        if (idx >= 0) {
          e.preventDefault();
          const targetIdx = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (idx + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
          tabs[targetIdx].click();
        }
      }
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      document.querySelector('.band__brand [data-action="leave"]')?.click();
      return;
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      const btn = document.querySelector('.qcard [data-action="check"], .qcard [data-action="ratestep"][data-dir="1"], .qcard [data-action="save"], .qcard [data-action="cloze"], .qcard [data-action="next"]:not([aria-keyshortcuts])');
      btn && btn.click();
      return;
    }
    const active = document.activeElement;
    const inField = active && /INPUT|TEXTAREA|SELECT/.test(active.tagName === 'INPUT' && active.type === 'checkbox' ? 'X' : active.tagName);
    if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.repeat) {
      const action = { KeyW: 'dunno', KeyG: 'guess', KeyS: 'next' }[e.code];
      const shortcut = action && document.querySelector(`.qcard [data-action="${action}"][aria-keyshortcuts]`);
      if (shortcut) { e.preventDefault(); shortcut.click(); }
      return;
    }
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (ui.stage === 'rate' && /^[1-9]$/.test(e.key) && !inField) {
      const group = active?.closest?.('.crits');
      const box = group && group.querySelectorAll('[data-action="mark"]')[+e.key - 1];
      if (box) { e.preventDefault(); box.checked = !box.checked; box.dispatchEvent(new Event('change', { bubbles: true })); }
    }
    if (ui.stage === 'fix' && ui.fix && !ui.fix.done && /^[1-3]$/.test(e.key) && !inField) {
      if (ui.fix.type === 'choice') {
        const group = active?.closest?.('.choices');
        const btn = group && group.querySelector(`[data-action="choose"][data-k="${+e.key - 1}"]`);
        if (btn) { e.preventDefault(); btn.click(); }
      } else if (ui.fix.type === 'tf' && (e.key === '1' || e.key === '2')) {
        const group = active?.closest?.('.fix-tf');
        const btn = group && group.querySelector(`[data-action="tf"][data-v="${e.key === '1' ? 1 : 0}"]`);
        if (btn) { e.preventDefault(); btn.click(); }
      }
    }
    if (e.key === 'Enter' && e.target.id === 'cloze') { e.preventDefault(); document.querySelector('[data-action="cloze"]')?.click(); }
  });

  function replaceState(next, backup = false) {
    if (!save(next, backup)) return false;
    adopt(next);
    render(true);
    return true;
  }

  window.addEventListener('storage', e => {
    if (e.key === KEY || e.key === null) refresh(true);
  });
  window.addEventListener('resize', updateTableScrollHints);

  let toastTimer, toastClearTimer;
  function ensureToast() {
    let el = document.querySelector('.toast');
    if (!el && document.body) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite'); document.body.appendChild(el); }
    return el;
  }
  function toast(msg) {
    const el = ensureToast();
    if (!el) return;
    clearTimeout(toastTimer);
    clearTimeout(toastClearTimer);
    el.textContent = msg; el.classList.add('is-on');
    toastTimer = setTimeout(() => {
      el.classList.remove('is-on');
      toastClearTimer = setTimeout(() => { if (!el.classList.contains('is-on')) el.textContent = ''; }, 500);
    }, 5000);
  }

  // Test-Hooks für die Regressionstests.
  window.ZT = { analyze, pickQuestion, buildSprintLesson, buildAdaptiveLesson, clozeMatches, makeFix, todayStr, PLAN, state: () => S, render };

  ensureToast();
  ui = run()?.session?.ui || {};
  render();
})();
