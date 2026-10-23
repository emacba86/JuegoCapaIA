// Jugador: movimiento por grilla, cámara e indicador de interacción.
(function () {
  let el = null;
  let hint = null;
  let viewport = null;
  let world = null;
  let tileSize = 40;

  PD.player = {
    init(worldEl, viewportEl) {
      world = worldEl;
      viewport = viewportEl;
      el = PD.makeChar(PD.data.avatars[PD.state.avatar] || PD.data.avatars.a, 'player');
      world.appendChild(el);
      hint = document.createElement('div');
      hint.id = 'hint';
      hint.className = 'off';
      world.appendChild(hint);
      this.resize();
      this.sync();
    },

    // Ajusta el tamaño del tile a la pantalla (~11 x 7.5 tiles visibles).
    resize() {
      if (!viewport) return;
      const w = viewport.clientWidth;
      const h = viewport.clientHeight;
      const cols = w < 600 ? 8.5 : 11; // en celular, más zoom
      tileSize = Math.max(28, Math.min(56, Math.floor(Math.min(w / cols, h / 7.5))));
      viewport.style.setProperty('--tile', tileSize + 'px');
      world.style.transition = 'none';
      this.camera();
      void world.offsetWidth;
      world.style.transition = '';
    },

    facing() {
      const [dx, dy] = PD.DIRS[PD.state.dir];
      return { x: PD.state.x + dx, y: PD.state.y + dy };
    },

    step(dir) {
      const s = PD.state;
      s.dir = dir;
      el.dataset.dir = dir;
      const [dx, dy] = PD.DIRS[dir];
      const nx = s.x + dx;
      const ny = s.y + dy;
      if (PD.map.solid(nx, ny)) {
        this.updateHint();
        return false;
      }
      s.x = nx;
      s.y = ny;
      el.classList.remove('walking');
      void el.offsetWidth;
      el.classList.add('walking');
      this.sync();
      PD.hud.render();
      PD.save.write();
      return true;
    },

    turn(dir) {
      PD.state.dir = dir;
      el.dataset.dir = dir;
      this.updateHint();
    },

    sync() {
      el.dataset.dir = PD.state.dir;
      PD.placeChar(el, PD.state.x, PD.state.y);
      this.camera();
      this.updateHint();
    },

    camera() {
      if (!viewport) return;
      const vw = viewport.clientWidth;
      const vh = viewport.clientHeight;
      const W = PD.map.w * tileSize;
      const H = PD.map.h * tileSize;
      const center = (view, size, pos) => {
        if (size <= view) return (view - size) / 2;
        const c = view / 2 - (pos + 0.5) * tileSize;
        return Math.min(0, Math.max(view - size, c));
      };
      const cx = Math.round(center(vw, W, PD.state.x));
      const cy = Math.round(center(vh, H, PD.state.y));
      world.style.transform = 'translate(' + cx + 'px, ' + cy + 'px)';
    },

    // Qué hay enfrente del jugador para interactuar (NPC, objeto o tile con texto).
    target() {
      const f = this.facing();
      const npc = PD.npc.at(f.x, f.y);
      if (npc) return { type: 'npc', npc, x: f.x, y: f.y };
      const t = PD.map.tile(f.x, f.y);
      if (t === 'K') {
        // Se puede hablar por encima del mostrador.
        const [dx, dy] = PD.DIRS[PD.state.dir];
        const behind = PD.npc.at(f.x + dx, f.y + dy);
        if (behind) return { type: 'npc', npc: behind, x: behind.x, y: behind.y };
      }
      const obj = PD.data.objects[f.x + ',' + f.y];
      if (obj) return { type: 'obj', talk: obj.talk, x: f.x, y: f.y };
      const tt = PD.data.tileTalk[t];
      if (tt) return { type: 'obj', talk: tt, x: f.x, y: f.y };
      return null;
    },

    updateHint() {
      if (!hint) return;
      const t = this.target();
      const show = t && PD.game.mode === 'explore';
      hint.classList.toggle('off', !show);
      if (t) PD.placeChar(hint, t.x, t.y);
      hint.style.zIndex = '200';
    },
  };
})();
