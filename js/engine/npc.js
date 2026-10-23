// NPCs en el mapa: dibujo, búsqueda por posición y marcadores de misión.
(function () {
  const els = {};

  PD.npc = {
    init(world) {
      PD.data.npcs.forEach((n) => {
        const el = PD.makeChar(n.look, 'npc', n.accessory);
        el.dataset.dir = n.dir;
        el.title = n.name + ' · ' + n.role;
        PD.placeChar(el, n.x, n.y);
        world.appendChild(el);
        els[n.id] = el;
      });
      this.refresh();
    },

    get(id) {
      return PD.data.npcs.find((n) => n.id === id);
    },

    at(x, y) {
      return PD.data.npcs.find((n) => n.x === x && n.y === y) || null;
    },

    face(id, dir) {
      if (els[id]) els[id].dataset.dir = dir;
    },

    resetFacing(id) {
      const n = this.get(id);
      if (n) this.face(id, n.dir);
    },

    refresh() {
      PD.data.npcs.forEach((n) => {
        els[n.id].classList.toggle('has-marker', !!(n.marker && n.marker()));
      });
    },
  };
})();
