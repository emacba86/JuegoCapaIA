// Helpers to play the game like a person: keyboard movement, talking to NPCs and reading dialogues.
const { expect } = require('@playwright/test');

const SAVE_KEY = 'prompt-and-deploy:save:v1';

const FAMILIES = {
  gestion: { name: 'Gestión', members: 'Gerencia, Project Managers, Project Leaders' },
  tecnica: { name: 'Técnica', members: 'Desarrolladores, Infraestructura y Seguridad' },
  calidad: { name: 'Calidad y servicio', members: 'Quality Assurance, Service Assurance' },
  negocio: { name: 'Negocio', members: 'Analistas funcionales' },
  corporativa: { name: 'Áreas corporativas', members: 'Recursos Humanos, Administración' },
};

// Where to stand and which way to face to talk to each NPC or object.
const SPOTS = {
  rosa: [3, 4, 'up'],
  pc: [14, 4, 'down'],
  gustavo: [17, 5, 'right'],
  tito: [11, 4, 'up'],
  vale: [15, 4, 'up'],
  bruno: [10, 7, 'up'],
  cafe: [8, 2, 'up'],
  sala: [18, 4, 'right'],
};

// Collects page errors and failed requests. The browser's automatic favicon request is ignored.
function trackErrors(page) {
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('response', (r) => { if (r.status() >= 400) errors.push('HTTP ' + r.status() + ' ' + r.url()); });
  return errors;
}

async function freshStart(page) {
  await page.goto('./');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

async function pickFamily(page, id) {
  await page.locator('#family-pick label', { has: page.locator('input[value="' + id + '"]') }).click();
}

// New game from the title screen, with instant text so dialogues are quick to read.
async function newGame(page, { name = 'Ema', family = 'negocio' } = {}) {
  await freshStart(page);
  await page.fill('#player-name', name);
  await pickFamily(page, family);
  await page.click('#title-form button[type=submit]');
  await page.evaluate(() => { PD.state.settings.textSpeed = 'instantaneo'; });
}

const mode = (page) => page.evaluate(() => PD.game.mode);

// Reads the open dialogue to the end. picks: choice indices in order (0 when missing).
// Returns the transcript as lines "Speaker: text" and "> chosen option".
async function readDialog(page, picks = []) {
  const lines = [];
  for (let guard = 0; guard < 80 && (await mode(page)) === 'dialog'; guard++) {
    const choices = page.locator('#dlg-choices button');
    if (await choices.count()) {
      const i = picks.length ? picks.shift() : 0;
      lines.push('> ' + (await choices.nth(i).innerText()));
      await choices.nth(i).click();
      continue;
    }
    const name = (await page.locator('#dlg-name').innerText()).split('\n')[0];
    lines.push(name + ': ' + (await page.locator('#dlg-text').innerText()));
    await page.keyboard.press('Enter');
  }
  expect(await mode(page), 'dialogue should end').not.toBe('dialog');
  return lines;
}

const KEYS = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' };

// Next arrow key on the shortest free path to (x, y), or null when already there.
function nextStep(page, x, y) {
  return page.evaluate(([tx, ty]) => {
    const D = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
    const key = (p) => p[0] + ',' + p[1];
    const start = [PD.state.x, PD.state.y];
    const prev = { [key(start)]: null };
    const queue = [start];
    while (queue.length) {
      const p = queue.shift();
      if (p[0] === tx && p[1] === ty) break;
      for (const [d, [dx, dy]] of Object.entries(D)) {
        const n = [p[0] + dx, p[1] + dy];
        if (prev[key(n)] !== undefined || PD.map.solid(n[0], n[1])) continue;
        prev[key(n)] = [p, d];
        queue.push(n);
      }
    }
    if (prev[tx + ',' + ty] === undefined) return 'blocked';
    const steps = [];
    for (let k = tx + ',' + ty; prev[k]; k = key(prev[k][0])) steps.unshift(prev[k][1]);
    return steps[0] || null;
  }, [x, y]);
}

// Walks with the arrow keys to (x, y), one grid step per key press, then turns to `face`.
// The path is recomputed after every step: a slow machine can hold a key long enough
// for the game to take an extra step, and the next step corrects it.
async function walkTo(page, x, y, face) {
  const pos = () => page.evaluate(() => PD.state.x + ',' + PD.state.y);
  for (let guard = 0; guard < 60; guard++) {
    const d = await nextStep(page, x, y);
    expect(d, 'path to ' + x + ',' + y).not.toBe('blocked');
    if (!d) break;
    const before = await pos();
    await page.keyboard.press(KEYS[d]);
    await expect.poll(pos).not.toBe(before);
    await page.waitForTimeout(160); // let the game's step cooldown pass
  }
  expect(await pos()).toBe(x + ',' + y);
  if (face) {
    await page.keyboard.press(KEYS[face]);
    await expect.poll(() => page.evaluate(() => PD.state.dir)).toBe(face);
  }
  expect(await pos()).toBe(x + ',' + y);
}

// Walks to an NPC or object, checks the interaction hint and reads the whole dialogue.
async function talkTo(page, who, picks) {
  const [x, y, face] = SPOTS[who];
  await walkTo(page, x, y, face);
  await expect(page.locator('#hint')).not.toHaveClass(/off/);
  await page.keyboard.press('e');
  return readDialog(page, picks);
}

const state = (page) => page.evaluate(() => JSON.parse(JSON.stringify(PD.state)));
const objective = (page) => page.locator('#hud-objective').innerText();

// Saves a game at a given point and loads it with "Continuar".
async function loadSave(page, patch) {
  await freshStart(page);
  await page.evaluate(([k, p]) => {
    const s = Object.assign(PD.fresh(), { name: 'Ema' }, p);
    s.settings.textSpeed = 'instantaneo';
    localStorage.setItem(k, JSON.stringify(s));
  }, [SAVE_KEY, patch]);
  await page.reload();
  await page.click('#btn-continue');
}

module.exports = { SAVE_KEY, FAMILIES, SPOTS, trackErrors, freshStart, pickFamily, newGame, readDialog, walkTo, talkTo, state, objective, loadSave };
