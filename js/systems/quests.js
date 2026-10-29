// Misiones, Wiki, logros y economía (ByteCoins / reputación).
(function () {
  const data = () => PD.data.quests;

  function st(id) {
    const q = PD.state.quests;
    if (!q[id]) q[id] = { status: 'locked', done: {} };
    return q[id];
  }

  function changed() {
    PD.hud.render();
    PD.npc.refresh();
    PD.player.updateHint();
    PD.save.write();
  }

  PD.quests = {
    start(id) {
      const q = st(id);
      if (q.status !== 'locked') return;
      q.status = 'active';
      const def = data()[id];
      if (!def.silent) PD.ui.toast('🆕 Nueva misión: **' + def.title + '**', 'gold');
      changed();
    },

    // Consultas de solo lectura: no crean entradas en la partida guardada.
    isActive: (id) => (PD.state.quests[id] || {}).status === 'active',
    isDone: (id) => (PD.state.quests[id] || {}).status === 'done',
    has: (id, obj) => !!((PD.state.quests[id] || {}).done || {})[obj],

    // Marca un objetivo como cumplido y, si era el último, termina la misión.
    done(id, obj) {
      const q = st(id);
      if (q.status !== 'active' || q.done[obj]) return;
      q.done[obj] = true;
      const def = data()[id];
      const o = def.objectives.find((x) => x.id === obj);
      if (o) PD.ui.toast('✅ ' + o.text);
      if (def.objectives.every((x) => q.done[x.id])) this.finish(id);
      else changed();
    },

    finish(id) {
      const q = st(id);
      const def = data()[id];
      q.status = 'done';
      if (def.reward) {
        PD.state.rep += def.reward.rep || 0;
        PD.state.coins += def.reward.coins || 0;
      }
      if (def.achievement) PD.achievements.unlock(def.achievement);
      if (def.next) this.start(def.next);
      changed();
      if (!def.silent) PD.panels.missionComplete(id);
    },

    current() {
      return Object.keys(data()).find((id) => this.isActive(id)) || null;
    },

    objectiveText() {
      const id = this.current();
      if (!id) return 'Explorá la oficina';
      const def = data()[id];
      if (def.comingSoon) return def.title + ': 🚧 en construcción';
      const q = st(id);
      const o = def.objectives.find((x) => !q.done[x.id]);
      return def.title + ': ' + (o ? o.text : '¡Completada!');
    },
  };

  PD.wiki = {
    unlock(id, silent) {
      if (!PD.data.glossary[id] || PD.state.wiki.includes(id)) return;
      PD.state.wiki.push(id);
      if (!silent) PD.ui.toast('📚 Nueva tarjeta en la Wiki: **' + PD.data.glossary[id].title + '**', 'gold');
      PD.save.write();
    },
    has: (id) => PD.state.wiki.includes(id),
  };

  PD.achievements = {
    unlock(id) {
      if (PD.state.achievements.includes(id)) return;
      const a = PD.data.achievements[id];
      if (!a) return;
      PD.state.achievements.push(id);
      PD.ui.toast('🏅 Logro: **' + a.title + '**', 'gold');
      PD.save.write();
    },
  };

  PD.economy = {
    spend(amount, reason) {
      PD.state.coins = Math.max(0, PD.state.coins - amount);
      PD.ui.toast('−' + amount + ' ₿c' + (reason ? ' · ' + reason : ''), 'bad');
      PD.hud.render();
      PD.save.write();
    },
  };
})();
