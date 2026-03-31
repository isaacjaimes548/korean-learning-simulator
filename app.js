const cards = [
  { front: '가', back: 'ga', hint: 'Suena como “ga”.' },
  { front: '나', back: 'na', hint: 'Suena como “na”.' },
  { front: '다', back: 'da', hint: 'Suena como “da”.' },
  { front: '라', back: 'ra / la', hint: 'Puede sonar como “ra” o “la”.' },
  { front: '사과', back: 'manzana', hint: 'Palabra útil de vocabulario básico.' },
  { front: '학교', back: 'escuela', hint: 'Muy común en frases iniciales.' },
  { front: '물', back: 'agua', hint: 'Palabra corta y frecuente.' },
  { front: '감사합니다', back: 'gracias', hint: 'Forma educada para dar las gracias.' }
];

const quiz = [
  { q: '¿Qué significa 감사합니다?', a: ['Gracias', 'Hola', 'Escuela'], c: 0 },
  { q: '¿Cómo se lee 가?', a: ['na', 'ga', 'da'], c: 1 },
  { q: '¿Qué significa 물?', a: ['Agua', 'Casa', 'Libro'], c: 0 },
  { q: '¿Qué examen incluye escritura?', a: ['TOPIK I', 'TOPIK II', 'Ninguno'], c: 1 },
  { q: '¿Qué significa 학교?', a: ['Comida', 'Escuela', 'Amigo'], c: 1 }
];

const lessons = {
  topik1: [
    {
      phase: 'Fase 1',
      title: 'Hangul básico',
      body: '<h3>Hangul básico</h3><p><strong>Objetivo:</strong> reconocer 4 sílabas muy frecuentes: 가, 나, 다, 라.</p><p><strong>Haz esto:</strong> míralas, léelas en voz alta y compáralas con su romanización.</p><p><strong>Clave:</strong> no intentes memorizar todo el alfabeto hoy. Avanza por bloques pequeños.</p>'
    },
    {
      phase: 'Fase 2',
      title: 'Vocabulario esencial',
      body: '<h3>Vocabulario esencial</h3><p><strong>Objetivo:</strong> aprender palabras comunes como 물, 학교 y 사과.</p><p><strong>Haz esto:</strong> conecta palabra + significado + lectura.</p><p><strong>Clave:</strong> usa una imagen mental para recordar cada palabra.</p>'
    },
    {
      phase: 'Fase 3',
      title: 'Lectura inicial',
      body: '<h3>Lectura inicial</h3><p><strong>Objetivo:</strong> reconocer palabras comunes más rápido.</p><p><strong>Haz esto:</strong> practica lectura simple y preguntas cortas tipo TOPIK I.</p>'
    }
  ],
  topik2: [
    {
      phase: 'Fase 1',
      title: 'Base sólida',
      body: '<h3>Base sólida</h3><p><strong>Objetivo:</strong> asegurar lectura rápida de Hangul y vocabulario esencial.</p><p><strong>Haz esto:</strong> no pases a escritura hasta leer con soltura.</p>'
    },
    {
      phase: 'Fase 2',
      title: 'Gramática y comprensión',
      body: '<h3>Gramática y comprensión</h3><p><strong>Objetivo:</strong> reconocer estructuras frecuentes del examen.</p><p><strong>Haz esto:</strong> combinar lectura, vocabulario y patrones gramaticales.</p>'
    },
    {
      phase: 'Fase 3',
      title: 'Preparación TOPIK II',
      body: '<h3>Preparación TOPIK II</h3><p><strong>Objetivo:</strong> trabajar lectura larga, escucha y escritura.</p><p><strong>Haz esto:</strong> prioriza constancia antes que velocidad.</p>'
    }
  ]
};

const tips = [
  'Estudia un poco todos los días. La constancia gana más que los atracones de estudio.',
  'Primero reconoce el patrón visual; después memoriza el significado.',
  'Lee en voz alta aunque al principio te suene raro.',
  'No necesitas dominar todo hoy. Solo entender bien el siguiente paso.',
  'Si una palabra no se te queda, verla varias veces en sesiones cortas ayuda muchísimo.'
];

let state = JSON.parse(localStorage.getItem('koreanPwaState') || '{"card":0,"seen":0,"correct":0,"goal":"topik1","minutes":45,"lesson":0}');
let showingBack = false;
let activeQuiz = null;
let answeredCurrent = false;

const $ = (id) => document.getElementById(id);

function save() {
  localStorage.setItem('koreanPwaState', JSON.stringify(state));
  renderProgress();
}

function getCurrentLesson() {
  const track = lessons[state.goal] || lessons.topik1;
  return track[state.lesson % track.length];
}

function estimateWeeks() {
  const totalMinutes = state.goal === 'topik1' ? 1800 : 4800;
  return Math.max(6, Math.ceil(totalMinutes / Math.max(15, state.minutes) / 7 * 1.3));
}

function renderPlan() {
  $('goal').value = state.goal;
  $('minutes').value = state.minutes;

  const lesson = getCurrentLesson();
  const weeks = estimateWeeks();
  const goalName = state.goal === 'topik1' ? 'TOPIK I' : 'TOPIK II';
  const goalText = state.goal === 'topik1'
    ? 'TOPIK I se enfoca en lectura y escucha. Ideal para empezar desde cero.'
    : 'TOPIK II añade escritura y exige una base mucho más fuerte.';

  $('estimatedWeeks').textContent = `Tu ruta estimada: ${weeks} semanas`;
  $('goalSummary').textContent = goalText;
  $('heroTarget').textContent = goalName;
  $('heroLesson').textContent = lesson.title;
  $('heroMinutes').textContent = `${state.minutes} min al día`;

  $('todayPlan').innerHTML = `
    <div class="task">
      <div class="task-num">1</div>
      <div><strong>Estudia la lección de hoy</strong><p>${lesson.title} · ${lesson.phase}</p></div>
    </div>
    <div class="task">
      <div class="task-num">2</div>
      <div><strong>Haz 3 a 5 flashcards</strong><p>Para familiarizarte con sonidos y vocabulario.</p></div>
    </div>
    <div class="task">
      <div class="task-num">3</div>
      <div><strong>Responde 1 o 2 preguntas</strong><p>Así compruebas si entendiste lo básico.</p></div>
    </div>
  `;
}

function renderLesson() {
  const lesson = getCurrentLesson();
  $('lessonBadge').textContent = lesson.phase;
  $('lessonContent').innerHTML = lesson.body;
  $('studyTip').innerHTML = `<p>${tips[(state.lesson + state.seen) % tips.length]}</p>`;
}

function renderCard() {
  const c = cards[state.card % cards.length];
  if (showingBack) {
    $('cardMode').textContent = 'Respuesta';
    $('front').textContent = c.back;
    $('backHint').textContent = c.hint;
    $('flipBtn').textContent = 'Ver pregunta';
  } else {
    $('cardMode').textContent = 'Pregunta';
    $('front').textContent = c.front;
    $('backHint').textContent = '¿Cómo se lee o qué significa?';
    $('flipBtn').textContent = 'Mostrar respuesta';
  }
}

function renderProgress() {
  $('seenCount').textContent = state.seen;
  $('correctCount').textContent = state.correct;
  const goalName = state.goal === 'topik1' ? 'TOPIK I' : 'TOPIK II';
  $('progressSummary').innerHTML = `
    <div class="summary-item"><strong>Meta actual</strong><span>${goalName}</span></div>
    <div class="summary-item"><strong>Tiempo diario</strong><span>${state.minutes} minutos</span></div>
    <div class="summary-item"><strong>Lección actual</strong><span>${getCurrentLesson().title}</span></div>
    <div class="summary-item"><strong>Siguiente enfoque</strong><span>Constancia diaria antes que velocidad</span></div>
  `;
}

function loadQuiz() {
  activeQuiz = quiz[Math.floor(Math.random() * quiz.length)];
  answeredCurrent = false;
  $('qText').textContent = activeQuiz.q;
  $('answers').innerHTML = '';
  $('quizFeedback').textContent = 'Elige una opción para ver si acertaste.';
  $('quizFeedback').className = 'feedback-box muted';

  activeQuiz.a.forEach((opt, i) => {
    const b = document.createElement('button');
    b.textContent = opt;
    b.onclick = () => {
      if (answeredCurrent) return;
      answeredCurrent = true;
      const fb = $('quizFeedback');
      if (i === activeQuiz.c) {
        fb.textContent = 'Correcto. Vas bien.';
        fb.className = 'feedback-box ok';
        state.correct += 1;
        save();
      } else {
        fb.textContent = 'Todavía no. La respuesta correcta es: ' + activeQuiz.a[activeQuiz.c];
        fb.className = 'feedback-box bad';
      }
    };
    $('answers').appendChild(b);
  });
}

function setScreen(name) {
  document.querySelectorAll('.screen').forEach((screen) => {
    screen.classList.toggle('active', screen.id === `screen-${name}`);
  });
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.screen === name);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

$('flipBtn').onclick = () => {
  showingBack = !showingBack;
  renderCard();
};

$('nextBtn').onclick = () => {
  state.card = (state.card + 1) % cards.length;
  state.seen += 1;
  showingBack = false;
  renderCard();
  save();
};

$('resetProgress').onclick = () => {
  state = { card: 0, seen: 0, correct: 0, goal: 'topik1', minutes: 45, lesson: 0 };
  showingBack = false;
  renderPlan();
  renderLesson();
  renderCard();
  renderProgress();
  loadQuiz();
  save();
  setScreen('home');
};

$('makePlan').onclick = () => {
  state.goal = $('goal').value;
  state.minutes = Math.max(15, Number($('minutes').value) || 45);
  renderPlan();
  renderLesson();
  save();
  setScreen('study');
};

$('nextQuiz').onclick = loadQuiz;

document.querySelectorAll('.nav-btn').forEach((btn) => {
  btn.onclick = () => setScreen(btn.dataset.screen);
});

document.querySelectorAll('[data-go]').forEach((btn) => {
  btn.onclick = () => setScreen(btn.dataset.go);
});

renderPlan();
renderLesson();
renderCard();
renderProgress();
loadQuiz();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js'));
}
