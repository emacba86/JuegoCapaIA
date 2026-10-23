// Motor de diálogos: texto con efecto máquina de escribir, opciones y acciones.
(function () {
  const SPEEDS = { lento: 40, normal: 22, rapido: 8, instantaneo: 0 };

  let queue = [];
  let onEnd = null;
  let typing = null; // { full, total, shown, timer }
  let choices = null; // { list, sel }

  const $ = (id) => document.getElementById(id);

  // Divide el texto en segmentos normales / **negrita** para poder tipearlo de a poco.
  function segments(text) {
    const out = [];
    text.split(/(\*\*[^*]+\*\*)/).forEach((p) => {
      if (!p) return;
      if (p.startsWith('**') && p.endsWith('**')) out.push({ b: true, t: p.slice(2, -2) });
      else out.push({ b: false, t: p });
    });
    return out;
  }

  function partialHtml(segs, n) {
    let left = n;
    let html = '';
    for (const s of segs) {
      if (left <= 0) break;
      const part = s.t.slice(0, left);
      left -= part.length;
      html += s.b ? '<strong>' + PD.ui.esc(part) + '</strong>' : PD.ui.esc(part);
    }
    return html;
  }

  function speaker(id) {
    if (id === 'me') {
      return { name: PD.state.name, role: 'Vos', look: PD.data.avatars[PD.state.avatar] };
    }
    const npc = PD.npc.get(id);
    if (npc) return { name: npc.name, role: npc.role, look: npc.look, accessory: npc.accessory };
    return PD.data.speakers[id] || { name: '', emoji: '💬' };
  }

  PD.dialog = {
    active() {
      return PD.game.mode === 'dialog';
    },

    start(steps, endCb) {
      queue = steps.slice();
      onEnd = endCb || null;
      $('dialog').hidden = false;
      PD.game.setMode('dialog');
      this.next();
    },

    next() {
      while (queue.length) {
        const st = queue.shift();
        if (st.end) {
          queue = [];
          this.close();
          st.end();
          return;
        }
        if (st.fn) { st.fn(); continue; }
        if (st.choices) { this.showChoices(st.choices); return; }
        this.showLine(st);
        return;
      }
      this.close();
    },

    showLine(st) {
      const sp = speaker(st.s);
      $('dlg-name').innerHTML = PD.ui.esc(sp.name || '') + (sp.role ? '<small>' + PD.ui.esc(sp.role) + '</small>' : '');
      const portrait = $('dlg-portrait');
      portrait.innerHTML = '';
      if (sp.look) {
        const c = PD.makeChar(sp.look, '', sp.accessory);
        portrait.appendChild(c);
      } else if (sp.emoji) {
        portrait.innerHTML = '<span class="emoji">' + sp.emoji + '</span>';
      }
      $('dlg-choices').innerHTML = '';
      choices = null;

      const text = String(st.t).replace(/\{name\}/g, PD.state.name || '');
      const segs = segments(text);
      const total = segs.reduce((a, s) => a + s.t.length, 0);
      const speed = SPEEDS[PD.state.settings.textSpeed] ?? SPEEDS.normal;
      const out = $('dlg-text');
      $('dlg-next').classList.add('off');

      if (typing) clearInterval(typing.timer);
      if (!speed) {
        out.innerHTML = partialHtml(segs, total);
        typing = null;
        $('dlg-next').classList.remove('off');
        return;
      }
      typing = { segs, total, shown: 0, timer: null };
      out.innerHTML = '';
      typing.timer = setInterval(() => {
        typing.shown += 1;
        out.innerHTML = partialHtml(segs, typing.shown);
        if (typing.shown >= total) this.finishTyping();
      }, speed);
    },

    finishTyping() {
      if (!typing) return;
      clearInterval(typing.timer);
      $('dlg-text').innerHTML = partialHtml(typing.segs, typing.total);
      typing = null;
      $('dlg-next').classList.remove('off');
    },

    showChoices(list) {
      choices = { list, sel: 0 };
      $('dlg-next').classList.add('off');
      const box = $('dlg-choices');
      box.innerHTML = '';
      list.forEach((c, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = c.t;
        b.addEventListener('click', (e) => { e.stopPropagation(); this.pick(i); });
        b.addEventListener('mouseenter', () => this.select(i));
        box.appendChild(b);
      });
      this.select(0);
    },

    select(i) {
      if (!choices) return;
      choices.sel = (i + choices.list.length) % choices.list.length;
      [...$('dlg-choices').children].forEach((b, j) => b.classList.toggle('sel', j === choices.sel));
    },

    nav(dir) {
      if (!choices) return;
      if (dir === 'up' || dir === 'left') this.select(choices.sel - 1);
      else this.select(choices.sel + 1);
    },

    pick(i) {
      if (!choices) return;
      const c = choices.list[i];
      choices = null;
      $('dlg-choices').innerHTML = '';
      queue = (c.then || []).concat(queue);
      this.next();
    },

    advance() {
      if (typing) { this.finishTyping(); return; }
      if (choices) { this.pick(choices.sel); return; }
      this.next();
    },

    close() {
      if (typing) { clearInterval(typing.timer); typing = null; }
      choices = null;
      $('dialog').hidden = true;
      $('dlg-choices').innerHTML = '';
      if (PD.game.mode === 'dialog') PD.game.setMode('explore');
      const cb = onEnd;
      onEnd = null;
      if (cb) cb();
    },

    init() {
      $('dialog').addEventListener('click', () => {
        if (!choices) this.advance();
      });
    },
  };
})();
