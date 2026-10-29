// Title screen, families, options and saved games.
const { test, expect } = require('@playwright/test');
const { FAMILIES, SAVE_KEY, trackErrors, freshStart, pickFamily, newGame, readDialog, state, loadSave } = require('./helpers');

test.describe('title screen', () => {
  let errors;
  test.beforeEach(async ({ page }) => { errors = trackErrors(page); });
  test.afterEach(() => { expect(errors).toEqual([]); });

  test('lists the five families with Negocio selected by default @mobile', async ({ page }) => {
    await freshStart(page);
    await expect(page.locator('#family-pick input[name=family]')).toHaveCount(5);
    await expect(page.locator('#family-pick input[value=negocio]')).toBeChecked();
    await expect(page.locator('#family-members')).toHaveText('Negocio · Analistas funcionales');
  });

  for (const [id, f] of Object.entries(FAMILIES)) {
    test('selecting ' + f.name + ' shows its members', async ({ page }) => {
      await freshStart(page);
      await pickFamily(page, id);
      await expect(page.locator('#family-members')).toHaveText(f.name + ' · ' + f.members);
    });
  }

  test('a name is required to start', async ({ page }) => {
    await freshStart(page);
    await page.click('#title-form button[type=submit]');
    await expect(page.locator('#title-screen')).toBeVisible();
    expect(await page.evaluate(() => PD.game.mode)).toBe('title');
  });

  test('a new game stores the family and the intro names it @mobile', async ({ page }) => {
    await newGame(page, { family: 'tecnica' });
    const intro = await readDialog(page);
    expect((await state(page)).family).toBe('tecnica');
    expect(intro).toContain('Narrador: Sos Ema, de Técnica (Desarrolladores, Infraestructura y Seguridad). Llegás con el mate en la mano y notás algo raro: todos miran el celular con cara de preocupación.');
    expect(intro.join(' ')).not.toContain('analista funcional');
  });

  test('the area can be changed from Options and is saved', async ({ page }) => {
    await newGame(page, { family: 'gestion' });
    await readDialog(page);
    await page.click('#hud [data-panel=options]');
    await expect(page.locator('#opt-family')).toHaveValue('gestion');
    await page.selectOption('#opt-family', 'corporativa');
    await expect(page.locator('#opt-members')).toHaveText('Recursos Humanos, Administración');
    const saved = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)).family, SAVE_KEY);
    expect(saved).toBe('corporativa');
  });

  test('a game saved before families existed continues as Negocio', async ({ page }) => {
    await loadSave(page, {});
    await page.evaluate((k) => {
      const s = JSON.parse(localStorage.getItem(k));
      delete s.family;
      localStorage.setItem(k, JSON.stringify(s));
    }, SAVE_KEY);
    await page.reload();
    await expect(page.locator('#btn-continue')).toHaveText('Continuar como Ema');
    await page.click('#btn-continue');
    expect(await page.evaluate(() => PD.family.id())).toBe('negocio');
  });
});
