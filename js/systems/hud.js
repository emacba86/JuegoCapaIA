// HUD superior: ByteCoins, reputación, zona y objetivo actual.
(function () {
  const $ = (id) => document.getElementById(id);

  PD.hud = {
    init() {
      $('hud-objective').addEventListener('click', () => PD.game.mode === 'explore' && PD.panels.quests());
      document.querySelectorAll('[data-panel]').forEach((b) => {
        b.addEventListener('click', () => {
          if (PD.game.mode !== 'explore') return;
          PD.panels[b.dataset.panel]();
        });
      });
    },

    show() {
      $('hud').hidden = false;
    },

    render() {
      const s = PD.state;
      $('hud-coins').textContent = s.coins;
      $('hud-rep').textContent = s.rep;
      $('hud-zone').textContent = '📍 ' + PD.map.zoneAt(s.x).name;
      $('hud-objective').textContent = PD.quests.objectiveText();
    },
  };
})();
