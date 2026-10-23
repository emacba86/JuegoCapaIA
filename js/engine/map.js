// Render del mapa en una grilla CSS y consultas de colisión.
(function () {
  const SOLID = new Set(['#', 'K', 'D', 'C', 'T', 's', 'p', 'M', 'L']);
  const PROP_CLASS = {
    K: 't-counter', D: 't-desk', C: 't-desk pc', c: 't-chair', T: 't-table',
    s: 't-sofa', p: 't-plant', M: 't-coffee', L: 't-door',
  };
  const FLOOR_CLASS = { '.': 'floor', ',': 'carpet', ':': 'meet' };

  PD.map = {
    w: 0,
    h: 0,

    init() {
      const rows = PD.data.map.rows;
      this.rows = rows;
      this.h = rows.length;
      this.w = rows[0].length;
    },

    tile(x, y) {
      if (y < 0 || y >= this.h || x < 0 || x >= this.w) return '#';
      return this.rows[y][x];
    },

    zoneAt(x) {
      return PD.data.map.zones.find((z) => x >= z.x0 && x <= z.x1) || PD.data.map.zones[0];
    },

    doorOpen() {
      return !!PD.state.flags.salaAbierta;
    },

    solid(x, y) {
      const t = this.tile(x, y);
      if (t === 'L') return !this.doorOpen();
      if (SOLID.has(t)) return true;
      return !!PD.npc.at(x, y);
    },

    render(world) {
      world.innerHTML = '';
      world.style.setProperty('--cols', this.w);
      const desk = PD.data.map.playerDesk;
      const frag = document.createDocumentFragment();
      for (let y = 0; y < this.h; y++) {
        for (let x = 0; x < this.w; x++) {
          const t = this.tile(x, y);
          const el = document.createElement('div');
          if (t === '#') {
            el.className = 't t-wall';
          } else if (FLOOR_CLASS[t]) {
            el.className = 't base-' + FLOOR_CLASS[t];
          } else {
            el.className = 't base-' + this.zoneAt(x).floor + ' ' + PROP_CLASS[t];
            if (t === 'L' && this.doorOpen()) el.classList.add('open');
            if (desk && desk.x === x && desk.y === y) el.classList.add('mine');
          }
          frag.appendChild(el);
        }
      }
      world.appendChild(frag);

      PD.data.map.labels.forEach((l) => {
        const el = document.createElement('div');
        el.className = 'room-label';
        el.textContent = l.text;
        el.style.transform = 'translate(calc(' + l.x + ' * var(--tile)), calc(' + l.y + ' * var(--tile)))';
        world.appendChild(el);
      });
    },
  };
})();
