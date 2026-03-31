const cards=[
  {front:'가',back:'ga'},{front:'나',back:'na'},{front:'다',back:'da'},{front:'라',back:'ra/la'},
  {front:'사과',back:'manzana'},{front:'학교',back:'escuela'},{front:'물',back:'agua'},{front:'감사합니다',back:'gracias'}
];
const quiz=[
  {q:'¿Qué significa 감사합니다?',a:['Gracias','Hola','Escuela'],c:0},
  {q:'¿Cómo se lee 가?',a:['na','ga','da'],c:1},
  {q:'¿Qué significa 물?',a:['Agua','Casa','Libro'],c:0},
  {q:'¿Qué meta incluye escritura?',a:['TOPIK I','TOPIK II','Ninguna'],c:1}
];
let state=JSON.parse(localStorage.getItem('koreanPwaState')||'{"card":0,"seen":0,"correct":0}');
let showingBack=false;
const front=document.getElementById('front');
const back=document.getElementById('back');
const flash=document.getElementById('flashcard');
function save(){localStorage.setItem('koreanPwaState',JSON.stringify(state));renderProgress();}
function renderCard(){const c=cards[state.card%cards.length];front.textContent=showingBack?c.back:c.front;}
function renderProgress(){seenCount.textContent=state.seen;correctCount.textContent=state.correct;}
flipBtn.onclick=()=>{showingBack=!showingBack;renderCard();};
nextBtn.onclick=()=>{state.card=(state.card+1)%cards.length;state.seen++;showingBack=false;renderCard();save();};
resetProgress.onclick=()=>{state={card:0,seen:0,correct:0};showingBack=false;renderCard();save();quizFeedback.textContent='';};
makePlan.onclick=()=>{
  const goal=document.getElementById('goal').value;
  const minutes=Math.max(15,Number(document.getElementById('minutes').value)||45);
  const weeks=goal==='topik1'?Math.ceil(3600/minutes):Math.ceil(9000/minutes);
  const exam=goal==='topik1'?'TOPIK I (lectura + escucha)':'TOPIK II (lectura + escucha + escritura)';
  plan.innerHTML=`<p><strong>Meta:</strong> ${exam}</p><p><strong>Con ${minutes} min/día:</strong> ruta estimada de ${weeks} semanas.</p><ul><li>Semanas 1-4: Hangul + pronunciación</li><li>Semanas 5-10: vocabulario base + gramática esencial</li><li>Semanas 11-${goal==='topik1'?'18':'24'}: lectura y escucha graduada</li><li>Último tramo: simulacros, corrección de errores y estrategia de examen</li></ul>`;
};
function loadQuiz(){
  const item=quiz[Math.floor(Math.random()*quiz.length)];
  qText.textContent=item.q; answers.innerHTML=''; quizFeedback.textContent=''; quizFeedback.className='';
  item.a.forEach((opt,i)=>{const b=document.createElement('button');b.textContent=opt;b.onclick=()=>{if(i===item.c){quizFeedback.textContent='Correcto';quizFeedback.className='ok';state.correct++;save();}else{quizFeedback.textContent='No. La correcta era: '+item.a[item.c];quizFeedback.className='bad';}};answers.appendChild(b);});
}
nextQuiz.onclick=loadQuiz;
renderCard();renderProgress();loadQuiz();
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js'));}
