// Arranque, pantalla de título, loop principal e interacción.
(function () {
  const STEP_MS = 150;
  let lastStep = 0;
  let talkingTo = null;

  PD.game = {
    mode: 'title',

    setMode(m) {
      this.mode = m;
      document.body.dataset.mode = m;
      if (m !== 'explore') PD.input.clear();
      if (PD.player.updateHint) PD.player.updateHint();
    },

    interact() {
      const t = PD.player.target();
      if (!t) return;
      if (t.type === 'npc') {
        talkingTo = t.npc.id;
        // El NPC mira hacia el jugador.
        const dx = PD.state.x - t.npc.x;
        const dy = PD.state.y - t.npc.y;
        const dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
        PD.npc.face(t.npc.id, dir);
        PD.dialog.start(t.npc.talk(), () => {
          PD.npc.resetFacing(talkingTo);
          talkingTo = null;
          PD.npc.refresh();
          PD.hud.render();
        });
      } else {
        PD.dialog.start(t.talk());
      }
    },

    begin(isNew) {
      PD.map.init();
      const world = document.getElementById('world');
      const viewport = document.getElementById('viewport');
      PD.map.render(world);
      PD.npc.init(world);
      PD.player.init(world, viewport);
      PD.hud.show();
      PD.hud.render();
      document.body.classList.toggle('reduced-motion', !!PD.state.settings.reducedMotion);
      this.setMode('explore');
      window.addEventListener('resize', () => PD.player.resize());

      if (isNew) {
        PD.quests.start('tutorial');
        PD.save.write();
        PD.dialog.start([
          { s: 'narr', t: 'Lunes, 9:00. Bytefactory S.A., una software factory de Córdoba.' },
          { s: 'narr', t: 'Sos {name}, de **{area}** ({members}). Llegás con el mate en la mano y notás algo raro: todos miran el celular con cara de preocupación.' },
          { s: 'narr', t: 'Caminá con las **flechas** o **WASD** y hablá con **E**. Empezá saludando a **Rosa**, en el mostrador de recepción.' },
        ]);
      }
    },

    // Primer paso inmediato al apretar (un toque corto no se pierde entre frames).
    tap(dir) {
      if (this.mode !== 'explore') return;
      lastStep = performance.now();
      if (!PD.player.step(dir)) PD.player.turn(dir);
    },

    loop(t) {
      if (this.mode === 'explore') {
        const d = PD.input.dir();
        if (d && t - lastStep >= STEP_MS) {
          lastStep = t;
          if (!PD.player.step(d)) PD.player.turn(d);
        }
      }
      requestAnimationFrame((n) => this.loop(n));
    },
  };

  function initTitle() {
    const form = document.getElementById('title-form');
    const nameInput = document.getElementById('player-name');
    const btnContinue = document.getElementById('btn-continue');

    document.querySelectorAll('.avatar-prev').forEach((el) => {
      el.appendChild(PD.makeChar(PD.data.avatars[el.dataset.avatar]));
    });

    // Familias: al elegir una, se muestran los roles que la integran.
    const familyPick = document.getElementById('family-pick');
    const familyMembers = document.getElementById('family-members');
    Object.entries(PD.data.families).forEach(([id, f]) => {
      const label = document.createElement('label');
      label.innerHTML = '<input type="radio" name="family" value="' + id + '"' + (id === PD.data.defaultFamily ? ' checked' : '') + '>' +
        '<span>' + f.icon + ' ' + PD.ui.esc(f.name) + '</span>';
      familyPick.appendChild(label);
    });
    const showMembers = () => {
      const id = form.querySelector('input[name="family"]:checked').value;
      familyMembers.innerHTML = '<strong>' + PD.ui.esc(PD.data.families[id].name) + '</strong> · ' + PD.ui.esc(PD.family.members(id));
    };
    familyPick.addEventListener('change', showMembers);
    showMembers();

    if (PD.save.has() && PD.save.load()) {
      btnContinue.hidden = false;
      btnContinue.textContent = 'Continuar como ' + PD.state.name;
      btnContinue.addEventListener('click', () => PD.game.begin(false));
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      if (!name) { nameInput.focus(); return; }
      const avatar = form.querySelector('input[name="avatar"]:checked').value;
      const family = form.querySelector('input[name="family"]:checked').value;
      PD.save.reset();
      PD.state.name = name;
      PD.state.avatar = avatar;
      PD.state.family = family;
      PD.game.begin(true);
    });

    nameInput.focus();
  }

  document.addEventListener('DOMContentLoaded', () => {
    PD.input.init();
    PD.dialog.init();
    PD.hud.init();
    initTitle();
    requestAnimationFrame((t) => PD.game.loop(t));
  });
})();
