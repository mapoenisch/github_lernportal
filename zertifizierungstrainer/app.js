/* Zertifizierungstrainer · eine App, zwei Planungslogiken (7‑Tage‑Sprint, adaptiver 3‑Wochen‑Trainer). */
(function () {
  'use strict';

  const D = window.ZT_DATA;
  const TERMS = D.terms;
  const TERM = new Map(TERMS.map(t => [t.nr, t]));
  const Q = new Map(D.questions.map(q => [q.id, q]));
  const QBY = new Map(TERMS.map(t => [t.nr, []]));
  D.questions.forEach(q => q.terms.forEach(nr => QBY.get(nr).push(q)));
  const GROUP_OF = new Map();
  Object.entries(D.groups).forEach(([g, list]) => list.forEach(nr => GROUP_OF.set(nr, g)));

  const MODES = {
    sprint: { name: '7‑Tage‑Sprint', days: 7, gap: 2 },
    adaptiv: { name: '3‑Wochen‑Trainer', days: 21, gap: 3 },
  };
  const RES = { voll: 'vollständig', teil: 'teilweise', falsch: 'falsch / nicht abrufbar' };
  const KIND = { erst: 'Erstabruf', wdh: 'Wiederholung', luecke: 'Lückencheck', pruef: 'Prüfungsstil', uebung: 'Übung' };

  // Zeitreise nur auf Loopback und mit eigenem, vom Lernstand getrennten Speicher.
  const params = new URLSearchParams(location.search);
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  const offset = local ? Number(params.get('zeitreise')) : 0;
  const timeOffset = Number.isInteger(offset) && Math.abs(offset) <= 365 ? offset : 0;
  const KEY = 'zt.v1' + (timeOffset ? '.zeitreise' : '');

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
    optionalFlag(v.indep);
  const entry = e => result(e) && date(e.d) && number(e.day) && question(e.qid) &&
    Q.get(e.qid).terms.includes(e.nr) && e.fn === Q.get(e.qid).fn && Object.hasOwn(KIND, e.kind) &&
    optionalFlag(e.guess) && optionalFlag(e.assisted);
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
        !['pflicht', 'luecke'].includes(l.phase) || !optionalFlag(l.over) ||
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

  function save(next = S, backup = false) {
    try {
      if (localStorage.getItem(KEY) !== snapshot) {
        refresh(true);
        return false;
      }
      if (backup && snapshot !== null && !storageCorrupt) localStorage.setItem(KEY + '.backup', snapshot);
      if (storageCorrupt && snapshot !== null) localStorage.setItem(KEY + '.corrupt', snapshot);
      const raw = JSON.stringify(next);
      localStorage.setItem(KEY, raw);
      snapshot = raw;
      return true;
    } catch {
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
      if (e.fn === 'anw') { a.anw.push(e.res); return; }
      if (!e.indep) { a.practice++; return; }
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
    ungeprueft: 'ungeprüft', unsicher: 'unsicher', einmal: 'einmal vollständig', bestaetigt: 'bestätigt',
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
    { day: 5, l: 2, wdh: 'C2', erst: 'E2', extra: 'luecke', cap: 3, note: 'Sollstand danach: alle 139 Begriffe erstmals geprüft.' },
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
  function adaptivePlanInfo(r, A) {
    const day = dayOf(r);
    const c = stats(r, A);
    const today = todayStr();
    const newToday = [...A.values()].filter(a => a.first && a.first.d === today).length;
    const daysLeft = Math.max(1, 14 - day + 1);
    const perDay = day <= 14 ? Math.ceil((c.ungeprueft + newToday) / daysLeft) : c.ungeprueft;
    const due = [...A.values()].filter(a => a.first && a.due <= today && !a.todayIndep && a.status !== 'bestaetigt');
    const control = [...A.values()].filter(a => a.status === 'bestaetigt' && a.due <= today && !a.todayIndep && day <= 21);
    const phase = day <= 7 ? 1 : day <= 14 ? 2 : 3;
    return { day, c, newToday, perDay, quotaLeft: Math.max(0, perDay - newToday), due, control, phase, daysLeft };
  }
  function buildAdaptiveLesson(r, slot, extraBlock) {
    const A = analyze(r);
    const info = adaptivePlanInfo(r, A);
    const today = todayStr();
    const tasks = []; const used = new Set();
    const dueSorted = info.due.slice().sort((x, y) => (y.lastRes === 'falsch') - (x.lastRes === 'falsch') || y.wrong - x.wrong || x.due.localeCompare(y.due));
    if (slot === 2 && !extraBlock) {
      // Lektion 2: Lücken aus Lektion 1 mit neuem Wortlaut aufgreifen (zählt als Übung).
      const l1 = (r.done['a' + info.day + 'l1'] || {}).gaps || [];
      l1.slice(0, 4).forEach(nr => { tasks.push(task(r, nr, 'uebung', { assisted: true, correctFirst: false })); used.add(nr); });
    }
    const pushDue = n => dueSorted.forEach(a => { if (n > 0 && !used.has(a.nr)) { tasks.push(task(r, a.nr, 'wdh')); used.add(a.nr); n--; } });
    pushDue(slot === 1 ? 6 : 4);
    const unchecked = interleaved(TERMS.filter(t => !A.get(t.nr).first).map(t => t.nr));
    let quota = extraBlock ? 6 : info.phase === 3 ? Math.min(unchecked.length, 6) : Math.ceil(info.quotaLeft / (slot === 1 && !r.done['a' + info.day + 'l1'] ? 2 : 1));
    if (info.phase === 1 && !extraBlock) quota = Math.max(quota, 6);
    unchecked.slice(0, quota).forEach(nr => { tasks.push(task(r, nr, 'erst')); used.add(nr); });
    pushDue(12 - tasks.length);
    if (tasks.length < 12) info.control.slice(0, 12 - tasks.length).forEach(a => { if (!used.has(a.nr)) { tasks.push(task(r, a.nr, 'wdh', { control: true })); used.add(a.nr); } });
    if (info.phase >= 2 || (slot === 2 && tasks.length < 8)) {
      const solid = [...A.values()].filter(a => a.status !== 'ungeprueft' && a.lastRes === 'voll').map(a => a.nr);
      const cases = D.questions.filter(q => q.fn === 'anw' && (info.phase === 3 || !q.reserved) && q.terms.some(nr => solid.includes(nr)) && !r.seen[q.id]);
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
        res: pt.res, miss: pt.miss, guess: !!extra.guess, assisted: !!t.assisted, indep, conf: pt.conf || null });
      r.lastQ[nr] = q.id;
    });
    r.seen[q.id] = true;
  }

  /* ---------- Ansicht & Routing ---------- */
  const app = document.getElementById('app');
  let view = { tab: 'fahrplan', filter: 'alle', cat: '0', query: '', open: null, openRow: undefined, openCat: null, confirm: null };
  let ui = {}; // Zustand der aktuellen Aufgabe
  let lastUndo = null;
  let pendingImport = null;

  function confirmBar(type, msg, okLabel, danger, id) {
    if (!view.confirm || view.confirm.type !== type || (id !== undefined && view.confirm.id !== id)) return '';
    return `<div class="confirm-bar${danger ? ' confirm-bar--danger' : ''}" role="alert">
  <p>${esc(msg)}</p>
  <div class="actions">
    <button class="btn ${danger ? 'btn--danger' : 'btn--ink'}" data-action="confirm-yes">${esc(okLabel)}</button>
    <button class="btn btn--quiet" data-action="confirm-no">Abbrechen</button>
  </div>
</div>`;
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
    view = { tab: 'fahrplan', filter: 'alle', cat: '0', query: '', open: null, openRow: undefined, openCat: null, confirm: null };
    pendingImport = null;
  }

  function refresh(notify) {
    const latest = read(KEY);
    if (latest === snapshot) return false;
    snapshot = latest;
    adopt(parseState(latest));
    if (storageCorrupt) rememberCorrupt();
    render(true);
    if (notify) toast('Der Lernstand wurde in einem anderen Tab geändert. Die aktuelle Version ist geladen.');
    return true;
  }

  function backupState() {
    const raw = read(KEY + '.backup');
    return raw === null ? null : parseState(raw);
  }

  function importControl() {
    return '<label class="btn btn--line">Lernstand importieren<input type="file" accept="application/json,.json" data-action="import" class="sr-only"></label>';
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

  function render(moveFocus) {
    try {
      if (storageCorrupt) {
        app.innerHTML = recoveryView();
      } else {
        const r = run();
        if (r?.session) {
          const t = r.session.tasks[r.session.i];
          if (!ui.stage && t) newTaskUi(t, r);
          app.innerHTML = lessonView(r);
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
    focusMain(moveFocus);
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
    <h1 class="mono-xl">Welche Linie fährst du?</h1>
    <p class="lead">Beide Linien prüfen dieselben ${TERMS.length} Pflichtbegriffe offen ab, mit jedem Mal neuer Formulierung. Bestätigt ist ein Begriff erst, wenn du ihn an zwei verschiedenen Tagen ohne Hilfe vollständig erklärt hast.</p>
  </div>
</header>
<main id="main" class="wrap">
  <div class="lines">
    ${lineCard('sprint', '7 Tage, 14 Lektionen · ideal bei Prüfung in ~1 Woche', [
      'Zehn Gruppen von A1 bis E2, je 13–14 Begriffe',
      'Jeder Begriff bekommt einen Erstabruf und zwei Tage später einen offenen Zweitcheck',
      'Lückenblöcke nach den Pflichtfragen, Prüfungscheck an Tag 7',
    ])}
    ${lineCard('adaptiv', '21 Tage, Plan folgt deinem Lernstand · ideal ab ~3 Wochen Vorlauf', [
      'Zwei Lernfenster pro Tag, keine feste Aufgabenzahl',
      'Fällige Wiederholungen und Fehler zuerst, neue Begriffe nach Rückstand',
      'Bestätigt nach zwei vollständigen Erklärungen mit mindestens drei Tagen Abstand',
    ])}
  </div>
  <table class="board board--facts">
    <caption>Fragenbestand</caption>
    <thead><tr><th scope="col">Quelle</th><th scope="col" class="num">Fragen</th><th scope="col">Einsatz</th></tr></thead>
    <tbody>
      <tr><td data-label="Quelle">Originalfragen aus der Prüfungsvorbereitung</td><td class="num" data-label="Fragen">${bestand.original}</td><td data-label="Einsatz">Definitionen im Pflichtpfad, Fallfragen reserviert für den Prüfungscheck</td></tr>
      <tr><td data-label="Quelle">Übungsfragen aus der Excel-Datei</td><td class="num" data-label="Fragen">${bestand.uebung}</td><td data-label="Einsatz">Fall- und Transfertraining, getrennt ausgewiesen</td></tr>
      <tr><td data-label="Quelle">Redaktionell ergänzt</td><td class="num" data-label="Fragen">${bestand.ergaenzt}</td><td data-label="Einsatz">Umformulierungen und Vergleichsfragen, damit jede Wiederabfrage anders lautet</td></tr>
    </tbody>
  </table>
  ${S.runs.length ? `<table class="board">
    <caption>Gespeicherte Durchläufe</caption>
    <thead><tr><th scope="col">Linie</th><th scope="col">Gestartet</th><th scope="col" class="num">Geprüft</th><th scope="col" class="num">Bestätigt</th><th scope="col">Aktion</th></tr></thead>
    <tbody>${S.runs.slice().reverse().map(past => {
      const pStats = stats(past, analyze(past));
      return `<tr><td data-label="Linie">${MODES[past.mode].name}${past.endedAt ? ' (beendet ' + fmtDate(past.endedAt) + ')' : ''}</td><td data-label="Gestartet">${fmtDate(past.start)}</td><td class="num" data-label="Geprüft">${pStats.geprueft}/139</td><td class="num" data-label="Bestätigt">${pStats.bestaetigt}</td><td data-label="Aktion"><button class="link" data-action="resume" data-id="${esc(past.id)}">Wieder aufnehmen</button>${past.endedAt ? ` <button class="link" data-action="delete-run" data-id="${esc(past.id)}">Aus Browser entfernen</button>` : ''}</td></tr>`;
    }).join('')}</tbody>
  </table>` : ''}
  <div class="actions">
    ${S.runs.length ? '<button class="btn btn--line" data-action="export">Lernstand exportieren</button>' : ''}
    ${importControl()}
  </div>
  ${confirmBar('delete-run', 'Diesen beendeten Durchlauf aus dem Browser entfernen? Exportierte Sicherungen bleiben erhalten.', 'Aus Browser entfernen', true)}
  ${confirmBar('import', 'Aktuellen Lernstand durch die ausgewählte Datei ersetzen?', 'Importieren', false)}
  ${S.runs.some(past => past.endedAt) ? '<p class="fine">Exportiere deinen Lernstand, bevor du einen beendeten Durchlauf aus dem Browser entfernst.</p>' : ''}
  <p class="fine">Quelle: ${esc(D.meta.source)}, Glossar‑Nr. 1–139. Dein Lernstand bleibt nur in diesem Browser gespeichert.</p>
</main>`;
  }
  function lineCard(mode, sub, points) {
    return `<section class="line">
  <h2 class="mono-l">${MODES[mode].name}</h2>
  <p class="line__sub">${sub}</p>
  <ul class="stops">${points.map(p => `<li>${p}</li>`).join('')}</ul>
  <button class="btn btn--ink" data-action="start" data-mode="${mode}">${MODES[mode].name} starten ${ICON.go}</button>
</section>`;
  }
  function brand() {
    return `<a class="backlink" href="../index.html">${ICON.back}<span>Lernportal</span></a>
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
    const next = r.mode === 'sprint' ? sprintNext(r, A) : adaptiveNext(r, A);
    const tabs = [['fahrplan', 'Fahrplan'], ['begriffe', 'Begriffe'], ['luecken', 'Lücken'], ['bilanz', 'Bilanz']];
    return `
<header class="band">
  <div class="band__brand">${brand()}
    <div class="band__day"><span class="mono-l">${over ? 'Beendet' : 'Tag ' + Math.max(1, day) + ' von ' + M.days}</span><span class="fine-ink">${M.name} · gestartet ${wd(r.start)}, ${fmtDate(r.start)}</span></div>
  </div>
  <div class="band__main">${next}</div>
  <dl class="band__stand">
    <div><dt>erstmals geprüft</dt><dd class="mono-xl">${c.geprueft}</dd></div>
    <div><dt>bestätigt</dt><dd class="mono-xl">${c.bestaetigt}</dd></div>
    <div${c.unsicher ? ' class="is-red"' : ''}><dt>unsicher</dt><dd class="mono-xl">${c.unsicher}</dd></div>
    <div><dt>ungeprüft</dt><dd class="mono-xl">${c.ungeprueft}</dd></div>
  </dl>
</header>
<div class="tabs" role="tablist" aria-label="Bereiche">
  ${tabs.map(([k, l]) => `<button class="tab${view.tab === k ? ' is-on' : ''}" id="tab-${k}" role="tab" aria-selected="${view.tab === k}" data-action="tab" data-tab="${k}">${l}</button>`).join('')}
</div>
<main id="main" class="wrap" role="tabpanel" aria-labelledby="tab-${view.tab}">
  ${view.tab === 'fahrplan' ? (r.mode === 'sprint' ? sprintBoard(r, A) : adaptiveBoard(r, A)) : ''}
  ${view.tab === 'begriffe' ? termsBoard(r, A) : ''}
  ${view.tab === 'luecken' ? gapsBoard(r, A) : ''}
  ${view.tab === 'bilanz' ? balance(r, A) : ''}
</main>`;
  }

  function sprintNext(r, A) {
    const n = nextSprint(r);
    if (!n) return `<h1 class="mono-xl">Sprint abgeschlossen</h1><p class="via">Alle 14 Lektionen sind gefahren. Die Bilanz zeigt, was bestätigt ist und was offen bleibt.</p><button class="btn btn--ink" data-action="tab" data-tab="bilanz">Bilanz ansehen ${ICON.go}</button>`;
    const { p, ready, late } = n;
    const L = buildSprintLesson(r, p);
    const names = L.tasks.slice(0, 5).map(t => TERM.get(t.nr).name);
    const wd_ = L.tasks.filter(t => t.kind === 'wdh').length, er = L.tasks.filter(t => t.kind === 'erst').length;
    const umfang = [wd_ && plural(wd_, 'Begriff erneut erklären', 'Begriffe erneut erklären'), er && plural(er, 'Begriff erstmals prüfen', 'Begriffe erstmals prüfen')].filter(Boolean).join(', danach ');
    const route = [p.wdh && p.wdh + ' Wiederholung', p.erst ? p.erst + ' neu' : { luecke: 'Lückencheck', vergleich: 'Vergleich', nachpruef: 'Nachprüfung', pruefcheck: 'Prüfungscheck' }[p.extra]].filter(Boolean).join(' · ');
    return `<h1 class="mono-xl">${route}</h1>
<p class="via">${late ? '<strong class="tag-red">Verspätet</strong> ' : ''}<strong>Tag ${p.day} · Lektion ${p.l}.</strong> ${umfang ? 'Heute: ' + umfang + '.' : 'Keine Pflichtfragen offen.'} ${names.length ? 'Über ' + names.map(esc).join(', ') + (L.tasks.length > 5 ? ' und ' + (L.tasks.length - 5) + ' weitere' : '') + '.' : ''}</p>
${L.held.length ? `<p class="via">${plural(L.held.length, 'Zweitcheck wartet', 'Zweitchecks warten')} noch auf den Abstand von zwei Tagen.</p>` : ''}
${ready ? `<button class="btn btn--ink" data-action="lesson" data-id="${p.id}">Lektion starten ${ICON.go}</button>` : `<p class="via"><strong>Nächste Abfahrt Tag ${p.day}</strong> (${wd(addDays(r.start, p.day - 1))}, ${fmtDate(addDays(r.start, p.day - 1))}). Heute ist alles erledigt.</p>`}`;
  }

  function adaptiveNext(r, A) {
    const info = adaptivePlanInfo(r, A);
    if (info.day > 21) return `<h1 class="mono-xl">21 Tage vorbei</h1><p class="via">Zeit für die Bilanz. Offene Begriffe werden nicht automatisch als beherrscht markiert.</p><button class="btn btn--ink" data-action="tab" data-tab="bilanz">Bilanz ansehen ${ICON.go}</button>`;
    const slot = adaptiveSlot(r);
    const phaseName = ['', 'Wissensstand erfassen', 'Abdeckung abschließen', 'Erklärungen absichern'][info.phase];
    const dueN = info.due.length;
    const lines = [];
    if (dueN) lines.push(plural(dueN, 'Wiederholung fällig', 'Wiederholungen fällig'));
    if (info.c.ungeprueft) lines.push(info.phase < 3 ? `${info.quotaLeft} neue Begriffe heute eingeplant` : `${info.c.ungeprueft} Begriffe noch ungeprüft`);
    if (!slot) {
      return `<h1 class="mono-xl">Beide Lektionen erledigt</h1><p class="via">${lines.join(' · ') || 'Nichts mehr fällig.'} Du kannst aufhören oder einen Zusatzblock fahren.</p>
<button class="btn btn--ink" data-action="lesson" data-id="extra">Zusatzblock starten ${ICON.go}</button>`;
    }
    return `<h1 class="mono-xl">Lektion ${slot} <span class="gleis-tag">${slot === 1 ? 'Abrufen' : 'Reparieren'}</span></h1>
<p class="via">Phase ${info.phase}: ${phaseName}. ${lines.join(' · ')}.</p>
<button class="btn btn--ink" data-action="lesson" data-id="slot${slot}">Lektion starten ${ICON.go}</button>`;
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
    const rows = sprintRows(r, A);
    const openId = view.openRow === undefined ? null : view.openRow;
    return `${stationKey()}
<table class="board board--plan">
<caption>Abfahrtstafel <span class="cap-sub">· 14 Lektionen</span></caption>
<thead><tr><th scope="col">Tag</th><th scope="col">Lektion</th><th scope="col">Gleis</th><th scope="col">Umfang</th><th scope="col" class="col-via">über</th><th scope="col">Hinweis</th></tr></thead>
<tbody>${rows.map(({ p, done, state, wdhTerms, erstTerms }) => { const open = openId === p.id; const late = state === 'verspaetet' ? dayOf(r) - p.day : 0; return `
<tr class="row--${state}${open ? ' is-open' : ''}">
  <td class="cell-day"><span class="mono-l">${p.day}${late ? ` <span class="delay">+${late}</span>` : ''}</span><span class="fine-ink">${wd(addDays(r.start, p.day - 1))} ${fmtDate(addDays(r.start, p.day - 1))}</span></td>
  <td><button class="rowbtn" data-action="openrow" data-id="${p.id}" aria-expanded="${open}"${open ? ` aria-controls="sroute-${p.id}"` : ''}><b>Lektion ${p.l}</b><span class="fine-ink">Fahrtverlauf ${open ? 'zuklappen' : 'zeigen'}</span></button></td>
  <td class="cell-gleis">${p.wdh ? `<span><b>${p.wdh}</b> Wdh.</span>` : ''}${p.erst ? `<span><b>${p.erst}</b> neu</span>` : ''}${!p.erst ? `<span class="fine-ink">${{ luecke: 'Lückencheck', vergleich: 'Vergleich', nachpruef: 'Nachprüfung', pruefcheck: 'Prüfungscheck' }[p.extra]}</span>` : ''}</td>
  <td class="cell-umfang">${[wdhTerms.length && wdhTerms.length + ' Wiederholungen', erstTerms.length && erstTerms.length + ' Erstabrufe'].filter(Boolean).join('<br>')}</td>
  <td class="cell-via">${[...wdhTerms, ...erstTerms].slice(0, 4).map(nr => esc(TERM.get(nr).name)).join(', ')} …</td>
  <td class="cell-note">${state === 'verspaetet' ? '<strong class="tag-red">verspätet</strong> ' : ''}${done ? esc(done.summary) : esc(p.note || '')}${state === 'heute' && !done ? ' <strong class="tag-ink">heute</strong>' : ''}</td>
</tr>${open ? `<tr class="route-row" id="sroute-${p.id}"><td></td><td colspan="5">${lessonRoute(r, A, wdhTerms, erstTerms)}</td></tr>` : ''}`; }).join('')}</tbody></table>
${legendBox()}
<p class="fine">Pflichtblöcke: 139 Erstabrufe und 139 Wiederholungsabrufe. Jeder Zweitcheck liegt zwei Kalendertage nach dem Erstabruf. Verpasste Lektionen bleiben in der Warteschlange und werden nicht gestrichen.</p>`;
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
    const rows = [];
    for (let i = 0; i < 7; i++) {
      const d = addDays(today, i);
      const n = dayOf(r, d);
      if (n > 21) break;
      const dueThen = [...A.values()].filter(a => a.first && a.status !== 'bestaetigt' && a.due <= d && !(i > 0 && a.due < today)).length;
      rows.push({ d, n, dueThen });
    }
    const behind = info.day <= 14 && info.c.ungeprueft > 0 ? `<div class="notice ${info.perDay > 14 ? 'notice--red' : ''}">
  <p><strong>${info.c.ungeprueft} Begriffe noch ungeprüft.</strong> Bis Tag 14 sind das im Schnitt ${info.perDay} Erstabrufe pro Tag${info.perDay > 14 ? ', mehr als üblich' : ''}.</p>
  <button class="btn btn--line" data-action="lesson" data-id="extra">Zusatzblock mit 6 neuen Begriffen</button></div>` : '';
    return `${behind}
<table class="board">
<caption>Die nächsten Tage</caption>
<thead><tr><th scope="col">Tag</th><th scope="col">Phase</th><th scope="col">Lernfenster</th><th scope="col" class="num">neue Begriffe (Plan)</th><th scope="col" class="num">fällige Wiederholungen</th><th scope="col">Hinweis</th></tr></thead>
<tbody>${rows.map(x => {
      const ph = x.n <= 7 ? 'Wissensstand erfassen' : x.n <= 14 ? 'Abdeckung abschließen' : 'Erklärungen absichern';
      const isToday = x.d === today;
      const done = [1, 2].map(l => r.done['a' + x.n + 'l' + l]);
      const fenster = isToday ? done.map((v, k) => `L${k + 1} ${v ? 'angekommen' : 'offen'}`).join(' · ') : 'L1 · L2';
      const rowPlan = x.n <= 14 ? (isToday ? info.perDay : Math.ceil(info.c.ungeprueft / Math.max(1, 14 - x.n + 1))) : 0;
      return `<tr class="${isToday ? 'row--heute' : 'row--geplant'}"><td class="cell-day" data-label="Tag"><span class="mono-l">${x.n}</span><span class="fine-ink">${wd(x.d)} ${fmtDate(x.d)}</span></td><td data-label="Phase">${ph}</td><td data-label="Lernfenster">${fenster}</td><td class="num" data-label="Neue Begriffe">${x.n <= 14 ? Math.min(info.c.ungeprueft + (isToday ? info.newToday : 0), rowPlan) || '–' : '–'}</td><td class="num" data-label="Wiederholungen">${x.dueThen}</td><td class="cell-note" data-label="Hinweis">${x.n === 14 ? 'Ziel: alle Begriffe erstmals geprüft' : x.n === 21 ? 'Bilanz' : ''}${isToday ? ' <strong class="tag-ink">heute</strong>' : ''}</td></tr>`;
    }).join('')}</tbody></table>
<p class="fine">Fällige Wiederholungen sind eine Vorschau auf Basis deines bisherigen Stands. Was du heute beantwortest, verschiebt sie.</p>
${legendBox()}`;
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
  function termsBoard(r, A) {
    const filters = [['alle', 'Alle'], ['offen', 'offen'], ['unsicher', 'unsicher'], ['bestaetigt', 'bestätigt']];
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
        const catOpen = view.openCat === k;
        return `<tr class="cat-head"><th colspan="6" scope="colgroup"><button class="rowbtn" data-action="catgroup" data-cat="${k}" aria-expanded="${catOpen}"><span><b>${k}. ${esc(name)}</b></span><span class="fine-ink">${items.length} Begriffe · ${catOpen ? 'zuklappen' : 'zeigen'}</span></button></th></tr>${catOpen ? items.map(t => termRow(r, A.get(t.nr), t)).join('') : ''}`;
      }).join('');
    } else {
      bodyHtml = list.map(t => termRow(r, A.get(t.nr), t)).join('');
    }
    return `<div class="filters">
  <div class="field"><span class="lbl">Stand</span><div class="seg" role="group" aria-label="Stand">${filters.map(([k, l]) => `<button class="seg__b${view.filter === k ? ' is-on' : ''}" aria-pressed="${view.filter === k}" data-action="filter" data-filter="${k}">${l}</button>`).join('')}</div></div>
  <label class="field"><span class="lbl">Kategorie</span><select data-action="cat">${['<option value="0">Alle Kategorien</option>', ...Object.entries(D.categories).map(([k, v]) => `<option value="${k}"${view.cat === k ? ' selected' : ''}>${k}. ${esc(v)}</option>`)].join('')}</select></label>
  <label class="field field--grow"><span class="lbl">Suchen</span><input type="search" data-action="query" value="${esc(view.query)}" placeholder="Begriff, deutsch oder englisch"></label>
</div>
${stationKey()}
<table class="board board--terms">
<caption aria-live="polite">${list.length} von ${TERMS.length} Begriffen</caption>
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
      return `<li class="stop stop--${e.indep ? cls : 'practice'}">
  <span class="stop__when"><b>Tag ${esc(e.day)}</b> ${fmtDate(e.d)}</span>
  <span class="stop__what">${esc(KIND[e.kind] || e.kind)}${e.indep ? ' · Nachweis' : e.fn === 'anw' ? ' · Fall' : ' · Übung'}${e.guess ? ' · geraten' : ''}</span>
  <span class="stop__res">${RES[e.res]}</span>
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
    const btn = r.mode === 'sprint' ? '' : `<button class="btn btn--line" data-action="lesson" data-id="gaps">Lückenblock starten</button>`;
    if (!list.length) return `<div class="empty-state"><h2 class="mono-l">Keine offenen Lücken</h2><p>Sobald ein Begriff unvollständig erklärt wurde, steht er hier, sortiert nach Fehlerbild.</p></div>`;
    return `<div class="filters"><p class="fine">Sortiert nach Dringlichkeit: wiederholte Fehler und Verwechslungen zuerst. ${r.mode === 'sprint' ? 'Im Sprint werden Lücken nach den Pflichtfragen jeder Lektion bearbeitet.' : ''}</p>${btn}</div>
<table class="board">
<caption>${plural(list.length, 'Lücke', 'Lücken')}</caption>
<thead><tr><th scope="col" class="num">Nr.</th><th scope="col">Begriff</th><th scope="col">Fehlerbild</th><th scope="col" class="num">Fehler</th><th scope="col">Stand</th></tr></thead>
<tbody>${list.map(({ a }) => {
      const t = TERM.get(a.nr);
      const miss = Object.entries(a.miss).sort((x, y) => y[1] - x[1]).map(([i]) => t.crit[i] && t.crit[i].t).filter(Boolean);
      const conf = Object.keys(a.conf).map(n => TERM.get(+n).name);
      const bild = [conf.length && 'verwechselt mit ' + conf.map(esc).join(', '), miss.length && 'fehlt: ' + esc(miss[0]), a.status === 'einmal' && 'braucht zweiten Nachweis', a.reset && 'nach Bestätigung wieder unvollständig'].filter(Boolean).join(' · ') || 'nicht abrufbar';
      const open = view.open === a.nr;
      return `<tr class="row--st-${a.status}${open ? ' is-open' : ''}"><td class="num" data-label="Nr.">${a.nr}</td><td data-label="Begriff"><button class="rowbtn" data-action="open" data-nr="${a.nr}" aria-expanded="${open}"${open ? ` aria-controls="groute-${a.nr}"` : ''}><b>${esc(t.name)}</b><span class="fine-ink">Fahrtverlauf &amp; Definition ${open ? 'zuklappen' : 'zeigen'}</span></button></td><td data-label="Fehlerbild">${bild}</td><td class="num" data-label="Fehler">${a.wrong}</td><td data-label="Stand"><span class="stand stand--${a.status}">${STATUS[a.status]}</span></td></tr>${open ? `<tr class="route-row" id="groute-${a.nr}"><td></td><td colspan="4">${routeView(r, a, t)}</td></tr>` : ''}`;
    }).join('')}</tbody></table>`;
  }

  /* ---------- Bilanz ---------- */
  function balance(r, A) {
    const c = stats(r, A);
    const cats = Object.entries(D.categories).map(([k, name]) => {
      const ts = TERMS.filter(t => String(t.cat) === k).map(t => A.get(t.nr));
      const anw = ts.flatMap(a => a.anw);
      return { k, name, n: ts.length, ge: ts.filter(a => a.first).length, be: ts.filter(a => a.status === 'bestaetigt').length, un: ts.filter(a => a.status === 'unsicher').length, anwOk: anw.filter(x => x === 'voll').length, anwN: anw.length };
    });
    const allAnw = [...A.values()].flatMap(a => a.anw);
    const anwFails = allAnw.filter(x => x !== 'voll').length;
    const twoDays = [...A.values()].filter(a => a.status === 'bestaetigt').length;
    const qs = r.mode === 'sprint' ? `
<ol class="answers">
  <li><span class="lbl">Wurden alle 139 Begriffe erstmals geprüft?</span><span class="mono-xl">${c.geprueft}<small>/139</small></span><span>${c.geprueft === 139 ? 'Ja.' : 'Noch nicht: ' + c.ungeprueft + ' offen.'}</span></li>
  <li><span class="lbl">An zwei verschiedenen Tagen vollständig erklärt</span><span class="mono-xl">${twoDays}</span><span>${c.einmal} weitere bisher nur einmal vollständig.</span></li>
  <li${anwFails ? ' class="is-red"' : ''}><span class="lbl">Aufgaben im Prüfungsstil mit Schwierigkeiten</span><span class="mono-xl">${anwFails}</span><span>von ${allAnw.length} beantworteten Fallfragen.</span></li>
</ol>` : `
<ol class="answers">
  <li><span class="lbl">erstmals geprüft</span><span class="mono-xl">${c.geprueft}</span><span>von 139</span></li>
  <li><span class="lbl">bestätigt</span><span class="mono-xl">${c.bestaetigt}</span><span>zweimal vollständig, mindestens drei Tage Abstand</span></li>
  <li${c.unsicher ? ' class="is-red"' : ''}><span class="lbl">erneut unsicher</span><span class="mono-xl">${c.unsicher}</span><span>${[...A.values()].filter(a => a.reset).length} davon nach Bestätigung</span></li>
  <li><span class="lbl">im Prüfungsstil angewendet</span><span class="mono-xl">${allAnw.filter(x => x === 'voll').length}</span><span>von ${allAnw.length} Fallfragen vollständig</span></li>
</ol>`;
    return `${qs}
<table class="board">
<caption>Lernstand nach Thema</caption>
<thead><tr><th scope="col">Kategorie</th><th scope="col" class="num">Begriffe</th><th scope="col" class="num">geprüft</th><th scope="col" class="num">bestätigt</th><th scope="col" class="num">unsicher</th><th scope="col" class="num">Fälle vollständig</th></tr></thead>
<tbody>${cats.map(x => `<tr><td data-label="Kategorie">${x.k}. ${esc(x.name)}</td><td class="num" data-label="Begriffe">${x.n}</td><td class="num" data-label="geprüft">${x.ge}</td><td class="num" data-label="bestätigt">${x.be}</td><td class="num${x.un ? ' red' : ''}" data-label="unsicher">${x.un}</td><td class="num" data-label="Fälle vollständig">${x.anwN ? x.anwOk + '/' + x.anwN : '–'}</td></tr>`).join('')}</tbody></table>
<p class="fine">Der Nachweis einer Definition und das Ergebnis einer Fallfrage werden getrennt gezählt. Übungen nach einem Hinweis zählen nie als Nachweis.</p>
<section class="danger">
  <h2 class="mono-l">Lernstand sichern</h2>
  <p>Dein Lernstand liegt nur in diesem Browser. Du kannst ihn als JSON‑Datei exportieren oder wieder einspielen.</p>
  <div class="actions">
    <button class="btn btn--line" data-action="export">Lernstand exportieren</button>
    ${importControl()}
  </div>
  ${confirmBar('import', 'Aktuellen Lernstand durch die ausgewählte Datei ersetzen?', 'Importieren', false)}
</section>
<section class="danger">
  <h2 class="mono-l">Durchlauf beenden</h2>
  <p>Startet eine neue Linie. Bestätigungen aus diesem Durchlauf werden nicht übernommen.</p>
  <div class="danger__row"><button class="btn btn--danger" data-action="reset">Durchlauf beenden und neu wählen</button></div>
  ${confirmBar('reset', 'Durchlauf wirklich beenden? Der bisherige Lernstand bleibt gespeichert, wird aber nicht in die neue Linie übernommen.', 'Durchlauf beenden', true)}
</section>`;
  }

  /* ---------- Lektion ---------- */
  function lessonView(r) {
    const L = r.session;
    const t = L.tasks[L.i];
    const total = L.tasks.length;
    if (L.over || !t) return lessonEnd(r, L);
    const q = Q.get(t.qid);
    const srcName = q.src === 'original' ? 'Originalfrage ' + q.ref : q.src === 'uebung' ? 'Übungsfrage aus der Excel' : 'redaktionell ergänzt';
    const fnName = { def: 'Definition', abgr: 'Abgrenzung', anw: 'Anwendung' }[q.fn];
    const pflichtN = L.pflichtN || total;
    return `
<header class="band band--lesson">
  <div class="band__brand"><button class="backlink" data-action="leave">${ICON.back}<span>Fahrplan</span></button>
    <p class="brand__name">${esc(L.title)}</p>
    <p class="brand__sub">${L.phase === 'pflicht' ? 'Pflichtblock' : 'Lückenblock'}${L.gleis && L.gleis.length ? ' · Gleis ' + L.gleis.map(esc).join(' · ') : ''}</p></div>
  <div class="band__main band__main--progress">
    <p class="lbl">Frage ${L.i + 1} von ${total}</p>
    <span class="sr-only">${L.results.filter(x => x && x.res === 'voll').length} vollständig, ${L.results.filter(x => x && x.res !== 'voll').length} unsicher oder offen</span>
    <ol class="rail" aria-hidden="true">${L.tasks.map((x, k) => `<li class="rail__t${k < L.i ? ' is-done' : ''}${k === L.i - 1 ? ' is-just' : ''}${k === L.i ? ' is-now' : ''}${(L.results[k] && L.results[k].res !== 'voll') ? ' is-miss' : ''}${k === pflichtN ? ' is-split' : ''}"></li>`).join('')}</ol>
  </div>
</header>
<main id="main" class="lesson">
  ${confirmBar('leave', 'Lektion unterbrechen? Beantwortete Fragen bleiben gespeichert, die offenen bleiben in der Warteschlange.', 'Lektion unterbrechen', false)}
  <article class="qcard">
    <h1 class="question" tabindex="-1" id="qtext">${ui.stage === 'fix' ? fixTitle() : esc(q.text)}</h1>
    ${ui.stage === 'fix' ? `<p class="qref">Ausgangsfrage: ${esc(q.text)}</p>` : ''}
    <p class="qmeta"><span class="tag-ink">${ui.stage === 'fix' ? 'Korrektur' : KIND[t.kind]}</span><span>${fnName}</span><span>${srcName}</span>${t.short ? '<span class="tag-red">verkürzter Nachcheck</span>' : ''}${t.assisted ? '<span>zählt als Übung</span>' : ''}</p>
    ${ui.stage === 'ask' ? askPanel(r, t) : ''}
    ${ui.stage === 'rate' ? ratePanel(r, t, q) : ''}
    ${ui.stage === 'fix' ? fixPanel(r, t) : ''}
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
  <button class="btn btn--quiet" data-action="dunno">Weiß ich nicht</button>${canUndo(r, r.session) ? '<button class="btn btn--quiet" data-action="undo">Letzte Bewertung korrigieren</button>' : ''}</div>
</div>`;
  }
  function ratePanel(r, t, q) {
    const step = Math.min(ui.step || 0, t.terms.length - 1);
    const activeTerms = t.terms.length > 1 ? [t.terms[step]] : t.terms;
    let kIdx = 0;
    const blocks = activeTerms.map(nr => {
      const term = TERM.get(nr);
      const st = ui.marks[nr];
      const res = derive(nr);
      const showVerdict = ui.touched || res !== 'falsch';
      return `<section class="model">
  ${t.terms.length > 1 ? `<p class="lbl">Begriff ${step + 1} von ${t.terms.length}</p>` : ''}
  <h2 class="mono-l">${esc(term.name)}</h2>
  <p class="model__def">${esc(term.def)}</p>
  <p class="fine-ink">Musterantwort: Glossardefinition Nr. ${term.nr}, Lektion ${esc(term.lesson)}.${q.fn === 'anw' ? ' Für die Fallfrage prüfst du zusätzlich, ob du die Merkmale auf den Fall angewendet hast.' : ''}</p>
  <fieldset class="crits"><legend class="lbl">Was hast du sinngemäß genannt? <span class="fine-ink">Kernaussage zählt, nicht Wortlaut · redaktionell abgeleitet</span></legend>
    ${term.crit.map((c, i) => { kIdx++; return `<label class="crit"><input type="checkbox" data-action="mark" data-nr="${nr}" data-i="${i}"${st.has[i] ? ' checked' : ''}><span class="crit__box">${ICON.check}</span><span>${esc(c.t)}</span><kbd>${kIdx <= 9 ? kIdx : ''}</kbd></label>`; }).join('')}
  </fieldset>
  <label class="opt"><input type="checkbox" data-action="contra" data-nr="${nr}"${st.contra ? ' checked' : ''}><span class="crit__box">${ICON.check}</span> Meine Antwort enthielt einen fachlichen Widerspruch</label>
  ${term.conf.length ? `<label class="field field--inline"><span class="lbl">Verwechselt mit</span><select data-action="conf" data-nr="${nr}"><option value="">nichts verwechselt</option>${term.conf.map(c => `<option value="${c}"${String(st.conf) === String(c) ? ' selected' : ''}>${esc(TERM.get(c).name)}</option>`).join('')}</select></label>` : ''}
  ${showVerdict ? `<p class="verdict verdict--${res}" aria-live="polite">Ergebnis: <b>${RES[res]}</b></p>` : `<p class="verdict verdict--hint" aria-live="polite">Pflichtmerkmale abhaken oder Widerspruch wählen.</p>`}
</section>`;
    }).join('');
    const notes = (ui.notes || '').trim();
    const isLast = step >= t.terms.length - 1;
    const footer = isLast ? `<div class="actions actions--split">
  <label class="opt"><input type="checkbox" data-action="guess"${ui.guess ? ' checked' : ''}><span class="crit__box">${ICON.check}</span> War geraten <span class="fine-ink">(zählt als Übung, nicht als Nachweis)</span></label>
  <div class="actions">${step > 0 ? '<button class="btn btn--quiet" data-action="ratestep" data-dir="-1">Zurück</button>' : ''}<span class="fine-ink kbd">⌘/Strg + Enter</span><button class="btn btn--ink" data-action="save">Ergebnis speichern ${ICON.go}</button></div>
</div>` : `<div class="actions actions--split">
  ${step > 0 ? '<button class="btn btn--quiet" data-action="ratestep" data-dir="-1">Zurück</button>' : '<span></span>'}
  <div class="actions"><span class="fine-ink kbd">⌘/Strg + Enter</span><button class="btn btn--ink" data-action="ratestep" data-dir="1">Nächster Begriff ${ICON.go}</button></div>
</div>`;
    return `${notes ? `<section class="mine"><p class="lbl">Deine Stichworte</p><p>${esc(notes).replace(/\n/g, '<br>')}</p></section>` : ''}${blocks}${footer}`;
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
      const parts = c.t.split(c.k);
      body = `<p class="fix__lead">Dir fehlte dieses Merkmal.</p>
<p class="cloze">${esc(parts[0])}<input id="cloze" class="cloze__in${f.done ? (f.ok ? ' is-ok' : ' is-no') : ''}" size="${Math.max(6, c.k.length + 2)}" value="${esc(f.value || '')}" aria-label="Lücke" ${f.done ? 'readonly' : ''}>${esc(parts.slice(1).join(c.k))}</p>
${f.done ? `<p class="verdict verdict--${f.ok ? 'voll' : 'falsch'}" aria-live="polite">${f.ok ? 'Richtig.' : 'Gesucht war: <b>' + esc(c.k) + '</b>'}</p>` : `<div class="actions"><button class="btn btn--ink" data-action="cloze">Lücke prüfen</button><span class="fine-ink kbd">Enter</span></div>`}`;
    } else if (f.type === 'tf') {
      const other = TERM.get(f.other);
      body = `
<blockquote class="claim">„${esc(term.name)}“ bedeutet: ${esc(other.def)}</blockquote>
${f.done ? `<p class="verdict verdict--${f.ok ? 'voll' : 'falsch'}" aria-live="polite">${f.ok ? 'Richtig erkannt: Das' : 'Falsch: Das'} ist die Definition von <b>${esc(other.name)}</b>.</p>` : `<div class="actions"><button class="btn btn--line" data-action="tf" data-v="1">Stimmt <kbd>1</kbd></button><button class="btn btn--line" data-action="tf" data-v="0">Stimmt nicht <kbd>2</kbd></button></div>`}`;
    } else {
      body = `<div class="choices" role="group" aria-label="Antwortmöglichkeiten">${f.opts.map((nr, k) => {
        const cls = f.done ? (nr === f.nr ? ' is-ok' : k === f.pick ? ' is-no' : '') : '';
        return `<button class="choice${cls}" data-action="choose" data-k="${k}" ${f.done ? 'disabled' : ''}><span>${esc(TERM.get(nr).def)}</span><kbd>${k + 1}</kbd></button>`;
      }).join('')}</div>
${f.done ? `<p class="verdict verdict--${f.ok ? 'voll' : 'falsch'}" aria-live="polite">${f.ok ? 'Richtig.' : 'Die markierte Beschreibung gehört zu ' + esc(TERM.get(f.opts[f.pick]).name) + '.'}</p>` : ''}`;
    }
    const canRetry = f.done && !ui.retried;
    return `<section class="fix">${body}
${f.done ? `<div class="actions actions--split">${canRetry ? `<button class="btn btn--line" data-action="retry">Noch einmal offen erklären (neue Formulierung)</button>` : canUndo(r, r.session) ? `<button class="btn btn--quiet" data-action="undo">Letzte Bewertung korrigieren</button>` : '<span></span>'}<div class="actions"><span class="fine-ink kbd">⌘/Strg + Enter</span><button class="btn btn--ink" data-action="next">Weiter ${ICON.go}</button></div></div>
${canRetry ? '<p class="fine-ink">Die erneute Erklärung zählt als Übung. Den Nachweis holst du an einem anderen Tag.</p>' : ''}` : ''}
</section>`;
  }

  function lessonEnd(r, L) {
    const res = L.results.filter(Boolean);
    const A = analyze(r);
    const pflicht = L.results.slice(0, L.pflichtN || L.results.length).filter(Boolean);
    const unsure = [...new Set(res.filter(x => x.res !== 'voll').map(x => x.nr))].filter(nr => A.get(nr).status === 'unsicher');
    const firstFull = [...new Set(res.filter(x => x.res === 'voll' && x.indep && A.get(x.nr).first && A.get(x.nr).first.d === todayStr() && A.get(x.nr).first.res === 'voll').map(x => x.nr))];
    const canExtra = L.phase === 'pflicht' && L.mode === 'sprint' && L.extra;
    const extras = canExtra ? extraTasks(r, L) : [];
    let nextLine = '';
    if (r.mode === 'sprint') {
      const n = nextSprint(r);
      nextLine = n ? (n.p.day <= dayOf(r) ? `Nächste Lektion: Tag ${n.p.day}, Lektion ${n.p.l}.` : `Nächster offener Check: Tag ${n.p.day}, ${wd(addDays(r.start, n.p.day - 1))} ${fmtDate(addDays(r.start, n.p.day - 1))}.`) : 'Alle Lektionen gefahren.';
    } else {
      const dues = [...A.values()].filter(a => a.due && a.status !== 'bestaetigt').map(a => a.due).sort();
      nextLine = dues.length ? `Nächster offener Check: ${wd(dues[0])} ${fmtDate(dues[0])}.` : '';
      const slot = adaptiveSlot(r);
      const open = [...A.values()].filter(a => a.first && a.due <= todayStr() && !a.todayIndep && a.status !== 'bestaetigt');
      if (open.length) nextLine += ` ${plural(open.length, 'fällige Wiederholung', 'fällige Wiederholungen')} offen${open.some(a => Object.keys(a.conf).length) ? '; darunter eine wiederholte Verwechslung' : ''}.`;
      if (slot === 2) nextLine += ' Lektion 2 ist heute noch offen.';
    }
    const extraName = { fix: 'Kurzkorrektur', luecke: 'Lückenblock', vergleich: 'Vergleichs- und Fallfragen', nachpruef: 'Nachprüfungen', pruefcheck: 'Prüfungscheck' }[L.extra];
    return `
<header class="band band--lesson">
  <div class="band__brand"><button class="backlink" data-action="leave">${ICON.back}<span>Fahrplan</span></button><p class="brand__name">${esc(L.title)}</p><p class="brand__sub">angekommen</p></div>
  <div class="band__main"><h1 class="mono-xl" tabindex="-1" id="qtext">${plural(pflicht.length, L.phase === 'pflicht' ? 'Pflichtfrage' : 'Frage', L.phase === 'pflicht' ? 'Pflichtfragen' : 'Fragen')} abgeschlossen</h1>
  <p class="via">${unsure.length ? plural(unsure.length, 'Begriff ist', 'Begriffe sind') + ' noch unsicher' : 'Kein Begriff ist unsicher geblieben'}${firstFull.length ? '; ' + plural(firstFull.length, 'Begriff wurde', 'Begriffe wurden') + ' heute erstmals vollständig erklärt' : ''}. ${nextLine}</p></div>
</header>
<main id="main" class="wrap">
  ${unsure.length ? `<table class="board"><caption>Noch unsicher</caption><thead><tr><th scope="col" class="num">Nr.</th><th scope="col">Begriff</th><th scope="col">Fehlerbild</th></tr></thead><tbody>${unsure.map(nr => {
      const x = res.filter(y => y.nr === nr).pop(); const term = TERM.get(nr);
      return `<tr class="row--st-unsicher"><td class="num" data-label="Nr.">${nr}</td><td data-label="Begriff"><b>${esc(term.name)}</b></td><td data-label="Fehlerbild">${x.conf ? 'verwechselt mit ' + esc(TERM.get(x.conf).name) : (x.miss || []).length ? 'fehlt: ' + esc(term.crit[x.miss[0]].t) : 'nicht abrufbar'}</td></tr>`;
    }).join('')}</tbody></table>` : ''}
  ${L.held && L.held.length ? `<p class="fine">${plural(L.held.length, 'Zweitcheck', 'Zweitchecks')} noch nicht möglich, weil der Erstabruf weniger als zwei Tage zurückliegt. Sie rücken automatisch in die nächste passende Lektion nach.</p>` : ''}
  <div class="actions">
    ${extras.length ? `<button class="btn btn--ink" data-action="extra">${extraName}: ${plural(extras.length, 'Aufgabe', 'Aufgaben')} ${ICON.go}</button>` : ''}
    ${r.mode === 'adaptiv' ? `<button class="btn ${extras.length ? 'btn--line' : 'btn--ink'}" data-action="lesson" data-id="extra">Weiterlernen: nächster Block</button>` : ''}
    <button class="btn btn--line" data-action="leave">Zum Fahrplan</button>
    ${canUndo(r, L) ? '<button class="btn btn--quiet" data-action="undo">Letzte Bewertung korrigieren</button>' : ''}
  </div>
  ${canExtra && !extras.length ? '<p class="fine">Für diese Lektion gibt es keine offenen Lücken.</p>' : ''}
</main>`;
  }

  /* ---------- Ablauf einer Aufgabe ---------- */
  function syncUi(r) { if (r && r.session) { r.session.ui = ui; save(); } }
  function newTaskUi(t, r) {
    ui = { stage: 'ask', notes: '', marks: {}, guess: false, retried: false, touched: false };
    t.terms.forEach(nr => { ui.marks[nr] = { has: {}, contra: false, conf: '' }; });
    if (r && r.session) r.session.ui = ui;
  }
  function startLesson(r, L) {
    L.tasks = L.tasks.filter(Boolean);
    L.pflichtN = L.tasks.length;
    if (!L.tasks.length) { L.over = true; }
    lastUndo = null;
    r.session = L;
    if (L.tasks[0]) newTaskUi(L.tasks[0], r);
    save();
    render(); focusQ();
  }
  function focusQ() { const el = document.getElementById('qtext'); if (el) el.focus({ preventScroll: false }); window.scrollTo(0, 0); }

  function saveResult(r) {
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
    L.results[L.i] = Object.assign({ nr: shown, indep: !t.assisted && q.fn !== 'anw' && !A0.get(shown).todayIndep }, perTerm[shown]);
    const inPflichtSprint = L.mode === 'sprint' && L.phase === 'pflicht';
    if (bad && q.fn !== 'anw' && !inPflichtSprint) {
      ui.fix = makeFix(bad, perTerm[bad]);
      ui.stage = 'fix';
      syncUi(r);
      render();
      return;
    }
    if (bad && inPflichtSprint) toast(perTerm[bad].res === 'teil' ? 'Auf die Lückenliste: ' + TERM.get(bad).crit[perTerm[bad].miss[0]].t : 'Auf die Lückenliste gesetzt. Reparatur folgt nach dem Pflichtblock.');
    nextTask(r);
  }
  function makeFix(nr, pt) {
    const term = TERM.get(nr);
    if (pt.conf) return { nr, type: 'tf', other: Math.random() < 0.5 ? nr : pt.conf };
    if (pt.res === 'teil' && pt.miss.length) return { nr, type: 'cloze', i: pt.miss[0] };
    const pool = term.conf.length ? term.conf.slice(0, 2) : TERMS.filter(x => x.cat === term.cat && x.nr !== nr).slice(0, 2).map(x => x.nr);
    while (pool.length < 2) pool.push(TERMS[(nr + pool.length * 17) % TERMS.length].nr);
    return { nr, type: 'choice', opts: shuffle([nr, ...pool], nr) };
  }
  function nextTask(r) {
    const L = r.session;
    L.i++;
    if (L.i >= L.tasks.length) finishBlock(r);
    else newTaskUi(L.tasks[L.i], r);
    save(); render(); focusQ();
  }
  function finishBlock(r) {
    const L = r.session;
    L.over = true;
    const gaps = [...new Set(L.results.filter(x => x && x.res !== 'voll').map(x => x.nr))];
    const prev = r.done[L.id];
    if (!L.extraBlock || !prev) {
      const unsure = gaps.length;
      r.done[L.id] = Object.assign({}, prev || {}, { date: todayStr(), n: L.results.length, gaps: [...new Set([...(prev?.gaps || []), ...gaps])], summary: `${L.results.filter(Boolean).length} Fragen · ${unsure} unsicher` });
    }
  }

  /* ---------- Ereignisse ---------- */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-action]');
    if (!b) return;
    const a = b.dataset.action;
    if (refresh(true)) return;
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
        r.endedAt = todayStr(); r.session = null; S.active = null; lastUndo = null; save(); render(true); return;
      }
      if (c.type === 'leave' && r?.session) {
        r.session = null; lastUndo = null; save(); render(true); return;
      }
      return;
    }
    if (a === 'restore') {
      if (backupState()) { view.confirm = { type: 'restore', focusSel: '[data-action="restore"]' }; render(); document.querySelector('[data-action="confirm-yes"]')?.focus(); }
      return;
    }
    if (a === 'restart') {
      view.confirm = { type: 'restart', focusSel: '[data-action="restart"]' }; render(); document.querySelector('[data-action="confirm-yes"]')?.focus();
      return;
    }
    if (storageCorrupt) return;
    const r = run();
    if (a === 'start') {
      const id = 'r' + (window.crypto?.randomUUID?.() || Date.now() + '-' + Math.random().toString(36).slice(2));
      S.runs.push({ id, mode: b.dataset.mode, start: todayStr(), log: [], done: {}, lastQ: {}, seen: {}, session: null });
      S.active = id; view.tab = 'fahrplan'; save(); render(true); return;
    }
    if (a === 'resume') {
      const target = S.runs.find(x => x.id === b.dataset.id);
      if (target) { delete target.endedAt; S.active = target.id; view.tab = 'fahrplan'; save(); render(true); }
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
      view.confirm = { type: 'delete-run', id: target.id, focusSel: `[data-action="delete-run"][data-id="${target.id}"]` };
      render();
      document.querySelector('[data-action="confirm-yes"]')?.focus();
      return;
    }
    if (!r) return;
    if (a === 'tab') { view.tab = b.dataset.tab; render(); document.querySelector('.tab.is-on')?.focus(); return; }
    if (a === 'filter') { view.filter = b.dataset.filter; render(); document.querySelector(`[data-action="filter"][data-filter="${view.filter}"]`)?.focus(); return; }
    if (a === 'resetfilters') { view.filter = 'alle'; view.cat = '0'; view.query = ''; render(); document.querySelector('[data-action="query"]')?.focus(); return; }
    if (a === 'catgroup') { const k = b.dataset.cat; view.openCat = view.openCat === k ? null : k; render(); document.querySelector(`[data-action="catgroup"][data-cat="${k}"]`)?.focus(); return; }
    if (a === 'openrow') { const id = b.dataset.id; const cur = view.openRow === undefined ? null : view.openRow; view.openRow = cur === id ? null : id; render(); document.querySelector(`[data-action="openrow"][data-id="${id}"]`)?.focus(); return; }
    if (a === 'open') { const nr = +b.dataset.nr; view.open = view.open === nr ? null : nr; render(); document.querySelector(`[data-action="open"][data-nr="${nr}"]`)?.focus(); return; }
    if (a === 'lesson') {
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
      view.confirm = { type: 'reset', focusSel: '[data-action="reset"]' };
      render();
      document.querySelector('[data-action="confirm-yes"]')?.focus();
      return;
    }
    const L = r.session;
    if (!L) return;
    if (a === 'leave') {
      if (!L.over && L.i > 0) {
        view.confirm = { type: 'leave', focusSel: '.band__brand [data-action="leave"]' };
        render();
        document.querySelector('[data-action="confirm-yes"]')?.focus();
        return;
      }
      r.session = null; lastUndo = null; save(); render(true); return;
    }
    if (a === 'undo') {
      if (!canUndo(r, L)) return;
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
      lastUndo = null; save(); render(); focusQ(); return;
    }
    if (a === 'check') { ui.notes = (document.getElementById('notes') || {}).value || ''; ui.stage = 'rate'; syncUi(r); render(); document.querySelector('.model h2')?.scrollIntoView({ block: 'nearest' }); return; }
    if (a === 'dunno') { ui.stage = 'rate'; ui.touched = true; syncUi(r); render(); return; }
    if (a === 'mark') return; // über change
    if (a === 'ratestep') { const t = L.tasks[L.i]; if (t) { ui.step = Math.max(0, Math.min(t.terms.length - 1, (ui.step || 0) + (+b.dataset.dir || 1))); syncUi(r); render(); document.querySelector('.model h2')?.scrollIntoView({ block: 'nearest' }); } return; }
    if (a === 'save') {
      if (!ui.touched) {
        ui.touched = true;
        const t = L.tasks[L.i];
        if (t) t.terms.forEach(nr => updateVerdict(nr));
        syncUi(r);
        toast('Noch nichts abgehakt — erneut klicken oder drücken speichert als „falsch“.');
        return;
      }
      saveResult(r); return;
    }
    if (a === 'cloze') {
      const v = (document.getElementById('cloze') || {}).value || '';
      if (!norm(v)) { toast('Bitte erst das fehlende Wort eintragen.'); document.getElementById('cloze')?.focus(); return; }
      const k = TERM.get(ui.fix.nr).crit[ui.fix.i].k;
      ui.fix.value = v; ui.fix.done = true; ui.fix.ok = clozeMatches(k, v);
      syncUi(r); render(); return;
    }
    if (a === 'tf') { ui.fix.done = true; ui.fix.ok = (b.dataset.v === '1') === (ui.fix.other === ui.fix.nr); syncUi(r); render(); return; }
    if (a === 'choose') { const k = +b.dataset.k; ui.fix.pick = k; ui.fix.done = true; ui.fix.ok = ui.fix.opts[k] === ui.fix.nr; syncUi(r); render(); return; }
    if (a === 'retry') {
      // Eine unmittelbare erneute Erklärung mit neuem Wortlaut, als Übung.
      const t = L.tasks[L.i];
      const q = pickQuestion(r, ui.fix.nr, { avoid: [t.qid] });
      if (!q) { toast('Keine weitere Frage verfügbar.'); return; }
      const nt = { nr: ui.fix.nr, qid: q.id, terms: q.terms, kind: 'uebung', assisted: true };
      L.tasks.splice(L.i + 1, 0, nt);
      L.results.splice(L.i + 1, 0, null);
      L.i++; newTaskUi(nt, r); ui.retried = true; lastUndo = null; save(); render(); focusQ(); return;
    }
    if (a === 'next') { nextTask(r); return; }
    if (a === 'extra') {
      const tasks = extraTasks(r, L).filter(Boolean);
      if (!tasks.length) { toast('Keine weiteren Aufgaben verfügbar.'); return; }
      L.tasks = L.tasks.concat(tasks); L.results.length = L.i; L.phase = 'luecke'; L.over = false;
      L.pflichtN = L.i; newTaskUi(L.tasks[L.i], r); save(); render(); focusQ(); return;
    }
  });
  function clozeMatches(solution, answer) {
    const expected = norm(solution);
    const actual = norm(answer);
    return expected === actual || (expected.startsWith(actual) &&
      actual.length >= Math.max(5, Math.ceil(expected.length * 0.7)));
  }

  function norm(s) { return String(s || '').toLowerCase().replace(/[^a-zäöüß0-9]/g, ''); }

  document.addEventListener('change', e => {
    const el = e.target;
    const a = el.dataset && el.dataset.action;
    if (!a) return;
    if (a !== 'import' && (refresh(true) || storageCorrupt)) return;
    if (a === 'cat') { view.cat = el.value; render(); document.querySelector('[data-action="cat"]')?.focus(); return; }
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
        view.confirm = { type: 'import', focusSel: '[data-action="import"]' };
        render();
        document.querySelector('[data-action="confirm-yes"]')?.focus();
      };
      el.value = '';
      reader.readAsText(f);
      return;
    }
    const nr = +el.dataset.nr;
    if (a === 'mark') { ui.touched = true; ui.marks[nr].has[+el.dataset.i] = el.checked; updateVerdict(nr); syncUi(run()); return; }
    if (a === 'contra') { ui.touched = true; ui.marks[nr].contra = el.checked; updateVerdict(nr); syncUi(run()); return; }
    if (a === 'conf') { ui.touched = true; ui.marks[nr].conf = el.value; syncUi(run()); return; }
    if (a === 'guess') { ui.guess = el.checked; syncUi(run()); return; }
  });
  function updateVerdict(nr) {
    const sec = document.querySelector(`[data-action="mark"][data-nr="${nr}"]`)?.closest('.model');
    const v = sec && sec.querySelector('.verdict');
    if (!v) return;
    const res = derive(nr);
    if (!ui.touched && res === 'falsch') {
      v.className = 'verdict verdict--hint';
      v.textContent = 'Pflichtmerkmale abhaken oder Widerspruch wählen.';
      return;
    }
    v.className = 'verdict verdict--' + res;
    v.innerHTML = 'Ergebnis: <b>' + RES[res] + '</b>';
  }
  let qTimer, nTimer;
  document.addEventListener('input', e => {
    if (refresh(true) || storageCorrupt) return;
    if (e.target.dataset.action === 'query') {
      view.query = e.target.value;
      clearTimeout(qTimer);
      qTimer = setTimeout(() => { const pos = e.target.selectionStart; render(); const inp = document.querySelector('[data-action="query"]'); if (inp) { inp.focus(); inp.setSelectionRange(pos, pos); } }, 120);
    }
    if (e.target.id === 'notes') {
      ui.notes = e.target.value;
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
    if (!r.session) {
      if (e.key === 'Escape') {
        if (view.openRow) { const id = view.openRow; view.openRow = null; render(); document.querySelector(`[data-action="openrow"][data-id="${id}"]`)?.focus(); }
        else if (view.open) { const nr = view.open; view.open = null; render(); document.querySelector(`[data-action="open"][data-nr="${nr}"]`)?.focus(); }
      }
      if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && document.activeElement && document.activeElement.getAttribute('role') === 'tab') {
        const tabs = [...document.querySelectorAll('[role="tab"]')];
        const idx = tabs.indexOf(document.activeElement);
        if (idx >= 0) {
          e.preventDefault();
          const next = tabs[(idx + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
          next.click();
        }
      }
      return;
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      const btn = document.querySelector('.qcard [data-action="check"], .qcard [data-action="ratestep"][data-dir="1"], .qcard [data-action="save"], .qcard [data-action="cloze"], .qcard [data-action="next"]');
      btn && btn.click();
      return;
    }
    const inField = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName === 'INPUT' && document.activeElement.type === 'checkbox' ? 'X' : document.activeElement.tagName);
    if (ui.stage === 'rate' && /^[1-9]$/.test(e.key) && !inField) {
      const box = document.querySelectorAll('.qcard [data-action="mark"]')[+e.key - 1];
      if (box) { box.checked = !box.checked; box.dispatchEvent(new Event('change', { bubbles: true })); }
    }
    if (ui.stage === 'fix' && ui.fix && !ui.fix.done && /^[1-3]$/.test(e.key) && !inField) {
      if (ui.fix.type === 'choice') document.querySelector(`.qcard [data-action="choose"][data-k="${+e.key - 1}"]`)?.click();
      else if (ui.fix.type === 'tf' && (e.key === '1' || e.key === '2')) document.querySelector(`.qcard [data-action="tf"][data-v="${e.key === '1' ? 1 : 0}"]`)?.click();
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
