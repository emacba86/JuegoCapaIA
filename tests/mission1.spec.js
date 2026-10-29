// Mission 1 "La moneda del reino" (tokens), starting from a saved game with Mission 0 done.
const { test, expect } = require('@playwright/test');
const { trackErrors, readDialog, talkTo, state, objective, loadSave } = require('./helpers');

const M1_ACTIVE = {
  family: 'negocio',
  x: 14, y: 4, dir: 'down',
  coins: 1040, rep: 1,
  quests: {
    tutorial: { status: 'done', done: { rosa: true, pc: true } },
    m0: { status: 'done', done: { gerente: true, tito: true, reto: true, cierre: true } },
    m1: { status: 'active', done: {} },
  },
};

// Plays Mission 1 up to the closing talk with Gustavo. Round 1 is answered wrong on purpose.
async function playUntilClosing(page) {
  expect(await objective(page)).toContain('Preguntale a Gustavo qué necesita Finanzas');
  const g = await talkTo(page, 'gustavo');
  expect(g.join(' ')).toContain('Que se cobra por token.');

  await talkTo(page, 'tito', [0, 1, 0]);
  const wiki = (await state(page)).wiki;
  expect(wiki).toEqual(expect.arrayContaining(['token', 'tokenizador', 'tokens-idioma', 'tokens-io', 'tokens-multimodal']));
  await expect(page.locator('.modal h2')).toHaveText('⚖️ Desafío: ¿Cuál pesa más? (1/2)');

  // Round 1 (Spanish vs English): pick English, which is wrong.
  await page.locator('#tk-pair .tok-card').nth(1).click();
  await expect(page.locator('#tk-fb')).toHaveClass(/bad/);
  await expect(page.locator('.tok-count')).toHaveText(['15 tokens', '12 tokens']);
  await expect(page.locator('#hud-coins')).toHaveText('1030');
  await page.locator('.modal footer .btn.primary').click();
  // Round 2 (prose vs JSON) and round 3 (table vs prose): right answers.
  for (const [pick, counts] of [[1, ['10 tokens', '17 tokens']], [0, ['19 tokens', '10 tokens']]]) {
    await page.locator('#tk-pair .tok-card').nth(pick).click();
    await expect(page.locator('#tk-fb')).toHaveClass(/ok/);
    await expect(page.locator('.tok-count')).toHaveText(counts);
    await page.locator('.modal footer .btn.primary').click();
  }

  await expect(page.locator('.modal h2')).toHaveText('🧮 Desafío: Calculá en tokens (2/2)');
  for (const a of [1, 1, 0, 2]) {
    await page.locator('#qz-opts button').nth(a).click();
    await expect(page.locator('#qz-fb')).toHaveClass(/ok/);
    await page.locator('.modal footer .btn.primary').click();
  }
  await expect(page.locator('.modal .stats')).toHaveText('Errores: 1 · ₿c gastados: 10');
  await page.locator('.modal footer .btn.primary').click();
  const s = await state(page);
  expect(s.achievements).toContain('calculadora');
  expect(s.achievements).not.toContain('balanza');
  expect(await objective(page)).toContain('explicale cuánto "pesa" un documento');
}

test.describe('Mission 1', () => {
  let errors;
  test.beforeEach(async ({ page }) => {
    errors = trackErrors(page);
    await loadSave(page, M1_ACTIVE);
  });
  test.afterEach(() => { expect(errors).toEqual([]); });

  test('right estimate for Finance completes the mission with its achievement', async ({ page }) => {
    await playUntilClosing(page);
    const close = await talkTo(page, 'gustavo', [1]);
    expect(close).toContain('> Entre 60.000 y 120.000 tokens de entrada. Más la salida, que se cobra aparte y más cara por token.');
    expect(close.join(' ')).toContain('cuántos tokens tiene el documento de requerimientos del cliente');

    await expect(page.locator('.modal h2')).toHaveText('¡Misión cumplida! La moneda del reino');
    await page.locator('.modal footer .btn', { hasText: 'Plantilla para llevarte' }).click();
    await expect(page.locator('.modal h2')).toHaveText('📋 Calculadora rápida de tokens');
    await expect(page.locator('#tpl-text')).toContainText('40 páginas: entre 60.000 y 120.000 tokens.');
    await page.locator('.modal .x').click();

    const s = await state(page);
    expect(s.achievements).toEqual(expect.arrayContaining(['m1', 'finanzas-feliz']));
    expect(s.coins).toBe(1080);
    expect(s.rep).toBe(2);
    await expect(page.locator('#hud-objective')).toContainText('El pasante sin memoria: 🚧 en construcción');
  });

  test('a wrong estimate is corrected by the player and still completes the mission', async ({ page }) => {
    await playUntilClosing(page);
    const close = await talkTo(page, 'gustavo', [0]);
    expect(close).toContain('> Son 40 tokens: uno por página.');
    expect(close.join(' ')).toContain('Las 40 páginas, entre 60.000 y 120.000 de entrada');
    await page.locator('.modal footer .btn.primary').click();
    const s = await state(page);
    expect(s.quests.m1.status).toBe('done');
    expect(s.achievements).not.toContain('finanzas-feliz');
  });

  test('after Mission 1, side characters point to Mission 2', async ({ page }) => {
    await page.evaluate(() => {
      PD.state.quests.m1 = { status: 'done', done: { gerente: true, tito: true, reto: true, cierre: true } };
      PD.quests.start('m2');
    });
    const bruno = await talkTo(page, 'bruno');
    expect(bruno).toContain('Sistema: 🚧 La Misión 2 "El pasante sin memoria" está en construcción. ¡Pronto en tu oficina!');
    const vale = await talkTo(page, 'vale');
    expect(vale.join(' ')).toContain('No me digas cuánto pesa mi backlog');
    await page.keyboard.press('m');
    await expect(page.locator('.quest-card.active')).toContainText('🚧 En construcción.');
  });
});
