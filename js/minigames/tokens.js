// Desafío del Módulo 1: "El Tokenizador".
// Parte 1: ¿cuál pesa más? Comparar dos textos y elegir el que usa más tokens.
// Parte 2: quiz para estimar tokens y costos.
// Los cortes son ilustrativos: se calcularon con un tokenizador abierto (o200k_base).
// Claude usa su propio tokenizador, así que los números exactos cambian; las proporciones se mantienen.
(function () {
  const COST = 10; // ₿c por error

  const ROUNDS = [
    {
      title: 'Mismo requerimiento, dos idiomas',
      a: { label: 'Español', pieces: ['El', ' sistema', ' debe', ' enviar', ' una', ' not', 'ificación', ' cuando', ' el', ' pedido', ' camb', 'ie', ' de', ' estado', '.'] },
      b: { label: 'Inglés', pieces: ['The', ' system', ' must', ' send', ' a', ' notification', ' when', ' the', ' order', ' changes', ' status', '.'] },
      why: 'El español usa más tokens para decir lo mismo: "notificación" y "cambie" se parten en pedazos, mientras que en inglés cada palabra es una ficha. Más tokens = más costo.',
    },
    {
      title: 'Mismo dato, dos formatos',
      a: { label: 'Frase', pieces: ['El', ' cliente', ' Juan', ' Pérez', ' tiene', ' ', '3', ' pedidos', ' pendientes', '.'] },
      b: { label: 'JSON', pieces: ['{"', 'cliente', '":', ' "', 'Juan', ' Pérez', '",', ' "', 'ped', 'idos', '_p', 'end', 'ientes', '":', ' ', '3', '}'] },
      why: 'En JSON, las llaves, comillas y dos puntos también son tokens, y "pedidos_pendientes" se parte en cinco. El mismo dato pesa casi el doble.',
    },
    {
      title: 'Mismo dato, otra vez',
      a: { label: 'Tabla', pieces: ['|', ' Cliente', ' |', ' Ped', 'idos', ' pendientes', ' |\n', '|', '---', '|', '---', '|\n', '|', ' Juan', ' Pérez', ' |', ' ', '3', ' |'] },
      b: { label: 'Frase', pieces: ['El', ' cliente', ' Juan', ' Pérez', ' tiene', ' ', '3', ' pedidos', ' pendientes', '.'] },
      why: 'Las barras y guiones de la tabla suman tokens. Para un dato suelto no importa, pero una planilla de 500 filas pegada como tabla pesa bastante más que un resumen.',
    },
  ];

  const QUIZ = [
    { q: '¿Qué es un token?',
      opts: ['Siempre una palabra', 'Un pedacito de texto: una palabra, parte de una palabra o un signo', 'Siempre una letra'],
      a: 1, why: 'Las palabras comunes suelen ser un token, pero las largas o raras se parten, y los signos de puntuación también cuentan.' },
    { q: 'Un documento de requerimientos de 40 páginas, ¿cuántos tokens son, más o menos?',
      opts: ['Unos 400', 'Entre 60.000 y 120.000', 'Unos 40 millones'],
      a: 1, why: 'Una página usa típicamente entre 1.500 y 3.000 tokens, según qué tan densa sea. Por 40 páginas: entre 60.000 y 120.000.' },
    { q: 'Le pasás 20 páginas a Sonnet y te devuelve un resumen de 1 página. Precios: 3 ₿c por millón de tokens de entrada, 15 ₿c por millón de salida. ¿Qué cuesta más?',
      opts: ['La entrada', 'La salida', 'Cuestan lo mismo'],
      a: 0, why: 'La salida es 5 veces más cara por token, pero acá manda el volumen: unos 40.000 tokens de entrada (0,12 ₿c) contra unos 2.000 de salida (0,03 ₿c).' },
    { q: 'Le pegás al chat una captura de pantalla de 1.000 × 1.000 píxeles. ¿Consume tokens?', hint: 'La captura no tiene texto.',
      opts: ['No: las imágenes son gratis', 'Solo si tiene texto', 'Sí: unos 1.300 tokens'],
      a: 2, why: 'Claude mira la imagen en bloques de 28 × 28 píxeles: 36 × 36 = 1.296 tokens, tenga texto o no.' },
  ];

  const chips = (pieces) => pieces.map((p, i) =>
    '<span class="tok-chip c' + (i % 4) + '">' + PD.ui.esc(p.replace(/\n/g, '↵')) + '</span>').join('');

  PD.minigames = PD.minigames || {};

  PD.minigames.tokens = {
    start(onWin) {
      const game = { errorsWeigh: 0, errorsQuiz: 0, onWin };
      this.partWeigh(game);
    },

    partWeigh(game) {
      let i = 0;
      const m = PD.ui.modal({
        title: '⚖️ Desafío: ¿Cuál pesa más? (1/2)',
        html:
          '<p class="mg-intro">Tito te muestra dos textos. Elegí el que usa <strong>más tokens</strong>. Cada error cuesta ' + COST + ' ₿c.</p>' +
          '<div class="mg-progress" id="tk-prog"></div>' +
          '<div class="tok-pair" id="tk-pair"></div>' +
          '<div class="mg-feedback" id="tk-fb"></div>' +
          '<p class="note tok-note">Cortes ilustrativos, hechos con un tokenizador abierto. Cada modelo corta distinto, pero las proporciones se mantienen.</p>',
        mode: 'minigame',
        buttons: [{ text: 'Siguiente', primary: true, onClick: () => next() }],
      });
      const nextBtn = m.body.parentElement.querySelector('footer .btn.primary');
      const $ = (sel) => m.body.querySelector(sel);

      const render = () => {
        const r = ROUNDS[i];
        $('#tk-prog').textContent = 'Ronda ' + (i + 1) + ' de ' + ROUNDS.length + ' · ' + r.title;
        $('#tk-fb').className = 'mg-feedback';
        $('#tk-fb').textContent = '';
        nextBtn.disabled = true;
        const pair = $('#tk-pair');
        pair.innerHTML = '';
        [r.a, r.b].forEach((side, k) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'tok-card';
          b.innerHTML = '<span class="tok-label">' + PD.ui.esc(side.label) + '</span>' +
            '<span class="tok-text">' + PD.ui.esc(side.pieces.join('')) + '</span>' +
            '<span class="tok-chips" hidden>' + chips(side.pieces) + '</span>' +
            '<span class="tok-count" hidden>' + side.pieces.length + ' tokens</span>';
          b.addEventListener('click', () => answer(k));
          pair.appendChild(b);
        });
        pair.firstChild.focus({ preventScroll: true });
      };

      const answer = (k) => {
        const r = ROUNDS[i];
        const right = r.a.pieces.length > r.b.pieces.length ? 0 : 1;
        const cards = [...$('#tk-pair').children];
        cards.forEach((c) => {
          c.disabled = true;
          c.querySelector('.tok-text').hidden = true;
          c.querySelector('.tok-chips').hidden = false;
          c.querySelector('.tok-count').hidden = false;
        });
        cards[right].classList.add('right');
        const fb = $('#tk-fb');
        if (k === right) {
          fb.className = 'mg-feedback ok';
          fb.textContent = '✔ ' + r.why;
        } else {
          cards[k].classList.add('wrong');
          game.errorsWeigh += 1;
          PD.economy.spend(COST, 'error en el desafío');
          fb.className = 'mg-feedback bad';
          fb.textContent = '✘ ' + r.why;
        }
        nextBtn.disabled = false;
        nextBtn.textContent = i === ROUNDS.length - 1 ? 'Ir a la parte 2' : 'Siguiente';
        nextBtn.focus({ preventScroll: true });
      };

      const next = () => {
        if (nextBtn.disabled) return;
        i += 1;
        if (i < ROUNDS.length) render();
        else {
          if (!game.errorsWeigh) PD.achievements.unlock('balanza');
          this.partQuiz(game);
        }
      };

      render();
    },

    partQuiz(game) {
      let i = 0;
      const m = PD.ui.modal({
        title: '🧮 Desafío: Calculá en tokens (2/2)',
        html: '<div class="mg-progress" id="qz-prog"></div><p class="quiz-q" id="qz-q"></p><div class="quiz-opts" id="qz-opts"></div><div class="mg-feedback" id="qz-fb"></div>',
        mode: 'minigame',
        buttons: [{ text: 'Siguiente', primary: true, onClick: () => next() }],
      });
      const nextBtn = m.body.parentElement.querySelector('footer .btn.primary');
      const $ = (sel) => m.body.querySelector(sel);

      const render = () => {
        const item = QUIZ[i];
        $('#qz-prog').textContent = 'Pregunta ' + (i + 1) + ' de ' + QUIZ.length;
        $('#qz-q').innerHTML = PD.ui.esc(item.q) + (item.hint ? '<small>' + PD.ui.esc(item.hint) + '</small>' : '');
        $('#qz-fb').className = 'mg-feedback';
        $('#qz-fb').textContent = '';
        nextBtn.disabled = true;
        const opts = $('#qz-opts');
        opts.innerHTML = '';
        item.opts.forEach((t, k) => {
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
      if (!game.errorsQuiz) PD.achievements.unlock('calculadora');
      const errors = game.errorsWeigh + game.errorsQuiz;
      const html =
        '<div class="reward-banner"><div class="big">' + (errors ? '👍' : '🌟') + '</div>' +
        '<div class="stats">Errores: ' + errors + ' · ₿c gastados: ' + errors * COST + '</div></div>' +
        '<p>' + (errors
          ? 'Superaste el desafío. Si algún número te sorprendió, repasá las tarjetas de tokens en la Wiki.'
          : '¡Impecable! Pesás tokens mejor que la balanza de Finanzas.') + '</p>' +
        '<p class="note">💡 Regla práctica: <strong>todo se mide en tokens</strong>. Una página son entre 1.500 y 3.000; el español, el JSON y las tablas pesan más; y las imágenes también cuentan.</p>';
      PD.ui.modal({
        title: '✅ Desafío superado',
        html,
        buttons: [{ text: 'Volver a la oficina', primary: true }],
        onClose: () => game.onWin && game.onWin(),
      });
    },
  };
})();
