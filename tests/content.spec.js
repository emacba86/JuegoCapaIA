// Content integrity for every family: dialogues, quizzes, templates and Wiki notes.
const { test, expect } = require('@playwright/test');
const { FAMILIES, freshStart, trackErrors } = require('./helpers');

test('every family has complete, well-formed content', async ({ page }) => {
  const errors = trackErrors(page);
  await freshStart(page);
  const problems = await page.evaluate((families) => {
    const out = [];
    const speakers = (s) => s === 'me' || PD.data.speakers[s] || PD.data.npcs.some((n) => n.id === s);
    const badText = (t) => typeof t !== 'string' || !t.trim() || /undefined|null|\{(?!name\}|area\}|members\})[a-z]+\}/i.test(t);

    // Walks every branch of a dialogue without running its actions.
    const walk = (steps, where) => steps.forEach((st, i) => {
      if (st.choices) {
        if (st.choices.length < 2) out.push(where + ': fewer than 2 choices');
        st.choices.forEach((c, k) => {
          if (badText(c.t)) out.push(where + ' choice ' + k + ': bad text ' + c.t);
          walk(c.then, where + '>' + k);
        });
      } else if (st.s !== undefined) {
        if (!speakers(st.s)) out.push(where + '#' + i + ': unknown speaker ' + st.s);
        if (badText(st.t)) out.push(where + '#' + i + ': bad text ' + st.t);
      }
    });

    // Quest states to look at each NPC from.
    const done = (ids) => Object.fromEntries(ids.map((o) => [o, true]));
    const STATES = {
      'tutorial': { tutorial: { status: 'active', done: {} } },
      'm0 start': { tutorial: { status: 'done', done: {} }, m0: { status: 'active', done: {} } },
      'm0 after gerente': { tutorial: { status: 'done', done: {} }, m0: { status: 'active', done: done(['gerente']) } },
      'm0 after reto': { tutorial: { status: 'done', done: {} }, m0: { status: 'active', done: done(['gerente', 'tito', 'reto']) } },
      'm1 start': { tutorial: { status: 'done', done: {} }, m0: { status: 'done', done: {} }, m1: { status: 'active', done: {} } },
      'm1 after gerente': { tutorial: { status: 'done', done: {} }, m0: { status: 'done', done: {} }, m1: { status: 'active', done: done(['gerente']) } },
      'm1 after reto': { tutorial: { status: 'done', done: {} }, m0: { status: 'done', done: {} }, m1: { status: 'active', done: done(['gerente', 'tito', 'reto']) } },
      'm1 done': { tutorial: { status: 'done', done: {} }, m0: { status: 'done', done: {} }, m1: { status: 'done', done: {} }, m2: { status: 'active', done: {} } },
    };

    for (const fam of families) {
      PD.state.family = fam;
      for (const [label, quests] of Object.entries(STATES)) {
        PD.state.quests = JSON.parse(JSON.stringify(quests));
        PD.data.npcs.forEach((n) => walk(n.talk(), fam + '/' + label + '/' + n.id));
      }
      // Delegation quiz (Mission 0): 5 items, valid answer index, explanation.
      PD.minigames.capas.partQuiz({ errorsLayers: 0, errorsQuiz: 0 });
      const opts = document.querySelectorAll('#qz-opts button').length;
      PD.ui.close();
      if (opts !== 3) out.push(fam + ': quiz options ' + opts);
      const tpl = PD.family.pick(PD.data.templates.m0);
      if (!tpl || badText(tpl.title) || badText(tpl.intro) || badText(tpl.text) || /\{ROL\}/.test(tpl.text)) out.push(fam + ': bad M0 template');
      const kp = PD.data.quests.m0.keypoints.map((k) => PD.family.pick(k));
      if (kp.length !== 3 || kp.some(badText)) out.push(fam + ': bad M0 keypoints');
      Object.entries(PD.data.glossary).filter(([, c]) => c.apply).forEach(([id, c]) => {
        if (badText(PD.family.pick(c.apply))) out.push(fam + ': missing Wiki note for ' + id);
      });
    }
    return out;
  }, Object.keys(FAMILIES));
  expect(problems).toEqual([]);
  expect(errors).toEqual([]);
});

test('every family gets a different delegation quiz with valid answers', async ({ page }) => {
  await freshStart(page);
  const quizzes = await page.evaluate((families) => families.map((fam) => {
    PD.state.family = fam;
    PD.minigames.capas.partQuiz({ errorsLayers: 0, errorsQuiz: 0 });
    const first = document.querySelector('#qz-q').textContent;
    const total = document.querySelector('#qz-prog').textContent;
    PD.ui.close();
    return { fam, first, total };
  }), Object.keys(FAMILIES));
  expect(new Set(quizzes.map((q) => q.first)).size).toBe(5);
  quizzes.forEach((q) => expect(q.total).toBe('Pregunta 1 de 5 · En tu trabajo tenés que…'));
});
