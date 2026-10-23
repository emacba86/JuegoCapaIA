// Desafío del Módulo 0: "Las capas de la IA".
// Parte 1: ordenar las capas de la más amplia a la más específica.
// Parte 2: quiz "¿Le delego esto a un LLM?" con tareas reales de analistas.
(function () {
  const COST = 10; // ₿c por error

  const LAYERS = [
    { id: 'ia',    label: 'Inteligencia Artificial', short: 'IA',
      why: 'El paraguas más amplio: cualquier sistema que hace tareas "inteligentes", incluso con reglas fijas.' },
    { id: 'ml',    label: 'Machine Learning', short: 'Machine Learning',
      why: 'Dentro de la IA: sistemas que aprenden patrones de los datos.' },
    { id: 'dl',    label: 'Deep Learning', short: 'Deep Learning',
      why: 'Dentro del ML: redes neuronales de muchas capas.' },
    { id: 'genai', label: 'IA Generativa', short: 'IA Generativa',
      why: 'Modelos (casi siempre de deep learning) que generan contenido nuevo.' },
    { id: 'llm',   label: 'LLM (Claude, GPT, Gemini…)', short: 'LLM',
      why: 'IA generativa especializada en lenguaje: predice el siguiente token.' },
  ];

  const OPTS = ['Sí, es un buen caso', 'Solo con ayuda (herramientas o datos que le pase)', 'No: no puede saberlo'];
  const QUIZ = [
    { q: 'Resumir la minuta de una reunión de relevamiento de una hora.', hint: 'Le pegás la transcripción o tus notas.',
      a: 0, why: 'Resumir texto que le das es uno de sus puntos fuertes. Igual, revisá que no se haya perdido ninguna decisión importante.' },
    { q: 'Sumar el total exacto de horas de 300 tickets exportados del Jira.',
      a: 1, why: 'Los LLMs predicen texto: pueden equivocarse en cálculos largos. Para esto, una planilla o pedirle que use una herramienta (por ejemplo, que escriba una fórmula o un script).' },
    { q: 'Escribir un primer borrador de historias de usuario a partir de tus notas de relevamiento.',
      a: 0, why: 'Ideal como borrador: redacta rápido y con buen formato. Vos validás que reflejen lo que pidió el cliente.' },
    { q: 'Decirte qué decidió el cliente en la reunión de ayer.', hint: 'No le pasaste ni la minuta ni la grabación.',
      a: 2, why: 'No estuvo ahí y no tiene esa información. Si "responde" igual, está inventando: eso es una alucinación.' },
    { q: 'Detectar contradicciones entre dos versiones de un documento de requerimientos.',
      a: 0, why: 'Comparar textos y señalar inconsistencias o ambigüedades es un excelente caso de uso para un analista.' },
  ];

  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  PD.minigames = PD.minigames || {};

  PD.minigames.capas = {
    start(onWin) {
      const game = { errorsLayers: 0, errorsQuiz: 0, onWin };
      this.partLayers(game);
    },

    partLayers(game) {
      let placed = 0;
      const html =
        '<p class="mg-intro">Tito te desafía: tocá las capas <strong>de la más amplia a la más específica</strong>, como muñecas rusas. Cada error cuesta ' + COST + ' ₿c.</p>' +
        '<div class="capas">' +
        '<div class="rings">' + LAYERS.map((l) => '<div class="ring"><span>' + PD.ui.esc(l.short) + '</span></div>').join('') + '</div>' +
        '<div><div class="mg-progress" id="cp-prog">Capa 1 de ' + LAYERS.length + '</div>' +
        '<div class="layer-opts" id="cp-opts">' +
        shuffle(LAYERS).map((l) => '<button type="button" data-id="' + l.id + '">' + PD.ui.esc(l.label) + '</button>').join('') +
        '</div></div></div>' +
        '<div class="mg-feedback" id="cp-fb"></div>';

      const m = PD.ui.modal({ title: '🧅 Desafío: Las capas de la IA (1/2)', html, mode: 'minigame' });
      const rings = m.body.querySelectorAll('.ring');
      const fb = m.body.querySelector('#cp-fb');

      m.body.querySelectorAll('#cp-opts button').forEach((btn) => {
        btn.addEventListener('click', () => {
          const expected = LAYERS[placed];
          if (btn.dataset.id === expected.id) {
            rings[placed].classList.add('on');
            btn.classList.add('placed');
            fb.className = 'mg-feedback ok';
            fb.textContent = '✔ ' + expected.label + ': ' + expected.why;
            placed += 1;
            m.body.querySelector('#cp-prog').textContent = placed < LAYERS.length ? 'Capa ' + (placed + 1) + ' de ' + LAYERS.length : '¡Completo!';
            if (placed === LAYERS.length) {
              if (!game.errorsLayers) PD.achievements.unlock('cebolla');
              setTimeout(() => this.partQuiz(game), 1400);
            }
          } else {
            game.errorsLayers += 1;
            PD.economy.spend(COST, 'error en el desafío');
            btn.classList.remove('shake');
            void btn.offsetWidth;
            btn.classList.add('shake');
            fb.className = 'mg-feedback bad';
            fb.textContent = 'Todavía no. Pensá: de las que quedan, ¿cuál contiene a todas las demás?';
          }
        });
      });
    },

    partQuiz(game) {
      let i = 0;
      const m = PD.ui.modal({
        title: '🤔 Desafío: ¿Se lo delego a un LLM? (2/2)',
        html: '<div class="mg-progress" id="qz-prog"></div><p class="quiz-q" id="qz-q"></p><div class="quiz-opts" id="qz-opts"></div><div class="mg-feedback" id="qz-fb"></div>',
        mode: 'minigame',
        buttons: [{ text: 'Siguiente', primary: true, onClick: () => next() }],
      });
      const nextBtn = m.body.parentElement.querySelector('footer .btn.primary');
      const $ = (sel) => m.body.querySelector(sel);

      const render = () => {
        const item = QUIZ[i];
        $('#qz-prog').textContent = 'Pregunta ' + (i + 1) + ' de ' + QUIZ.length + ' · Sos analista y tenés que…';
        $('#qz-q').innerHTML = PD.ui.esc(item.q) + (item.hint ? '<small>' + PD.ui.esc(item.hint) + '</small>' : '');
        $('#qz-fb').className = 'mg-feedback';
        $('#qz-fb').textContent = '';
        nextBtn.disabled = true;
        const opts = $('#qz-opts');
        opts.innerHTML = '';
        OPTS.forEach((t, k) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.textContent = t;
          b.addEventListener('click', () => answer(k));
          opts.appendChild(b);
        });
        opts.firstChild.focus({ preventScroll: true });
      };

      const answer = (k) => {
        const item = QUIZ[i];
        const buttons = [...$('#qz-opts').children];
        buttons.forEach((b) => { b.disabled = true; });
        buttons[item.a].classList.add('right');
        const fb = $('#qz-fb');
        if (k === item.a) {
          fb.className = 'mg-feedback ok';
          fb.textContent = '✔ ' + item.why;
        } else {
          buttons[k].classList.add('wrong');
          game.errorsQuiz += 1;
          PD.economy.spend(COST, 'error en el desafío');
          fb.className = 'mg-feedback bad';
          fb.textContent = '✘ ' + item.why;
        }
        nextBtn.disabled = false;
        nextBtn.textContent = i === QUIZ.length - 1 ? 'Ver resultado' : 'Siguiente';
        nextBtn.focus({ preventScroll: true });
      };

      const next = () => {
        if (nextBtn.disabled) return;
        i += 1;
        if (i < QUIZ.length) render();
        else this.result(game);
      };

      render();
    },

    result(game) {
      if (!game.errorsQuiz) PD.achievements.unlock('buen-criterio');
      const errors = game.errorsLayers + game.errorsQuiz;
      const html =
        '<div class="reward-banner"><div class="big">' + (errors ? '👍' : '🌟') + '</div>' +
        '<div class="stats">Errores: ' + errors + ' · ₿c gastados: ' + errors * COST + '</div></div>' +
        '<p>' + (errors
          ? 'Superaste el desafío. Los errores son parte del aprendizaje: repasá la Wiki si algo no te cerró.'
          : '¡Impecable! Ni un ByteCoin desperdiciado.') + '</p>' +
        '<p class="note">💡 Regla práctica: un LLM brilla con <strong>texto que vos le das</strong> (resumir, redactar, comparar, ordenar). Con cálculos exactos o información que no tiene, necesita ayuda… o inventa.</p>';
      PD.ui.modal({
        title: '✅ Desafío superado',
        html,
        buttons: [{ text: 'Volver a la oficina', primary: true }],
        onClose: () => game.onWin && game.onWin(),
      });
    },
  };
})();
