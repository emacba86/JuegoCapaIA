// Estado de la partida y guardado en localStorage.
// localStorage puede fallar (modo privado, sitio bloqueado): el juego funciona igual, solo no guarda.
(function () {
  const KEY = 'prompt-and-deploy:save:v1';

  const fresh = () => ({
    version: 1,
    name: '',
    avatar: 'a',
    family: PD.data.defaultFamily,
    x: PD.data.map.start.x,
    y: PD.data.map.start.y,
    dir: PD.data.map.start.dir,
    coins: 1000,
    rep: 0,
    quests: {},
    wiki: [],
    achievements: [],
    flags: {},
    settings: { textSpeed: 'normal', reducedMotion: false },
  });

  PD.state = fresh();

  PD.save = {
    has() {
      try { return !!localStorage.getItem(KEY); } catch (e) { return false; }
    },
    load() {
      try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return false;
        const data = JSON.parse(raw);
        const base = fresh();
        PD.state = Object.assign(base, data, { settings: Object.assign(base.settings, data.settings) });
        return true;
      } catch (e) {
        return false;
      }
    },
    write() {
      try { localStorage.setItem(KEY, JSON.stringify(PD.state)); } catch (e) { /* sin guardado */ }
    },
    reset() {
      const settings = PD.state.settings;
      try { localStorage.removeItem(KEY); } catch (e) { /* nada */ }
      PD.state = fresh();
      PD.state.settings = settings;
    },
  };

  PD.fresh = fresh;
})();
