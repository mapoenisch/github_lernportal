// Prüft die tatsächlich ausgelieferten DC-Komponenten und gebündelten Quizdaten.
const fs = require('node:fs');
const vm = require('node:vm');
const zlib = require('node:zlib');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const data = JSON.parse(read('content/continuation.json'));
function component(doc, quiz, storage = {dba_completed_v1:JSON.stringify({'1.1.2':true,'2.7.4':true})}) {
  const code = doc.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];
  const context = vm.createContext({window:{matchMedia:()=>({addEventListener(){}, removeEventListener(){}})},document:{addEventListener(){}, querySelector:()=>null},localStorage:{getItem:k=>storage[k],setItem:(k,v)=>storage[k]=v}, React:{createRef:()=>({current:null}),createElement:()=>({})},DCLogic:class { constructor(props){this.props=props} setState(update,cb){Object.assign(this.state,typeof update==='function'?update(this.state):update);if(cb)cb()}},console,setTimeout});
  vm.runInContext(quiz,context);
  vm.runInContext(code+'\nthis.portal = new Component({accentColor:"#E4694B",showProgress:true,showLessonNumbers:true});',context);
  context.portal.componentDidMount();
  return context.portal;
}
function check(doc, quiz, label) {
  assert.match(doc, /<html lang="de">/);
  assert.match(doc, /<title>DBA Lernportal<\/title>/);
  assert.doesNotMatch(doc, /<iframe[^>]+src="\{\{/);
  const portal=component(doc,quiz);
  assert.ok(!doc.includes('assets/kurs/'), label + ': keine Links auf Kursoriginale');
  const all=portal.CURR.flatMap(m=>m.groups.flatMap(g=>g.lessons));
  assert.equal(new Set(all.map(x=>x.id)).size,all.length, label+': duplicate IDs');
  assert.equal(portal.state.completed['1.1.2'],true);
  assert.equal(portal.state.completed['2.7.4'],true);
  const later=all.filter(l=>data.lessons.some(n=>n.id===l.id));
  assert.equal(JSON.stringify(later.map(x=>x.id)),JSON.stringify(data.lessons.map(x=>x.id)));
  for(const lesson of data.lessons){
    const raw=portal.CONTENT[lesson.id];
    assert.ok(raw.sections.length>=5,lesson.id+': full lesson');
    assert.equal(all.filter(x=>x.id===lesson.id).length,1);
    const q=portal.state.quizData[lesson.id];
    assert.ok(!/150[.]000|Kunden-Deck|Teamdeck|Weidner|LeadPilot|Warum steht|Portal|16 Neukunden|58 Teamtests/.test(JSON.stringify(q)), lesson.id+': Quiz muss Lehrstoff statt Lösungsartefakte abfragen');
    assert.equal(q.questions.length,4);
    for(const question of q.questions){
      assert.equal(new Set(question.options.map(o=>o.id)).size,4);
      assert.equal(new Set(question.options.map(o=>o.text)).size,4);
      assert.ok(question.options.some(o=>o.id===question.correctAnswer));
      assert.ok(question.hint);
    }
    portal.select(lesson.id);
    q.questions.forEach((question,i)=>portal.selectQuizAnswer(i,question.correctAnswer));
    portal.submitQuiz();assert.equal(portal.state.quizSubmitted,true);
    portal.select(lesson.id);assert.equal(portal.state.quizSubmitted,true);
    portal.retryQuiz();assert.equal(Object.keys(portal.state.quizAnswers).length,0);assert.equal(portal.state.quizSubmitted,false);
    // Renderer muss alle Blöcke verarbeiten können, nicht bloß die Daten einlesen.
    for(const section of raw.sections)for(const block of section.blocks)assert.ok(portal.styleBlock(block,'#E4694B'),lesson.id+': unknown block '+block.t);
  }
  const group=portal.CURR.find(m=>m.id==='m2').groups;
  assert.deepEqual(Array.from(group, g => g.id), ['2.1','2.2','2.3','2.4','2.5','2.6','2.7','2.8','2.9'], label + ': Gruppenreihenfolge Modul 2');
  assert.deepEqual(Array.from(group.find(g => g.id === '2.5').lessons, l => l.id), ['2.5.1','2.5.2','2.5.3','2.5.4']);
  assert.deepEqual(Array.from(group.find(g => g.id === '2.6').lessons, l => l.id), ['2.6.1','2.6.2','2.6.3','2.6.4']);
  assert.equal(group.find(g=>g.id==='2.8').title,'Kunden-Pitch');
  assert.equal(group.find(g=>g.id==='2.9').title,'Team-Pitch');
  const moduleFour = portal.CURR.find(m => m.id === 'm4');
  assert.ok(moduleFour, label + ': Modul 4 fehlt');
  const moduleFourGroups = [['4.1', 7], ['4.2', 7], ['4.3', 1]];
  assert.deepEqual(Array.from(moduleFour.groups, g => g.id), moduleFourGroups.map(([id]) => id));
  for (const [groupId, count] of moduleFourGroups) {
    const lessons = moduleFour.groups.find(g => g.id === groupId).lessons;
    assert.deepEqual(Array.from(lessons, l => l.id), Array.from({length: count}, (_, i) => groupId + '.' + (i + 1)));
    for (const {id} of lessons) {
      const {sections} = portal.CONTENT[id];
      const quiz = portal.state.quizData[id];
      assert.equal(sections.length, 5, id);
      assert.equal(quiz.questions.length, 4, id);
      for (const question of quiz.questions) {
        assert.equal(new Set(question.options.map(o => o.id)).size, 4, id);
        assert.equal(new Set(question.options.map(o => o.text)).size, 4, id);
        assert.ok(question.options.some(o => o.id === question.correctAnswer) && question.hint, id);
      }
      for (const block of sections.flatMap(s => s.blocks)) {
        const rendered = portal.styleBlock(block, '#E4694B');
        assert.ok(rendered && !(rendered.isNote && !rendered.text), id + ': ' + block.t);
      }
      portal.select(id);
      assert.equal(portal.renderVals().hasQuiz, true, id);
      quiz.questions.forEach((question, i) => portal.selectQuizAnswer(i, question.correctAnswer));
      portal.submitQuiz();
      assert.equal(portal.state.quizSubmitted, true, id);
      assert.equal(portal.renderVals().quiz.resultScoreText, '4 von 4 Antworten richtig', id);
      portal.select(id);
      assert.equal(portal.state.quizSubmitted, true, id);
      portal.retryQuiz();
      assert.equal(Object.keys(portal.state.quizAnswers).length, 0, id);
      assert.equal(portal.state.quizSubmitted, false, id);
    }
  }
  const compact = portal.CONTENT.kompakt;
  const styledCompact = portal.styleLesson(compact, '#E4694B');
  const comparison = compact.sections.find(section => section.pill === '13 · Frameworks im Überblick');
  const table = portal.styleBlock(comparison.blocks.find(block => block.t === 'table'), '#E4694B');
  for (const {style} of [...table.head, ...table.rows.flatMap(row => row.cells)]) {
    assert.equal(style.minWidth, 0, 'Tabellenspalten dürfen durch lange Wörter nicht breiter werden');
    assert.equal(style.overflowWrap, 'anywhere', 'Lange Begriffe müssen in der Spalte umbrechen können');
  }
  assert.equal(compact.sections.length, 18);
  assert.ok(compact.hero.chips.includes('17 Abschnitte + Glossar'));
  assert.equal(portal.COMPACT.length, compact.sections.length);
  assert.deepEqual(Array.from(portal.COMPACT.slice(0, -1), entry => entry.code),
    Array.from({length: 17}, (_, index) => String(index + 1).padStart(2, '0')));
  const glossaryNav = portal.COMPACT.at(-1);
  const glossary = compact.sections.at(-1);
  assert.equal(glossaryNav.title, 'Glossar');
  assert.equal(glossaryNav.code, '');
  assert.equal(glossary.title, 'Glossar');
  assert.equal(glossary.pill, 'Glossar');
  assert.equal(glossary.eyebrow, '');
  assert.deepEqual(Array.from(glossaryNav.subs), ['Definitionen', 'Modelle', 'Kennzahlen']);
  assert.ok(!compact.sections.some(section => section.title === 'Prüfungswissen kompakt'));
  const glossaryEntries = glossary.blocks.flatMap(block => block.items || []);
  for (const title of ['SaaS', 'Customer Success', 'ATS (Applicant Tracking System)', 'STAR-Methode', 'Net Revenue Retention (NRR)', 'On-Target Earnings (OTE)']) {
    assert.ok(glossaryEntries.some(item => item.title === title), title);
  }
  for (const [index, entry] of portal.COMPACT.entries()) {
    assert.equal(entry.id, styledCompact.sections[index].id);
    const headings = styledCompact.sections[index].blocks.filter(b => b.isHeading);
    assert.deepEqual(Array.from(entry.subs), Array.from(headings, b => b.text));
    headings.forEach((heading, i) => assert.equal(heading.anchorId, entry.id + '-h' + i));
  }
  for (const block of compact.sections.slice(14).flatMap(s => s.blocks).filter(b => b.t === 'golink')) {
    assert.ok(all.some(l => l.id === block.to), block.to);
    assert.ok(portal.CONTENT[block.to], block.to);
  }
  const project=portal.CONTENT.projekt.sections.flatMap(s=>s.blocks);
  assert.ok(!JSON.stringify(portal.CONTENT['2.8.6']).includes('.pptx'), 'Kunden-Pitch nur als PDF');
  assert.ok(!project.some(b=>b.href?.includes('2.8.6')&&b.href.endsWith('.pptx')));
  for(const ending of ['LeadPilot Final Pitch-Deck Weidner.pdf','Teampitch-Deck final mit Schlussfolie.pptx','Team-Pitch Dossier LeadPilot1.pdf'])assert.ok(project.some(b=>b.href?.endsWith(ending)),ending);
  const links=[...data.lessons.flatMap(l=>portal.CONTENT[l.id].sections.flatMap(s=>s.blocks)),...project].filter(b=>b.t==='button');
  for(const b of links.filter(b=>b.href?.startsWith('assets/leadpilot/'))){
    assert.ok(fs.existsSync(path.join(root,b.href)),b.href);
    if(/\.(pptx|docx|xlsx|md)$/.test(b.href))assert.equal(portal.styleBlock(b,'#E4694B').onOpen,undefined,'Office must not open in iframe');
  }
  // Volltextsuche über Lektionen, HubSpot, Kompakt und Glossar.
  assert.match(doc, /placeholder="Alle Inhalte durchsuchen …"/);
  assert.match(doc, /(onKeyDown|sc-camel-on-key-down)="\{\{ onSearchKey \}\}"/);
  assert.match(doc, /(onClick|sc-camel-on-click)="\{\{ r\.onClick \}\}"/);
  if (doc.includes('sc-camel-on-change="{{ onSearch }}"')) assert.ok(!doc.includes(' onClick="{{ onSearchClear }}"'), label + ': Bundle braucht sc-camel-Attribute');
  const hits = q => Array.from(portal.searchHits(q), h => h.entry);
  assert.ok(hits('star methode').some(e => e.lessonId === '4.2.5'), 'Suche: Modul 4');
  assert.ok(hits('Buying Center').some(e => e.label === 'Glossar'), 'Suche: Glossar');
  assert.ok(hits('ubergabe').some(e => e.lessonId === '2.4.2'), 'Suche: Umlaute');
  assert.ok(hits('daten importieren').some(e => e.lessonId === 'hub-2.3.2'), 'Suche: HubSpot');
  assert.ok(hits('gehalt').some(e => e.label.startsWith('Kompakt')), 'Suche: Kompakt');
  assert.ok(hits('saas').some(e => e.lessonId === '1.1.2'), 'Suche: Modul 1');
  assert.ok(hits('spin selling').some(e => e.lessonId === '2.5.3'), 'Suche: Bedarfsanalyse Deep Dive');
  assert.equal(hits('xyzqq').length, 0);
  portal.setState({ query: 'star methode' });
  const searchView = portal.renderVals();
  assert.ok(searchView.searchHasQuery && searchView.searchResults.length > 0);
  const visible = searchView.modules.flatMap(m => m.groups.flatMap(g => g.lessons.map(l => l.id)));
  assert.ok(visible.includes('4.2.5') && visible.length < all.length, 'Seitenleiste filtert nach Treffern');
  searchView.searchResults[0].onClick();
  assert.equal(portal.state.query, '');
  assert.equal(portal.state.activeLessonId, '4.2.5');
  console.log(label+': '+data.lessons.length+' Fortsetzungs- und 15 Modul-4-Lektionen, '+(data.lessons.length+15)*4+' Quizfragen, 18 Kompaktabschnitte, Projektlinks, Suche und Fortschritt geprüft.');
  return portal;
}
check(read('Lernportal.dc.html'),read('quizData.js'),'DC-Quelle');
assert.match(read('Lernportal-standalone.dc.html'), /url=\.\/Lernportal\.dc\.html/);
const bundle=read('index.html');
const get=kind=>JSON.parse(bundle.match(new RegExp('<script type="__bundler/'+kind+'">([\\s\\S]*?)</script>'))[1]);
const manifest=get('manifest');
const item=manifest['d3b9f937-d128-463d-851c-f9ea093629b5'];
check(get('template'),zlib.gunzipSync(Buffer.from(item.data,'base64')).toString(),'HTML-Bundle');
assert.match(read('DBA Lernportal (offline).html'), /url=\.\/index\.html/);
assert.ok(!fs.existsSync(path.join(root, 'assets/kurs')));
const storage = {};
const original = component(read('Lernportal.dc.html'), read('quizData.js'), storage);
const sample = original.state.quizData['1.1.2'];
sample.questions.forEach((q, i) => original.selectQuizAnswer(i, q.correctAnswer));
original.submitQuiz();
const reloaded = component(read('Lernportal.dc.html'), read('quizData.js'), storage);
assert.equal(reloaded.state.quizSubmitted, true);
assert.equal(reloaded.renderVals().quiz.resultScoreText, sample.questions.length + ' von ' + sample.questions.length + ' Antworten richtig');
console.log('Weiterleitungen, gespeicherte Quiz-Auswertung und Wiederholen geprüft.');
