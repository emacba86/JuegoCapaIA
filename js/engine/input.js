// Teclado y controles táctiles.
(function () {
  const KEYS = {
    ArrowUp: 'up', KeyW: 'up',
    ArrowDown: 'down', KeyS: 'down',
    ArrowLeft: 'left', KeyA: 'left',
    ArrowRight: 'right', KeyD: 'right',
  };
  const ACTION = ['KeyE', 'Enter', 'Space', 'NumpadEnter'];
  const held = [];

  const press = (d) => { if (!held.includes(d)) held.push(d); };
  const release = (d) => {
    const i = held.indexOf(d);
    if (i >= 0) held.splice(i, 1);
  };

  PD.input = {
    dir() {
      return held[held.length - 1] || null;
    },

    clear() {
      held.length = 0;
    },

    init() {
      window.addEventListener('keydown', (e) => {
        if (e.target.closest && e.target.closest('input, textarea, select')) return;
        const mode = PD.game.mode;
        const d = KEYS[e.code];

        if (mode === 'explore') {
          if (d) { e.preventDefault(); press(d); if (!e.repeat) PD.game.tap(d); return; }
          if (e.repeat) return;
          if (ACTION.includes(e.code)) { e.preventDefault(); PD.game.interact(); }
          else if (e.code === 'KeyM') PD.panels.quests();
          else if (e.code === 'KeyG') PD.panels.wiki();
          return;
        }

        if (mode === 'dialog') {
          if (d) { e.preventDefault(); if (!e.repeat) PD.dialog.nav(d); return; }
          if (ACTION.includes(e.code) && !e.repeat) { e.preventDefault(); PD.dialog.advance(); }
          return;
        }

        if ((mode === 'modal' || mode === 'minigame') && e.code === 'Escape') {
          PD.ui.close();
        }
      });

      window.addEventListener('keyup', (e) => {
        const d = KEYS[e.code];
        if (d) release(d);
      });
      window.addEventListener('blur', () => this.clear());

      document.querySelectorAll('#dpad [data-dir]').forEach((b) => {
        const d = b.dataset.dir;
        b.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          if (PD.game.mode === 'dialog') { PD.dialog.nav(d); return; }
          press(d);
          PD.game.tap(d);
          if (b.setPointerCapture) b.setPointerCapture(e.pointerId);
        });
        ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((ev) => b.addEventListener(ev, () => release(d)));
      });
      document.querySelector('#dpad [data-act]').addEventListener('pointerdown', (e) => {
        e.preventDefault();
        if (PD.game.mode === 'explore') PD.game.interact();
        else if (PD.game.mode === 'dialog') PD.dialog.advance();
      });
    },
  };
})();
