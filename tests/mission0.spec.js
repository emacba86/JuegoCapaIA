// Tutorial and Mission 0 played with the keyboard, once per family.
const { test, expect } = require('@playwright/test');
const { trackErrors, newGame, readDialog, talkTo, state, objective } = require('./helpers');

const EXPECTED = {
  negocio: {
    team: 'con los analistas',
    q1: 'Resumir la minuta de una reunión de relevamiento de una hora.',
    sensible: 'Tareas de texto con revisión humana: minutas, historias de usuario y revisión de documentos.',
    keypoint: 'Buen punto de partida para analistas',
    role: 'Soy analista funcional en una software factory.',
  },
  gestion: {
    team: 'con los equipos de proyecto',
    q1: 'Armar el reporte de estado semanal a partir de las notas de las dailies.',
    sensible: 'Tareas de texto con revisión humana: reportes de estado, minutas de seguimiento y borradores de riesgos.',
    keypoint: 'Buen punto de partida para gestión',
    role: 'Trabajo en gestión (gerencia, project management o project leading) en una software factory.',
  },
  tecnica: {
    team: 'con desarrollo e infraestructura',
    q1: 'Explicarte qué hace una función heredada de 200 líneas sin documentación.',
    sensible: 'Tareas con revisión humana: explicar código heredado, revisar pull requests y escribir documentación.',
    keypoint: 'Buen punto de partida para el área técnica',
    role: 'Trabajo en el área técnica (desarrollo o infraestructura y seguridad) de una software factory.',
  },
  calidad: {
    team: 'con QA y soporte',
    q1: 'Escribir casos de prueba a partir de los criterios de aceptación de una historia.',
    sensible: 'Tareas de texto con revisión humana: casos de prueba, clasificación de tickets e informes de incidentes.',
    keypoint: 'Buen punto de partida para calidad y servicio',
    role: 'Trabajo en calidad y servicio (QA o service assurance) en una software factory.',
  },
  corporativa: {
    team: 'con Recursos Humanos y Administración',
    q1: 'Redactar el borrador de una búsqueda laboral a partir del perfil que te pasó el área.',
    sensible: 'Tareas de texto con revisión humana: borradores de búsquedas, resúmenes de políticas y respuestas a proveedores, sin datos personales.',
    keypoint: 'Buen punto de partida para áreas corporativas',
    role: 'Trabajo en un área corporativa (recursos humanos o administración) de una software factory.',
  },
};
// Correct option of each delegation question (0 = sí, 1 = con ayuda, 2 = no puede saberlo). Same pattern for every family.
const QUIZ_ANSWERS = [0, 1, 0, 2, 0];

for (const [family, exp] of Object.entries(EXPECTED)) {
  test('tutorial and Mission 0 as ' + family, async ({ page }) => {
    const errors = trackErrors(page);
    await newGame(page, { family });
    await readDialog(page);
    await expect(page.locator('#hud-coins')).toHaveText('1000');

    // Tutorial
    await expect(page.locator('#hud-objective')).toHaveText(/Saludá a Rosa/);
    await talkTo(page, 'rosa');
    await expect(page.locator('#hud-objective')).toHaveText(/Revisá tu correo/);
    const mail = await talkTo(page, 'pc');
    expect(mail.join(' ')).toContain('somos una empresa AI-First');
    expect(await objective(page)).toContain('Preguntale a Gustavo');

    // Gustavo asks for a proposal for this family's team.
    const ask = await talkTo(page, 'gustavo', [1]);
    expect(ask.join(' ')).toContain('volvé con una propuesta de por dónde empezar ' + exp.team + '.');
    expect(ask.join(' ')).not.toContain('chapter');

    // Tito explains and opens the challenge.
    await talkTo(page, 'tito', [0, 0]);
    await expect(page.locator('.modal h2')).toHaveText('🧅 Desafío: Las capas de la IA (1/2)');
    // One mistake costs 10 ₿c and explains why.
    await page.locator('#cp-opts button[data-id=llm]').click();
    await expect(page.locator('#cp-fb')).toHaveClass(/bad/);
    await expect(page.locator('#hud-coins')).toHaveText('990');
    for (const [i, id] of ['ia', 'ml', 'dl', 'genai', 'llm'].entries()) {
      await page.locator('#cp-opts button[data-id=' + id + ']').click();
      await expect(page.locator('#cp-prog')).toHaveText(i < 4 ? 'Capa ' + (i + 2) + ' de 5' : '¡Completo!');
    }
    await expect(page.locator('.modal h2')).toHaveText('🤔 Desafío: ¿Se lo delego a un LLM? (2/2)', { timeout: 5000 });

    // Delegation quiz with this family's tasks.
    await expect(page.locator('#qz-q')).toContainText(exp.q1);
    for (const a of QUIZ_ANSWERS) {
      await page.locator('#qz-opts button').nth(a).click();
      await expect(page.locator('#qz-fb')).toHaveClass(/ok/);
      await page.locator('.modal footer .btn.primary').click();
    }
    await expect(page.locator('.modal h2')).toHaveText('✅ Desafío superado');
    await expect(page.locator('.modal .stats')).toHaveText('Errores: 1 · ₿c gastados: 10');
    await page.locator('.modal footer .btn.primary').click();
    expect(await objective(page)).toContain('Volvé con Gustavo');

    // Closing proposal: the sensible option for this family.
    const close = await talkTo(page, 'gustavo', [1]);
    expect(close).toContain('> ' + exp.sensible);
    expect(close.join(' ')).toContain('Armalo con tu equipo.');

    // Mission complete: rewards, keypoint and template for this family.
    await expect(page.locator('.modal h2')).toHaveText('¡Misión cumplida! El mail de Gerencia');
    await expect(page.locator('.modal .keypoints li').nth(2)).toContainText(exp.keypoint);
    await page.locator('.modal footer .btn', { hasText: 'Plantilla para llevarte' }).click();
    await expect(page.locator('.modal h2')).toHaveText('📋 ¿Le sirve la IA a esta tarea?');
    await expect(page.locator('#tpl-text')).toContainText(exp.role);
    await page.locator('.modal .x').click();

    const s = await state(page);
    expect(s.coins).toBe(1040);
    expect(s.rep).toBe(1);
    expect(s.achievements).toEqual(expect.arrayContaining(['primer-dia', 'buen-criterio', 'propuesta-sensata', 'm0']));
    expect(s.achievements).not.toContain('cebolla');
    expect(await objective(page)).toContain('La moneda del reino');
    expect(errors).toEqual([]);
  });
}
