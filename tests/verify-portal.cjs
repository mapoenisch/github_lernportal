// Prüft die tatsächlich ausgelieferten DC-Komponenten und gebündelten Quizdaten.
const fs = require('node:fs');
const vm = require('node:vm');
const zlib = require('node:zlib');
const assert = require('node:assert/strict');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const data = JSON.parse(read('content/continuation.json'));
const materials = JSON.parse(read('content/materials.json'));
function component(doc, quiz) {
  const code = doc.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];
  const storage = {dba_completed_v1:JSON.stringify({'1.1.2':true,'2.7.4':true})};
  const context = vm.createContext({window:{},localStorage:{getItem:k=>storage[k],setItem:(k,v)=>storage[k]=v}, React:{createRef:()=>({current:null}),createElement:()=>({})},DCLogic:class { constructor(props){this.props=props} setState(update,cb){Object.assign(this.state,typeof update==='function'?update(this.state):update);if(cb)cb()}},console,setTimeout});
  vm.runInContext(quiz,context);
  vm.runInContext(code+'\nthis.portal = new Component({accentColor:"#E4694B",showProgress:true,showLessonNumbers:true});',context);
  context.portal.componentDidMount();
  return context.portal;
}
function check(doc, quiz, label) {
  const portal=component(doc,quiz);
  const all=portal.CURR.flatMap(m=>m.groups.flatMap(g=>g.lessons));
  assert.equal(new Set(all.map(x=>x.id)).size,all.length, label+': duplicate IDs');
  assert.equal(portal.state.completed['1.1.2'],true);
  assert.equal(portal.state.completed['2.7.4'],true);
  const later=all.filter(l=>data.lessons.some(n=>n.id===l.id));
  assert.equal(JSON.stringify(later.map(x=>x.id)),JSON.stringify(data.lessons.map(x=>x.id)));
  for(const lesson of data.lessons){
    const raw=portal.CONTENT[lesson.id];
    assert.ok(raw.sections.length>=6,lesson.id+': full lesson');
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
    portal.select(lesson.id);assert.equal(Object.keys(portal.state.quizAnswers).length,0);assert.equal(portal.state.quizSubmitted,false);
    // Renderer muss alle Blöcke verarbeiten können, nicht bloß die Daten einlesen.
    for(const section of raw.sections)for(const block of section.blocks)assert.ok(portal.styleBlock(block,'#E4694B'),lesson.id+': unknown block '+block.t);
  }
  const group=portal.CURR.find(m=>m.id==='m2').groups;
  assert.equal(group.find(g=>g.id==='2.8').title,'Kunden-Pitch');
  assert.equal(group.find(g=>g.id==='2.9').title,'Team-Pitch');
  const project=portal.CONTENT.projekt.sections.flatMap(s=>s.blocks);
  assert.ok(!JSON.stringify(portal.CONTENT['2.8.6']).includes('.pptx'), 'Kunden-Pitch nur als PDF');
  assert.ok(!project.some(b=>b.href?.includes('2.8.6')&&b.href.endsWith('.pptx')));
  for(const ending of ['LeadPilot Final Pitch-Deck Weidner.pdf','Teampitch-Deck final mit Schlussfolie.pptx','Team-Pitch Dossier LeadPilot.docx'])assert.ok(project.some(b=>b.href?.endsWith(ending)),ending);
  const links=[...data.lessons.flatMap(l=>portal.CONTENT[l.id].sections.flatMap(s=>s.blocks)),...project].filter(b=>b.t==='button');
  for(const b of links.filter(b=>b.href?.startsWith('assets/kurs/'))){
    assert.ok(fs.existsSync(path.join(root,b.href)),b.href);
    if(/\.(pptx|docx|xlsx|md)$/.test(b.href))assert.equal(portal.styleBlock(b,'#E4694B').onOpen,undefined,'Office must not open in iframe');
  }
  console.log(label+': 20 Lektionen, 80 Fragen, Quizabgabe/Reset, Renderer, Navigation, Projektlinks und bestehende Fortschritte geprüft.');
  return portal;
}
check(read('Lernportal.dc.html'),read('quizData.js'),'DC-Quelle');
assert.equal(read('Lernportal.dc.html'),read('Lernportal-standalone.dc.html'));
const bundle=read('index.html');
const get=kind=>JSON.parse(bundle.match(new RegExp('<script type="__bundler/'+kind+'">([\\s\\S]*?)</script>'))[1]);
const manifest=get('manifest');
const item=manifest['d3b9f937-d128-463d-851c-f9ea093629b5'];
check(get('template'),zlib.gunzipSync(Buffer.from(item.data,'base64')).toString(),'HTML-Bundle');
assert.equal(bundle,read('DBA Lernportal (offline).html'));
for(const r of materials){
  const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(root,r.path))).digest('hex');
  assert.equal(hash,r.sha256,r.path+': changed original');
}
console.log(materials.length+' Originaldateien anhand SHA-256 geprüft. HTML-Paare synchron.');
