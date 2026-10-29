// Paneles: misiones, Wiki, opciones, misión cumplida y plantillas.
(function () {
  const { esc, fmt } = PD.ui;

  function questCard(id, def, status) {
    const q = PD.state.quests[id] || { done: {} };
    let html = '<div class="quest-card ' + status + '">';
    html += '<div class="mod">' + esc(def.module) + '</div>';
    html += '<div class="ttl">' + esc(def.title) + (def.comingSoon ? ' 🚧' : '') + '</div>';
    if (status === 'active' && def.comingSoon) {
      html += '<p class="wiki-locked">🚧 En construcción. Mientras tanto, podés repasar la Wiki y las plantillas.</p>';
    } else if (status === 'active' && def.objectives) {
      let nextMarked = false;
      html += '<ul>';
      def.objectives.forEach((o) => {
        const done = !!q.done[o.id];
        let cls = done ? 'done' : '';
        if (!done && !nextMarked) { cls = 'next'; nextMarked = true; }
        html += '<li class="' + cls + '">' + esc(o.text) + '</li>';
      });
      html += '</ul>';
    }
    if (status === 'done' && PD.family.pick(PD.data.templates[id])) {
      html += '<div class="row"><span class="mod">Plantilla disponible</span>' +
        '<button type="button" class="btn" data-template="' + id + '">📋 Ver plantilla</button></div>';
    }
    html += '</div>';
    return html;
  }

  PD.panels = {
    quests() {
      const quests = PD.data.quests;
      let html = '<h3>En curso</h3>';
      const active = Object.keys(quests).filter((id) => PD.quests.isActive(id));
      html += active.length ? active.map((id) => questCard(id, quests[id], 'active')).join('') : '<p class="wiki-locked">No tenés misiones activas.</p>';

      html += '<h3>Hoja de ruta del trimestre</h3>';
      PD.data.roadmap.forEach((r) => {
        if (PD.quests.isActive(r.id)) return;
        const status = PD.quests.isDone(r.id) ? 'done' : 'locked';
        html += questCard(r.id, r, status);
      });

      html += '<h3>Logros</h3><div class="ach-list">';
      Object.entries(PD.data.achievements).forEach(([id, a]) => {
        const on = PD.state.achievements.includes(id);
        html += '<div class="ach' + (on ? ' on' : '') + '"><b>' + (on ? '🏅 ' : '🔒 ') + esc(a.title) + '</b>' + esc(on ? a.text : '???') + '</div>';
      });
      html += '</div>';

      const m = PD.ui.modal({ title: '📋 Misiones', html });
      m.body.querySelectorAll('[data-template]').forEach((b) => {
        b.addEventListener('click', () => this.template(b.dataset.template));
      });
    },

    wiki() {
      const g = PD.data.glossary;
      const groups = {};
      Object.entries(g).forEach(([id, c]) => {
        (groups[c.module] = groups[c.module] || []).push([id, c]);
      });
      const label = (mod) => {
        if (mod === 'tutorial') return 'Básicos del juego';
        const r = PD.data.roadmap.find((x) => x.id === mod);
        return r ? r.module : mod;
      };

      let html = '<p class="mg-intro">Todo lo que vas aprendiendo queda acá. Abrí <em>"Para profundizar"</em> si querés ir más allá.</p>';
      Object.entries(groups).forEach(([mod, cards]) => {
        const unlocked = cards.filter(([id]) => PD.wiki.has(id));
        html += '<div class="wiki-group"><h3>' + esc(label(mod)) + '</h3>';
        unlocked.forEach(([, c]) => {
          html += '<article class="wiki-card"><h4>' + esc(c.title) + '</h4><p>' + fmt(c.simple) + '</p>';
          const apply = PD.family.pick(c.apply);
          if (apply) html += '<div class="note">' + PD.family.get().icon + ' ' + fmt(apply) + '</div>';
          if (c.deeper) html += '<details><summary>Para profundizar</summary><p>' + fmt(c.deeper) + '</p></details>';
          html += '</article>';
        });
        const locked = cards.length - unlocked.length;
        if (locked) html += '<p class="wiki-locked">🔒 ' + locked + ' tarjeta' + (locked > 1 ? 's' : '') + ' por descubrir</p>';
        html += '</div>';
      });
      PD.ui.modal({ title: '📚 Wiki', html });
    },

    options() {
      const s = PD.state.settings;
      const html =
        '<div class="opt-row"><label for="opt-speed">Velocidad del texto</label>' +
        '<select id="opt-speed">' +
        [['lento', 'Lenta'], ['normal', 'Normal'], ['rapido', 'Rápida'], ['instantaneo', 'Instantánea']]
          .map(([v, t]) => '<option value="' + v + '"' + (s.textSpeed === v ? ' selected' : '') + '>' + t + '</option>').join('') +
        '</select></div>' +
        '<div class="opt-row"><label for="opt-motion">Reducir animaciones</label>' +
        '<input type="checkbox" id="opt-motion"' + (s.reducedMotion ? ' checked' : '') + '></div>' +
        '<div class="opt-row"><label for="opt-family">Área</label>' +
        '<select id="opt-family">' +
        Object.entries(PD.data.families)
          .map(([v, f]) => '<option value="' + v + '"' + (PD.family.id() === v ? ' selected' : '') + '>' + f.icon + ' ' + esc(f.name) + '</option>').join('') +
        '</select></div>' +
        '<p class="family-members" id="opt-members">' + esc(PD.family.members()) + '</p>' +
        '<div class="opt-row"><span>Jugando como <b>' + esc(PD.state.name) + '</b></span></div>' +
        '<p class="note">Los precios en ByteCoins son ficticios pero proporcionales a los reales. Proyecto educativo interno, sin afiliación con los proveedores de IA mencionados.</p>';

      const m = PD.ui.modal({
        title: '⚙️ Opciones',
        html,
        buttons: [
          { text: 'Borrar progreso', danger: true, onClick: () => this.confirmReset() },
          { text: 'Listo', primary: true },
        ],
      });
      m.body.querySelector('#opt-speed').addEventListener('change', (e) => {
        s.textSpeed = e.target.value;
        PD.save.write();
      });
      m.body.querySelector('#opt-family').addEventListener('change', (e) => {
        PD.state.family = e.target.value;
        m.body.querySelector('#opt-members').textContent = PD.family.members();
        PD.save.write();
      });
      m.body.querySelector('#opt-motion').addEventListener('change', (e) => {
        s.reducedMotion = e.target.checked;
        document.body.classList.toggle('reduced-motion', s.reducedMotion);
        PD.save.write();
      });
    },

    confirmReset() {
      PD.ui.modal({
        title: '¿Borrar el progreso?',
        html: '<p>Se pierden misiones, Wiki, logros y ByteCoins. No se puede deshacer.</p>',
        buttons: [
          { text: 'Cancelar', onClick: () => this.options() },
          { text: 'Sí, borrar todo', danger: true, onClick: () => { PD.save.reset(); location.reload(); } },
        ],
      });
    },

    missionComplete(id) {
      const def = PD.data.quests[id];
      const r = def.reward || {};
      let html = '<div class="reward-banner"><div class="big">🏆</div>' +
        '<div class="stats">' + esc(def.module) + '<br>' +
        (r.rep ? '+' + r.rep + ' ⭐ reputación' : '') + (r.coins ? ' · +' + r.coins + ' ₿c' : '') + '</div></div>';
      if (def.keypoints) {
        const points = def.keypoints.map((k) => PD.family.pick(k)).filter(Boolean);
        html += '<h3>Lo que te llevás</h3><ul class="keypoints">' + points.map((k) => '<li>' + fmt(k) + '</li>').join('') + '</ul>';
      }
      const buttons = [];
      if (def.template) buttons.push({ text: '📋 Plantilla para llevarte', onClick: () => this.template(def.template) });
      buttons.push({ text: 'Seguir', primary: true });
      PD.ui.modal({ title: '¡Misión cumplida! ' + def.title, html, buttons });
    },

    template(id) {
      const t = PD.family.pick(PD.data.templates[id]);
      const html =
        '<p>' + fmt(t.intro) + '</p>' +
        '<pre class="template-pre" id="tpl-text">' + esc(t.text) + '</pre>' +
        (t.note ? '<p class="note">⚠️ ' + fmt(t.note) + '</p>' : '');
      const m = PD.ui.modal({
        title: '📋 ' + t.title,
        html,
        buttons: [
          { text: 'Copiar', primary: true, onClick: () => copy(t.text, m) },
          { text: 'Cerrar' },
        ],
      });
    },
  };

  function copy(text, m) {
    const ok = () => PD.ui.toast('📋 Copiado al portapapeles');
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(ok, () => fallback());
    } else {
      fallback();
    }
    function fallback() {
      const pre = m.body.querySelector('#tpl-text');
      const range = document.createRange();
      range.selectNodeContents(pre);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      try { document.execCommand('copy'); ok(); } catch (e) { PD.ui.toast('Seleccioné el texto: copialo con Ctrl+C'); }
    }
  }
})();
